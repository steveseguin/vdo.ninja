const DEFAULT_AUDIO_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/ogg;codecs=opus',
  'audio/webm',
  'audio/ogg',
];

export class TrackRecorder extends EventTarget {
  constructor({ track, uuid, label, kind = 'audio', mimeType }) {
    super();
    if (!track) {
      throw new Error('TrackRecorder requires a MediaStreamTrack.');
    }
    this.track = track;
    this.uuid = uuid;
    this.label = label;
    this.kind = kind;
    this.mimeType = mimeType || TrackRecorder.pickSupportedMime(kind);
    this.mediaRecorder = null;
    this.chunks = [];
    this.startedAt = null;
    this.stoppedAt = null;
    this.stopResolver = null;
    this.stopComplete = null;
  }

  static pickSupportedMime(kind) {
    if (typeof MediaRecorder === 'undefined') {
      return null;
    }
    if (kind === 'video') {
      const candidates = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
      ];
      return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || null;
    }
    return DEFAULT_AUDIO_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || null;
  }

  createStream() {
    const stream = new MediaStream();
    stream.addTrack(this.track);
    return stream;
  }

  start(options = {}) {
    if (this.mediaRecorder) {
      throw new Error('TrackRecorder already started.');
    }
    const stream = this.createStream();
    const recorderOptions = {};
    if (this.mimeType) {
      recorderOptions.mimeType = this.mimeType;
    }
    if (options.bitsPerSecond) {
      recorderOptions.bitsPerSecond = options.bitsPerSecond;
    }

    this.mediaRecorder = new MediaRecorder(stream, recorderOptions);
    this.chunks = [];
    this.startedAt = performance.now();
    this.stoppedAt = null;
    this.stopComplete = new Promise((resolve) => {
      this.stopResolver = resolve;
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
        this.dispatchEvent(new CustomEvent('data', { detail: event.data }));
      }
    };

    this.mediaRecorder.onstop = (event) => {
      this.stoppedAt = performance.now();
      if (this.stopResolver) {
        this.stopResolver();
        this.stopResolver = null;
      }
      this.dispatchEvent(new CustomEvent('stop', { detail: event }));
    };

    this.mediaRecorder.onerror = (event) => {
      this.dispatchEvent(new CustomEvent('error', { detail: event.error || event }));
    };

    try {
      this.mediaRecorder.start(options.timeslice || 0);
    } catch (error) {
      if (this.stopResolver) {
        this.stopResolver();
        this.stopResolver = null;
      }
      throw error;
    }
  }

  stop() {
    if (!this.mediaRecorder) {
      return Promise.resolve();
    }
    const completion = this.stopComplete || Promise.resolve();
    if (this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.warn('MediaRecorder stop failed', error);
      }
    }
    return completion
      .catch((error) => {
        console.warn('MediaRecorder stop did not resolve cleanly', error);
      })
      .finally(() => {
        try {
          this.track.stop();
        } catch (error) {
          console.warn('Failed to stop cloned track', error);
        }
        this.mediaRecorder = null;
        this.stopComplete = null;
      });
  }

  toBlob() {
    if (!this.chunks.length) {
      return null;
    }
    const mimeType = this.mimeType || (this.kind === 'audio' ? 'audio/webm' : 'video/webm');
    return new Blob(this.chunks, { type: mimeType });
  }

  getDurationSeconds() {
    if (!this.startedAt) {
      return 0;
    }
    const end = this.stoppedAt || performance.now();
    return (end - this.startedAt) / 1000;
  }
}
