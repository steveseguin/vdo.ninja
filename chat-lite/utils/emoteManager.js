const CHANNEL_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const GLOBAL_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const TOKEN_REGEX = /(?<=^|\s)(\S+?)(?=$|\s)/g;

function escapeAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mergeWithPriority(target, source, options = {}) {
  const { override = false } = options;
  const base = target || {};
  if (!source) {
    return base;
  }
  Object.keys(source).forEach((key) => {
    if (override || !Object.prototype.hasOwnProperty.call(base, key)) {
      base[key] = source[key];
    }
  });
  return base;
}

function combineProviderMaps(globalMap, channelMap) {
  if (!globalMap && !channelMap) {
    return null;
  }
  return Object.assign({}, globalMap || {}, channelMap || {});
}

function pickFfzUrl(emote) {
  if (!emote || !emote.urls) {
    return null;
  }
  const entries = Object.entries(emote.urls);
  if (!entries.length) {
    return null;
  }
  const preferred = entries
    .map(([scale, url]) => ({ scale: Number(scale) || 0, url }))
    .sort((a, b) => b.scale - a.scale)[0];
  if (!preferred || !preferred.url) {
    return null;
  }
  return preferred.url.startsWith('http') ? preferred.url : `https:${preferred.url}`;
}

function flattenBttv(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const map = {};
  const apply = (list) => {
    if (!Array.isArray(list)) {
      return;
    }
    list.forEach((emote) => {
      if (!emote || !emote.id || !emote.code) {
        return;
      }
      map[emote.code] = `https://cdn.betterttv.net/emote/${emote.id}/2x`;
    });
  };
  apply(data.sharedEmotes);
  apply(data.channelEmotes);
  return Object.keys(map).length ? map : null;
}

function flattenSeven(data) {
  const set = data && data.emote_set && Array.isArray(data.emote_set.emotes) ? data.emote_set.emotes : null;
  if (!set) {
    return null;
  }
  const map = {};
  set.forEach((emote) => {
    if (!emote || !emote.id || !emote.name) {
      return;
    }
    const url = `https://cdn.7tv.app/emote/${emote.id}/2x.webp`;
    const flags = (emote.data && emote.data.flags) || emote.flags || 0;
    if (flags) {
      map[emote.name] = { url, zw: true };
    } else {
      map[emote.name] = url;
    }
  });
  return Object.keys(map).length ? map : null;
}

function flattenFfz(data) {
  const sets = data && data.sets ? Object.values(data.sets) : null;
  if (!sets || !sets.length) {
    return null;
  }
  const map = {};
  sets.forEach((set) => {
    if (!set || !Array.isArray(set.emoticons)) {
      return;
    }
    set.emoticons.forEach((emote) => {
      if (!emote || !emote.name) {
        return;
      }
      const url = pickFfzUrl(emote);
      if (url) {
        map[emote.name] = url;
      }
    });
  });
  return Object.keys(map).length ? map : null;
}

