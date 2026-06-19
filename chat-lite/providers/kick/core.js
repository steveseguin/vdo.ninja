const KICK_DOMAIN = 'https://kick.com';

export const PROFILE_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
export const PROFILE_CACHE_FAILURE_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const PROFILE_CACHE_LIMIT = 500;

export function sanitizeKickTokenCode(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value)
    .replace(/[\[\]]+/g, '')
    .trim();
}

export function normalizeChannel(value) {
  return (value || '').trim().replace(/^@+/, '').toLowerCase();
}

export function normalizeImage(url) {
  if (!url) {
    return '';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (url.startsWith('/')) {
    return `${KICK_DOMAIN}${url}`;
  }
  return `${KICK_DOMAIN}/${url}`;
}

export function mapBadges(badges) {
  if (!Array.isArray(badges) || !badges.length) {
    return [];
  }
  return badges
    .map((badge) => {
      if (!badge) return null;
      if (typeof badge === 'string') {
        return badge;
      }
      const image = badge.image || badge.icon || badge.source;
      if (image && typeof image === 'object') {
        const src = image.url || image.light || image.dark;
        if (src) {
          return normalizeImage(src);
        }
      }
      if (badge.image_url) {
        return normalizeImage(badge.image_url);
      }
      if (badge.asset) {
        return normalizeImage(badge.asset);
      }
      if (badge.svg) {
        return { type: 'svg', html: badge.svg };
      }
      if (badge.label || badge.name) {
        return badge.label || badge.name;
      }
      return null;
    })
    .filter(Boolean);
}

export function badgeSignature(badge) {
  if (!badge) return 'null';
  if (typeof badge === 'string') return `text:${badge}`;
  if (badge.type === 'svg' && badge.html) return `svg:${badge.html}`;
  if (badge.src) return `src:${badge.src}`;
  if (badge.image) return `img:${badge.image}`;
  if (badge.url) return `url:${badge.url}`;
  if (badge.code) return `code:${badge.code}`;
  try {
    return `json:${JSON.stringify(badge)}`;
  } catch (err) {
    return `obj:${String(badge)}`;
  }
}

export function mergeBadges(base = [], incoming = []) {
  if (!incoming.length) {
    return Array.isArray(base) ? [...base] : [];
  }
  const result = Array.isArray(base) ? [...base] : [];
  const seen = new Set(result.map((badge) => badgeSignature(badge)));
  incoming.forEach((badge) => {
    const signature = badgeSignature(badge);
    if (signature && !seen.has(signature)) {
      seen.add(signature);
      result.push(badge);
    }
  });
  return result;
}

export function eventNameForType(type) {
  if (!type) return 'message';
  const lower = type.toLowerCase();
  if (lower === 'chat' || lower === 'message' || lower === 'chatroom_message') {
    return 'message';
  }
  if (lower.includes('gift')) {
    return 'gift';
  }
  if (lower.includes('tip') || lower.includes('donation')) {
    return 'donation';
  }
  if (lower.includes('sub')) {
    return 'subscription';
  }
  if (lower.includes('ban') || lower.includes('moderation')) {
    return 'moderation';
  }
  return lower;
}

export function formatBadgesForDisplay(badges) {
  if (!Array.isArray(badges)) return [];
  const mapped = mapBadges(badges);
  return mapped
    .map((badge) => {
      if (!badge) return null;
      if (typeof badge === 'string') {
        const trimmed = badge.trim();
        if (!trimmed) return null;
        const isAsset =
          /^https?:\/\//i.test(trimmed) ||
          trimmed.startsWith('//') ||
          trimmed.startsWith('/');
        if (isAsset) {
          return { src: normalizeImage(trimmed), type: 'img' };
        }
        return { text: trimmed, type: 'badge' };
      }
      if (badge.type === 'svg' && badge.html) {
        return { type: 'svg', html: badge.html };
      }
      const src = badge.src || badge.image || badge.url;
      if (typeof src === 'string' && src.trim()) {
        const specifiedType = typeof badge.type === 'string' ? badge.type.toLowerCase() : '';
        const type = specifiedType === 'image' ? 'img' : specifiedType || 'img';
        return { src: normalizeImage(src.trim()), type };
      }
      if (badge.html) {
        const specifiedType = typeof badge.type === 'string' ? badge.type.toLowerCase() : '';
        const type = specifiedType === 'image' ? 'img' : specifiedType || 'svg';
        return { type, html: badge.html };
      }
      const label = badge.text || badge.label || badge.name || badge.title || '';
      if (label) {
        const specifiedType = typeof badge.type === 'string' ? badge.type.toLowerCase() : '';
        const type = specifiedType === 'image' ? 'img' : specifiedType || 'badge';
        return { text: label, type };
      }
      return null;
    })
    .filter(Boolean);
}

export function buildProfileCacheKeys(ids) {
  if (!ids || typeof ids !== 'object') {
    return [];
  }
  const keys = [];
  const { userId, username } = ids;
  if (userId) {
    keys.push(`id:${userId}`);
  }
  if (username) {
    keys.push(`name:${username}`);
  }
  return keys;
}

export function getProfileCacheEntry(cache, ids, options = {}) {
  if (!cache || typeof cache.get !== 'function') {
    return undefined;
  }
  const keys = buildProfileCacheKeys(ids);
  if (!keys.length) {
    return undefined;
  }
  const successTtl = options.successTtl ?? PROFILE_CACHE_TTL_MS;
  const failureTtl = options.failureTtl ?? PROFILE_CACHE_FAILURE_TTL_MS;
  const now = options.now ?? Date.now();

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const entry = cache.get(key);
    if (!entry) {
      continue;
    }
    const ttl = entry.hasProfile ? successTtl : failureTtl;
    if (now - entry.timestamp > ttl) {
      cache.delete(key);
      continue;
    }
    return entry;
  }
  return undefined;
}

export function storeProfileCacheEntry(cache, ids, profile, options = {}) {
  if (!cache || typeof cache.set !== 'function') {
    return;
  }
  const keys = buildProfileCacheKeys(ids);
  if (!keys.length) {
    return;
  }
  const entry = {
    profile: profile || null,
    hasProfile: !!profile,
    timestamp: options.now ?? Date.now()
  };
  keys.forEach((key) => {
    cache.set(key, entry);
  });
  const limit = options.limit ?? PROFILE_CACHE_LIMIT;
  while (cache.size > limit) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) {
      break;
    }
    cache.delete(oldestKey);
  }
}

export function mergeProfileDetails(base, profile) {
  if (!profile || typeof profile !== 'object') {
    return base || {};
  }
  const merged = { ...(base || {}) };
  const nextBadges = mergeBadges(merged.badges, profile.badges || []);
  merged.badges = nextBadges;
  if (profile.displayName) {
    merged.displayName = profile.displayName;
  }
  if (profile.subtitle) {
    merged.subtitle = profile.subtitle;
  }
  if (profile.avatar) {
    merged.avatar = normalizeImage(profile.avatar);
  }
  if (profile.nameColor && !merged.nameColor) {
    merged.nameColor = profile.nameColor;
  }
  if (profile.membership && !merged.membership) {
    merged.membership = profile.membership;
  }
  if (profile.isVip) {
    merged.isVip = true;
  }
  if (profile.isMod) {
    merged.isMod = true;
  }
  if (profile.level && !merged.level) {
    merged.level = profile.level;
  }
  return merged;
}
