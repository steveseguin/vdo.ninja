import { BasePlugin } from './basePlugin.js';
import { storage } from '../utils/storage.js';
import { safeHtml, htmlToText } from '../utils/helpers.js';
import {
  sanitizeKickTokenCode,
  normalizeChannel,
  normalizeImage,
  mapBadges,
  mergeBadges,
  mergeProfileDetails,
  eventNameForType,
  buildProfileCacheKeys,
  getProfileCacheEntry,
  storeProfileCacheEntry
} from '../providers/kick/core.js';

const CHANNEL_KEY = 'kick.channel';
const API_BASE_KEY = 'kick.apiBase';
const WS_BASE_KEY = 'kick.wsBase';
const ADVANCED_VISIBLE_KEY = 'kick.advancedVisible';
const MANUAL_OVERRIDES_KEY = 'kick.manualOverrides';
const METADATA_CACHE_KEY = 'kick.metadataCache';
const STORAGE_VERSION_KEY = 'kick.storageVersion';
const STORAGE_VERSION = 5;

const DEFAULT_API_BASE = 'https://kick.com/api/v2';
const DEFAULT_WS_BASE = 'wss://ws-us2.pusher.com';
const HISTORY_LIMIT = 400;
const PUSHER_APP_KEY = '32cbd69e4b950bf97679';
const CHANNEL_WHITESPACE_MESSAGE = 'Kick channel names cannot contain spaces. Enter the channel slug (e.g. "evarate").';
const WHITESPACE_PATTERN = /\s/;
const KICK_TOKEN_PATTERN = /\[(emote|sticker):(\d+):([^\]]+)\]/gi;

function extractSegments(message) {
  if (!message) {
    return '';
  }
  if (typeof message === 'string') {
    return message;
  }
  if (Array.isArray(message)) {
    return message
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }
        if (part && typeof part === 'object') {
          const partType = (part.type || part.kind || '').toString().toLowerCase();
          if ((partType === 'emote' || partType === 'sticker') && (part.id || part.emote_id || part.emoteId || part.sticker_id || part.stickerId)) {
            const id = part.id || part.emote_id || part.emoteId || part.sticker_id || part.stickerId;
            const code = sanitizeKickTokenCode(part.code || part.name || part.text || part.value || part.label);
            if (id) {
              const tokenCode = code || `kick-${id}`;
              return `[${partType}:${id}:${tokenCode}]`;
            }
            return code;
          }
          if (part.emote && (part.emote.id || part.emote.emote_id)) {
            const emoteId = part.emote.id || part.emote.emote_id;
            const emoteCode = sanitizeKickTokenCode(part.emote.code || part.emote.name || part.emote.text || part.emote.value);
            if (emoteId) {
              return `[emote:${emoteId}:${emoteCode || `kick-${emoteId}`}]`;
            }
            return emoteCode;
          }
          if (part.sticker && (part.sticker.id || part.sticker.sticker_id)) {
            const stickerId = part.sticker.id || part.sticker.sticker_id;
            const stickerCode = sanitizeKickTokenCode(part.sticker.name || part.sticker.code || part.sticker.text || part.sticker.value);
            if (stickerId) {
              return `[sticker:${stickerId}:${stickerCode || `kick-${stickerId}`}]`;
            }
            return stickerCode;
          }
        }
        if (part?.text) {
          return part.text;
        }
        if (part?.content) {
          return part.content;
        }
        if (part?.url) {
          return part.url;
        }
        if (part?.value) {
          return part.value;
        }
        return '';
      })
      .join('');
  }
  if (Array.isArray(message.message)) {
    return extractSegments(message.message);
  }
  if (Array.isArray(message.fragments)) {
    return extractSegments(message.fragments);
  }
  if (Array.isArray(message.parts)) {
    return extractSegments(message.parts);
  }
  if (message.text) {
    return message.text;
  }
  if (message.content) {
    return message.content;
  }
  if (message.body) {
    return message.body;
  }
  if (message.message) {
    return extractSegments(message.message);
  }
  return '';
}

export class KickPlugin extends BasePlugin {
  constructor(options) {
    super({
      ...options,
      id: 'kick',
      name: 'Kick',
      description: 'Fetch Kick chat messages using the public API and relay them to your overlays.'
    });

    this.channelInput = null;
    this.apiBaseInput = null;
    this.wsBaseInput = null;
    this.chatroomInput = null;
    this.channelIdInput = null;
    this.statusLabel = null;
    this.detailsLabel = null;

    this.apiBase = DEFAULT_API_BASE;
    this.channelSlug = null;
    this.chatroomId = null;
    this.channelNumericId = null;
    this.channelUserId = null;
    this.seenIds = new Set();

    this.profileCache = new Map();
    this.profileFetches = new Map();

    this.manualOverrides = null;
    this.metadataCache = null;

    this.ensureStorageVersion();
  }

  renderPrimary(container) {
    const status = document.createElement('div');
    status.className = 'source-card__subtext';
    status.hidden = true;

    const detail = document.createElement('div');
    detail.className = 'source-card__subtext';
    detail.hidden = true;

    container.append(status, detail);
    this.statusLabel = status;
    this.detailsLabel = detail;
    this.refreshStatus();

    return container;
  }