function replaceEmotesWithImages(message, emoteMap) {
  if (!emoteMap || typeof message !== 'string') {
    return message;
  }
  return message.replace(TOKEN_REGEX, (match, token) => {
    const entry = emoteMap[token];
    if (!entry) {
      return match;
    }
    const alt = escapeAttribute(match);
    if (typeof entry === 'string') {
      return `<img src="${entry}" alt="${alt}" class="third-party-emote zero-width-friendly" loading="lazy" decoding="async">`;
    }
    if (entry && entry.url) {
      if (entry.zw) {
        return `<span class="zero-width-span"><img src="${entry.url}" alt="${alt}" class="zero-width-emote" loading="lazy" decoding="async"></span>`;
      }
      return `<img src="${entry.url}" alt="${alt}" class="third-party-emote zero-width-friendly" loading="lazy" decoding="async">`;
    }
    return match;
  });
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export class EmoteManager {
  constructor() {
    this.channelCache = new Map();
    this.channelPromises = new Map();
    this.globalCache = new Map();
    this.globalPromises = new Map();
  }

  buildChannelKey(context = {}) {
    const platform = (context.platform || 'unknown').toLowerCase();
    const userId = context.userId ? String(context.userId).toLowerCase() : '';
    const channelId = context.channelId ? String(context.channelId).toLowerCase() : '';
    const channelName = context.channelName ? String(context.channelName).toLowerCase() : '';
    const identifier = userId || channelId || channelName || 'global';
    return `${platform}:${identifier}`;
  }

  async prepareChannel(context = {}) {
    try {
      await this.ensureChannelMap(context);
    } catch (err) {
      console.warn('Emote warmup failed', err);
    }
  }

  async render(text, context = {}) {
    if (typeof text !== 'string' || !text.trim()) {
      return text;
    }
    try {
      const entry = await this.ensureChannelMap(context);
      const map = entry && entry.map;
      if (!map || !Object.keys(map).length) {
        return text;
      }
      return replaceEmotesWithImages(text, map);
    } catch (err) {
      console.warn('Emote render failed', err);
      return text;
    }
  }

  async ensureChannelMap(context = {}) {
    const key = this.buildChannelKey(context);
    const cached = this.channelCache.get(key);
    const now = Date.now();
    if (cached && now - cached.timestamp < CHANNEL_CACHE_TTL_MS) {
      return cached;
    }
    if (this.channelPromises.has(key)) {
      return this.channelPromises.get(key);
    }
    const fetchPromise = this.fetchChannelEmotes(context)
      .then((map) => {
        const entry = { map, timestamp: Date.now() };
        this.channelCache.set(key, entry);
        this.channelPromises.delete(key);
        return entry;
      })
      .catch((err) => {
        this.channelPromises.delete(key);
        throw err;
      });
    this.channelPromises.set(key, fetchPromise);
    return fetchPromise;
  }

  async fetchChannelEmotes(context = {}) {
    const platform = (context.platform || 'unknown').toLowerCase();
    const normalized = {
      platform,
      channelName: context.channelName ? String(context.channelName).toLowerCase() : '',
      channelId: context.channelId ? String(context.channelId) : '',
      userId: context.userId ? String(context.userId) : ''
    };

    const [globalBttv, globalSeven, globalFfz] = await Promise.all([
      this.getGlobalProvider('bttv'),
      this.getGlobalProvider('seventv'),
      this.getGlobalProvider('ffz')
    ]);

    const [bttvChannel, sevenChannel, ffzChannel] = await Promise.all([
      this.fetchBttvChannel(normalized).catch(() => null),
      this.fetchSevenChannel(normalized).catch(() => null),
      this.fetchFfzChannel(normalized).catch(() => null)
    ]);

    const combinedMaps = [];

    const combinedBttv = combineProviderMaps(globalBttv, bttvChannel);
    if (combinedBttv) {
      combinedMaps.push({ map: combinedBttv, override: true });
    }

    const combinedSeven = combineProviderMaps(globalSeven, sevenChannel);
    if (combinedSeven) {
      combinedMaps.push({ map: combinedSeven, override: false });
    }

    const combinedFfz = combineProviderMaps(globalFfz, ffzChannel);
    if (combinedFfz) {
      combinedMaps.push({ map: combinedFfz, override: false });
    }

    let aggregated = {};
    combinedMaps.forEach((entry, index) => {
      const shouldOverride = index === 0 ? true : entry.override;
      aggregated = mergeWithPriority(aggregated, entry.map, { override: shouldOverride });
    });

    return aggregated;
  }

  async getGlobalProvider(provider) {
    const cached = this.globalCache.get(provider);
    const now = Date.now();
    if (cached && now - cached.timestamp < GLOBAL_CACHE_TTL_MS) {
      return cached.map;
    }
    if (this.globalPromises.has(provider)) {
      return this.globalPromises.get(provider);
    }

    const promise = this.fetchGlobalProvider(provider)
      .then((map) => {
        this.globalCache.set(provider, { map, timestamp: Date.now() });
        this.globalPromises.delete(provider);
        return map;
      })
      .catch((err) => {
        this.globalPromises.delete(provider);
        console.warn(`Failed to fetch global ${provider} emotes`, err);
        return {};
      });

    this.globalPromises.set(provider, promise);
    return promise;
  }

  async fetchGlobalProvider(provider) {
    try {
      if (provider === 'bttv') {
        const data = await fetchJson('https://api.betterttv.net/3/cached/emotes/global');
        if (!Array.isArray(data)) {
          return {};
        }
        const map = {};
        data.forEach((emote) => {
          if (emote && emote.id && emote.code) {
            map[emote.code] = `https://cdn.betterttv.net/emote/${emote.id}/2x`;
          }
        });
        return map;
      }
      if (provider === 'seventv') {
        const data = await fetchJson('https://7tv.io/v3/emote-sets/global');
        if (!data || !Array.isArray(data.emotes)) {
          return {};
        }
        const map = {};
        data.emotes.forEach((emote) => {
          if (!emote || !emote.id || !emote.name) {
            return;
          }
          const url = `https://cdn.7tv.app/emote/${emote.id}/2x.webp`;
          if (emote.flags) {
            map[emote.name] = { url, zw: true };
          } else {
            map[emote.name] = url;
          }
        });
        return map;
      }
      if (provider === 'ffz') {
        const data = await fetchJson('https://api.frankerfacez.com/v1/set/global');
        return flattenFfz(data) || {};
      }
    } catch (err) {
      console.warn(`Global emote fetch failed for ${provider}`, err);
    }
    return {};
  }

  async fetchBttvChannel(context) {
    const { platform, userId, channelId } = context;
    let url = null;
    if (platform === 'twitch' && userId) {
      url = `https://api.betterttv.net/3/cached/users/twitch/${encodeURIComponent(userId)}`;
    } else if (platform === 'youtube' && channelId) {
      url = `https://api.betterttv.net/3/cached/users/youtube/${encodeURIComponent(channelId)}`;
    } else {
      return null;
    }
    try {
      const data = await fetchJson(url);
      return flattenBttv(data);
    } catch (err) {
      console.warn('BTTV channel fetch failed', err);
      return null;
    }
  }

  async fetchSevenChannel(context) {
    const { platform, userId, channelId } = context;
    let url = null;
    if (platform === 'twitch' && userId) {
      url = `https://7tv.io/v3/users/twitch/${encodeURIComponent(userId)}`;
    } else if (platform === 'youtube' && channelId) {
      url = `https://7tv.io/v3/users/youtube/${encodeURIComponent(channelId)}`;
    } else if (platform === 'kick') {
      const identifier = userId || channelId;
      if (!identifier) {
        return null;
      }
      url = `https://7tv.io/v3/users/kick/${encodeURIComponent(identifier)}`;
    } else {
      return null;
    }
    try {
      const data = await fetchJson(url);
      return flattenSeven(data);
    } catch (err) {
      console.warn('7TV channel fetch failed', err);
      return null;
    }
  }

  async fetchFfzChannel(context) {
    const { platform, channelName, channelId } = context;
    let url = null;
    if (platform === 'twitch' && channelName) {
      url = `https://api.frankerfacez.com/v1/room/${encodeURIComponent(channelName)}`;
    } else if (platform === 'youtube' && channelId) {
      url = `https://api.frankerfacez.com/v1/room/yt/${encodeURIComponent(channelId)}`;
    } else {
      return null;
    }
    try {
      const data = await fetchJson(url);
      return flattenFfz(data);
    } catch (err) {
      console.warn('FFZ channel fetch failed', err);
      return null;
    }
  }
}
