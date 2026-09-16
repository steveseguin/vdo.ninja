const SESSION_POLL_MS = 25;

export function getLegacySession() {
  if (typeof window === 'undefined') {
    throw new Error('Session bridge requires a browser context.');
  }
  if (!window.session) {
    throw new Error('Legacy session object is not initialised yet.');
  }
  return window.session;
}

export async function waitForLegacySession(options = {}) {
  const { timeoutMs = 5000 } = options;
  const start = performance.now();

  while (true) {
    if (window.session) {
      return window.session;
    }
    if (performance.now() - start > timeoutMs) {
      throw new Error('Timed out waiting for legacy session initialisation.');
    }
    await new Promise((resolve) => setTimeout(resolve, SESSION_POLL_MS));
  }
}

export function onLegacyEvent(eventName, handler) {
  const session = getLegacySession();
  if (!session._podcastStudioListeners) {
    session._podcastStudioListeners = new Map();
  }
  if (!session._podcastStudioListeners.has(eventName)) {
    session._podcastStudioListeners.set(eventName, new Set());
  }
  const listeners = session._podcastStudioListeners.get(eventName);
  listeners.add(handler);

  return () => {
    listeners.delete(handler);
  };
}

// shim to forward events from legacy dispatchers
export function forwardLegacyEvent(eventName, payload) {
  const session = getLegacySession();
  const listeners = session._podcastStudioListeners?.get(eventName);
  if (!listeners) {
    return;
  }
  listeners.forEach((fn) => {
    try {
      fn(payload);
    } catch (error) {
      console.error('Legacy event listener failed', error);
    }
  });
}
