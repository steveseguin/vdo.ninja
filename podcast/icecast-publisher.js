const DEFAULT_TIMESLICE_MS = 1000;
const DIRECT_FALLBACK_WINDOW_MS = 5000;
const DEFAULT_AUDIO_BITRATE = 128000;
const RELAY_WEBSOCKET_BUFFER_LIMIT = 512 * 1024;

export const ICECAST_MIME_OPTIONS = [
  { value: 'audio/aac', label: 'AAC / ADTS', extension: 'aac' },
  { value: 'audio/webm;codecs=opus', label: 'WebM / Opus', extension: 'webm' },
  { value: 'audio/ogg;codecs=opus', label: 'Ogg / Opus', extension: 'ogg' },
  { value: 'audio/webm', label: 'WebM', extension: 'webm' },
  { value: 'audio/ogg', label: 'Ogg', extension: 'ogg' }
];

function isAacMimeType(type) {
  return (type || '').toLowerCase().includes('audio/aac');
}

function getMediaRecorderMimeType(preferredType) {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }
  const candidates = [];
  if (preferredType) {
    candidates.push(preferredType);
  }
  ICECAST_MIME_OPTIONS.forEach(option => {
    if (!isAacMimeType(option.value) && !candidates.includes(option.value)) {
      candidates.push(option.value);
    }
  });
  return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
}

async function getAacEncoderConfig(audioContext, audioBitsPerSecond) {
  if (
    typeof AudioEncoder === 'undefined' ||
    typeof AudioEncoder.isConfigSupported !== 'function' ||
    typeof MediaStreamTrackProcessor === 'undefined'
  ) {
    return null;
  }
  const config = {
    codec: 'mp4a.40.2',
    sampleRate: audioContext?.sampleRate || 48000,
    numberOfChannels: 2,
    bitrate: audioBitsPerSecond || DEFAULT_AUDIO_BITRATE,
    aac: { format: 'adts' }
  };
  try {
    const support = await AudioEncoder.isConfigSupported(config);
    return support.supported ? support.config : null;
  } catch (error) {
    return null;
  }
}

function sanitizeHeaderValue(value) {
  return (value || '')
    .toString()
    .replace(/[\r\n]/g, ' ')
    .trim();
}

function createBasicAuth(username, password) {
  const user = username || 'source';
  return `Basic ${btoa(`${user}:${password || ''}`)}`;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createAbortError(message = 'aborted') {
  if (typeof DOMException === 'function') {
    return new DOMException(message, 'AbortError');
  }
  const error = new Error(message);
  error.name = 'AbortError';
  return error;
}

function isIPv4Target(target) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(target.hostname);
}

function isBareIpTarget(target) {
  return isIPv4Target(target) && !target.port && target.pathname === '/';
}

function isHttpsPage() {
  return typeof window !== 'undefined' && window.location?.protocol === 'https:';
}

export class IcecastPublisher extends EventTarget {
  constructor({ audioContext = null, getParticipants = null } = {}) {
    super();
    this.audioContext = audioContext;
    this.getParticipants = typeof getParticipants === 'function' ? getParticipants : () => [];
    this.destination = null;
    this.masterGain = null;
    this.mediaRecorder = null;
    this.audioEncoder = null;
    this.trackProcessor = null;
    this.trackReader = null;
    this.encoderPumpPromise = null;
    this.uploadAbortController = null;
    this.uploadPromise = null;
    this.sourceNodes = new Map();
    this.sourceRefreshTimer = null;
    this.streamController = null;
    this.pendingWrites = 0;
    this.closeRequested = false;
    this.live = false;
    this.stopping = false;
    this.startedAt = 0;
    this.bytesSent = 0;
    this.config = null;
  }

  isLive() {
    return this.live;
  }

  setAudioContext(audioContext) {
    this.audioContext = audioContext;
  }

