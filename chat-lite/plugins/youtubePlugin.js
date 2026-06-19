
import { BasePlugin } from './basePlugin.js';
import { storage } from '../utils/storage.js';
import { randomSessionId, safeHtml, htmlToText } from '../utils/helpers.js';
import { normalizeYouTubeLiveChatItem } from '../providers/youtube/messageNormalizer.js';

const TOKEN_KEY = 'youtube.token';
const CLIENT_ID_KEY = 'youtube.clientId';
const CHAT_ID_KEY = 'youtube.chatId';
const CHAT_ID_SOURCE_KEY = 'youtube.chatIdSource';
const CHANNEL_KEY = 'youtube.channel';
const STATE_KEY = 'youtube.authState';
const REDIRECT_KEY = 'youtube.redirectUri';

const DEFAULT_CLIENT_ID = '689627108309-isbjas8fmbc7sucmbm7gkqjapk7btbsi.apps.googleusercontent.com';
const SUBSCRIBER_CACHE_KEY = 'youtube.subscriberCache';
const SUBSCRIBER_CACHE_LIMIT = 200;
const SUBSCRIBER_POLL_INTERVAL = 120000;
const CAPTURE_EVENTS_KEY = 'settings.captureevents';

const AUTH_BASE_URL = 'https://ytauth.socialstream.ninja';

const YT_SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
];


export class YoutubePlugin extends BasePlugin {
  constructor(options) {
    const { useStreaming = false, onStreamingPreferenceChange = null } = options || {};


    super({
      ...options,
      id: 'youtube',
      name: 'YouTube',
      description: 'Connect directly to YouTube live chat using OAuth and forward messages to overlays.'
    });

    this.clientIdInput = null;
    this.chatIdInput = null;
    this.statusLabel = null;
    this.streamLabel = null;

    this.signOutBtn = null;
    this.authButton = null;

    this.token = storage.get(TOKEN_KEY, null);
    this.channelInfo = storage.get(CHANNEL_KEY, null);
    this.pollTimer = null;
    this.nextPageToken = null;
    this.pollInterval = 5000;

    const storedChatId = storage.get(CHAT_ID_KEY, '');
    const storedChatIdSource = storage.get(CHAT_ID_SOURCE_KEY, null);
    let ignoredManualChatId = null;

    this.liveChatId = '';
    this.chatIdSource = 'auto';
    this.chatIdIsLegacyManual = false;
    this.skipStoredManualOnce = false;

    if (storedChatIdSource === 'auto' && storedChatId) {
      this.liveChatId = storedChatId;
    } else if (storedChatId && storedChatIdSource === 'manual') {
      ignoredManualChatId = storedChatId;
      storage.remove(CHAT_ID_KEY);
      storage.remove(CHAT_ID_SOURCE_KEY);
    } else if (storedChatId && !storedChatIdSource) {
      ignoredManualChatId = storedChatId;
      storage.remove(CHAT_ID_KEY);
    }

    if (ignoredManualChatId) {
      this.debugLog('Ignored stored manual YouTube chat ID on startup to prioritize active broadcasts.', {
        chatId: ignoredManualChatId
      });
    }
    this.activeBroadcast = null;
    this.streamingToggleInput = null;
    this.useStreaming = Boolean(useStreaming);
    this.onStreamingPreferenceChange = typeof onStreamingPreferenceChange === 'function' ? onStreamingPreferenceChange : null;
    this.recoveringLiveChat = false;

    const cachedSubscribers = storage.get(SUBSCRIBER_CACHE_KEY, null);
    const cachedKeys = Array.isArray(cachedSubscribers?.keys) ? cachedSubscribers.keys.slice(0, SUBSCRIBER_CACHE_LIMIT) : [];
    this.seenSubscriberKeys = new Set(cachedKeys);
    this.lastSubscriberTimestamp = Number(cachedSubscribers?.timestamp) || 0;
    this.subscriberPollTimer = null;
    this.subscriberFeatureUnavailable = false;
    this.subscriberErrorNotified = false;
  }

  renderPrimary(container) {
    const statusWrap = document.createElement('div');
    statusWrap.className = 'plugin-status';

    const statusLabel = document.createElement('div');
    statusLabel.className = 'source-card__subtext';
    statusLabel.textContent = '';
    statusLabel.hidden = true;

    const streamLabel = document.createElement('div');
    streamLabel.className = 'source-card__subtext';
    streamLabel.textContent = '';
    streamLabel.hidden = true;

    const controls = document.createElement('div');
    controls.className = 'plugin-actions';

    const authButton = document.createElement('button');
    authButton.type = 'button';
    authButton.className = 'btn';
    authButton.textContent = 'Sign in to YouTube';
    authButton.addEventListener('click', () => this.handleConnect());

    const signOut = document.createElement('button');
    signOut.type = 'button';
    signOut.className = 'btn btn--ghost';
    signOut.textContent = 'Sign out';
    signOut.addEventListener('click', () => this.signOut());
    signOut.disabled = !this.token;

    controls.append(authButton, signOut);
    statusWrap.append(statusLabel, streamLabel, controls);

    container.append(statusWrap);
    this.clientIdInput = null;
    this.chatIdInput = null;
    this.statusLabel = statusLabel;
    this.streamLabel = streamLabel;
    this.signOutBtn = signOut;
    this.authButton = authButton;

    this.refreshStatus();
    return statusWrap;
  }

  renderSettings(container) {
    const chatRow = document.createElement('div');
    chatRow.className = 'field';

    const chatLabel = document.createElement('span');
    chatLabel.className = 'field__label';
    chatLabel.textContent = 'Live Chat ID or Video ID (optional)';

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = 'e.g., dQw4w9WgXcQ (video ID) or Cg0KC... (chat ID)';
    chatInput.value = this.liveChatId || '';
    chatInput.addEventListener('change', () => {
      const newValue = chatInput.value.trim();
      const oldValue = this.liveChatId;
      this.rememberLiveChatId(newValue, { source: newValue ? 'manual' : 'auto', legacy: false });

      // If connected and the Video/Chat ID changed, reconnect
      if (this.state === 'connected' && newValue !== oldValue) {
        this.log('Video/Chat ID changed. Reconnecting...');
        this.setState('connecting');
        this.disable();
        this.refreshStatus();
        setTimeout(() => {
          this.setupLiveChat();
        }, 500);
      }
    });

    chatRow.append(chatLabel, chatInput);
    container.append(chatRow);

    this.chatIdInput = chatInput;

    const streamingGroup = document.createElement('div');
    streamingGroup.className = 'field field--checkbox-group';

    const streamingToggle = document.createElement('label');
    streamingToggle.className = 'checkbox';

    const streamingInput = document.createElement('input');
    streamingInput.type = 'checkbox';
    streamingInput.addEventListener('change', () => {
      this.setStreamingPreference(streamingInput.checked, { notify: true });
    });

    const streamingLabel = document.createElement('span');
    streamingLabel.textContent = 'Use YouTube streaming API (beta)';

    streamingToggle.append(streamingInput, streamingLabel);
    streamingGroup.append(streamingToggle);
    container.append(streamingGroup);

    this.streamingToggleInput = streamingInput;
    this.applyStreamingPreferenceToControl();

    return container;
  }

