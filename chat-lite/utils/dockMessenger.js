export function buildDockUrl(sessionId, { dockParams = '' } = {}) {
  const trimmed = (sessionId || '').trim();
  if (!trimmed) {
    return '';
  }

  const extra = dockParams ? `&${dockParams.replace(/^&+/, '')}` : '';
  return `https://vdo.socialstream.ninja/?ln&salt=vdo.ninja&password=false&room=${encodeURIComponent(trimmed)}&push=${encodeURIComponent(trimmed)}&vd=0&ad=0&autostart&cleanoutput&view&label=SocialStream${extra}`;
}

function extractOverlayPayload(data) {
  if (data === null || data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    return data
      .map((item) => extractOverlayPayload(item))
      .filter((item) => item !== null && item !== undefined);
  }
  if (typeof data !== 'object') {
    return null;
  }

  if ('dataReceived' in data) {
    const received = extractOverlayPayload(data.dataReceived);
    if (received !== null && received !== undefined) {
      return received;
    }
  }

  if ('overlayNinja' in data) {
    return data.overlayNinja;
  }

  if ('contents' in data) {
    return extractOverlayPayload(data.contents);
  }

  if ('detail' in data) {
    const detail = extractOverlayPayload(data.detail);
    if (detail !== null && detail !== undefined) {
      return detail;
    }
  }

  return null;
}

export class DockMessenger {
  constructor(frame, { debug = false, onDebug = null, onMessage = null } = {}) {
    this.frame = frame;
    this.sessionId = null;
    this.pending = [];
    this.ready = false;
    this.flushTimer = null;
    this.retryCounts = new WeakMap();
    this.debug = Boolean(debug);
    this.onDebug = typeof onDebug === 'function' ? onDebug : null;
    this.onMessage = typeof onMessage === 'function' ? onMessage : null;
    this.handleWindowMessage = this.handleWindowMessage.bind(this);

    if (!this.frame) {
      throw new Error('DockMessenger requires an iframe element.');
    }

    this.frameHidden = this.frame.hasAttribute('hidden');
    this.frame.addEventListener('load', () => {
      this.ready = true;
      this.debugLog('Dock iframe loaded', { pending: this.pending.length });
      this.flush();
    });

    window.addEventListener('message', this.handleWindowMessage, false);
  }

  setSessionId(sessionId, { dockParams = '' } = {}) {
    const trimmed = (sessionId || '').trim();
    if (!trimmed) {
      this.pending = [];
      this.retryCounts = new WeakMap();
      if (this.flushTimer) {
        window.clearTimeout(this.flushTimer);
        this.flushTimer = null;
      }
      this.sessionId = null;
      this.ready = false;
      this.frame.removeAttribute('src');
      this.frame.hidden = true;
      return;
    }

    if (trimmed === this.sessionId && this.frame.src) {
      return;
    }

    this.sessionId = trimmed;
    this.pending = [];
    this.retryCounts = new WeakMap();
    if (this.flushTimer) {
      window.clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.ready = false;

    const nextSrc = buildDockUrl(trimmed, { dockParams });
    this.frame.src = nextSrc;
    this.frame.hidden = this.frameHidden;
    this.debugLog('Updated dock session', { sessionId: trimmed, src: nextSrc });
  }

  getSessionId() {
    return this.sessionId;
  }

  send(message) {
    if (!this.sessionId) {
      throw new Error('Cannot send message without an active session.');
    }

    if (!this.ready || !this.frame.contentWindow) {
      this.pending.push(message);
      this.debugLog('Queued message until dock is ready', {
        pending: this.pending.length,
        message
      });
      return;
    }

    this.post(message);
  }

  scheduleFlush(delay = 400) {
    if (this.flushTimer) {
      return;
    }
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      this.flush();
    }, delay);
  }

  post(message) {
    try {
      const payload = { sendData: { overlayNinja: message }, type: 'pcs' };
      this.debugLog('Posting message to dock iframe', { payload });
      this.frame.contentWindow.postMessage(payload, '*');

      let target = null;
      try {
        target = this.frame.contentWindow;
      } catch (accessErr) {
        this.debugLog('Unable to access dock contentWindow', { error: accessErr?.message || accessErr });
      }

      if (target) {
        try {
          if (typeof target.processInput === 'function') {
            target.processInput(message);
          } else if (typeof target.processData === 'function') {
            target.processData({ contents: message });
          }
        } catch (err) {
          this.debugLog('Direct dock relay unavailable', { error: err?.message || err });
        }
      }
      this.notifyMessage(message);
      this.retryCounts.delete(message);
    } catch (err) {
      console.error('Failed to post message to dock iframe', err);
      const attempts = this.retryCounts.get(message) || 0;
      if (attempts < 3) {
        const nextAttempts = attempts + 1;
        this.retryCounts.set(message, nextAttempts);
        this.pending.unshift(message);
        this.debugLog('Re-queued message after post failure', { attempts: nextAttempts });
        this.scheduleFlush(Math.min(1200, 400 * nextAttempts));
        return;
      }
      this.retryCounts.delete(message);
      if (this.onDebug) {
        try {
          this.onDebug({
            plugin: 'system',
            message: '[warn] Dock relay unavailable for test message.',
            detail: { error: err?.message || err },
            timestamp: Date.now(),
          });
        } catch (notifyErr) {
          this.debugLog('Failed to report dock relay error', { error: notifyErr?.message || notifyErr });
        }
      }
    }
  }

  flush() {
    if (!this.ready || !this.frame.contentWindow) {
      return;
    }
    if (this.pending.length > 0) {
      this.debugLog('Flushing queued messages to dock', { count: this.pending.length });
    }
    while (this.pending.length) {
      const msg = this.pending.shift();
      this.post(msg);
      if (!this.ready) {
        break;
      }
    }
  }

  debugLog(message, detail) {
    if (!this.debug) {
      return;
    }
    if (detail !== undefined) {
      console.debug('[DockMessenger]', message, detail);
    } else {
      console.debug('[DockMessenger]', message);
    }
    if (this.onDebug) {
      try {
        this.onDebug({
          plugin: 'system',
          message: `[debug] ${message}`,
          detail,
          timestamp: Date.now()
        });
      } catch (err) {
        console.warn('DockMessenger debug callback failed', err);
      }
    }
  }

  notifyMessage(message) {
    if (!this.onMessage) {
      return;
    }
    try {
      this.onMessage({ message, sessionId: this.sessionId });
    } catch (err) {
      this.debugLog('onMessage callback failed', { error: err?.message || err });
    }
  }

  handleWindowMessage(event) {
    if (!this.frame || event.source !== this.frame.contentWindow) {
      return;
    }
    const payload = extractOverlayPayload(event.data);
    if (payload === null || payload === undefined) {
      return;
    }
    const payloads = Array.isArray(payload) ? payload : [payload];
    payloads.forEach((item) => {
      if (item && typeof item === 'object') {
        this.notifyMessage(item);
      }
    });
  }
}
