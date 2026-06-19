const STREAM_ENDPOINT = 'https://www.googleapis.com/youtube/v3/liveChat/messages:stream';
const DEFAULT_STREAMING = {
  endpoint: STREAM_ENDPOINT,
  maxResults: 500,
  reconnectDelayMs: 1000
};

const DEFAULT_OPTIONS = {
  mode: 'poll', // or 'stream'
  pollIntervalMs: 4000,
  retry: {
    minDelayMs: 2000,
    maxDelayMs: 60000,
    factor: 2
  },
  logger: null,
  tokenProvider: async () => null,
  chatIdResolver: async () => null,
  fetchImplementation: null,
  abortControllerFactory: null,
  streaming: DEFAULT_STREAMING
};

const STATUS = {
  IDLE: 'idle',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  ERROR: 'error'
};

const EVENTS = {
  STATUS: 'status',
  CHAT: 'chat',
  MEMBERSHIP: 'membership',
  SUPER_CHAT: 'super_chat',
  SUPER_STICKER: 'super_sticker',
  SPONSOR: 'sponsor',
  BAN: 'ban',
  DELETE_MESSAGE: 'delete_message',
  METRIC: 'metric',
  ERROR: 'error',
  DEBUG: 'debug'
};

function cloneOptions(options) {
  const retry = {
    ...DEFAULT_OPTIONS.retry,
    ...(options.retry || {})
  };

  const streaming = {
    ...DEFAULT_STREAMING,
    ...(options.streaming || {})
  };

  return {
    ...DEFAULT_OPTIONS,
    ...options,
    retry,
    streaming
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
        console.error(`YouTube live chat emitter handler for ${event} failed`, err);
      }
    });
  }

  function clear() {
    listeners.clear();
  }

  return { on, off, once, emit, clear };
}