  setStreamingPreference(useStreaming, options = {}) {
    const { notify = false } = options || {};
    const nextValue = Boolean(useStreaming);

    if (nextValue === this.useStreaming) {
      this.applyStreamingPreferenceToControl();
      return;
    }

    this.useStreaming = nextValue;
    this.applyStreamingPreferenceToControl();

    if (notify && typeof this.onStreamingPreferenceChange === 'function') {
      this.onStreamingPreferenceChange(nextValue);
    }
  }

  applyStreamingPreferenceToControl() {
    if (this.streamingToggleInput) {
      this.streamingToggleInput.checked = this.useStreaming;
    }
  }

  refreshStatus() {
    if (this.statusLabel) {
      if (this.token && !this.isTokenExpired()) {
        const channelName = this.channelInfo?.title || 'Your channel';
        this.statusLabel.innerHTML = `Authorized as <strong>${safeHtml(channelName)}</strong>`;

        this.statusLabel.hidden = false;
      } else {
        this.statusLabel.textContent = '';
        this.statusLabel.hidden = true;
      }
    }

    if (this.streamLabel) {
      let labelText = '';

      if (this.activeBroadcast) {
        if (this.activeBroadcast.title) {
          labelText = `Active broadcast: ${this.activeBroadcast.title}`;
        } else if (this.activeBroadcast.videoId) {
          labelText = `Video ID: ${this.activeBroadcast.videoId}`;
        }
      }

      if (!labelText && this.state === 'connected' && this.liveChatId) {
        labelText = 'Connected to YouTube live chat';
      }

      if (labelText) {
        this.streamLabel.textContent = labelText;
        this.streamLabel.hidden = false;
      } else {
        this.streamLabel.textContent = '';
        this.streamLabel.hidden = true;
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

  setActiveBroadcast(info) {
    if (!info) {
      this.activeBroadcast = null;
      return;
    }

    const title = info.title ? htmlToText(info.title).trim() : '';
    const videoId = info.videoId || '';
    const liveChatId = info.liveChatId || '';
    const type = info.type || 'custom';

    if (!title && !videoId) {
      this.activeBroadcast = null;
      return;
    }

    this.activeBroadcast = {
      title,
      videoId,
      liveChatId,
      type
    };
  }

  rememberLiveChatId(chatId, options = {}) {
    const { source = 'auto', silent = false, legacy = false } = options || {};
    const normalizedSource = source === 'manual' ? 'manual' : 'auto';
    const value = typeof chatId === 'string' ? chatId.trim() : '';

    this.liveChatId = value;
    this.chatIdSource = normalizedSource;
    this.chatIdIsLegacyManual = normalizedSource === 'manual' && Boolean(legacy);

    if (normalizedSource === 'manual') {
      storage.remove(CHAT_ID_KEY);
      storage.remove(CHAT_ID_SOURCE_KEY);
    } else if (this.liveChatId) {
      storage.set(CHAT_ID_KEY, this.liveChatId);
      storage.set(CHAT_ID_SOURCE_KEY, 'auto');
    } else {
      storage.remove(CHAT_ID_KEY);
      storage.remove(CHAT_ID_SOURCE_KEY);
    }

    if (this.chatIdInput && this.chatIdInput.value !== this.liveChatId) {
      this.chatIdInput.value = this.liveChatId;
    }

    if (!silent) {
      this.refreshStatus();
    }
  }

  clearStoredLiveChatId(options = {}) {
    const { silent = false } = options || {};
    this.rememberLiveChatId('', { source: 'auto', silent: true, legacy: false });
    this.nextPageToken = null;
    this.setActiveBroadcast(null);
    if (!silent) {
      this.refreshStatus();
    }
  }

  beginLiveChatRecovery(options = {}) {
    const { reason = null } = options || {};

    if (this.state === 'idle' || this.state === 'disabled') {
      return false;
    }

    const isManualSource = this.chatIdSource === 'manual';
    const canRecoverManual = isManualSource && this.chatIdIsLegacyManual;

    if (isManualSource && !canRecoverManual) {
      return false;
    }

    if (this.recoveringLiveChat) {
      return true;
    }

    this.recoveringLiveChat = true;

    const detail = {};
    if (this.liveChatId) {
      detail.liveChatId = this.liveChatId;
    }
    if (reason && (reason.reason || reason.message)) {
      detail.reason = reason.reason || reason.message;
    }

    this.log('YouTube live chat appears inactive. Attempting to find a current broadcast...', detail);

    this.stopListening();
    this.stopSubscriberWatcher();
    this.nextPageToken = null;
    this.setActiveBroadcast(null);

    const previousChatState = {
      id: this.liveChatId,
      source: this.chatIdSource,
      legacyManual: this.chatIdIsLegacyManual
    };

    if (canRecoverManual) {
      this.skipStoredManualOnce = true;
    } else {
      this.clearStoredLiveChatId({ silent: true });
    }

    if (this.state !== 'connecting') {
      this.setState('connecting');
    }

    Promise.resolve().then(async () => {
      let restoredPrevious = false;
      try {
        if (this.state === 'idle' || this.state === 'disabled') {
          return;
        }
        if (!this.messenger.getSessionId()) {
          return;
        }
        await this.setupLiveChat();
      } catch (err) {
        if (canRecoverManual && previousChatState.id) {
          this.rememberLiveChatId(previousChatState.id, {
            source: previousChatState.source,
            legacy: previousChatState.legacyManual,
            silent: true
          });
          restoredPrevious = true;
        }
        super.reportError(err);
      } finally {
        if (canRecoverManual && !restoredPrevious && !this.liveChatId && previousChatState.id) {
          this.rememberLiveChatId(previousChatState.id, {
            source: previousChatState.source,
            legacy: previousChatState.legacyManual,
            silent: true
          });
        }
        this.skipStoredManualOnce = false;
        this.recoveringLiveChat = false;
      }
    });

    return true;
  }

  isLiveChatInactiveError(error) {
    if (!error) {
      return false;
    }

    const reason = typeof error.reason === 'string' ? error.reason.toLowerCase() : '';
    const message = typeof error.message === 'string' ? error.message.toLowerCase() : '';
    const status = Number(error.status) || 0;

    if (reason) {
      if (reason.includes('livechatnotfound') || reason.includes('livechatended') || reason.includes('livechatinactive')) {
        return true;
      }
      if (reason.includes('livechatnotavailable') || reason.includes('livechatunavailable')) {
        return true;
      }
    }

    if (message) {
      if (message.includes('live chat is no longer live') || message.includes('live chat has ended')) {
        return true;
      }
      if (message.includes('live chat is not live') || message.includes('live chat ended')) {
        return true;
      }
    }

    if (status === 404) {
      return true;
    }

    return false;
  }

  async isLiveChatIdActive(chatId) {
    if (!chatId) {
      return false;
    }
    if (!this.isTokenValid()) {
      throw new Error('YouTube token expired. Please reconnect.');
    }

    const headers = {
      Authorization: `Bearer ${this.token.accessToken}`,
      Accept: 'application/json'
    };
    const params = new URLSearchParams({
      part: 'id',
      liveChatId: chatId,
      maxResults: '1'
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?${params.toString()}`, { headers });
    if (res.ok) {
      return true;
    }

    const errBody = await res.json().catch(() => ({}));
    const apiErr = this.createApiError(errBody, res.status, 'liveChat.messages');
    if (this.isLiveChatInactiveError(apiErr)) {
      return false;
    }
    throw apiErr;
  }

  enable() {
    if (!this.messenger.getSessionId()) {
      throw new Error('Start a session before connecting YouTube.');
    }

    if (this.isTokenValid()) {
      this.setupLiveChat();
      return;
    }

    this.beginAuth();
  }

  disable() {
    this.stopListening();
    this.nextPageToken = null;
    this.setActiveBroadcast(null);
    this.stopSubscriberWatcher();
  }

  beginAuth() {
    const storedClientId = (storage.get(CLIENT_ID_KEY, '') || '').trim();
    const clientId = storedClientId || DEFAULT_CLIENT_ID;
    storage.set(CLIENT_ID_KEY, clientId);

    const redirectUri = new URL(window.location.href.split('#')[0]).toString();
    const state = `${this.id}:${randomSessionId()}`;
    storage.set(STATE_KEY, state);
    storage.set(REDIRECT_KEY, redirectUri);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: YT_SCOPES.join(' '),
      state
    });

    window.location.assign(`${AUTH_BASE_URL}/auth?${params.toString()}`);
  }

  async handleOAuthCallback(params) {
    if (params.has('code')) {
      await this.completeAuthorizationCodeFlow(params);
      return;
    }

    const access = params.get('access_token');
    if (!access) {
      throw new Error('OAuth response missing authorization code or access token for YouTube.');
    }

    const expires = parseInt(params.get('expires_in'), 10) || 3600;
    const scope = params.get('scope') || '';
    const state = params.get('state');

    const storedState = storage.get(STATE_KEY, null);
    if (!storedState || storedState !== state) {
      throw new Error('OAuth state mismatch for YouTube.');
    }

    storage.remove(STATE_KEY);

    const tokenData = {
      accessToken: access,
      scope,
      tokenType: params.get('token_type') || 'Bearer',
      expiresAt: Date.now() + (expires - 60) * 1000,
      refreshToken: null
    };

    storage.set(TOKEN_KEY, tokenData);
    this.token = tokenData;
    this.refreshSubscriberCapability(tokenData, { force: true });
    this.refreshStatus();

    if (this.messenger.getSessionId()) {
      this.setState('connecting');
      this.log('Authorization successful. Connecting to live chat...');
      this.setupLiveChat();
    } else {
      this.log('Authorization successful. Start a session and press Connect when ready.');
    }
  }

  async completeAuthorizationCodeFlow(params) {
    const code = params.get('code');
    const state = params.get('state');

    if (!code) {
      throw new Error('Missing authorization code from YouTube.');
    }

    const storedState = storage.get(STATE_KEY, null);
    if (!storedState || storedState !== state) {
      storage.remove(STATE_KEY);
      throw new Error('OAuth state mismatch for YouTube.');
    }

    storage.remove(STATE_KEY);

    const storedRedirect = storage.get(REDIRECT_KEY, null);
    storage.remove(REDIRECT_KEY);

    const redirectUrl = storedRedirect || this.buildRedirectUriWithoutOAuthParams();

    let tokenResponse;
    try {
      const res = await fetch(`${AUTH_BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          redirect_uri: redirectUrl
        })
      });
      tokenResponse = await res.json();
      if (!res.ok) {
        const message = tokenResponse?.error_description || tokenResponse?.error || 'YouTube token exchange failed.';
        throw new Error(message);
      }
    } catch (err) {
      throw new Error(err?.message || 'Failed to exchange YouTube authorization code.');
    }

    const expiresIn = parseInt(tokenResponse.expires_in, 10) || 0;
    const refreshToken = tokenResponse.refresh_token || this.token?.refreshToken || null;
    const scope = tokenResponse.scope || YT_SCOPES.join(' ');

    if (!tokenResponse.access_token) {
      throw new Error('YouTube token response missing access token.');
    }

    const tokenData = {
      accessToken: tokenResponse.access_token,
      refreshToken,
      scope,
      tokenType: tokenResponse.token_type || 'Bearer',
      expiresAt: expiresIn ? Date.now() + Math.max((expiresIn - 60) * 1000, 0) : null
    };

    storage.set(TOKEN_KEY, tokenData);
    this.token = tokenData;
    this.refreshSubscriberCapability(tokenData, { force: true });
    this.refreshStatus();

    if (this.messenger.getSessionId()) {
      this.setState('connecting');
      this.log('Authorization successful. Connecting to live chat...');
      this.setupLiveChat();
    } else {
      this.log('Authorization successful. Start a session and press Connect when ready.');
    }
  }

  buildRedirectUriWithoutOAuthParams() {
    try {
      const url = new URL(window.location.href);
      url.hash = '';
      ['code', 'scope', 'state'].forEach((key) => url.searchParams.delete(key));
      return url.toString();
    } catch (err) {
      return window.location.href.split('#')[0].split('?code=')[0];
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
    storage.remove(CHANNEL_KEY);
    this.token = null;
    this.channelInfo = null;
    this.setActiveBroadcast(null);
    if (this.state === 'connected') {
      this.disable();
    }
    this.clearStoredLiveChatId({ silent: true });
    this.stopSubscriberWatcher();
    this.seenSubscriberKeys.clear();
    this.lastSubscriberTimestamp = 0;
    this.subscriberFeatureUnavailable = false;
    this.subscriberErrorNotified = false;
    storage.remove(SUBSCRIBER_CACHE_KEY);
    this.setState('idle');
    this.refreshStatus();
  }

  async setupLiveChat() {
    if (!this.messenger.getSessionId()) {
      throw new Error('Start a session before connecting YouTube.');
    }
    try {
      const resolvedChat = await this.resolveLiveChatId();
      const chatId = typeof resolvedChat === 'object' && resolvedChat !== null ? resolvedChat.id : resolvedChat;
      const chatSource = typeof resolvedChat === 'object' && resolvedChat !== null && resolvedChat.source
        ? resolvedChat.source
        : this.chatIdSource || 'auto';
      const chatLegacy = typeof resolvedChat === 'object' && resolvedChat !== null && Object.prototype.hasOwnProperty.call(resolvedChat, 'legacy')
        ? Boolean(resolvedChat.legacy)
        : false;
      if (!chatId) {
        throw new Error('No active live chat found. Start a broadcast or provide a Live Chat ID.');
      }
      this.rememberLiveChatId(chatId, { source: chatSource, legacy: chatLegacy, silent: true });
      this.setState('connected');
      this.log('Connected to YouTube live chat.', { liveChatId: this.liveChatId });
      await this.prepareEmotesForChannel();
      this.stopListening();
      this.startListening();
      this.startSubscriberWatcher();
    } catch (err) {
      this.reportError(err);
    }
  }

  async getLiveChatIdFromVideoId(videoId) {
    if (!this.isTokenValid()) {
      throw new Error('YouTube token expired. Please reconnect.');
    }

    const headers = {
      Authorization: `Bearer ${this.token.accessToken}`,
      Accept: 'application/json'
    };

    // Fetch video details to get the live chat ID
    const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoId}`, { headers });
    if (!videoRes.ok) {
      const errBody = await videoRes.json().catch(() => ({}));
      throw this.createApiError(errBody, videoRes.status, 'videos');
    }

    const videoData = await videoRes.json();
    if (videoData.items && videoData.items.length > 0) {
      const videoItem = videoData.items[0] || {};
      const liveChatId = videoItem?.liveStreamingDetails?.activeLiveChatId;
      if (liveChatId) {
        this.log(`Resolved video ID ${videoId} to live chat ID: ${liveChatId}`);
        this.setActiveBroadcast({
          title: videoItem?.snippet?.title,
          videoId,
          liveChatId,
          type: 'video'
        });
        return liveChatId;
      }
      const noLiveChatErr = new Error(`Video ${videoId} does not have an active live chat. Make sure the video is currently live.`);
      noLiveChatErr.code = 'VIDEO_HAS_NO_LIVE_CHAT';
      throw noLiveChatErr;
    }

    const notFoundErr = new Error(`Video ${videoId} not found or inaccessible.`);
    notFoundErr.code = 'VIDEO_NOT_FOUND';
    throw notFoundErr;
  }

  async resolveLiveChatId() {
    const bypassStoredManual = this.skipStoredManualOnce;
    if (this.skipStoredManualOnce) {
      this.skipStoredManualOnce = false;
    }

    let manualId = '';
    let manualSource = null;
    let manualLegacy = false;

    if (this.chatIdInput && this.chatIdInput.value.trim()) {
      manualId = this.chatIdInput.value.trim();
      manualSource = 'manual';
      manualLegacy = false;
    } else if ((this.liveChatId && this.liveChatId.trim()) && (!bypassStoredManual || this.chatIdSource !== 'manual')) {
      manualId = this.liveChatId.trim();
      manualSource = this.chatIdSource === 'manual' ? 'manual' : 'auto';
      manualLegacy = this.chatIdIsLegacyManual;
    }

    if (manualId && manualSource === 'auto') {
      try {
        const active = await this.isLiveChatIdActive(manualId);
        if (!active) {
          this.log('Stored YouTube live chat ID is no longer active. Clearing saved value.', { liveChatId: manualId });
          this.clearStoredLiveChatId({ silent: true });
          manualId = '';
          manualSource = null;
        }
      } catch (err) {
        if (this.isLiveChatInactiveError(err)) {
          this.log('Stored YouTube live chat ID is no longer active. Clearing saved value.', { liveChatId: manualId });
          this.clearStoredLiveChatId({ silent: true });
          manualId = '';
          manualSource = null;
        } else {
          throw err;
        }
      }
    }

    if (manualId) {
      if (manualSource === 'manual') {
        const legacyFlag = manualLegacy;
        if (manualId.length === 11) {
          try {
            const liveChatId = await this.getLiveChatIdFromVideoId(manualId);
            return { id: liveChatId, source: 'manual', legacy: legacyFlag };
          } catch (err) {
            const fallbackReasons = new Set(['notFound', 'videoNotFound', 'invalidParameter', 'badRequest', 'idNotFound']);
            if (err?.code === 'VIDEO_NOT_FOUND' || fallbackReasons.has(err?.reason) || err?.status === 404) {
              this.debugLog('Manual ID fallback to live chat ID', { manualId, error: err?.message });
              this.setActiveBroadcast(null);
              return { id: manualId, source: 'manual', legacy: legacyFlag };
            }
            throw err;
          }
        }
        this.setActiveBroadcast(null);
        return { id: manualId, source: 'manual', legacy: legacyFlag };
      }

      if (manualSource === 'auto') {
        if (manualId.length === 11) {
          try {
            const liveChatId = await this.getLiveChatIdFromVideoId(manualId);
            return { id: liveChatId, source: 'auto' };
          } catch (err) {
            const fallbackReasons = new Set(['notFound', 'videoNotFound', 'invalidParameter', 'badRequest', 'idNotFound']);
            if (err?.code === 'VIDEO_NOT_FOUND' || fallbackReasons.has(err?.reason) || err?.status === 404) {
              this.debugLog('Stored video ID fallback to provided ID', { manualId, error: err?.message });
              this.setActiveBroadcast(null);
              return { id: manualId, source: 'auto' };
            }
            throw err;
          }
        }
        this.setActiveBroadcast(null);
        return { id: manualId, source: 'auto' };
      }
    }

    if (!this.isTokenValid()) {
      throw new Error('YouTube token expired. Please reconnect.');
    }

    const headers = {
      Authorization: `Bearer ${this.token.accessToken}`,
      Accept: 'application/json'
    };

    const broadcastRes = await fetch('https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,contentDetails,status&mine=true', { headers });
    if (!broadcastRes.ok) {
      const errBody = await broadcastRes.json().catch(() => ({}));
      throw this.createApiError(errBody, broadcastRes.status, 'liveBroadcasts');
    }
    const broadcastData = await broadcastRes.json();
    if (broadcastData.items && broadcastData.items.length) {
      const activeItems = broadcastData.items.filter(item =>
        item.status?.lifeCycleStatus === 'live' ||
        item.status?.lifeCycleStatus === 'liveStarting'
      );
      if (activeItems.length) {
        const live = activeItems.find(item => item.snippet?.liveChatId) || activeItems[0];
        this.channelInfo = {
          id: live?.snippet?.channelId,
          title: live?.snippet?.channelTitle,
          thumbnail: live?.snippet?.thumbnails?.default?.url
        };
        storage.set(CHANNEL_KEY, this.channelInfo);
        this.setActiveBroadcast({
          title: live?.snippet?.title,
          videoId: live?.id,
          liveChatId: live?.snippet?.liveChatId,
          type: 'broadcast'
        });
        return { id: live?.snippet?.liveChatId || null, source: 'auto' };
      }
    }

    if (broadcastData.items && broadcastData.items.length) {
      const upcomingItems = broadcastData.items.filter(item =>
        item.status?.lifeCycleStatus === 'ready' ||
        item.status?.lifeCycleStatus === 'testing'
      );
      if (upcomingItems.length) {
        this.channelInfo = {
          id: upcomingItems[0]?.snippet?.channelId,
          title: upcomingItems[0]?.snippet?.channelTitle
        };
        storage.set(CHANNEL_KEY, this.channelInfo);
      }
    }

    const upcomingRes = await fetch('https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status&mine=true', { headers });
    if (upcomingRes.ok) {
      const upcomingData = await upcomingRes.json();
      if (upcomingData.items && upcomingData.items.length) {
        this.channelInfo = {
          id: upcomingData.items[0]?.snippet?.channelId,
          title: upcomingData.items[0]?.snippet?.channelTitle
        };
        storage.set(CHANNEL_KEY, this.channelInfo);
      }
    }

    this.setActiveBroadcast(null);
    return { id: null, source: 'auto' };
  }

  startListening() {
    this.pollChat();
  }

  stopListening() {
    if (this.pollTimer) {
      window.clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  async pollChat() {
    if (this.state !== 'connected') {
      return;
    }
    if (!this.isTokenValid()) {
      this.setState('idle');
      this.log('YouTube token expired during polling.');
      return;
    }
    if (!this.liveChatId) {
      this.setState('idle');
      this.log('Live chat ID missing; stopping YouTube polling.');
      return;
    }

    try {
      const params = new URLSearchParams({
        part: 'snippet,authorDetails',
        liveChatId: this.liveChatId,
        maxResults: '200'
      });
      if (this.nextPageToken) {
        params.set('pageToken', this.nextPageToken);
      }

      const res = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
          Accept: 'application/json'
        }
      });

      if (res.status === 401) {
        throw new Error('YouTube authentication expired. Please reconnect.');
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw this.createApiError(err, res.status, 'liveChat.messages');
      }

      const data = await res.json();
      if (this.state !== 'connected') {
        return;
      }
      this.nextPageToken = data.nextPageToken || null;
      this.pollInterval = data.pollingIntervalMillis ? Math.max(data.pollingIntervalMillis, 1200) : this.pollInterval;

      if (Array.isArray(data.items) && data.items.length) {
        await Promise.all(
          data.items.map((item) =>
            this.transformAndPublish(item).catch((err) => {
              this.debugLog('Failed to process YouTube chat item', {
                error: err?.message || err,
                itemId: item?.id
              });
              return null;
            })
          )
        );
      }
    } catch (err) {
      if (this.isLiveChatInactiveError(err) && this.beginLiveChatRecovery({ reason: err })) {
        return;
      }
      this.reportError(err);
      return;
    }

    if (this.state !== 'connected') {
      return;
    }
    this.pollTimer = window.setTimeout(() => this.pollChat(), this.pollInterval);
  }

  reportError(error) {
    if (this.isLiveChatInactiveError(error) && this.beginLiveChatRecovery({ reason: error })) {
      return;
    }
    super.reportError(error);
  }

  createApiError(body, status, endpoint) {
    const errorInfo = body?.error || {};
    const firstError = Array.isArray(errorInfo.errors) ? errorInfo.errors[0] : null;
    const reason = firstError?.reason || errorInfo.status || '';
    const rawMessage = typeof errorInfo.message === 'string' ? errorInfo.message : '';
    const scrubbedMessage = rawMessage.replace(/<[^>]*>/g, '').trim();
    const fallback = endpoint ? `YouTube ${endpoint} error (${status})` : `YouTube API error (${status})`;

    let message = scrubbedMessage || fallback;
    const messageLower = scrubbedMessage.toLowerCase();
    if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded' || messageLower.includes('quota')) {
      message = 'YouTube API quota exhausted. Please wait for the daily quota reset or add your own YouTube API credentials in Settings.';
    }

    const error = new Error(message);
    error.detail = body;
    error.status = status;
    error.reason = reason;
    error.endpoint = endpoint;
    return error;
  }

  async transformAndPublish(item, options = {}) {
    if (!item) {
      return;
    }

    const transport =
      options.transport ||
      (this.useStreaming ? 'youtube_streaming_api' : 'youtube_data_api');

    const { message, note } = normalizeYouTubeLiveChatItem(item, {
      sanitizeHtml: safeHtml,
      toPlainText: htmlToText,
      includeRaw: true,
      transport
    });

    if (this.debug) {
      const debugSnapshot = { ...message };
      if (debugSnapshot.raw) {
        debugSnapshot.raw = '[omitted in debug log]';
      }
      this.debugLog('Prepared YouTube chat payload', debugSnapshot);
    }

    await this.publishWithEmotes(message, { silent: true, note });
  }

  buildChatBadges(author, options = {}) {
    const includeMemberBadge = Boolean(options?.includeMemberBadge);
    const badges = [];

    if (author?.isChatOwner) {
      badges.push({ type: 'text', text: '👑' });
    }
    if (author?.isChatModerator) {
      badges.push({ type: 'text', text: '🛡️' });
    }
    if ((author && author.isChatSponsor) || includeMemberBadge) {
      badges.push({ type: 'text', text: '⭐' });
    }

    return badges;
  }

  deriveMembershipMetadata(snippet, sanitizedMessage) {
    if (!snippet) {
      return null;
    }

    const type = typeof snippet.type === 'string' ? snippet.type.trim().toLowerCase() : '';
    const toPlainText = (value) => htmlToText(value || '').trim();
    const fallbackPreview = () => {
      const fromSnippet = toPlainText(snippet.displayMessage || '');
      if (fromSnippet) {
        return fromSnippet;
      }
      if (sanitizedMessage) {
        const fromSanitized = toPlainText(sanitizedMessage);
        if (fromSanitized) {
          return fromSanitized;
        }
      }
      return '';
    };

    let result = null;

    if (type === 'newsponsorevent') {
      const details = snippet.newSponsorDetails || {};
      const level = toPlainText(details.memberLevelName);
      const isUpgrade = Boolean(details.isUpgrade);
      const membershipLabel = isUpgrade ? 'Membership Upgrade' : 'New Member';
      const subtitle = level || (isUpgrade ? 'Upgraded channel membership' : 'Joined channel membership');

      result = {
        membership: membershipLabel,
        subtitle,
        event: isUpgrade ? 'membership_upgrade' : 'membership',
        note: level ? `${membershipLabel}: ${level}` : membershipLabel,
        includeMemberBadge: true
      };

      if (level) {
        result.membershipLevel = level;
      }
    } else if (type === 'membermilestonechatevent') {
      const details = snippet.memberMilestoneChatDetails || {};
      const level = toPlainText(details.memberLevelName);
      const monthsRaw = Number(details.memberMonth);
      const hasMonths = Number.isFinite(monthsRaw) && monthsRaw > 0;
      const monthLabel = hasMonths ? `${monthsRaw} month${monthsRaw === 1 ? '' : 's'}` : '';
      const subtitleParts = [];
      if (monthLabel) {
        subtitleParts.push(monthLabel);
      }
      if (level) {
        subtitleParts.push(level);
      }

      result = {
        membership: 'Membership Milestone',
        subtitle: subtitleParts.join(' · ') || null,
        event: 'membership_milestone',
        note: subtitleParts.join(' · ') || 'Membership Milestone',
        includeMemberBadge: true
      };

      if (hasMonths) {
        result.membershipMonths = monthsRaw;
      }
      if (level) {
        result.membershipLevel = level;
      }
    } else if (type === 'membershipgiftingevent' || snippet.membershipGiftingDetails) {
      const details = snippet.membershipGiftingDetails || {};
      const level = toPlainText(details.giftMembershipsLevelName);
      const countRaw = Number(details.giftMembershipsCount);
      const count = Number.isFinite(countRaw) && countRaw > 0 ? countRaw : 1;
      const membershipLabel = count === 1 ? 'Gifted a Membership' : `Gifted ${count} Memberships`;

      result = {
        membership: membershipLabel,
        subtitle: level || null,
        event: 'membership_gift',
        note: level ? `${membershipLabel} (${level})` : membershipLabel,
        includeMemberBadge: true,
        membershipGiftCount: count
      };

      if (level) {
        result.membershipLevel = level;
      }
    } else if (type === 'giftmembershipreceivedevent' || snippet.giftMembershipReceivedDetails) {
      const details = snippet.giftMembershipReceivedDetails || {};
      const level = toPlainText(details.memberLevelName);
      const gifter = toPlainText(details.gifterDisplayName);
      const subtitleParts = [];
      if (level) {
        subtitleParts.push(level);
      }
      if (gifter) {
        subtitleParts.push(`From ${gifter}`);
      }

      result = {
        membership: 'Gift Membership',
        subtitle: subtitleParts.join(' · ') || null,
        event: 'membership_gift_received',
        note: subtitleParts.join(' · ') || 'Gift Membership',
        includeMemberBadge: true
      };

      if (level) {
        result.membershipLevel = level;
      }
      if (gifter) {
        result.membershipGifter = gifter;
      }
    }

    if (!result && snippet.membershipDetails) {
      const details = snippet.membershipDetails;
      const level = toPlainText(details.memberLevelName);

      result = {
        membership: 'Membership',
        subtitle: level || null,
        event: 'membership',
        note: level ? `Membership: ${level}` : 'Membership',
        includeMemberBadge: true
      };

      if (level) {
        result.membershipLevel = level;
      }
    }

    if (!result) {
      return null;
    }

    if (!result.previewText) {
      const preview = fallbackPreview();
      result.previewText = preview || result.membership || '';
    }

    return result;
  }

  buildMembershipMeta(snippet, membershipInfo = {}) {
    const meta = {};
    const info = membershipInfo || {};
    const toPlainText = (value) => htmlToText(value || '').trim();

    if (info.membershipLevel) {
      meta.levelName = info.membershipLevel;
    }
    if (Number.isFinite(info.membershipMonths)) {
      meta.totalMonths = info.membershipMonths;
    }
    if (Number.isFinite(info.membershipGiftCount)) {
      meta.giftCount = info.membershipGiftCount;
    }
    if (info.membershipGifter) {
      meta.giftedBy = info.membershipGifter;
    }
    if (info.event) {
      meta.eventType = info.event;
    }
    if (info.previewText) {
      meta.previewText = info.previewText;
    }
    if (info.chatmessage) {
      const highlightText = toPlainText(info.chatmessage);
      if (highlightText) {
        meta.highlightText = highlightText;
      }
    }

    const snippetType = typeof snippet?.type === 'string' ? snippet.type.trim() : '';
    if (snippetType) {
      meta.snippetType = snippetType;
    }

    const membershipDetails = snippet?.membershipDetails;
    if (membershipDetails) {
      if (membershipDetails.highestAccessibleLevel) {
        meta.highestLevelId = membershipDetails.highestAccessibleLevel;
      }
      if (membershipDetails.highestAccessibleLevelDisplayName) {
        meta.highestLevelName = membershipDetails.highestAccessibleLevelDisplayName;
      }
      if (Array.isArray(membershipDetails.accessibleLevels) && membershipDetails.accessibleLevels.length) {
        meta.accessibleLevels = membershipDetails.accessibleLevels.slice();
      }

      const duration = membershipDetails.membershipsDuration || null;
      if (duration && (duration.memberSince || duration.memberTotalDurationMonths !== undefined)) {
        const normalizedDuration = {};
        if (duration.memberSince) {
          normalizedDuration.memberSince = duration.memberSince;
        }
        const totalMonths = Number(duration.memberTotalDurationMonths);
        if (Number.isFinite(totalMonths)) {
          normalizedDuration.totalMonths = totalMonths;
        }
        if (Object.keys(normalizedDuration).length) {
          meta.duration = normalizedDuration;
        }
      }

      const durationAtLevel = membershipDetails.membershipsDurationAtLevel;
      if (Array.isArray(durationAtLevel) && durationAtLevel.length) {
        const normalizedLevels = durationAtLevel
          .map((entry) => {
            if (!entry) {
              return null;
            }
            const normalizedEntry = {};
            if (entry.level) {
              normalizedEntry.levelId = entry.level;
            }
            if (entry.memberSince) {
              normalizedEntry.memberSince = entry.memberSince;
            }
            const totalMonths = Number(entry.memberTotalDurationMonths);
            if (Number.isFinite(totalMonths)) {
              normalizedEntry.totalMonths = totalMonths;
            }
            return Object.keys(normalizedEntry).length ? normalizedEntry : null;
          })
          .filter(Boolean);
        if (normalizedLevels.length) {
          meta.durationByLevel = normalizedLevels;
        }
      }
    }

    const milestoneDetails = snippet?.memberMilestoneChatDetails;
    if (milestoneDetails) {
      const milestoneMeta = {};
      const levelName = toPlainText(milestoneDetails.memberLevelName || '');
      if (levelName) {
        milestoneMeta.levelName = levelName;
      }
      const milestoneMonths = Number(milestoneDetails.memberMonth);
      if (Number.isFinite(milestoneMonths)) {
        milestoneMeta.months = milestoneMonths;
      }
      const userComment = toPlainText(milestoneDetails.userComment || '');
      if (userComment) {
        milestoneMeta.userComment = userComment;
      }
      if (Object.keys(milestoneMeta).length) {
        meta.milestone = milestoneMeta;
      }
    }

    const newSponsorDetails = snippet?.newSponsorDetails;
    if (newSponsorDetails) {
      const sponsorMeta = {};
      const levelName = toPlainText(newSponsorDetails.memberLevelName || '');
      if (levelName) {
        sponsorMeta.levelName = levelName;
      }
      if (Object.prototype.hasOwnProperty.call(newSponsorDetails, 'isUpgrade')) {
        sponsorMeta.isUpgrade = Boolean(newSponsorDetails.isUpgrade);
      }
      if (Object.keys(sponsorMeta).length) {
        meta.newSponsor = sponsorMeta;
      }
    }

    const giftingDetails = snippet?.membershipGiftingDetails;
    if (giftingDetails) {
      const giftingMeta = {};
      const levelName = toPlainText(giftingDetails.giftMembershipsLevelName || '');
      if (levelName) {
        giftingMeta.levelName = levelName;
      }
      const giftCount = Number(giftingDetails.giftMembershipsCount);
      if (Number.isFinite(giftCount)) {
        giftingMeta.count = giftCount;
      }
      if (Object.keys(giftingMeta).length) {
        meta.gifting = giftingMeta;
      }
    }

    const receivedDetails = snippet?.giftMembershipReceivedDetails;
    if (receivedDetails) {
      const receivedMeta = {};
      const levelName = toPlainText(receivedDetails.memberLevelName || '');
      if (levelName) {
        receivedMeta.levelName = levelName;
      }
      const gifter = toPlainText(receivedDetails.gifterDisplayName || '');
      if (gifter) {
        receivedMeta.gifter = gifter;
      }
      if (Object.keys(receivedMeta).length) {
        meta.receivedGift = receivedMeta;
      }
    }

    return Object.keys(meta).length ? meta : null;
  }

  hasMembershipScope(token = this.token) {
    const scopeValue = token?.scope;
    if (!scopeValue) {
      return false;
    }
    if (Array.isArray(scopeValue)) {
      return scopeValue.includes('https://www.googleapis.com/auth/youtube.channel-memberships.creator');
    }
    if (typeof scopeValue === 'string') {
      return scopeValue.split(/\s+/).includes('https://www.googleapis.com/auth/youtube.channel-memberships.creator');
    }
    return false;
  }

  refreshSubscriberCapability(token = this.token, options = {}) {
    const { force = false } = options;
    if (force || this.hasMembershipScope(token)) {
      this.subscriberFeatureUnavailable = false;
      this.subscriberErrorNotified = false;
    }
  }

  shouldCaptureStreamEvents() {
    const stored = storage.get(CAPTURE_EVENTS_KEY, null);
    if (stored === null || stored === undefined) {
      return true;
    }
    return Boolean(stored);
  }

  startSubscriberWatcher() {
    if (this.subscriberFeatureUnavailable) {
      this.refreshSubscriberCapability();
      if (this.subscriberFeatureUnavailable) {
        return;
      }
    }

    if (!this.shouldCaptureStreamEvents()) {
      return;
    }
    if (this.state !== 'connected') {
      return;
    }
    this.scheduleSubscriberPoll(0);
  }

  scheduleSubscriberPoll(delay = SUBSCRIBER_POLL_INTERVAL) {
    if (this.subscriberFeatureUnavailable || !this.shouldCaptureStreamEvents()) {
      return;
    }
    if (this.subscriberPollTimer) {
      window.clearTimeout(this.subscriberPollTimer);
    }
    this.subscriberPollTimer = window.setTimeout(async () => {
      this.subscriberPollTimer = null;
      try {
        await this.pollRecentSubscribers();
      } catch (err) {
        this.debugLog('YouTube subscriber poll failed', { error: err?.message || err });
      }
      if (this.state === 'connected' && !this.subscriberFeatureUnavailable && this.shouldCaptureStreamEvents()) {
        this.scheduleSubscriberPoll(SUBSCRIBER_POLL_INTERVAL);
      }
    }, Math.max(0, delay));
  }

  stopSubscriberWatcher() {
    if (this.subscriberPollTimer) {
      window.clearTimeout(this.subscriberPollTimer);
      this.subscriberPollTimer = null;
    }
  }

  async pollRecentSubscribers() {
    if (this.state !== 'connected') {
      return;
    }
    if (!this.isTokenValid()) {
      return;
    }
    if (!this.shouldCaptureStreamEvents()) {
      return;

    }

    const headers = {
      Authorization: `Bearer ${this.token.accessToken}`,
      Accept: 'application/json'
    };

    const params = new URLSearchParams({
      part: 'snippet,subscriberSnippet',
      myRecentSubscribers: 'true',
      maxResults: '50'
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?${params.toString()}`, {
      headers
    });

    if (res.status === 401) {
      throw new Error('YouTube authentication expired while checking subscribers.');
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const apiErr = this.createApiError(errBody, res.status, 'subscriptions');
      if (apiErr.status === 403 || apiErr.reason === 'subscriptionForbidden' || apiErr.reason === 'insufficientPermissions') {
        if (!this.subscriberErrorNotified) {
          this.subscriberErrorNotified = true;
          this.log('Unable to access YouTube subscriber list; subscriber events disabled for this session.', { reason: apiErr.reason || apiErr.status }, { kind: 'warn' });
        }
        this.subscriberFeatureUnavailable = true;
        this.stopSubscriberWatcher();
        return;
      }
      throw apiErr;
    }

    const data = await res.json();
    if (!Array.isArray(data.items) || data.items.length === 0) {
      return;
    }

    const previousKeys = Array.from(this.seenSubscriberKeys);
    const batchKeys = [];
    const newEntries = [];
    let maxTimestamp = this.lastSubscriberTimestamp || 0;

    data.items.forEach((item) => {
      const snippet = item?.snippet || {};
      const subscriberSnippet = item?.subscriberSnippet || {};
      const publishedRaw = snippet?.publishedAt || subscriberSnippet?.publishedAt || '';
      const parsed = publishedRaw ? Date.parse(publishedRaw) : NaN;
      const publishedAt = Number.isFinite(parsed) ? parsed : Date.now();
      if (Number.isFinite(parsed) && parsed > maxTimestamp) {
        maxTimestamp = parsed;
      }
      const subscriberId = subscriberSnippet?.channelId || item?.id || '';
      const key = `${subscriberId}:${publishedAt}`;
      batchKeys.push(key);
      if (!this.seenSubscriberKeys.has(key)) {
        newEntries.push({ item, snippet, subscriberSnippet, publishedAt, key });
      }
    });

    let cacheChanged = false;
    if (batchKeys.length) {
      const merged = [];
      const pushUnique = (value) => {
        if (!merged.includes(value)) {
          merged.push(value);
        }
      };
      batchKeys.forEach(pushUnique);
      previousKeys.forEach(pushUnique);
      const limited = merged.slice(0, SUBSCRIBER_CACHE_LIMIT);
      if (limited.length !== previousKeys.length || limited.some((value, index) => value !== previousKeys[index])) {
        cacheChanged = true;
        this.seenSubscriberKeys = new Set(limited);
      }
    }

    const timestampChanged = maxTimestamp > (this.lastSubscriberTimestamp || 0);
    if ((cacheChanged || timestampChanged) && maxTimestamp) {
      this.lastSubscriberTimestamp = maxTimestamp;
      this.persistSubscriberCache();
    }

    if (!newEntries.length) {
      return;
    }

    for (let index = newEntries.length - 1; index >= 0; index -= 1) {
      const message = this.buildSubscriberEventMessage(newEntries[index]);
      if (message) {
        this.publish(message, { note: 'New YouTube subscriber relayed' });
      }
    }
  }

