import { BasePlugin } from './basePlugin.js';
import { storage } from '../utils/storage.js';
import { safeHtml } from '../utils/helpers.js';
import { loadScriptSequential } from '../shared/utils/scriptLoader.js';

const UNIQUE_ID_KEY = 'tiktok.uniqueId';
const SERVER_URL_KEY = 'tiktok.serverUrl';
const SCRIPT_URL_KEY = 'tiktok.scriptUrl';
const SESSION_ID_KEY = 'tiktok.sessionId';
const INCLUDE_GIFTS_KEY = 'tiktok.includeGifts';
const INCLUDE_FOLLOWS_KEY = 'tiktok.includeFollows';
const INCLUDE_LIKES_KEY = 'tiktok.includeLikes';

const SOCKET_IO_SOURCES = [
  './vendor/socket.io.min.js'
];

const CONNECTOR_SOURCES = [
  './vendor/TikTokIOConnection.js?v=20240211',
  './vendor/TikTokIOConnection.js'
];

function normalizeUniqueId(value) {
  return (value || '').trim().replace(/^@+/, '');
}

function normalizeServerUrl(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.replace(/\/?$/, '');
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeScriptOverride(value) {
  const raw = (value || '').trim();
  if (!raw) {
    return '';
  }
  if (/^(?:\/|\.\/|\.\.\/)/.test(raw)) {
    return raw;
  }
  try {
    const parsed = new URL(raw, window.location.href);
    const protocol = (parsed.protocol || '').toLowerCase();
    if (protocol === 'http:' || protocol === 'https:') {
      return parsed.href;
    }
  } catch (err) {}
  return '';
}

function mapBadges(badges) {
  if (!Array.isArray(badges) || !badges.length) {
    return [];
  }
  return badges
    .map((badge) => {
      if (!badge) return null;
      if (typeof badge === 'string') {
        return badge;
      }
      if (badge.url || badge.imageUrl) {
        return badge.url || badge.imageUrl;
      }
      if (badge.image && badge.image.url) {
        return badge.image.url;
      }
      if (badge.svg) {
        return { type: 'svg', html: badge.svg };
      }
      if (badge.name) {
        return badge.name;
      }
      return null;
    })
    .filter(Boolean);
}

function buildGiftSummary(payload) {
  if (!payload) return '';
  const parts = [];
  const baseName = payload.giftName || payload.name || payload.extended_gift_info?.name || payload.id;
  if (baseName) {
    parts.push(baseName);
  }
  const count = payload.repeatCount || payload.repeat_count || payload.combo || payload.count || payload.quantity;
  if (count && Number(count) > 1) {
    parts.push(`×${count}`);
  }
  const amount = payload.diamondCount || payload.diamond_count || payload.coins || payload.amount || payload.value;
  if (amount && Number(amount) > 0) {
    const numeric = Number(amount);
    if (Number.isFinite(numeric)) {
      parts.push(`(${numeric} coins)`);
    }
  }
  return parts.join(' ');
}

export class TikTokPlugin extends BasePlugin {
  constructor(options) {
    super({
      ...options,
      id: 'tiktok',
      name: 'TikTok',
      description: 'Relay TikTok LIVE chat via a TikTok Chat Reader compatible proxy.'
    });

    this.uniqueIdInput = null;
    this.serverInput = null;
    this.scriptInput = null;
    this.sessionIdInput = null;
    this.includeGiftsInput = null;
    this.includeFollowsInput = null;
    this.includeLikesInput = null;
    this.statusLabel = null;

    this.connector = null;
    this.connectorLoaded = false;
    this.connectorRemovers = [];
  }

  renderPrimary(container) {
    const statusLabel = document.createElement('div');
    statusLabel.className = 'source-card__subtext';
    statusLabel.hidden = true;

    container.append(statusLabel);
    this.statusLabel = statusLabel;
    this.refreshStatus();
    return container;
  }

  renderSettings(container) {
    const idRow = document.createElement('label');
    idRow.className = 'field';
    const idLabel = document.createElement('span');
    idLabel.className = 'field__label';
    idLabel.textContent = 'TikTok username';
    const idInput = document.createElement('input');
    idInput.type = 'text';
    idInput.placeholder = 'eg. livestreamer';
    idInput.autocomplete = 'off';
    idInput.value = storage.get(UNIQUE_ID_KEY, '');
    idInput.addEventListener('change', () => {
      storage.set(UNIQUE_ID_KEY, normalizeUniqueId(idInput.value));
      this.refreshStatus();
    });
    idRow.append(idLabel, idInput);

    const serverRow = document.createElement('label');
    serverRow.className = 'field';
    const serverLabel = document.createElement('span');
    serverLabel.className = 'field__label';
    serverLabel.textContent = 'Proxy server URL';
    const serverInput = document.createElement('input');
    serverInput.type = 'url';
    serverInput.placeholder = 'https://your-proxy.example.com';
    serverInput.autocomplete = 'off';
    serverInput.value = storage.get(SERVER_URL_KEY, '');
    serverInput.addEventListener('change', () => {
      storage.set(SERVER_URL_KEY, normalizeServerUrl(serverInput.value));
      this.refreshStatus();
    });
    serverRow.append(serverLabel, serverInput);

    const scriptRow = document.createElement('label');
    scriptRow.className = 'field';
    const scriptLabel = document.createElement('span');
    scriptLabel.className = 'field__label';
    scriptLabel.textContent = 'Custom connector script URL (optional)';
    const scriptInput = document.createElement('input');
    scriptInput.type = 'url';
    scriptInput.placeholder = 'Overrides default connector script';
    scriptInput.autocomplete = 'off';
    scriptInput.value = storage.get(SCRIPT_URL_KEY, '');
    scriptInput.addEventListener('change', () => {
      const normalized = normalizeScriptOverride(scriptInput.value);
      scriptInput.value = normalized;
      storage.set(SCRIPT_URL_KEY, normalized);
      this.connectorLoaded = false;
    });
    scriptRow.append(scriptLabel, scriptInput);

    const sessionRow = document.createElement('label');
    sessionRow.className = 'field';
    const sessionLabel = document.createElement('span');
    sessionLabel.className = 'field__label';
    sessionLabel.textContent = 'TikTok session cookie (optional, helps with connection issues)';
    const sessionInput = document.createElement('input');
    sessionInput.type = 'password';
    sessionInput.placeholder = 'sessionid cookie value from TikTok.com';
    sessionInput.autocomplete = 'off';
    sessionInput.value = storage.get(SESSION_ID_KEY, '');
    sessionInput.addEventListener('change', () => {
      storage.set(SESSION_ID_KEY, sessionInput.value.trim());
    });
    sessionRow.append(sessionLabel, sessionInput);

    const toggles = document.createElement('div');
    toggles.className = 'field field--checkbox-group';

    const includeGifts = document.createElement('label');
    includeGifts.className = 'checkbox';
    const includeGiftsInput = document.createElement('input');
    includeGiftsInput.type = 'checkbox';
    includeGiftsInput.checked = storage.get(INCLUDE_GIFTS_KEY, true);
    includeGiftsInput.addEventListener('change', () => {
      storage.set(INCLUDE_GIFTS_KEY, includeGiftsInput.checked);
    });
    const includeGiftsSpan = document.createElement('span');
    includeGiftsSpan.textContent = 'Relay gift events';
    includeGifts.append(includeGiftsInput, includeGiftsSpan);

    const includeFollows = document.createElement('label');
    includeFollows.className = 'checkbox';
    const includeFollowsInput = document.createElement('input');
    includeFollowsInput.type = 'checkbox';
    includeFollowsInput.checked = storage.get(INCLUDE_FOLLOWS_KEY, false);
    includeFollowsInput.addEventListener('change', () => {
      storage.set(INCLUDE_FOLLOWS_KEY, includeFollowsInput.checked);
    });
    const includeFollowsSpan = document.createElement('span');
    includeFollowsSpan.textContent = 'Relay follows / shares';
    includeFollows.append(includeFollowsInput, includeFollowsSpan);

    const includeLikes = document.createElement('label');
    includeLikes.className = 'checkbox';
    const includeLikesInput = document.createElement('input');
    includeLikesInput.type = 'checkbox';
    includeLikesInput.checked = storage.get(INCLUDE_LIKES_KEY, false);
    includeLikesInput.addEventListener('change', () => {
      storage.set(INCLUDE_LIKES_KEY, includeLikesInput.checked);
    });
    const includeLikesSpan = document.createElement('span');
    includeLikesSpan.textContent = 'Relay like streaks';
    includeLikes.append(includeLikesInput, includeLikesSpan);

    toggles.append(includeGifts, includeFollows, includeLikes);

    container.append(idRow, serverRow, sessionRow, scriptRow, toggles);

    this.uniqueIdInput = idInput;
    this.serverInput = serverInput;
    this.scriptInput = scriptInput;
    this.sessionIdInput = sessionInput;
    this.includeGiftsInput = includeGiftsInput;
    this.includeFollowsInput = includeFollowsInput;
    this.includeLikesInput = includeLikesInput;

    return container;
  }

  refreshStatus() {
    if (!this.statusLabel) {
      return;
    }
    const uniqueId = normalizeUniqueId(this.uniqueIdInput ? this.uniqueIdInput.value : storage.get(UNIQUE_ID_KEY, ''));
    if (uniqueId) {
      this.statusLabel.hidden = false;
      this.statusLabel.innerHTML = `Account: <strong>@${safeHtml(uniqueId)}</strong>`;
    } else {
      this.statusLabel.hidden = true;
      this.statusLabel.textContent = '';
    }

  }

  async ensureConnectorLoaded(customSources) {
    if (this.connectorLoaded) {
      return;
    }

    await loadScriptSequential(SOCKET_IO_SOURCES, { timeout: 15000 });

    const scriptOverride = (customSources && customSources.length ? customSources : []);
    const connectorSources = scriptOverride.length ? scriptOverride : CONNECTOR_SOURCES;
    await loadScriptSequential(connectorSources, { timeout: 15000 });

    if (typeof window.TikTokIOConnection !== 'function') {
      throw new Error('TikTok connector script did not expose TikTokIOConnection.');
    }

    this.connectorLoaded = true;
  }

  bindConnectorEvents(uniqueId) {
    if (!this.connector) {
      return;
    }

    const socket = this.connector.socket;
    if (!socket) {
      return;
    }

    const addListener = (event, handler) => {
      if (!event || !handler) return;
      socket.on(event, handler);
      this.connectorRemovers.push(() => {
        try {
          if (typeof socket.off === 'function') {
            socket.off(event, handler);
          } else if (typeof socket.removeListener === 'function') {
            socket.removeListener(event, handler);
          }
        } catch (err) {
          // ignore cleanup errors
        }
      });
    };

    addListener('tiktokConnected', () => {
      this.setState('connected');
      this.log(`TikTok connected (@${uniqueId})`);
    });

    addListener('tiktokDisconnected', (reason) => {
      this.log(`TikTok disconnected: ${reason}`);
      this.setState('idle');
    });

    addListener('streamEnd', () => {
      this.log('TikTok stream ended');
    });

    addListener('chat', (data) => this.handleChatEvent(data));
    addListener('gift', (data) => this.handleGiftEvent(data));
    addListener('social', (data) => this.handleFollowEvent(data));
    addListener('like', (data) => this.handleLikeEvent(data));
  }

  buildConnectOptions() {
    const options = {
      enableExtendedGiftInfo: true,
      processInitialData: false,
      fetchRoomInfo: true,
      requestSettings: {
        showMessageHistory: false
      }
    };

    // Include sessionId if provided
    const sessionId = (this.sessionIdInput ? this.sessionIdInput.value : storage.get(SESSION_ID_KEY, '')).trim();
    if (sessionId) {
      options.sessionId = sessionId;
    }

    return options;
  }

  async enable() {
    const sessionId = this.messenger.getSessionId();
    if (!sessionId) {
      this.reportError(new Error('Start a session before connecting TikTok.'));
      return;
    }

    if (this.uniqueIdInput) {
      this.uniqueIdInput.setCustomValidity('');
    }

    let uniqueId = normalizeUniqueId(this.uniqueIdInput ? this.uniqueIdInput.value : storage.get(UNIQUE_ID_KEY, ''));
    if (!uniqueId) {
      // Prompt for username
      const response = window.prompt('Enter the TikTok username to monitor (without @):', '');

      // User cancelled the prompt
      if (response === null) {
        return;
      }

      const normalized = normalizeUniqueId(response);

      // Check if empty after normalization
      if (!normalized) {
        if (this.uniqueIdInput) {
          this.toggleSettings?.(true);
          this.uniqueIdInput.focus();
          if (typeof this.uniqueIdInput.setCustomValidity === 'function') {
            this.uniqueIdInput.setCustomValidity('Enter the TikTok username to monitor.');
            this.uniqueIdInput.reportValidity?.();
          }
        }
        this.reportError(new Error('Enter the TikTok username to monitor.'));
        return;
      }

      // Check for spaces in the original response (before normalization)
      if (response.trim().includes(' ')) {
        if (this.uniqueIdInput) {
          this.toggleSettings?.(true);
          this.uniqueIdInput.focus();
          if (typeof this.uniqueIdInput.setCustomValidity === 'function') {
            this.uniqueIdInput.setCustomValidity('TikTok usernames cannot contain spaces.');
            this.uniqueIdInput.reportValidity?.();
          }
        }
        this.reportError(new Error('TikTok usernames cannot contain spaces.'));
        return;
      }

      uniqueId = normalized;
      if (this.uniqueIdInput) {
        this.uniqueIdInput.value = normalized;
      }
    }
    storage.set(UNIQUE_ID_KEY, uniqueId);

    const serverUrl = normalizeServerUrl(this.serverInput ? this.serverInput.value : storage.get(SERVER_URL_KEY, ''));
    if (!serverUrl) {
      this.reportError(new Error('Enter the proxy server URL hosting TikTok-Chat-Reader.'));
      return;
    }
    storage.set(SERVER_URL_KEY, serverUrl);

    const scriptOverrideRaw = (this.scriptInput ? this.scriptInput.value : storage.get(SCRIPT_URL_KEY, '') || '').trim();
    const scriptOverride = normalizeScriptOverride(scriptOverrideRaw);
    if (scriptOverrideRaw && !scriptOverride) {
      this.reportError(new Error('Custom connector script URL must be a relative path or HTTP(S) URL.'));
      return;
    }
    if (this.scriptInput) {
      this.scriptInput.value = scriptOverride;
    }
    if (scriptOverride) {
      storage.set(SCRIPT_URL_KEY, scriptOverride);
    } else {
      storage.remove(SCRIPT_URL_KEY);
    }

    this.refreshStatus();

    const customSources = scriptOverride ? [scriptOverride, ...CONNECTOR_SOURCES] : null;

    try {
      await this.ensureConnectorLoaded(customSources);

      this.cleanupConnector();

      this.connector = new window.TikTokIOConnection(serverUrl);
      this.bindConnectorEvents(uniqueId);

      const result = this.connector.connect(uniqueId, this.buildConnectOptions());
      if (result && typeof result.then === 'function') {
        await result;
      }
      this.log(`Connecting to TikTok @${uniqueId}`);
    } catch (err) {
      this.cleanupConnector();
      const error = err instanceof Error ? err : new Error(err?.message || String(err));
      this.reportError(error);
    }
  }

  handleChatEvent(payload) {
    if (!payload) {
      return;
    }

    const displayName = payload.nickname || payload.user?.nickname || payload.uniqueId || payload.username || 'TikTok viewer';
    const messageText = payload.comment || payload.text || payload.content || '';
    if (!messageText) {
      return;
    }
    const timestamp = payload.timestamp || payload.createTime || payload.created_at || Date.now();
    const avatar = payload.profilePictureUrl || payload.profile_picture_url || payload.user?.profilePictureUrl || payload.user?.avatarThumb || '';

    const message = {
      id: `tiktok-${payload.msg_id || payload.id || Date.now()}`,
      type: 'tiktok',
      chatname: displayName,
      chatmessage: safeHtml(messageText),
      chatimg: avatar || '',
      timestamp: Number(timestamp) || Date.now(),
      event: 'message',
      badges: payload.badges || payload.user?.badges || undefined,
      chatbadges: mapBadges(payload.badges || payload.user?.badges),
      nameColor: payload.user?.color || payload.color || undefined,
      raw: payload
    };

    this.publish(message);
  }

  handleGiftEvent(payload) {
    if (!storage.get(INCLUDE_GIFTS_KEY, true)) {
      return;
    }
    if (!payload) {
      return;
    }

    const user = payload.user || payload.sender || payload;
    const displayName = user?.nickname || user?.uniqueId || payload.nickname || payload.username || 'TikTok viewer';
    const avatar = user?.profilePictureUrl || user?.avatarThumb || payload.profilePictureUrl || '';
    const timestamp = payload.timestamp || payload.createTime || Date.now();

    const summary = buildGiftSummary(payload.extendedGiftInfo || payload.gift || payload);
    const diamondCount = toNumber(payload.diamondCount || payload.diamond_count || payload.value || payload.coins);

    const message = {
      id: `tiktok-gift-${payload.msg_id || payload.id || Date.now()}`,
      type: 'tiktok',
      chatname: displayName,
      chatmessage: summary || 'Sent a gift',
      chatimg: avatar || '',
      timestamp: Number(timestamp) || Date.now(),
      event: 'gift',
      hasDonation: summary || 'Gift',
      raw: payload
    };

    if (diamondCount !== null) {
      message.donationAmount = diamondCount;
      message.donationCurrency = 'TikTok coins';
    }

    const combo = payload.repeatCount || payload.repeat_count || payload.combo || payload.count;
    if (combo && Number(combo) > 1) {
      message.subtitle = `Combo ×${combo}`;
    }

    this.publish(message, { note: 'TikTok gift relayed' });
  }

  handleFollowEvent(payload) {
    if (!storage.get(INCLUDE_FOLLOWS_KEY, false)) {
      return;
    }
    if (!payload) {
      return;
    }

    const user = payload.user || payload.sender || payload;
    const displayName = user?.nickname || user?.uniqueId || payload.nickname || payload.username || 'TikTok viewer';
    const avatar = user?.profilePictureUrl || user?.avatarThumb || payload.profilePictureUrl || '';
    const action = (payload.action || payload.type || payload.event || '').toLowerCase();

    let messageText = 'interacted with the stream';
    if (action.includes('share')) {
      messageText = 'shared the stream';
    } else if (action.includes('follow')) {
      messageText = 'followed the stream';
    } else if (action.includes('join')) {
      messageText = 'joined the stream';
    }

    const message = {
      id: `tiktok-social-${payload.msg_id || payload.id || Date.now()}`,
      type: 'tiktok',
      chatname: displayName,
      chatmessage: messageText,
      chatimg: avatar || '',
      timestamp: Date.now(),
      event: action || 'follow',
      raw: payload,
      textonly: true
    };

    this.publish(message, { silent: true, preview: 'TikTok social event', previewDetail: message });
  }

  handleLikeEvent(payload) {
    if (!storage.get(INCLUDE_LIKES_KEY, false)) {
      return;
    }
    if (!payload) {
      return;
    }

    const user = payload.user || payload.sender || payload;
    const displayName = user?.nickname || user?.uniqueId || payload.nickname || payload.username || 'TikTok viewer';
    const avatar = user?.profilePictureUrl || user?.avatarThumb || payload.profilePictureUrl || '';

    const likeCount = toNumber(payload.likeCount || payload.totalLikeCount || payload.count || payload.combo_count);

    const message = {
      id: `tiktok-like-${payload.id || Date.now()}`,
      type: 'tiktok',
      chatname: displayName,
      chatmessage: likeCount ? `sent ${likeCount} likes` : 'sent likes',
      chatimg: avatar || '',
      timestamp: Date.now(),
      event: 'like',
      raw: payload,
      textonly: true
    };

    this.publish(message, { silent: true, preview: 'TikTok like streak', previewDetail: message });
  }

  cleanupConnector() {
    if (Array.isArray(this.connectorRemovers) && this.connectorRemovers.length) {
      this.connectorRemovers.forEach((fn) => {
        try {
          fn();
        } catch (err) {
          // ignore
        }
      });
    }
    this.connectorRemovers = [];

    if (this.connector && this.connector.socket) {
      try {
        if (typeof this.connector.socket.disconnect === 'function') {
          this.connector.socket.disconnect();
        } else if (typeof this.connector.socket.close === 'function') {
          this.connector.socket.close();
        }
      } catch (err) {
        console.warn('TikTok socket disconnect failed', err);
      }
    }

    this.connector = null;
  }

  disable() {
    this.cleanupConnector();
    this.setState('idle');
  }
}
