const DEFAULT_RECONNECT = {
  minDelayMs: 1000,
  maxDelayMs: 30000,
  factor: 2,
  maxAttempts: Infinity
};

function defaultSanitize(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof document === 'undefined') {
    return String(value);
  }
  const div = document.createElement('div');
  div.textContent = `${value}`;
  return div.innerHTML;
}

function defaultAvatarUrl(username) {
  if (!username) {
    return '';
  }
  return `https://api.socialstream.ninja/twitch/large?username=${encodeURIComponent(username)}`;
}

const DEFAULT_FORMATTERS = {
  sanitize: defaultSanitize,
  avatarUrl: defaultAvatarUrl,
  now: () => Date.now()
};

const DEFAULT_OPTIONS = {
  channel: null,
  identity: null,
  tokenProvider: async () => null,
  clientFactory: null,
  reconnect: DEFAULT_RECONNECT,
  logger: console,
  formatters: DEFAULT_FORMATTERS
};

const STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

const EVENTS = {
  STATUS: 'status',
  MESSAGE: 'message',
  NOTICE: 'notice',
  MEMBERSHIP: 'membership',
  RAID: 'raid',
  CLEAR_CHAT: 'clear_chat',
  WHISPER: 'whisper',
  ERROR: 'error',
  DEBUG: 'debug'
};

function cloneOptions(options) {
  const reconnect = {
    ...DEFAULT_RECONNECT,
    ...(options.reconnect || {})
  };

  const formatters = {
    ...DEFAULT_FORMATTERS,
    ...(options.formatters || {})
  };

  return {
    ...DEFAULT_OPTIONS,
    ...options,
    reconnect,
    formatters
  };
}

function createEmitter() {
  const listeners = new Map();

  function on(event, handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('Handler must be a function.');
    }
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event).add(handler);
    return () => off(event, handler);
  }

  function off(event, handler) {
    const set = listeners.get(event);
    if (!set) return;
    set.delete(handler);
    if (!set.size) {
      listeners.delete(event);
    }
  }

  function once(event, handler) {
    const wrapped = (...args) => {
      off(event, wrapped);
      handler(...args);
    };
    return on(event, wrapped);
  }

  function emit(event, payload) {
    const set = listeners.get(event);
    if (!set) return;
    [...set].forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`Twitch chat emitter handler for ${event} failed`, err);
      }
    });
  }

  function clear() {
    listeners.clear();
  }

  return { on, off, once, emit, clear };
}