  emitStatus(state, message, details = {}) {
    this.dispatchEvent(
      new CustomEvent('status', {
        detail: {
          state,
          message,
          bytesSent: this.bytesSent,
          startedAt: this.startedAt,
          ...details
        }
      })
    );
  }

  emitProgress() {
    this.dispatchEvent(
      new CustomEvent('progress', {
        detail: {
          bytesSent: this.bytesSent,
          startedAt: this.startedAt
        }
      })
    );
  }

  isExpectedStopError(error) {
    const message = (error?.message || '').toLowerCase();
    return this.stopping || this.closeRequested || error?.name === 'AbortError' || message.includes('aborted');
  }

  async resolveEncoder(preferredType, audioContext, audioBitsPerSecond) {
    const candidates = [];
    if (preferredType) {
      candidates.push(preferredType);
    }
    ICECAST_MIME_OPTIONS.forEach(option => {
      if (!candidates.includes(option.value)) {
        candidates.push(option.value);
      }
    });

    for (const candidate of candidates) {
      if (isAacMimeType(candidate)) {
        const encoderConfig = await getAacEncoderConfig(audioContext, audioBitsPerSecond);
        if (encoderConfig) {
          return {
            mode: 'webcodecs-aac',
            mimeType: 'audio/aac',
            encoderConfig
          };
        }
        continue;
      }
      const mimeType = getMediaRecorderMimeType(candidate);
      if (mimeType) {
        return {
          mode: 'mediarecorder',
          mimeType
        };
      }
    }
    return null;
  }

  validateConfig(config) {
    if (!config?.targetUrl) {
      throw new Error('Icecast URL is required.');
    }
    if (!config?.password) {
      throw new Error('Icecast source password is required.');
    }
    try {
      const target = new URL(config.targetUrl);
      if (!['http:', 'https:'].includes(target.protocol)) {
        throw new Error('Icecast URL must use HTTP or HTTPS.');
      }
      if (target.pathname.toLowerCase().startsWith('/listen/')) {
        throw new Error('Use the Icecast source URL, not the public listener URL.');
      }
      if (isBareIpTarget(target)) {
        throw new Error('Use the full Icecast source URL, including port or AzuraCast ingest path.');
      }
      if (config.relayUrl && isIPv4Target(target)) {
        throw new Error('Use a DNS source URL with the relay; bare IP Icecast targets are not supported.');
      }
    } catch (error) {
      throw new Error(error?.message || 'Invalid Icecast URL.');
    }
    if (config.relayUrl) {
      try {
        const relay = new URL(config.relayUrl);
        if (!['http:', 'https:'].includes(relay.protocol)) {
          throw new Error('Relay URL must use HTTP or HTTPS.');
        }
      } catch (error) {
        throw new Error(error?.message || 'Invalid relay URL.');
      }
    }
  }