  persistSubscriberCache() {
    const keys = Array.from(this.seenSubscriberKeys).slice(0, SUBSCRIBER_CACHE_LIMIT);
    storage.set(SUBSCRIBER_CACHE_KEY, {
      keys,
      timestamp: this.lastSubscriberTimestamp || Date.now()
    });
  }

  buildSubscriberEventMessage(entry) {
    if (!entry) {
      return null;
    }
    const { item, snippet, subscriberSnippet, publishedAt } = entry;
    const displayName = (subscriberSnippet?.title || snippet?.title || '').trim() || 'YouTube user';
    const avatar =
      subscriberSnippet?.thumbnails?.high?.url ||
      subscriberSnippet?.thumbnails?.default?.url ||
      subscriberSnippet?.thumbnails?.medium?.url ||
      '';
    const timestamp = Number.isFinite(publishedAt) ? publishedAt : Date.now();
    const payload = {
      platform: 'youtube',
      type: 'youtube',
      chatname: displayName,
      chatmessage: 'followed',
      event: 'followed',
      chatimg: avatar,
      timestamp,
      previewText: `${displayName} followed`,
      raw: { subscriber: item }
    };
    if (item?.id) {
      payload.sourceId = item.id;
    }
    if (subscriberSnippet?.channelId) {
      payload.userid = subscriberSnippet.channelId;
    }
    return payload;

  }

