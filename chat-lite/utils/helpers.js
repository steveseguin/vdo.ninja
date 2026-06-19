export { safeHtml, htmlToText } from '../shared/utils/html.js';

export function randomSessionId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  }
  return Math.random().toString(36).slice(2, 14);
}

export function formatTime(value = Date.now()) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(value);
  } catch (err) {
    return new Date(value).toLocaleTimeString();
  }
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function debounce(fn, wait = 250) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}