  renderSettings(container) {
    const channelRow = document.createElement('label');
    channelRow.className = 'field';
    const channelLabel = document.createElement('span');
    channelLabel.className = 'field__label';
    channelLabel.textContent = 'Kick channel name';
    const channelInput = document.createElement('input');
    channelInput.type = 'text';
    channelInput.placeholder = 'eg. popularstreamer';
    channelInput.autocomplete = 'off';
    channelInput.value = storage.get(CHANNEL_KEY, '');
    channelInput.addEventListener('change', () => {
      const normalized = normalizeChannel(channelInput.value);
      channelInput.value = normalized;
      channelInput.setCustomValidity('');
      if (normalized && WHITESPACE_PATTERN.test(normalized)) {
        channelInput.setCustomValidity(CHANNEL_WHITESPACE_MESSAGE);
        channelInput.reportValidity();
        channelInput.focus();
        return;
      }
      storage.set(CHANNEL_KEY, normalized);
      this.populateDerivedInputs(normalized);
      this.refreshStatus();
    });
    channelRow.append(channelLabel, channelInput);

    const apiRow = document.createElement('label');
    apiRow.className = 'field';
    const apiLabel = document.createElement('span');
    apiLabel.className = 'field__label';
    apiLabel.textContent = 'API base URL (optional)';
    const apiInput = document.createElement('input');
    apiInput.type = 'url';
    apiInput.placeholder = DEFAULT_API_BASE;
    apiInput.autocomplete = 'off';
    apiInput.value = storage.get(API_BASE_KEY, DEFAULT_API_BASE);
    apiInput.addEventListener('change', () => {
      const next = apiInput.value.trim() || DEFAULT_API_BASE;
      storage.set(API_BASE_KEY, next);
      this.apiBase = this.normalizeApiBase(next);
      this.refreshStatus();
    });
    apiRow.append(apiLabel, apiInput);

    const connectionHelper = document.createElement('p');
    connectionHelper.className = 'field__hint';
    connectionHelper.textContent = 'Chat and events received via direct WebSocket. No sign-in required.';

    const chatroomRow = document.createElement('label');
    chatroomRow.className = 'field';
    const chatroomLabel = document.createElement('span');
    chatroomLabel.className = 'field__label';
    chatroomLabel.textContent = 'Chatroom ID (optional)';
    const chatroomInput = document.createElement('input');
    chatroomInput.type = 'text';
    chatroomInput.placeholder = 'eg. 644886';
    chatroomInput.autocomplete = 'off';
    chatroomInput.addEventListener('change', () => {
      const slug = normalizeChannel(this.channelInput ? this.channelInput.value : storage.get(CHANNEL_KEY, ''));
      this.setManualOverrideField(slug, 'chatroomId', chatroomInput.value.trim());
      this.populateDerivedInputs(slug);
      this.refreshStatus();
    });
    chatroomRow.append(chatroomLabel, chatroomInput);

    const channelIdRow = document.createElement('label');
    channelIdRow.className = 'field';
    const channelIdLabel = document.createElement('span');
    channelIdLabel.className = 'field__label';
    channelIdLabel.textContent = 'Channel numeric ID (optional)';
    const channelIdInput = document.createElement('input');
    channelIdInput.type = 'text';
    channelIdInput.placeholder = 'eg. 645115';
    channelIdInput.autocomplete = 'off';
    channelIdInput.addEventListener('change', () => {
      const slug = normalizeChannel(this.channelInput ? this.channelInput.value : storage.get(CHANNEL_KEY, ''));
      this.setManualOverrideField(slug, 'channelId', channelIdInput.value.trim());
      this.populateDerivedInputs(slug);
      this.refreshStatus();
    });
    channelIdRow.append(channelIdLabel, channelIdInput);

    const advancedToggle = document.createElement('button');
    advancedToggle.type = 'button';
    advancedToggle.className = 'btn btn--ghost source-card__advanced-toggle';
    advancedToggle.textContent = 'Show advanced options';

    const advancedGroup = document.createElement('div');
    advancedGroup.className = 'source-card__advanced';
    advancedGroup.append(apiRow, chatroomRow, channelIdRow);
    const advancedVisible = storage.get(ADVANCED_VISIBLE_KEY, '0') === '1';
    advancedGroup.hidden = !advancedVisible;
    if (advancedVisible) {
      advancedToggle.textContent = 'Hide advanced options';
      advancedToggle.setAttribute('aria-expanded', 'true');
    } else {
      advancedToggle.setAttribute('aria-expanded', 'false');
    }

    advancedToggle.addEventListener('click', () => {
      const nextVisible = advancedGroup.hidden;
      advancedGroup.hidden = !nextVisible;
      advancedToggle.textContent = nextVisible ? 'Hide advanced options' : 'Show advanced options';
      advancedToggle.setAttribute('aria-expanded', String(nextVisible));
      storage.set(ADVANCED_VISIBLE_KEY, nextVisible ? '1' : '0');
    });

    container.append(channelRow, connectionHelper, advancedToggle, advancedGroup);
    // Advanced inputs live inside the group so append after we set up toggle
    this.channelInput = channelInput;
    this.apiBaseInput = apiInput;
    this.chatroomInput = chatroomInput;
    this.channelIdInput = channelIdInput;

    this.apiBase = this.normalizeApiBase(apiInput.value || DEFAULT_API_BASE);

    const initialChannel = normalizeChannel(channelInput.value || storage.get(CHANNEL_KEY, ''));
    this.populateDerivedInputs(initialChannel);

    return container;
  }

  ensureStorageVersion() {
    const rawVersion = storage.get(STORAGE_VERSION_KEY, 0);
    const version = Number(rawVersion) || 0;
    if (version >= STORAGE_VERSION) {
      return;
    }

    // Reset legacy single-value overrides to avoid cross-channel leakage
    if (version < 2) {
      try { storage.remove('kick.chatroomOverride'); } catch (err) {}
      try { storage.remove('kick.channelOverride'); } catch (err) {}
      storage.set(MANUAL_OVERRIDES_KEY, {});
      storage.set(METADATA_CACHE_KEY, {});
      this.manualOverrides = null;
      this.metadataCache = null;
    }

    if (version < 5) {
      try {
        storage.remove(WS_BASE_KEY);
      } catch (err) {
        // ignore
      }
    }

    storage.set(STORAGE_VERSION_KEY, STORAGE_VERSION);
  }

  getManualOverrides() {
    if (!this.manualOverrides) {
      const raw = storage.get(MANUAL_OVERRIDES_KEY, {});
      this.manualOverrides = raw && typeof raw === 'object' ? raw : {};
    }
    return this.manualOverrides;
  }

  saveManualOverrides(map) {
    this.manualOverrides = map;
    storage.set(MANUAL_OVERRIDES_KEY, map);
  }

  getManualOverrideForChannel(slug) {
    const channel = normalizeChannel(slug);
    if (!channel) {
      return null;
    }
    const entry = this.getManualOverrides()[channel];
    if (!entry || typeof entry !== 'object') {
      return null;
    }
    const chatroomId = entry.chatroomId ? String(entry.chatroomId).trim() : '';
    const channelId = entry.channelId ? String(entry.channelId).trim() : '';
    if (!chatroomId && !channelId) {
      return null;
    }
    return {
      chatroomId: chatroomId || null,
      channelId: channelId || null,
      source: entry.source || 'manual',
      updatedAt: entry.updatedAt || null
    };
  }

  setManualOverrideField(slug, field, value) {
    const channel = normalizeChannel(slug);
    if (!channel) {
      return;
    }

    const overrides = { ...this.getManualOverrides() };
    const existing = { ...(overrides[channel] || {}) };
    const trimmed = value ? String(value).trim() : '';

    if (trimmed) {
      existing[field] = trimmed;
    } else {
      delete existing[field];
    }

    if (!existing.chatroomId && !existing.channelId) {
      delete overrides[channel];
      this.saveManualOverrides(overrides);
      this.clearMetadataCacheEntry(channel);
      return;
    }

    existing.source = 'manual';
    existing.updatedAt = Date.now();
    overrides[channel] = existing;
    this.saveManualOverrides(overrides);
    this.storeMetadataCache(channel, existing, 'manual');
  }