  async publishWithEmotes(message, options = {}) {
    if (!message) {
      return;
    }
    const { silent = true, note = null } = options;

    if (typeof message.previewText !== 'string' || !message.previewText.length) {
      message.previewText = htmlToText(message.chatmessage || '');
    }

    if (this.emotes && message.chatmessage && !message.textonly) {
      try {
        message.chatmessage = await this.emotes.render(message.chatmessage, this.buildEmoteContext());
      } catch (err) {
        this.debugLog('Failed to render YouTube emotes', { error: err?.message || err });
      }
    }

    const publishOptions = { silent, preview: this.formatChatPreview(message) };
    if (note) {
      publishOptions.note = note;
    }
    this.publish(message, publishOptions);
  }

  buildEmoteContext() {

    const context = { platform: 'youtube' };
    if (this.channelInfo?.title) {
      context.channelName = this.channelInfo.title.toLowerCase();
    }
    if (this.channelInfo?.id) {
      context.channelId = this.channelInfo.id;
      context.userId = this.channelInfo.id;
    }
    return context;
  }

  async prepareEmotesForChannel() {
    if (!this.emotes) {
      return;
    }
    const context = this.buildEmoteContext();
    if (!context.channelId && !context.channelName) {
      return;
    }
    await this.emotes.prepareChannel(context).catch(() => {});
  }

