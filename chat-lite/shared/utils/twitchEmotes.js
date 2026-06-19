const ACTION_PREFIX = '\u0001ACTION ';
const ACTION_SUFFIX = '\u0001';

const ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function defaultEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ENTITY_MAP[char] || char);
}

function escapeAttribute(value) {
  return defaultEscape(value);
}

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.length) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeRange(range) {
  if (typeof range === 'string') {
    const [start, end] = range.split('-');
    const startNum = toNumber(start);
    const endNum = toNumber(end);
    if (startNum === null || endNum === null) {
      return null;
    }
    return { start: startNum, end: endNum };
  }
  if (range && typeof range === 'object') {
    const startNum = toNumber(range.start ?? range[0]);
    const endNum = toNumber(range.end ?? range[1]);
    if (startNum === null || endNum === null) {
      return null;
    }
    return { start: startNum, end: endNum };
  }
  return null;
}

function normalizePositions(positions) {
  if (!positions) {
    return [];
  }
  if (typeof positions === 'string') {
    return positions
      .split(',')
      .map((part) => normalizeRange(part))
      .filter(Boolean);
  }
  if (Array.isArray(positions)) {
    return positions
      .map((entry) => normalizeRange(entry))
      .filter(Boolean);
  }
  if (positions && typeof positions === 'object') {
    return Object.values(positions)
      .map((entry) => normalizeRange(entry))
      .filter(Boolean);
  }
  return [];
}

function normalizeEmoteEntry(id, positions) {
  const normalizedId = String(id ?? '').trim();
  if (!normalizedId) {
    return null;
  }
  const ranges = normalizePositions(positions);
  if (!ranges.length) {
    return null;
  }
  return {
    id: normalizedId,
    positions: ranges
  };
}

function fromObject(source) {
  if (!source || typeof source !== 'object') {
    return [];
  }
  const entries = [];
  if (source instanceof Map) {
    source.forEach((value, key) => {
      const entry = normalizeEmoteEntry(key, value);
      if (entry) {
        entries.push(entry);
      }
    });
    return entries;
  }
  Object.keys(source).forEach((key) => {
    const entry = normalizeEmoteEntry(key, source[key]);
    if (entry) {
      entries.push(entry);
    }
  });
  return entries;
}

export function parseTwitchEmotes(emotes) {
  if (!emotes) {
    return [];
  }
  if (Array.isArray(emotes)) {
    // Already parsed or partially parsed.
    return emotes
      .map((entry) => normalizeEmoteEntry(entry.id, entry.positions))
      .filter(Boolean);
  }
  if (typeof emotes === 'string') {
    const entries = [];
    emotes.split('/').forEach((section) => {
      if (!section) {
        return;
      }
      const [id, ranges] = section.split(':');
      const entry = normalizeEmoteEntry(id, ranges);
      if (entry) {
        entries.push(entry);
      }
    });
    return entries;
  }
  return fromObject(emotes);
}

export function stringifyTwitchEmotes(emotes) {
  const parsed = parseTwitchEmotes(emotes);
  if (!parsed.length) {
    return '';
  }
  return parsed
    .map(({ id, positions }) => {
      const serialized = positions
        .map(({ start, end }) => {
          if (!Number.isFinite(start) || !Number.isFinite(end)) {
            return null;
          }
          return `${Math.max(0, start)}-${Math.max(Math.max(0, start), end)}`;
        })
        .filter(Boolean)
        .join(',');
      if (!serialized) {
        return null;
      }
      return `${id}:${serialized}`;
    })
    .filter(Boolean)
    .join('/');
}

function flattenPositions(emotes) {
  const parsed = parseTwitchEmotes(emotes);
  const flattened = [];
  parsed.forEach(({ id, positions }) => {
    positions.forEach(({ start, end }) => {
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return;
      }
      flattened.push({
        id,
        start: Math.max(0, start),
        end: Math.max(Math.max(0, start), end)
      });
    });
  });
  return flattened.sort((a, b) => a.start - b.start || a.end - b.end);
}

function stripActionWrapper(message) {
  if (typeof message !== 'string' || !message.startsWith(ACTION_PREFIX)) {
    return { text: message || '', offset: 0, suffix: '' };
  }
  const withoutPrefix = message.slice(ACTION_PREFIX.length);
  if (withoutPrefix.endsWith(ACTION_SUFFIX)) {
    return {
      text: withoutPrefix.slice(0, -ACTION_SUFFIX.length),
      offset: ACTION_PREFIX.length,
      suffix: ACTION_SUFFIX
    };
  }
  return {
    text: withoutPrefix,
    offset: ACTION_PREFIX.length,
    suffix: ''
  };
}

function buildImageTag({ url, alt, className, includeTitle, attributes }) {
  if (!url) {
    return '';
  }
  const attrs = [`src="${escapeAttribute(url)}"`, `alt="${escapeAttribute(alt)}"`];
  if (includeTitle !== false) {
    attrs.push(`title="${escapeAttribute(alt)}"`);
  }
  if (className) {
    attrs.push(`class="${escapeAttribute(className)}"`);
  }
  if (attributes && typeof attributes === 'object') {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      attrs.push(`${key}="${escapeAttribute(value)}"`);
    });
  }
  return `<img ${attrs.join(' ')}>`;
}

export function renderTwitchNativeEmotes(text, emotes, options = {}) {
  const {
    textOnly = false,
    escapeHtml = defaultEscape,
    buildEmoteUrl = (id) =>
      id ? `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0` : '',
    imageClassName = 'twitch-native-emote',
    imageAttributes = null,
    textIsSafe = false,
    includeTitle = true
  } = options || {};

  const base = typeof text === 'string' ? text : '';
  if (!base) {
    return textIsSafe ? base : escapeHtml(base);
  }

  const flattened = flattenPositions(emotes);
  if (!flattened.length) {
    return textIsSafe ? base : escapeHtml(base);
  }

  const { text: strippedText, offset, suffix } = stripActionWrapper(base);
  let cursor = 0;
  let result = '';
  flattened.forEach(({ id, start, end }) => {
    const relativeStart = start - offset;
    const relativeEnd = end - offset;
    if (relativeEnd < cursor || relativeStart < 0) {
      return;
    }
    if (relativeStart > strippedText.length - 1) {
      return;
    }
    const boundedEnd = Math.min(relativeEnd, strippedText.length - 1);
    if (boundedEnd < relativeStart) {
      return;
    }
    if (relativeStart > cursor) {
      const segment = strippedText.slice(cursor, relativeStart);
      result += textIsSafe ? segment : escapeHtml(segment);
    }
    const token = strippedText.slice(relativeStart, boundedEnd + 1);
    if (!token) {
      cursor = boundedEnd + 1;
      return;
    }
    if (textOnly) {
      result += textIsSafe ? token : escapeHtml(token);
    } else {
      const alt = token;
      const url = buildEmoteUrl(id, token);
      result += buildImageTag({
        url,
        alt,
        className: imageClassName,
        includeTitle,
        attributes: imageAttributes
      });
    }
    cursor = boundedEnd + 1;
  });

  if (cursor < strippedText.length) {
    const tail = strippedText.slice(cursor);
    result += textIsSafe ? tail : escapeHtml(tail);
  }

  if (suffix) {
    result += textIsSafe ? suffix : escapeHtml(suffix);
  }

  return result;
}