  getMetadataCache() {
    if (!this.metadataCache) {
      const raw = storage.get(METADATA_CACHE_KEY, {});
      this.metadataCache = raw && typeof raw === 'object' ? raw : {};
    }
    return this.metadataCache;
  }

  saveMetadataCache(map) {
    this.metadataCache = map;
    storage.set(METADATA_CACHE_KEY, map);
  }

  clearMetadataCacheEntry(slug) {
    const channel = normalizeChannel(slug);
    if (!channel) {
      return;
    }
    const cache = { ...this.getMetadataCache() };
    if (cache[channel]) {
      delete cache[channel];
      this.saveMetadataCache(cache);
    }
  }

  getCachedMetadataForChannel(slug, options = {}) {
    const { includeLegacy = true } = options;
    const channel = normalizeChannel(slug);
    if (!channel) {
      return null;
    }
    const cache = this.getMetadataCache();
    const entry = cache[channel];
    if (!entry) {
      return null;
    }
    const chatroomId = entry.chatroomId ? String(entry.chatroomId).trim() : '';
    const channelId = entry.channelId ? String(entry.channelId).trim() : '';
    const userId = entry.userId ? String(entry.userId).trim() : '';
    if (!chatroomId && !channelId) {
      return null;
    }
    const source = entry.source || 'api';
    if (!includeLegacy && source === 'legacy') {
      return null;
    }
    return {
      chatroomId: chatroomId || null,
      channelId: channelId || null,
      userId: userId || null,
      updatedAt: entry.updatedAt || null,
      source
    };
  }

  storeMetadataCache(slug, metadata, source = 'api') {
    const channel = normalizeChannel(slug);
    if (!channel || !metadata || !metadata.chatroomId) {
      return;
    }
    if (source === 'legacy') {
      return;
    }
    const cache = { ...this.getMetadataCache() };
    cache[channel] = {
      chatroomId: String(metadata.chatroomId).trim(),
      channelId: metadata.channelId ? String(metadata.channelId).trim() : null,
      userId: metadata.userId ? String(metadata.userId).trim() : null,
      updatedAt: Date.now(),
      source
    };
    this.saveMetadataCache(cache);
  }

  populateDerivedInputs(slug) {
    if (!this.chatroomInput && !this.channelIdInput) {
      return;
    }
    const manual = this.getManualOverrideForChannel(slug);
    const cached = this.getCachedMetadataForChannel(slug) || {};

    const chatroomValue = manual?.chatroomId || cached.chatroomId || '';
    const channelIdValue = manual?.channelId || cached.channelId || '';

    if (this.chatroomInput) {
      this.chatroomInput.value = chatroomValue ? String(chatroomValue) : '';
      const origin = manual?.chatroomId
        ? (manual.source === 'legacy' ? 'legacy' : 'manual')
        : cached.chatroomId ? (cached.source || 'cached') : '';
      this.chatroomInput.dataset.origin = origin;
    }
    if (this.channelIdInput) {
      this.channelIdInput.value = channelIdValue ? String(channelIdValue) : '';
      const origin = manual?.channelId
        ? (manual.source === 'legacy' ? 'legacy' : 'manual')
        : cached.channelId ? (cached.source || 'cached') : '';
      this.channelIdInput.dataset.origin = origin;
    }
  }

  getKnownMetadata(slug) {
    return this.getManualOverrideForChannel(slug) || this.getCachedMetadataForChannel(slug) || null;
  }