  resolveEvent(snippet) {
    if (!snippet) {
      return null;
    }

    const rawType = typeof snippet.type === 'string' ? snippet.type.trim() : '';
    const normalized = rawType.toLowerCase();

    if (!normalized || normalized === 'textmessageevent') {
      return null;
    }

    if (normalized === 'superchatevent' || normalized === 'superstickerevent' || normalized === 'fanfundingevent') {
      return null;
    }

    if (normalized === 'newsponsorevent') {
      return 'membership';
    }

    if (normalized === 'membermilestonechatevent') {
      return 'membership_milestone';
    }

    if (normalized === 'membershipgiftingevent' || snippet.membershipGiftingDetails) {
      return 'membership_gift';
    }

    if (normalized === 'giftmembershipreceivedevent' || snippet.giftMembershipReceivedDetails) {
      return 'membership_gift_received';
    }

    return normalized;
  }

  formatChatPreview(chat) {
    if (!chat) {
      return 'New YouTube message';
    }

    const name = chat.chatname || 'YouTube user';
    const baseText = (chat.previewText ?? chat.chatmessage ?? '').toString();
    const trimmed = htmlToText(baseText)
      .replace(/\s+/g, ' ')
      .trim();

    if (chat.event === 'superchat') {
      return trimmed ? `${name} sent a Super Chat: ${trimmed}` : `${name} sent a Super Chat`;
    }

    if (chat.event === 'supersticker') {
      return `${name} sent a Super Sticker`; // stickers rarely include text
    }

    if (chat.event && chat.event !== 'chat' && !trimmed) {
      return `${name} ${chat.event}`;
    }

    return trimmed ? `${name}: ${trimmed}` : name;
  }

  shouldAutoConnect() {
    return super.shouldAutoConnect() && this.isTokenValid();
  }
}