export function createYouTubeLiveChat(options = {}) {
  const opts = cloneOptions(options);
  const emitter = createEmitter();
  const state = {
    status: STATUS.IDLE,
    mode: opts.mode === 'stream' ? 'stream' : 'poll',
    chatId: null,
    token: null,
    pageToken: null,
    pollTimer: null,
    retryTimer: null,
    retryCount: 0,
    lastError: null,
    streamAbortController: null,
    streamReader: null,
    manualStop: false,
    lastStartOptions: {},
    fetchImpl: null
  };

  function logDebug(message, meta) {
    if (!opts.logger) {
      return;
    }
    try {
      opts.logger.debug
        ? opts.logger.debug('[YouTubeLiveChat]', message, meta)
        : opts.logger.log('[YouTubeLiveChat]', message, meta);
    } catch (err) {
      console.warn('YouTube live chat debug logger failed', err);
    }
  }

  function updateStatus(nextStatus, meta = {}) {
    if (state.status === nextStatus && !meta.force) {
      return;
    }
    state.status = nextStatus;
    emitter.emit(EVENTS.STATUS, { status: nextStatus, meta });
  }

  async function start(startOptions = {}) {
    if (state.status === STATUS.RUNNING || state.status === STATUS.STARTING) {
      return;
    }
    logDebug('Attempting to start YouTube live chat', {
      mode: state.mode,
      startOptions: sanitizeStartOptions(startOptions)
    });
    state.manualStop = false;
    state.lastStartOptions = { ...startOptions };
    updateStatus(STATUS.STARTING, { mode: state.mode });
    try {
      await ensureChatId(startOptions);
      await ensureToken(startOptions);
      logDebug('Live chat start prerequisites satisfied', {
        chatId: state.chatId,
        tokenPresent: Boolean(state.token?.accessToken)
      });
      if (state.mode === 'stream') {
        await startStream();
        return;
      }
      const error = new Error('YouTube live chat poll mode not implemented yet.');
      error.code = 'NOT_IMPLEMENTED';
      throw error;
    } catch (err) {
      state.lastError = err;
      updateStatus(STATUS.ERROR, { error: err });
      emitter.emit(EVENTS.ERROR, err);
      stop({ suppressStatus: true });
      updateStatus(STATUS.IDLE);
      throw err;
    }
  }

  function stop(options = {}) {
    state.manualStop = true;
    logDebug('Stopping YouTube live chat client', { suppressStatus: options.suppressStatus });
    cleanupStream();
    if (state.pollTimer) {
      clearTimeout(state.pollTimer);
      state.pollTimer = null;
    }
    if (state.retryTimer) {
      clearTimeout(state.retryTimer);
      state.retryTimer = null;
    }
    state.retryCount = 0;
    state.pageToken = null;
    if (!options.suppressStatus) {
      updateStatus(STATUS.STOPPING);
      updateStatus(STATUS.IDLE);
    }
  }

  function cleanupStream() {
    if (state.streamAbortController) {
      try {
        state.streamAbortController.abort();
      } catch (err) {
        logDebug('Failed to abort stream controller', err);
      }
    }
    state.streamAbortController = null;
    if (state.streamReader) {
      try {
        state.streamReader.releaseLock();
      } catch (error) {
        logDebug('Failed to release stream reader lock', error);
      }
    }
    state.streamReader = null;
  }

  async function ensureChatId(startOptions = {}) {
    if (startOptions.chatId) {
      state.chatId = startOptions.chatId;
      logDebug('Chat ID supplied via start options');
      return;
    }
    if (typeof opts.chatIdResolver === 'function') {
      state.chatId = await opts.chatIdResolver();
      logDebug('Resolved chat ID via resolver', { chatId: state.chatId });
    }
    if (!state.chatId) {
      logDebug('Chat ID unavailable after resolution', {
        startOptions: sanitizeStartOptions(startOptions)
      });
    }
  }

  async function ensureToken(startOptions = {}) {
    const startToken = normalizeToken(startOptions.token);
    if (startToken) {
      state.token = startToken;
      logDebug('Access token supplied via start options');
      return;
    }

    if (state.token && state.token.accessToken && !startOptions.forceRefreshToken) {
      logDebug('Reusing cached access token');
      return;
    }

    if (typeof opts.tokenProvider === 'function') {
      state.token = normalizeToken(await opts.tokenProvider());
      logDebug('Fetched token via provider', {
        tokenPresent: Boolean(state.token?.accessToken)
      });
    }

    if (!state.token || !state.token.accessToken) {
      const error = new Error('YouTube live chat requires an access token.');
      error.code = 'MISSING_ACCESS_TOKEN';
      throw error;
    }
  }

  function resolveFetchImplementation() {
    if (state.fetchImpl) {
      return state.fetchImpl;
    }
    const impl =
      typeof opts.fetchImplementation === 'function'
        ? opts.fetchImplementation
        : typeof fetch === 'function'
        ? fetch.bind(typeof globalThis !== 'undefined' ? globalThis : window)
        : null;
    if (!impl) {
      throw new Error('No fetch implementation available for YouTube live chat streaming.');
    }
    state.fetchImpl = impl;
    return state.fetchImpl;
  }

  function createAbortController() {
    if (typeof opts.abortControllerFactory === 'function') {
      const controller = opts.abortControllerFactory();
      if (controller) {
        return controller;
      }
    }
    if (typeof AbortController !== 'undefined') {
      return new AbortController();
    }
    throw new Error('AbortController is required for YouTube live chat streaming.');
  }

  async function startStream() {
    const fetchImpl = resolveFetchImplementation();
    const controller = createAbortController();
    state.streamAbortController = controller;
    state.retryCount = 0;
    logDebug('Starting streaming loop', {
      endpoint: opts.streaming.endpoint,
      chatId: state.chatId,
      maxResults: opts.streaming.maxResults,
      reconnectDelayMs: opts.streaming.reconnectDelayMs
    });
    updateStatus(STATUS.RUNNING, { mode: 'stream' });
    try {
      await consumeStream(fetchImpl, controller.signal);
      if (!controller.signal.aborted && !state.manualStop) {
        logDebug('Stream ended unexpectedly; scheduling retry');
        scheduleRetry();
      }
    } catch (error) {
      if (controller.signal.aborted || state.manualStop) {
        return;
      }
      handleStreamError(error);
    } finally {
      cleanupStream();
    }
  }

  async function consumeStream(fetchImpl, signal) {
    const params = new URLSearchParams({
      part: 'snippet,authorDetails',
      liveChatId: state.chatId,
      maxResults: String(opts.streaming.maxResults || DEFAULT_STREAMING.maxResults)
    });
    if (state.pageToken) {
      params.set('pageToken', state.pageToken);
    }

    logDebug('Opening YouTube streaming request', {
      endpoint: opts.streaming.endpoint,
      params: Object.fromEntries(params.entries())
    });

    const res = await fetchImpl(`${opts.streaming.endpoint}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${state.token.accessToken}`,
        Accept: 'application/json'
      },
      signal,
      mode: 'cors',
      credentials: 'omit'
    });

    if (res.status === 401) {
      const authError = new Error('YouTube authentication expired. Please reconnect.');
      authError.code = 'TOKEN_EXPIRED';
      throw authError;
    }

    if (!res.ok) {
      let errBody = null;
      try {
        errBody = await res.json();
      } catch (_) {
        errBody = null;
      }
      logDebug('Streaming request failed', {
        status: res.status,
        statusText: res.statusText,
        error: errBody?.error?.message || errBody
      });
      const error = new Error(
        `YouTube live chat stream failed (${res.status} ${res.statusText || ''})`.trim()
      );
      error.status = res.status;
      error.detail = errBody;
      if (errBody?.error?.status) {
        error.code = errBody.error.status;
      } else if (errBody?.error?.errors && errBody.error.errors.length) {
        error.code = errBody.error.errors[0].reason;
      }
      throw error;
    }

    if (!res.body || typeof res.body.getReader !== 'function') {
      logDebug('Streaming response missing readable body');
      throw new Error('Environment does not support streaming responses for YouTube live chat.');
    }

    state.streamReader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (state.status === STATUS.RUNNING && !signal.aborted) {
      const { value, done } = await state.streamReader.read();
      if (done) {
        logDebug('Streaming reader reported completion');
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      buffer = await processStreamBuffer(buffer);
    }

    buffer += decoder.decode();
    await processStreamBuffer(buffer, { flush: true });
    logDebug('Finished consuming YouTube streaming response');
  }

  async function processStreamBuffer(buffer, options = {}) {
    const { flush = false } = options;
    let remainder = buffer;
    let newlineIndex = remainder.indexOf('\n');

    while (newlineIndex !== -1) {
      const chunk = remainder.slice(0, newlineIndex).trim();
      remainder = remainder.slice(newlineIndex + 1);
      if (chunk) {
        await handleStreamChunk(chunk);
      }
      newlineIndex = remainder.indexOf('\n');
    }

    if (flush) {
      const finalChunk = remainder.trim();
      if (finalChunk) {
        await handleStreamChunk(finalChunk);
      }
      return '';
    }

    return remainder;
  }

  async function handleStreamChunk(rawChunk) {
    if (state.status !== STATUS.RUNNING) {
      return;
    }

    let payload = null;
    try {
      payload = JSON.parse(rawChunk);
    } catch (error) {
      logDebug('Failed to parse YouTube streaming chunk', { error, rawChunk });
      return;
    }

    state.pageToken = payload.nextPageToken || null;
    emitter.emit(EVENTS.DEBUG, { type: 'stream_chunk', payload });

    if (Array.isArray(payload.items) && payload.items.length) {
      logDebug('Processed YouTube streaming chunk', {
        itemCount: payload.items.length,
        sampleKeys: Object.keys(payload.items[0] || {}),
        sample: payload.items[0] ? sanitizeChunkPreview(payload.items[0]) : null
      });
      await Promise.all(
        payload.items.map(async (item) => {
          try {
            const normalized = normalizeChatItem(item);
            if (normalized?.raw) {
              emitChat(normalized);
            } else {
              logDebug('Dropping YouTube streaming item without payload', {
                itemId: item?.id,
                reason: 'NO_RAW_MESSAGE'
              });
            }
          } catch (err) {
            logDebug('Failed to process YouTube streaming item', { error: err, itemId: item?.id });
          }
        })
      );
    } else {
      logDebug('YouTube streaming chunk contained no chat items', {
        rawKeys: Object.keys(payload || {}),
        nextPageToken: payload.nextPageToken || null
      });
    }
  }

  function handleStreamError(error) {
    state.lastError = error;
    emitter.emit(EVENTS.ERROR, error);
    updateStatus(STATUS.ERROR, { error });
    if (!state.manualStop) {
      scheduleRetry();
    }
    logDebug('Streaming error occurred', {
      message: error?.message,
      code: error?.code,
      status: error?.status
    });
  }

  function normalizeChatItem(raw) {
    const timestamp = Date.now();
    const unwrapped = unwrapLiveChatMessage(raw);
    const snippet = unwrapped?.snippet || null;
    const author = unwrapped?.authorDetails || null;
    const badges = deriveAuthorBadges(author);
    const superChat = snippet?.superChatDetails || null;

    return {
      raw: unwrapped || raw || null,
      rawChunk: raw,
      snippet,
      author,
      message: snippet?.displayMessage || '',
      badges,
      isMember: Boolean(author?.isChatSponsor),
      isModerator: Boolean(author?.isChatModerator),
      isOwner: Boolean(author?.isChatOwner),
      amountMicros: superChat?.amountMicros ?? null,
      currency: superChat?.currency ?? null,
      timestamp
    };
  }

  function unwrapLiveChatMessage(payload) {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const queue = [payload];
    const visited = new Set();

    const enqueue = (value) => {
      if (!value || (typeof value !== 'object' && !Array.isArray(value))) {
        return;
      }
      if (visited.has(value)) {
        return;
      }
      queue.push(value);
    };

    while (queue.length) {
      const current = queue.shift();
      if (!current || (typeof current !== 'object' && !Array.isArray(current))) {
        continue;
      }
      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      if (
        (current.kind && current.kind === 'youtube#liveChatMessage') ||
        (current.snippet && typeof current.snippet === 'object')
      ) {
        return current;
      }

      if (Array.isArray(current)) {
        current.forEach((item) => enqueue(item));
        continue;
      }

      const candidates = [
        current.liveChatMessage,
        current.chatMessage,
        current.chatMessageEvent,
        current.chatMessageCreatedEvent,
        current.message,
        current.resource,
        current.result,
        current.results,
        current.response,
        current.responses,
        current.payload,
        current.event,
        current.body,
        current.value,
        current.entry,
        current.details,
        current.data,
        current.item
      ];

      candidates.forEach((candidate) => enqueue(candidate));

      if (Array.isArray(current.items)) {
        current.items.forEach((item) => enqueue(item));
      }
    }

    return null;
  }

  function sanitizeChunkPreview(value) {
    try {
      if (!value || typeof value !== 'object') {
        return value ?? null;
      }
      const clone = Array.isArray(value) ? value.slice(0, 5) : { ...value };
      if (clone.raw) {
        delete clone.raw;
      }
      if (clone.rawChunk) {
        delete clone.rawChunk;
      }
      return clone;
    } catch (_) {
      return null;
    }
  }

  function sanitizeStartOptions(options) {
    if (!options || typeof options !== 'object') {
      return options ?? null;
    }
    const clone = { ...options };
    if (clone.token) {
      clone.token = redactToken(clone.token);
    }
    return clone;
  }

  function redactToken(token) {
    if (!token) {
      return null;
    }
    if (typeof token === 'string') {
      return `${token.slice(0, 6)}…`;
    }
    if (typeof token === 'object') {
      const clone = { ...token };
      if (clone.accessToken) {
        clone.accessToken = `${clone.accessToken.slice(0, 6)}…`;
      }
      if (clone.access_token) {
        clone.access_token = `${clone.access_token.slice(0, 6)}…`;
      }
      return clone;
    }
    return token;
  }

  function deriveAuthorBadges(author) {
    if (!author) {
      return [];
    }
    const badges = [];
    if (author.isChatOwner) {
      badges.push({ type: 'text', text: '👑' });
    }
    if (author.isChatModerator) {
      badges.push({ type: 'text', text: '🛡️' });
    }
    if (author.isChatSponsor) {
      badges.push({ type: 'text', text: '⭐' });
    }
    return badges;
  }

  function emitChat(chat) {
    emitter.emit(EVENTS.CHAT, chat);
  }

  function getState() {
    return {
      status: state.status,
      chatId: state.chatId,
      mode: state.mode,
       pageToken: state.pageToken,
      retryCount: state.retryCount,
      lastError: state.lastError
    };
  }

  function setMode(nextMode) {
    const normalized = nextMode === 'stream' ? 'stream' : 'poll';
    if (state.mode === normalized) {
      return;
    }
    state.mode = normalized;
    emitter.emit(EVENTS.DEBUG, { type: 'mode_changed', mode: normalized });
  }

  function scheduleRetry(options = {}) {
    if (state.manualStop) {
      logDebug('Retry skipped because client stopped manually');
      return;
    }
    if (state.retryTimer) {
      return;
    }
    const immediateDelay = options.immediate ? opts.streaming.reconnectDelayMs : null;
    const attempt = options.reset ? 1 : state.retryCount + 1;
    const { minDelayMs, maxDelayMs, factor } = opts.retry;
    const exponentialDelay = Math.min(maxDelayMs, minDelayMs * factor ** (attempt - 1));
    const delay = immediateDelay ?? exponentialDelay;
    state.retryCount = attempt;
    logDebug('Scheduling live chat retry', { attempt, delay });
    state.retryTimer = setTimeout(() => {
      state.retryTimer = null;
      if (state.manualStop) {
        logDebug('Retry canceled because client stopped manually', { attempt });
        return;
      }
      if (state.status === STATUS.STARTING) {
        logDebug('Retry skipped because stream is already starting', { attempt });
        return;
      }
      if (state.status === STATUS.RUNNING && (state.streamAbortController || state.streamReader)) {
        logDebug('Retry skipped because stream is already active', { attempt, status: state.status });
        return;
      }
      if (state.status !== STATUS.IDLE) {
        updateStatus(STATUS.IDLE, { mode: state.mode, attempt, retry: true, force: true });
      }
      start(state.lastStartOptions || {}).catch((err) => {
        logDebug('Retry failed', err);
        handleStreamError(err);
      });
    }, delay);
  }

  function normalizeToken(token) {
    if (!token) {
      return null;
    }
    if (typeof token === 'string') {
      return { accessToken: token };
    }
    if (typeof token === 'object') {
      const normalized = { ...token };
      if (!normalized.accessToken && typeof normalized.access_token === 'string') {
        normalized.accessToken = normalized.access_token;
      }
      if (typeof normalized.accessToken === 'string' && normalized.accessToken.length) {
        return normalized;
      }
    }
    return null;
  }

  return {
    start,
    stop,
    on: emitter.on,
    off: emitter.off,
    once: emitter.once,
    scheduleRetry,
    emitChat,
    normalizeChatItem,
    updateStatus,
    setMode,
    getState,
    EVENTS,
    STATUS
  };
}

export const YOUTUBE_LIVE_CHAT_EVENTS = Object.freeze({ ...EVENTS });
export const YOUTUBE_LIVE_CHAT_STATUS = Object.freeze({ ...STATUS });
