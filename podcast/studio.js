import {
  waitForLegacySession,
  levelBus,
  LEVEL_EVENT,
  MultiTrackRecorder,
  CloudUploadCoordinator,
  bridgeLegacyMeters,
  monitorTrackLevel,
} from '../core/index.js';
import { IcecastPublisher, ICECAST_MIME_OPTIONS } from './icecast-publisher.js?v=4';

const STUDIO_ROOT_ID = 'podcast-root';
const ROSTER_REFRESH_MS = 1500;
const HOST_MIC_READY_TIMEOUT_MS = 12000;
const PREFLIGHT_STORAGE_KEY = 'podcastStudio.preflightState';
const PREFLIGHT_CACHE_MS = 6 * 60 * 60 * 1000;
const PREFLIGHT_MIN_MANDATORY_MS = 5 * 60 * 1000;
const DROPBOX_GUIDE_URL = '/cloud.html#dropbox';
const CLOUD_STATUS_STORAGE_KEY = 'podcastStudio.cloudStatus';
const CLOUD_STATUS_STALE_MS = 30 * 60 * 1000;
const DISK_RECORDING_STORAGE_KEY = 'podcastStudio.diskRecordingState';
const CAPTURE_MODE_STORAGE_KEY = 'podcastStudio.captureMode';
const ICECAST_SETTINGS_STORAGE_KEY = 'podcastStudio.icecastSettings';
const ICECAST_SETTINGS_VERSION = 3;
const DEFAULT_ICECAST_MIME_TYPE = ICECAST_MIME_OPTIONS[0].value;
const DEFAULT_ICECAST_RELAY_URL = 'https://vdo-ninja-icecast-relay.vdo.workers.dev/publish';
const DISK_DB_NAME = 'podcastStudio.disk';
const DISK_DB_STORE = 'handles';
const PODCAST_CLOUD_EVENT = 'podcast-cloud-status';
const PODCAST_DISK_EVENT = 'podcast-disk-state';
const PODCAST_RECORD_PLAN_EVENT = 'podcast-record-plan';
const PODCAST_RECORD_STATUS_EVENT = 'podcast-record-status';
const UPLOAD_TRACKER_COOLDOWN_MS = 15000;
const DRIVE_PROGRESS_EVENT = 'vdoninja:gdrive-progress';
const REMOTE_RECORDER_EVENT = 'vdoninja:remote-recorder-status';
const DEFAULT_GUEST_BACKUP_BITRATE = 6000;
const DRIVE_STATUS_RESET_MS = 8000;
const DRIVE_REQUEST_ACK_TIMEOUT_MS = 12000;
const DRIVE_REQUEST_STALE_TIMEOUT_MS = 60000;
const DRIVE_RECORDER_HEARTBEAT_GRACE_MS = DRIVE_REQUEST_STALE_TIMEOUT_MS + 15000;
const DRIVE_STATUS_MESSAGES = {
  idle: 'Drive idle',
  pending: 'Drive readying…',
  uploading: 'Drive uploading…',
  done: 'Drive upload complete',
  error: 'Drive upload error',
};
const STUDIO_DISK_FEATURE_FLAG = (() => {
  let enabled = true;
  if (typeof urlParams !== 'undefined' && urlParams) {
    const hasParam = typeof urlParams.has === 'function' ? urlParams.has('studioiso') : false;
    if (hasParam) {
      const rawValue = typeof urlParams.get === 'function' ? urlParams.get('studioiso') : null;
      const normalized = (rawValue || '1').toString().toLowerCase();
      enabled = !['0', 'false', 'off', 'no'].includes(normalized);
    }
  }
  return enabled;
})();

const STUDIO_VIDEO_FEATURE_FLAG = true;

function injectStylesheet() {
  if (document.getElementById('podcast-studio-style')) {
    return;
  }
  const link = document.createElement('link');
  link.id = 'podcast-studio-style';
  link.rel = 'stylesheet';
  link.href = new URL('./studio.css?v=16', import.meta.url).toString();
  document.head.appendChild(link);
}

function createElement(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (key === 'text') {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  });
  return el;
}

function makeCollapsible(panel, title, storageKey = null) {
  panel.dataset.collapsible = 'true';

  // Add title h2 if provided and panel doesn't already have one
  if (title && !panel.querySelector('h2')) {
    const h2 = createElement('h2', '', { text: title });
    panel.insertBefore(h2, panel.firstChild);
  }

  // Create toggle button (will be positioned absolute in top right via CSS)
  const toggle = createElement('button', 'panel-collapse-toggle', { type: 'button', text: '−', title: 'Collapse section' });

  // Load saved state
  let collapsed = false;
  if (storageKey) {
    try {
      collapsed = localStorage.getItem(storageKey) === 'true';
    } catch (e) {}
  }

  const updateState = () => {
    panel.dataset.collapsed = collapsed ? 'true' : 'false';
    toggle.textContent = collapsed ? '+' : '−';
    toggle.title = collapsed ? 'Expand section' : 'Collapse section';
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, collapsed ? 'true' : 'false');
      } catch (e) {}
    }
  };

  toggle.addEventListener('click', () => {
    collapsed = !collapsed;
    updateState();
  });

  panel.appendChild(toggle);
  updateState();

  return { toggle };
}

function dispatchStudioEvent(name, detail = {}) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return;
  }
  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch (error) {
    console.warn('Unable to dispatch studio event', name, error);
  }
}

const SPECTROGRAM_GRADIENT = [
  { stop: 0, color: [4, 5, 13] }, // floor
  { stop: 0.25, color: [24, 60, 140] },
  { stop: 0.45, color: [47, 231, 163] }, // studio green accent
  { stop: 0.7, color: [255, 153, 68] }, // warning orange
  { stop: 1, color: [255, 255, 255] },
];

const DEFAULT_SPECTROGRAM_OPTIONS = {
  fps: 24,
  pixelStep: 1,
  decay: 0.008,
  noiseFloor: 2,
  gamma: 0.65,
  frequencyExponent: 0.95,
  lowFrequencyCutoff: 0.55,
  lowFrequencyGain: 1.1,
  lowFrequencySpread: 2,
};

function lerpColorChannel(start, end, ratio) {
  return Math.round(start + (end - start) * ratio);
}

function pickSpectrogramColor(value) {
  const clamped = Math.min(1, Math.max(0, value));
  for (let i = 1; i < SPECTROGRAM_GRADIENT.length; i += 1) {
    const prev = SPECTROGRAM_GRADIENT[i - 1];
    const next = SPECTROGRAM_GRADIENT[i];
    if (clamped <= next.stop) {
      const span = next.stop - prev.stop || 1;
      const ratio = (clamped - prev.stop) / span;
      return [
        lerpColorChannel(prev.color[0], next.color[0], ratio),
        lerpColorChannel(prev.color[1], next.color[1], ratio),
        lerpColorChannel(prev.color[2], next.color[2], ratio),
      ];
    }
  }
  const fallback = SPECTROGRAM_GRADIENT[SPECTROGRAM_GRADIENT.length - 1];
  return [...fallback.color];
}

class SpectrogramRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext ? canvas.getContext('2d', { alpha: true }) : null;
    this.options = { ...DEFAULT_SPECTROGRAM_OPTIONS, ...options };
    this.pixelStepBase = Math.max(1, this.options.pixelStep);
    this.frameInterval = this.options.fps > 0 ? 1000 / this.options.fps : 0;
    this.lastFrame = 0;
    this.animationFrame = null;
    this.resizeObserver = null;
    this.resizeListener = null;
    this.columnBuffer = null;
    this.analyser = null;
    this.frequencyData = null;
    this.width = 0;
    this.height = 0;
    this.pixelStep = this.pixelStepBase;
    this.noiseFloor = Math.max(0, this.options.noiseFloor);
    this.gamma = Math.max(0.25, Math.min(1.5, this.options.gamma));
    this.frequencyExponent = Math.max(0.4, Math.min(2.4, this.options.frequencyExponent));
    this.lowFrequencyCutoff = Math.min(0.9, Math.max(0.05, this.options.lowFrequencyCutoff || 0.3));
    this.lowFrequencyGain = Math.max(1, this.options.lowFrequencyGain || 1.2);
    this.lowFrequencySpread = Math.max(1, Math.round(this.options.lowFrequencySpread || 2));
    this.baseFillStyle = 'rgb(4, 5, 13)';
    this.boundResize = () => this.handleResize();
    this.renderLoop = (timestamp) => this.tick(timestamp);
    if (this.ctx && this.canvas) {
      this.ctx.imageSmoothingEnabled = false;
      this.observeResize();
      this.handleResize();
    }
  }

  observeResize() {
    if (!this.canvas) {
      return;
    }
    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(this.boundResize);
      this.resizeObserver.observe(this.canvas);
    } else {
      this.resizeListener = this.boundResize;
      window.addEventListener('resize', this.resizeListener);
    }
  }

  handleResize() {
    if (!this.canvas || !this.ctx) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const nextWidth = Math.max(10, Math.floor(rect.width * dpr) || 10);
    const nextHeight = Math.max(10, Math.floor(rect.height * dpr) || 10);
    if (nextWidth === this.width && nextHeight === this.height) {
      return;
    }
    this.width = nextWidth;
    this.height = nextHeight;
    this.pixelStep = Math.max(1, Math.round(this.pixelStepBase * dpr));
    this.canvas.width = nextWidth;
    this.canvas.height = nextHeight;
    this.columnBuffer = this.ctx.createImageData(this.pixelStep, this.height);
    this.ctx.fillStyle = this.baseFillStyle;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  ensureColumnBuffer() {
    if (!this.ctx) {
      return null;
    }
    if (!this.columnBuffer || this.columnBuffer.height !== this.height || this.columnBuffer.width !== this.pixelStep) {
      this.columnBuffer = this.ctx.createImageData(this.pixelStep, this.height);
    }
    return this.columnBuffer;
  }

  normalizeMagnitude(rawValue) {
    if (!Number.isFinite(rawValue)) {
      return 0;
    }
    const adjusted = Math.max(0, rawValue - this.noiseFloor);
    const normalized = Math.min(1, adjusted / (255 - this.noiseFloor));
    return Math.pow(normalized, this.gamma);
  }

  setAnalyser(analyser) {
    if (this.analyser === analyser) {
      return;
    }
    this.analyser = analyser || null;
    this.frequencyData = this.analyser ? new Uint8Array(this.analyser.frequencyBinCount) : null;
    if (this.analyser) {
      this.startLoop();
    } else {
      this.stopLoop();
    }
  }

  startLoop() {
    if (this.animationFrame || !this.analyser) {
      return;
    }
    this.lastFrame = 0;
    this.animationFrame = requestAnimationFrame(this.renderLoop);
  }

  stopLoop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  tick(timestamp) {
    if (!this.analyser || !this.frequencyData || !this.ctx || !this.canvas) {
      this.stopLoop();
      return;
    }
    if (this.frameInterval && timestamp - this.lastFrame < this.frameInterval) {
      this.animationFrame = requestAnimationFrame(this.renderLoop);
      return;
    }
    this.lastFrame = timestamp;
    this.drawColumn();
    this.animationFrame = requestAnimationFrame(this.renderLoop);
  }

  drawColumn() {
    if (!this.analyser || !this.frequencyData || !this.ctx) {
      return;
    }
    try {
      this.analyser.getByteFrequencyData(this.frequencyData);
    } catch (error) {
      console.warn('Spectrogram analyser unavailable', error);
      this.frequencyData = null;
      return;
    }
    const width = this.canvas.width;
    const height = this.canvas.height;
    const shift = Math.min(this.pixelStep, Math.max(1, width - 1));
    if (!width || !height || !shift) {
      return;
    }
    this.ctx.drawImage(this.canvas, shift, 0, width - shift, height, 0, 0, width - shift, height);
    const fadeStrength = Math.max(0, Math.min(1, this.options.decay));
    if (fadeStrength > 0 && width - shift > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = fadeStrength;
      this.ctx.fillStyle = this.baseFillStyle;
      this.ctx.fillRect(0, 0, width - shift, height);
      this.ctx.restore();
    }
    // clear the area reserved for the new samples
    this.ctx.fillStyle = this.baseFillStyle;
    this.ctx.fillRect(width - shift, 0, shift, height);
    const column = this.ensureColumnBuffer();
    if (!column) {
      return;
    }
    const bins = this.frequencyData.length;
    for (let y = 0; y < height; y += 1) {
      const ratio = 1 - y / height;
      const curved = Math.pow(ratio, this.frequencyExponent); // slower exponent keeps low freqs visible
      const baseIndex = Math.max(0, Math.min(bins - 1, Math.floor(curved * (bins - 1))));
      let accumulator = 0;
      let samples = 0;
      const isLowBand = curved <= this.lowFrequencyCutoff;
      const spread = isLowBand ? this.lowFrequencySpread : 1;
      for (let i = 0; i < spread; i += 1) {
        const idx = Math.min(bins - 1, baseIndex + i);
        accumulator += this.frequencyData[idx];
        samples += 1;
      }
      let magnitude = this.normalizeMagnitude(accumulator / Math.max(1, samples));
      if (isLowBand) {
        magnitude = Math.min(1, magnitude * this.lowFrequencyGain);
      }
      const [r, g, b] = pickSpectrogramColor(magnitude);
      const alpha = Math.round(35 + magnitude * 220);
      for (let x = 0; x < shift; x += 1) {
        const offset = (y * shift + x) * 4;
        column.data[offset] = r;
        column.data[offset + 1] = g;
        column.data[offset + 2] = b;
        column.data[offset + 3] = alpha;
      }
    }
    this.ctx.putImageData(column, width - shift, 0);
  }

  destroy() {
    this.stopLoop();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
    this.analyser = null;
    this.frequencyData = null;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

const ROOM_QUERY_KEYS = ['room', 'roomid', 'r'];
const DIRECTOR_QUERY_KEYS = ['director', 'dir'];
const ROOM_STATE_STORAGE_KEY = 'podcastStudio.lastRoom';

function sanitizeRoomSlug(value) {
  if (!value) {
    return '';
  }
  const trimmed = String(value).trim();
  if (!trimmed) {
    return '';
  }
  try {
    if (typeof window.sanitizeRoomName === 'function') {
      return window.sanitizeRoomName(trimmed);
    }
  } catch (error) {
    console.warn('sanitizeRoomName unavailable', error);
  }
  return trimmed.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 64);
}

function getRoomSlugFromParams(params = new URLSearchParams(window.location.search)) {
  for (const key of DIRECTOR_QUERY_KEYS) {
    if (params.has(key)) {
      const slug = sanitizeRoomSlug(params.get(key));
      if (slug) {
        return slug;
      }
    }
  }
  for (const key of ROOM_QUERY_KEYS) {
    if (params.has(key)) {
      const slug = sanitizeRoomSlug(params.get(key));
      if (slug) {
        return slug;
      }
    }
  }
  return '';
}

function readStoredRoomState() {
  try {
    const raw = window.localStorage.getItem(ROOM_STATE_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        room: typeof parsed.room === 'string' ? parsed.room : '',
        password: typeof parsed.password === 'string' ? parsed.password : '',
      };
    }
  } catch (error) {
    console.warn('Unable to read stored room state', error);
  }
  return {};
}

function persistStoredRoomState(state) {
  try {
    window.localStorage.setItem(ROOM_STATE_STORAGE_KEY, JSON.stringify(state || {}));
  } catch (error) {
    console.warn('Unable to store room state', error);
  }
}

