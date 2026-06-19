import { BasePlugin } from './basePlugin.js';
import { storage } from '../utils/storage.js';
import { randomSessionId, safeHtml, htmlToText } from '../utils/helpers.js';
import { loadScriptSequential } from '../shared/utils/scriptLoader.js';
import { renderTwitchNativeEmotes } from '../shared/utils/twitchEmotes.js';
import {
  createTwitchChatClient,
  createTmiClientFactory,
  TWITCH_CHAT_EVENTS,
  TWITCH_CHAT_STATUS
} from '../providers/twitch/chatClient.js';

const TOKEN_KEY = 'twitch.token';
const CLIENT_ID_KEY = 'twitch.clientId';
const CHANNEL_KEY = 'twitch.channel';
const STATE_KEY = 'twitch.authState';

const DEFAULT_CLIENT_ID = 'sjjsgy1sgzxmy346tdkghbyz4gtx0k';
const TWITCH_SCOPES = [
  'chat:read',
  'chat:edit',
  'bits:read',
  'channel:read:subscriptions',
  'channel:read:redemptions'
];

const TMI_SOURCES = [
  './vendor/tmi.js',
  './vendor/tmi-1.8.5.min.js'
];

let tmiLoaderPromise = null;

export class TwitchPlugin extends BasePlugin {
  constructor(options) {
    super({
      ...options,
      id: 'twitch',
      name: 'Twitch',
      description: 'Authorize with Twitch to pull chat directly via tmi.js and relay new events.'
    });

    this.clientIdInput = null;
    this.channelInput = null;
    this.statusLabel = null;
    this.channelLabel = null;
    this.signOutBtn = null;
    this.authButton = null;

    this.token = storage.get(TOKEN_KEY, null);
    this.identity = null;
    this.client = null;
    this.channelUserId = null;
    this.chatClient = null;
    this.chatClientOffHandlers = [];
  }

  renderPrimary(container) {
    const statusLabel = document.createElement('div');
    statusLabel.className = 'source-card__subtext';
    statusLabel.textContent = '';
    statusLabel.hidden = true;

    const channelStatus = document.createElement('div');
    channelStatus.className = 'source-card__subtext';
    channelStatus.textContent = '';
    channelStatus.hidden = true;

    const controls = document.createElement('div');
    controls.className = 'plugin-actions';

    const authButton = document.createElement('button');
    authButton.type = 'button';
    authButton.className = 'btn';
    authButton.textContent = 'Sign in to Twitch';
    authButton.addEventListener('click', () => this.handleConnect());

    const signOut = document.createElement('button');
    signOut.type = 'button';
    signOut.className = 'btn btn--ghost';
    signOut.textContent = 'Sign out';
    signOut.addEventListener('click', () => this.signOut());
    signOut.disabled = !this.token;

    controls.append(authButton, signOut);

    container.append(statusLabel, channelStatus, controls);
    this.clientIdInput = null;
    this.channelInput = null;
    this.statusLabel = statusLabel;
    this.channelLabel = channelStatus;
    this.signOutBtn = signOut;
    this.authButton = authButton;

    this.refreshStatus();
    return container;
  }

  renderSettings(container) {
    const channelRow = document.createElement('div');
    channelRow.className = 'field';

    const channelLabel = document.createElement('span');
    channelLabel.className = 'field__label';
    channelLabel.textContent = 'Channel (optional)';

    const channelInput = document.createElement('input');
    channelInput.type = 'text';
    channelInput.placeholder = 'Defaults to the authenticated channel';
    channelInput.value = storage.get(CHANNEL_KEY, '');
    channelInput.addEventListener('change', () => {
      storage.set(CHANNEL_KEY, channelInput.value.trim());
      this.refreshStatus();
    });

    channelRow.append(channelLabel, channelInput);
    container.append(channelRow);

    this.channelInput = channelInput;

    return container;
  }

  refreshStatus() {
    if (this.statusLabel) {
      if (this.token && !this.isTokenExpired()) {
        const name = this.identity?.display_name || this.identity?.login;
        this.statusLabel.innerHTML = name ? `Authorized as <strong>${safeHtml(name)}</strong>` : 'Authorized.';
        this.statusLabel.hidden = false;
      } else {
        this.statusLabel.textContent = '';
        this.statusLabel.hidden = true;
      }
    }

    if (this.channelLabel) {
      const channel = this.channelInput?.value.trim();
      if (channel) {
        this.channelLabel.textContent = `Configured channel: ${channel}`;
        this.channelLabel.hidden = false;
      } else {
        this.channelLabel.textContent = '';
        this.channelLabel.hidden = true;
      }
    }

    if (this.signOutBtn) {
      const signedIn = Boolean(this.token) && !this.isTokenExpired();
      this.signOutBtn.disabled = !signedIn;
      this.signOutBtn.hidden = !signedIn;
    }

    if (this.authButton) {
      const needsAuth = !this.isTokenValid();
      this.authButton.hidden = !needsAuth;
      this.authButton.disabled = this.state === 'connecting';
    }
  }