  async ensureAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('AudioContext is not supported.');
      }
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended' && typeof this.audioContext.resume === 'function') {
      await this.audioContext.resume();
    }
    return this.audioContext;
  }

  async start(config = {}) {
    if (this.live) {
      throw new Error('Icecast publishing is already running.');
    }
    if (typeof ReadableStream === 'undefined') {
      throw new Error('Streaming uploads are not supported in this browser.');
    }
    this.validateConfig(config);

    const audioContext = await this.ensureAudioContext();
    const audioBitsPerSecond = Number.isFinite(config.audioBitsPerSecond)
      ? Math.max(16000, config.audioBitsPerSecond)
      : DEFAULT_AUDIO_BITRATE;
    const encoder = await this.resolveEncoder(config.mimeType || ICECAST_MIME_OPTIONS[0].value, audioContext, audioBitsPerSecond);
    if (!encoder) {
      throw new Error('No supported Icecast audio encoder was found.');
    }

    this.config = {
      ...config,
      username: config.username || 'source',
      mimeType: encoder.mimeType,
      encoderMode: encoder.mode,
      encoderConfig: encoder.encoderConfig || null,
      timesliceMs: Number.isFinite(config.timesliceMs) ? Math.max(250, config.timesliceMs) : DEFAULT_TIMESLICE_MS,
      audioBitsPerSecond
    };
    this.destination = audioContext.createMediaStreamDestination();
    this.masterGain = audioContext.createGain();
    this.masterGain.gain.value = 1;
    this.masterGain.connect(this.destination);
    this.bytesSent = 0;
    this.startedAt = Date.now();
    this.closeRequested = false;
    this.pendingWrites = 0;
    this.stopping = false;
    this.live = true;

    this.refreshSources();
    if (!this.sourceNodes.size) {
      await this.stop({ quiet: true });
      throw new Error('No mixed audio sources are available.');
    }

    const uploadStream = this.createUploadStream();
    this.uploadAbortController = new AbortController();
    this.sourceRefreshTimer = setInterval(() => this.refreshSources(), 1500);
    try {
      if (this.config.encoderMode === 'webcodecs-aac') {
        await this.startAacEncoder();
      } else {
        this.startMediaRecorder();
      }
    } catch (error) {
      await this.stop({ quiet: true });
      throw error;
    }
    this.uploadPromise = this.openUploadWithFallback(uploadStream).then(response => {
      if (this.live && !this.stopping && !this.closeRequested) {
        throw new Error('Icecast connection ended.');
      }
      return response;
    }).catch(error => {
      if (!this.isExpectedStopError(error)) {
        this.live = false;
        this.dispatchEvent(new CustomEvent('error', { detail: error }));
        this.emitStatus('error', error?.message || 'Icecast publish failed.');
        this.stop({ quiet: true }).catch(stopError => {
          console.warn('Icecast stop after upload error failed', stopError);
        });
      }
      throw error;
    });
    this.emitStatus('live', 'Icecast live.', { mimeType: this.config.mimeType });
  }

  startMediaRecorder() {
    this.mediaRecorder = new MediaRecorder(this.destination.stream, {
      mimeType: this.config.mimeType,
      audioBitsPerSecond: this.config.audioBitsPerSecond
    });
    this.mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        this.enqueueBlob(event.data);
      }
    };
    this.mediaRecorder.onerror = event => {
      const error = event?.error || event;
      this.dispatchEvent(new CustomEvent('error', { detail: error }));
      this.emitStatus('error', error?.message || 'Icecast recorder failed.');
      this.stop({ quiet: true }).catch(stopError => {
        console.warn('Icecast stop after recorder error failed', stopError);
      });
    };
    this.mediaRecorder.onstop = () => {
      this.requestStreamClose();
    };
    this.mediaRecorder.start(this.config.timesliceMs);
  }

  async startAacEncoder() {
    const track = this.destination?.stream?.getAudioTracks?.()[0];
    if (!track) {
      throw new Error('Unable to create an AAC audio track.');
    }
    this.trackProcessor = new MediaStreamTrackProcessor({ track });
    this.trackReader = this.trackProcessor.readable.getReader();
    this.audioEncoder = new AudioEncoder({
      output: chunk => this.enqueueEncodedChunk(chunk),
      error: error => this.handleEncoderError(error)
    });
    this.audioEncoder.configure(this.config.encoderConfig);
    this.encoderPumpPromise = this.pumpAacEncoder();
  }

  async pumpAacEncoder() {
    try {
      while (!this.closeRequested && !this.stopping && this.trackReader) {
        const { done, value } = await this.trackReader.read();
        if (done) {
          break;
        }
        this.encodeAudioData(value);
        if (this.audioEncoder?.encodeQueueSize > 8) {
          await delay(10);
        }
      }
      if (this.audioEncoder && this.audioEncoder.state !== 'closed') {
        await this.audioEncoder.flush();
      }
    } catch (error) {
      if (!this.isExpectedStopError(error)) {
        this.handleEncoderError(error);
      }
    } finally {
      if (this.audioEncoder && this.audioEncoder.state !== 'closed') {
        try {
          this.audioEncoder.close();
        } catch (error) {
          if (!this.isExpectedStopError(error)) {
            console.warn('Icecast AAC encoder close failed', error);
          }
        }
      }
      this.audioEncoder = null;
      this.trackReader = null;
      this.trackProcessor = null;
      this.requestStreamClose();
    }
  }

  encodeAudioData(audioData) {
    try {
      if (this.audioEncoder && this.audioEncoder.state === 'configured' && !this.closeRequested) {
        this.audioEncoder.encode(audioData);
      }
    } catch (error) {
      this.handleEncoderError(error);
    } finally {
      try {
        audioData.close();
      } catch (error) {
        if (!this.isExpectedStopError(error)) {
          console.warn('Icecast AudioData close failed', error);
        }
      }
    }
  }

  enqueueEncodedChunk(chunk) {
    if (!this.streamController || this.closeRequested) {
      return;
    }
    try {
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      this.streamController.enqueue(data);
      this.bytesSent += data.byteLength;
      this.emitProgress();
    } catch (error) {
      if (!this.isExpectedStopError(error)) {
        this.handleEncoderError(error);
      }
    }
  }

  handleEncoderError(error) {
    if (this.isExpectedStopError(error)) {
      return;
    }
    this.dispatchEvent(new CustomEvent('error', { detail: error }));
    this.emitStatus('error', error?.message || 'Icecast audio encoder failed.');
    this.stop({ quiet: true }).catch(stopError => {
      console.warn('Icecast stop after encoder error failed', stopError);
    });
  }

  async stop({ quiet = false } = {}) {
    if (!this.live && !this.mediaRecorder && !this.audioEncoder && !this.encoderPumpPromise) {
      return;
    }
    this.stopping = true;
    this.closeRequested = true;
    if (this.sourceRefreshTimer) {
      clearInterval(this.sourceRefreshTimer);
      this.sourceRefreshTimer = null;
    }
    const uploadPromise = this.uploadPromise;
    const absorbUploadError = error => {
      if (!quiet && !this.isExpectedStopError(error)) {
        console.warn('Icecast upload ended with error', error);
      }
    };
    const uploadSettled = uploadPromise ? uploadPromise.catch(absorbUploadError) : Promise.resolve();
    const encoderPromise = this.encoderPumpPromise;
    const encoderSettled = encoderPromise
      ? encoderPromise.catch(error => {
          if (!quiet && !this.isExpectedStopError(error)) {
            console.warn('Icecast encoder ended with error', error);
          }
        })
      : Promise.resolve();
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.warn('Icecast MediaRecorder stop failed', error);
        this.requestStreamClose();
      }
    } else if (this.trackReader) {
      try {
        await Promise.race([this.trackReader.cancel('stopping'), delay(1000)]);
      } catch (error) {
        if (!this.isExpectedStopError(error)) {
          console.warn('Icecast AAC reader cancel failed', error);
        }
      }
      this.requestStreamClose();
    } else {
      this.requestStreamClose();
    }
    await Promise.race([
      Promise.all([uploadSettled, encoderSettled]),
      delay(4000)
    ]);
    if (this.uploadAbortController) {
      try {
        this.uploadAbortController.abort();
      } catch (error) {
        console.warn('Icecast upload abort failed', error);
      }
    }
    await Promise.race([uploadSettled, delay(1000)]);
    this.live = false;
    this.disconnectSources();
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch (error) {
        console.warn('Icecast mix disconnect failed', error);
      }
    }
    this.masterGain = null;
    this.destination = null;
    this.mediaRecorder = null;
    this.audioEncoder = null;
    this.trackProcessor = null;
    this.trackReader = null;
    this.encoderPumpPromise = null;
    this.uploadAbortController = null;
    this.uploadPromise = null;
    this.streamController = null;
    this.stopping = false;
    this.config = null;
    if (!quiet) {
      this.emitStatus('idle', 'Icecast idle.');
    }
  }

  createUploadStream() {
    return new ReadableStream({
      start: controller => {
        this.streamController = controller;
      },
      cancel: () => {
        this.streamController = null;
      }
    });
  }

  enqueueBlob(blob) {
    if (!this.streamController || this.closeRequested) {
      return;
    }
    this.pendingWrites += 1;
    blob
      .arrayBuffer()
      .then(buffer => {
        if (!this.streamController || this.closeRequested) {
          return;
        }
        const chunk = new Uint8Array(buffer);
        this.streamController.enqueue(chunk);
        this.bytesSent += chunk.byteLength;
        this.emitProgress();
      })
      .catch(error => {
        if (!this.stopping) {
          this.dispatchEvent(new CustomEvent('error', { detail: error }));
          this.emitStatus('error', error?.message || 'Failed to prepare Icecast audio chunk.');
        }
      })
      .finally(() => {
        this.pendingWrites -= 1;
        this.closeStreamIfReady();
      });
  }

  requestStreamClose() {
    this.closeRequested = true;
    this.closeStreamIfReady();
  }

  closeStreamIfReady() {
    if (!this.closeRequested || this.pendingWrites > 0 || !this.streamController) {
      return;
    }
    try {
      this.streamController.close();
    } catch (error) {
      console.warn('Icecast stream close failed', error);
    }
    this.streamController = null;
  }

  refreshSources() {
    if (!this.live || !this.audioContext || !this.masterGain) {
      return;
    }
    const participants = this.getParticipants() || [];
    const activeKeys = new Set();
    participants.forEach(participant => {
      const tracks = participant?.stream?.getAudioTracks?.() || [];
      tracks.forEach((track, index) => {
        if (!track || track.readyState === 'ended') {
          return;
        }
        const key = `${participant.uuid || participant.streamID || 'source'}:${track.id || index}`;
        activeKeys.add(key);
        if (!this.sourceNodes.has(key)) {
          this.addSourceNode(key, track);
        }
      });
    });
    Array.from(this.sourceNodes.keys()).forEach(key => {
      if (!activeKeys.has(key)) {
        this.removeSourceNode(key);
      }
    });
  }

  addSourceNode(key, track) {
    try {
      const stream = new MediaStream([track]);
      const node = this.audioContext.createMediaStreamSource(stream);
      node.connect(this.masterGain);
      const endedHandler = () => this.removeSourceNode(key);
      track.addEventListener('ended', endedHandler);
      this.sourceNodes.set(key, { node, track, endedHandler });
      this.emitStatus(
        'live',
        `Icecast live (${this.sourceNodes.size} source${this.sourceNodes.size === 1 ? '' : 's'}).`
      );
    } catch (error) {
      console.warn('Failed to add Icecast source', error);
    }
  }

  removeSourceNode(key) {
    const entry = this.sourceNodes.get(key);
    if (!entry) {
      return;
    }
    try {
      entry.node.disconnect();
    } catch (error) {
      console.warn('Failed to disconnect Icecast source', error);
    }
    try {
      entry.track.removeEventListener('ended', entry.endedHandler);
    } catch (error) {
      console.warn('Failed to remove Icecast source listener', error);
    }
    this.sourceNodes.delete(key);
    if (this.live) {
      this.emitStatus(
        'live',
        `Icecast live (${this.sourceNodes.size} source${this.sourceNodes.size === 1 ? '' : 's'}).`
      );
    }
  }

  disconnectSources() {
    Array.from(this.sourceNodes.keys()).forEach(key => this.removeSourceNode(key));
    this.sourceNodes.clear();
  }

  buildDirectHeaders() {
    const headers = new Headers();
    headers.set('Authorization', createBasicAuth(this.config.username, this.config.password));
    headers.set('Content-Type', this.config.mimeType);
    this.applyIcecastMetadataHeaders(headers);
    return headers;
  }

  buildRelayHeaders() {
    const headers = new Headers();
    headers.set('Content-Type', this.config.mimeType);
    headers.set('X-Icecast-Target', this.config.targetUrl);
    headers.set('X-Icecast-Username', this.config.username || 'source');
    headers.set('X-Icecast-Password', this.config.password || '');
    headers.set('X-Icecast-Content-Type', this.config.mimeType);
    if (this.config.relayToken) {
      headers.set('X-Icecast-Relay-Token', this.config.relayToken);
    }
    this.applyIcecastMetadataHeaders(headers, 'X-Icecast-');
    return headers;
  }

  buildRelayStartMessage() {
    const metadata = this.config.metadata || {};
    return {
      targetUrl: this.config.targetUrl,
      username: this.config.username || 'source',
      password: this.config.password || '',
      relayToken: this.config.relayToken || '',
      contentType: this.config.mimeType,
      metadata: {
        name: metadata.name || '',
        description: metadata.description || '',
        genre: metadata.genre || '',
        url: metadata.url || '',
        public: Boolean(metadata.public),
        bitrate: metadata.bitrate || Math.round((this.config.audioBitsPerSecond || DEFAULT_AUDIO_BITRATE) / 1000).toString()
      }
    };
  }

  applyIcecastMetadataHeaders(headers, prefix = '') {
    const metadata = this.config.metadata || {};
    const pairs = {
      Name: metadata.name,
      Description: metadata.description,
      Genre: metadata.genre,
      Url: metadata.url,
      Public: metadata.public ? '1' : '0',
      Bitrate:
        metadata.bitrate || Math.round((this.config.audioBitsPerSecond || DEFAULT_AUDIO_BITRATE) / 1000).toString()
    };
    Object.entries(pairs).forEach(([key, value]) => {
      const clean = sanitizeHeaderValue(value);
      if (clean) {
        headers.set(`${prefix}Ice-${key}`, clean);
      }
    });
  }

  async openUploadWithFallback(uploadStream) {
    if (this.config.relayUrl) {
      if (this.shouldSkipDirectUpload()) {
        this.emitStatus('connecting', 'Using Icecast relay.');
        return this.openRelayUpload(uploadStream);
      }
      const [directBody, relayBody] = uploadStream.tee();
      const directAbortController = new AbortController();
      let directTimedOut = false;
      const fallbackTimer = setTimeout(() => {
        directTimedOut = true;
        directAbortController.abort('direct connection timed out');
      }, DIRECT_FALLBACK_WINDOW_MS);
      const stopSignal = this.uploadAbortController?.signal;
      const abortDirectOnStop = () => directAbortController.abort('publisher stopped');
      if (stopSignal) {
        if (stopSignal.aborted) {
          abortDirectOnStop();
        } else {
          stopSignal.addEventListener('abort', abortDirectOnStop, { once: true });
        }
      }
      try {
        this.emitStatus('connecting', 'Connecting directly to Icecast.');
        const response = await this.openDirectUpload(directBody, directAbortController.signal);
        clearTimeout(fallbackTimer);
        relayBody.cancel('direct connection active').catch(() => {});
        return this.waitForUploadCompletion(response);
      } catch (error) {
        clearTimeout(fallbackTimer);
        directAbortController.abort('direct connection failed');
        if (!directBody.locked) {
          directBody.cancel('direct connection failed').catch(() => {});
        }
        if (this.stopping) {
          throw error;
        }
        this.emitStatus('connecting', directTimedOut ? 'Direct publish timed out; using relay.' : 'Direct publish failed; using relay.', {
          fallbackError: error?.message || 'direct failed'
        });
        return this.openRelayUpload(relayBody);
      } finally {
        if (stopSignal) {
          stopSignal.removeEventListener('abort', abortDirectOnStop);
        }
      }
    }
    this.emitStatus('connecting', 'Connecting directly to Icecast.');
    return this.openDirectUpload(uploadStream).then(response => this.waitForUploadCompletion(response));
  }

  shouldSkipDirectUpload() {
    try {
      const target = new URL(this.config.targetUrl);
      return target.protocol === 'http:' && isHttpsPage();
    } catch (error) {
      return false;
    }
  }

  openDirectUpload(body, signal = this.uploadAbortController?.signal) {
    return fetch(this.config.targetUrl, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-store',
      headers: this.buildDirectHeaders(),
      body,
      duplex: 'half',
      signal
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Icecast rejected the stream (${response.status}).`);
      }
      return response;
    });
  }

  async openRelayUpload(body) {
    if (typeof WebSocket !== 'undefined') {
      const [socketBody, fetchBody] = body.tee();
      let socketReady = false;
      try {
        return await this.openRelayWebSocket(socketBody, {
          onReady: () => {
            socketReady = true;
            fetchBody.cancel('relay socket active').catch(() => {});
          }
        });
      } catch (error) {
        if (socketReady || this.stopping) {
          if (!fetchBody.locked) {
            fetchBody.cancel('relay socket failed').catch(() => {});
          }
          throw error;
        }
        this.emitStatus('connecting', 'Relay socket failed; using relay upload.', {
          fallbackError: error?.message || 'relay socket failed'
        });
        return this.openRelayFetch(fetchBody);
      }
    }
    return this.openRelayFetch(body);
  }

  async openRelayFetch(body) {
    const response = await fetch(this.config.relayUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      headers: this.buildRelayHeaders(),
      body,
      duplex: 'half',
      signal: this.uploadAbortController?.signal
    });
    if (!response.ok) {
      let relayMessage = '';
      try {
        const bodyText = await response.text();
        if (bodyText) {
          try {
            relayMessage = JSON.parse(bodyText).error || bodyText;
          } catch (error) {
            relayMessage = bodyText;
          }
        }
      } catch (error) {
        relayMessage = '';
      }
      throw new Error(
        relayMessage
          ? `Icecast relay rejected the stream (${response.status}): ${relayMessage}`
          : `Icecast relay rejected the stream (${response.status}).`
      );
    }
    return this.waitForUploadCompletion(response);
  }

  openRelayWebSocket(body, { onReady = null } = {}) {
    const socketUrl = new URL(this.config.relayUrl, window.location.href);
    socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    const signal = this.uploadAbortController?.signal;
    let reader = null;
    let settled = false;
    let activeSocket = null;
    let activeClosed = false;
    let activeCloseError = null;
    let abortHandler = null;

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        if (signal && abortHandler) {
          signal.removeEventListener('abort', abortHandler);
          abortHandler = null;
        }
      };
      const settle = (callback, value) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        callback(value);
      };
      const closeSocket = (socket, code = 1000, reason = 'stopping') => {
        try {
          if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
            socket.close(code, reason);
          }
        } catch (error) {
          if (!this.isExpectedStopError(error)) {
            console.warn('Icecast relay socket close failed', error);
          }
        }
      };
      abortHandler = () => {
        if (reader) {
          reader.cancel('stopping').catch(() => {});
        }
        closeSocket(activeSocket, 1000, 'stopping');
        settle(resolve, new Response('', { status: 200 }));
      };
      if (signal) {
        if (signal.aborted) {
          abortHandler();
          return;
        }
        signal.addEventListener('abort', abortHandler, { once: true });
      }

      const connectSocket = () => new Promise((resolveSocket, rejectSocket) => {
        const socket = new WebSocket(socketUrl.toString());
        let accepted = false;
        let finished = false;
        socket.binaryType = 'arraybuffer';
        const finish = (callback, value) => {
          if (finished) {
            return;
          }
          finished = true;
          callback(value);
        };
        socket.addEventListener('open', () => {
          try {
            socket.send(JSON.stringify(this.buildRelayStartMessage()));
          } catch (error) {
            finish(rejectSocket, error);
            closeSocket(socket, 4000, 'relay failed');
          }
        });
        socket.addEventListener('message', event => {
          if (typeof event.data !== 'string') {
            return;
          }
          let message;
          try {
            message = JSON.parse(event.data);
          } catch (error) {
            return;
          }
          if (message?.type === 'error') {
            const error = new Error(message.error || 'Icecast relay failed.');
            if (accepted) {
              activeClosed = true;
              activeCloseError = error;
              closeSocket(socket, 4000, 'relay failed');
            } else {
              finish(rejectSocket, error);
              closeSocket(socket, 4000, 'relay failed');
            }
          } else if (message?.type === 'ready') {
            accepted = true;
            activeSocket = socket;
            activeClosed = false;
            activeCloseError = null;
            if (typeof onReady === 'function') {
              try {
                onReady();
              } catch (error) {
                console.warn('Icecast relay ready callback failed', error);
              }
            }
            this.emitStatus('live', 'Icecast relay connected.');
            finish(resolveSocket, socket);
          }
        });
        socket.addEventListener('error', () => {
          const error = new Error('Icecast relay socket failed.');
          if (accepted && activeSocket === socket) {
            activeClosed = true;
            activeCloseError = error;
            return;
          }
          finish(rejectSocket, error);
        });
        socket.addEventListener('close', event => {
          if (activeSocket !== socket) {
            return;
          }
          activeClosed = true;
          activeCloseError = event.code === 1000 ? null : new Error(event.reason || `Icecast relay socket closed (${event.code}).`);
        });
      });

      const connectWithRetry = async () => {
        let lastError = null;
        for (let attempt = 0; attempt < 8; attempt += 1) {
          if (signal?.aborted) {
            throw createAbortError('publisher stopped');
          }
          try {
            return await connectSocket();
          } catch (error) {
            lastError = error;
            await delay(500);
          }
        }
        throw lastError || new Error('Icecast relay socket failed.');
      };

      const pump = async () => {
        reader = body.getReader();
        let socket = await connectWithRetry();
        while (true) {
          if (signal?.aborted) {
            throw createAbortError('publisher stopped');
          }
          if (activeClosed) {
            const reconnectError = activeCloseError;
            activeClosed = false;
            activeCloseError = null;
            if (reconnectError) {
              console.warn('Icecast relay reconnecting after upstream close', reconnectError);
            }
            socket = await connectWithRetry();
          }
          const { done, value } = await reader.read();
          if (done) {
            closeSocket(socket, 1000, 'complete');
            return;
          }
          await this.waitForWebSocketBackpressure(socket, signal);
          if (socket.readyState !== WebSocket.OPEN) {
            activeClosed = true;
            activeCloseError = null;
            continue;
          }
          socket.send(value);
        }
      };

      pump()
        .then(() => {
          settle(resolve, new Response('', { status: 200 }));
        })
        .catch(error => {
          if (this.isExpectedStopError(error)) {
            if (reader) {
              reader.cancel('stopping').catch(() => {});
            }
            closeSocket(activeSocket, 1000, 'stopping');
            settle(resolve, new Response('', { status: 200 }));
            return;
          }
          if (reader) {
            reader.cancel('relay failed').catch(() => {});
          }
          closeSocket(activeSocket, 4000, 'relay failed');
          settle(reject, error);
        });
    });
  }

  async waitForWebSocketBackpressure(socket, signal) {
    while (socket.bufferedAmount > RELAY_WEBSOCKET_BUFFER_LIMIT) {
      if (signal?.aborted) {
        throw createAbortError('publisher stopped');
      }
      if (socket.readyState !== WebSocket.OPEN) {
        throw new Error('Icecast relay socket closed.');
      }
      await delay(25);
    }
  }

  async waitForUploadCompletion(response) {
    if (response && typeof response.text === 'function') {
      await response.text();
    }
    return response;
  }
}