function readPreflightState() {
  try {
    const raw = window.localStorage.getItem(PREFLIGHT_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (error) {
    console.warn('Unable to read preflight cache', error);
  }
  return {};
}

function writePreflightState(state) {
  try {
    window.localStorage.setItem(PREFLIGHT_STORAGE_KEY, JSON.stringify(state || {}));
  } catch (error) {
    console.warn('Unable to persist preflight cache', error);
  }
}

function isPreflightFresh(timestamp) {
  if (!timestamp) {
    return false;
  }
  return Date.now() - timestamp < PREFLIGHT_CACHE_MS;
}

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return '';
  }
  const deltaSeconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (deltaSeconds < 45) {
    return 'just now';
  }
  if (deltaSeconds < 90) {
    return 'about a minute ago';
  }
  if (deltaSeconds < 45 * 60) {
    const minutes = Math.round(deltaSeconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  if (deltaSeconds < 90 * 60) {
    return 'about an hour ago';
  }
  if (deltaSeconds < 36 * 3600) {
    const hours = Math.round(deltaSeconds / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.round(deltaSeconds / 86400);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function createRecordingSessionId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (error) {
    console.warn('randomUUID unavailable', error);
  }
  return `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function snapshotHighResClock() {
  if (typeof performance === 'undefined' || typeof performance.now !== 'function') {
    return null;
  }
  const now = performance.now();
  const origin =
    typeof performance.timeOrigin === 'number'
      ? performance.timeOrigin
      : Date.now() - now;
  return {
    perfNow: now,
    timeOrigin: origin,
    wallClockMs: Math.round(origin + now),
  };
}

function readCloudLinkStatus() {
  try {
    const raw = window.localStorage.getItem(CLOUD_STATUS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Unable to read cloud link status', error);
    return {};
  }
}

function writeCloudLinkStatus(nextState) {
  const snapshot = nextState || {};
  try {
    window.localStorage.setItem(CLOUD_STATUS_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.warn('Unable to persist cloud link status', error);
    return;
  }
  dispatchStudioEvent(PODCAST_CLOUD_EVENT, { state: snapshot });
}

function isCloudLinkFresh(entry) {
  if (!entry?.linkedAt) {
    return false;
  }
  return Date.now() - entry.linkedAt < CLOUD_STATUS_STALE_MS;
}

function markCloudLinked(service, details = {}) {
  if (!service) {
    return;
  }
  const state = readCloudLinkStatus();
  state[service] = {
    linkedAt: Date.now(),
    ...details,
  };
  writeCloudLinkStatus(state);
}

function markCloudUnlinked(service) {
  if (!service) {
    return;
  }
  const state = readCloudLinkStatus();
  if (state[service]) {
    delete state[service];
    writeCloudLinkStatus(state);
  }
}

function readDiskRecordingState() {
  try {
    const raw = window.localStorage.getItem(DISK_RECORDING_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Unable to read disk recording state', error);
    return {};
  }
}

function readCaptureMode() {
  try {
    const raw = window.localStorage.getItem(CAPTURE_MODE_STORAGE_KEY);
    const normalized = (raw || 'audio').toString().toLowerCase();
    if (normalized === 'video') {
      return 'video';
    }
  } catch (error) {
    console.warn('Unable to read capture mode', error);
  }
  return 'audio';
}

function writeCaptureMode(mode) {
  const normalized = mode === 'video' ? 'video' : 'audio';
  try {
    window.localStorage.setItem(CAPTURE_MODE_STORAGE_KEY, normalized);
  } catch (error) {
    console.warn('Unable to persist capture mode', error);
  }
  return normalized;
}

function readIcecastSettings() {
  try {
    const raw = window.localStorage.getItem(ICECAST_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }
    const settings = { ...parsed };
    const version = Number(settings.version || 0);
    if (version < ICECAST_SETTINGS_VERSION && (!settings.mimeType || settings.mimeType === 'audio/webm;codecs=opus' || settings.mimeType === 'audio/webm')) {
      settings.mimeType = DEFAULT_ICECAST_MIME_TYPE;
    }
    if (version < 3 && !settings.mount && settings.targetUrl) {
      try {
        const target = new URL(settings.targetUrl);
        if (target.pathname && target.pathname !== '/') {
          settings.mount = decodeURIComponent(target.pathname.replace(/^\/+/, ''));
          target.pathname = '/';
          target.search = '';
          target.hash = '';
          settings.targetUrl = target.toString();
        }
      } catch (error) {
        console.warn('Unable to migrate Icecast mountpoint setting', error);
      }
    }
    settings.version = ICECAST_SETTINGS_VERSION;
    return settings;
  } catch (error) {
    console.warn('Unable to read Icecast settings', error);
    return {};
  }
}

function writeIcecastSettings(settings) {
  const safeSettings = { ...(settings || {}) };
  delete safeSettings.relayUrl;
  delete safeSettings.relayToken;
  safeSettings.version = ICECAST_SETTINGS_VERSION;
  try {
    window.localStorage.setItem(ICECAST_SETTINGS_STORAGE_KEY, JSON.stringify(safeSettings));
  } catch (error) {
    console.warn('Unable to store Icecast settings', error);
  }
}

function normalizeIcecastMount(value) {
  return (value || '').toString().trim().replace(/^\/+/, '');
}

function buildIcecastTargetUrl(settings = {}) {
  const targetUrl = (settings.targetUrl || '').trim();
  const mount = normalizeIcecastMount(settings.mount);
  if (!targetUrl || !mount) {
    return targetUrl;
  }
  try {
    const target = new URL(targetUrl);
    target.pathname = `/${mount}`;
    target.search = '';
    target.hash = '';
    return target.toString();
  } catch (error) {
    return targetUrl;
  }
}

function readUrlParam(name) {
  try {
    if (typeof urlParams !== 'undefined' && urlParams && typeof urlParams.get === 'function') {
      return urlParams.get(name) || '';
    }
  } catch (error) {
    console.warn('Unable to read URL params', error);
  }
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  } catch (error) {
    console.warn('Unable to parse URL params', error);
  }
  return '';
}

function resolveIcecastRelayUrl(settings = {}) {
  const configured =
    (typeof window !== 'undefined' && typeof window.VDO_NINJA_ICECAST_RELAY_URL === 'string'
      ? window.VDO_NINJA_ICECAST_RELAY_URL
      : '') ||
    readUrlParam('icecastrelay') ||
    readUrlParam('icecastrelayurl') ||
    settings.relayUrl ||
    DEFAULT_ICECAST_RELAY_URL;
  return (configured || '').trim();
}

function resolveIcecastRelayToken() {
  const configured =
    (typeof window !== 'undefined' && typeof window.VDO_NINJA_ICECAST_RELAY_TOKEN === 'string'
      ? window.VDO_NINJA_ICECAST_RELAY_TOKEN
      : '') ||
    readUrlParam('icecastrelaytoken');
  return (configured || '').trim();
}


function isDiskRecordingEnabled() {
  const state = readDiskRecordingState();
  return Boolean(state.folderName && state.enabled);
}

function setDiskRecordingEnabled(enabled) {
  const current = readDiskRecordingState();
  const next = {
    ...current,
    enabled: Boolean(enabled) && Boolean(current.folderName),
    updatedAt: Date.now(),
  };
  writeDiskRecordingState(next);
  return next;
}

function writeDiskRecordingState(state) {
  const snapshot = state || {};
  try {
    window.localStorage.setItem(DISK_RECORDING_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.warn('Unable to persist disk recording state', error);
    return;
  }
  dispatchStudioEvent(PODCAST_DISK_EVENT, { state: snapshot });
}

function openDiskHandleDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = window.indexedDB.open(DISK_DB_NAME, 1);
    request.onerror = () => reject(request.error || new Error('Unable to open disk handle database'));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DISK_DB_STORE)) {
        db.createObjectStore(DISK_DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function saveDiskDirectoryHandle(handle) {
  if (!handle) {
    return;
  }
  const db = await openDiskHandleDatabase();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DISK_DB_STORE, 'readwrite');
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Unable to store disk handle'));
    };
    tx.objectStore(DISK_DB_STORE).put(handle, 'primary');
  });
}

async function readDiskDirectoryHandle() {
  const db = await openDiskHandleDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DISK_DB_STORE, 'readonly');
    tx.oncomplete = () => {
      db.close();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Unable to read disk handle'));
    };
    const request = tx.objectStore(DISK_DB_STORE).get('primary');
    request.onsuccess = () => resolve(request.result || null);
  });
}

async function verifyStoredDiskRecordingDirectory({ requestPermission = false } = {}) {
  try {
    const handle = await readDiskDirectoryHandle();
    if (!handle) {
      return { ok: false, message: 'No folder selected yet.' };
    }
    let permission = await handle.queryPermission({ mode: 'readwrite' });
    if (permission === 'prompt' && requestPermission) {
      permission = await handle.requestPermission({ mode: 'readwrite' });
    }
    if (permission !== 'granted') {
      return { ok: false, message: 'Access to the selected folder was denied.' };
    }
    const meta = readDiskRecordingState();
    writeDiskRecordingState({
      ...meta,
      lastVerifiedAt: Date.now(),
      folderName: meta.folderName || handle.name || 'Selected folder',
      lastError: null,
    });
    return { ok: true, folderName: meta.folderName || handle.name || 'Selected folder' };
  } catch (error) {
    console.warn('Failed to verify disk folder', error);
    const meta = readDiskRecordingState();
    writeDiskRecordingState({
      ...meta,
      lastError: error?.message || 'Unable to verify folder access.',
    });
    return { ok: false, message: error?.message || 'Unable to verify folder access.' };
  }
}

async function chooseDiskRecordingDirectory() {
  if (typeof window.showDirectoryPicker !== 'function') {
    throw new Error('This browser does not support the file-system directory picker yet.');
  }
  const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
  if (!handle) {
    throw new Error('Folder selection was cancelled.');
  }
  await saveDiskDirectoryHandle(handle);
  const meta = readDiskRecordingState();
  writeDiskRecordingState({
    ...meta,
    folderName: handle.name || 'Recording folder',
    lastVerifiedAt: Date.now(),
    lastError: null,
  });
  return { handle, folderName: handle.name || 'Recording folder' };
}

function buildRoomGate(defaults = {}) {
  injectStylesheet();

  const gate = createElement('div', '', { id: 'podcast-room-gate' });
  const panel = createElement('div', 'podcast-room-gate__panel');
  const title = createElement('h1', 'podcast-room-gate__title', { text: 'Start a Control Room' });
  const subtitle = createElement('p', 'podcast-room-gate__subtitle', {
    text: 'Name your room to invite talent and capture their tracks. This matches the “&director=” link you share with guests.',
  });

  const form = createElement('form', 'podcast-room-gate__form');
  const roomLabel = createElement('label');
  roomLabel.append(createElement('span', '', { text: 'Room name' }));
  const roomInput = createElement('input');
  roomInput.name = 'room';
  roomInput.placeholder = defaults.roomPlaceholder || 'podcast-hq';
  roomInput.title = 'This name becomes the room slug used in guest links.';
  roomInput.autocomplete = 'off';
  roomInput.autocapitalize = 'off';
  roomInput.spellcheck = false;
  if (defaults.room) {
    roomInput.value = defaults.room;
  }
  roomLabel.append(roomInput);

  const passwordLabel = createElement('label');
  passwordLabel.append(createElement('span', '', { text: 'Room password (optional)' }));
  const passwordInput = createElement('input');
  passwordInput.name = 'password';
  passwordInput.placeholder = 'Leave blank to skip';
  passwordInput.title = 'Optional room password for guests and directors.';
  passwordInput.type = 'text';
  passwordInput.autocomplete = 'off';
  passwordInput.autocapitalize = 'off';
  passwordInput.spellcheck = false;
  if (defaults.password) {
    passwordInput.value = defaults.password;
  }
  passwordLabel.append(passwordInput);

  const errorNode = createElement('div', 'podcast-room-gate__error');

  const actions = createElement('div', 'podcast-room-gate__actions');
  const cancelButton = createElement('button', 'podcast-room-gate__cancel', {
    type: 'button',
    text: 'Back to classic',
    title: 'Return to the classic VDO.Ninja interface.',
  });
  const submitButton = createElement('button', 'podcast-room-gate__submit', {
    type: 'submit',
    text: 'Enter studio',
    title: 'Enter the podcast studio for this room.',
  });
  actions.append(submitButton, cancelButton);

  form.append(roomLabel, passwordLabel, errorNode, actions);
  panel.append(title, subtitle, form);
  gate.append(panel);
  document.body.append(gate);

  document.body.classList.remove('hidden');
  document.body.classList.add('podcast-studio-mode');

  setTimeout(() => {
    roomInput.focus();
    roomInput.select();
  }, 0);

  return {
    gate,
    form,
    roomInput,
    passwordInput,
    errorNode,
    submitButton,
    cancelButton,
  };
}

async function ensureRoomSelection() {
  const params = new URLSearchParams(window.location.search);
  const existing = getRoomSlugFromParams(params);
  if (existing) {
    injectStylesheet();
    const preflight = await runPreflightChecklist({ roomSlug: existing });
    if (preflight?.redirect) {
      return preflight;
    }
    return { roomSlug: preflight?.roomSlug || existing };
  }

  const stored = readStoredRoomState();
  const gateElements = buildRoomGate(stored);

  return new Promise((resolve) => {
    function redirectToClassic() {
      const base = window.location.pathname;
      gateElements.cancelButton.disabled = true;
      gateElements.submitButton.disabled = true;
      window.location.href = base || '/';
      resolve({ redirect: true });
    }

    function handleSubmit(event) {
      event.preventDefault();
      const slug = sanitizeRoomSlug(gateElements.roomInput.value);
      if (!slug) {
        gateElements.errorNode.textContent = 'Room name is required.';
        return;
      }
      gateElements.errorNode.textContent = '';
      gateElements.submitButton.disabled = true;
      gateElements.cancelButton.disabled = true;

      const updatedParams = new URLSearchParams(window.location.search);
      updatedParams.set('studio', 'podcast');
      updatedParams.set('director', slug);
      for (const key of DIRECTOR_QUERY_KEYS) {
        if (key !== 'director') {
          updatedParams.delete(key);
        }
      }
      for (const key of ROOM_QUERY_KEYS) {
        updatedParams.delete(key);
      }

      const password = gateElements.passwordInput.value.trim();
      if (password) {
        updatedParams.set('password', password);
      } else {
        updatedParams.delete('password');
      }

      persistStoredRoomState({ room: slug, password });
      window.location.search = updatedParams.toString();
      resolve({ redirect: true });
    }

    gateElements.form.addEventListener('submit', (event) => handleSubmit(event));
    gateElements.cancelButton.addEventListener('click', (event) => {
      event.preventDefault();
      redirectToClassic();
    });
    // Rely on form submit for enter/return handling.
  });
}

function describePreflightStatus(status) {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'testing':
      return 'Testing…';
    case 'error':
      return 'Needs attention';
    default:
      return 'Pending';
  }
}

function createPreflightRow(label, description, options = {}) {
  const {
    initialStatus = 'pending',
    actionLabel = 'Test',
    showAction = true,
  } = options;
  const row = createElement('div', 'preflight-row');
  row.dataset.status = initialStatus;

  const info = createElement('div', 'preflight-row__info');
  const labelNode = createElement('div', 'preflight-row__label', { text: label });
  const descriptionNode = createElement('div', 'preflight-row__description', { text: description });
  const messageNode = createElement('div', 'preflight-row__message');
  info.append(labelNode, descriptionNode, messageNode);

  const controls = createElement('div', 'preflight-row__controls');
  const statusNode = createElement('span', 'preflight-row__status', { text: describePreflightStatus(initialStatus) });
  controls.append(statusNode);

  let actionButton = null;
  if (showAction) {
    actionButton = createElement('button', 'preflight-row__action', { type: 'button', text: actionLabel, title: `Run: ${label}` });
    controls.append(actionButton);
  }

  row.append(info, controls);
  return {
    row,
    info,
    statusNode,
    messageNode,
    actionButton,
  };
}

function setPreflightRowState(rowParts, status, message = '') {
  if (!rowParts || !rowParts.row) {
    return;
  }
  rowParts.row.dataset.status = status;
  if (rowParts.statusNode) {
    rowParts.statusNode.textContent = describePreflightStatus(status);
  }
  if (rowParts.messageNode) {
    rowParts.messageNode.textContent = message || '';
  }
  if (rowParts.actionButton) {
    if (status === 'testing') {
      rowParts.actionButton.disabled = true;
    } else {
      rowParts.actionButton.disabled = false;
    }
    if (status === 'ready') {
      rowParts.actionButton.textContent = 'Retest';
    } else if (status === 'testing') {
      rowParts.actionButton.textContent = 'Testing…';
    } else if (status === 'error') {
      rowParts.actionButton.textContent = 'Retry';
    } else {
      rowParts.actionButton.textContent = rowParts.actionButton.dataset.initialLabel || 'Test';
    }
  }
}

async function runPreflightChecklist({ roomSlug } = {}) {
  const stored = readPreflightState();
  const now = Date.now();
  const micFresh = isPreflightFresh(stored.micSuccessAt);
  const camFresh = isPreflightFresh(stored.cameraSuccessAt);

  // If the user just completed the preflight moments ago, allow immediate pass-through.
  if (stored.completedAt && now - stored.completedAt < PREFLIGHT_MIN_MANDATORY_MS) {
    document.body.classList.remove('hidden');
    document.body.classList.add('podcast-studio-mode');
    return { roomSlug, skipped: true };
  }

  const overlay = createElement('div', 'podcast-preflight-backdrop');
  overlay.dataset.podcastOverlay = 'true';
  // Inline styles ensure overlay is styled before external CSS loads
  overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);z-index:9999';
  const panel = createElement('div', 'podcast-preflight-panel');
  panel.style.cssText = 'background:#1a1d24;padding:32px;border-radius:12px;color:#fff;max-width:480px;width:90%';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Podcast studio preflight checklist');

  const heading = createElement('h2', 'preflight-title', { text: 'Check Your Setup' });
  const subtitleText = roomSlug
    ? `Confirm your gear before directing room “${roomSlug}”.`
    : 'Confirm your gear before directing a session.';
  const subtitle = createElement('p', 'preflight-subtitle', { text: subtitleText });

  const checklist = createElement('div', 'preflight-list');
  const micRow = createPreflightRow('Microphone access', 'Verify your preferred mic is available and browser permission is granted.', {
    initialStatus: micFresh ? 'ready' : 'pending',
    actionLabel: micFresh ? 'Retest' : 'Test mic',
  });
  if (micRow.actionButton) {
    micRow.actionButton.dataset.initialLabel = micFresh ? 'Retest' : 'Test mic';
  }
  if (micFresh) {
    setPreflightRowState(micRow, 'ready', `Last checked ${formatRelativeTime(stored.micSuccessAt)}.`);
  }

  const camRow = createPreflightRow('Camera access', 'Optional but useful if you plan to capture video.', {
    initialStatus: camFresh ? 'ready' : 'pending',
    actionLabel: camFresh ? 'Retest' : 'Test camera',
  });
  if (camRow.actionButton) {
    camRow.actionButton.dataset.initialLabel = camFresh ? 'Retest' : 'Test camera';
  }
  if (camFresh) {
    setPreflightRowState(camRow, 'ready', `Last checked ${formatRelativeTime(stored.cameraSuccessAt)}.`);
  }

  const diskRow = createPreflightRow(
    'Local disk recording',
    'Select a destination folder for ISO files (optional but recommended).',
    {
      initialStatus: 'pending',
      showAction: Boolean(window.showDirectoryPicker),
      actionLabel: window.showDirectoryPicker ? 'Choose folder' : 'Unavailable',
    }
  );
  if (!window.showDirectoryPicker && diskRow.actionButton) {
    diskRow.actionButton.disabled = true;
  }
  setPreflightRowState(
    diskRow,
    window.showDirectoryPicker ? 'pending' : 'error',
    window.showDirectoryPicker ? 'No folder selected yet.' : 'Local disk recording requires the File System Access API (Chromium-based browsers).'
  );

  checklist.append(micRow.row, camRow.row, diskRow.row);

  const actions = createElement('div', 'preflight-actions');
  const continueButton = createElement('button', 'preflight-primary', { type: 'button', text: 'Enter Control Room', title: 'Enter the podcast studio.' });
  const skipButton = createElement('button', 'preflight-secondary', { type: 'button', text: 'Skip preflight', title: 'Skip these checks and enter the studio.' });
  actions.append(continueButton, skipButton);

  panel.append(heading, subtitle, checklist, actions);
  overlay.append(panel);
  document.body.append(overlay);

  document.body.classList.remove('hidden');
  document.body.classList.add('podcast-studio-mode');

  let micOk = Boolean(micFresh);
  let camOk = Boolean(camFresh);
  let diskReady = false;
  let destroyed = false;
  let diskStatusListener = null;
  let resolver;
  const completion = new Promise((resolve) => {
    resolver = resolve;
  });

  function closeOverlay(result = {}) {
    if (destroyed) {
      return;
    }
    destroyed = true;
    if (diskStatusListener) {
      window.removeEventListener(PODCAST_DISK_EVENT, diskStatusListener);
      diskStatusListener = null;
    }
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    const payload = { roomSlug, ...result };
    if (result.completed) {
      writePreflightState({
        ...stored,
        completedAt: Date.now(),
        micSuccessAt: micOk ? (stored.micSuccessAt || Date.now()) : stored.micSuccessAt,
        cameraSuccessAt: camOk ? (stored.cameraSuccessAt || Date.now()) : stored.cameraSuccessAt,
        roomSlug,
      });
    } else {
      writePreflightState({
        ...stored,
        micSuccessAt: micOk ? (stored.micSuccessAt || Date.now()) : stored.micSuccessAt,
        cameraSuccessAt: camOk ? (stored.cameraSuccessAt || Date.now()) : stored.cameraSuccessAt,
        roomSlug,
      });
    }
    if (typeof resolver === 'function') {
      resolver(payload);
      resolver = null;
    }
  }

  function updateContinueState() {
    continueButton.disabled = !micOk;
    continueButton.title = micOk ? '' : 'Run the microphone test to continue.';
  }

  updateContinueState();

  async function runMediaTest(kind) {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      throw new Error('Browser does not support media tests.');
    }
    const constraints = kind === 'video' ? { video: true } : { audio: { echoCancellation: false } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (error) {
        console.warn('Unable to stop track', error);
      }
    });
  }

  if (micRow.actionButton) {
    micRow.actionButton.addEventListener('click', async () => {
      setPreflightRowState(micRow, 'testing', 'Requesting microphone access…');
      try {
        await runMediaTest('audio');
        micOk = true;
        const timestamp = Date.now();
        stored.micSuccessAt = timestamp;
        setPreflightRowState(micRow, 'ready', 'Microphone ready to record.');
      } catch (error) {
        console.error('Microphone check failed', error);
        micOk = false;
        setPreflightRowState(
          micRow,
          'error',
          error?.message ? error.message : 'Unable to access microphone.'
        );
      }
      updateContinueState();
      writePreflightState({ ...stored, micSuccessAt: micOk ? Date.now() : stored.micSuccessAt, roomSlug });
    });
  }

  if (camRow.actionButton) {
    camRow.actionButton.addEventListener('click', async () => {
      setPreflightRowState(camRow, 'testing', 'Requesting camera access…');
      try {
        await runMediaTest('video');
        camOk = true;
        const timestamp = Date.now();
        stored.cameraSuccessAt = timestamp;
        setPreflightRowState(camRow, 'ready', 'Camera detected.');
        writePreflightState({ ...stored, cameraSuccessAt: timestamp, roomSlug });
      } catch (error) {
        console.error('Camera check failed', error);
        camOk = false;
        setPreflightRowState(
          camRow,
          'error',
          error?.message ? error.message : 'Unable to access camera.'
        );
        writePreflightState({ ...stored, roomSlug });
      }
    });
  }

  async function refreshDiskRowStatus({ interactive = false } = {}) {
    if (typeof window.showDirectoryPicker !== 'function') {
      diskReady = false;
      setPreflightRowState(
        diskRow,
        'error',
        'Local disk recording requires a Chromium-based browser with the File System Access API.'
      );
      if (diskRow.actionButton) {
        diskRow.actionButton.disabled = true;
      }
      return;
    }
    const diskState = readDiskRecordingState();
    if (!diskState.folderName) {
      diskReady = false;
      if (diskRow.actionButton) {
        diskRow.actionButton.textContent = 'Choose folder';
        diskRow.actionButton.disabled = false;
      }
      setPreflightRowState(diskRow, 'pending', 'Pick a folder to enable local ISO recording.');
      return;
    }
    setPreflightRowState(diskRow, 'testing', 'Validating folder permissions…');
    const result = await verifyStoredDiskRecordingDirectory({ requestPermission: interactive });
    if (result.ok) {
      diskReady = true;
      const meta = readDiskRecordingState();
      if (diskRow.actionButton) {
        diskRow.actionButton.textContent = 'Change folder';
        diskRow.actionButton.disabled = false;
      }
      const checked = meta.lastVerifiedAt ? `Last checked ${formatRelativeTime(meta.lastVerifiedAt)}.` : 'Ready to write.';
      setPreflightRowState(diskRow, 'ready', `Folder: ${result.folderName}. ${checked}`);
    } else {
      diskReady = false;
      if (diskRow.actionButton) {
        diskRow.actionButton.textContent = 'Choose folder';
        diskRow.actionButton.disabled = false;
      }
      setPreflightRowState(diskRow, 'error', result.message || 'Unable to access the selected folder.');
    }
  }

  refreshDiskRowStatus();
  diskStatusListener = () => refreshDiskRowStatus();
  window.addEventListener(PODCAST_DISK_EVENT, diskStatusListener);

  if (diskRow.actionButton) {
    diskRow.actionButton.addEventListener('click', async () => {
      if (diskRow.actionButton.disabled) {
        return;
      }
      try {
        setPreflightRowState(diskRow, 'testing', 'Waiting for folder selection…');
        await chooseDiskRecordingDirectory();
        await refreshDiskRowStatus({ interactive: true });
      } catch (error) {
        diskReady = false;
        const message =
          error?.name === 'AbortError' || /cancel/i.test(error?.message || '')
            ? 'Folder selection cancelled.'
            : error?.message || 'Unable to choose folder.';
        setPreflightRowState(diskRow, 'error', message);
      }
    });
  }

  continueButton.addEventListener('click', () => {
    if (!micOk) {
      setPreflightRowState(micRow, 'error', 'Microphone test is required before entering.');
      return;
    }
    closeOverlay({ completed: true });
  });

  skipButton.addEventListener('click', () => {
    closeOverlay({ skipped: true });
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeOverlay({ skipped: true });
    }
  });

  document.addEventListener(
    'keydown',
    (event) => {
      if (destroyed) {
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        closeOverlay({ skipped: true });
      }
    },
    { once: true }
  );

  return completion;
}

function extractPeerAudioStats(peer) {
  const stats = peer?.stats || {};
  const candidates = [
    stats.audio_bitrate_kbps,
    stats.inbound_audio_bitrate_kbps,
    stats.total_audio_bitrate_kbps,
    stats.total_sending_bitrate_kbps,
  ];
  const audioBitrateKbps = candidates.find((value) => typeof value === 'number' && value >= 0);
  const codec =
    typeof stats.audio_codec === 'string'
      ? stats.audio_codec
      : typeof stats.audio_codec_in === 'string'
        ? stats.audio_codec_in
        : typeof stats.audio_codec_out === 'string'
          ? stats.audio_codec_out
          : '';
  return {
    audioBitrateKbps: audioBitrateKbps ?? null,
    audioCodec: codec || null,
  };
}

function collectParticipants(session) {
  const participants = [];

  Object.entries(session.rpcs || {}).forEach(([uuid, peer]) => {
    if (!peer) {
      return;
    }
    const audioTracks = peer.streamSrc?.getAudioTracks?.() || [];
    let level = 0;
    if (peer.stats && typeof peer.stats.Audio_Loudness === 'number') {
      level = peer.stats.Audio_Loudness;
    } else if (peer.audioMeter) {
      level = peer.audioMeter.level || 0;
    }
    const { audioBitrateKbps, audioCodec } = extractPeerAudioStats(peer);
    participants.push({
      uuid,
      label: peer.label || peer.streamID || `Guest ${uuid.substring(0, 4)}`,
      streamID: peer.streamID,
      status: (peer.streamSrc && audioTracks.length) ? 'connected' : 'connecting',
      audioLevel: level,
      isLocal: false,
      role: 'remote',
      audioBitrateKbps,
      audioCodec,
    });
  });

  return participants;
}

class PodcastStudioApp {
  constructor(options = {}) {
    this.options = options || {};
    this.roomHint = this.options.roomHint || '';
    this.session = null;
    this.cloud = null;
    this.recorder = null;
    this.audioContext = null;
    this.recording = false;
    this.rosterItems = new Map();
    this.rosterDriveButtons = new Map();
    this.rosterDriveStatuses = new Map();
    this.driveStatusResetTimers = new Map();
    this.driveRequestTimers = new Map();
    this.driveRecorderStates = new Map();
    this.driveProgressSnapshots = new Map();
    this.meterValues = new Map();
    this.outputIndicators = new Map();
    this.trackRuntimeStats = new Map();
    this.trackLevelNodes = new Map();
    this.spectrograms = new Map();
    this.participantMetrics = new Map();
    this.markers = [];
    this.markerActions = null;
    this.markerExportButton = null;
    this.markerCopyButton = null;
    this.markerCopyResetTimer = null;
    this.autoMarkerTimeout = null;
    this.rosterTimer = null;
    this.levelOff = null;
    this.recordStartedAt = null;
    this.driveStatusNode = null;
    this.dropboxStatusNode = null;
    this.abortUploadsController = null;
    this.activeDownloadUrls = [];
    this.stopMeterBridge = null;
    this.roomName = this.roomHint || '';
    this.virtualParticipants = new Map();
    this.hostMic = null;
    this.hostMicMeter = null;
    this.hostMicMeterTrack = null;
    this.hostMicPublishGeneration = 0;
    this.hostMicCancelWatchdog = null;
    this.hostMicButton = null;
    this.hostMicStatusNode = null;
    this.hostMicErrorNode = null;
    this.hostMicBusy = false;
    this.hostMicMuted = false;
    this.hostMuteButton = null;
    this.cloudBusy = {
      drive: false,
      dropbox: false,
    };
    this.cloudLinkButtons = {
      drive: null,
      dropbox: null,
    };
    this.cloudLinkStatusNodes = {
      drive: null,
      dropbox: null,
    };
    this.cloudLinkMessages = {
      drive: null,
      dropbox: null,
    };
    this.cloudLinkMessageTextNodes = {
      drive: null,
      dropbox: null,
    };
    this.dropboxTokenInput = null;
    this.dropboxTokenRow = null;
    this.dropboxGuideRow = null;
    this.inviteLinkInput = null;
    this.inviteCopyButton = null;
    this.inviteStatusNode = null;
    this.inviteOptionNodes = {};
    this.inviteCopyTimer = null;
    this.remoteOverlay = null;
    this.remoteOverlayContent = null;
    this.remoteControlState = {
      activeUuid: null,
      element: null,
      placeholder: null,
      wrapper: null,
    };
    this.cloudProgressNodes = {
      drive: null,
      dropbox: null,
    };
    this.uploadTrackers = {
      drive: new Map(),
      dropbox: new Map(),
    };
    this.chatModule = null;
    this.chatPlaceholder = null;
    this.chatPanel = null;
    this.chatCollapseButton = null;
    this.chatPopoutButton = null;
    this.chatCollapsed = false;
    this.chatPopoutAnchor = null;
    this.chatCollapsedHint = null;
    this.diskControls = null;
    this.diskToggleButton = null;
    this.diskFolderButton = null;
    this.diskStatusNode = null;
    this.diskRecordingEnabled = isDiskRecordingEnabled();
    this.diskStateListener = null;
    this.cloudStateListener = null;
    this.cloudSummaryNode = null;
    this.captureSummaryNode = null;
    this.backupSummaryNode = null;
    this.saveSummaryNode = null;
    this.summaryWarningNode = null;
    this.recordingSummary = null;
    this.destinationLights = { download: null, drive: null, dropbox: null, disk: null };
    this.guestBackupRow = null;
    this.guestBackupHint = null;
    this.isoSummary = null;
    this.captureModeSelect = null;
    this.recordingStatusNode = null;
    this.recordingStatusTimer = null;
    this.recordingStatusBase = 'Idle';
    this.recordingStatusState = 'idle';
    this.recordTransitioning = false;
    this.recordingPlan = null;
    this.recordingSessionId = null;
    this.boundDriveProgressHandler = null;
    this.boundRemoteRecorderHandler = null;
    this.guestBackupBusy = false;
    this.guestBackupButton = null;
    this.guestBackupStatusNode = null;
    this.currentRecordingMode = readCaptureMode();
    this.icecastPublisher = null;
    this.icecastButton = null;
    this.icecastSettingsButton = null;
    this.icecastSettingsPanel = null;
    this.icecastStatusNode = null;
    this.icecastTargetInput = null;
    this.icecastMountInput = null;
    this.icecastUsernameInput = null;
    this.icecastPasswordInput = null;
    this.icecastMimeSelect = null;
    this.icecastPublicInput = null;
    this.icecastNameInput = null;
    this.icecastGenreInput = null;
    this.icecastLive = false;
    this.icecastBusy = false;
    this.icecastSettingsOpen = false;
  }

  async init() {
    document.body.classList.remove('hidden');
    document.body.classList.add('podcast-studio-mode');
    injectStylesheet();

    this.session = await waitForLegacySession({ timeoutMs: 15000 });
    this.applyDirectorAudioDefaults();
    this.audioContext = this.session.audioCtx || this.session.audioCtxOutbound || this.createAudioContext();
    this.recorder = new MultiTrackRecorder({
      audioContext: this.audioContext,
      includeVideo: false,
      includeScreenshares: false,
      monitorLevels: true,
      timeslice: 1000,
    });
    this.icecastPublisher = new IcecastPublisher({
      audioContext: this.audioContext,
      getParticipants: () => this.getIcecastMixParticipants(),
    });
    this.attachIcecastEvents();
    this.cloud = new CloudUploadCoordinator(this.session);

    this.roomName = this.resolveRoomName();
    this.buildLayout();
    this.updateIcecastUI();
    this.updateReadinessSummary();
    this.updateRecordingButtons();
    if (STUDIO_DISK_FEATURE_FLAG) {
      this.diskStateListener = () => {
        this.updateDiskRecordingUI();
        this.updateReadinessSummary();
      };
      window.addEventListener(PODCAST_DISK_EVENT, this.diskStateListener);
    }
    this.cloudStateListener = () => this.updateReadinessSummary();
    window.addEventListener(PODCAST_CLOUD_EVENT, this.cloudStateListener);
    this.boundDriveProgressHandler = (event) => this.handleDriveProgressEvent(event);
    window.addEventListener(DRIVE_PROGRESS_EVENT, this.boundDriveProgressHandler);
    this.boundRemoteRecorderHandler = (event) => this.handleRemoteRecorderStatusEvent(event);
    window.addEventListener(REMOTE_RECORDER_EVENT, this.boundRemoteRecorderHandler);
    this.updateRoomIndicator();
    this.updateCloudFooter();
    this.attachRecorderEvents();
    this.refreshRoster();
    this.startRosterLoop();
    this.levelOff = levelBus.on(LEVEL_EVENT, (payload) => this.updateMeterFromBus(payload));
    try {
      this.stopMeterBridge = await bridgeLegacyMeters();
    } catch (error) {
      console.warn('Failed to bridge legacy meter events', error);
    }
  }

  resolveRoomName() {
    if (this.session?.roomid && this.session.roomid !== true) {
      return sanitizeRoomSlug(this.session.roomid);
    }
    if (this.session?.director && this.session.director !== true) {
      return sanitizeRoomSlug(this.session.director);
    }
    if (this.roomHint) {
      return sanitizeRoomSlug(this.roomHint);
    }
    const paramsSlug = getRoomSlugFromParams();
    if (paramsSlug) {
      return paramsSlug;
    }
    return '';
  }

  updateRoomIndicator() {
    const latest = this.resolveRoomName();
    if (latest !== this.roomName) {
      this.roomName = latest;
      if (this.sessionInfo) {
        this.sessionInfo.textContent = this.roomName || '';
      }
      if (this.roomName) {
        const stored = readStoredRoomState();
        persistStoredRoomState({ room: this.roomName, password: stored?.password || '' });
      }
    }
    this.updateInviteLink();
  }

  describeInviteOptions() {
    const labels = [];
    if (this.inviteOptionNodes.disableVideo?.checked) {
      labels.push('Audio only');
    } else {
      labels.push('Video preview');
    }
    if (this.inviteOptionNodes.proAudio?.checked) {
      labels.push('Pro audio');
    }
    if (this.inviteOptionNodes.disableAec?.checked) {
      labels.push('AEC off');
    }
    if (this.inviteOptionNodes.disableDenoise?.checked) {
      labels.push('Denoise off');
    }
    if (this.inviteOptionNodes.disableAgc?.checked) {
      labels.push('AGC off');
    }
    return labels.join(' • ');
  }

  applyDirectorAudioDefaults() {
    if (!this.session) {
      return;
    }
    if (this.session.stereo === undefined || this.session.stereo === null || this.session.stereo === false || this.session.stereo === 0) {
      this.session.stereo = 1;
    }
    if (!this.session.audiobitrate || this.session.audiobitrate < 192) {
      this.session.audiobitrate = 256;
    }
    if (!this.session.outboundAudioBitrate || this.session.outboundAudioBitrate < 192) {
      this.session.outboundAudioBitrate = 256;
    }
    if (typeof this.session.autoGainControl === 'undefined') {
      this.session.autoGainControl = false;
    }
    if (typeof this.session.noiseSuppression === 'undefined') {
      this.session.noiseSuppression = false;
    }
    if (typeof this.session.echoCancellation === 'undefined') {
      this.session.echoCancellation = false;
    }
    if (typeof this.session.applyStereoDefaults === 'function') {
      try {
        this.session.applyStereoDefaults();
      } catch (error) {
        console.warn('applyStereoDefaults failed', error);
      }
    }
  }

  updateInviteLink() {
    if (!this.inviteLinkInput) {
      return;
    }
    const room = this.resolveRoomName();
    if (!room) {
      this.inviteLinkInput.value = 'Set a room name to generate a guest link';
      this.inviteLinkInput.dataset.state = 'placeholder';
      if (this.inviteCopyButton) {
        this.inviteCopyButton.disabled = true;
      }
      if (this.inviteStatusNode) {
        this.inviteStatusNode.textContent = '';
      }
      return;
    }
    this.inviteLinkInput.dataset.state = 'ready';
    if (this.inviteCopyButton) {
      this.inviteCopyButton.disabled = false;
    }
    const guestUrl = new URL(window.location.href);
    guestUrl.search = '';
    guestUrl.hash = '';

    const params = new URLSearchParams();
    params.set('room', room);
    params.set('style', '2');
    params.set('showlabel', '1');
    params.set('tips', '1');
    params.set('label', '');

    const options = this.inviteOptionNodes || {};
    const summary = [];
    summary.push('Label prompt');
    summary.push('Name tag overlay');
    summary.push('Join tips');

    // Video is ON by default
    if (options.disableVideo?.checked) {
      params.set('miconly', '1');
      summary.push('Audio only');
    } else {
      summary.push('Video enabled');
    }

    if (options.proAudio?.checked) {
      params.set('proaudio', '1');
      params.set('stereo', '1');
      params.set('audiobitrate', '256');
      summary.push('Pro audio');
    } else {
      params.delete('proaudio');
      params.delete('stereo');
      params.delete('audiobitrate');
    }

    if (options.disableAec?.checked) {
      params.set('aec', '0');
      params.set('echocancellation', '0');
      summary.push('AEC off');
    } else {
      params.delete('aec');
      params.delete('echocancellation');
    }

    if (options.disableDenoise?.checked) {
      params.set('denoise', '0');
      summary.push('Denoise off');
    } else {
      params.delete('denoise');
    }

    if (options.disableAgc?.checked) {
      params.set('agc', '0');
      params.set('autogain', '0');
      summary.push('AGC off');
    } else {
      params.delete('agc');
      params.delete('autogain');
    }

    if (options.guestRecordBackup?.checked) {
      params.set('autorecordlocal', '0');
      summary.push('Audio backup');
    } else {
      params.delete('autorecordlocal');
    }

    guestUrl.search = params.toString();
    const value = guestUrl.toString();
    this.inviteLinkInput.value = value;
    if (this.inviteStatusNode) {
      this.inviteStatusNode.textContent = summary.length ? summary.join(' • ') : 'Default settings';
    }
  }

  async copyInviteLink() {
    if (!this.inviteLinkInput || this.inviteLinkInput.dataset.state === 'placeholder') {
      return;
    }
    const value = this.inviteLinkInput.value;
    if (!value) {
      return;
    }
    const notify = (message, variant = 'info') => {
      if (!this.inviteStatusNode) {
        return;
      }
      this.inviteStatusNode.textContent = message;
      this.inviteStatusNode.dataset.variant = variant;
      if (this.inviteCopyTimer) {
        clearTimeout(this.inviteCopyTimer);
      }
      this.inviteCopyTimer = setTimeout(() => {
        this.inviteStatusNode.dataset.variant = '';
        this.updateInviteLink();
      }, 3500);
    };
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(value);
        notify('Guest link copied.', 'success');
        return;
      }
    } catch (error) {
      console.warn('Navigator clipboard copy failed', error);
    }
    try {
      this.inviteLinkInput.focus();
      this.inviteLinkInput.select();
      const success = document.execCommand('copy');
      if (success) {
        notify('Guest link copied.', 'success');
      } else {
        notify('Select and copy the link manually.', 'warning');
      }
    } catch (error) {
      console.warn('Fallback copy failed', error);
      notify('Select and copy the link manually.', 'warning');
    }
  }

  getAdditionalRecordingParticipants() {
    const extras = [];
    this.virtualParticipants.forEach((participant) => {
      if (participant && participant.stream) {
        extras.push({
          ...participant,
        });
      }
    });
    return extras;
  }

  async ensureAudioContextResumed() {
    if (!this.audioContext) {
      this.audioContext = this.createAudioContext();
    }
    if (this.audioContext && typeof this.audioContext.resume === 'function' && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context', error);
      }
    }
  }

  getPublishedHostMicStream() {
    const candidates = [
      this.session?.streamSrc || null,
      this.session?.videoElement?.srcObject || null,
    ];
    for (const stream of candidates) {
      const audioTracks = stream?.getAudioTracks?.() || [];
      if (audioTracks.some((track) => track && track.readyState !== 'ended')) {
        return stream;
      }
    }
    return null;
  }

  async waitForPublishedHostMicStream(timeoutMs = HOST_MIC_READY_TIMEOUT_MS) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      const stream = this.getPublishedHostMicStream();
      const track = stream?.getAudioTracks?.().find((candidate) => candidate && candidate.readyState !== 'ended');
      if (stream && track) {
        return { stream, track };
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Timed out waiting for the director microphone to publish.');
  }

  ensureLegacyHostMicButton() {
    if (document.getElementById('press2talk')) {
      return true;
    }
    const miniPerformer = document.getElementById('miniPerformer');
    if (!miniPerformer || typeof window.press2talk !== 'function') {
      return false;
    }
    const button = document.createElement('button');
    button.id = 'press2talk';
    button.type = 'button';
    button.className = 'float';
    button.dataset.enabled = 'false';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.press2talk(true);
    });
    miniPerformer.appendChild(button);
    return true;
  }

  async waitForLegacyHostMicControl(timeoutMs = HOST_MIC_READY_TIMEOUT_MS) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (typeof window.press2talk === 'function' && this.ensureLegacyHostMicButton()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Director microphone controls are not ready yet.');
  }

  stopLegacyHostMicTracks() {
    if (!this.session) {
      return;
    }
    const streams = [
      this.session.streamSrc || null,
      this.session.streamSrcClone || null,
      this.session.videoElement?.srcObject || null,
    ];
    streams.forEach((stream) => {
      stream?.getTracks?.().forEach((track) => {
        try {
          stream.removeTrack?.(track);
          track.stop();
        } catch (error) {
          console.warn('Failed to stop host mic track', error);
        }
      });
    });
    try {
      this.session.sendMessage?.({ videoMuted: true, virtualHangup: true });
    } catch (error) {
      console.warn('Failed to notify guests that host mic stopped', error);
    }
    if (typeof window.pokeIframeAPI === 'function') {
      window.pokeIframeAPI('director-share', false, false, this.session.streamID);
      window.pokeIframeAPI('seeding', false, false, this.session.streamID);
    }
    if (typeof window.pokeAPI === 'function') {
      window.pokeAPI('seeding', false);
    }
    this.session.directorEnabledPPT = false;
    this.session.seeding = false;
  }

  armLegacyHostMicCancelWatchdog(generation) {
    if (this.hostMicCancelWatchdog) {
      clearInterval(this.hostMicCancelWatchdog);
      this.hostMicCancelWatchdog = null;
    }
    const started = Date.now();
    this.hostMicCancelWatchdog = setInterval(() => {
      if (this.hostMicPublishGeneration !== generation || Date.now() - started > HOST_MIC_READY_TIMEOUT_MS * 2) {
        clearInterval(this.hostMicCancelWatchdog);
        this.hostMicCancelWatchdog = null;
        return;
      }
      const stream = this.getPublishedHostMicStream();
      if (stream || this.session?.directorEnabledPPT || this.session?.seeding) {
        this.stopLegacyHostMicTracks();
        this.ensureLegacyHostMicButton();
      }
    }, 100);
  }

  cancelPendingLegacyHostMicPublish(generation = this.hostMicPublishGeneration) {
    if (generation !== this.hostMicPublishGeneration) {
      return;
    }
    this.hostMicPublishGeneration += 1;
    const cancelledGeneration = this.hostMicPublishGeneration;
    if (typeof window.getUserMediaRequestID === 'number') {
      window.getUserMediaRequestID += 1;
    }
    this.stopLegacyHostMicTracks();
    this.ensureLegacyHostMicButton();
    this.armLegacyHostMicCancelWatchdog(cancelledGeneration);
  }

  async syncHostMicParticipant(stream, track) {
    if (!stream || !track) {
      return null;
    }
    const label = this.session?.label ? `${this.session.label} (Host)` : 'Host Mic';
    const participant = {
      uuid: 'host-mic',
      label,
      stream,
      streamID: this.session?.streamID || 'host-mic',
      status: 'connected',
      audioLevel: this.meterValues.get('host-mic') || 0,
      isLocal: true,
      kind: 'local',
      role: 'host-mic',
    };
    if (this.hostMic?.track !== track) {
      track.addEventListener('ended', () => {
        if (this.hostMic?.track === track && !this.hostMicBusy) {
          this.disableHostMic();
        }
      }, { once: true });
    }
    this.hostMic = {
      active: true,
      stream,
      track,
      uuid: participant.uuid,
      label: participant.label,
      streamID: participant.streamID,
      participant,
      legacy: true,
    };
    try {
      this.session?.sendMessage?.({ virtualHangup: false });
    } catch (error) {
      console.warn('Failed to notify guests that host mic resumed', error);
    }
    this.virtualParticipants.set(participant.uuid, participant);
    this.hostMicMuted = Boolean(this.session?.muted || track.enabled === false);
    if (this.hostMicMeter && this.hostMicMeterTrack !== track) {
      try {
        this.hostMicMeter.disconnect({ stopTrack: false });
      } catch (error) {
        console.warn('Failed to disconnect stale host mic meter', error);
      }
      this.hostMicMeter = null;
      this.hostMicMeterTrack = null;
    }
    if (this.audioContext && track && !this.hostMicMeter) {
      try {
        this.hostMicMeter = await monitorTrackLevel(this.audioContext, track, {
          uuid: participant.uuid,
          trackType: 'audio',
          metadata: { label: participant.label, source: 'host' },
        });
        this.hostMicMeterTrack = track;
      } catch (error) {
        console.warn('Failed to attach host mic meter', error);
      }
    }
    this.updateHostMicUI();
    this.refreshRoster();
    return participant;
  }

  setHostMicError(message) {
    if (this.hostMicErrorNode) {
      this.hostMicErrorNode.textContent = message || '';
    }
  }

  updateHostMicUI() {
    if (this.hostMicButton) {
      if (this.hostMicBusy || this.recording) {
        this.hostMicButton.disabled = true;
        const busyLabel = this.hostMic?.active ? 'Disabling…' : 'Enabling…';
        this.hostMicButton.textContent = this.recording ? 'Locked' : busyLabel;
      } else {
        this.hostMicButton.disabled = false;
        this.hostMicButton.textContent = this.hostMic?.active ? 'Disable' : 'Enable';
      }
      if (this.hostMic?.active) {
        this.hostMicButton.classList.add('active');
      } else {
        this.hostMicButton.classList.remove('active');
      }
    }
    if (this.hostMicStatusNode) {
      if (this.hostMic?.active) {
        this.hostMicStatusNode.textContent = 'Live';
        this.hostMicStatusNode.dataset.state = 'active';
      } else {
        this.hostMicStatusNode.textContent = 'Idle';
        this.hostMicStatusNode.dataset.state = 'idle';
      }
    }
    this.updateHostMuteUI();
  }

  async handleHostMicToggle() {
    if (this.recording) {
      this.setHostMicError('Stop the recording to change the host mic.');
      return;
    }
    if (this.hostMicBusy) {
      return;
    }
    if (this.hostMic?.active) {
      await this.disableHostMic();
    } else {
      await this.enableHostMic();
    }
  }

  async handleHostMuteToggle() {
    if (!this.hostMic?.active) {
      return;
    }
    if (typeof window.toggleMute === 'function' && this.session?.directorEnabledPPT) {
      window.toggleMute(false);
      this.hostMicMuted = Boolean(this.session?.muted);
    } else {
      this.hostMicMuted = !this.hostMicMuted;
      if (this.hostMic.track) {
        this.hostMic.track.enabled = !this.hostMicMuted;
      }
    }
    const stream = this.getPublishedHostMicStream();
    const track = stream?.getAudioTracks?.().find((candidate) => candidate && candidate.readyState !== 'ended') || this.hostMic.track;
    if (stream && track) {
      await this.syncHostMicParticipant(stream, track);
    }
    this.updateHostMuteUI();
  }

  updateHostMuteUI() {
    if (this.hostMuteButton) {
      if (this.hostMic?.active) {
        this.hostMuteButton.disabled = false;
        this.hostMuteButton.textContent = this.hostMicMuted ? '🔇 Unmute' : '🔊 Mute';
        this.hostMuteButton.classList.toggle('muted', this.hostMicMuted);
      } else {
        this.hostMuteButton.disabled = true;
        this.hostMuteButton.textContent = '🔊 Mute';
        this.hostMuteButton.classList.remove('muted');
      }
    }
  }

  async enableHostMic() {
    if (this.hostMic?.active) {
      this.updateHostMicUI();
      return;
    }
    this.hostMicBusy = true;
    this.setHostMicError('');
    this.updateHostMicUI();
    const publishGeneration = this.hostMicPublishGeneration + 1;
    this.hostMicPublishGeneration = publishGeneration;
    if (this.hostMicCancelWatchdog) {
      clearInterval(this.hostMicCancelWatchdog);
      this.hostMicCancelWatchdog = null;
    }
    let startedLegacyPublish = false;
    try {
      await this.ensureAudioContextResumed();
      let stream = this.getPublishedHostMicStream();
      let track = stream?.getAudioTracks?.().find((candidate) => candidate && candidate.readyState !== 'ended') || null;
      if (!stream || !track) {
        if (this.session) {
          this.session.directorEnabledPPT = false;
        }
        await this.waitForLegacyHostMicControl();
        if (typeof window.press2talk !== 'function') {
          throw new Error('Director microphone publisher is unavailable.');
        }
        startedLegacyPublish = true;
        await window.press2talk(true);
        const published = await this.waitForPublishedHostMicStream();
        stream = published.stream;
        track = published.track;
      }
      await this.syncHostMicParticipant(stream, track);
    } catch (error) {
      console.error('Failed to enable host microphone', error);
      if (startedLegacyPublish) {
        this.cancelPendingLegacyHostMicPublish(publishGeneration);
      }
      this.setHostMicError(error?.message || 'Unable to access microphone.');
      this.hostMic = null;
      this.virtualParticipants.delete('host-mic');
      this.updateHostMicUI();
    } finally {
      this.hostMicBusy = false;
      this.updateHostMicUI();
    }
  }

  async disableHostMic() {
    if (!this.hostMic?.active && !this.virtualParticipants.has('host-mic')) {
      this.hostMic = null;
      this.updateHostMicUI();
      return;
    }
    this.hostMicBusy = true;
    this.updateHostMicUI();
    try {
      if (this.hostMicMeter) {
        try {
          this.hostMicMeter.disconnect({ stopTrack: false });
        } catch (error) {
          console.warn('Failed to disconnect host mic meter', error);
        }
        this.hostMicMeter = null;
        this.hostMicMeterTrack = null;
      }
      if (this.hostMic?.legacy) {
        this.cancelPendingLegacyHostMicPublish();
      } else if (this.hostMic?.stream) {
        this.hostMic.stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (error) {
            console.warn('Failed to stop host mic track', error);
          }
        });
      }
    } finally {
      this.virtualParticipants.delete('host-mic');
      this.hostMic = null;
      this.hostMicBusy = false;
      this.hostMicMuted = false;
      this.setHostMicError('');
      this.updateHostMicUI();
      this.applyMeterValue('host-mic', 0);
      this.refreshRoster();
    }
  }

  setCloudMessage(service, message, variant = 'info') {
    const container = this.cloudLinkMessages?.[service];
    if (!container) {
      return;
    }
    const target = this.cloudLinkMessageTextNodes?.[service] || container;
    target.textContent = message || '';
    container.dataset.variant = message ? variant : '';
  }

  updateCloudLinkUI() {
    const driveLinked = this.cloud?.hasDriveAccess();
    const dropboxLinked = this.cloud?.hasDropboxAccess();
    const cachedState = readCloudLinkStatus();
    if (!driveLinked && cachedState.drive && !isCloudLinkFresh(cachedState.drive)) {
      markCloudUnlinked('drive');
    }
    if (!dropboxLinked && cachedState.dropbox && !isCloudLinkFresh(cachedState.dropbox)) {
      markCloudUnlinked('dropbox');
    }

    if (this.cloudLinkButtons.drive) {
      this.cloudLinkButtons.drive.textContent = driveLinked ? 'Reconnect Drive' : 'Connect';
      this.cloudLinkButtons.drive.disabled = Boolean(this.cloudBusy.drive) || this.recording;
      this.cloudLinkButtons.drive.dataset.state = driveLinked ? 'linked' : 'idle';
    }
    if (this.cloudLinkStatusNodes.drive) {
      this.cloudLinkStatusNodes.drive.textContent = driveLinked ? 'Connected — guests upload directly' : 'Not connected';
      this.cloudLinkStatusNodes.drive.dataset.state = driveLinked ? 'linked' : 'idle';
    }


    if (this.cloudLinkButtons.dropbox) {
      this.cloudLinkButtons.dropbox.textContent = dropboxLinked ? 'Reconnect Dropbox' : 'Connect';
      this.cloudLinkButtons.dropbox.disabled = Boolean(this.cloudBusy.dropbox) || this.recording;
      this.cloudLinkButtons.dropbox.dataset.state = dropboxLinked ? 'linked' : 'idle';
    }
    if (this.cloudLinkStatusNodes.dropbox) {
      this.cloudLinkStatusNodes.dropbox.textContent = dropboxLinked ? 'Connected — uploads after recording' : 'Not connected';
      this.cloudLinkStatusNodes.dropbox.dataset.state = dropboxLinked ? 'linked' : 'idle';
    }
    if (this.dropboxTokenInput) {
      this.dropboxTokenInput.disabled = Boolean(this.cloudBusy.dropbox) || this.recording;
    }
    this.updateAllDriveActions();
  }

  ensureDropboxTokenFallbackVisible({ focus = false, select = false } = {}) {
    if (this.dropboxTokenRow) {
      this.dropboxTokenRow.hidden = false;
      this.dropboxTokenRow.classList.add('cloud-sync-token--visible');
    }
    if (this.dropboxGuideRow) {
      this.dropboxGuideRow.hidden = false;
      this.dropboxGuideRow.classList.add('cloud-sync-token__guide--visible');
    }
    if (focus && this.dropboxTokenInput) {
      this.dropboxTokenInput.focus();
      if (select && typeof this.dropboxTokenInput.select === 'function') {
        this.dropboxTokenInput.select();
      }
    }
  }

  hideDropboxTokenFallback() {
    if (this.dropboxTokenRow) {
      this.dropboxTokenRow.hidden = true;
      this.dropboxTokenRow.classList.remove('cloud-sync-token--visible');
    }
    if (this.dropboxGuideRow) {
      this.dropboxGuideRow.hidden = true;
      this.dropboxGuideRow.classList.remove('cloud-sync-token__guide--visible');
    }
    if (this.dropboxTokenInput) {
      this.dropboxTokenInput.value = '';
    }
  }

  async handleDiskFolderSelection({ autoEnable = false } = {}) {
    if (!STUDIO_DISK_FEATURE_FLAG || !this.diskFolderButton) {
      return;
    }
    if (typeof window.showDirectoryPicker !== 'function') {
      this.diskStatusNode.textContent = 'Local disk recording requires Chrome, Edge, or Arc.';
      this.diskStatusNode.dataset.state = 'error';
      return;
    }
    try {
      this.diskFolderButton.disabled = true;
      this.diskFolderButton.textContent = '…';
      await chooseDiskRecordingDirectory();
      const result = await verifyStoredDiskRecordingDirectory({ requestPermission: true });
      if (!result.ok) {
        throw new Error(result.message || 'Failed');
      }
      if (autoEnable || isDiskRecordingEnabled()) {
        setDiskRecordingEnabled(true);
        this.diskRecordingEnabled = true;
      }
    } catch (error) {
      console.warn('Disk folder selection failed', error);
      this.diskStatusNode.textContent =
        error?.name === 'AbortError' || /cancel/i.test(error?.message || '')
          ? 'Cancelled'
          : error?.message || 'Error';
      this.diskStatusNode.dataset.state = 'error';
    } finally {
      this.diskFolderButton.disabled = false;
      this.updateDiskRecordingUI();
    }
  }

  async handleDiskToggle() {
    if (!STUDIO_DISK_FEATURE_FLAG || !this.diskToggleButton) {
      return;
    }
    if (typeof window.showDirectoryPicker !== 'function') {
      this.diskStatusNode.textContent = 'Browser lacks File System Access API support.';
      this.diskStatusNode.dataset.state = 'error';
      return;
    }
    const meta = readDiskRecordingState();
    if (!meta.folderName) {
      await this.handleDiskFolderSelection({ autoEnable: true });
      return;
    }
    const nextEnabled = !isDiskRecordingEnabled();
    if (nextEnabled) {
      const result = await verifyStoredDiskRecordingDirectory({ requestPermission: true });
      if (!result.ok) {
        this.diskStatusNode.textContent = result.message || 'Unable to access the selected folder.';
        this.diskStatusNode.dataset.state = 'error';
        setDiskRecordingEnabled(false);
        this.diskRecordingEnabled = false;
        this.updateDiskRecordingUI();
        return;
      }
    }
    const finalState = setDiskRecordingEnabled(nextEnabled);
    this.diskRecordingEnabled = Boolean(finalState.enabled);
    this.updateDiskRecordingUI();
  }

  updateDiskRecordingUI() {
    if (!STUDIO_DISK_FEATURE_FLAG || !this.diskControls) {
      return;
    }
    const diskSupported = typeof window.showDirectoryPicker === 'function';
    const meta = readDiskRecordingState();
    const hasFolder = Boolean(meta.folderName);
    const enabled = Boolean(meta.enabled && hasFolder);
    this.diskRecordingEnabled = enabled;
    if (this.diskToggleButton) {
      this.diskToggleButton.disabled = !diskSupported;
      this.diskToggleButton.dataset.state = enabled ? 'enabled' : 'disabled';
      this.diskToggleButton.textContent = enabled ? 'Armed ✓' : 'Arm';
      this.diskToggleButton.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    }
    if (this.diskFolderButton) {
      this.diskFolderButton.disabled = !diskSupported;
      this.diskFolderButton.textContent = hasFolder ? 'Change' : diskSupported ? 'Folder' : 'N/A';
    }
    if (this.diskStatusNode) {
      if (!diskSupported) {
        this.diskStatusNode.textContent = 'Requires Chrome/Edge';
        this.diskStatusNode.dataset.state = 'error';
      } else if (!hasFolder) {
        this.diskStatusNode.textContent = 'No folder selected';
        this.diskStatusNode.dataset.state = 'pending';
      } else if (meta.lastError) {
        this.diskStatusNode.textContent = `${meta.folderName} — error`;
        this.diskStatusNode.dataset.state = 'error';
      } else {
        this.diskStatusNode.textContent = `${meta.folderName} ✓`;
        this.diskStatusNode.dataset.state = meta.lastVerifiedAt ? 'ready' : 'pending';
      }
    }
    this.updateReadinessSummary();
  }

  async ensureDiskCaptureReadiness({ interactive = false } = {}) {
    if (!STUDIO_DISK_FEATURE_FLAG || !this.diskRecordingEnabled) {
      return { enabled: false, ready: false };
    }
    const result = await verifyStoredDiskRecordingDirectory({ requestPermission: interactive });
    if (!result.ok) {
      if (this.diskStatusNode) {
        this.diskStatusNode.textContent = result.message || 'Unable to access the selected folder.';
        this.diskStatusNode.dataset.state = 'error';
      }
      setDiskRecordingEnabled(false);
      this.diskRecordingEnabled = false;
      this.updateDiskRecordingUI();
      return {
        enabled: true,
        ready: false,
        error: new Error(result.message || 'Folder unavailable'),
      };
    }
    return {
      enabled: true,
      ready: true,
      folderName: result.folderName,
      verifiedAt: Date.now(),
    };
  }

  async handleDriveLink() {
    if (!this.cloud || this.cloudBusy.drive) {
      return;
    }
    this.cloudBusy.drive = true;
    this.updateCloudLinkUI();
    this.setCloudMessage('drive', 'Requesting Google authorization…', 'info');
    try {
      const client = this.cloud.ensureDriveClient();
      if (!client) {
        throw new Error('Google Drive integration is not available on this build.');
      }
      if (typeof client.ensureInitialized === 'function') {
        await client.ensureInitialized();
      }
      if (typeof client.requestAccessToken === 'function') {
        client.requestAccessToken();
      }
      if (client.promise && typeof client.promise.then === 'function') {
        await client.promise;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      if (this.cloud.hasDriveAccess()) {
        this.setCloudMessage('drive', 'Google Drive connected. Guests can now record directly to Drive.', 'success');
        const folder = this.session?.GDRIVE_FOLDERNAME || null;
        markCloudLinked('drive', { folder });
      } else {
        this.setCloudMessage('drive', 'Check your popup blocker or try again.', 'warn');
        markCloudUnlinked('drive');
      }
    } catch (error) {
      console.error('Failed to link Google Drive', error);
      this.setCloudMessage('drive', error?.message || 'Failed to link Google Drive.', 'error');
      markCloudUnlinked('drive');
    } finally {
      this.cloudBusy.drive = false;
      this.updateCloudFooter();
    }
  }

  async handleDropboxLink() {
    if (!this.cloud || this.cloudBusy.dropbox) {
      return;
    }
    this.cloudBusy.dropbox = true;
    this.updateCloudLinkUI();
    const providedToken = (this.dropboxTokenInput?.value || '').trim();
    if (providedToken) {
      this.ensureDropboxTokenFallbackVisible();
    }
    const interactive = !providedToken;
    const hasExistingAccess = this.cloud?.hasDropboxAccess();
    const forceReauth = !providedToken && hasExistingAccess;
    const pendingMessage = providedToken
      ? 'Linking Dropbox with the provided token…'
      : hasExistingAccess
        ? 'Refreshing Dropbox session…'
        : 'Waiting for the Dropbox popup to complete…';
    this.setCloudMessage('dropbox', pendingMessage, 'info');
    try {
      if (typeof window.setupDropbox !== 'function') {
        throw new Error('Dropbox uploader is not available in this build.');
      }
      const client = await this.cloud.ensureDropboxClient(providedToken || undefined, { interactive, forceReauth });
      if (client) {
        this.setCloudMessage('dropbox', 'Dropbox linked. Recordings will upload automatically.', 'success');
        if (this.dropboxTokenInput) {
          this.dropboxTokenInput.value = '';
        }
        if (!providedToken) {
          this.hideDropboxTokenFallback();
        }
        markCloudLinked('dropbox');
      } else {
        markCloudUnlinked('dropbox');
        if (providedToken) {
          this.setCloudMessage('dropbox', 'Dropbox rejected the provided token. Double-check and try again.', 'error');
          this.ensureDropboxTokenFallbackVisible({ focus: true, select: true });
        } else {
          this.setCloudMessage('dropbox', 'Dropbox authorization was cancelled. Check your popup blocker and try again.', 'warn');
          this.ensureDropboxTokenFallbackVisible({ focus: true });
        }
      }
    } catch (error) {
      console.error('Failed to init Dropbox', error);
      this.setCloudMessage('dropbox', error?.message || 'Unable to initialise Dropbox.', 'error');
      this.ensureDropboxTokenFallbackVisible({ focus: true });
      markCloudUnlinked('dropbox');
    } finally {
      this.cloudBusy.dropbox = false;
      this.updateCloudFooter();
    }
  }

  createAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    return new AudioCtx();
  }

  attachIcecastEvents() {
    if (!this.icecastPublisher) {
      return;
    }
    this.icecastPublisher.addEventListener('status', (event) => {
      const detail = event.detail || {};
      const state = detail.state === 'live' ? 'ready' : detail.state === 'connecting' ? 'pending' : detail.state || 'idle';
      this.icecastLive = state === 'ready' || state === 'pending';
      this.setIcecastStatus(detail.message || 'Icecast idle.', state);
      this.updateIcecastUI();
      this.updateReadinessSummary();
    });
    this.icecastPublisher.addEventListener('progress', (event) => {
      const detail = event.detail || {};
      if (!this.icecastPublisher?.isLive()) {
        return;
      }
      const elapsedSeconds = detail.startedAt ? Math.max(1, Math.round((Date.now() - detail.startedAt) / 1000)) : 0;
      const bytes = detail.bytesSent || 0;
      this.setIcecastStatus(`Live ${this.formatFileSize(bytes)}${elapsedSeconds ? ` / ${this.formatDuration(elapsedSeconds)}` : ''}`, 'ready');
    });
    this.icecastPublisher.addEventListener('error', (event) => {
      const error = event.detail;
      this.icecastLive = false;
      this.setIcecastStatus(error?.message || 'Icecast publish failed.', 'error');
      this.updateIcecastUI();
      this.updateReadinessSummary();
    });
  }

  getIcecastMixParticipants() {
    const participants = [];
    Object.entries(this.session?.rpcs || {}).forEach(([uuid, peer]) => {
      const stream = peer?.streamSrc || peer?.stream || peer?.videoElement?.srcObject || null;
      if (!stream || !stream.getAudioTracks?.().length) {
        return;
      }
      participants.push({
        uuid,
        label: peer.label || peer.streamID || uuid,
        stream,
        streamID: peer.streamID || uuid,
        role: 'remote',
      });
    });
    this.virtualParticipants.forEach((participant) => {
      if (participant?.stream?.getAudioTracks?.().length) {
        participants.push({ ...participant });
      }
    });
    return participants;
  }

  collectIcecastSettingsFromForm() {
    const targetUrl = (this.icecastTargetInput?.value || '').trim();
    const mount = normalizeIcecastMount(this.icecastMountInput?.value || '');
    const username = (this.icecastUsernameInput?.value || 'source').trim() || 'source';
    const password = this.icecastPasswordInput?.value || '';
    const mimeType = this.icecastMimeSelect?.value || ICECAST_MIME_OPTIONS[0].value;
    const isPublic = Boolean(this.icecastPublicInput?.checked);
    const name = (this.icecastNameInput?.value || '').trim();
    const genre = (this.icecastGenreInput?.value || '').trim();
    return {
      targetUrl,
      mount,
      username,
      password,
      mimeType,
      public: isPublic,
      name,
      genre,
    };
  }

  persistIcecastSettingsFromForm() {
    writeIcecastSettings(this.collectIcecastSettingsFromForm());
  }

  readIcecastConfigFromForm() {
    const storedSettings = this.collectIcecastSettingsFromForm();
    const relayUrl = resolveIcecastRelayUrl(storedSettings);
    const relayToken = resolveIcecastRelayToken();
    writeIcecastSettings(storedSettings);
    return {
      relayUrl,
      targetUrl: buildIcecastTargetUrl(storedSettings),
      username: storedSettings.username,
      password: storedSettings.password,
      relayToken,
      mimeType: storedSettings.mimeType,
      metadata: {
        name: storedSettings.name || 'VDO.Ninja Live',
        genre: storedSettings.genre || 'Live',
        public: storedSettings.public,
      },
    };
  }

  setIcecastStatus(message, state = 'idle') {
    if (!this.icecastStatusNode) {
      return;
    }
    this.icecastStatusNode.textContent = message || 'Idle';
    this.icecastStatusNode.dataset.state = state;
  }

  updateIcecastUI() {
    const live = Boolean(this.icecastPublisher?.isLive());
    this.icecastLive = live;
    if (this.icecastButton) {
      this.icecastButton.disabled = this.icecastBusy;
      this.icecastButton.textContent = live ? 'Stop live' : this.icecastBusy ? 'Starting...' : 'Start live';
      this.icecastButton.dataset.state = live ? 'enabled' : 'idle';
    }
    if (this.icecastSettingsButton) {
      this.icecastSettingsButton.disabled = live || this.icecastBusy;
      this.icecastSettingsButton.textContent = this.icecastSettingsOpen ? 'Hide settings' : 'Settings';
      this.icecastSettingsButton.setAttribute('aria-expanded', this.icecastSettingsOpen ? 'true' : 'false');
    }
    if (this.icecastSettingsPanel) {
      this.icecastSettingsPanel.hidden = !this.icecastSettingsOpen;
    }
    [
      this.icecastTargetInput,
      this.icecastMountInput,
      this.icecastUsernameInput,
      this.icecastPasswordInput,
      this.icecastMimeSelect,
      this.icecastPublicInput,
      this.icecastNameInput,
      this.icecastGenreInput,
    ].forEach((node) => {
      if (node) {
        node.disabled = live || this.icecastBusy;
      }
    });
  }

  toggleIcecastSettings() {
    if (this.icecastPublisher?.isLive() || this.icecastBusy) {
      return;
    }
    this.icecastSettingsOpen = !this.icecastSettingsOpen;
    this.updateIcecastUI();
  }

  async handleIcecastToggle() {
    if (!this.icecastPublisher || this.icecastBusy) {
      return;
    }
    if (this.icecastPublisher.isLive()) {
      this.icecastBusy = true;
      this.updateIcecastUI();
      this.setIcecastStatus('Stopping...', 'pending');
      try {
        await this.icecastPublisher.stop();
      } catch (error) {
        console.warn('Failed to stop Icecast publisher', error);
        this.setIcecastStatus(error?.message || 'Stop failed.', 'error');
      } finally {
        this.icecastBusy = false;
        this.icecastLive = false;
        this.updateIcecastUI();
        this.updateReadinessSummary();
      }
      return;
    }
    this.icecastBusy = true;
    this.updateIcecastUI();
    this.setIcecastStatus('Starting...', 'pending');
    try {
      await this.ensureAudioContextResumed();
      this.icecastPublisher.setAudioContext(this.audioContext);
      const config = this.readIcecastConfigFromForm();
      await this.icecastPublisher.start(config);
      this.icecastLive = true;
    } catch (error) {
      console.error('Failed to start Icecast publisher', error);
      this.icecastLive = false;
      this.setIcecastStatus(error?.message || 'Unable to start.', 'error');
    } finally {
      this.icecastBusy = false;
      this.updateIcecastUI();
      this.updateReadinessSummary();
    }
  }

  buildLayout() {
    if (document.getElementById(STUDIO_ROOT_ID)) {
      return;
    }

    const root = createElement('div', '', { id: STUDIO_ROOT_ID });

    // Header
    const header = createElement('header', 'podcast-header');
    const headerLeft = createElement('div', 'podcast-header__left');
    const title = createElement('h1', '', { text: 'Podcast Control Room' });
    this.sessionInfo = createElement('div', 'podcast-header__room', { text: this.roomName || '' });
    headerLeft.append(title, this.sessionInfo);
    const statusPill = createElement('div', 'podcast-status-pill');
    statusPill.innerHTML = '<span>Live-ready</span>';
    header.append(headerLeft, statusPill);

    // Main layout
    const main = createElement('main', 'podcast-main');

    // Left column (host input + roster + markers)
    const rosterColumn = createElement('div', 'podcast-roster');

    // Host Input panel (director's mic)
    const hostPanel = createElement('section', 'podcast-panel host-panel');
    hostPanel.append(createElement('h2', '', { text: '🎙️ Host Input' }));
    const hostControls = createElement('div', 'host-input-content');
    this.hostMicButton = createElement('button', 'host-input-toggle', { type: 'button', text: 'Enable', title: 'Toggle local host microphone capture (optional).'});
    this.hostMicButton.addEventListener('click', () => this.handleHostMicToggle());
    this.hostMuteButton = createElement('button', 'host-mute-toggle', { type: 'button', text: '🔊 Mute', title: 'Mute/unmute the host mic track.' });
    this.hostMuteButton.disabled = true;
    this.hostMuteButton.addEventListener('click', () => this.handleHostMuteToggle());
    this.hostMicStatusNode = createElement('div', 'host-input-status', { text: 'Idle' });
    hostControls.append(this.hostMicButton, this.hostMuteButton, this.hostMicStatusNode);
    this.hostMicErrorNode = createElement('div', 'host-input-error');
    hostPanel.append(hostControls, this.hostMicErrorNode);

    const rosterPanel = createElement('section', 'podcast-panel');
    this.rosterList = createElement('div', 'roster-list');
    rosterPanel.append(this.rosterList);
    makeCollapsible(rosterPanel, 'Talent Roster', 'podcastStudio.collapse.roster');

    const markersPanel = createElement('section', 'podcast-panel');
    this.markerLog = createElement('div', 'marker-log');
    const emptyMarkers = createElement('div', 'empty-state', { text: 'Tap “Marker” to drop cue points during recording.' });
    emptyMarkers.dataset.empty = 'true';
    this.markerLog.append(emptyMarkers);
    this.markerActions = createElement('div', 'cloud-sync-list__actions marker-actions');
    this.markerActions.style.display = 'none';
    this.markerExportButton = createElement('button', 'cloud-sync-list__button', { type: 'button', text: 'Export CSV', title: 'Download markers as a CSV file.' });
    this.markerExportButton.addEventListener('click', () => this.exportMarkersCsv());
    this.markerCopyButton = createElement('button', 'cloud-sync-list__button', { type: 'button', text: 'Copy CSV', title: 'Copy markers CSV to clipboard.' });
    this.markerCopyButton.addEventListener('click', () => this.copyMarkersCsv());
    this.markerActions.append(this.markerExportButton, this.markerCopyButton);
    markersPanel.append(this.markerLog, this.markerActions);
    makeCollapsible(markersPanel, 'Session Markers', 'podcastStudio.collapse.markers');

    rosterColumn.append(hostPanel, rosterPanel, markersPanel);

    // Right column (controls + timeline)
    const consoleColumn = createElement('div', 'podcast-console');
    const consoleGrid = createElement('div', 'podcast-console-grid');
    consoleColumn.append(consoleGrid);

    const invitePanel = createElement('section', 'podcast-panel invite-panel');
    invitePanel.classList.add('console-grid__span-2');
    const inviteIntro = createElement('p', 'invite-copy', {
      text: 'Share a pro audio-ready link with guests. Tweak processing flags before copying.',
    });
    const inviteLinkRow = createElement('div', 'invite-link-row');
    this.inviteLinkInput = createElement('input', 'invite-link-input', {
      type: 'text',
      readonly: 'true',
      value: '',
      title: 'Guest invite link (click to select).',
    });
    this.inviteLinkInput.addEventListener('focus', () => {
      try {
        this.inviteLinkInput.select();
      } catch (error) {
        console.warn('Invite link select failed', error);
      }
    });
    this.inviteCopyButton = createElement('button', 'invite-link-copy', { type: 'button', text: 'Copy link', title: 'Copy the guest invite link.' });
    this.inviteCopyButton.addEventListener('click', () => this.copyInviteLink());
    inviteLinkRow.append(this.inviteLinkInput, this.inviteCopyButton);
    this.inviteStatusNode = createElement('div', 'invite-status');

    const inviteOptions = createElement('div', 'invite-options');
    const optionDefs = [
      { key: 'disableVideo', label: 'Disable video preview', defaultChecked: false },
      { key: 'proAudio', label: 'Enable pro audio (stereo, 256 kbps)', defaultChecked: true },
      { key: 'disableAec', label: 'Disable echo cancellation', defaultChecked: true },
      { key: 'disableDenoise', label: 'Disable noise reduction', defaultChecked: true },
      { key: 'disableAgc', label: 'Disable auto gain control', defaultChecked: true },
      { key: 'guestRecordBackup', label: 'Guest-side audio record backup', defaultChecked: true },
    ];
    optionDefs.forEach((option) => {
      const optionLabel = createElement('label', 'invite-option');
      const checkbox = createElement('input', 'invite-option__checkbox', { type: 'checkbox' });
      checkbox.checked = option.defaultChecked;
      checkbox.title = 'Applies to the generated guest link.';
      optionLabel.title = option.label;
      checkbox.addEventListener('change', () => this.updateInviteLink());
      optionLabel.append(checkbox, createElement('span', 'invite-option__label', { text: option.label }));
      inviteOptions.append(optionLabel);
      this.inviteOptionNodes[option.key] = checkbox;
    });

    invitePanel.append(inviteIntro, inviteLinkRow, this.inviteStatusNode, inviteOptions);
    makeCollapsible(invitePanel, 'Guest Invites', 'podcastStudio.collapse.invites');

    const sessionToolsPanel = createElement('section', 'podcast-panel session-tools');
    sessionToolsPanel.classList.add('console-grid__span-2');
    const sessionToolsGrid = createElement('div', 'session-tools__grid');
    sessionToolsPanel.append(sessionToolsGrid);

    const controlCard = createElement('div', 'session-tool session-tool--control');
    controlCard.append(createElement('h2', 'session-tool__title', { text: '⏺ Recording' }));

    this.recordingSummary = createElement('div', 'recording-summary');
    this.captureSummaryNode = createElement('div', 'recording-summary__item', { text: 'Capture: Audio ISO' });
    this.backupSummaryNode = createElement('div', 'recording-summary__item', { text: 'Backup: None' });
    this.saveSummaryNode = createElement('div', 'recording-summary__item', { text: 'Save: Browser buffer only' });
    this.recordingSummary.append(this.captureSummaryNode, this.backupSummaryNode, this.saveSummaryNode);
    this.recordingSummary.style.display = 'none';

    const transportButtons = createElement('div', 'transport-buttons');
    this.recordButton = createElement('button', 'btn-record', { type: 'button', text: 'Start Recording', title: 'Start or stop ISO recording for this session.' });
    this.recordButton.addEventListener('click', () => this.handleRecordToggle());
    this.markerButton = createElement('button', 'btn-secondary', { type: 'button', text: 'Marker', title: 'Drop a cue marker at the current time.' });
    this.markerButton.disabled = true;
    this.markerButton.addEventListener('click', () => this.addMarker());
    const captureSelectId = 'podcast-capture-mode';
    const captureModeLabel = createElement('label', 'capture-mode-label', { text: 'Capture' });
    captureModeLabel.setAttribute('for', captureSelectId);
    this.captureModeSelect = createElement('select', 'capture-mode-select', { id: captureSelectId });
    this.captureModeSelect.append(new Option('Audio only', 'audio'), new Option('Audio + Video', 'video'));
    this.captureModeSelect.value = this.currentRecordingMode === 'video' ? 'video' : 'audio';
    this.captureModeSelect.addEventListener('change', () => this.handleCaptureModeChange(this.captureModeSelect.value));
    const captureWrap = createElement('div', 'capture-mode-wrap');
    captureWrap.append(captureModeLabel, this.captureModeSelect);
    transportButtons.append(captureWrap, this.recordButton);
    transportButtons.append(this.markerButton);

    this.recordShowButton = createElement('button', 'record-group-button', { type: 'button', text: '🎬 Record Group', title: 'Open a popup window with the combined scene for screen recording.' });
    this.recordShowButton.addEventListener('click', () => this.openRecordShowWindow());

    this.recordingStatusNode = createElement('div', 'session-recording-status', { text: 'Idle' });
    this.recordingStatusNode.dataset.state = 'idle';
    const statusRow = createElement('div', 'recording-status-row');
    statusRow.append(this.recordingStatusNode);

    const destLightsRow = createElement('div', 'destination-lights');
    const createDestLight = (key, label) => {
      const el = createElement('div', 'dest-light');
      const dot = createElement('span', 'dest-light__dot');
      const textWrap = createElement('div', 'dest-light__text');
      const name = createElement('span', 'dest-light__name', { text: label });
      const status = createElement('span', 'dest-light__status');
      textWrap.append(name, status);
      el.append(dot, textWrap);
      el.dataset.state = 'gray';
      this.destinationLights[key] = { el, dot, status };
      return el;
    };

    const hostGroup = createElement('div', 'dest-group');
    hostGroup.append(createElement('div', 'dest-group__label', { text: 'You record' }));
    const hostLights = createElement('div', 'dest-group__lights');
    hostLights.append(createDestLight('download', 'Download'));
    hostLights.append(createDestLight('dropbox', 'Dropbox'));
    if (STUDIO_DISK_FEATURE_FLAG) {
      hostLights.append(createDestLight('disk', 'Local folder'));
    }
    hostGroup.append(hostLights);

    const guestGroup = createElement('div', 'dest-group');
    guestGroup.append(createElement('div', 'dest-group__label', { text: 'Guests record' }));
    const guestLights = createElement('div', 'dest-group__lights');
    guestLights.append(createDestLight('drive', 'Google Drive'));
    guestGroup.append(guestLights, createElement('div', 'dest-group__hint', { text: 'Guests can also record locally — see Guest Invites' }));

    destLightsRow.append(hostGroup, createElement('div', 'dest-group-divider'), guestGroup);
    const recordGroupRow = createElement('div', 'record-group-row');
    recordGroupRow.append(this.recordShowButton);
    controlCard.append(this.recordingSummary, destLightsRow, transportButtons, statusRow, recordGroupRow);
    sessionToolsGrid.append(controlCard);

    // ISO Recording Configuration - unified destinations section
    const isoConfigCard = createElement('div', 'session-tool session-tool--iso-config');
    isoConfigCard.append(createElement('h2', 'session-tool__title', { text: '💾 Recording settings' }));
    const isoConfigList = createElement('div', 'iso-config-list');


    this.guestBackupRow = createElement('div', 'iso-config-row');
    this.guestBackupRow.append(createElement('div', 'iso-config-row__label', { text: 'Guest backup' }));
    const guestBackupActions = createElement('div', 'iso-config-row__actions');
    this.guestBackupButton = createElement('button', 'iso-config-row__button iso-config-row__button--backup', {
      type: 'button',
      text: 'Enable guest backup',
      title: 'Ask every connected guest to self-record directly to your linked Google Drive.',
    });
    this.guestBackupButton.addEventListener('click', () => this.handleGuestBackupToggle());
    this.guestBackupStatusNode = createElement('span', 'iso-config-row__status', { text: 'No guests connected' });
    guestBackupActions.append(this.guestBackupButton, this.guestBackupStatusNode);
    this.guestBackupRow.append(guestBackupActions);
    this.guestBackupHint = null;
    this.guestBackupRow.style.display = 'none';
    isoConfigList.append(this.guestBackupRow);

    // Google Drive row
    const driveRow = createElement('div', 'iso-config-row');
    driveRow.append(createElement('div', 'iso-config-row__label', { text: 'Google Drive' }));
    const driveActions = createElement('div', 'iso-config-row__actions');
    this.cloudLinkButtons.drive = createElement('button', 'iso-config-row__button', { type: 'button', text: 'Connect', title: 'Connect Google Drive to upload recordings automatically after each session.' });
    this.cloudLinkButtons.drive.addEventListener('click', () => this.handleDriveLink());
    this.cloudLinkButtons.drive.dataset.state = 'idle';
    this.cloudLinkStatusNodes.drive = createElement('span', 'iso-config-row__status', { text: 'Not connected' });
    this.cloudLinkStatusNodes.drive.dataset.state = 'idle';
    driveActions.append(this.cloudLinkButtons.drive, this.cloudLinkStatusNodes.drive);
    driveRow.append(driveActions);
    this.cloudLinkMessages.drive = createElement('div', 'iso-config-row__hint');
    this.cloudLinkMessages.drive.dataset.variant = '';
    const driveMessageText = createElement('span', 'iso-config-row__hint-text');
    this.cloudLinkMessages.drive.append(driveMessageText);
    this.cloudLinkMessageTextNodes.drive = driveMessageText;
    isoConfigList.append(driveRow, this.cloudLinkMessages.drive);

    // Dropbox row
    const dropboxRow = createElement('div', 'iso-config-row');
    dropboxRow.append(createElement('div', 'iso-config-row__label', { text: 'Dropbox' }));
    const dropboxActions = createElement('div', 'iso-config-row__actions');
    this.cloudLinkButtons.dropbox = createElement('button', 'iso-config-row__button', { type: 'button', text: 'Connect', title: 'Connect Dropbox to upload recordings automatically after each session.' });
    this.cloudLinkButtons.dropbox.addEventListener('click', () => this.handleDropboxLink());
    this.cloudLinkButtons.dropbox.dataset.state = 'idle';
    this.cloudLinkStatusNodes.dropbox = createElement('span', 'iso-config-row__status', { text: 'Not connected' });
    this.cloudLinkStatusNodes.dropbox.dataset.state = 'idle';
    dropboxActions.append(this.cloudLinkButtons.dropbox, this.cloudLinkStatusNodes.dropbox);
    dropboxRow.append(dropboxActions);
    this.cloudLinkMessages.dropbox = createElement('div', 'iso-config-row__hint');
    this.cloudLinkMessages.dropbox.dataset.variant = '';
    const dropboxMessageText = createElement('span', 'iso-config-row__hint-text');
    this.cloudLinkMessages.dropbox.append(dropboxMessageText);
    this.cloudLinkMessageTextNodes.dropbox = dropboxMessageText;
    const tokenFieldId = 'podcast-dropbox-token';
    const dropboxTokenRow = createElement('div', 'cloud-sync-token');
    this.dropboxTokenRow = dropboxTokenRow;
    const tokenLabel = createElement('label', 'cloud-sync-token__label', { text: 'Access token' });
    tokenLabel.setAttribute('for', tokenFieldId);
    this.dropboxTokenInput = createElement('input', 'cloud-sync-token__input', {
      type: 'password',
      placeholder: 'Paste Dropbox personal access token',
      id: tokenFieldId,
      spellcheck: 'false',
      autocapitalize: 'none',
      autocomplete: 'off',
      title: 'Fallback: paste a Dropbox token if the Link popup is unavailable.',
    });
    dropboxTokenRow.append(tokenLabel, this.dropboxTokenInput);
    const dropboxGuideRow = createElement('div', 'cloud-sync-token__guide');
    this.dropboxGuideRow = dropboxGuideRow;
    const guideLink = createElement('a', 'cloud-sync-guide-link', {
      text: 'Open the Dropbox setup guide',
      href: DROPBOX_GUIDE_URL,
      target: '_blank',
      rel: 'noopener',
      title: 'Open the Dropbox setup guide in a new tab.',
    });
    dropboxGuideRow.append('Need a token? ', guideLink);
    this.cloudLinkMessages.dropbox.append(dropboxTokenRow, dropboxGuideRow);
    this.hideDropboxTokenFallback();
    isoConfigList.append(dropboxRow, this.cloudLinkMessages.dropbox);

    // Local Disk row
    if (STUDIO_DISK_FEATURE_FLAG) {
      const diskSupported = typeof window.showDirectoryPicker === 'function';
      const diskRow = createElement('div', 'iso-config-row');
      diskRow.append(createElement('div', 'iso-config-row__label', { text: 'Local Disk' }));
      const diskActions = createElement('div', 'iso-config-row__actions');
      this.diskControls = diskActions;
      this.diskToggleButton = createElement('button', 'iso-config-row__button', {
        type: 'button',
        text: 'Arm',
        title: 'Arm/disarm recording ISO files to local disk.',
      });
      this.diskToggleButton.addEventListener('click', () => this.handleDiskToggle());
      this.diskFolderButton = createElement('button', 'iso-config-row__button iso-config-row__button--secondary', {
        type: 'button',
        text: diskSupported ? 'Folder' : 'N/A',
        title: diskSupported ? 'Choose the destination folder for disk recording.' : 'Local disk recording is not supported in this browser.',
      });
      this.diskFolderButton.disabled = !diskSupported;
      if (diskSupported) {
        this.diskFolderButton.addEventListener('click', () => this.handleDiskFolderSelection());
      }
      this.diskStatusNode = createElement('span', 'iso-config-row__status', {
        text: diskSupported ? 'No folder' : 'Not supported',
      });
      diskActions.append(this.diskToggleButton, this.diskFolderButton, this.diskStatusNode);
      diskRow.append(diskActions);
      isoConfigList.append(diskRow);
      this.updateDiskRecordingUI();
    }

    const icecastSettings = readIcecastSettings();
    const icecastRow = createElement('div', 'iso-config-row iso-config-row--icecast');
    icecastRow.append(createElement('div', 'iso-config-row__label', { text: 'Icecast' }));
    const icecastActions = createElement('div', 'iso-config-row__actions');
    this.icecastButton = createElement('button', 'iso-config-row__button', {
      type: 'button',
      text: 'Start live',
      title: 'Publish the mixed studio audio to an Icecast-compatible source endpoint.',
    });
    this.icecastButton.addEventListener('click', () => this.handleIcecastToggle());
    this.icecastSettingsButton = createElement('button', 'iso-config-row__button iso-config-row__button--secondary', {
      type: 'button',
      text: 'Settings',
      title: 'Show Icecast publishing settings.',
      'aria-expanded': 'false',
    });
    this.icecastSettingsButton.addEventListener('click', () => this.toggleIcecastSettings());
    this.icecastStatusNode = createElement('span', 'iso-config-row__status', { text: 'Idle' });
    this.icecastStatusNode.dataset.state = 'idle';
    icecastActions.append(this.icecastButton, this.icecastSettingsButton, this.icecastStatusNode);
    icecastRow.append(icecastActions);
    isoConfigList.append(icecastRow);

    this.icecastSettingsOpen = false;
    const icecastPanel = createElement('div', 'iso-config-advanced icecast-config');
    icecastPanel.hidden = true;
    this.icecastSettingsPanel = icecastPanel;
    const icecastBody = createElement('div', 'iso-config-advanced__body icecast-config__body');
    const createIcecastField = (labelText, input, hintText = '') => {
      const label = createElement('label', 'icecast-config__field');
      label.append(createElement('span', 'icecast-config__label', { text: labelText }), input);
      if (hintText) {
        label.append(createElement('span', 'icecast-config__hint', { text: hintText }));
      }
      return label;
    };
    this.icecastTargetInput = createElement('input', 'icecast-config__input', {
      type: 'url',
      placeholder: 'http://icecast.example.com:8000/',
      value: icecastSettings.targetUrl || '',
      autocomplete: 'off',
      spellcheck: 'false',
      title: 'Icecast or AzuraCast source server URL, including port.',
    });
    this.icecastMountInput = createElement('input', 'icecast-config__input', {
      type: 'text',
      placeholder: 'stream',
      value: icecastSettings.mount || '',
      autocomplete: 'off',
      autocapitalize: 'none',
      spellcheck: 'false',
      title: 'Icecast source mountpoint, without the leading slash.',
    });
    this.icecastUsernameInput = createElement('input', 'icecast-config__input', {
      type: 'text',
      placeholder: 'source',
      value: icecastSettings.username || 'source',
      autocomplete: 'username',
      spellcheck: 'false',
      title: 'Icecast source username.',
    });
    this.icecastPasswordInput = createElement('input', 'icecast-config__input', {
      type: 'password',
      placeholder: 'Source password',
      value: icecastSettings.password || '',
      autocomplete: 'off',
      autocapitalize: 'none',
      spellcheck: 'false',
      title: 'Icecast source password. Stored locally in this browser with the Icecast settings.',
    });
    this.icecastMimeSelect = createElement('select', 'icecast-config__input icecast-config__select', {
      title: 'Audio container sent to Icecast.',
    });
    ICECAST_MIME_OPTIONS.forEach((option) => {
      this.icecastMimeSelect.append(new Option(option.label, option.value));
    });
    this.icecastMimeSelect.value = ICECAST_MIME_OPTIONS.some((option) => option.value === icecastSettings.mimeType)
      ? icecastSettings.mimeType
      : DEFAULT_ICECAST_MIME_TYPE;
    this.icecastNameInput = createElement('input', 'icecast-config__input', {
      type: 'text',
      placeholder: 'VDO.Ninja Live',
      value: icecastSettings.name || '',
      autocomplete: 'off',
      title: 'Optional stream name shown by Icecast.',
    });
    this.icecastGenreInput = createElement('input', 'icecast-config__input', {
      type: 'text',
      placeholder: 'Live',
      value: icecastSettings.genre || '',
      autocomplete: 'off',
      title: 'Optional stream genre shown by Icecast.',
    });
    const icecastToggles = createElement('div', 'icecast-config__toggles');
    const publicLabel = createElement('label', 'icecast-config__toggle');
    this.icecastPublicInput = createElement('input', '', { type: 'checkbox' });
    this.icecastPublicInput.checked = Boolean(icecastSettings.public);
    publicLabel.append(this.icecastPublicInput, createElement('span', '', { text: 'Public listing' }));
    icecastToggles.append(publicLabel);

    icecastBody.append(
      createIcecastField('Source URL', this.icecastTargetInput, 'Use the source server URL, including port. DNS names work best with the relay.'),
      createIcecastField('Mountpoint', this.icecastMountInput, 'For BUTT-style settings, enter the mountpoint here, for example: stream.'),
      createIcecastField('Username', this.icecastUsernameInput),
      createIcecastField('Password', this.icecastPasswordInput),
      createIcecastField('Format', this.icecastMimeSelect),
      createIcecastField('Name', this.icecastNameInput),
      createIcecastField('Genre', this.icecastGenreInput),
      icecastToggles,
    );
    [
      this.icecastTargetInput,
      this.icecastMountInput,
      this.icecastUsernameInput,
      this.icecastPasswordInput,
      this.icecastMimeSelect,
      this.icecastPublicInput,
      this.icecastNameInput,
      this.icecastGenreInput,
    ].forEach((node) => {
      node.addEventListener('input', () => this.persistIcecastSettingsFromForm());
      node.addEventListener('change', () => this.persistIcecastSettingsFromForm());
    });
    icecastPanel.append(icecastBody);
    isoConfigList.append(icecastPanel);

    // Summary section
    this.isoSummary = createElement('div', 'iso-config-summary');
    this.cloudSummaryNode = createElement('div', 'iso-config-summary__item', { text: 'Status: checking...' });
    this.cloudSummaryNode.dataset.state = 'pending';
    const serviceProgress = createElement('div', 'iso-config-summary__services');
    this.cloudProgressNodes.drive = createElement('div', 'iso-config-summary__item iso-config-summary__item--service', {
      text: 'Drive uploads idle',
    });
    this.cloudProgressNodes.drive.dataset.state = 'idle';
    this.cloudProgressNodes.dropbox = createElement('div', 'iso-config-summary__item iso-config-summary__item--service', {
      text: 'Dropbox uploads idle',
    });
    this.cloudProgressNodes.dropbox.dataset.state = 'idle';
    serviceProgress.append(this.cloudProgressNodes.drive, this.cloudProgressNodes.dropbox);
    this.isoSummary.append(this.cloudSummaryNode, serviceProgress);
    this.isoSummary.style.display = 'none';

    isoConfigCard.append(isoConfigList, this.isoSummary);
    sessionToolsGrid.append(isoConfigCard);
    makeCollapsible(sessionToolsPanel, 'Recording Controls', 'podcastStudio.collapse.recording');

    const timelinePanel = createElement('section', 'podcast-panel timeline-shell');
    timelinePanel.classList.add('console-grid__span-2');
    this.outputsContainer = createElement('div', 'timeline-surface');
    timelinePanel.append(this.outputsContainer);
    this.showOutputsMessage('Recordings and cue points will appear here.');
    makeCollapsible(timelinePanel, 'Timeline & Outputs', 'podcastStudio.collapse.timeline');

    const chatPanel = createElement('section', 'podcast-panel chat-panel');
    chatPanel.dataset.collapsed = 'false';
    this.chatPanel = chatPanel;
    const chatHeaderRow = createElement('div', 'chat-panel__header');
    const chatTitle = createElement('h2', '', { text: 'Control Room Chat' });
    const chatActions = createElement('div', 'chat-panel__actions');
    this.chatPopoutButton = createElement('button', 'chat-panel__action', { type: 'button', text: 'Pop out', title: 'Open chat in a separate window.' });
    this.chatPopoutButton.addEventListener('click', () => this.handleChatPopout());
    this.chatCollapseButton = createElement('button', 'panel-collapse-toggle', {
      type: 'button',
      text: '−',
    });
    this.chatCollapseButton.title = 'Collapse section';
    this.chatCollapseButton.setAttribute('aria-expanded', 'true');
    this.chatCollapseButton.addEventListener('click', () => this.toggleChatPanel());
    chatActions.append(this.chatPopoutButton, this.chatCollapseButton);
    chatHeaderRow.append(chatTitle, chatActions);
    chatPanel.append(chatHeaderRow);

    const chatBody = createElement('div', 'chat-panel__body');
    const legacyChat = document.getElementById('chatModule');
    if (legacyChat) {
      this.chatPlaceholder = document.createElement('div');
      this.chatPlaceholder.dataset.podcastPlaceholder = 'chat-module';
      if (legacyChat.parentNode) {
        legacyChat.parentNode.insertBefore(this.chatPlaceholder, legacyChat);
      }
      legacyChat.classList.remove('hidden');
      legacyChat.dataset.podcastOverlay = 'true';
      const legacyHeader = legacyChat.querySelector('.chat-header');
      if (legacyHeader) {
        const popLink = legacyHeader.querySelector('#popOutChat');
        if (popLink) {
          this.chatPopoutAnchor = popLink;
          popLink.style.display = 'none';
        }
        const closeLink = legacyHeader.querySelector('#closeChat');
        if (closeLink) {
          closeLink.style.display = 'none';
        }
        legacyHeader.dataset.podcastDisplay = legacyHeader.style.display || '';
        legacyHeader.style.display = 'none';
      }
      const legacyResizer = legacyChat.querySelector('.resizer');
      if (legacyResizer) {
        legacyResizer.dataset.podcastDisplay = legacyResizer.style.display || '';
        legacyResizer.style.display = 'none';
      }
      legacyChat.style.position = 'relative';
      legacyChat.style.right = 'auto';
      legacyChat.style.left = 'auto';
      legacyChat.style.bottom = 'auto';
      legacyChat.style.top = 'auto';
      legacyChat.style.zIndex = 'auto';
      legacyChat.style.maxWidth = '100%';
      legacyChat.style.width = '100%';
      legacyChat.style.height = 'auto';
      legacyChat.style.maxHeight = '320px';
      legacyChat.style.overflow = 'hidden';
      legacyChat.style.margin = '0';
      chatBody.append(legacyChat);
      this.chatModule = legacyChat;
    } else {
      chatBody.append(createElement('div', 'chat-panel__empty', { text: 'Chat initialising…' }));
    }
    if (this.chatPopoutButton) {
      const hasPopout = Boolean(this.chatPopoutAnchor || typeof window.createPopoutChat === 'function');
      this.chatPopoutButton.disabled = !hasPopout;
      if (!hasPopout) {
        this.chatPopoutButton.textContent = 'Pop out unavailable';
      }
    }
    chatPanel.append(chatBody);
    this.chatCollapsedHint = createElement('div', 'chat-panel__collapsed-hint', {
      text: 'Chat hidden. Click “Show chat” to reopen.',
    });
    this.chatCollapsedHint.style.display = 'none';
    chatPanel.append(this.chatCollapsedHint);

    if (this.chatModule) {
      this.chatModule.classList.remove('hidden');
      this.chatModule.style.display = '';
      this.chatModule.dataset.podcastEmbedded = 'true';
    }

    consoleGrid.append(invitePanel);
    consoleGrid.append(sessionToolsPanel);
    consoleGrid.append(timelinePanel);
    chatPanel.classList.add('console-grid__span-2');
    consoleGrid.append(chatPanel);

    main.append(rosterColumn, consoleColumn);

    // Footer
    const footer = createElement('footer', 'podcast-footer');
    footer.innerHTML = `
      <div>Powered by VDO.Ninja • Low-latency P2P backbone intact • <span class="podcast-help-link" id="podcast-help-link" role="button" tabindex="0">Guide</span></div>
      <div class="cloud-status">
        <span id="podcast-cloud-drive">${this.cloud?.hasDriveAccess() ? 'Google Drive linked' : 'Drive link pending'}</span>
        <span id="podcast-cloud-dropbox">${this.cloud?.hasDropboxAccess() ? 'Dropbox linked' : 'Dropbox link pending'}</span>
      </div>
    `;

    root.append(header, main, footer);
    document.body.appendChild(root);

    // Help link click handler (must be after appendChild)
    const helpLink = document.getElementById('podcast-help-link');
    if (helpLink) {
      helpLink.addEventListener('click', () => this.openHelpModal());
      helpLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openHelpModal();
        }
      });
    }

    this.driveStatusNode = document.getElementById('podcast-cloud-drive');
    this.dropboxStatusNode = document.getElementById('podcast-cloud-dropbox');
    this.updateHostMicUI();
    this.setHostMicError('');
    this.updateCloudLinkUI();
    this.updateReadinessSummary();
    this.setCloudMessage('drive', '');
    this.setCloudMessage('dropbox', '');
    this.updateInviteLink();
    this.toggleChatPanel(false);
    requestAnimationFrame(() => this.toggleChatPanel(false));
  }

  handleChatPopout() {
    if (this.chatPopoutAnchor && typeof this.chatPopoutAnchor.click === 'function') {
      try {
        this.chatPopoutAnchor.click();
        return;
      } catch (error) {
        console.warn('Legacy chat pop-out click failed', error);
      }
    }
    if (typeof window.createPopoutChat === 'function') {
      try {
        window.createPopoutChat();
        return;
      } catch (error) {
        console.warn('createPopoutChat invocation failed', error);
      }
    }
    try {
      window.open(window.location.href, '_blank', 'noopener');
    } catch (error) {
      console.warn('Fallback chat pop-out failed', error);
    }
  }

  toggleChatPanel(forceCollapsed) {
    const shouldCollapse = typeof forceCollapsed === 'boolean' ? forceCollapsed : !this.chatCollapsed;
    this.chatCollapsed = Boolean(shouldCollapse);
    if (this.chatPanel) {
      this.chatPanel.dataset.collapsed = this.chatCollapsed ? 'true' : 'false';
    }
    if (this.chatCollapseButton) {
      this.chatCollapseButton.textContent = this.chatCollapsed ? '+' : '−';
      this.chatCollapseButton.title = this.chatCollapsed ? 'Expand section' : 'Collapse section';
      this.chatCollapseButton.setAttribute('aria-expanded', this.chatCollapsed ? 'false' : 'true');
    }
    if (this.chatCollapsedHint) {
      this.chatCollapsedHint.style.display = this.chatCollapsed ? '' : 'none';
    }
    if (this.chatModule) {
      if (this.chatCollapsed) {
        this.chatModule.classList.add('hidden');
      } else {
        this.chatModule.classList.remove('hidden');
      }
    }
    if (this.session && typeof this.session.chat !== 'undefined') {
      this.session.chat = !this.chatCollapsed;
    }
  }

  getRecordingModeOptions(mode = this.currentRecordingMode) {
    const videoMode = mode === 'video';
    return {
      includeVideo: videoMode,
      includeScreenshares: videoMode,
    };
  }

  handleCaptureModeChange(mode) {
    const normalized = writeCaptureMode(mode);
    this.currentRecordingMode = normalized;
    if (this.captureModeSelect && this.captureModeSelect.value !== normalized) {
      this.captureModeSelect.value = normalized;
    }
    this.updateRecordingButtons();
    this.updateReadinessSummary();
  }

  getBackupParticipants() {
    return collectParticipants(this.session).filter((participant) => participant?.uuid);
  }

  getGuestBackupParticipantState(uuid) {
    const legacyButton = this.findLegacyDriveButton(uuid);
    const pressed = Boolean(legacyButton?.classList?.contains('pressed'));
    const snapshot = this.driveProgressSnapshots.get(uuid);
    const heartbeat = this.isDriveRecorderHeartbeatActive(uuid);
    const status = this.rosterDriveStatuses.get(uuid)?.dataset?.state || 'idle';
    const requested = pressed || heartbeat || Boolean(snapshot) || this.driveRequestTimers.has(uuid) || status === 'pending' || status === 'uploading';
    const confirmed = heartbeat || Boolean(snapshot);
    return {
      uuid,
      pressed,
      snapshot,
      heartbeat,
      status,
      requested,
      confirmed,
      error: status === 'error',
    };
  }

  getGuestBackupSnapshot() {
    const participants = this.getBackupParticipants().map((participant) => ({
      participant,
      ...this.getGuestBackupParticipantState(participant.uuid),
    }));
    const total = participants.length;
    const requested = participants.filter((entry) => entry.requested).length;
    const confirmed = participants.filter((entry) => entry.confirmed).length;
    const errors = participants.filter((entry) => entry.error).length;
    return {
      participants,
      total,
      requested,
      confirmed,
      pending: Math.max(requested - confirmed, 0),
      errors,
      linked: Boolean(this.cloud?.hasDriveAccess()),
    };
  }

  getGuestBackupCompactLabel() {
    const snapshot = this.getGuestBackupSnapshot();
    if (!snapshot.total) {
      return 'No guests';
    }
    if (!snapshot.requested) {
      return 'No live backup';
    }
    return `Guest backup ${snapshot.confirmed}/${snapshot.total}`;
  }

  describeCaptureMode(mode = this.currentRecordingMode) {
    return mode === 'video' ? 'Audio + Video ISO' : 'Audio ISO';
  }

  describeSaveTargetSummary() {
    const driveActive = Boolean(this.cloud?.hasDriveAccess());
    const dropboxActive = Boolean(this.cloud?.hasDropboxAccess());
    const diskMeta = readDiskRecordingState();
    const saveTargets = [];
    if (STUDIO_DISK_FEATURE_FLAG && diskMeta.enabled && diskMeta.folderName) {
      saveTargets.push(`Local folder (${diskMeta.folderName})`);
    }
    if (driveActive) {
      saveTargets.push('Drive');
    }
    if (dropboxActive) {
      saveTargets.push('Dropbox');
    }
    if (!saveTargets.length) {
      return 'Browser buffer only';
    }
    return `After stop -> ${saveTargets.join(' + ')}`;
  }

  countEstimatedRecordingTracks() {
    const recordingOptions = this.getRecordingModeOptions(this.currentRecordingMode);
    let count = 0;
    this.getBackupParticipants().forEach((participant) => {
      const stream = this.session?.rpcs?.[participant.uuid]?.streamSrc;
      const audioTracks = stream?.getAudioTracks?.() || [];
      const videoTracks = stream?.getVideoTracks?.() || [];
      count += audioTracks.length;
      if (recordingOptions.includeVideo) {
        count += videoTracks.length;
      }
    });
    this.getAdditionalRecordingParticipants().forEach((participant) => {
      const stream = participant?.stream;
      count += stream?.getAudioTracks?.().length || 0;
      if (recordingOptions.includeVideo) {
        count += stream?.getVideoTracks?.().length || 0;
      }
    });
    return Math.max(count, this.outputIndicators?.size || 0);
  }

  refreshRecordingStatusLive() {
    if (!this.recordingStatusNode) {
      return;
    }
    if (!this.recording || !this.recordStartedAt) {
      this.recordingStatusNode.textContent = this.recordingStatusBase || 'Idle';
      this.recordingStatusNode.dataset.state = this.recordingStatusState || 'idle';
      return;
    }
    const elapsed = this.formatDuration(Math.max(0, (Date.now() - this.recordStartedAt) / 1000));
    const trackCount = this.countEstimatedRecordingTracks();
    const backupLabel = this.getGuestBackupCompactLabel();
    this.recordingStatusNode.textContent = `${elapsed} | ${trackCount} track${trackCount === 1 ? '' : 's'} | ${backupLabel}`;
    this.recordingStatusNode.dataset.state = 'active';
  }

  startRecordingStatusTimer() {
    this.stopRecordingStatusTimer();
    this.refreshRecordingStatusLive();
    this.recordingStatusTimer = setInterval(() => this.refreshRecordingStatusLive(), 1000);
  }

  stopRecordingStatusTimer() {
    if (this.recordingStatusTimer) {
      clearInterval(this.recordingStatusTimer);
      this.recordingStatusTimer = null;
    }
  }

  updateGuestBackupControls() {
    if (!this.guestBackupButton || !this.guestBackupStatusNode) {
      return;
    }
    const snapshot = this.getGuestBackupSnapshot();
    if (this.guestBackupRow) {
      const visible = snapshot.total > 0;
      this.guestBackupRow.style.display = visible ? '' : 'none';
      if (this.guestBackupHint) this.guestBackupHint.style.display = visible ? '' : 'none';
    }
    const linked = snapshot.linked;
    const hasGuests = snapshot.total > 0;
    const hasRequested = snapshot.requested > 0;
    const allRequested = hasGuests && snapshot.requested === snapshot.total;
    const hasPartial = linked && snapshot.requested > 0 && snapshot.requested < snapshot.total;
    this.guestBackupButton.disabled = this.guestBackupBusy || !hasGuests || (!linked && !hasRequested);
    this.guestBackupButton.dataset.state = allRequested ? 'enabled' : 'idle';
    if (!hasGuests) {
      this.guestBackupButton.textContent = 'Enable guest backup';
      this.guestBackupButton.title = 'A guest must join before backup can be enabled.';
      this.guestBackupStatusNode.textContent = 'No guests connected';
      this.guestBackupStatusNode.dataset.state = 'idle';
      return;
    }
    if (!linked && !hasRequested) {
      this.guestBackupButton.textContent = 'Enable guest backup';
      this.guestBackupButton.title = 'Link Google Drive first to enable guest backup.';
      this.guestBackupStatusNode.textContent = 'Link Google Drive first';
      this.guestBackupStatusNode.dataset.state = 'error';
      return;
    }
    if (allRequested || (!linked && hasRequested)) {
      this.guestBackupButton.textContent = 'Disable guest backup';
      this.guestBackupButton.title = 'Stop guest-side backup recording for all connected guests.';
    } else if (hasPartial) {
      this.guestBackupButton.textContent = 'Enable missing backups';
      this.guestBackupButton.title = 'Enable backup recording for guests not yet confirmed.';
    } else {
      this.guestBackupButton.textContent = 'Enable guest backup';
      this.guestBackupButton.title = 'Ask every connected guest to self-record directly to your linked Google Drive.';
    }
    if (!snapshot.requested) {
      this.guestBackupStatusNode.textContent = `Ready for ${snapshot.total} guest${snapshot.total === 1 ? '' : 's'}`;
      this.guestBackupStatusNode.dataset.state = 'idle';
    } else if (snapshot.confirmed === snapshot.total) {
      this.guestBackupStatusNode.textContent = `${snapshot.confirmed}/${snapshot.total} confirmed`;
      this.guestBackupStatusNode.dataset.state = 'ready';
    } else {
      this.guestBackupStatusNode.textContent = `${snapshot.confirmed}/${snapshot.total} confirmed`;
      this.guestBackupStatusNode.dataset.state = snapshot.errors ? 'error' : 'pending';
    }
  }

  updateRecordingButtons() {
    if (this.recordButton) {
      this.recordButton.classList.toggle('recording', this.recording);
      this.recordButton.disabled = this.recordTransitioning;
      this.recordButton.textContent = this.recording ? 'Stop Recording' : 'Start Recording';
      this.recordButton.title = this.recording
        ? 'Stop the current ISO recording.'
        : `Start ${this.describeCaptureMode(this.currentRecordingMode)} capture.`;
    }
    if (this.captureModeSelect) {
      this.captureModeSelect.disabled = this.recording;
    }
    this.updateGuestBackupControls();
  }

  attachRecorderEvents() {
    this.recorder.addEventListener('start', (event) => {
      if (this.abortUploadsController) {
        this.abortUploadsController.abort();
      }
      this.abortUploadsController = new AbortController();
      this.cleanupDownloadUrls();
      this.trackRuntimeStats.clear();
      this.trackLevelNodes.clear();
      this.teardownSpectrograms();
      this.outputIndicators.clear();
      this.recording = true;
      this.recordTransitioning = false;
      this.recordStartedAt = event?.detail?.startedAt || Date.now();
      this.markers = [];
      this.renderMarkers();
      this.scheduleAutoSyncMarker();
      this.updateRecordingButtons();
      this.markerButton.disabled = false;
      this.showOutputsMessage('Recording… tracks will appear as media arrives.');
      this.updateHostMicUI();
      this.setUploadProgressPending(true);
      if (this.recordingPlan?.sync) {
        this.recordingPlan.sync.start = {
          wallClock: this.recordStartedAt,
          highRes: snapshotHighResClock(),
        };
      }
      this.logRecordingEvent('record:start', { sessionId: this.recordingSessionId, mode: this.currentRecordingMode });
      this.updateRecordingPlanStatus('started', { events: this.recordingPlan?.events || [] });
      this.setRecordingStatus(
        this.currentRecordingMode === 'video' ? 'Recording audio + video ISOs' : 'Recording audio ISOs',
        'active',
      );
      if (this.recordingSummary) this.recordingSummary.style.display = '';
      this.startRecordingStatusTimer();
    });

    this.recorder.addEventListener('chunk', (event) => {
      const { participant, trackType, channelIndex } = event.detail || {};
      if (!participant || !trackType) {
        return;
      }
      const channelKey = typeof channelIndex === 'number' ? channelIndex : 0;
      const key = this.buildTrackKey(participant.uuid, trackType, channelKey);
      if (!key) {
        return;
      }
      const indicator = this.ensureOutputIndicator(key, participant, trackType, channelKey);
      if (!indicator) {
        return;
      }
      indicator.badge.textContent = 'Recording';
      indicator.wrapper.dataset.state = 'recording';
      this.updateRecordingRuntimeMetrics(key, indicator, event.detail);
      this.trackManifestChunk(event.detail);
    });

    this.recorder.addEventListener('meter-ready', (event) => {
      const { participant, trackType, channelIndex, meter } = event.detail || {};
      if (!participant?.uuid || trackType !== 'audio') {
        return;
      }
      const key = this.buildTrackKey(participant.uuid, trackType, channelIndex);
      if (!key) {
        return;
      }
      const indicator = this.outputIndicators.get(key);
      if (!indicator) {
        return;
      }
      this.attachSpectrogram(key, indicator, participant, trackType, channelIndex, meter);
    });

    this.recorder.addEventListener('participant-added', (event) => {
      const { participant, startOffsetSeconds } = event.detail || {};
      if (!participant) {
        return;
      }
      const annotateLateJoin = (trackType, trackIndex) => {
        const key = this.buildTrackKey(participant.uuid, trackType, trackIndex);
        if (key) {
          const indicator = this.ensureOutputIndicator(key, participant, trackType, trackIndex);
          if (indicator?.badge) {
            indicator.badge.textContent = 'Late join';
            indicator.badge.title = `Joined ${startOffsetSeconds?.toFixed(1) || '?'}s into recording`;
          }
        }
      };
      const audioTracks = participant.stream?.getAudioTracks?.() || [];
      if (audioTracks.length) {
        audioTracks.forEach((_track, index) => annotateLateJoin('audio', index));
      }
      const videoTracks = participant.stream?.getVideoTracks?.() || [];
      if (videoTracks.length) {
        videoTracks.forEach((_track, index) => annotateLateJoin('video', index));
      }
      if (!audioTracks.length && !videoTracks.length) {
        annotateLateJoin('audio', 0);
      }
    });

    this.recorder.addEventListener('error', (event) => {
      console.error('Recorder error', event.detail);
      this.setStatusMessage('Recorder error: ' + (event.detail?.message || 'unknown'));
    });

    this.recorder.addEventListener('stop', (event) => {
      this.recording = false;
      this.recordTransitioning = false;
      this.stopRecordingStatusTimer();
      this.updateRecordingButtons();
      this.markerButton.disabled = true;
      if (this.autoMarkerTimeout) {
        clearTimeout(this.autoMarkerTimeout);
        this.autoMarkerTimeout = null;
      }
      this.showOutputsMessage('Finalising recordings…');
      this.trackLevelNodes.clear();
      this.teardownSpectrograms();
      this.presentRecordings(event.detail?.files);
      this.outputIndicators.clear();
      this.trackRuntimeStats.clear();
      this.updateHostMicUI();
      if (this.recordingPlan?.sync) {
        this.recordingPlan.sync.stop = {
          wallClock: Date.now(),
          highRes: snapshotHighResClock(),
        };
      }
      if (this.recordingPlan) {
        this.recordingPlan.files = this.summariseRecordingFiles(event.detail?.files);
        this.logRecordingEvent('record:stop', {
          fileCount: this.recordingPlan?.files?.length || 0,
          mode: this.currentRecordingMode,
        });
        this.updateRecordingPlanStatus('stopped', {
          files: this.recordingPlan.files,
          events: this.recordingPlan.events,
        });
      }
      this.setRecordingStatus('Recording idle', 'idle');
    });
  }

  ensureOutputIndicator(key, participant, trackType, channelIndex = 0) {
    if (!this.outputsContainer) {
      return null;
    }
    if (this.outputIndicators.has(key)) {
      return this.outputIndicators.get(key);
    }

    this.prepareTracklistSurface();

    if (!this.outputsContainer.dataset.hasTracks) {
      this.outputsContainer.innerHTML = '';
      this.outputsContainer.dataset.hasTracks = 'true';
    }

    const wrapper = createElement('div', 'timeline-track');
    wrapper.dataset.key = key;
    wrapper.dataset.trackType = trackType;
    wrapper.dataset.participant = participant.uuid || '';
    wrapper.dataset.state = 'armed';

    const header = createElement('div', 'timeline-track__header');
    const titleGroup = createElement('div', 'timeline-track__title-group');
    const title = createElement('div', 'timeline-track__title', { text: participant.label || participant.uuid || 'Guest' });
    const descriptorParts = [];
    if (participant.external || participant.uuid === 'host-mic') {
      descriptorParts.push('Local input');
    } else if (participant.streamID) {
      descriptorParts.push(`Stream ${participant.streamID}`);
    }
    descriptorParts.push(trackType ? trackType.toUpperCase() : 'AUDIO');
    descriptorParts.push(`Channel ${channelIndex + 1}`);
    const subtitle = createElement('div', 'timeline-track__subtitle', {
      text: descriptorParts.filter(Boolean).join(' • '),
    });
    titleGroup.append(title, subtitle);
    const badge = createElement('span', 'timeline-track__badge', { text: 'Arming' });
    header.append(titleGroup, badge);

    const metrics = createElement('div', 'timeline-track__metrics');
    const inboundMetric = createElement('span', 'timeline-track__metric timeline-track__metric--inbound', {
      text:
        trackType === 'video'
          ? participant.external || participant.uuid === 'host-mic'
            ? 'Inbound: Local capture'
            : 'Inbound: Video track live'
          : participant.external || participant.uuid === 'host-mic'
            ? 'Inbound: Local capture'
            : 'Inbound: pending…',
    });
    const recordMetric = createElement('span', 'timeline-track__metric timeline-track__metric--recording', {
      text: trackType === 'video' ? 'Recording: waiting for video…' : 'Recording: waiting…',
    });
    metrics.append(inboundMetric, recordMetric);

    const waveform = createElement('div', 'timeline-track__waveform');
    const spectrogramCanvas = document.createElement('canvas');
    spectrogramCanvas.className = 'timeline-track__spectrogram';
    const waveFill = createElement('div', 'timeline-track__wavefill');
    waveform.append(spectrogramCanvas, waveFill);

    wrapper.append(header, metrics, waveform);
    this.outputsContainer.append(wrapper);

    const indicator = {
      key,
      wrapper,
      badge,
      inboundMetric,
      recordMetric,
      waveFill,
      spectrogramCanvas,
      participant,
      trackType,
      channelIndex,
    };

    this.outputIndicators.set(key, indicator);
    this.registerTrackLevelNode(participant.uuid, waveFill);
    this.updateTrackInboundMetric(participant.uuid);
    this.attachSpectrogram(key, indicator, participant, trackType, channelIndex);
    return indicator;
  }

  setStatusMessage(message) {
    this.showOutputsMessage(message);
  }

  showOutputsMessage(text) {
    if (!this.outputsContainer) {
      return;
    }
    this.outputsContainer.dataset.mode = 'message';
    this.outputsContainer.dataset.hasTracks = '';
    this.outputsContainer.classList.remove('timeline-tracklist');
    this.outputsContainer.classList.remove('timeline-results');
    this.outputsContainer.innerHTML = '';
    if (typeof text === 'string' && text.trim()) {
      this.outputsContainer.append(createElement('div', 'timeline-placeholder', { text }));
    } else {
      this.outputsContainer.append(createElement('div', 'timeline-placeholder', { text: '' }));
    }
  }

  prepareTracklistSurface({ reset = false } = {}) {
    if (!this.outputsContainer) {
      return;
    }
    const switchingMode = this.outputsContainer.dataset.mode !== 'recording';
    if (switchingMode || reset) {
      this.outputsContainer.innerHTML = '';
      this.outputsContainer.dataset.hasTracks = '';
    }
    this.outputsContainer.dataset.mode = 'recording';
    this.outputsContainer.classList.add('timeline-tracklist');
    this.outputsContainer.classList.remove('timeline-results');
  }

  buildTrackKey(uuid, trackType, channelIndex = 0) {
    if (!uuid || !trackType) {
      return '';
    }
    const index = typeof channelIndex === 'number' ? channelIndex : 0;
    return `${uuid}-${trackType}-${index}`;
  }

  getMeterForTrack(uuid, trackType, channelIndex = 0) {
    if (!this.recorder || typeof this.recorder.getTrackMeter !== 'function') {
      return null;
    }
    return this.recorder.getTrackMeter(uuid, trackType, channelIndex);
  }

  attachSpectrogram(key, indicator, participant, trackType, channelIndex, meterOverride = null) {
    if (!key || trackType !== 'audio' || !indicator?.spectrogramCanvas) {
      return;
    }
    let renderer = this.spectrograms.get(key);
    if (!renderer) {
      renderer = new SpectrogramRenderer(indicator.spectrogramCanvas);
      this.spectrograms.set(key, renderer);
    }
    if (!participant?.uuid) {
      return;
    }
    const meter = meterOverride || this.getMeterForTrack(participant.uuid, trackType, channelIndex);
    if (meter?.analyser) {
      renderer.setAnalyser(meter.analyser);
    }
  }

  teardownSpectrograms() {
    if (!this.spectrograms) {
      return;
    }
    this.spectrograms.forEach((renderer) => {
      if (renderer && typeof renderer.destroy === 'function') {
        renderer.destroy();
      }
    });
    this.spectrograms.clear();
  }

  registerTrackLevelNode(uuid, node) {
    if (!uuid || !node) {
      return;
    }
    if (!this.trackLevelNodes.has(uuid)) {
      this.trackLevelNodes.set(uuid, new Set());
    }
    this.trackLevelNodes.get(uuid).add(node);
  }

  updateTrackLevelVisual(uuid, level) {
    if (!uuid) {
      return;
    }
    const nodes = this.trackLevelNodes.get(uuid);
    if (!nodes || !nodes.size) {
      return;
    }
    const normalized = Math.max(0.08, Math.min(1, (level || 0) / 100));
    nodes.forEach((node) => {
      if (!node) {
        return;
      }
      node.style.transform = `scaleY(${normalized})`;
      node.style.opacity = level > 3 ? '0.95' : '0.45';
    });
  }

  captureParticipantMetrics(participant) {
    if (!participant?.uuid) {
      return;
    }
    const next = { ...(this.participantMetrics.get(participant.uuid) || {}) };
    if (typeof participant.audioBitrateKbps === 'number' && participant.audioBitrateKbps >= 0) {
      next.audioBitrateKbps = participant.audioBitrateKbps;
    }
    if (participant.audioCodec) {
      next.audioCodec = participant.audioCodec;
    }
    if (participant.external || participant.uuid === 'host-mic') {
      next.local = true;
    }
    this.participantMetrics.set(participant.uuid, next);
    this.updateTrackInboundMetric(participant.uuid, next);
  }

  updateTrackInboundMetric(uuid, metrics = this.participantMetrics.get(uuid)) {
    if (!uuid) {
      return;
    }
    const resolvedMetrics = metrics || null;
    const indicators = this.outputIndicators || new Map();
    indicators.forEach((indicator) => {
      if (!indicator || !indicator.participant || indicator.participant.uuid !== uuid) {
        return;
      }
      const node = indicator.inboundMetric;
      if (!node) {
        return;
      }
      if (resolvedMetrics?.local) {
        node.textContent = indicator.trackType === 'video' ? 'Inbound: Local video capture' : 'Inbound: Local capture';
        return;
      }
      if (indicator.trackType === 'video') {
        node.textContent = 'Inbound: Video track live';
        return;
      }
      const parts = [];
      if (resolvedMetrics && typeof resolvedMetrics.audioBitrateKbps === 'number' && resolvedMetrics.audioBitrateKbps > 0) {
        const formatted = this.formatBitrate(resolvedMetrics.audioBitrateKbps);
        if (formatted) {
          parts.push(formatted);
        }
      }
      if (resolvedMetrics?.audioCodec) {
        parts.push(resolvedMetrics.audioCodec.toUpperCase());
      }
      node.textContent = parts.length ? `Inbound: ${parts.join(' • ')}` : 'Inbound: pending…';
    });
  }

  updateRecordingRuntimeMetrics(key, indicator, detail) {
    if (!indicator) {
      return;
    }
    const runtime = this.trackRuntimeStats.get(key) || {
      bytes: 0,
      startedAt: Date.now(),
      lastUpdate: Date.now(),
    };
    const chunk = detail?.data;
    if (chunk && typeof chunk.size === 'number') {
      runtime.bytes += chunk.size;
    }
    const now = Date.now();
    if (!runtime.startedAt) {
      runtime.startedAt = now;
    }
    runtime.lastUpdate = now;
    const elapsedMs = Math.max(1, now - runtime.startedAt);
    const kbps = runtime.bytes ? (runtime.bytes * 8) / elapsedMs : 0;
    const durationSeconds = (now - runtime.startedAt) / 1000;
    if (indicator.trackType === 'video' || detail?.trackType === 'video') {
      const videoRateLabel = kbps > 0 ? `${Math.round(kbps)} kbps` : 'capturing…';
      const durationLabel = this.formatDuration(durationSeconds);
      indicator.recordMetric.textContent = `Recording: ${videoRateLabel} • Video • ${durationLabel}`;
      this.trackRuntimeStats.set(key, runtime);
      return;
    }
    const sampleRate = this.recorder?.options?.targetSampleRate || 48000;
    const sampleRateLabel =
      sampleRate >= 1000
        ? `${(sampleRate / 1000).toFixed(sampleRate % 1000 === 0 ? 0 : 1)} kHz`
        : `${sampleRate} Hz`;
    const bitrateLabel = kbps > 0 ? `${Math.round(kbps)} kbps` : 'estimating…';
    const durationLabel = this.formatDuration(durationSeconds);
    indicator.recordMetric.textContent = `Recording: ${bitrateLabel} • WAV ${sampleRateLabel} • ${durationLabel}`;
    this.trackRuntimeStats.set(key, runtime);
  }

  buildRecordingPlanContext({ diskInfo } = {}) {
    const now = Date.now();
    const cloudSnapshot = readCloudLinkStatus();
    const plan = {
      sessionId: createRecordingSessionId(),
      conductor: 'studio',
      preparedAt: now,
      disk: {
        enabled: Boolean(diskInfo?.ready),
        folderName: diskInfo?.folderName || null,
        verifiedAt: diskInfo?.verifiedAt || null,
      },
      cloud: {
        driveLinked: Boolean(this.cloud?.hasDriveAccess() || cloudSnapshot.drive),
        dropboxLinked: Boolean(this.cloud?.hasDropboxAccess() || cloudSnapshot.dropbox),
        snapshot: cloudSnapshot,
      },
      sync: {
        prepared: snapshotHighResClock(),
        start: null,
        stop: null,
      },
      capture: {
        mode: this.currentRecordingMode,
        includeVideo: this.currentRecordingMode === 'video',
        includeScreenshares: this.currentRecordingMode === 'video',
      },
      participants: {},
      files: [],
      events: [],
    };
    this.recordingPlan = plan;
    this.recordingSessionId = plan.sessionId;
    this.logRecordingEvent('record:plan', { sessionId: plan.sessionId });
    dispatchStudioEvent(PODCAST_RECORD_PLAN_EVENT, { plan });
    this.setRecordingStatus('Recording plan armed', 'armed');
    return plan;
  }

  updateRecordingPlanStatus(status, extra = {}) {
    if (!this.recordingPlan) {
      return;
    }
    const detail = {
      status,
      plan: this.recordingPlan,
      timestamp: Date.now(),
      ...extra,
    };
    dispatchStudioEvent(PODCAST_RECORD_STATUS_EVENT, detail);
  }

  trackManifestChunk(detail) {
    if (!this.recordingPlan || !detail?.participant?.uuid) {
      return;
    }
    const participantId = detail.participant.uuid;
    if (!this.recordingPlan.participants[participantId]) {
      this.recordingPlan.participants[participantId] = {
        participantId,
        label: detail.participant.label || participantId,
        tracks: {},
      };
    }
    const participantPlan = this.recordingPlan.participants[participantId];
    const trackKey = `${detail.trackType || 'audio'}:${typeof detail.channelIndex === 'number' ? detail.channelIndex : 0}`;
    if (!participantPlan.tracks[trackKey]) {
      participantPlan.tracks[trackKey] = {
        trackType: detail.trackType || 'audio',
        channelIndex: typeof detail.channelIndex === 'number' ? detail.channelIndex : 0,
        segments: [],
        totalBytes: 0,
        sequence: 0,
      };
    }
    const track = participantPlan.tracks[trackKey];
    const bytes = detail.data?.size || 0;
    track.sequence += 1;
    track.totalBytes += bytes;
    const timecodeMs = this.recordStartedAt ? Date.now() - this.recordStartedAt : 0;
    const segment = {
      sequence: track.sequence,
      bytes,
      receivedAt: Date.now(),
      timecodeMs,
    };
    if (track.segments.length > 48) {
      track.segments.shift();
    }
    track.segments.push(segment);
  }

  summariseRecordingFiles(filesMap) {
    if (!filesMap || typeof filesMap.forEach !== 'function') {
      return [];
    }
    const summaries = [];
    filesMap.forEach((meta) => {
      if (!meta) {
        return;
      }
      summaries.push({
        participant: meta.participant?.uuid || null,
        label: meta.participant?.label || null,
        trackType: meta.trackType,
        channelIndex: meta.channelIndex,
        filename: meta.filename,
        mimeType: meta.mimeType,
        size: meta.size,
        durationSeconds: meta.durationSeconds,
      });
    });
    return summaries;
  }

  logRecordingEvent(type, data = {}) {
    if (!type) {
      return;
    }
    if (!this.recordingPlan) {
      this.recordingPlan = {
        sessionId: createRecordingSessionId(),
        events: [],
      };
    }
    if (!Array.isArray(this.recordingPlan.events)) {
      this.recordingPlan.events = [];
    }
    const timestamp = Date.now();
    const timecodeMs = this.recordStartedAt ? Math.max(0, timestamp - this.recordStartedAt) : 0;
    this.recordingPlan.events.push({
      type,
      timestamp,
      timecodeMs,
      data,
    });
    if (this.recordingPlan.events.length > 2000) {
      this.recordingPlan.events.shift();
    }
  }

  setRecordingStatus(text, state = 'idle') {
    if (!this.recordingStatusNode) {
      return;
    }
    this.recordingStatusBase = text;
    this.recordingStatusState = state;
    if (state === 'active') {
      this.refreshRecordingStatusLive();
      return;
    }
    this.recordingStatusNode.textContent = text;
    this.recordingStatusNode.dataset.state = state;
  }

  formatBitrate(value) {
    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }
    if (value >= 1000) {
      const megabits = value / 1000;
      return `${megabits.toFixed(megabits >= 10 ? 0 : 1)} Mbps`;
    }
    return `${Math.round(value)} kbps`;
  }

  formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  async handleRecordToggle() {
    if (this.recordTransitioning) {
      return;
    }
    if (this.recording) {
      this.recordTransitioning = true;
      this.updateRecordingButtons();
      this.showOutputsMessage('Wrapping up recording…');
      this.logRecordingEvent('record:stop:requested', { reason: 'host-toggle' });
      this.setRecordingStatus('Stopping recording…', 'stopping');
      if (this.markerButton) {
        this.markerButton.disabled = true;
      }
      if (this.autoMarkerTimeout) {
        clearTimeout(this.autoMarkerTimeout);
        this.autoMarkerTimeout = null;
      }
      const markerSnapshot = this.markers.map((marker) => ({ ...marker }));
      try {
        await this.recorder.stop({ markers: markerSnapshot });
      } catch (error) {
        console.error('Failed to stop recorder cleanly', error);
        this.setStatusMessage('Recording stop failed: ' + (error?.message || 'unknown error'));
        this.recordTransitioning = false;
        this.updateRecordingButtons();
      }
      return;
    }
    try {
      this.recordTransitioning = true;
      this.updateRecordingButtons();
      let diskInfo = null;
      if (STUDIO_DISK_FEATURE_FLAG && this.diskRecordingEnabled) {
        diskInfo = await this.ensureDiskCaptureReadiness({ interactive: true });
        if (diskInfo && diskInfo.error) {
          this.setStatusMessage(diskInfo.error.message || 'Disk folder not accessible.');
          this.recordTransitioning = false;
          this.updateRecordingButtons();
          return;
        }
      }
      this.buildRecordingPlanContext({ diskInfo });
      this.logRecordingEvent('record:arm', { source: 'host-toggle', mode: this.currentRecordingMode });
      this.updateRecordingPlanStatus('armed', { events: this.recordingPlan?.events || [] });
      this.setRecordingStatus(
        this.currentRecordingMode === 'video' ? 'Arming audio + video ISOs…' : 'Arming audio ISOs…',
        'arming',
      );
      const recordingOptions = this.getRecordingModeOptions(this.currentRecordingMode);
      await this.recorder.start({
        includeVideo: recordingOptions.includeVideo,
        includeScreenshares: recordingOptions.includeScreenshares,
        includeLocal: false,
        extraParticipants: this.getAdditionalRecordingParticipants(),
      });
    } catch (error) {
      console.error('Failed to start recorder', error);
      this.setStatusMessage('Unable to start recording: ' + (error?.message || 'unknown error'));
      this.updateHostMicUI();
      this.recordTransitioning = false;
      this.updateRecordingButtons();
      this.stopRecordingStatusTimer();
      this.logRecordingEvent('record:error', { stage: 'start', message: error?.message || 'unknown error' });
      this.setRecordingStatus('Recording idle', 'error');
      this.updateRecordingPlanStatus('error', { error: error?.message || 'start failed', events: this.recordingPlan?.events || [] });
      this.setUploadProgressPending(false);
    }
  }

  tryAddParticipantToRecording(participant) {
    if (!this.recording || !this.recorder) {
      return;
    }
    if (!participant?.stream) {
      return;
    }
    try {
      const result = this.recorder.addParticipant(participant);
      if (result?.added) {
        console.log(`Added late-joining participant to recording: ${participant.label || participant.uuid} (offset: ${result.startOffsetSeconds?.toFixed(1)}s)`);
        this.logRecordingEvent('participant:added-mid-recording', {
          uuid: participant.uuid,
          label: participant.label,
          startOffsetSeconds: result.startOffsetSeconds,
          trackCount: result.tracks,
        });
        // Drop a sync marker so the new track can be aligned with existing tracks
        this.addSyncMarkerForNewTrack(participant, result.startOffsetSeconds);
      }
    } catch (error) {
      console.warn('Failed to add participant to recording', error);
    }
  }

  addSyncMarkerForNewTrack(participant, startOffsetSeconds) {
    if (!this.recording || !this.recordStartedAt) {
      return;
    }
    // Wait 1 second after track starts, then drop a sync marker
    // This gives the track time to stabilize before the sync point
    setTimeout(() => {
      if (!this.recording) {
        return;
      }
      const timestamp = this.recordStartedAt ? (Date.now() - this.recordStartedAt) / 1000 : startOffsetSeconds + 1;
      const label = participant?.label || participant?.uuid || 'Guest';
      const note = {
        time: timestamp,
        label: `Sync: ${label} joined @ ${timestamp.toFixed(1)}s`,
        auto: true,
        joinSync: true,
      };
      this.markers.push(note);
      this.logRecordingEvent('marker', { label: note.label, timeSeconds: note.time, auto: true, joinSync: true });
      this.renderMarkers();
    }, 1000);
  }

  openRecordShowWindow() {
    const room = this.resolveRoomName();
    if (!room) {
      this.setStatusMessage('Set a room name before recording the show.');
      return;
    }
    // Build URL to the main VDO.ninja with scene + recordwindow
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/podcast\/?.*/, '');
    const url = `${baseUrl}/?scene=0&room=${encodeURIComponent(room)}&recordwindow&chroma=000&locked=1.777`;
    const win = window.open(
      url,
      'recordShow',
      'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=1280,height=720'
    );
    if (win) {
      win.focus();
    }
  }

  async presentRecordings(filesMap) {
    const files = filesMap || this.recorder.getFiles();
    if (!files || files.size === 0) {
      this.showOutputsMessage('No media captured.');
      this.setUploadProgressPending(false);
      return;
    }
    this.cleanupDownloadUrls();
    this.outputsContainer.dataset.mode = 'results';
    this.outputsContainer.dataset.hasTracks = '';
    this.outputsContainer.classList.remove('timeline-tracklist');
    this.outputsContainer.classList.add('timeline-results');
    this.outputsContainer.innerHTML = '';
    const uploadPromises = [];
    this.setUploadProgressPending(false);
    files.forEach((meta, key) => {
      if (!meta?.blob) {
        return;
      }
      const wrapper = createElement('div', 'timeline-entry');
      wrapper.dataset.key = key;
      const label = `${meta.trackType.toUpperCase()} • ${meta.participant.label || meta.participant.uuid}`;
      const downloadUrl = URL.createObjectURL(meta.blob);
      this.activeDownloadUrls.push(downloadUrl);
      const linkLabel = meta.mimeType === 'audio/wav' ? 'Download WAV' : 'Download';
      const linkTitle =
        meta.mimeType === 'audio/wav'
          ? 'Download as WAV (includes embedded cue markers).'
          : 'Download captured media.';
      const link = createElement('a', 'marker-badge', { text: linkLabel, href: downloadUrl, title: linkTitle });
      const fallbackExtension = meta.mimeType?.split('/')?.[1] || 'webm';
      link.download = meta.filename || `${meta.participant.streamID || meta.participant.uuid}-${meta.trackType}.${fallbackExtension}`;
      const header = createElement('div', 'timeline-entry-header');
      header.append(createElement('span', 'timeline-entry-label', { text: label }), link);
      wrapper.append(header);
      const metaSummary = this.describeTrackMeta(meta) || 'Metadata pending';
      const metaLine = createElement('div', 'upload-meta', { text: metaSummary });
      if (meta.packagingError) {
        metaLine.textContent += metaSummary ? ' • fallback export' : 'Fallback export';
      }
      wrapper.append(metaLine);
      const statusContainer = createElement('div', 'upload-status');
      const localLine = STUDIO_DISK_FEATURE_FLAG ? this.createServiceStatusLine('local') : null;
      const dropboxLine = this.createServiceStatusLine('dropbox');
      if (localLine) {
        statusContainer.append(localLine);
      }
      statusContainer.append(dropboxLine);
      wrapper.append(statusContainer);
      this.outputsContainer.append(wrapper);
      const transferTasks = [
        this.queueDropboxUpload(meta, dropboxLine),
      ];
      if (localLine) {
        transferTasks.unshift(this.queueLocalDiskWrite(meta, localLine));
      }
      uploadPromises.push(
        Promise.allSettled(transferTasks),
      );
    });
    if (uploadPromises.length) {
      try {
        await Promise.allSettled(uploadPromises);
      } catch (error) {
        console.warn('One or more uploads failed', error);
      }
    }
    this.updateCloudFooter();
  }

  addMarker() {
    if (!this.recording) {
      return;
    }
    const timestamp = this.recordStartedAt ? (Date.now() - this.recordStartedAt) / 1000 : 0;
    const note = {
      time: timestamp,
      label: `Marker @ ${timestamp.toFixed(1)}s`,
    };
    this.markers.push(note);
    this.logRecordingEvent('marker', { label: note.label, timeSeconds: note.time });
    this.renderMarkers();
  }

  scheduleAutoSyncMarker() {
    if (this.autoMarkerTimeout) {
      return;
    }
    this.autoMarkerTimeout = setTimeout(() => {
      this.autoMarkerTimeout = null;
      if (!this.recording) {
        return;
      }
      const timestamp = this.recordStartedAt ? (Date.now() - this.recordStartedAt) / 1000 : 1;
      const note = {
        time: timestamp,
        label: `Auto sync @ ${timestamp.toFixed(1)}s`,
        auto: true,
      };
      this.markers.push(note);
      this.logRecordingEvent('marker', { label: note.label, timeSeconds: note.time, auto: true });
      this.renderMarkers();
    }, 1000);
  }

  escapeCsvValue(value) {
    const raw = value === null || typeof value === 'undefined' ? '' : String(value);
    const escaped = raw.replace(/\"/g, '""');
    return `"${escaped}"`;
  }

  formatMarkerTimecode(seconds) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const totalMs = Math.round(safeSeconds * 1000);
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  buildMarkersCsv() {
    const markers = Array.isArray(this.markers) ? this.markers : [];
    const header = ['index', 'time_seconds', 'timecode', 'label', 'auto'].join(',');
    if (!markers.length) {
      return `${header}\n`;
    }
    const rows = markers.map((marker, index) => {
      const timeSeconds = Number.isFinite(marker?.time) ? marker.time : 0;
      const timecode = this.formatMarkerTimecode(timeSeconds);
      const label = marker?.label || `Marker #${index + 1}`;
      const auto = marker?.auto ? '1' : '0';
      return [
        index + 1,
        timeSeconds.toFixed(3),
        this.escapeCsvValue(timecode),
        this.escapeCsvValue(label),
        auto,
      ].join(',');
    });
    return `${header}\n${rows.join('\n')}\n`;
  }

  buildMarkersFilename() {
    const sessionId = this.recordingSessionId || this.recordingPlan?.sessionId || 'session';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `vdo-ninja-markers-${sessionId}-${timestamp}.csv`;
  }

  exportMarkersCsv() {
    if (!this.markerExportButton) {
      return;
    }
    const csv = this.buildMarkersCsv();
    if (!csv.trim()) {
      return;
    }
    // Visual feedback while preparing download
    const originalText = this.markerExportButton.textContent;
    this.markerExportButton.textContent = 'Exporting…';
    this.markerExportButton.disabled = true;

    // Small delay to show feedback before download triggers
    setTimeout(() => {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = this.buildMarkersFilename();
        link.rel = 'noopener';
        link.click();
        this.markerExportButton.textContent = 'Exported';
      } catch (error) {
        console.warn('Failed to trigger CSV download', error);
        this.markerExportButton.textContent = 'Export failed';
      } finally {
        setTimeout(() => URL.revokeObjectURL(url), 100);
        // Restore button after a moment
        setTimeout(() => {
          if (this.markerExportButton) {
            this.markerExportButton.textContent = originalText;
            this.markerExportButton.disabled = false;
          }
        }, 1500);
      }
    }, 50);
  }

  async copyMarkersCsv() {
    if (!this.markerCopyButton) {
      return;
    }
    const csv = this.buildMarkersCsv();
    if (!csv.trim()) {
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(csv);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = csv;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      this.markerCopyButton.textContent = 'Copied';
      if (this.markerCopyResetTimer) {
        clearTimeout(this.markerCopyResetTimer);
      }
      this.markerCopyResetTimer = setTimeout(() => {
        this.markerCopyResetTimer = null;
        if (this.markerCopyButton) {
          this.markerCopyButton.textContent = 'Copy CSV';
        }
      }, 1500);
    } catch (error) {
      console.warn('Copy markers failed', error);
      this.markerCopyButton.textContent = 'Copy failed';
      if (this.markerCopyResetTimer) {
        clearTimeout(this.markerCopyResetTimer);
      }
      this.markerCopyResetTimer = setTimeout(() => {
        this.markerCopyResetTimer = null;
        if (this.markerCopyButton) {
          this.markerCopyButton.textContent = 'Copy CSV';
        }
      }, 2000);
    }
  }

  renderMarkers() {
    this.markerLog.innerHTML = '';
    if (this.markerActions) {
      this.markerActions.style.display = this.markers.length ? '' : 'none';
    }
    if (!this.markers.length) {
      const empty = createElement('div', 'empty-state', { text: 'Tap “Marker” to drop cue points during recording.' });
      empty.dataset.empty = 'true';
      this.markerLog.append(empty);
      return;
    }
    // Render newest markers first (reverse order) so they appear at the top
    for (let i = this.markers.length - 1; i >= 0; i -= 1) {
      const marker = this.markers[i];
      const timeSeconds = Number.isFinite(marker?.time) ? marker.time : 0;
      const timecode = this.formatMarkerTimecode(timeSeconds);
      const item = createElement('div', 'marker-item');
      item.title = `${marker?.auto ? 'Auto sync' : 'Marker'} @ ${timecode}`;
      item.append(createElement('span', '', { text: marker.label }));
      item.append(createElement('span', 'marker-badge', { text: `#${i + 1}` }));
      this.markerLog.append(item);
    }
  }

  startRosterLoop() {
    if (this.rosterTimer) {
      clearInterval(this.rosterTimer);
    }
    this.rosterTimer = setInterval(() => this.refreshRoster(), ROSTER_REFRESH_MS);
  }

  refreshRoster() {
    if (!this.session) {
      return;
    }
    this.updateRoomIndicator();
    const baseParticipants = collectParticipants(this.session);
    const participants = [...baseParticipants];
    this.virtualParticipants.forEach((participant) => {
      if (participant) {
        participants.push(participant);
      }
    });
    const activeIds = new Set();

    participants.forEach((participant) => {
      activeIds.add(participant.uuid);
      this.captureParticipantMetrics(participant);
      const existing = this.rosterItems.get(participant.uuid);
      if (existing) {
        this.updateRosterItem(existing, participant);
      } else {
        const item = this.createRosterItem(participant);
        this.rosterItems.set(participant.uuid, item);
        this.rosterList.append(item);
        // Add new participant to active recording
        this.tryAddParticipantToRecording(participant);
      }
    });

    Array.from(this.rosterItems.keys()).forEach((uuid) => {
      if (!activeIds.has(uuid)) {
        const node = this.rosterItems.get(uuid);
      if (node?.parentNode) {
        node.parentNode.removeChild(node);
      }
      this.rosterItems.delete(uuid);
      this.meterValues.delete(uuid);
      this.teardownDriveControl(uuid);
      if (this.remoteOverlay && this.remoteOverlay.dataset.activeUuid === uuid) {
        this.closeRemoteOverlay();
      }
    }
  });
    this.updateGuestBackupControls();
    this.updateReadinessSummary();
    this.refreshRecordingStatusLive();
    if (this.icecastPublisher?.isLive()) {
      this.icecastPublisher.refreshSources();
    }
  }

  createRosterItem(participant) {
    const item = createElement('div', 'roster-item');
    item.dataset.uuid = participant.uuid;
    item.dataset.status = participant.status || 'connecting';
    if (participant.role) {
      item.dataset.role = participant.role;
    }

    // Video thumbnail for guest preview
    const videoThumb = document.createElement('video');
    videoThumb.className = 'roster-item__video-thumb';
    videoThumb.muted = true;
    videoThumb.playsInline = true;
    videoThumb.autoplay = true;
    videoThumb.dataset.noVideo = 'true'; // hidden by default until video track available

    const meta = createElement('div', 'roster-meta');
    meta.append(createElement('div', 'roster-name', { text: participant.label }));
    const idText = participant.streamID ? `Stream: ${participant.streamID}` : 'Awaiting stream';
    meta.append(createElement('div', 'roster-id', { text: idText }));
    const descriptorText = this.describeParticipantRole(participant);
    if (descriptorText) {
      meta.append(createElement('div', 'roster-role', { text: descriptorText }));
    }

    const meter = createElement('div', 'meter-bar', { 'data-meter': participant.uuid });
    meter.append(createElement('div', 'meter-bar-fill'));

    const mediaRow = createElement('div', 'roster-item__media-row');
    mediaRow.append(videoThumb, meter);

    item.append(meta, mediaRow);

    const actions = createElement('div', 'roster-actions');
    const actionRow = createElement('div', 'roster-action-row');
    let hasActions = false;
    if (participant.role !== 'host-mic') {
      const controlButton = createElement('button', 'roster-action-button', {
        type: 'button',
        text: 'Remote Controls',
        title: 'Open legacy remote controls for this guest.',
      });
      controlButton.addEventListener('click', () => this.openRemoteControls(participant.uuid));
      actionRow.append(controlButton);
      hasActions = true;
    }
    const driveControls = this.createDriveControl(participant);
    if (driveControls) {
      actionRow.append(driveControls.button);
      hasActions = true;
    }
    if (hasActions) {
      if (driveControls?.status) {
        actionRow.append(driveControls.status);
      }
      actions.append(actionRow);
      item.append(actions);
    }

    this.updateRosterItem(item, participant);
    return item;
  }

  updateRosterItem(item, participant) {
    item.dataset.status = participant.status || 'connecting';
    const name = item.querySelector('.roster-name');
    if (name) {
      name.textContent = participant.label;
    }
    const id = item.querySelector('.roster-id');
    if (id) {
      id.textContent = participant.streamID ? `Stream: ${participant.streamID}` : 'Awaiting stream';
    }
    item.dataset.role = participant.role || '';
    const descriptor = item.querySelector('.roster-role');
    if (descriptor) {
      const descriptorText = this.describeParticipantRole(participant);
      descriptor.textContent = descriptorText || '';
      descriptor.style.display = descriptorText ? '' : 'none';
    }
    this.applyMeterValue(participant.uuid, participant.audioLevel || 0);
    this.updateDriveActionAvailability(participant.uuid);

    // Update video thumbnail if available
    const videoThumb = item.querySelector('.roster-item__video-thumb');
    if (videoThumb && this.session?.rpcs) {
      const peer = this.session.rpcs[participant.uuid];
      const videoTracks = peer?.streamSrc?.getVideoTracks?.() || [];
      if (videoTracks.length > 0) {
        if (!videoThumb.srcObject || videoThumb.srcObject.getVideoTracks()[0]?.id !== videoTracks[0].id) {
          videoThumb.srcObject = new MediaStream(videoTracks);
        }
        videoThumb.dataset.noVideo = 'false';
      } else {
        if (videoThumb.srcObject) {
          videoThumb.srcObject = null;
        }
        videoThumb.dataset.noVideo = 'true';
      }
    }
  }

  createDriveControl(participant) {
    if (!participant || participant.role === 'host-mic' || !participant.uuid) {
      return null;
    }
    if (typeof window === 'undefined' || typeof window.requestGoogleDriveRecord !== 'function') {
      return null;
    }
    const button = createElement('button', 'roster-action-button roster-action-button--drive', {
      type: 'button',
      text: 'Guest → Drive',
      title: 'Record guest to Google Drive (video + audio)',
    });
    button.dataset.uuid = participant.uuid;
    button.addEventListener('click', () => this.handleDriveRecordToggle(participant.uuid));

    const status = createElement('div', 'roster-drive-status', { text: DRIVE_STATUS_MESSAGES.idle });
    status.dataset.state = 'idle';
    status.dataset.uuid = participant.uuid;

    this.rosterDriveButtons.set(participant.uuid, button);
    this.rosterDriveStatuses.set(participant.uuid, status);
    this.updateDriveActionAvailability(participant.uuid);
    this.applyDriveSnapshot(participant.uuid);

    return { button, status };
  }

  teardownDriveControl(uuid) {
    if (!uuid) {
      return;
    }
    this.clearDriveRequestTimers(uuid);
    if (this.driveStatusResetTimers.has(uuid)) {
      clearTimeout(this.driveStatusResetTimers.get(uuid));
      this.driveStatusResetTimers.delete(uuid);
    }
    this.rosterDriveButtons.delete(uuid);
    this.rosterDriveStatuses.delete(uuid);
    this.driveRecorderStates.delete(uuid);
    this.driveProgressSnapshots.delete(uuid);
  }

  clearDriveRequestTimers(uuid) {
    if (!uuid) {
      return;
    }
    const timers = this.driveRequestTimers.get(uuid);
    if (!timers) {
      return;
    }
    if (timers.ack) {
      clearTimeout(timers.ack);
    }
    if (timers.stale) {
      clearTimeout(timers.stale);
    }
    this.driveRequestTimers.delete(uuid);
  }

  isDriveRecorderHeartbeatActive(uuid) {
    const state = this.driveRecorderStates.get(uuid);
    if (!state) {
      return false;
    }
    if (!(state.code >= 0 || state.code === -5 || state.code === -2)) {
      return false;
    }
    if (!state.at) {
      return true;
    }
    return Date.now() - state.at <= DRIVE_RECORDER_HEARTBEAT_GRACE_MS;
  }

  scheduleDriveRequestWatchdog(uuid) {
    if (!uuid) {
      return;
    }
    this.clearDriveRequestTimers(uuid);
    const timers = {
      ack: null,
      stale: null,
    };
    timers.ack = setTimeout(() => {
      const latestSnapshot = this.driveProgressSnapshots.get(uuid);
      if (latestSnapshot) {
        this.setRosterDriveStatusFromSnapshot(uuid, latestSnapshot);
        return;
      }
      const legacyButton = this.findLegacyDriveButton(uuid);
      const pressed = Boolean(legacyButton?.classList?.contains('pressed'));
      this.setRosterDriveStatus(
        uuid,
        'pending',
        pressed
          ? 'Drive requested. Waiting for guest recorder to start…'
          : 'Drive request sent. Waiting for guest to confirm recording permission…',
      );
      const runStaleCheck = () => {
        const staleSnapshot = this.driveProgressSnapshots.get(uuid);
        if (staleSnapshot) {
          this.setRosterDriveStatusFromSnapshot(uuid, staleSnapshot);
          return;
        }
        const stillPressed = Boolean(this.findLegacyDriveButton(uuid)?.classList?.contains('pressed'));
        if (this.isDriveRecorderHeartbeatActive(uuid)) {
          this.setRosterDriveStatus(uuid, 'pending', 'Guest recorder is active. Waiting for Drive upload stats…');
          timers.stale = setTimeout(runStaleCheck, DRIVE_REQUEST_STALE_TIMEOUT_MS);
          this.driveRequestTimers.set(uuid, timers);
          return;
        }
        if (!stillPressed) {
          this.setRosterDriveStatus(uuid, 'error', 'Guest did not confirm Drive recording.');
          this.updateDriveActionAvailability(uuid);
        } else {
          this.setRosterDriveStatus(uuid, 'error', 'Drive upload never started. Ask guest to allow recording and retry.');
          this.updateDriveActionAvailability(uuid);
        }
        this.clearDriveRequestTimers(uuid);
      };
      timers.stale = setTimeout(runStaleCheck, DRIVE_REQUEST_STALE_TIMEOUT_MS);
      this.driveRequestTimers.set(uuid, timers);
    }, DRIVE_REQUEST_ACK_TIMEOUT_MS);
    this.driveRequestTimers.set(uuid, timers);
  }

  reconcileDriveRequestOutcome(uuid) {
    if (!uuid) {
      return;
    }
    const latestSnapshot = this.driveProgressSnapshots.get(uuid);
    if (latestSnapshot) {
      this.setRosterDriveStatusFromSnapshot(uuid, latestSnapshot);
      return;
    }
    const legacyButton = this.findLegacyDriveButton(uuid);
    const pressed = Boolean(legacyButton?.classList?.contains('pressed'));
    if (pressed) {
      this.setRosterDriveStatus(uuid, 'pending', 'Drive request sent. Waiting for upload telemetry…');
      return;
    }
    this.setRosterDriveStatus(uuid, 'error', 'Drive upload not started. Retry and have the guest accept the recording prompt.');
  }

  findLegacyDriveButton(uuid) {
    if (!uuid || typeof document === 'undefined') {
      return null;
    }
    return document.querySelector('[data-action-type="recorder-google-drive-remote"][data--u-u-i-d="' + uuid + '"]');
  }

  canTriggerDriveUpload() {
    if (typeof window === 'undefined' || typeof window.requestGoogleDriveRecord !== 'function') {
      return false;
    }
    return Boolean(this.cloud?.hasDriveAccess());
  }

  async handleGuestBackupToggle() {
    const snapshot = this.getGuestBackupSnapshot();
    if (!snapshot.total) {
      this.updateGuestBackupControls();
      this.updateReadinessSummary();
      return;
    }
    if (!this.canTriggerDriveUpload()) {
      if (this.guestBackupStatusNode) {
        this.guestBackupStatusNode.textContent = 'Link Google Drive first';
        this.guestBackupStatusNode.dataset.state = 'error';
      }
      this.updateReadinessSummary();
      return;
    }
    const stopTargets = snapshot.participants.filter((entry) => entry.requested).map((entry) => entry.uuid);
    const armTargets = snapshot.participants.filter((entry) => !entry.requested).map((entry) => entry.uuid);
    const stopping = snapshot.requested === snapshot.total;
    const targets = stopping ? stopTargets : armTargets;
    if (!targets.length) {
      this.updateGuestBackupControls();
      this.updateReadinessSummary();
      return;
    }
    this.guestBackupBusy = true;
    this.updateGuestBackupControls();
    try {
      if (stopping) {
        for (const uuid of targets) {
          // Reuse the existing per-guest stop path so the legacy UI stays in sync.
          await this.handleDriveRecordToggle(uuid);
        }
      } else {
        for (const uuid of targets) {
          await this.handleDriveRecordToggle(uuid, { bitrate: DEFAULT_GUEST_BACKUP_BITRATE });
        }
      }
    } finally {
      this.guestBackupBusy = false;
      this.updateGuestBackupControls();
      this.updateReadinessSummary();
      this.refreshRecordingStatusLive();
    }
  }

  async handleDriveRecordToggle(uuid, { bitrate = null } = {}) {
    if (!uuid) {
      return;
    }
    const button = this.rosterDriveButtons.get(uuid);
    if (!button) {
      return;
    }
    if (typeof window === 'undefined' || typeof window.requestGoogleDriveRecord !== 'function') {
      this.setRosterDriveStatus(uuid, 'error', 'Drive controls unavailable in this build.');
      return;
    }
    const legacyButton = this.findLegacyDriveButton(uuid);
    if (!legacyButton) {
      this.setRosterDriveStatus(uuid, 'pending', 'Guest controls preparing…');
      this.updateDriveActionAvailability(uuid);
      return;
    }
    const isActive = legacyButton.classList?.contains('pressed');
    if (!isActive && !this.canTriggerDriveUpload()) {
      this.setRosterDriveStatus(uuid, 'error', 'Link Google Drive above to enable uploads.');
      this.updateDriveActionAvailability(uuid);
      return;
    }
    button.dataset.pending = 'true';
    button.disabled = true;
    try {
      if (isActive) {
        this.clearDriveRequestTimers(uuid);
        this.driveRecorderStates.delete(uuid);
        await window.requestGoogleDriveRecord(legacyButton, false);
        this.setRosterDriveStatus(uuid, 'idle', DRIVE_STATUS_MESSAGES.idle);
      } else {
        // Drop any stale snapshot from a prior upload so a new request must
        // wait for fresh telemetry before reconciling success/failure.
        this.driveProgressSnapshots.delete(uuid);
        this.driveRecorderStates.delete(uuid);
        this.setRosterDriveStatus(uuid, 'pending', 'Requesting Drive upload…');
        await window.requestGoogleDriveRecord(legacyButton, true, bitrate);
        const started = Boolean(legacyButton.classList?.contains('pressed'))
          || Boolean(this.driveProgressSnapshots.get(uuid))
          || this.isDriveRecorderHeartbeatActive(uuid);
        if (started) {
          this.scheduleDriveRequestWatchdog(uuid);
          this.reconcileDriveRequestOutcome(uuid);
        } else {
          this.setRosterDriveStatus(uuid, 'idle', DRIVE_STATUS_MESSAGES.idle);
        }
      }
    } catch (error) {
      this.clearDriveRequestTimers(uuid);
      const message = error?.message || 'Drive request cancelled';
      this.setRosterDriveStatus(uuid, 'error', message);
    } finally {
      button.dataset.pending = 'false';
      this.updateDriveActionAvailability(uuid);
      this.updateReadinessSummary();
      this.refreshRecordingStatusLive();
    }
  }

  updateDriveActionAvailability(uuid) {
    const button = this.rosterDriveButtons.get(uuid);
    if (!button) {
      return;
    }
    const hasRequestApi = typeof window !== 'undefined' && typeof window.requestGoogleDriveRecord === 'function';
    const legacyButton = this.findLegacyDriveButton(uuid);
    const hasLegacyControl = Boolean(legacyButton);
    const isActive = Boolean(legacyButton?.classList?.contains('pressed'));
    const pending = button.dataset.pending === 'true';

    let disabled = pending || !hasRequestApi;
    let title = '';

    if (!hasRequestApi) {
      title = 'Drive controls are not available in this build.';
    } else if (!hasLegacyControl) {
      title = 'Guest controls are still initialising.';
      disabled = true;
    } else if (isActive) {
      title = 'Stop this guest’s Drive upload.';
      disabled = pending;
    } else if (!this.canTriggerDriveUpload()) {
      title = 'Link Google Drive above to enable uploads.';
      disabled = true;
    } else {
      title = 'Ask this guest to upload to Drive.';
      disabled = pending;
    }

    button.disabled = disabled;
    button.textContent = isActive ? 'Stop Guest → Drive' : 'Guest → Drive';
    button.dataset.state = isActive ? 'active' : 'idle';
    if (title) {
      button.title = title;
    }
  }

  updateAllDriveActions() {
    this.rosterDriveButtons.forEach((_, uuid) => this.updateDriveActionAvailability(uuid));
  }

  setRosterDriveStatus(uuid, state = 'idle', text) {
    const node = this.rosterDriveStatuses.get(uuid);
    if (!node) {
      return;
    }
    if (this.driveStatusResetTimers.has(uuid)) {
      clearTimeout(this.driveStatusResetTimers.get(uuid));
      this.driveStatusResetTimers.delete(uuid);
    }
    const label = text || DRIVE_STATUS_MESSAGES[state] || DRIVE_STATUS_MESSAGES.idle;
    node.dataset.state = state;
    node.textContent = label;
    if (state === 'done' || state === 'idle' || state === 'error') {
      this.clearDriveRequestTimers(uuid);
    }
    if (state === 'done') {
      const timer = setTimeout(() => {
        this.setRosterDriveStatus(uuid, 'idle', DRIVE_STATUS_MESSAGES.idle);
        this.driveStatusResetTimers.delete(uuid);
      }, DRIVE_STATUS_RESET_MS);
      this.driveStatusResetTimers.set(uuid, timer);
    }
    this.updateGuestBackupControls();
    this.updateReadinessSummary();
    this.refreshRecordingStatusLive();
  }

  applyDriveSnapshot(uuid) {
    const snapshot = this.driveProgressSnapshots.get(uuid);
    if (!snapshot) {
      return;
    }
    this.setRosterDriveStatusFromSnapshot(uuid, snapshot);
  }

  setRosterDriveStatusFromSnapshot(uuid, gdrive) {
    if (!gdrive) {
      this.setRosterDriveStatus(uuid, 'idle', DRIVE_STATUS_MESSAGES.idle);
      return;
    }
    this.clearDriveRequestTimers(uuid);
    if (gdrive.state === 2) {
      this.setRosterDriveStatus(uuid, 'done', DRIVE_STATUS_MESSAGES.done);
      return;
    }
    if (typeof gdrive.rec === 'number' && gdrive.rec > 0) {
      const percent = Math.min(100, Math.round((gdrive.up / Math.max(1, gdrive.rec)) * 100));
      this.setRosterDriveStatus(uuid, 'uploading', `Drive upload ${percent}%`);
    } else {
      this.setRosterDriveStatus(uuid, 'pending', DRIVE_STATUS_MESSAGES.pending);
    }
  }

  handleDriveProgressEvent(event) {
    const detail = event?.detail;
    if (!detail || !detail.UUID) {
      return;
    }
    const { UUID: uuid, gdrive } = detail;
    this.driveProgressSnapshots.set(uuid, gdrive || null);
    if (!this.rosterDriveStatuses.has(uuid)) {
      return;
    }
    this.setRosterDriveStatusFromSnapshot(uuid, gdrive || null);
    this.updateDriveActionAvailability(uuid);
    this.updateReadinessSummary();
    this.refreshRecordingStatusLive();
  }

  handleRemoteRecorderStatusEvent(event) {
    const detail = event?.detail;
    if (!detail || !detail.UUID) {
      return;
    }
    const { UUID: uuid, recorder, screen } = detail;
    if (screen || !this.rosterDriveStatuses.has(uuid)) {
      return;
    }
    const legacyDriveButton = this.findLegacyDriveButton(uuid);
    const hasWatchdog = this.driveRequestTimers.has(uuid);
    const drivePressed = Boolean(legacyDriveButton?.classList?.contains('pressed'));
    const currentState = this.rosterDriveStatuses.get(uuid)?.dataset?.state || 'idle';
    const driveStateActive = currentState === 'pending' || currentState === 'uploading';
    if (!hasWatchdog && !drivePressed && !driveStateActive) {
      // Ignore generic remote-recorder updates unless Drive was actually requested/active.
      return;
    }
    const code = parseInt(recorder, 10);
    if (!Number.isFinite(code)) {
      return;
    }
    this.driveRecorderStates.set(uuid, { code, at: Date.now() });
    if (code >= 0) {
      if (!this.driveProgressSnapshots.get(uuid)) {
        const minutes = Math.floor(code / 60);
        const seconds = Math.max(0, code - minutes * 60).toString().padStart(2, '0');
        this.setRosterDriveStatus(uuid, 'pending', `Guest recording ${minutes}m ${seconds}s… waiting for Drive stats`);
      }
      this.updateDriveActionAvailability(uuid);
      return;
    }
    if (code === -5) {
      this.setRosterDriveStatus(uuid, 'pending', 'Guest recorder started with experimental browser support.');
    } else if (code === -4) {
      this.setRosterDriveStatus(uuid, 'error', 'Guest recording stopped unexpectedly.');
    } else if (code === -3) {
      this.setRosterDriveStatus(uuid, 'error', 'Guest browser cannot record/upload to Drive.');
    } else if (code === -2) {
      this.setRosterDriveStatus(uuid, 'pending', 'Guest recorder stopping…');
    } else if (code === -1) {
      const snapshot = this.driveProgressSnapshots.get(uuid);
      if (snapshot) {
        this.setRosterDriveStatusFromSnapshot(uuid, snapshot);
      } else if (hasWatchdog || drivePressed || driveStateActive) {
        this.setRosterDriveStatus(uuid, 'error', 'Guest recorder stopped before Drive upload telemetry started.');
      } else {
        this.setRosterDriveStatus(uuid, 'idle', DRIVE_STATUS_MESSAGES.idle);
      }
    }
    this.updateDriveActionAvailability(uuid);
    this.updateReadinessSummary();
    this.refreshRecordingStatusLive();
  }

  ensureRemoteOverlay() {
    if (this.remoteOverlay && this.remoteOverlayContent) {
      return this.remoteOverlay;
    }
    const overlay = createElement('div', 'remote-overlay');
    overlay.dataset.podcastOverlay = 'true';
    overlay.dataset.visible = 'false';

    const panel = createElement('div', 'remote-overlay__panel');
    const header = createElement('div', 'remote-overlay__header');
    const title = createElement('h3', 'remote-overlay__title', { text: 'Remote controls' });
    const closeButton = createElement('button', 'remote-overlay__close', { type: 'button', text: 'Close', title: 'Close remote controls.' });
    closeButton.addEventListener('click', () => this.closeRemoteOverlay());
    header.append(title, closeButton);

    const body = createElement('div', 'remote-overlay__body');
    panel.append(header, body);
    overlay.append(panel);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        this.closeRemoteOverlay();
      }
    });

    document.body.appendChild(overlay);
    this.remoteOverlay = overlay;
    this.remoteOverlayContent = body;
    return overlay;
  }

  restoreRemoteControls() {
    const state = this.remoteControlState;
    if (!state || !state.element) {
      if (this.remoteOverlay) {
        delete this.remoteOverlay.dataset.activeUuid;
      }
      return;
    }
    const { element, placeholder, wrapper } = state;
    try {
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    } catch (error) {
      console.warn('Failed to remove remote controls wrapper', error);
    }
    if (placeholder && placeholder.parentNode) {
      try {
        placeholder.parentNode.insertBefore(element, placeholder);
        placeholder.parentNode.removeChild(placeholder);
      } catch (error) {
        console.warn('Failed to restore remote controls container', error);
      }
    }
    this.remoteControlState = {
      activeUuid: null,
      element: null,
      placeholder: null,
      wrapper: null,
    };
    if (this.remoteOverlay) {
      delete this.remoteOverlay.dataset.activeUuid;
    }
  }

  openRemoteControls(uuid) {
    if (!uuid) {
      return;
    }
    if (this.remoteControlState?.activeUuid && this.remoteControlState.activeUuid !== uuid) {
      this.restoreRemoteControls();
    }
    const overlay = this.ensureRemoteOverlay();
    const body = this.remoteOverlayContent;
    if (!overlay || !body) {
      return;
    }
    body.innerHTML = '';

    const rosterNode = this.rosterItems.get(uuid);
    let label = '';
    if (rosterNode) {
      const nameNode = rosterNode.querySelector('.roster-name');
      label = nameNode ? nameNode.textContent : '';
    }
    const headerTitle = overlay.querySelector('.remote-overlay__title');
    if (headerTitle) {
      headerTitle.textContent = label ? `Remote controls • ${label}` : 'Remote controls';
    }

    const existingState = this.remoteControlState || {};
    if (existingState.activeUuid && existingState.activeUuid === uuid && existingState.wrapper) {
      body.append(existingState.wrapper);
      overlay.dataset.visible = 'true';
      overlay.dataset.activeUuid = uuid;
      return;
    }

    const source = document.getElementById(`container_${uuid}`);
    if (!source) {
      body.append(
        createElement('div', 'remote-overlay__empty', {
          text: 'Legacy director controls are still loading. Try again once the guest is fully connected.',
        }),
      );
      overlay.dataset.visible = 'true';
      overlay.dataset.activeUuid = uuid;
      return;
    }

    const placeholder = document.createElement('div');
    placeholder.dataset.podcastPlaceholder = 'remote-controls';
    source.parentNode?.insertBefore(placeholder, source);

    source.classList.remove('hidden');

    const wrapper = createElement('div', 'remote-overlay__legacy');
    wrapper.dataset.uuid = uuid;
    wrapper.append(source);
    body.append(wrapper);

    this.remoteControlState = {
      activeUuid: uuid,
      element: source,
      placeholder,
      wrapper,
    };

    overlay.dataset.visible = 'true';
    overlay.dataset.activeUuid = uuid;
  }

  closeRemoteOverlay() {
    if (!this.remoteOverlay) {
      return;
    }
    this.restoreRemoteControls();
    this.remoteOverlay.dataset.visible = 'false';
    if (this.remoteOverlayContent) {
      this.remoteOverlayContent.innerHTML = '';
    }
  }

  openHelpModal() {
    if (this.helpOverlay) {
      this.helpOverlay.dataset.visible = 'true';
      return;
    }

    const overlay = createElement('div', 'help-overlay');
    overlay.dataset.visible = 'true';
    overlay.dataset.podcastOverlay = 'true'; // Prevent CSS from hiding it
    this.helpOverlay = overlay;

    const panel = createElement('div', 'help-overlay__panel');

    const header = createElement('div', 'help-overlay__header');
    const title = createElement('h2', 'help-overlay__title', { text: 'Podcast Studio Guide' });
    const closeButton = createElement('button', 'help-overlay__close', { type: 'button', text: '✕', title: 'Close' });
    closeButton.addEventListener('click', () => this.closeHelpModal());
    header.append(title, closeButton);

    const content = createElement('div', 'help-overlay__content');

    const sections = [
      {
        title: 'Getting Started',
        content: `
          <p>The Podcast Studio is a specialized interface for recording multi-track audio from remote guests.</p>
          <ul>
            <li><strong>Create a room</strong> — Enter a room name and optional password</li>
            <li><strong>Share the invite link</strong> — Guests join via the generated link</li>
            <li><strong>Review Capture / Backup / Save</strong> — The summary card tells you what is being captured, whether live guest backup is active, and where files save after stop</li>
            <li><strong>Start Recording</strong> — Each guest's audio is captured as a separate WAV file, or audio + video if you enable the experimental capture mode</li>
          </ul>
          <p>All audio is recorded locally in your browser — nothing is uploaded unless you link cloud storage.</p>
        `,
      },
      {
        title: 'Session Markers',
        content: `
          <p>Markers are cue points you can drop during recording to mark important moments.</p>
          <ul>
            <li><strong>Manual markers</strong> — Click "Marker" to drop a cue at the current time</li>
            <li><strong>Auto sync markers</strong> — Dropped automatically ~1 second into recording for alignment</li>
            <li><strong>Join sync markers</strong> — Created when a guest joins mid-recording</li>
          </ul>
          <p><strong>WAV cue points:</strong> Markers are embedded directly in the WAV files as standard cue chunks. Compatible with:</p>
          <ul>
            <li>Adobe Audition, Audacity, Reaper, Pro Tools</li>
            <li>Most DAWs that support WAV cue/region markers</li>
          </ul>
          <p><strong>CSV export:</strong> Use "Export CSV" or "Copy CSV" to get markers in spreadsheet format for reference or importing into editors that don't read WAV cues.</p>
        `,
      },
      {
        title: 'Late Joiners & Reconnects',
        content: `
          <p>If a guest joins or reconnects while recording is in progress:</p>
          <ul>
            <li>Their audio is automatically added to the recording</li>
            <li>A sync marker is dropped ~1 second after they join</li>
            <li>Their track appears in the timeline with a "Late join" badge</li>
          </ul>
          <p><strong>Syncing in post:</strong> Each track's markers are adjusted relative to when that track started. Use the shared sync markers to align tracks in your editor.</p>
          <p>Experimental video ISO capture keeps the same late-join offsets, but longer runs will use much more memory than audio-only sessions.</p>
        `,
      },
      {
        title: 'Cloud Backup',
        content: `
          <p>Link Google Drive or Dropbox to save host-side recordings after the session ends.</p>
          <p><strong>Google Drive:</strong></p>
          <ul>
            <li>Uploads complete files after recording stops</li>
            <li>Files appear in a "VDO.Ninja Recordings" folder</li>
          </ul>
          <p><strong>Dropbox:</strong></p>
          <ul>
            <li>Supports chunked uploads for large files</li>
            <li>More reliable for longer recordings</li>
            <li>Can paste a token manually if popup is blocked</li>
          </ul>
          <p><strong>Guest backup:</strong> The "Enable guest backup" control asks every connected guest to self-record directly into your Google Drive. A guest only counts as backed up after they confirm the browser prompt.</p>
          <p>Both services are optional — recordings are always available for local download.</p>
        `,
      },
      {
        title: 'Video Recording',
        content: `
          <p>The studio focuses on audio ISO recording, but video options exist:</p>
          <ul>
            <li><strong>Audio + Video ISO</strong> - Add <code>?studiovideo=1</code> to the studio URL to expose the experimental capture mode in the destinations card</li>
            <li><strong>Record Group</strong> - Opens a popup with the combined scene for screen recording</li>
            <li><strong>Individual video workflow</strong> - <a href="https://www.youtube.com/watch?v=s5shpEqLZbM" target="_blank" rel="noopener">See video guide ↗</a></li>
          </ul>
          <p>The studio video ISO mode is still memory-heavy because files finalize after stop. For the most resilient long-form runs, guests can still use <code>&record</code> in their URL or the remote recording features in the classic VDO.Ninja interface.</p>
        `,
      },
      {
        title: 'Recording Model',
        content: `
          <p>The studio now separates recording into three questions:</p>
          <ul>
            <li><strong>Capture</strong> - Audio ISO by default, or experimental Audio + Video ISO with <code>?studiovideo=1</code></li>
            <li><strong>Backup</strong> - "Enable guest backup" requests guest-side self-recording directly into your Google Drive</li>
            <li><strong>Save</strong> - Host-side downloads and cloud uploads still finalize after recording stops</li>
          </ul>
          <p><strong>Important:</strong> A linked destination is not the same as a live backup. The summary warning stays yellow until guest backups are actually confirmed.</p>
        `,
      },
      {
        title: 'Live Captions',
        content: `
          <p>VDO.Ninja supports real-time speech-to-text captions:</p>
          <ul>
            <li><strong>Enable captions</strong> — Add <code>&transcribe</code> to a guest's URL to enable browser-based speech recognition</li>
            <li><strong>Display captions</strong> — Use <code>&showcc</code> on the viewer/scene URL to display incoming captions</li>
            <li><strong>Overlay in OBS</strong> — Captions can be displayed as a text overlay in your stream</li>
          </ul>
          <p>Captions are processed locally in the browser using the Web Speech API — no third-party services required.</p>
        `,
      },
      {
        title: 'Tips & Troubleshooting',
        content: `
          <ul>
            <li><strong>No audio?</strong> — Ensure guests have granted microphone permission</li>
            <li><strong>Tracks missing?</strong> — Check that guests joined before hitting Record, or they'll appear as late joiners</li>
            <li><strong>Large files?</strong> — Use Dropbox for chunked uploads, or download locally</li>
            <li><strong>Browser support:</strong> — Chrome/Edge recommended. Firefox/Safari may have limitations</li>
          </ul>
        `,
      },
    ];

    sections.forEach((section) => {
      const item = createElement('details', 'help-section');
      const summary = createElement('summary', 'help-section__title', { text: section.title });
      const body = createElement('div', 'help-section__body');
      body.innerHTML = section.content;
      item.append(summary, body);
      content.append(item);
    });

    // Open first section by default
    const firstSection = content.querySelector('details');
    if (firstSection) {
      firstSection.open = true;
    }

    panel.append(header, content);
    overlay.append(panel);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        this.closeHelpModal();
      }
    });

    document.body.appendChild(overlay);
  }

  closeHelpModal() {
    if (this.helpOverlay) {
      this.helpOverlay.dataset.visible = 'false';
    }
  }

  describeParticipantRole(participant) {
    if (!participant) {
      return '';
    }
    if (participant.role === 'host-mic') {
      return 'Local recording input';
    }
    return '';
  }

  applyMeterValue(uuid, value) {
    const percent = Math.min(100, Math.max(0, value));
    this.meterValues.set(uuid, percent);
    const meter = this.rosterList.querySelector(`[data-meter="${uuid}"] .meter-bar-fill`);
    if (meter) {
      meter.style.width = `${percent}%`;
    }
  }

  updateMeterFromBus(payload) {
    if (!payload?.uuid) {
      return;
    }
    const peak = payload.peak || 0;
    const level = Math.min(100, Math.round(peak * 120));
    this.applyMeterValue(payload.uuid, level);
    this.updateTrackLevelVisual(payload.uuid, level);
  }

  updateCloudFooter() {
    if (this.driveStatusNode) {
      const driveText = this.cloud?.hasDriveAccess()
        ? 'Google Drive linked'
        : 'Drive link pending';
      this.driveStatusNode.textContent = driveText;
    }
    if (this.dropboxStatusNode) {
      const dropboxText = this.cloud?.hasDropboxAccess()
        ? 'Dropbox linked'
        : 'Dropbox link pending';
      this.dropboxStatusNode.textContent = dropboxText;
    }
    this.refreshUploadProgress('dropbox');
    this.updateCloudLinkUI();
    this.updateReadinessSummary();
  }

  updateReadinessSummary() {
    const driveActive = Boolean(this.cloud?.hasDriveAccess());
    const dropboxActive = Boolean(this.cloud?.hasDropboxAccess());
    const diskMeta = readDiskRecordingState();
    const diskReady = Boolean(STUDIO_DISK_FEATURE_FLAG && diskMeta.enabled && diskMeta.folderName);
    const guestBackup = this.getGuestBackupSnapshot();
    const icecastLive = Boolean(this.icecastPublisher?.isLive());
    if (this.isoSummary) {
      this.isoSummary.style.display = (driveActive || dropboxActive || diskReady || icecastLive) ? '' : 'none';
    }
    this.updateDestinationLights(driveActive, dropboxActive, diskReady, diskMeta, guestBackup);

    if (this.captureSummaryNode) {
      this.captureSummaryNode.textContent = `Capture: ${this.describeCaptureMode(this.currentRecordingMode)}`;
    }
    if (this.backupSummaryNode) {
      if (!guestBackup.total) {
        this.backupSummaryNode.textContent = 'Backup: No guests connected';
      } else if (!guestBackup.requested) {
        this.backupSummaryNode.textContent = 'Backup: None';
      } else {
        this.backupSummaryNode.textContent = `Backup: Guest backup ${guestBackup.confirmed}/${guestBackup.total} confirmed`;
      }
    }
    if (this.saveSummaryNode) {
      this.saveSummaryNode.textContent = `Save: ${this.describeSaveTargetSummary()}`;
    }
    if (this.summaryWarningNode) {
      let warningText = 'No live backup active. Host capture stays buffered until stop.';
      let warningState = '';
      if (!guestBackup.total) {
        warningText = 'No guests connected yet. Host capture stays buffered until stop.';
        warningState = 'pending';
      } else if (guestBackup.confirmed === guestBackup.total && guestBackup.total > 0) {
        warningText = 'Live guest backup active for all connected guests.';
        warningState = 'ready';
      } else if (guestBackup.requested) {
        warningText = `Live guest backup confirmed for ${guestBackup.confirmed}/${guestBackup.total}. Unconfirmed guests are not backed up yet.`;
      }
      this.summaryWarningNode.textContent = warningText;
      if (warningState) {
        this.summaryWarningNode.dataset.state = warningState;
      } else if (this.summaryWarningNode.dataset) {
        delete this.summaryWarningNode.dataset.state;
      }
    }
    if (this.cloudSummaryNode) {
      const afterSessionTargets = [];
      if (diskReady) {
        afterSessionTargets.push(`Local folder (${diskMeta.folderName})`);
      }
      if (driveActive) {
        afterSessionTargets.push('Drive');
      }
      if (dropboxActive) {
        afterSessionTargets.push('Dropbox');
      }
      if (icecastLive) {
        afterSessionTargets.push('Icecast live');
      }
      this.cloudSummaryNode.textContent = afterSessionTargets.length
        ? `Outputs: ${afterSessionTargets.join(' • ')}`
        : 'After-session save: Browser buffer only';
      this.cloudSummaryNode.dataset.state = afterSessionTargets.length ? 'ready' : 'pending';
    }
    this.updateGuestBackupControls();
  }

  updateDestinationLights(driveActive, dropboxActive, diskReady, diskMeta, guestBackup) {
    const setLight = (key, state, statusText) => {
      const light = this.destinationLights[key];
      if (!light) return;
      light.el.dataset.state = state;
      if (light.status) light.status.textContent = statusText || '';
    };

    setLight('download', 'green', 'Always on');

    setLight('dropbox', dropboxActive ? 'green' : 'gray',
      dropboxActive ? 'After recording' : 'Not connected');

    // Drive = guest direct upload path
    if (!driveActive) {
      setLight('drive', 'gray', 'Not connected');
    } else if (!guestBackup.total) {
      setLight('drive', 'yellow', 'Connected — no guests');
    } else if (!guestBackup.requested) {
      setLight('drive', 'yellow', 'Connected — not enabled');
    } else if (guestBackup.confirmed === guestBackup.total) {
      setLight('drive', 'green', `${guestBackup.confirmed}/${guestBackup.total} recording`);
    } else {
      setLight('drive', 'yellow', `${guestBackup.confirmed}/${guestBackup.total} confirmed`);
    }

    if (STUDIO_DISK_FEATURE_FLAG) {
      if (diskReady) {
        setLight('disk', 'green', diskMeta.folderName || 'Ready');
      } else if (diskMeta.enabled) {
        setLight('disk', 'yellow', 'No folder');
      } else {
        setLight('disk', 'gray', 'Not set up');
      }
    }
  }

  formatFileSize(bytes) {
    if (!bytes && bytes !== 0) {
      return '';
    }
    const thresh = 1024;
    if (bytes < thresh) {
      return `${bytes} B`;
    }
    const units = ['KB', 'MB', 'GB', 'TB'];
    let unitIndex = -1;
    let value = bytes;
    do {
      value /= thresh;
      unitIndex += 1;
    } while (value >= thresh && unitIndex < units.length - 1);
    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }

  describeTrackMeta(meta) {
    const parts = [];
    if (meta?.mimeType) {
      parts.push(meta.mimeType.toUpperCase());
    }
    if (meta?.size) {
      parts.push(this.formatFileSize(meta.size));
    }
    if (meta?.durationSeconds) {
      parts.push(`${meta.durationSeconds.toFixed(1)}s`);
    }
    return parts.join(' • ');
  }

  describeService(service) {
    if (service === 'drive') {
      return 'Drive';
    }
    if (service === 'dropbox') {
      return 'Dropbox';
    }
    if (service === 'local') {
      return 'Local disk';
    }
    return service || 'Service';
  }

  normalizeUploadStatus(service, status) {
    if (service === 'drive' && status === 'uploaded') {
      // Legacy Drive flows finalize asynchronously after blob handoff.
      return 'queued';
    }
    return status || 'unknown';
  }

  isDiskDestinationReady() {
    if (!STUDIO_DISK_FEATURE_FLAG) {
      return false;
    }
    const meta = readDiskRecordingState();
    return Boolean(meta.enabled && meta.folderName);
  }

  createServiceStatusLine(service) {
    const line = createElement('div', 'upload-status-line');
    line.dataset.service = service;
    const ready =
      service === 'drive'
        ? this.cloud?.hasDriveAccess()
        : service === 'dropbox'
          ? this.cloud?.hasDropboxAccess()
          : service === 'local'
            ? this.isDiskDestinationReady()
          : false;
    const hint = ready
      ? service === 'local'
        ? 'armed'
        : 'ready'
      : service === 'local'
        ? 'not armed'
        : 'link to upload';
    line.textContent = `${this.describeService(service)}: ${hint}`;
    if (service === 'local') {
      line.title = ready
        ? 'Files will be written into the armed local folder after recording stops.'
        : 'Arm local disk recording above to write files directly into the selected folder.';
    } else {
      line.title = ready
        ? `${this.describeService(service)} is linked; uploads will start when queued.`
        : `Link ${this.describeService(service)} above to enable uploads.`;
    }
    return line;
  }

  setUploadProgressPending(pending) {
    ['drive', 'dropbox'].forEach((service) => {
      const node = this.cloudProgressNodes?.[service];
      if (!node) {
        return;
      }
      if (pending) {
        node.dataset.state = 'pending';
        node.textContent = `${this.describeService(service)} uploads pending (recording in progress)`;
      } else if (!this.uploadTrackers?.[service]?.size) {
        node.dataset.state = 'idle';
        node.textContent = `${this.describeService(service)} uploads idle`;
      }
    });
  }

  registerUploadTask(service, meta) {
    if (!service || !this.uploadTrackers?.[service]) {
      return null;
    }
    const tracker = this.uploadTrackers[service];
    const key = `${service}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const bytesTotal = meta?.blob?.size || 0;
    tracker.set(key, {
      key,
      label: meta?.participant?.label || meta?.filename || 'Track',
      bytesUploaded: 0,
      bytesTotal,
      status: 'pending',
      startedAt: Date.now(),
    });
    this.refreshUploadProgress(service);
    return key;
  }

  updateUploadTask(service, key, { uploaded, total, status } = {}) {
    if (!service || !key || !this.uploadTrackers?.[service]) {
      return;
    }
    const tracker = this.uploadTrackers[service];
    const entry = tracker.get(key);
    if (!entry) {
      return;
    }
    if (typeof uploaded === 'number') {
      entry.bytesUploaded = uploaded;
    }
    if (typeof total === 'number' && total >= 0) {
      entry.bytesTotal = total;
    }
    if (status) {
      entry.status = status;
    }
    this.refreshUploadProgress(service);
  }

  finalizeUploadTask(service, key, status = 'uploaded') {
    if (!service || !key || !this.uploadTrackers?.[service]) {
      return;
    }
    const tracker = this.uploadTrackers[service];
    const entry = tracker.get(key);
    if (!entry) {
      return;
    }
    entry.status = status;
    if (!entry.bytesTotal) {
      entry.bytesTotal = entry.bytesUploaded;
    }
    tracker.set(key, entry);
    this.refreshUploadProgress(service);
    const ttl = status === 'error'
      ? UPLOAD_TRACKER_COOLDOWN_MS * 2
      : status === 'queued'
        ? UPLOAD_TRACKER_COOLDOWN_MS * 4
        : UPLOAD_TRACKER_COOLDOWN_MS;
    setTimeout(() => {
      const current = tracker.get(key);
      if (current && current.status === status) {
        tracker.delete(key);
        this.refreshUploadProgress(service);
      }
    }, ttl);
  }

  refreshUploadProgress(service) {
    const node = this.cloudProgressNodes?.[service];
    const tracker = this.uploadTrackers?.[service];
    if (!node || !tracker) {
      return;
    }
    if (!tracker.size) {
      node.textContent = `${this.describeService(service)} uploads idle`;
      node.dataset.state = 'idle';
      return;
    }
    const entries = Array.from(tracker.values());
    const errors = entries.filter((entry) => entry.status === 'error');
    const active = entries.filter((entry) => entry.status === 'pending' || entry.status === 'uploading');
    const queued = entries.filter((entry) => entry.status === 'queued');
    const completed = entries.filter((entry) => entry.status === 'uploaded');
    const skipped = entries.filter((entry) => entry.status === 'skipped');
    const uploadedBytes = entries.reduce((total, entry) => total + Math.min(entry.bytesUploaded || 0, entry.bytesTotal || entry.bytesUploaded || 0), 0);
    const totalBytes = entries.reduce((total, entry) => total + (entry.bytesTotal || entry.bytesUploaded || 0), 0);
    const percentage = totalBytes ? Math.min(100, Math.round((uploadedBytes / totalBytes) * 100)) : 0;
    if (errors.length) {
      node.textContent = `${this.describeService(service)} upload error (${errors.length})`;
      node.dataset.state = 'error';
      return;
    }
    if (active.length) {
      node.textContent = `${this.describeService(service)} uploading ${active.length} file${active.length === 1 ? '' : 's'} • ${percentage}%`;
      node.dataset.state = 'uploading';
      return;
    }
    if (queued.length) {
      node.textContent = `${this.describeService(service)} queued ${queued.length} file${queued.length === 1 ? '' : 's'} • finalizing`;
      node.dataset.state = 'pending';
      return;
    }
    if (completed.length || skipped.length) {
      node.textContent = `${this.describeService(service)} uploads complete`;
      node.dataset.state = 'complete';
      return;
    }
    node.textContent = `${this.describeService(service)} uploads idle`;
    node.dataset.state = 'idle';
  }

  applyUploadResult(element, result) {
    if (!element || !result) {
      return;
    }
    const service = result.service || element.dataset.service;
    const label = this.describeService(service);
    const normalizedStatus = this.normalizeUploadStatus(service, result.status);
    element.dataset.status = normalizedStatus;
    if (normalizedStatus === 'queued') {
      const sizeText = result.bytes ? ` (${this.formatFileSize(result.bytes)})` : '';
      element.textContent = `${label}: queued${sizeText}`;
    } else if (normalizedStatus === 'uploaded') {
      const sizeText = result.bytes ? ` (${this.formatFileSize(result.bytes)})` : '';
      element.textContent = `${label}: uploaded${sizeText}`;
    } else if (normalizedStatus === 'skipped') {
      element.textContent = `${label}: ${result.reason || 'skipped'}`;
    } else if (normalizedStatus === 'error') {
      const message = result.error?.message || result.error?.toString() || 'failed';
      element.textContent = `${label}: ${message}`;
      element.dataset.status = 'error';
    } else {
      element.textContent = `${label}: ${normalizedStatus}`;
    }
  }

  sanitizeDiskFilename(filename, fallbackExt = 'wav') {
    const fallback = `podcast-track-${Date.now()}.${fallbackExt}`;
    const input = (filename || fallback).toString();
    const safe = input
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^-+|-+$/g, '');
    return safe || fallback;
  }

  async saveBlobToArmedDisk(blob, filename) {
    if (!blob) {
      throw new Error('No recording blob available for disk write.');
    }
    const verify = await verifyStoredDiskRecordingDirectory({ requestPermission: false });
    if (!verify.ok) {
      throw new Error(verify.message || 'Disk folder is not accessible.');
    }
    const directoryHandle = await readDiskDirectoryHandle();
    if (!directoryHandle) {
      throw new Error('No local disk folder is selected.');
    }
    const guessedExt = blob.type && blob.type.includes('/')
      ? (blob.type.split('/')[1] || 'bin').split(';')[0]
      : 'bin';
    const safeFilename = this.sanitizeDiskFilename(filename, guessedExt);
    const fileHandle = await directoryHandle.getFileHandle(safeFilename, { create: true });
    const writable = await fileHandle.createWritable();
    try {
      await writable.write(blob);
      await writable.close();
    } catch (error) {
      try {
        await writable.abort();
      } catch (abortError) {
        console.warn('Unable to abort disk writer after failure', abortError);
      }
      throw error;
    }
    return {
      filename: safeFilename,
      bytes: blob.size || 0,
      folderName: verify.folderName || readDiskRecordingState().folderName || null,
    };
  }

  async queueLocalDiskWrite(meta, localElement) {
    if (!localElement) {
      return { status: 'skipped', service: 'local', reason: 'not-visible' };
    }
    if (!meta?.blob) {
      localElement.dataset.status = 'error';
      localElement.textContent = 'Local disk: missing file data';
      return { status: 'error', service: 'local', error: new Error('Missing recording blob') };
    }
    if (!this.isDiskDestinationReady()) {
      localElement.dataset.status = 'skipped';
      localElement.textContent = 'Local folder: not configured (download only)';
      return { status: 'skipped', service: 'local', reason: 'not-armed' };
    }
    localElement.dataset.status = 'pending';
    localElement.textContent = 'Local disk: writing…';
    try {
      const saved = await this.saveBlobToArmedDisk(meta.blob, meta.filename);
      localElement.dataset.status = 'uploaded';
      const sizeText = saved.bytes ? ` (${this.formatFileSize(saved.bytes)})` : '';
      localElement.textContent = `Local disk: saved${sizeText}`;
      localElement.title = saved.folderName
        ? `Saved to local folder: ${saved.folderName}`
        : 'Saved to the armed local folder.';
      return { status: 'uploaded', service: 'local', ...saved };
    } catch (error) {
      console.error('Failed writing recording to local disk', error);
      localElement.dataset.status = 'error';
      localElement.textContent = `Local disk: ${error?.message || 'write failed'}`;
      localElement.title = 'Local disk write failed.';
      return { status: 'error', service: 'local', error };
    }
  }

  async queueDropboxUpload(meta, dropboxLine) {
    if (!this.cloud || !meta?.blob) {
      if (dropboxLine) dropboxLine.textContent = 'Dropbox: unavailable';
      return;
    }
    let canDropbox = Boolean(this.cloud?.hasDropboxAccess());
    if (!canDropbox) {
      try {
        const client = await this.cloud.ensureDropboxClient();
        canDropbox = Boolean(client);
      } catch (error) {
        console.warn('Dropbox client unavailable', error);
      }
    }
    if (dropboxLine) {
      dropboxLine.textContent = `${this.describeService('dropbox')}: ${canDropbox ? 'preparing upload…' : 'not connected'}`;
      dropboxLine.dataset.status = canDropbox ? 'pending' : 'idle';
    }
    if (!canDropbox) return;

    const uploadKey = this.registerUploadTask('dropbox', meta);
    try {
      const results = await this.cloud.uploadBlob(meta.blob, {
        filename: meta.filename,
        drive: false,
        dropbox: true,
        onProgress: (progress) => {
          if (progress?.service === 'dropbox' && dropboxLine) {
            dropboxLine.textContent = `${this.describeService('dropbox')}: ${progress.percentage || 0}%`;
            if (uploadKey) {
              this.updateUploadTask('dropbox', uploadKey, {
                uploaded: progress.uploaded,
                total: progress.total,
                status: 'uploading',
              });
            }
          }
        },
        signal: this.abortUploadsController?.signal,
      });
      this.applyUploadResult(dropboxLine, results.dropbox);
      if (uploadKey) {
        const status = this.normalizeUploadStatus('dropbox', results.dropbox?.status || 'unknown');
        this.finalizeUploadTask('dropbox', uploadKey, status);
      }
    } catch (error) {
      console.error('Dropbox upload failed', error);
      if (dropboxLine) {
        dropboxLine.textContent = 'Dropbox: upload failed';
        dropboxLine.dataset.status = 'error';
      }
      if (uploadKey) {
        this.finalizeUploadTask('dropbox', uploadKey, 'error');
      }
    } finally {
      this.updateCloudFooter();
    }
  }

  cleanupDownloadUrls() {
    if (!this.activeDownloadUrls || !this.activeDownloadUrls.length) {
      return;
    }
    this.activeDownloadUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Failed to revoke object URL', error);
      }
    });
    this.activeDownloadUrls = [];
  }

  dispose() {
    this.driveRequestTimers.forEach((_timers, uuid) => {
      this.clearDriveRequestTimers(uuid);
    });
    this.stopRecordingStatusTimer();
    if (this.rosterTimer) {
      clearInterval(this.rosterTimer);
      this.rosterTimer = null;
    }
    if (this.diskStateListener) {
      window.removeEventListener(PODCAST_DISK_EVENT, this.diskStateListener);
      this.diskStateListener = null;
    }
    if (this.cloudStateListener) {
      window.removeEventListener(PODCAST_CLOUD_EVENT, this.cloudStateListener);
      this.cloudStateListener = null;
    }
    if (this.boundDriveProgressHandler) {
      window.removeEventListener(DRIVE_PROGRESS_EVENT, this.boundDriveProgressHandler);
      this.boundDriveProgressHandler = null;
    }
    if (this.boundRemoteRecorderHandler) {
      window.removeEventListener(REMOTE_RECORDER_EVENT, this.boundRemoteRecorderHandler);
      this.boundRemoteRecorderHandler = null;
    }
    if (this.levelOff) {
      this.levelOff();
      this.levelOff = null;
    }
    if (this.abortUploadsController) {
      this.abortUploadsController.abort();
      this.abortUploadsController = null;
    }
    if (this.icecastPublisher?.isLive()) {
      this.icecastPublisher.stop({ quiet: true }).catch((error) => {
        console.warn('Failed to stop Icecast publisher during dispose', error);
      });
    }
    if (this.hostMic?.active || this.virtualParticipants.size) {
      this.disableHostMic().catch((error) => {
        console.warn('Failed to disable host microphone during dispose', error);
      });
    }
    this.restoreRemoteControls();
    if (this.chatModule) {
      try {
        if (this.chatModule.dataset) {
          delete this.chatModule.dataset.podcastOverlay;
        }
        if (this.chatPlaceholder?.parentNode) {
          this.chatPlaceholder.parentNode.insertBefore(this.chatModule, this.chatPlaceholder);
          this.chatPlaceholder.parentNode.removeChild(this.chatPlaceholder);
        }
        const legacyHeader = this.chatModule.querySelector('.chat-header');
        if (legacyHeader) {
          if (legacyHeader.dataset && Object.prototype.hasOwnProperty.call(legacyHeader.dataset, 'podcastDisplay')) {
            legacyHeader.style.display = legacyHeader.dataset.podcastDisplay || '';
            delete legacyHeader.dataset.podcastDisplay;
          } else {
            legacyHeader.style.display = '';
          }
        }
        const legacyResizer = this.chatModule.querySelector('.resizer');
        if (legacyResizer) {
          if (legacyResizer.dataset && Object.prototype.hasOwnProperty.call(legacyResizer.dataset, 'podcastDisplay')) {
            legacyResizer.style.display = legacyResizer.dataset.podcastDisplay || '';
            delete legacyResizer.dataset.podcastDisplay;
          } else {
            legacyResizer.style.display = '';
          }
        }
        const popLink = this.chatModule.querySelector('#popOutChat');
        if (popLink) {
          popLink.style.display = '';
        }
        const closeLink = this.chatModule.querySelector('#closeChat');
        if (closeLink) {
          closeLink.style.display = '';
        }
        if (this.chatModule.style) {
          this.chatModule.style.position = '';
          this.chatModule.style.right = '';
          this.chatModule.style.left = '';
          this.chatModule.style.bottom = '';
          this.chatModule.style.top = '';
          this.chatModule.style.zIndex = '';
          this.chatModule.style.maxWidth = '';
          this.chatModule.style.width = '';
          this.chatModule.style.height = '';
          this.chatModule.style.maxHeight = '';
          this.chatModule.style.overflow = '';
          this.chatModule.style.margin = '';
        }
        this.chatModule.classList.add('hidden');
      } catch (error) {
        console.warn('Failed to restore chat module', error);
      }
      this.chatModule = null;
      this.chatPlaceholder = null;
    }
    this.chatPanel = null;
    this.chatCollapseButton = null;
    this.chatPopoutButton = null;
    this.chatPopoutAnchor = null;
    this.chatCollapsed = false;
    this.chatCollapsedHint = null;
    this.cleanupDownloadUrls();
    if (this.stopMeterBridge) {
      this.stopMeterBridge();
      this.stopMeterBridge = null;
    }
    if (this.inviteCopyTimer) {
      clearTimeout(this.inviteCopyTimer);
      this.inviteCopyTimer = null;
    }
    if (this.remoteOverlay && this.remoteOverlay.parentNode) {
      this.remoteOverlay.parentNode.removeChild(this.remoteOverlay);
    }
    this.remoteOverlay = null;
    this.remoteOverlayContent = null;
    this.rosterDriveButtons.clear();
    this.rosterDriveStatuses.clear();
    this.driveRecorderStates.clear();
    this.driveStatusResetTimers.forEach((timer) => clearTimeout(timer));
    this.driveStatusResetTimers.clear();
  }
}

async function bootstrap() {
  try {
    const preflight = await ensureRoomSelection();
    if (preflight?.redirect) {
      return;
    }
    const app = new PodcastStudioApp({ roomHint: preflight?.roomSlug });
    await app.init();
    window.podcastStudioApp = app;
  } catch (error) {
    console.error('Failed to initialise podcast studio', error);
  }
}

bootstrap();