  enable() {
    if (!this.messenger.getSessionId()) {
      throw new Error('Start a session before connecting Twitch.');
    }

    if (this.isTokenValid()) {
      this.connectToChat();
      return;
    }

    this.beginAuth();
  }

  disable() {
    if (this.chatClientOffHandlers?.length) {
      this.chatClientOffHandlers.forEach((off) => {
        try {
          off();
        } catch (err) {
          console.warn('Failed to remove Twitch chat listener', err);
        }
      });
    }
    this.chatClientOffHandlers = [];
    if (this.chatClient) {
      try {
        this.chatClient.destroy();
      } catch (err) {
        console.warn('Twitch chat client destroy failed', err);
      }
    }
    this.chatClient = null;
    this.client = null;
  }

  beginAuth() {
    const storedClientId = (storage.get(CLIENT_ID_KEY, '') || '').trim();
    const clientId = storedClientId || DEFAULT_CLIENT_ID;
    storage.set(CLIENT_ID_KEY, clientId);

    const redirectUri = new URL(window.location.href.split('#')[0]).toString();
    const state = `${this.id}:${randomSessionId()}`;
    storage.set(STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: TWITCH_SCOPES.join(' '),
      state,
      force_verify: 'true'
    });

    window.location.assign(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`);
  }

  handleOAuthCallback(params) {
    const access = params.get('access_token');
    const expires = parseInt(params.get('expires_in'), 10) || 3600;
    const state = params.get('state');

    const storedState = storage.get(STATE_KEY, null);
    if (!storedState || storedState !== state) {
      throw new Error('OAuth state mismatch for Twitch.');
    }
    storage.remove(STATE_KEY);

    const tokenData = {
      accessToken: access,
      tokenType: params.get('token_type') || 'Bearer',
      expiresAt: Date.now() + (expires - 60) * 1000
    };

    storage.set(TOKEN_KEY, tokenData);
    this.token = tokenData;
    this.refreshStatus();

    if (this.messenger.getSessionId()) {
      this.setState('connecting');
      this.log('Authorization successful. Connecting to Twitch chat...');
      this.connectToChat();
    } else {
      this.log('Authorization successful. Start a session and press Connect when ready.');
    }
  }

  isTokenExpired() {
    if (!this.token || !this.token.expiresAt) {
      return true;
    }
    return Date.now() >= this.token.expiresAt;
  }

  isTokenValid() {
    return this.token && !this.isTokenExpired();
  }

  signOut() {
    storage.remove(TOKEN_KEY);
    this.token = null;
    this.identity = null;
    this.refreshStatus();
    if (this.state === 'connected') {
      this.disable();
      this.setState('idle');
    }
  }

  shouldAutoConnect() {
    return super.shouldAutoConnect() && this.isTokenValid();
  }

  async connectToChat() {
    if (!this.messenger.getSessionId()) {
      throw new Error('Start a session before connecting Twitch.');
    }
    try {
      this.debugLog('Validating Twitch token before chat connect');
      await this.validateToken();
      const channelName = this.resolveChannel();
      storage.set(CHANNEL_KEY, channelName);

      this.channelName = channelName;

      await this.resolveChannelUserId(channelName);
      if (this.emotes) {
        const context = this.buildEmoteContext(channelName);
        await this.emotes.prepareChannel(context).catch(() => {});
      }

      const chatClient = this.ensureChatClient();

      this.setState('connecting');

      const clientFactory = createTmiClientFactory(() => ensureTmiClient());
      this.debugLog('Initializing Twitch chat connection', {
        channel: channelName,
        identity: this.identity?.login
      });

      await chatClient.connect({
        channel: channelName,
        credentials: {
          token: this.token.accessToken,
          identity: this.identity
        },
        clientFactory
      });

      this.client = chatClient.getClient();
    } catch (err) {
      this.debugLog('Twitch connectToChat failed', { error: err?.message || err });
      this.reportError(err);
    }
  }

  ensureChatClient() {
    if (!this.chatClient) {
      this.chatClient = createTwitchChatClient({
        logger: this,
        formatters: {
          sanitize: safeHtml,
          avatarUrl
        }
      });
      this.chatClientOffHandlers = [];
    }

    if (!Array.isArray(this.chatClientOffHandlers)) {
      this.chatClientOffHandlers = [];
    }
    if (!this.chatClientOffHandlers.length) {
      const add = (event, handler) => {
        const off = this.chatClient.on(event, handler);
        this.chatClientOffHandlers.push(off);
      };

      add(TWITCH_CHAT_EVENTS.STATUS, (payload) => this.handleChatStatus(payload));
      add(TWITCH_CHAT_EVENTS.MESSAGE, (payload) => {
        this.handleChatMessage(payload).catch((err) => {
          this.debugLog('Failed to handle Twitch chat message', { error: err?.message || err });
        });
      });
      add(TWITCH_CHAT_EVENTS.MEMBERSHIP, (payload) => {
        this.handleChatMembership(payload).catch((err) => {
          this.debugLog('Failed to handle Twitch membership event', { error: err?.message || err });
        });
      });
      add(TWITCH_CHAT_EVENTS.RAID, (payload) => {
        this.handleChatRaid(payload).catch((err) => {
          this.debugLog('Failed to handle Twitch raid/host event', { error: err?.message || err });
        });
      });
      add(TWITCH_CHAT_EVENTS.NOTICE, (payload) => this.handleChatNotice(payload));
      add(TWITCH_CHAT_EVENTS.CLEAR_CHAT, (payload) => this.handleChatClear(payload));
      add(TWITCH_CHAT_EVENTS.WHISPER, (payload) => this.handleChatWhisper(payload));
      add(TWITCH_CHAT_EVENTS.ERROR, (error) => this.handleChatError(error));
    }

    return this.chatClient;
  }

  async validateToken() {
    const res = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: {
        Authorization: `OAuth ${this.token.accessToken}`
      }
    });

    if (!res.ok) {
      this.signOut();
      throw new Error('Twitch token invalid or expired. Please reconnect.');
    }

    const data = await res.json();
    this.identity = {
      login: data.login,
      userId: data.user_id,
      display_name: data.login,
      scopes: data.scopes || []
    };
    this.debugLog('Validated Twitch token response', {
      login: data.login,
      userId: data.user_id,
      scopes: data.scopes
    });

    if (this.statusLabel) {
      this.statusLabel.innerHTML = `Authorized as <strong>${safeHtml(this.identity.login)}</strong>`;
    }
    return this.identity;
  }

  resolveChannel() {
    const inputChannel = this.channelInput?.value.trim();
    const resolved = inputChannel ? sanitizeChannel(inputChannel) : sanitizeChannel(this.identity?.login || '');
    if (!resolved) {
      throw new Error('Unable to determine Twitch channel.');
    }
    return resolved;
  }

  handleChatStatus({ status, meta = {} }) {
    switch (status) {
      case TWITCH_CHAT_STATUS.CONNECTING:
        if (this.state !== 'connecting') {
          this.setState('connecting');
        }
        break;
      case TWITCH_CHAT_STATUS.CONNECTED:
        this.client = this.chatClient?.getClient() || null;
        if (this.state !== 'connected') {
          this.setState('connected');
          this.log('Connected to Twitch chat.', { channel: this.channelName || meta.channel || '' });
        }
        break;
      case TWITCH_CHAT_STATUS.DISCONNECTED:
      case TWITCH_CHAT_STATUS.ERROR:
      case TWITCH_CHAT_STATUS.IDLE:
      default:
        if (status === TWITCH_CHAT_STATUS.DISCONNECTED) {
          this.log('Twitch socket disconnected', { reason: meta?.reason || 'unknown' });
        }
        if (this.state !== 'idle') {
          this.setState('idle');
        }
        this.client = null;
        break;
    }
  }

  async handleChatMessage(payload) {
    if (!payload) {
      return;
    }
    const tags = payload.raw?.tags || {};
    const channel = payload.raw?.channel || this.channelName || storage.get(CHANNEL_KEY, '');
    this.debugLog('Received Twitch chat message', {
      channel,
      messageType: payload.event,
      tags,
      message: payload.rawMessage,
      self: payload.isSelf
    });
    await this.publishWithDecorations(payload, {
      channel,
      overrides: { userId: tags?.['room-id'] || tags?.roomId },
      rawMessage: payload.rawMessage || '',
      silent: true
    });
  }

  async handleChatMembership(payload) {
    if (!payload) {
      return;
    }
    const channel = payload.raw?.channel || this.channelName || storage.get(CHANNEL_KEY, '');
    const userstate = payload.raw?.userstate || {};
    const baseOptions = {
      channel,
      overrides: { userId: userstate?.['room-id'] || userstate?.roomId },
      rawMessage: payload.rawMessage || '',
      silent: false
    };

    switch (payload.event) {
      case 'subscription':
      case 'resub':
        this.debugLog('Received Twitch subscription', {
          channel,
          event: payload.event,
          user: payload.chatname,
          userstate
        });
        await this.publishWithDecorations(payload, {
          ...baseOptions,
          note: payload.event === 'resub' ? 'Twitch resubscription' : 'New Twitch subscription'
        });
        break;
      case 'subgift':
        this.debugLog('Received Twitch gifted sub', {
          channel,
          recipient: payload.raw?.recipient,
          userstate
        });
        await this.publishWithDecorations(payload, {
          ...baseOptions,
          note: payload.chatname === 'Anonymous' ? 'Anonymous gifted sub' : 'Twitch gifted sub'
        });
        break;
      case 'cheer':
        this.debugLog('Received Twitch cheer', {
          channel,
          bits: payload.bits,
          userstate
        });
        await this.publishWithDecorations(payload, {
          ...baseOptions,
          silent: false,
          note: 'Twitch cheer'
        });
        break;
      default:
        this.debugLog('Unhandled Twitch membership event', { event: payload.event });
        break;
    }
  }

  async handleChatRaid(payload) {
    if (!payload) {
      return;
    }
    const channel = payload.raw?.channel || this.channelName || storage.get(CHANNEL_KEY, '');
    const note = payload.event === 'raid' ? 'Incoming raid' : 'New host';
    this.debugLog('Received Twitch raid/host', {
      channel,
      event: payload.event,
      viewers: payload.viewers,
      chatname: payload.chatname
    });
    await this.publishWithDecorations(payload, {
      channel,
      silent: false,
      note
    });
  }

  handleChatNotice(payload) {
    if (!payload) {
      return;
    }
    this.debugLog('Twitch notice event', payload);
  }

  handleChatClear(payload) {
    if (!payload) {
      return;
    }
    this.debugLog('Twitch clear chat event', payload);
  }

  handleChatWhisper(payload) {
    if (!payload) {
      return;
    }
    this.debugLog('Twitch whisper event', payload);
  }

  handleChatError(error) {
    if (!error) {
      return;
    }
    this.debugLog('Twitch chat error', { error: error?.message || error });
    this.reportError(error);
  }

  async publishWithDecorations(payload, { channel, overrides = {}, rawMessage = '', silent = true, note = null } = {}) {
    if (!payload) {
      return;
    }

    if (typeof rawMessage === 'string' && rawMessage.length) {
      payload.previewText = rawMessage;
    } else if (typeof payload.previewText !== 'string' || !payload.previewText.length) {
      payload.previewText = htmlToText(payload.chatmessage || '');
    }

    const context = this.buildEmoteContext(channel, overrides);
    const textOnly = Boolean(payload.textonly);
    const twitchEmotes = payload?.raw?.tags?.emotes || null;
    const nativeEmoteSource =
      typeof rawMessage === 'string' && rawMessage.length
        ? rawMessage
        : typeof payload.rawMessage === 'string' && payload.rawMessage.length
          ? payload.rawMessage
          : '';

    let replyPrefix = '';
    let replySeparator = '';
    if (typeof payload.chatmessage === 'string') {
      const replyMatch = payload.chatmessage.match(/^(<i><small>[\s\S]*?<\/small><\/i>)([\s\S]*)/i);
      if (replyMatch) {
        replyPrefix = replyMatch[1];
        const remainder = replyMatch[2] || '';
        const separatorMatch = remainder.match(/^((?:&nbsp;|\s)+)/);
        replySeparator = separatorMatch ? separatorMatch[1] : ' ';
      }
    }

    if (!textOnly && twitchEmotes && nativeEmoteSource && typeof renderTwitchNativeEmotes === 'function') {
      try {
        const renderedNativeMessage = renderTwitchNativeEmotes(nativeEmoteSource, twitchEmotes, {
          textOnly,
          escapeHtml: safeHtml,
          imageClassName: 'native-emote',
          imageAttributes: { loading: 'lazy', decoding: 'async' },
          textIsSafe: false
        });
        if (replyPrefix) {
          payload.chatmessage = `${replyPrefix}${replySeparator || ' '}${renderedNativeMessage}`;
        } else {
          payload.chatmessage = renderedNativeMessage;
        }
      } catch (err) {
        this.debugLog('Failed to render native Twitch emotes', { error: err?.message || err });
      }
    } else if (!payload.chatmessage && rawMessage) {
      payload.chatmessage = safeHtml(rawMessage);
    }

    if (this.emotes && payload.chatmessage && !textOnly) {
      try {
        payload.chatmessage = await this.emotes.render(payload.chatmessage, context);
      } catch (err) {
        this.debugLog('Failed to render Twitch emotes', { error: err?.message || err });
      }
    }

    const options = { silent };
    if (note) {
      options.note = note;
    }
    options.preview = this.formatChatPreview(payload);
    this.publish(payload, options);
  }

  buildEmoteContext(channel, overrides = {}) {
    const context = {
      platform: 'twitch'
    };
    const normalizedChannel = channel ? sanitizeChannel(channel) : (this.channelName ? sanitizeChannel(this.channelName) : '');
    if (normalizedChannel) {
      context.channelName = normalizedChannel;
    }

    const overrideId = overrides?.userId || overrides?.channelId;
    if (overrideId) {
      this.channelUserId = String(overrideId);
    }

    if (!this.channelUserId && this.identity?.userId && normalizedChannel && sanitizeChannel(this.identity.login) === normalizedChannel) {
      this.channelUserId = String(this.identity.userId);
    }

    if (this.channelUserId) {
      context.userId = String(this.channelUserId);
      context.channelId = String(this.channelUserId);
    }

    return context;
  }

  async resolveChannelUserId(channelName) {
    const normalized = sanitizeChannel(channelName || '');
    if (!normalized) {
      return null;
    }
    if (this.channelUserId) {
      return this.channelUserId;
    }
    if (this.identity?.userId && sanitizeChannel(this.identity.login || '') === normalized) {
      this.channelUserId = String(this.identity.userId);
      return this.channelUserId;
    }
    try {
      const fetched = await this.fetchTwitchUserId(normalized);
      if (fetched) {
        this.channelUserId = String(fetched);
        return this.channelUserId;
      }
    } catch (err) {
      this.debugLog('Twitch user ID lookup failed', { error: err?.message || err });
    }
    return null;
  }

  async fetchTwitchUserId(username) {
    if (!username) {
      return null;
    }
    const url = `https://api.socialstream.ninja/twitch/user?username=${encodeURIComponent(username)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lookup failed (${response.status})`);
    }
    const data = await response.json().catch(() => null);
    const id = data && data.data && data.data[0] && data.data[0].id ? data.data[0].id : null;
    return id ? String(id) : null;
  }

  formatChatPreview(chat) {
    if (!chat) {
      return 'New Twitch message';
    }

    const name = chat.chatname || 'Twitch user';
    const baseText = (chat.previewText ?? chat.chatmessage ?? '').toString();
    const trimmed = htmlToText(baseText)
      .replace(/\s+/g, ' ')
      .trim();

    if (chat.event === 'bits' && chat.bits) {
      const bits = Number.isFinite(chat.bits) ? chat.bits : parseInt(chat.bits, 10);
      const bitLabel = Number.isFinite(bits) ? `${bits} bit${bits === 1 ? '' : 's'}` : 'bits';
      return trimmed ? `${name} cheered ${bitLabel}: ${trimmed}` : `${name} cheered ${bitLabel}`;
    }

    if (chat.event && chat.event !== 'message' && !trimmed) {
      return `${name} ${chat.event}`;
    }

    return trimmed ? `${name}: ${trimmed}` : name;
  }

}

async function ensureTmiClient() {
  if (window.tmi?.Client) {
    return window.tmi;
  }

  if (!tmiLoaderPromise) {
    tmiLoaderPromise = (async () => {
      await loadScriptSequential(TMI_SOURCES, { timeout: 20000 });
      return window.tmi;
    })();
  }

  const library = await tmiLoaderPromise;
  if (!library || !library.Client) {
    throw new Error('tmi.js loaded but Twitch client is unavailable.');
  }
  return library;
}

function sanitizeChannel(value) {
  return value.replace(/^#+/, '').trim().toLowerCase();
}

function avatarUrl(username) {
  if (!username) return '';
  return `https://api.socialstream.ninja/twitch/large?username=${encodeURIComponent(username)}`;
}