  normalizeApiBase(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return DEFAULT_API_BASE;
    }
    return trimmed.replace(/\/?$/, '');
  }

  refreshStatus() {
    if (!this.statusLabel) {
      return;
    }
    const channel = normalizeChannel(this.channelInput ? this.channelInput.value : storage.get(CHANNEL_KEY, ''));
    if (channel) {
      this.statusLabel.hidden = false;
      this.statusLabel.innerHTML = `Channel: <strong>${safeHtml(channel)}</strong>`;
    } else {
      this.statusLabel.hidden = true;
      this.statusLabel.textContent = '';
    }

    if (this.detailsLabel) {
      const known = this.getKnownMetadata(channel);
      const chatroomDisplay = this.chatroomId || known?.chatroomId || '';
      if (chatroomDisplay) {
        const sourceLabel = !this.chatroomId && known?.source
          ? ` (${known.source === 'manual' ? 'manual' : known.source === 'legacy' ? 'legacy' : 'cached'})`
          : '';
        this.detailsLabel.hidden = false;
        this.detailsLabel.textContent = `Chatroom ID: ${chatroomDisplay}${sourceLabel}`;
      } else {
        this.detailsLabel.hidden = false;
        const wsStatus = this.ws ? (this.ws.readyState === WebSocket.OPEN ? 'connected' : 'connecting') : 'disconnected';
        this.detailsLabel.textContent = `WebSocket: ${wsStatus}`;
      }
    }
  }

  async enable() {
    const sessionId = this.messenger.getSessionId();
    if (!sessionId) {
      this.reportError(new Error('Start a session before connecting Kick.'));
      return;
    }


    if (this.channelInput) {
      this.channelInput.setCustomValidity('');
    }

    let channel = normalizeChannel(this.channelInput ? this.channelInput.value : storage.get(CHANNEL_KEY, ''));
    if (!channel) {
      const canPrompt = typeof window !== 'undefined' && typeof window.prompt === 'function';
      const promptValue = canPrompt ? window.prompt('Enter the Kick channel name to connect with Kick.', '') : '';
      channel = normalizeChannel(promptValue || '');
      if (!channel) {
        this.reportError(new Error('Enter the Kick channel name.'));
        if (this.channelInput) {
          this.channelInput.focus();
        }
        return;
      }
    }

    if (WHITESPACE_PATTERN.test(channel)) {
      if (this.channelInput) {
        this.channelInput.value = channel;
        this.channelInput.setCustomValidity(CHANNEL_WHITESPACE_MESSAGE);
        this.channelInput.reportValidity();
        this.channelInput.focus();
      }
      this.reportError(new Error(CHANNEL_WHITESPACE_MESSAGE));
      return;
    }

    if (this.channelInput) {
      this.channelInput.value = channel;
    }

    const channelChanged = this.channelSlug !== null && this.channelSlug !== channel;
    this.channelSlug = channel;
    if (channelChanged) {
      this.clearProfileCache();
    }
    storage.set(CHANNEL_KEY, channel);
    this.apiBase = this.normalizeApiBase(this.apiBaseInput ? this.apiBaseInput.value : storage.get(API_BASE_KEY, DEFAULT_API_BASE));
    storage.set(API_BASE_KEY, this.apiBase);

    this.refreshStatus();

    try {
      const manual = this.getManualOverrideForChannel(channel);
      if (manual && manual.source === 'legacy' && channelChanged) {
        this.log(`Ignoring legacy Kick chatroom override for ${channel} after channel change. Verify the chatroom ID in advanced options.`);
      }
      const manualAllowed = manual && (manual.source !== 'legacy' || !channelChanged);
      const manualChatroom = manualAllowed && manual?.chatroomId ? String(manual.chatroomId).trim() : '';
      const manualChannelId = manualAllowed && manual?.channelId ? String(manual.channelId).trim() : '';

      let metadata = null;
      let metadataSource = 'api';

      if (manualChatroom) {
        metadata = {
          chatroomId: manualChatroom,
          channelId: manualChannelId || null,
          userId: manual?.userId || manualChannelId || null
        };
        metadataSource = manual?.source === 'manual' ? 'manual' : 'legacy';
        this.log(`Using ${metadataSource === 'manual' ? 'manual' : 'legacy'} Kick chatroom override for ${channel}.`);
      } else {
        try {
          metadata = await this.fetchChannelMetadata(channel);
          metadataSource = 'api';
        } catch (fetchErr) {
          const fallback = this.getCachedMetadataForChannel(channel, { includeLegacy: !channelChanged });
          if (fallback?.chatroomId) {
            metadata = {
              chatroomId: fallback.chatroomId,
              channelId: fallback.channelId || null,
              userId: fallback.userId || fallback.channelId || null
            };
            metadataSource = fallback.source || 'cache';
            this.log(`Kick API lookup failed: ${fetchErr?.message || fetchErr}. Using cached chatroom ${fallback.chatroomId}.`);
          } else {
            throw fetchErr;
          }
        }
      }

      if (!metadata || !metadata.chatroomId) {
        throw new Error('Unable to determine Kick chatroom ID. Provide it via advanced options if Kick blocks API access.');
      }

      this.chatroomId = metadata.chatroomId;
      this.channelNumericId = metadata.channelId ? String(metadata.channelId) : null;
      this.channelUserId = metadata.userId ? String(metadata.userId) : (this.channelNumericId || null);
      this.storeMetadataCache(channel, metadata, metadataSource);

      this.seenIds = new Set();
      this.populateDerivedInputs(channel);
      this.refreshStatus();

      await this.prepareEmotesForChannel(channel);
      this.setState('connecting');
      this.refreshStatus();
      this.connectWebsocket({
        wsBase: DEFAULT_WS_BASE,
        chatroomId: this.chatroomId,
        channelId: this.channelNumericId
      });
      this.log(`Connecting to Kick channel ${channel} via direct WebSocket.`);
    } catch (err) {
      this.resetConnectionState();
      const error = err instanceof Error ? err : new Error(err?.message || String(err));
      this.reportError(error);
    }
  }

  async fetchChannelMetadata(channel) {
    const url = `${this.apiBase}/channels/${encodeURIComponent(channel)}`;
    const data = await this.fetchJson(url);
    if (!data) {
      throw new Error('Kick channel lookup returned empty response. Provide the chatroom ID manually if needed.');
    }
    if (data.error) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Kick API returned an error for the channel lookup.');
    }
    const chatroomId = this.extractChatroomId(data);
    const channelId = this.extractChannelId(data);
    const userId = this.extractUserId(data);
    return { chatroomId, channelId, userId };
  }

  extractChannelId(payload) {
    if (!payload) return null;
    if (typeof payload.id === 'number' || typeof payload.id === 'string') {
      return payload.id;
    }
    if (payload.channel && (typeof payload.channel.id === 'number' || typeof payload.channel.id === 'string')) {
      return payload.channel.id;
    }
    return null;
  }

  extractUserId(payload) {
    if (!payload) return null;
    if (typeof payload.user_id === 'number' || typeof payload.user_id === 'string') {
      return payload.user_id;
    }
    if (payload.user && (typeof payload.user.id === 'number' || typeof payload.user.id === 'string')) {
      return payload.user.id;
    }
    if (payload.channel && (typeof payload.channel.user_id === 'number' || typeof payload.channel.user_id === 'string')) {
      return payload.channel.user_id;
    }
    return null;
  }

  extractChatroomId(payload) {
    if (!payload) return null;
    const inspect = (value) => {
      if (!value) return null;
      if (typeof value === 'object') {
        return value.id || value.chatroom_id || value.chatroomId;
      }
      return value;
    };

    return inspect(payload.chatroom)
      || inspect(payload.chat_room)
      || inspect(payload.chatRoom)
      || (payload.channel && inspect(payload.channel.chatroom))
      || payload.chatroom_id
      || null;
  }

  async emitMessage(payload) {
    if (!payload) {
      return;
    }

    try {
      const id = payload.id || payload.uuid || payload.message_id;
      if (id && this.seenIds.has(id)) {
        return;
      }
      if (id) {
        this.seenIds.add(id);
      }

      const sender = payload.sender || payload.user || {};
      let displayName = sender.username || sender.slug || sender.display_name || sender.name || 'Kick viewer';
      const baseAvatar = normalizeImage(sender.profile_picture || sender.profile_pic || sender.profile_pic_url || sender.avatar);
      const baseNameColor = sender.identity?.color || sender.color;
      const baseBadges = mapBadges(sender.identity?.badges || sender.badges);

      const enrichment = await this.resolveSenderDetails(sender);
      const avatar = normalizeImage(enrichment?.avatar || baseAvatar);
      const nameColor = enrichment?.nameColor || baseNameColor;
      const badges = mergeBadges(baseBadges, enrichment?.badges || []);
      if (enrichment?.displayName) {
        displayName = enrichment.displayName;
      }

      const event = eventNameForType(payload.type || payload.event || payload.message_type);

      let rawText = extractSegments(payload.message || payload.content || payload.body || payload.data);
      if (!rawText && payload.message_text) {
        rawText = payload.message_text;
      }
      const rendered = this.renderNativeContent(rawText, payload);
      const text = rendered.html || '';

      if (!text && event === 'message') {
        return;
      }

      const timestamp = Date.parse(payload.created_at || payload.timestamp || payload.inserted_at || '') || Date.now();

      const message = {
        id: id ? `kick-${id}` : `kick-${timestamp}`,
        type: 'kick',
        chatname: displayName,
        chatmessage: text,
        chatimg: avatar || '',
        timestamp,
        event,
        chatbadges: badges,
        nameColor,
        raw: payload,
        previewText: rendered.preview || rawText || ''
      };

      if (enrichment?.membership) {
        message.membership = enrichment.membership;
      }
      if (enrichment?.isVip) {
        message.vip = true;
      }
      if (enrichment?.isMod) {
        message.mod = true;
      }

      if (event === 'gift') {
        const gift = payload.gift || payload.meta?.gift;
        if (gift) {
          const summary = [gift.name || gift.title || 'Gift'];
          if (gift.quantity || gift.count) {
            summary.push(`×${gift.quantity || gift.count}`);
          }
          message.chatmessage = safeHtml(summary.join(' '));
          message.hasDonation = gift.name || gift.title || 'Gift';
          if (gift.value || gift.amount) {
            message.donationAmount = gift.value || gift.amount;
          }
          message.previewText = htmlToText(message.chatmessage);
        } else if (payload.meta?.message) {
          message.chatmessage = safeHtml(payload.meta.message);
          message.previewText = htmlToText(message.chatmessage);
        }
      } else if (event === 'donation') {
        const amount = payload.amount || payload.value || payload.meta?.amount;
        if (amount) {
          message.hasDonation = `${amount}`;
          message.donationAmount = amount;
        }
        if (!message.chatmessage && payload.meta?.message) {
          message.chatmessage = safeHtml(payload.meta.message);
        }
        message.previewText = htmlToText(message.chatmessage);
      } else if (event === 'subscription') {
        const tier = payload.meta?.tier || payload.subscription_tier;
        const textValue = tier ? `Subscribed (${tier})` : 'Subscribed';
        message.chatmessage = safeHtml(textValue);
        message.hasDonation = textValue;
        message.previewText = htmlToText(message.chatmessage);
      }

      await this.publishWithEmotes(message);

      if (this.seenIds.size > HISTORY_LIMIT) {
        const extras = this.seenIds.size - HISTORY_LIMIT;
        const iterator = this.seenIds.values();
        for (let i = 0; i < extras; i += 1) {
          const next = iterator.next();
          if (next.done) break;
          this.seenIds.delete(next.value);
        }
      }
    } catch (err) {
      this.log(`Failed to emit Kick message: ${err?.message || err}`);
    }
  }

  buildKickAssetUrl({ id, source, type = 'emote' } = {}) {
    if (source) {
      const normalized = normalizeImage(source);
      if (normalized) {
        return normalized;
      }
    }
    if (!id && id !== 0) {
      return '';
    }
    const trimmed = String(id).trim();
    const safeId = trimmed.replace(/[^0-9]/g, '');
    if (!safeId) {
      return '';
    }
    const size = type === 'sticker' ? 'fullsize' : 'fullsize';
    return `https://files.kick.com/emotes/${encodeURIComponent(safeId)}/${size}`;
  }

  buildKickTokenMarkup({ type = 'emote', id, code, source } = {}) {
    const kind = type === 'sticker' ? 'sticker' : 'emote';
    const label = sanitizeKickTokenCode(code) || (id ? `${kind}-${id}` : kind);
    const alt = safeHtml(label || kind);
    const src = this.buildKickAssetUrl({ id, source, type: kind });
    const preview = label ? `:${label}:` : `[${kind}]`;
    if (!src) {
      return {
        html: safeHtml(preview),
        preview
      };
    }
    const className = kind === 'sticker' ? 'kick-sticker' : 'kick-emote';
    return {
      html: `<img src="${src}" alt="${alt}" title="${alt}" class="${className}" loading="lazy" decoding="async">`,
      preview
    };
  }

  extractStickerDetails(payload) {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const candidates = [];
    const meta = payload.metadata || {};
    if (meta) {
      if (meta.sticker) candidates.push(meta.sticker);
      if (Array.isArray(meta.stickers)) candidates.push(...meta.stickers);
      if (meta.emote) candidates.push(meta.emote);
      if (Array.isArray(meta.emotes)) candidates.push(...meta.emotes);
      if (meta.asset) candidates.push(meta.asset);
    }
    if (payload.sticker) candidates.push(payload.sticker);
    if (payload.emote) candidates.push(payload.emote);
    if (payload.data && typeof payload.data === 'object') {
      const dataObj = payload.data;
      if (dataObj.sticker) candidates.push(dataObj.sticker);
      if (Array.isArray(dataObj.stickers)) candidates.push(...dataObj.stickers);
      if (dataObj.emote) candidates.push(dataObj.emote);
    }

    for (let i = 0; i < candidates.length; i += 1) {
      const item = candidates[i];
      if (!item) {
        continue;
      }
      if (typeof item === 'string') {
        return {
          id: null,
          name: sanitizeKickTokenCode(item),
          src: null
        };
      }

      const id = item.id
        || item.sticker_id
        || item.stickerId
        || item.emote_id
        || item.emoteId
        || item.emoteID;
      const name = sanitizeKickTokenCode(
        item.name
        || item.code
        || item.label
        || item.title
        || item.text
        || item.slug
      );

      let source = item.src
        || item.url
        || item.image
        || item.image_url
        || item.imageUrl
        || item.asset
        || item.path
        || item.gif
        || item.webp
        || item.webm
        || item.picture
        || item.icon;

      if (!source && item.images && typeof item.images === 'object') {
        source = item.images.full
          || item.images.large
          || item.images.original
          || item.images.default
          || item.images.src;
      }

      if (!source && item.light && item.light.url) {
        source = item.light.url;
      }
      if (!source && item.dark && item.dark.url) {
        source = item.dark.url;
      }

      const normalized = source ? normalizeImage(source) : null;
      if (id || normalized) {
        return {
          id: id || null,
          name,
          src: normalized || null
        };
      }
    }

    return null;
  }

  renderNativeContent(rawText, payload) {
    const baseText = typeof rawText === 'string' ? rawText : '';
    if (baseText) {
      const segments = [];
      const previewSegments = [];
      let matched = false;
      let lastIndex = 0;
      KICK_TOKEN_PATTERN.lastIndex = 0;
      let match;
      while ((match = KICK_TOKEN_PATTERN.exec(baseText)) !== null) {
        matched = true;
        const [fullMatch, typeRaw, idRaw, codeRaw] = match;
        const leading = baseText.slice(lastIndex, match.index);
        if (leading) {
          segments.push(safeHtml(leading));
          previewSegments.push(leading);
        }
        const token = this.buildKickTokenMarkup({ type: typeRaw, id: idRaw, code: codeRaw });
        segments.push(token.html);
        previewSegments.push(token.preview);
        lastIndex = match.index + fullMatch.length;
      }
      const trailing = baseText.slice(lastIndex);
      if (trailing) {
        segments.push(safeHtml(trailing));
        previewSegments.push(trailing);
      }
      if (matched) {
        return {
          html: segments.join(''),
          preview: previewSegments.join('')
        };
      }
    }

    const stickerDetails = this.extractStickerDetails(payload);
    const baseHtml = baseText ? safeHtml(baseText) : '';
    if (stickerDetails) {
      const token = this.buildKickTokenMarkup({
        type: 'sticker',
        id: stickerDetails.id,
        code: stickerDetails.name,
        source: stickerDetails.src || undefined
      });
      if (!baseHtml) {
        return token;
      }
      const needsSpace = baseText && !/\s$/.test(baseText);
      const separator = needsSpace ? ' ' : '';
      return {
        html: `${baseHtml}${separator}${token.html}`,
        preview: `${baseText}${needsSpace ? ' ' : ''}${token.preview}`
      };
    }

    return {
      html: baseHtml,
      preview: baseText || ''
    };
  }

  buildEmoteContext(channelOverride = null) {
    const context = { platform: 'kick' };
    const slug = channelOverride ? normalizeChannel(channelOverride) : this.channelSlug;
    if (slug) {
      context.channelName = slug;
    }
    if (this.channelNumericId) {
      context.channelId = String(this.channelNumericId);
    }
    if (this.channelUserId) {
      context.userId = String(this.channelUserId);
    }
    return context;
  }

  async prepareEmotesForChannel(channel) {
    if (!this.emotes) {
      return;
    }
    const context = this.buildEmoteContext(channel);
    if (!context.channelName && !context.channelId && !context.userId) {
      return;
    }
    await this.emotes.prepareChannel(context).catch(() => {});
  }

  async publishWithEmotes(message, options = {}) {
    if (!message) {
      return;
    }
    const { silent = false, note = null } = options;

    if (typeof message.previewText !== 'string' || !message.previewText.length) {
      message.previewText = htmlToText(message.chatmessage || '');
    }

    if (this.emotes && message.chatmessage && !message.textonly) {
      try {
        message.chatmessage = await this.emotes.render(message.chatmessage, this.buildEmoteContext());
      } catch (err) {
        this.debugLog('Failed to render Kick emotes', { error: err?.message || err });
      }
    }

    const publishOptions = { silent };
    if (note) {
      publishOptions.note = note;
    }
    this.publish(message, publishOptions);
  }

  connectWebsocket({ wsBase, chatroomId, channelId }) {
    this.disconnectWebsocket();

    const base = (wsBase || DEFAULT_WS_BASE).replace(/\/?$/, '');
    const url = `${base}/app/${PUSHER_APP_KEY}?protocol=7&client=js&version=8.4.0&flash=false`;

    this.desiredChannels = this.buildChannelList(chatroomId, channelId);
    this.pendingSubscriptions = new Set(this.desiredChannels);
    this.connectionEstablished = false;
    this.setState('connecting');

    try {
      this.ws = new WebSocket(url);
    } catch (err) {
      throw new Error(`Failed to open Kick websocket (${err?.message || err}).`);
    }

    this.wsOpenHandler = () => {
      this.log('Kick websocket opened');
    };
    this.wsMessageHandler = (event) => this.handleWsMessage(event);
    this.wsCloseHandler = (event) => this.handleWsClose(event);
    this.wsErrorHandler = (event) => {
      const message = event?.message || event?.reason || 'Unknown websocket error';
      this.log(`Kick websocket error: ${message}`);
    };

    this.ws.addEventListener('open', this.wsOpenHandler);
    this.ws.addEventListener('message', this.wsMessageHandler);
    this.ws.addEventListener('close', this.wsCloseHandler);
    this.ws.addEventListener('error', this.wsErrorHandler);
  }

  buildChannelList(chatroomId, channelId) {
    const base = [];
    if (chatroomId) {
      base.push(`chatrooms.${chatroomId}.v2`, `chatrooms.${chatroomId}`, `chatroom_${chatroomId}`);
    }
    if (channelId) {
      const id = String(channelId).trim();
      if (id) {
        base.push(`channel.${id}`, `channel_${id}`);
      }
    }
    return Array.from(new Set(base.filter(Boolean)));
  }

  profileCacheKeys(ids) {
    return buildProfileCacheKeys(ids);
  }

  getCachedProfile(ids) {
    return getProfileCacheEntry(this.profileCache, ids);
  }

  storeProfileCache(ids, profile) {
    storeProfileCacheEntry(this.profileCache, ids, profile);
  }

  async resolveSenderDetails(sender) {
    const details = { badges: [] };
    if (!sender || typeof sender !== 'object') {
      return details;
    }

    const username = normalizeChannel(sender.username || sender.slug || sender.display_name || sender.name || '');
    const userId = sender.id || sender.user_id || sender.userId || sender.identity?.id;

    const directAvatar = sender.profile_picture || sender.profile_pic || sender.profile_pic_url || sender.avatar;
    if (directAvatar) {
      details.avatar = normalizeImage(directAvatar);
    }

    const directColor = sender.identity?.color || sender.color;
    if (directColor) {
      details.nameColor = directColor;
    }

    const directBadges = mapBadges(sender.identity?.badges || sender.badges);
    if (directBadges.length) {
      details.badges = mergeBadges(details.badges, directBadges);
    }

    if (sender.identity?.badge_info) {
      if (sender.identity.badge_info.moderator || sender.identity.badge_info.mod) {
        details.isMod = true;
      }
      if (sender.identity.badge_info.vip || sender.identity.badge_info.vip_since) {
        details.isVip = true;
      }
    }
    if (sender.is_moderator || sender.moderator) {
      details.isMod = true;
    }
    if (sender.is_vip || sender.vip) {
      details.isVip = true;
    }

    if (!username && !userId) {
      return details;
    }

    const ids = { username, userId };
    const cacheEntry = this.getCachedProfile(ids);
    if (cacheEntry !== undefined) {
      if (cacheEntry.hasProfile && cacheEntry.profile) {
        return mergeProfileDetails(details, cacheEntry.profile);
      }
      return details;
    }

    const fetched = await this.fetchProfileDetails(ids);
    if (fetched !== undefined) {
      this.storeProfileCache(ids, fetched);
      if (fetched) {
        return mergeProfileDetails(details, fetched);
      }
    }

    return details;
  }

  async fetchProfileDetails(ids) {
    if (!ids) {
      return null;
    }
    const cacheKey = ids.userId ? `id:${ids.userId}` : ids.username ? `name:${ids.username}` : null;
    if (!cacheKey) {
      return null;
    }

    if (this.profileFetches.has(cacheKey)) {
      return this.profileFetches.get(cacheKey);
    }

    const fetchPromise = (async () => {
      const profile = await this.lookupProfileData(ids);
      return profile;
    })().catch((err) => {
      this.log(`Kick profile lookup failed for ${ids.username || ids.userId}: ${err?.message || err}`);
      return null;
    });

    this.profileFetches.set(cacheKey, fetchPromise);
    const result = await fetchPromise;
    this.profileFetches.delete(cacheKey);
    return result;
  }

  async lookupProfileData(ids) {
    const endpoints = this.buildProfileEndpoints(ids);
    for (let i = 0; i < endpoints.length; i += 1) {
      const endpoint = endpoints[i];
      try {
        const data = await this.fetchJson(endpoint);
        const profile = this.parseProfileResponse(data);
        if (profile) {
          return profile;
        }
      } catch (err) {
        this.log(`Kick profile endpoint failed (${endpoint}): ${err?.message || err}`);
      }
    }
    return null;
  }

  buildProfileEndpoints({ userId, username }) {
    const endpoints = [];
    const apiBase = this.apiBase || DEFAULT_API_BASE;
    const channel = this.channelSlug;
    const encodedChannel = channel ? encodeURIComponent(channel) : null;
    const encodedUsername = username ? encodeURIComponent(username) : null;
    const encodedId = userId ? encodeURIComponent(userId) : null;

    if (encodedId) {
      endpoints.push(`${apiBase}/users/${encodedId}`);
    }
    if (encodedUsername) {
      endpoints.push(`${apiBase}/users/${encodedUsername}`);
    }
    if (encodedChannel && encodedUsername) {
      endpoints.push(`${apiBase}/channels/${encodedChannel}/users/${encodedUsername}`);
    }

    const rootBase = apiBase.replace(/\/api\/v2$/, '');
    if (rootBase && rootBase !== apiBase) {
      if (encodedChannel && encodedUsername) {
        endpoints.push(`${rootBase}/channels/${encodedChannel}/${encodedUsername}`);
      }
      if (encodedUsername) {
        endpoints.push(`${rootBase}/users/${encodedUsername}`);
      }
      if (encodedId) {
        endpoints.push(`${rootBase}/users/${encodedId}`);
      }
    }

    if (encodedId) {
      endpoints.push(`https://kick.com/api/v2/users/${encodedId}`);
    }
    if (encodedChannel && encodedUsername) {
      endpoints.push(`https://kick.com/channels/${encodedChannel}/${encodedUsername}`);
    }

    return endpoints.filter((value, index, self) => value && self.indexOf(value) === index);
  }

  parseProfileResponse(data) {
    if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
      return null;
    }

    const profile = {
      badges: []
    };

    const inspect = (obj) => {
      if (!obj || typeof obj !== 'object') {
        return;
      }

      const avatarCandidate = obj.profile_picture || obj.profile_pic || obj.profilepic || obj.profile_picture_url || obj.avatar || obj.image_url || obj.image;
      if (avatarCandidate && typeof avatarCandidate === 'string' && !profile.avatar) {
        profile.avatar = normalizeImage(avatarCandidate);
      }

      const colorCandidate = (obj.identity && obj.identity.color) || obj.color || obj.name_color || obj.hex_color;
      if (colorCandidate && typeof colorCandidate === 'string' && !profile.nameColor) {
        profile.nameColor = colorCandidate;
      }

      const membershipCandidate = obj.membership || obj.membership_name || obj.subscription?.name || obj.subscription?.title || obj.subscription?.tier;
      if (membershipCandidate && typeof membershipCandidate === 'string' && membershipCandidate.trim() && !profile.membership) {
        profile.membership = membershipCandidate.trim();
      }

      if (obj.roles && Array.isArray(obj.roles)) {
        if (!profile.isVip && obj.roles.some((role) => typeof role === 'string' && role.toLowerCase().includes('vip'))) {
          profile.isVip = true;
        }
        if (!profile.isMod && obj.roles.some((role) => typeof role === 'string' && role.toLowerCase().includes('mod'))) {
          profile.isMod = true;
        }
      }
      if (obj.is_moderator || obj.moderator || obj.role === 'moderator' || obj.is_mod) {
        profile.isMod = true;
      }
      if (obj.is_vip || obj.vip) {
        profile.isVip = true;
      }

      if (obj.level && !profile.level) {
        profile.level = obj.level;
      }
      if (obj.display_name && !profile.displayName) {
        profile.displayName = obj.display_name;
      }
      if (obj.username && !profile.displayName) {
        profile.displayName = obj.username;
      }
      if (obj.slug && !profile.displayName) {
        profile.displayName = obj.slug;
      }
      if (obj.name && !profile.displayName) {
        profile.displayName = obj.name;
      }
      if (obj.title && !profile.subtitle) {
        profile.subtitle = obj.title;
      }
      if (obj.subtitle && !profile.subtitle) {
        profile.subtitle = obj.subtitle;
      }

      if (obj.identity?.badges) {
        profile.badges = mergeBadges(profile.badges, mapBadges(obj.identity.badges));
      }
      if (obj.badges) {
        profile.badges = mergeBadges(profile.badges, mapBadges(obj.badges));
      }
      if (obj.badge_collection) {
        profile.badges = mergeBadges(profile.badges, mapBadges(obj.badge_collection));
      }
    };

    if (Array.isArray(data)) {
      data.forEach((entry) => inspect(entry));
    } else {
      inspect(data);
      inspect(data.data);
      inspect(data.user);
      inspect(data.profile);
      if (Array.isArray(data.users)) {
        data.users.forEach((entry) => inspect(entry));
      }
    }

    if (!profile.avatar && !profile.badges.length && !profile.nameColor && !profile.membership && !profile.isVip && !profile.isMod && !profile.displayName) {
      return null;
    }

    profile.badges = profile.badges.length ? profile.badges : [];
    return profile;
  }

  clearProfileCache() {
    this.profileCache.clear();
    this.profileFetches.clear();
  }

  handleWsMessage(event) {
    if (!event?.data) {
      return;
    }
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (err) {
      this.log(`Kick websocket received non-JSON frame: ${event.data}`);
      return;
    }

    const eventName = payload?.event;
    if (!eventName) {
      return;
    }

    if (eventName === 'pusher:connection_established') {
      this.connectionEstablished = true;
      let connectionData = {};
      try {
        connectionData = JSON.parse(payload.data || '{}');
      } catch (err) {
        connectionData = {};
      }
      this.startPingTimer(connectionData.activity_timeout || 60);
      this.desiredChannels.forEach((channel) => {
        this.sendWsFrame('pusher:subscribe', { channel, auth: '' });
      });
      return;
    }

    if (eventName === 'pusher_internal:subscription_succeeded') {
      let info = payload.data;
      if (typeof info === 'string') {
        try { info = JSON.parse(info); } catch (err) { info = {}; }
      }
      const channelName = payload.channel || info?.channel;
      if (channelName) {
        this.pendingSubscriptions?.delete(channelName);
        if (!this.pendingSubscriptions || this.pendingSubscriptions.size === 0) {
          this.setState('connected');
          this.log('Kick websocket subscribed');
        }
      }
      return;
    }

    if (eventName === 'pusher:ping') {
      this.sendWsFrame('pusher:pong', {});
      return;
    }

    if (eventName === 'pusher:error') {
      this.log(`Kick websocket error event: ${payload?.data?.message || payload?.data || 'Unknown'}`);
      return;
    }

    let data = payload.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (err) {
        // keep as raw string
      }
    }

    if (eventName === 'App\\Events\\ChatMessageEvent') {
      this.emitMessage(data?.message || data);
      return;
    }

    if (eventName === 'App\\Events\\GiftPurchaseEvent') {
      if (data?.event === 'gift' || data?.gift) {
        this.emitMessage(data);
      }
      return;
    }

    if (eventName === 'App\\Events\\ChannelSubscriptionEvent') {
      this.emitMessage({
        id: data?.id || `kick-sub-${Date.now()}`,
        type: 'kick',
        chatname: data?.user?.username || 'Kick viewer',
        chatmessage: data?.message || 'Subscribed',
        hasDonation: 'Subscribed',
        timestamp: Date.now(),
        event: 'subscription'
      });
      return;
    }

    if (eventName === 'App\\Events\\ChatMessageDeletedEvent') {
      const targetId = data?.message_id || data?.id;
      if (targetId && this.seenIds.has(targetId)) {
        this.seenIds.delete(targetId);
        this.messenger.send({ type: 'kick', id: `kick-${targetId}`, deleted: true });
      }
      return;
    }

    // Unhandled events can still be useful for debugging
    this.log(`Unhandled Kick event: ${eventName}`);
  }

  handleWsClose(event) {
    this.log(`Kick websocket closed (${event?.code || 'unknown code'})`);
    if (this.pingTimer) {
      window.clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.manualClose) {
      this.manualClose = false;
      return;
    }
    if (this.state === 'connected') {
      this.setState('connecting');
    }
    this.scheduleReconnect();
  }

  scheduleReconnect(delay = 5000) {
    if (this.reconnectTimer) {
      return;
    }
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.chatroomId) {
        return;
      }
      const wsBase = this.wsBaseInput ? (this.wsBaseInput.value.trim() || DEFAULT_WS_BASE) : storage.get(WS_BASE_KEY, DEFAULT_WS_BASE);
      this.connectWebsocket({ wsBase, chatroomId: this.chatroomId, channelId: this.channelNumericId });
    }, delay);
  }

  sendWsFrame(eventName, data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }
    try {
      this.ws.send(JSON.stringify({ event: eventName, data }));
    } catch (err) {
      this.log(`Failed to send websocket frame: ${err?.message || err}`);
    }
  }

  startPingTimer(activityTimeout) {
    if (this.pingTimer) {
      window.clearInterval(this.pingTimer);
    }
    const intervalMs = Math.max(10000, (activityTimeout || 60) * 750);
    this.pingTimer = window.setInterval(() => {
      this.sendWsFrame('pusher:ping', {});
    }, intervalMs);
  }

  disconnectWebsocket() {
    if (this.pingTimer) {
      window.clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.manualClose = true;
      try {
        if (this.wsOpenHandler) {
          this.ws.removeEventListener('open', this.wsOpenHandler);
        }
        if (this.wsMessageHandler) {
          this.ws.removeEventListener('message', this.wsMessageHandler);
        }
        if (this.wsCloseHandler) {
          this.ws.removeEventListener('close', this.wsCloseHandler);
        }
        if (this.wsErrorHandler) {
          this.ws.removeEventListener('error', this.wsErrorHandler);
        }
      } catch (err) {
        // ignore
      }
      try {
        this.ws.close(1000, 'Closing');
      } catch (err) {
        // ignore
      }
      this.ws = null;
    }
    this.wsOpenHandler = null;
    this.wsMessageHandler = null;
    this.wsCloseHandler = null;
    this.wsErrorHandler = null;
    if (!this.ws) {
      this.manualClose = false;
    }
  }

  async fetchJson(url) {
    let response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        credentials: 'omit',
        mode: 'cors'
      });
    } catch (networkErr) {
      const reason = networkErr instanceof Error ? networkErr.message : String(networkErr);
      throw new Error(`Unable to reach Kick API (${reason}). If this persists, configure a Kick API proxy in settings.`);
    }

    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      let detail = '';
      try {
        const parsed = text ? JSON.parse(text) : null;
        if (parsed?.error) {
          detail = parsed.error;
        } else if (parsed?.message) {
          detail = parsed.message;
        }
      } catch (err) {
        // ignore JSON parse error for error detail – we already have status code
      }
      const base = `Kick API responded with HTTP ${response.status}`;
      const suffix = detail ? ` – ${detail}` : '';
      throw new Error(`${base}${suffix || ''}. If Kick blocks browser requests, set a Kick API base that points to your proxy.`);
    }

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      const snippet = text.slice(0, 160).trim();
      if (!/json/i.test(contentType)) {
        throw new Error(`Kick API did not return JSON (content-type: ${contentType || 'unknown'}). ${snippet || 'Empty response.'} Configure a Kick proxy that returns JSON.`);
      }
      throw new Error(`Failed to parse Kick API response. Received: ${snippet || 'empty body'}`);
    }
  }

  resetConnectionState() {
    this.disconnectWebsocket();
    this.chatroomId = null;
    this.channelNumericId = null;
    this.channelUserId = null;
    this.seenIds.clear();
    this.pendingSubscriptions = null;
    this.desiredChannels = null;
    this.profileFetches.clear();
    this.refreshStatus();
  }

  disable() {
    this.resetConnectionState();
    this.setState('idle');
    this.clearProfileCache();
  }
}