export function normalizeTwitchChannel(value) {
  if (!value) {
    return null;
  }
  return String(value).trim().replace(/^@+|^#+/, '').toLowerCase();
}

function resolveMessageId(channel, tags, prefix) {
  if (tags?.id) {
    return tags.id;
  }
  const ts = tags?.['tmi-sent-ts'] || Date.now();
  return `${channel || 'twitch'}-${prefix}-${ts}-${Math.random().toString(16).slice(2, 8)}`;
}

function ensureNumber(value, fallback = null) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractBadges(tags) {
  if (!tags) {
    return {};
  }
  const { badges } = tags;
  if (!badges || typeof badges !== 'object') {
    return {};
  }
  return { ...badges };
}

export function createTwitchChatClient(options = {}) {
  const opts = cloneOptions(options);
  const emitter = createEmitter();
  const state = {
    status: STATUS.IDLE,
    channel: normalizeTwitchChannel(opts.channel),
    identity: opts.identity || null,
    token: null,
    reconnectAttempts: 0,
    reconnectTimer: null,
    client: null,
    lastError: null,
    manualDisconnect: false,
    destroyed: false,
    boundHandlers: [],
    clientFactory: typeof opts.clientFactory === 'function' ? opts.clientFactory : null
  };

  const formatters = opts.formatters || DEFAULT_FORMATTERS;

  function logDebug(message, meta) {
    if (!opts.logger) {
      return;
    }
    try {
      const payload = meta && Object.keys(meta).length ? meta : undefined;
      if (typeof opts.logger.debug === 'function') {
        opts.logger.debug('[TwitchChat]', message, payload);
      } else if (typeof opts.logger.log === 'function') {
        opts.logger.log('[TwitchChat]', message, payload);
      }
      emitter.emit(EVENTS.DEBUG, { message, meta });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Twitch chat debug logger failed', err);
    }
  }

  function updateStatus(nextStatus, meta = {}) {
    if (state.status === nextStatus && !meta.force) {
      return;
    }
    state.status = nextStatus;
    emitter.emit(EVENTS.STATUS, { status: nextStatus, meta });
  }

  function clearReconnectTimer() {
    if (state.reconnectTimer) {
      clearTimeout(state.reconnectTimer);
      state.reconnectTimer = null;
    }
  }

  function clearClientBindings() {
    if (!state.client || !state.boundHandlers.length) {
      state.boundHandlers = [];
      return;
    }
    try {
      state.boundHandlers.forEach(({ event, handler }) => {
        if (typeof state.client.removeListener === 'function') {
          state.client.removeListener(event, handler);
        } else if (typeof state.client.off === 'function') {
          state.client.off(event, handler);
        }
      });
    } catch (err) {
      logDebug('Failed clearing client listeners', { error: err?.message || err });
    }
    state.boundHandlers = [];
  }

  function teardownClient() {
    if (state.client) {
      clearClientBindings();
      try {
        if (typeof state.client.removeAllListeners === 'function') {
          state.client.removeAllListeners();
        }
      } catch (err) {
        logDebug('removeAllListeners failed', { error: err?.message || err });
      }
      try {
        if (typeof state.client.disconnect === 'function') {
          state.client.disconnect();
        }
      } catch (err) {
        logDebug('Client disconnect failed', { error: err?.message || err });
      }
    }
    state.client = null;
  }

  function scheduleReconnect() {
    if (state.destroyed || state.manualDisconnect) {
      return;
    }
    if (state.reconnectTimer) {
      return;
    }
    const attempt = state.reconnectAttempts + 1;
    const { factor, minDelayMs, maxDelayMs, maxAttempts } = opts.reconnect;
    if (attempt > maxAttempts) {
      logDebug('Reconnect attempts exhausted.');
      return;
    }
    state.reconnectAttempts = attempt;
    const delay = Math.min(maxDelayMs, minDelayMs * factor ** (attempt - 1));
    logDebug('Scheduling reconnect', { attempt, delay });
    state.reconnectTimer = setTimeout(() => {
      state.reconnectTimer = null;
      connect().catch((err) => {
        logDebug('Reconnect failed', { error: err?.message || err });
        scheduleReconnect();
      });
    }, delay);
  }

  async function resolveAuth(connectOptions = {}) {
    if (connectOptions.credentials) {
      const creds = connectOptions.credentials;
      return {
        token: creds.token || creds.accessToken || connectOptions.token || null,
        identity: creds.identity || connectOptions.identity || null
      };
    }
    if (connectOptions.token) {
      return { token: connectOptions.token, identity: connectOptions.identity || null };
    }
    if (typeof opts.tokenProvider === 'function') {
      const tokenResult = await opts.tokenProvider(connectOptions);
      if (tokenResult && typeof tokenResult === 'object') {
        return {
          token: tokenResult.token || tokenResult.accessToken || null,
          identity: tokenResult.identity || null
        };
      }
      if (typeof tokenResult === 'string') {
        return { token: tokenResult, identity: null };
      }
    }
    return { token: null, identity: connectOptions.identity || null };
  }

  function bind(event, handler) {
    if (!state.client) {
      return;
    }
    if (typeof state.client.on === 'function') {
      state.client.on(event, handler);
      state.boundHandlers.push({ event, handler });
    }
  }

  function normalizeChatMessage(channelName, tags, message, isSelf = false, messageType = null) {
    const twitchLogin = normalizeTwitchChannel(tags?.username || tags?.login);
    const displayName = tags?.['display-name'] || twitchLogin || 'Twitch User';
    const sanitizedMessage = formatters.sanitize(message ?? '');
    const badges = extractBadges(tags);
    const normalizedType = messageType || tags?.['message-type'] || null;
    const event = tags?.bits
      ? 'bits'
      : normalizedType === 'action'
        ? 'action'
        : normalizedType || 'message';

    return {
      id: resolveMessageId(channelName, tags, event),
      platform: 'twitch',
      type: 'twitch',
      chatname: displayName,
      chatmessage: sanitizedMessage,
      chatimg: formatters.avatarUrl(twitchLogin || displayName),
      timestamp: Number(tags?.['tmi-sent-ts'] || formatters.now()),
      badges,
      hasDonation: Boolean(tags?.bits),
      bits: ensureNumber(tags?.bits, 0),
      isModerator: tags?.mod === true || tags?.mod === '1' || Boolean(badges?.moderator),
      isOwner: Boolean(badges?.broadcaster),
      isSubscriber: Boolean(badges?.subscriber),
      userId: tags?.['user-id'] || null,
      event,
      isSelf: Boolean(isSelf),
      rawMessage: typeof message === 'string' ? message : '',
      raw: { channel: channelName, tags }
    };
  }

  function normalizeSubscription(channelName, username, methods, message, userstate, eventType) {
    const twitchLogin = normalizeTwitchChannel(
      username || userstate?.username || userstate?.login || null
    );
    const displayName = userstate?.['display-name'] || twitchLogin || username || 'Subscriber';
    const fallback = `${displayName} subscribed!`;
    const sanitizedMessage = formatters.sanitize(message ?? fallback);
    const cumulative = ensureNumber(
      userstate?.['msg-param-cumulative-months'] || userstate?.['msg-param-months'],
      null
    );
    return {
      id: resolveMessageId(channelName, userstate, eventType || 'subscription'),
      platform: 'twitch',
      type: 'twitch',
      chatname: displayName,
      chatmessage: sanitizedMessage,
      chatimg: formatters.avatarUrl(twitchLogin || displayName),
      timestamp: Number(userstate?.['tmi-sent-ts'] || formatters.now()),
      hasDonation: false,
      event: eventType || 'subscription',
      months: cumulative,
      methods: methods || null,
      raw: { channel: channelName, userstate, message }
    };
  }

  function normalizeGift(channelName, recipient, userstate, anonymous) {
    const gifter = anonymous
      ? 'Anonymous'
      : userstate?.['display-name'] || userstate?.username || 'Viewer';
    const gifterLogin = anonymous
      ? null
      : normalizeTwitchChannel(userstate?.username || userstate?.login || gifter);
    const summary = `${gifter} gifted a sub to ${recipient}!`;
    return {
      id: resolveMessageId(channelName, userstate, 'subgift'),
      platform: 'twitch',
      type: 'twitch',
      chatname: gifter,
      chatmessage: formatters.sanitize(summary),
      chatimg: anonymous ? '' : formatters.avatarUrl(gifterLogin || gifter),
      timestamp: Number(userstate?.['tmi-sent-ts'] || formatters.now()),
      event: 'subgift',
      hasDonation: true,
      raw: { channel: channelName, recipient, userstate }
    };
  }

  function normalizeRaid(channelName, username, viewers) {
    const summary = `${username} is raiding with ${viewers} viewers!`;
    const login = normalizeTwitchChannel(username);
    return {
      id: `${channelName || 'twitch'}-raid-${formatters.now()}`,
      platform: 'twitch',
      type: 'twitch',
      chatname: username,
      chatmessage: formatters.sanitize(summary),
      chatimg: formatters.avatarUrl(login || username),
      timestamp: formatters.now(),
      event: 'raid',
      hasDonation: false,
      viewers: ensureNumber(viewers, null),
      raw: { channel: channelName, username, viewers }
    };
  }

  function normalizeHost(channelName, username, viewers) {
    const summary = `${username} is hosting with ${viewers} viewers!`;
    const login = normalizeTwitchChannel(username);
    return {
      id: `${channelName || 'twitch'}-host-${formatters.now()}`,
      platform: 'twitch',
      type: 'twitch',
      chatname: username,
      chatmessage: formatters.sanitize(summary),
      chatimg: formatters.avatarUrl(login || username),
      timestamp: formatters.now(),
      event: 'host',
      hasDonation: false,
      viewers: ensureNumber(viewers, null),
      raw: { channel: channelName, username, viewers }
    };
  }

  function normalizeCheer(channelName, userstate, message) {
    const login = normalizeTwitchChannel(userstate?.username || userstate?.login);
    const displayName = userstate?.['display-name'] || login || 'Anonymous';
    const sanitizedMessage = formatters.sanitize(message ?? '');
    return {
      id: resolveMessageId(channelName, userstate, 'cheer'),
      platform: 'twitch',
      type: 'twitch',
      chatname: displayName,
      chatmessage: sanitizedMessage,
      chatimg: login ? formatters.avatarUrl(login) : formatters.avatarUrl(displayName),
      timestamp: Number(userstate?.['tmi-sent-ts'] || formatters.now()),
      hasDonation: true,
      bits: ensureNumber(userstate?.bits, 0),
      event: 'cheer',
      rawMessage: typeof message === 'string' ? message : '',
      raw: { channel: channelName, userstate, message }
    };
  }

  function normalizeNotice(channelName, msgid, message) {
    return {
      channel: channelName,
      message,
      msgid,
      timestamp: formatters.now()
    };
  }

  function normalizeClearChat(channelName, user, duration) {
    return {
      channel: channelName,
      user,
      duration: ensureNumber(duration, null),
      timestamp: formatters.now()
    };
  }

  function normalizeWhisper(from, tags, message) {
    const displayName = tags?.['display-name'] || from || 'Whisper';
    return {
      from: displayName,
      message: formatters.sanitize(message ?? ''),
      tags,
      timestamp: formatters.now()
    };
  }

  function attachClientEventHandlers(channelName) {
    if (!state.client) {
      return;
    }

    bind('connected', (address, port) => {
      logDebug('Twitch socket connected', { address, port, channel: channelName });
      state.reconnectAttempts = 0;
      state.manualDisconnect = false;
      updateStatus(STATUS.CONNECTED, { address, port, channel: channelName });
    });

    bind('connecting', (address, port) => {
      logDebug('Twitch client connecting', { address, port, channel: channelName });
      updateStatus(STATUS.CONNECTING, { address, port, channel: channelName, force: true });
    });

    bind('disconnected', (reason) => {
      logDebug('Twitch socket disconnected', { reason });
      updateStatus(STATUS.DISCONNECTED, { reason });
      teardownClient();
      if (!state.manualDisconnect) {
        scheduleReconnect();
      }
    });

    bind('reconnect', () => {
      logDebug('Twitch attempting reconnect');
      updateStatus(STATUS.CONNECTING, { reason: 'reconnect', force: true });
    });

    const processChatEvent = (chan, tags, message, self, fallbackType = null) => {
      const normalized = normalizeChatMessage(channelName, tags, message, self, fallbackType);
      emitter.emit(EVENTS.MESSAGE, normalized);
    };

    bind('chat', (chan, tags, message, self) => {
      processChatEvent(chan, tags, message, self, 'chat');
    });

    bind('action', (chan, tags, message, self) => {
      processChatEvent(chan, tags, message, self, 'action');
    });

    bind('message', (chan, tags, message, self) => {
      const type = tags?.['message-type'];
      if (type === 'whisper') {
        emitter.emit(EVENTS.WHISPER, normalizeWhisper(tags?.username || chan, tags, message));
        return;
      }
      if (type === 'chat' || type === 'action') {
        return;
      }
      processChatEvent(chan, tags, message, self, type || 'message');
    });

    bind('notice', (channel, msgid, message) => {
      emitter.emit(EVENTS.NOTICE, normalizeNotice(channel || channelName, msgid, message));
    });

    bind('clearchat', (channel, user, duration) => {
      emitter.emit(EVENTS.CLEAR_CHAT, normalizeClearChat(channel || channelName, user, duration));
    });

    bind('subscription', (chan, username, method, message, userstate) => {
      emitter.emit(
        EVENTS.MEMBERSHIP,
        normalizeSubscription(channelName, username, method, message, userstate, 'subscription')
      );
    });

    bind('resub', (chan, username, months, message, userstate, methods) => {
      emitter.emit(
        EVENTS.MEMBERSHIP,
        normalizeSubscription(channelName, username, methods, message, userstate, 'resub')
      );
    });

    bind('subgift', (chan, recipient, method, userstate) => {
      emitter.emit(EVENTS.MEMBERSHIP, normalizeGift(channelName, recipient, userstate, false));
    });

    bind('anonsubgift', (chan, recipient, method, userstate) => {
      emitter.emit(EVENTS.MEMBERSHIP, normalizeGift(channelName, recipient, userstate, true));
    });

    bind('raided', (chan, username, viewers) => {
      emitter.emit(EVENTS.RAID, normalizeRaid(channelName, username, viewers));
    });

    bind('cheer', (chan, userstate, message) => {
      emitter.emit(EVENTS.MEMBERSHIP, normalizeCheer(channelName, userstate, message));
    });

    bind('hosted', (chan, username, viewers) => {
      emitter.emit(EVENTS.RAID, normalizeHost(channelName, username, viewers));
    });

    bind('error', (err) => {
      state.lastError = err;
      logDebug('Twitch client error', { error: err?.message || err });
      emitter.emit(EVENTS.ERROR, err);
    });
  }

  async function connect(connectOptions = {}) {
    if (state.destroyed) {
      const error = new Error('Twitch chat client destroyed.');
      error.code = 'DESTROYED';
      throw error;
    }
    if (state.status === STATUS.CONNECTED || state.status === STATUS.CONNECTING) {
      return state.client;
    }
    clearReconnectTimer();
    state.manualDisconnect = Boolean(connectOptions.manual === true);
    updateStatus(STATUS.CONNECTING);

    const channel = normalizeTwitchChannel(connectOptions.channel || state.channel);
    if (!channel) {
      const error = new Error('Twitch channel is required.');
      error.code = 'CHANNEL_REQUIRED';
      updateStatus(STATUS.ERROR, { error, force: true });
      throw error;
    }
    state.channel = channel;

    try {
      const { token, identity } = await resolveAuth(connectOptions);
      state.token = token || null;
      state.identity = identity || null;

      let factory = null;
      if (typeof connectOptions.clientFactory === 'function') {
        state.clientFactory = connectOptions.clientFactory;
        factory = connectOptions.clientFactory;
      } else if (state.clientFactory) {
        factory = state.clientFactory;
      } else if (typeof opts.clientFactory === 'function') {
        factory = opts.clientFactory;
      }

      if (typeof factory !== 'function') {
        const error = new Error('Twitch clientFactory is required.');
        error.code = 'MISSING_CLIENT_FACTORY';
        throw error;
      }
      // Persist resolved factory for future reconnect attempts.
      if (!state.clientFactory) {
        state.clientFactory = factory;
      }
      if (typeof opts.clientFactory !== 'function') {
        opts.clientFactory = factory;
      }

      const client = await factory({
        channel,
        token: state.token,
        identity: state.identity,
        options: connectOptions
      });

      if (!client || typeof client.connect !== 'function') {
        const error = new Error('clientFactory must return a tmi.js client with connect().');
        error.code = 'INVALID_CLIENT';
        throw error;
      }

      state.client = client;
      state.boundHandlers = [];
      attachClientEventHandlers(channel);
      const result = await client.connect();

      state.reconnectAttempts = 0;
      state.manualDisconnect = false;
      updateStatus(STATUS.CONNECTED, { channel, identity: state.identity });
      return result;
    } catch (err) {
      state.lastError = err;
      updateStatus(STATUS.ERROR, { error: err, force: true });
      emitter.emit(EVENTS.ERROR, err);
      teardownClient();
      scheduleReconnect();
      throw err;
    }
  }

  function disconnect(options = {}) {
    state.manualDisconnect = true;
    clearReconnectTimer();
    teardownClient();
    updateStatus(options.error ? STATUS.ERROR : STATUS.DISCONNECTED, {
      error: options.error || null
    });
  }

  function destroy() {
    state.destroyed = true;
    disconnect();
    emitter.clear();
    state.status = STATUS.IDLE;
    state.token = null;
    state.identity = null;
    state.channel = null;
    state.lastError = null;
    state.boundHandlers = [];
  }

  async function sendMessage(message, targetChannel = null) {
    if (!state.client || typeof state.client.say !== 'function') {
      throw new Error('Twitch client is not connected.');
    }
    const channel = normalizeTwitchChannel(targetChannel || state.channel);
    if (!channel) {
      throw new Error('Channel is required to send a message.');
    }
    return state.client.say(`#${channel}`, message);
  }

  function getState() {
    return {
      status: state.status,
      channel: state.channel,
      identity: state.identity,
      reconnectAttempts: state.reconnectAttempts,
      lastError: state.lastError
    };
  }

  return {
    connect,
    disconnect,
    destroy,
    on: emitter.on,
    off: emitter.off,
    once: emitter.once,
    sendMessage,
    scheduleReconnect,
    updateStatus,
    getState,
    getClient: () => state.client,
    EVENTS,
    STATUS
  };
}

export function createTmiClientFactory(loadTmiLibrary, overrides = {}) {
  if (typeof loadTmiLibrary !== 'function') {
    throw new TypeError('loadTmiLibrary must be a function that resolves tmi.js.');
  }
  const baseOptions = {
    options: { debug: false, skipUpdatingEmotesets: true },
    connection: { secure: true, reconnect: false },
    ...overrides
  };

  return async ({ channel, token, identity }) => {
    const library = await loadTmiLibrary();
    if (!library || typeof library.Client !== 'function') {
      throw new Error('tmi.js client unavailable from loader.');
    }
    const normalizedChannel = normalizeTwitchChannel(channel);
    if (!normalizedChannel) {
      throw new Error('Channel required for tmi.js client creation.');
    }
    const joinChannel = normalizedChannel.startsWith('#') ? normalizedChannel : `#${normalizedChannel}`;
    const identityConfig =
      identity?.login && token
        ? {
            username: identity.login,
            password: `oauth:${token}`
          }
        : undefined;

    const config = {
      ...baseOptions,
      identity: identityConfig,
      channels: [joinChannel]
    };

    return new library.Client(config);
  };
}

export const TWITCH_CHAT_EVENTS = Object.freeze({ ...EVENTS });
export const TWITCH_CHAT_STATUS = Object.freeze({ ...STATUS });
