const PREFIX = 'ssn-lite::';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Storage get failed', key, err);
      return fallback;
    }
  },
  set(key, value) {
    try {
      if (value === undefined) {
        this.remove(key);
        return;
      }
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage set failed', key, err);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (err) {
      console.warn('Storage remove failed', key, err);
    }
  }
};

export function remember(key, fallback, mapper) {
  const existing = storage.get(key);
  if (existing !== null && existing !== undefined) {
    return existing;
  }
  const value = typeof mapper === 'function' ? mapper() : mapper;
  storage.set(key, value ?? fallback);
  return value ?? fallback;
}
