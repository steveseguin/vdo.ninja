const el = {
  countdownSeconds: document.getElementById("countdownSeconds"),
  webcamShape: document.getElementById("webcamShape"),
  webcamSize: document.getElementById("webcamSize"),
  webcamBorder: document.getElementById("webcamBorder"),
  aspectRatio: document.getElementById("aspectRatio"),
  outputResolution: document.getElementById("outputResolution"),
  recordingQuality: document.getElementById("recordingQuality"),
  recordingCodec: document.getElementById("recordingCodec"),
  outputQualityHint: document.getElementById("outputQualityHint"),
  includeWebcam: document.getElementById("includeWebcam"),
  includeMic: document.getElementById("includeMic"),
  includeSystemAudio: document.getElementById("includeSystemAudio"),
  showCropGuides: document.getElementById("showCropGuides"),
  faceCrop: document.getElementById("faceCrop"),
  faceCropInfoBtn: document.getElementById("faceCropInfoBtn"),
  faceCropHelpModal: document.getElementById("faceCropHelpModal"),
  faceCropHelpClose: document.getElementById("faceCropHelpClose"),
  faceCropStatus: document.getElementById("faceCropStatus"),
  voiceIsolation: document.getElementById("voiceIsolation"),
  autoGainControl: document.getElementById("autoGainControl"),
  noiseSuppression: document.getElementById("noiseSuppression"),
  echoCancellation: document.getElementById("echoCancellation"),
  micCompressor: document.getElementById("micCompressor"),
  bassBoost250: document.getElementById("bassBoost250"),
  autoSkipSilence: document.getElementById("autoSkipSilence"),
  autoSkipSilenceLabel: document.getElementById("autoSkipSilenceLabel"),
  autoSkipSilenceState: document.getElementById("autoSkipSilenceState"),
  silenceSeconds: document.getElementById("silenceSeconds"),
  silenceThreshold: document.getElementById("silenceThreshold"),
  silenceThresholdValue: document.getElementById("silenceThresholdValue"),
  enableTranscription: document.getElementById("enableTranscription"),
  enableTranscriptionLabel: document.getElementById("enableTranscriptionLabel"),
  enableTranscriptionState: document.getElementById("enableTranscriptionState"),
  transcriptionLang: document.getElementById("transcriptionLang"),
  cameraDevice: document.getElementById("cameraDevice"),
  micDevice: document.getElementById("micDevice"),
  refreshDevicesBtn: document.getElementById("refreshDevicesBtn"),
  deviceHint: document.getElementById("deviceHint"),
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  markerBtn: document.getElementById("markerBtn"),
  restartBtn: document.getElementById("restartBtn"),
  stopBtn: document.getElementById("stopBtn"),
  switchSourceBtn: document.getElementById("switchSourceBtn"),
  smartEditStatus: document.getElementById("smartEditStatus"),
  statusPill: document.getElementById("statusPill"),
  timerText: document.getElementById("timerText"),
  supportHint: document.getElementById("supportHint"),
  previewCanvas: document.getElementById("previewCanvas"),
  countdownOverlay: document.getElementById("countdownOverlay"),
  showScreenBtn: document.getElementById("showScreenBtn"),
  showCameraBtn: document.getElementById("showCameraBtn"),
  downloadsPanel: document.getElementById("downloadsPanel"),
  downloadList: document.getElementById("downloadList"),
  transcriptPanel: document.getElementById("transcriptPanel"),
  transcriptFeed: document.getElementById("transcriptFeed"),
  downloadTranscriptBtn: document.getElementById("downloadTranscriptBtn"),
  micLevelRow: document.getElementById("micLevelRow"),
  micLevelBar: document.getElementById("micLevelBar")
};

const ctx = el.previewCanvas.getContext("2d", { alpha: false });
const captureCanvas = document.createElement("canvas");
const captureCtx = captureCanvas.getContext("2d", { alpha: false });
configureCanvasContext(ctx);
configureCanvasContext(captureCtx);

function configureCanvasContext(context) {
  if (!context) {
    return;
  }
  context.imageSmoothingEnabled = true;
  if ("imageSmoothingQuality" in context) {
    context.imageSmoothingQuality = "high";
  }
}
const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const urlParams = new URLSearchParams(window.location.search);
const defaultDocumentTitle = document.title;

/* Mobile browser warning — getDisplayMedia is not available on iOS/Android browsers */
(function showMobileWarningIfNeeded() {
  const ua = navigator.userAgent || "";
  const isMobile = /iPad|iPhone|iPod|Android/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isMobile) {
    const warn = document.getElementById("mobileWarning");
    if (warn) warn.style.display = "block";
  }
})();
const SETTINGS_STORAGE_KEY = "vdo-screenrecorder-settings-v1";
const OUTPUT_RESOLUTION_BASE = {
  "1280x720": { w: 1280, h: 720, label: "HD 720p" },
  "1920x1080": { w: 1920, h: 1080, label: "Full HD 1080p" },
  "2560x1440": { w: 2560, h: 1440, label: "QHD 1440p" },
  "3840x2160": { w: 3840, h: 2160, label: "UHD 4K" }
};
const SOURCE_MATCH_VALUE = "source";
const ASPECT_RATIO_VALUES = ["16:9", "9:16", "1:1", SOURCE_MATCH_VALUE];

function resolveResolutionForAspect(baseKey, aspect) {
  const base = OUTPUT_RESOLUTION_BASE[baseKey] || OUTPUT_RESOLUTION_BASE["1920x1080"];
  if (aspect === "9:16") {
    return { width: base.h, height: base.w, label: base.label + " Portrait" };
  }
  if (aspect === "1:1") {
    return { width: base.h, height: base.h, label: base.label + " Square" };
  }
  return { width: base.w, height: base.h, label: base.label };
}

function resolveResolutionForSourceAspect(baseKey, sourceSize) {
  const base = OUTPUT_RESOLUTION_BASE[baseKey] || OUTPUT_RESOLUTION_BASE["1920x1080"];
  const aspect = getSizeAspectRatio(sourceSize) || 16 / 9;
  const shortEdge = base.h;
  let width;
  let height;

  if (aspect >= 1) {
    width = shortEdge * aspect;
    height = shortEdge;
  } else {
    width = shortEdge;
    height = shortEdge / aspect;
  }

  return {
    width: normalizeCanvasDimension(width),
    height: normalizeCanvasDimension(height),
    label: base.label + " Source Aspect"
  };
}

function resolveSourceResolution(sourceSize) {
  if (!sourceSize?.width || !sourceSize?.height) {
    return { ...resolveResolutionForAspect("1920x1080", "16:9"), label: "Source Size" };
  }

  return {
    width: Math.max(2, Math.round(sourceSize.width)),
    height: Math.max(2, Math.round(sourceSize.height)),
    label: "Source " + Math.round(sourceSize.width) + "x" + Math.round(sourceSize.height)
  };
}

function normalizeCanvasDimension(value) {
  const rounded = Math.max(2, Math.round(Number(value) || 2));
  return rounded % 2 === 0 ? rounded : rounded + 1;
}

function getSizeAspectRatio(size) {
  const width = Number(size?.width) || 0;
  const height = Number(size?.height) || 0;
  return width > 0 && height > 0 ? width / height : 0;
}

const RECORDING_QUALITY_PRESETS = {
  smaller: {
    label: "Smaller File",
    bitrateMultiplier: 0.78,
    minBitrate: 6_000_000,
    maxBitrate: 30_000_000,
    audioBitrate: 128_000
  },
  balanced: {
    label: "Balanced",
    bitrateMultiplier: 1,
    minBitrate: 8_000_000,
    maxBitrate: 45_000_000,
    audioBitrate: 160_000
  },
  high: {
    label: "High Detail",
    bitrateMultiplier: 1.45,
    minBitrate: 10_000_000,
    maxBitrate: 60_000_000,
    audioBitrate: 192_000
  },
  master: {
    label: "Archive / Master",
    bitrateMultiplier: 2,
    minBitrate: 12_000_000,
    maxBitrate: 85_000_000,
    audioBitrate: 256_000
  }
};
const RECORDING_CODEC_OPTIONS = {
  auto: {
    label: "Auto (Stable)",
    candidates: [
      { key: "vp8", label: "VP8 WebM", mimeType: "video/webm;codecs=vp8,opus" },
      { key: "h264", label: "H.264 MP4", mimeType: "video/mp4;codecs=avc1.640032,mp4a.40.2" },
      { key: "h264", label: "H.264 MP4", mimeType: "video/mp4;codecs=avc1.4d002a,mp4a.40.2" },
      { key: "h264", label: "H.264 MP4", mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2" },
      { key: "vp9", label: "VP9 WebM", mimeType: "video/webm;codecs=vp9,opus" },
      { key: "mp4", label: "MP4", mimeType: "video/mp4" },
      { key: "webm", label: "WebM", mimeType: "video/webm" }
    ]
  },
  vp8: {
    label: "VP8 WebM",
    candidates: [
      { key: "vp8", label: "VP8 WebM", mimeType: "video/webm;codecs=vp8,opus" },
      { key: "webm", label: "WebM", mimeType: "video/webm" }
    ]
  },
  vp9: {
    label: "VP9 WebM",
    candidates: [
      { key: "vp9", label: "VP9 WebM", mimeType: "video/webm;codecs=vp9,opus" },
      { key: "vp8", label: "VP8 WebM", mimeType: "video/webm;codecs=vp8,opus" },
      { key: "webm", label: "WebM", mimeType: "video/webm" }
    ]
  },
  h264: {
    label: "H.264 / MP4",
    candidates: [
      { key: "h264", label: "H.264 MP4", mimeType: "video/mp4;codecs=avc1.640032,mp4a.40.2" },
      { key: "h264", label: "H.264 MP4", mimeType: "video/mp4;codecs=avc1.4d002a,mp4a.40.2" },
      { key: "h264", label: "H.264 MP4", mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2" },
      { key: "mp4", label: "MP4", mimeType: "video/mp4" }
    ]
  }
};
const FACE_DETECTION_RECENT_MS = 1200;
const FACE_DETECTION_ACTIVE_INTERVAL_MS = 120;
const FACE_DETECTION_SEARCH_INTERVAL_MS = 320;
const FACE_DETECTION_MAX_FAILURES = 4;
const FACE_DETECTION_INPUT_MAX_DIMENSION = 960;
const FACE_TRACK_POSITION_DEADBAND_MIN_PX = 24;
const FACE_TRACK_POSITION_DEADBAND_MAX_PX = 52;
const FACE_TRACK_POSITION_DEADBAND_FACE_RATIO = 0.12;
const FACE_TRACK_POSITION_SOFT_ZONE_MULTIPLIER = 2.4;
const FACE_TRACK_POSITION_SOFT_ZONE_RESPONSE = 0.2;
const FACE_TRACK_SCALE_DEADBAND = 0.055;
const FACE_TRACK_SCALE_SOFT_ZONE_MULTIPLIER = 2;
const FACE_TRACK_SCALE_SOFT_ZONE_RESPONSE = 0.22;
const FACE_TRACK_COMPOSITION_Y_BIAS_WIDE = 0.028;
const FACE_TRACK_COMPOSITION_Y_BIAS_SQUARE = 0.038;
const FACE_TRACK_COMPOSITION_Y_BIAS_CIRCLE = 0.042;
const FACE_TRACK_COMPOSITION_EXTRA_RAISE_PX = 5;
const FACE_TRACK_MAX_CROP_HEIGHT_RATIO_WIDE = 0.98;
const FACE_TRACK_MAX_CROP_HEIGHT_RATIO_SQUARE = 0.95;
const FACE_TRACK_MAX_CROP_HEIGHT_RATIO_CIRCLE = 0.94;
const FACE_RENDER_POSITION_HALFLIFE_MS = 140;
const FACE_RENDER_SCALE_HALFLIFE_MS = 180;
const FACE_RENDER_SEARCH_HALFLIFE_MS = 260;
const FACE_DETECTION_KEYPOINT_LABELS = ["leftEye", "rightEye", "noseTip", "mouth", "leftTragion", "rightTragion"];
const FACE_DEBUG_ENABLED = urlParams.has("debugface") || urlParams.has("faceDebug");
const FACE_DEBUG_LOG_INTERVAL_MS = 300;
const SCREENRECORDER_BUILD_ID = "screen-audio-voice-pass-2026-03-11-0001";
const AUDIO_HEARTBEAT_WORKLET_NAME = "screenrecorder-heartbeat";
const MEDIAPIPE_TASKS_VISION_VERSION = "0.10.32";
const MEDIAPIPE_VISION_BUNDLE_URL =
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/vision_bundle.mjs`;
const MEDIAPIPE_VISION_WASM_ROOT_URL =
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/wasm`;
const MEDIAPIPE_FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";
const CHECKBOX_SETTING_IDS = [
  "includeWebcam",
  "includeMic",
  "includeSystemAudio",
  "faceCrop",
  "voiceIsolation",
  "autoGainControl",
  "noiseSuppression",
  "echoCancellation",
  "micCompressor",
  "bassBoost250",
  "autoSkipSilence",
  "enableTranscription",
  "showCropGuides"
];
const VALUE_SETTING_IDS = [
  "countdownSeconds",
  "webcamShape",
  "webcamSize",
  "webcamBorder",
  "aspectRatio",
  "outputResolution",
  "recordingQuality",
  "recordingCodec",
  "silenceSeconds",
  "silenceThreshold",
  "transcriptionLang"
];
const RECOVERY_DB_NAME = "vdo-screenrecorder-recovery";
const RECOVERY_DB_VERSION = 1;
const RECOVERY_FLUSH_INTERVAL_MS = 30000;

function openRecoveryDB() {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(RECOVERY_DB_NAME, RECOVERY_DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("chunks")) {
          db.createObjectStore("chunks", { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("sessions")) {
          db.createObjectStore("sessions", { keyPath: "id" });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

function saveSessionMeta(db, sessionId, mimeType) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction("sessions", "readwrite");
      tx.objectStore("sessions").put({ id: sessionId, mimeType, startedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (error) {
      reject(error);
    }
  });
}

function saveChunksToIDB(db, chunks) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction("chunks", "readwrite");
      const store = tx.objectStore("chunks");
      for (const chunk of chunks) {
        store.add(chunk);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (error) {
      reject(error);
    }
  });
}

function loadAllChunksFromIDB(db) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction("chunks", "readonly");
      const request = tx.objectStore("chunks").getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

function loadSessionMeta(db) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction("sessions", "readonly");
      const request = tx.objectStore("sessions").getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

function clearRecoveryDB(db) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(["chunks", "sessions"], "readwrite");
      tx.objectStore("chunks").clear();
      tx.objectStore("sessions").clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    } catch (error) {
      reject(error);
    }
  });
}

function countChunksInIDB(db) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction("chunks", "readonly");
      const request = tx.objectStore("chunks").count();
      request.onsuccess = () => resolve(request.result || 0);
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

async function flushChunksToIDB() {
  const db = state.recovery.db;
  if (!db || state.chunks.length === 0) {
    return;
  }
  const batch = state.chunks.splice(0, state.chunks.length);
  try {
    await saveChunksToIDB(db, batch);
    state.recovery.totalChunksFlushed += batch.length;
  } catch (error) {
    console.warn("Recovery flush failed, returning chunks to memory:", error);
    state.chunks.unshift(...batch);
  }
}

function startRecoveryFlush() {
  stopRecoveryFlush();
  state.recovery.flushHandle = setInterval(() => {
    state.recovery.flushPromise = (state.recovery.flushPromise || Promise.resolve())
      .then(() => flushChunksToIDB())
      .catch((error) => console.warn("Recovery flush error:", error));
  }, RECOVERY_FLUSH_INTERVAL_MS);
}

function stopRecoveryFlush() {
  if (state.recovery.flushHandle) {
    clearInterval(state.recovery.flushHandle);
    state.recovery.flushHandle = 0;
  }
}

function emergencyFlushChunks() {
  const db = state.recovery.db;
  if (!db || state.chunks.length === 0) {
    return;
  }
  try {
    const tx = db.transaction("chunks", "readwrite");
    const store = tx.objectStore("chunks");
    for (const chunk of state.chunks) {
      store.add(chunk);
    }
  } catch {
    // best-effort
  }
}

async function checkForCrashRecovery() {
  try {
    const db = await openRecoveryDB();
    const sessions = await loadSessionMeta(db);
    if (!sessions.length) {
      db.close();
      return;
    }
    const chunkCount = await countChunksInIDB(db);
    if (chunkCount === 0) {
      await clearRecoveryDB(db);
      db.close();
      return;
    }
    const session = sessions[0];
    const chunks = await loadAllChunksFromIDB(db);
    const totalSize = chunks.reduce((sum, c) => sum + (c.size || c.byteLength || 0), 0);
    showRecoveryBanner(db, chunks, session.mimeType || "video/webm", totalSize, session.startedAt);
  } catch (error) {
    console.warn("Crash recovery check failed:", error);
  }
}

function showRecoveryBanner(db, chunks, mimeType, totalSize, startedAt) {
  const previewArea = document.querySelector(".preview-area");
  if (!previewArea) {
    return;
  }

  const banner = document.createElement("div");
  banner.className = "recovery-banner";

  const sizeMb = (totalSize / (1024 * 1024)).toFixed(1);
  const timeStr = startedAt ? new Date(startedAt).toLocaleString() : "Unknown time";

  const info = document.createElement("span");
  info.textContent = `Recovered recording found (${sizeMb} MB, started ${timeStr})`;

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "btn btn-primary btn-inline";
  downloadBtn.textContent = "Download";
  downloadBtn.addEventListener("click", async () => {
    try {
      const blob = new Blob(chunks, { type: mimeType });
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const url = URL.createObjectURL(blob);
      const stamp = new Date(startedAt || Date.now()).toISOString().replace(/[:.]/g, "-");
      const a = document.createElement("a");
      a.href = url;
      a.download = `recovered-${stamp}.${ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      await clearRecoveryDB(db);
      db.close();
      banner.remove();
    } catch (error) {
      console.warn("Recovery download failed:", error);
    }
  });

  const discardBtn = document.createElement("button");
  discardBtn.className = "btn btn-muted btn-inline";
  discardBtn.textContent = "Discard";
  discardBtn.addEventListener("click", async () => {
    try {
      await clearRecoveryDB(db);
      db.close();
    } catch {}
    banner.remove();
  });

  banner.append(info, downloadBtn, discardBtn);
  previewArea.insertBefore(banner, previewArea.firstChild);
}

const isChromiumFamilyBrowser = detectChromiumFamilyBrowser();

const state = {
  phase: "idle",
  displayStream: null,
  webcamStream: null,
  micStream: null,
  audioMixContext: null,
  uiAudioContext: null,
  mixedDestination: null,
  displayAudioSourceNode: null,
  displayAudioGainNode: null,
  micSourceNode: null,
  micGainNode: null,
  mediaRecorder: null,
  outputStream: null,
  canvasTrack: null,
  chunks: [],
  renderHandle: 0,
  timerHandle: 0,
  phaseTransitionToken: 0,
  countdownRemaining: 0,
  cancelCountdown: false,
  isStopping: false,
  isRestarting: false,
  isRecordingStarting: false,
  mediaRecorderSupported: "MediaRecorder" in window,
  autoPauseActive: false,
  preparedOptions: null,
  preparedInputSignature: "",
  applyingInputChanges: false,
  pendingInputChangeApply: false,
  displayVideo: createVideoElement(),
  webcamVideo: createVideoElement(),
  displaySourceSize: {
    width: 0,
    height: 0
  },
  mimeType: "",
  previewMode: "screen",
  renderClock: {
    frameIntervalMs: 1000 / 30,
    lastFrameAt: 0,
    keepAliveSource: null,
    keepAliveGain: null,
    keepAliveProcessor: null
  },
  timing: {
    startedAt: 0,
    pausedAt: 0,
    pausedTotal: 0
  },
  overlay: {
    x: 0.72,
    y: 0.69,
    width: 320,
    height: 180,
    dragActive: false,
    dragOffsetX: 0,
    dragOffsetY: 0
  },
  faceDetector: null,
  faceDetectorModulePromise: null,
  faceDetectionToken: 0,
  faceDetectionFailureCount: 0,
  faceDetectionDisabledReason: "",
  faceDetectionLoading: false,
  faceDetectBusy: false,
  faceClock: {
    context: null,
    keepAliveSource: null,
    keepAliveGain: null,
    keepAliveProcessor: null,
    nextTickAt: 0
  },
  faceDetectionFrame: {
    canvas: null,
    context: null,
    width: 0,
    height: 0
  },
  faceDebug: {
    enabled: FACE_DEBUG_ENABLED,
    lastLogAt: 0,
    backend: "",
    trackingActive: false,
    lastMessage: "",
    lastDetectionAt: 0,
    sourceWidth: 0,
    sourceHeight: 0,
    trackSettings: null,
    lastDetection: null,
    lastAnchor: null,
    lastCrop: null,
    lastRender: null
  },
  faceTarget: {
    cx: 0.5,
    cy: 0.5,
    scale: 1,
    boxWidthRatio: 0,
    boxHeightRatio: 0,
    lastSeenAt: 0
  },
  faceRender: {
    cx: 0.5,
    cy: 0.5,
    scale: 1,
    boxWidthRatio: 0,
    boxHeightRatio: 0,
    lastStepAt: 0
  },
  micLevelMonitor: {
    context: null,
    source: null,
    analyser: null,
    buffer: null,
    raf: 0
  },
  silenceMonitor: {
    context: null,
    source: null,
    analyser: null,
    buffer: null,
    raf: 0,
    silenceSinceMs: 0,
    currentSkipStartMs: 0,
    segments: []
  },
  transcript: {
    supported: Boolean(SpeechRecognitionCtor),
    recognition: null,
    shouldRestart: false,
    active: false,
    entries: [],
    interimText: ""
  },
  markers: {
    entries: []
  },
  sessionExports: {
    transcriptText: "",
    transcriptFilename: ""
  },
  recovery: {
    db: null,
    sessionId: "",
    flushHandle: 0,
    flushPromise: null,
    totalChunksFlushed: 0
  },
  recorderConfig: {
    qualityKey: "balanced",
    qualityLabel: "Balanced",
    requestedCodec: "auto",
    requestedCodecLabel: "Auto (Stable)",
    resolvedCodec: "auto",
    resolvedCodecLabel: "Browser default",
    mimeType: "",
    videoBitsPerSecond: 0,
    audioBitsPerSecond: 0,
    fallbackCodec: false
  },
  persistedSettings: {
    cameraDeviceId: "",
    micDeviceId: "",
    previewMode: "screen"
  }
};

init();

function init() {
  console.info("[screenrecorder]", SCREENRECORDER_BUILD_ID);
  installFaceDebugHooks();
  loadSettingsFromStorage();
  wireEvents();
  applyConstraintSupport();
  applyOutputResolutionSelection({ redraw: false });
  updateOutputQualityHint();
  syncMicDependentControls();
  updateFaceCropStatus();
  updateThresholdLabel();
  setPhase("idle", "Idle");
  drawIdleSlate();
  updatePreviewModeButtons();
  renderFrame();
  drawPreviewOnlyOverlays(el.previewCanvas.width, el.previewCanvas.height);
  drawCropGuides(el.previewCanvas.width, el.previewCanvas.height);
  renderTranscriptFeed();
  toggleTranscriptPanel();
  refreshDeviceSelectors({ requestAccess: false, silent: true });
  checkForCrashRecovery();
}

function wireEvents() {
  el.startBtn.addEventListener("click", startSession);
  el.pauseBtn.addEventListener("click", togglePause);
  el.markerBtn.addEventListener("click", addMarker);
  el.restartBtn.addEventListener("click", restartTake);
  el.stopBtn.addEventListener("click", stopSession);
  el.switchSourceBtn.addEventListener("click", switchDisplaySource);
  el.downloadTranscriptBtn.addEventListener("click", downloadTranscriptFromLastSession);
  el.showScreenBtn.addEventListener("click", () => setPreviewMode("screen"));
  el.showCameraBtn.addEventListener("click", () => setPreviewMode("camera"));
  el.aspectRatio.addEventListener("change", () => {
    applyOutputResolutionSelection();
    updateOutputQualityHint();
    if (state.phase === "staged" || state.phase === "ready") {
      const preset = getOutputResolutionPreset(el.outputResolution.value);
      el.supportHint.textContent = "Output set to " + preset.label + ".";
      void handleStagedInputSelectionChange();
    }
  });
  el.outputResolution.addEventListener("change", () => {
    applyOutputResolutionSelection();
    updateOutputQualityHint();
    if (state.phase === "staged" || state.phase === "ready") {
      const preset = getOutputResolutionPreset(el.outputResolution.value);
      el.supportHint.textContent = "Output set to " + preset.label + ".";
      void handleStagedInputSelectionChange();
    }
  });
  el.showCropGuides.addEventListener("change", () => {
    renderFrame();
    publishCleanFrameForRecording();
    drawPreviewOnlyOverlays(el.previewCanvas.width, el.previewCanvas.height);
    drawCropGuides(el.previewCanvas.width, el.previewCanvas.height);
  });
  el.recordingQuality.addEventListener("change", updateOutputQualityHint);
  el.recordingCodec.addEventListener("change", updateOutputQualityHint);

  el.autoSkipSilence.addEventListener("change", updateSmartEditStatus);
  el.silenceSeconds.addEventListener("change", updateSmartEditStatus);
  el.silenceThreshold.addEventListener("input", updateThresholdLabel);
  el.enableTranscription.addEventListener("change", () => {
    toggleTranscriptPanel();
    updateSmartEditStatus();
  });
  el.includeMic.addEventListener("change", () => {
    syncMicDependentControls();
    handleStagedInputSelectionChange();
  });
  el.includeSystemAudio.addEventListener("change", () => {
    updateOutputQualityHint();
    handleStagedInputSelectionChange();
  });
  el.includeWebcam.addEventListener("change", () => {
    syncMicDependentControls();
    updateFaceCropStatus();
    handleStagedInputSelectionChange();
  });
  el.faceCrop.addEventListener("change", () => {
    updateFaceCropStatus();
    startFaceDetectionIfEnabled();
  });

  el.cameraDevice.addEventListener("change", () => {
    if (state.phase === "recording" || state.phase === "paused") {
      switchWebcamSource(el.cameraDevice.value);
    } else {
      handleStagedInputSelectionChange();
    }
  });
  el.micDevice.addEventListener("change", () => {
    if (state.phase === "recording" || state.phase === "paused") {
      switchMicSource(el.micDevice.value);
    } else {
      handleStagedInputSelectionChange();
    }
  });

  el.refreshDevicesBtn.addEventListener("click", async () => {
    await refreshDeviceSelectors({ requestAccess: true, silent: false });
  });

  el.faceCropInfoBtn.addEventListener("click", openFaceCropHelp);
  el.faceCropHelpClose.addEventListener("click", closeFaceCropHelp);
  el.faceCropHelpModal.addEventListener("click", (event) => {
    if (event.target === el.faceCropHelpModal) {
      closeFaceCropHelp();
    }
  });

  if (navigator.mediaDevices?.addEventListener) {
    navigator.mediaDevices.addEventListener("devicechange", () => {
      refreshDeviceSelectors({ requestAccess: false, silent: true });
    });
  }

  el.previewCanvas.addEventListener("pointerdown", onPointerDown);
  el.previewCanvas.addEventListener("pointermove", onPointerMove);
  el.previewCanvas.addEventListener("pointerup", onPointerUp);
  el.previewCanvas.addEventListener("pointercancel", onPointerUp);

  document.addEventListener("keydown", (event) => {
    const tag = event.target?.tagName;
    const isFormTarget = tag === "INPUT" || tag === "SELECT" || tag === "BUTTON" || tag === "TEXTAREA" || event.target?.isContentEditable;
    if (event.code === "Escape" && !el.faceCropHelpModal.classList.contains("hidden")) {
      event.preventDefault();
      closeFaceCropHelp();
      return;
    }
    if (event.code === "Space" && (state.phase === "recording" || state.phase === "paused")) {
      if (isFormTarget) {
        return;
      }
      event.preventDefault();
      togglePause();
    }
    if (event.code === "KeyM" && (state.phase === "recording" || state.phase === "paused")) {
      if (isFormTarget) {
        return;
      }
      event.preventDefault();
      addMarker();
    }
    if (event.code === "Escape" && state.phase !== "idle") {
      event.preventDefault();
      stopSession();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      emergencyFlushChunks();
    }
  });

  window.addEventListener("pagehide", () => {
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      emergencyFlushChunks();
    }
  });

  bindSettingsPersistence();
}

function createVideoElement() {
  const video = document.createElement("video");
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  return video;
}

function hasFaceDetectionSupport() {
  return typeof window.FaceDetector === "function" || canUseMediaPipeFaceDetection();
}

function canUseMediaPipeFaceDetection() {
  return Boolean(window.isSecureContext && window.WebAssembly && window.HTMLVideoElement && window.fetch);
}

function detectChromiumFamilyBrowser() {
  const brands = navigator.userAgentData?.brands;
  if (Array.isArray(brands) && brands.length) {
    const brandText = brands.map((entry) => entry?.brand || "").join(" ");
    return /Chrom(e|ium)|Microsoft Edge|Opera/i.test(brandText) && !/Firefox/i.test(brandText);
  }

  const ua = navigator.userAgent || "";
  return /(Chrome|Chromium|Edg|OPR|CriOS)\//i.test(ua) && !/Firefox\//i.test(ua);
}

function loadSettingsFromStorage() {
  let parsed = null;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return;
    }
    parsed = JSON.parse(raw);
  } catch {
    return;
  }

  if (!parsed || typeof parsed !== "object") {
    return;
  }

  for (const id of CHECKBOX_SETTING_IDS) {
    if (!el[id] || typeof parsed[id] !== "boolean") {
      continue;
    }
    el[id].checked = parsed[id];
  }

  for (const id of VALUE_SETTING_IDS) {
    if (!el[id] || (typeof parsed[id] !== "string" && typeof parsed[id] !== "number")) {
      continue;
    }
    el[id].value = String(parsed[id]);
  }

  if (typeof parsed.aspectRatio === "string" && ASPECT_RATIO_VALUES.includes(parsed.aspectRatio)) {
    el.aspectRatio.value = parsed.aspectRatio;
  } else {
    el.aspectRatio.value = "16:9";
  }

  if (
    typeof parsed.outputResolution === "string" &&
    (OUTPUT_RESOLUTION_BASE[parsed.outputResolution] || parsed.outputResolution === SOURCE_MATCH_VALUE)
  ) {
    el.outputResolution.value = parsed.outputResolution;
  } else {
    el.outputResolution.value = "1920x1080";
  }

  if (typeof parsed.recordingQuality === "string" && RECORDING_QUALITY_PRESETS[parsed.recordingQuality]) {
    el.recordingQuality.value = parsed.recordingQuality;
  } else {
    el.recordingQuality.value = "balanced";
  }

  if (typeof parsed.recordingCodec === "string" && RECORDING_CODEC_OPTIONS[parsed.recordingCodec]) {
    el.recordingCodec.value = parsed.recordingCodec;
  } else {
    el.recordingCodec.value = "auto";
  }

  if (typeof parsed.previewMode === "string" && (parsed.previewMode === "screen" || parsed.previewMode === "camera")) {
    state.previewMode = parsed.previewMode;
    state.persistedSettings.previewMode = parsed.previewMode;
  }

  if (typeof parsed.cameraDeviceId === "string") {
    state.persistedSettings.cameraDeviceId = parsed.cameraDeviceId;
  }
  if (typeof parsed.micDeviceId === "string") {
    state.persistedSettings.micDeviceId = parsed.micDeviceId;
  }
}

function collectSettingsForStorage() {
  const settings = {};

  for (const id of CHECKBOX_SETTING_IDS) {
    if (el[id]) {
      settings[id] = Boolean(el[id].checked);
    }
  }

  for (const id of VALUE_SETTING_IDS) {
    if (el[id]) {
      settings[id] = String(el[id].value);
    }
  }

  const cameraHasResolvedOptions = Boolean(el.cameraDevice && el.cameraDevice.options.length > 1);
  const micHasResolvedOptions = Boolean(el.micDevice && el.micDevice.options.length > 1);
  settings.cameraDeviceId = cameraHasResolvedOptions ? el.cameraDevice.value : state.persistedSettings.cameraDeviceId || "";
  settings.micDeviceId = micHasResolvedOptions ? el.micDevice.value : state.persistedSettings.micDeviceId || "";
  settings.previewMode = state.previewMode;
  return settings;
}

function saveSettingsToStorage() {
  try {
    const settings = collectSettingsForStorage();
    state.persistedSettings.cameraDeviceId = settings.cameraDeviceId;
    state.persistedSettings.micDeviceId = settings.micDeviceId;
    state.persistedSettings.previewMode = settings.previewMode;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // no-op
  }
}

function bindSettingsPersistence() {
  const persistOnChangeIds = [...CHECKBOX_SETTING_IDS, ...VALUE_SETTING_IDS, "cameraDevice", "micDevice"];
  for (const id of persistOnChangeIds) {
    const control = el[id];
    if (!control) {
      continue;
    }
    control.addEventListener("change", saveSettingsToStorage);
  }

  for (const id of ["webcamSize", "silenceThreshold"]) {
    const control = el[id];
    if (!control) {
      continue;
    }
    control.addEventListener("input", saveSettingsToStorage);
  }
}

function updateThresholdLabel() {
  el.silenceThresholdValue.textContent = el.silenceThreshold.value + " dB";
  updateSmartEditStatus();
}

function updateFaceCropStatus() {
  if (!hasFaceDetectionSupport()) {
    el.faceCropStatus.textContent = "Auto Face Crop is unavailable in this browser build. Hover or click ? for setup tips.";
    return;
  }

  if (!el.includeWebcam.checked) {
    el.faceCropStatus.textContent = "Enable Webcam first, then toggle Auto Face Crop.";
    return;
  }

  if (!el.faceCrop.checked) {
    el.faceCropStatus.textContent = "Auto Face Crop is available. Turn it on to keep webcam framing face-focused.";
    return;
  }

  if (state.faceDetectionLoading) {
    el.faceCropStatus.textContent = "Auto Face Crop is loading a face tracking engine. This may take a moment the first time.";
    return;
  }

  if (state.faceDetectionDisabledReason) {
    el.faceCropStatus.textContent = state.faceDetectionDisabledReason;
    return;
  }

  if (!state.webcamStream || !state.faceDetector) {
    el.faceCropStatus.textContent = "Auto Face Crop enabled. Prepare sources to start face tracking.";
    return;
  }

  const seenRecently = Date.now() - state.faceTarget.lastSeenAt < FACE_DETECTION_RECENT_MS;
  if (seenRecently) {
    el.faceCropStatus.textContent = "Auto Face Crop active: tracking your face.";
  } else {
    el.faceCropStatus.textContent = "Auto Face Crop active: searching for a face. Keep your face well lit and mostly in frame.";
  }
}

function openFaceCropHelp() {
  el.faceCropHelpModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  el.faceCropHelpClose.focus();
}

function closeFaceCropHelp() {
  el.faceCropHelpModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  el.faceCropInfoBtn.focus();
}

function syncMicDependentControls() {
  const captureOptionsLocked =
    state.phase === "recording" ||
    state.phase === "paused" ||
    state.phase === "ready" ||
    state.isRecordingStarting ||
    state.isRestarting;
  const deviceSwitchLocked =
    state.phase === "ready" ||
    state.isRecordingStarting ||
    state.isRestarting;
  const micDisabled = !el.includeMic.checked || captureOptionsLocked;
  const camDisabled = !el.includeWebcam.checked || captureOptionsLocked;
  const micProcessingControls = [
    el.voiceIsolation,
    el.autoGainControl,
    el.noiseSuppression,
    el.echoCancellation,
    el.micCompressor,
    el.bassBoost250
  ];

  el.includeWebcam.disabled = captureOptionsLocked;
  el.includeMic.disabled = captureOptionsLocked;
  el.includeSystemAudio.disabled = captureOptionsLocked;
  el.faceCrop.disabled = !hasFaceDetectionSupport() || !el.includeWebcam.checked || captureOptionsLocked;
  el.refreshDevicesBtn.disabled = captureOptionsLocked || !navigator.mediaDevices?.enumerateDevices;
  // Resolution/aspect changes resize the capture canvas and would corrupt an in-flight recording.
  const resolutionLocked = state.phase === "recording" || state.phase === "paused" || state.isRecordingStarting || state.isRestarting;
  el.outputResolution.disabled = resolutionLocked;
  el.aspectRatio.disabled = resolutionLocked;
  micProcessingControls.forEach((control) => {
    if (control) {
      control.disabled = micDisabled || control.dataset.supported === "0";
    }
  });

  el.autoSkipSilence.disabled = micDisabled;
  el.silenceSeconds.disabled = micDisabled;
  el.silenceThreshold.disabled = micDisabled;
  el.micDevice.disabled = !el.includeMic.checked || deviceSwitchLocked;
  el.cameraDevice.disabled = !el.includeWebcam.checked || deviceSwitchLocked;

  if (!state.transcript.supported) {
    el.enableTranscription.disabled = true;
    el.transcriptionLang.disabled = true;
  } else {
    el.enableTranscription.disabled = micDisabled;
    el.transcriptionLang.disabled = micDisabled;
  }

  if (!el.includeMic.checked) {
    el.enableTranscription.checked = false;
    el.autoSkipSilence.checked = false;
  }

  if (!el.includeWebcam.checked && state.previewMode === "camera") {
    state.previewMode = "screen";
  }

  updatePreviewModeButtons();
  toggleTranscriptPanel();
  updateOutputQualityHint();
  updateSmartEditStatus();
  saveSettingsToStorage();
}

async function refreshDeviceSelectors({ requestAccess = false, silent = false } = {}) {
  if (!navigator.mediaDevices?.enumerateDevices) {
    el.cameraDevice.disabled = true;
    el.micDevice.disabled = true;
    el.refreshDevicesBtn.disabled = true;
    if (!silent) {
      el.deviceHint.textContent = "Device listing is not available in this browser.";
    }
    return;
  }

  if (requestAccess) {
    try {
      await requestTemporaryMediaAccessForLabels();
    } catch (error) {
      console.warn("Temporary media access failed:", error);
      if (!silent) {
        el.deviceHint.textContent = "Permission prompt failed. Showing currently detectable devices.";
      }
    }
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameraDevices = devices.filter((device) => device.kind === "videoinput");
    const micDevices = devices.filter((device) => device.kind === "audioinput");

    const selectedCamera = el.cameraDevice.value || state.persistedSettings.cameraDeviceId;
    const selectedMic = el.micDevice.value || state.persistedSettings.micDeviceId;

    populateDeviceSelect(el.cameraDevice, cameraDevices, "Default camera", selectedCamera, "Camera");
    populateDeviceSelect(el.micDevice, micDevices, "Default microphone", selectedMic, "Microphone");

    const hasVisibleLabels = [...cameraDevices, ...micDevices].some((device) => Boolean(device.label));
    if (!cameraDevices.length && !micDevices.length) {
      el.deviceHint.textContent = "No camera or microphone devices detected.";
    } else if (!hasVisibleLabels) {
      el.deviceHint.textContent = "Device names are hidden until access is granted. Click Refresh and allow access.";
    } else {
      el.deviceHint.textContent = "Detected " + cameraDevices.length + " camera(s) and " + micDevices.length + " microphone(s).";
    }

    syncMicDependentControls();
    saveSettingsToStorage();
  } catch (error) {
    console.warn("Device enumeration failed:", error);
    if (!silent) {
      el.deviceHint.textContent = "Could not list devices. Check browser permissions and try Refresh.";
    }
  }
}

async function requestTemporaryMediaAccessForLabels() {
  const wantsVideo = el.includeWebcam.checked;
  const wantsAudio = el.includeMic.checked;

  // Request at least one media type so labels can be revealed, preferring camera as neutral fallback.
  const requestVideo = wantsVideo || !wantsAudio;
  const requestAudio = wantsAudio;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: requestVideo,
    audio: requestAudio
  });

  stopStream(stream);
}

function populateDeviceSelect(selectEl, devices, defaultLabel, selectedValue, fallbackPrefix) {
  selectEl.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = defaultLabel;
  selectEl.append(defaultOption);

  devices.forEach((device, index) => {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.textContent = device.label || fallbackPrefix + " " + (index + 1);
    selectEl.append(option);
  });

  if (selectedValue && devices.some((device) => device.deviceId === selectedValue)) {
    selectEl.value = selectedValue;
  } else {
    selectEl.value = "";
  }
}

function applyConstraintSupport() {
  const hints = [];
  const supportedConstraints = navigator.mediaDevices?.getSupportedConstraints?.() || {};

  for (const pair of [
    ["voiceIsolation", "Voice isolation unavailable in this browser"],
    ["autoGainControl", "Auto gain control unavailable in this browser"],
    ["noiseSuppression", "Noise suppression unavailable in this browser"],
    ["echoCancellation", "Echo cancellation unavailable in this browser"]
  ]) {
    const [key, label] = pair;
    if (!supportedConstraints[key]) {
      el[key].checked = false;
      el[key].disabled = true;
      el[key].dataset.supported = "0";
      hints.push(label);
    } else {
      el[key].dataset.supported = "1";
    }
  }

  state.mediaRecorderSupported = "MediaRecorder" in window;
  if (!state.mediaRecorderSupported) {
    hints.push("MediaRecorder is not available.");
    el.startBtn.disabled = true;
  }

  if (!hasFaceDetectionSupport()) {
    el.faceCrop.checked = false;
    el.faceCrop.disabled = true;
    hints.push("Face auto-crop needs either native FaceDetector support or a secure-context browser that can load the MediaPipe fallback.");
  }

  if (!state.transcript.supported) {
    el.enableTranscription.checked = false;
    el.enableTranscription.disabled = true;
    el.transcriptionLang.disabled = true;
    hints.push("Live transcription needs SpeechRecognition support in this browser.");
  }

  if (!navigator.mediaDevices?.enumerateDevices) {
    el.refreshDevicesBtn.disabled = true;
    el.cameraDevice.disabled = true;
    el.micDevice.disabled = true;
    hints.push("Input device selection is unavailable in this browser.");
  }

  if (!isChromiumFamilyBrowser) {
    hints.push("System audio capture may be limited outside Chromium browsers.");
  }

  if (hints.length) {
    el.supportHint.textContent = hints.join(" ");
  }

  updateFaceCropStatus();
  saveSettingsToStorage();
}

function clearRunAnalysisState() {
  state.silenceMonitor.segments = [];
  state.silenceMonitor.silenceSinceMs = 0;
  state.silenceMonitor.currentSkipStartMs = 0;
  state.transcript.entries = [];
  state.transcript.interimText = "";
  state.markers.entries = [];
  state.sessionExports.transcriptText = "";
  state.sessionExports.transcriptFilename = "";
  el.downloadTranscriptBtn.disabled = true;
  updateMarkerButton();
  updateSmartEditStatus();
  renderTranscriptFeed();
  toggleTranscriptPanel();
}

function getInputSignature(options) {
  return JSON.stringify({
    outputResolution: options.outputResolution,
    aspectRatio: options.aspectRatio,
    includeWebcam: options.includeWebcam,
    includeMic: options.includeMic,
    includeSystemAudio: options.includeSystemAudio,
    cameraDeviceId: options.cameraDeviceId || "",
    micDeviceId: options.micDeviceId || "",
    voiceIsolation: options.voiceIsolation,
    autoGainControl: options.autoGainControl,
    noiseSuppression: options.noiseSuppression,
    echoCancellation: options.echoCancellation
  });
}

function nextPhaseTransitionToken() {
  state.phaseTransitionToken += 1;
  return state.phaseTransitionToken;
}

function isPhaseTransitionTokenCurrent(token) {
  return token === state.phaseTransitionToken;
}

function didDisplayCaptureSelectionChange(previousOptions, nextOptions) {
  if (!previousOptions) {
    return false;
  }
  return (
    Boolean(previousOptions.includeSystemAudio) !== Boolean(nextOptions.includeSystemAudio) ||
    didConstrainedDisplaySizeChange(previousOptions, nextOptions)
  );
}

function didConstrainedDisplaySizeChange(previousOptions, nextOptions) {
  if (shouldUseSourceNativeDisplayConstraints(previousOptions) || shouldUseSourceNativeDisplayConstraints(nextOptions)) {
    return false;
  }

  return (
    String(previousOptions.outputResolution || "") !== String(nextOptions.outputResolution || "") ||
    String(previousOptions.aspectRatio || "") !== String(nextOptions.aspectRatio || "")
  );
}

function shouldUseSourceNativeDisplayConstraints(options) {
  return options?.aspectRatio === SOURCE_MATCH_VALUE || options?.outputResolution === SOURCE_MATCH_VALUE;
}

function buildDisplayConstraints(options, { includeExtended = true } = {}) {
  const constraints = {
    video: {
      frameRate: { ideal: 30, max: 30 },
      cursor: "always"
    },
    audio: options.includeSystemAudio
  };

  if (!shouldUseSourceNativeDisplayConstraints(options)) {
    const outputPreset = getOutputResolutionPreset(options.outputResolution);
    constraints.video.width = { ideal: outputPreset.width };
    constraints.video.height = { ideal: outputPreset.height };
    constraints.video.aspectRatio = { ideal: outputPreset.width / outputPreset.height };
  }

  if (includeExtended && isChromiumFamilyBrowser) {
    constraints.systemAudio = options.includeSystemAudio ? "include" : "exclude";
    constraints.surfaceSwitching = "include";
  }

  return constraints;
}

async function refreshDisplayCapture(options) {
  const preferredConstraints = buildDisplayConstraints(options);
  let nextDisplayStream;
  try {
    nextDisplayStream = await navigator.mediaDevices.getDisplayMedia(preferredConstraints);
  } catch (error) {
    const shouldRetryWithoutExtendedConstraints =
      isChromiumFamilyBrowser && isDisplayConstraintCompatibilityError(error);
    if (!shouldRetryWithoutExtendedConstraints) {
      throw error;
    }

    console.warn("Retrying display capture with baseline constraints:", error);
    nextDisplayStream = await navigator.mediaDevices.getDisplayMedia(
      buildDisplayConstraints(options, { includeExtended: false })
    );
  }
  const displayTrack = nextDisplayStream.getVideoTracks()[0];
  if (!displayTrack) {
    stopStream(nextDisplayStream);
    throw new Error("Display video track missing.");
  }
  applyTrackContentHint(displayTrack, "detail");

  displayTrack.addEventListener("ended", () => {
    if (state.phase !== "idle") {
      stopSession();
    }
  });

  const previousDisplayStream = state.displayStream;
  state.displayStream = nextDisplayStream;
  state.displayVideo.srcObject = new MediaStream(state.displayStream.getVideoTracks());
  await safePlay(state.displayVideo);
  applySourceMatchedOutputIfNeeded(options);
  stopStream(previousDisplayStream);
}

function getCurrentDisplaySourceSize() {
  const displayTrack = state.displayStream?.getVideoTracks?.()[0] || null;
  const settings = displayTrack?.getSettings?.() || {};
  const width = Number(state.displayVideo?.videoWidth) || Number(settings.width) || 0;
  const height = Number(state.displayVideo?.videoHeight) || Number(settings.height) || 0;

  if (!width || !height) {
    return { width: 0, height: 0 };
  }

  return { width, height };
}

function refreshDisplaySourceSize() {
  const sourceSize = getCurrentDisplaySourceSize();
  if (sourceSize.width && sourceSize.height) {
    state.displaySourceSize = sourceSize;
  }
  return state.displaySourceSize;
}

function canResizeOutputCanvas() {
  return (
    state.phase !== "recording" &&
    state.phase !== "paused" &&
    !state.isRecordingStarting &&
    !state.isRestarting &&
    !isRecorderOutputCanvasActive()
  );
}

function applySourceMatchedOutputIfNeeded(options, { redraw = true } = {}) {
  refreshDisplaySourceSize();
  if (!shouldUseSourceNativeDisplayConstraints(options) || !canResizeOutputCanvas()) {
    return false;
  }

  applyOutputResolutionSelection({ redraw });
  updateOutputQualityHint();
  return true;
}

async function switchDisplaySource() {
  if (state.phase !== "recording" && state.phase !== "paused" && state.phase !== "staged") {
    return;
  }

  const options = getOptions();
  const constraints = buildDisplayConstraints(options);
  let nextDisplayStream;
  try {
    nextDisplayStream = await navigator.mediaDevices.getDisplayMedia(constraints);
  } catch (error) {
    if (error.name === "NotAllowedError" || error.name === "AbortError") {
      return;
    }
    const shouldRetry = isChromiumFamilyBrowser && isDisplayConstraintCompatibilityError(error);
    if (!shouldRetry) {
      reportError(error);
      return;
    }
    try {
      nextDisplayStream = await navigator.mediaDevices.getDisplayMedia(
        buildDisplayConstraints(options, { includeExtended: false })
      );
    } catch (retryError) {
      if (retryError.name !== "NotAllowedError" && retryError.name !== "AbortError") {
        reportError(retryError);
      }
      return;
    }
  }

  const displayTrack = nextDisplayStream.getVideoTracks()[0];
  if (!displayTrack) {
    stopStream(nextDisplayStream);
    return;
  }
  applyTrackContentHint(displayTrack, "detail");

  displayTrack.addEventListener("ended", () => {
    if (state.phase !== "idle") {
      stopSession();
    }
  });

  const previousDisplayStream = state.displayStream;
  state.displayStream = nextDisplayStream;
  state.displayVideo.srcObject = new MediaStream(state.displayStream.getVideoTracks());
  await safePlay(state.displayVideo);
  const resizedForSource = applySourceMatchedOutputIfNeeded(options);
  stopStream(previousDisplayStream);

  // Reconnect display audio in the mix graph if recording
  if (state.audioMixContext && state.mixedDestination) {
    try {
      if (state.displayAudioSourceNode) {
        state.displayAudioSourceNode.disconnect();
        state.displayAudioSourceNode = null;
        state.displayAudioGainNode = null;
      }
    } catch {}

    if (state.displayStream.getAudioTracks().length) {
      const newAudioStream = new MediaStream(state.displayStream.getAudioTracks());
      const newSource = state.audioMixContext.createMediaStreamSource(newAudioStream);
      const newGain = state.audioMixContext.createGain();
      newGain.gain.value = 1.0;
      newSource.connect(newGain).connect(state.mixedDestination);
      state.displayAudioSourceNode = newSource;
      state.displayAudioGainNode = newGain;
    }
  }

  const preset = getOutputResolutionPreset(el.outputResolution.value);
  el.supportHint.textContent = resizedForSource
    ? "Display source switched. Output set to " + preset.label + "."
    : "Display source switched.";
}

async function switchWebcamSource(deviceId) {
  if (state.phase !== "recording" && state.phase !== "paused") {
    return;
  }
  try {
    const constraints = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } };
    if (deviceId) {
      constraints.deviceId = { exact: deviceId };
    }
    let newStream;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({ video: constraints, audio: false });
    } catch {
      newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    const previousWebcam = state.webcamStream;
    state.webcamStream = newStream;
    state.webcamVideo.srcObject = new MediaStream(newStream.getVideoTracks());
    await safePlay(state.webcamVideo);
    stopStream(previousWebcam);
    await startFaceDetectionIfEnabled();
    await refreshDeviceSelectors({ requestAccess: false, silent: true });
    el.supportHint.textContent = "Camera switched.";
  } catch (error) {
    console.warn("Camera switch failed:", error);
    el.supportHint.textContent = "Camera switch failed: " + (error.message || error.name || "Unknown error");
  }
}

async function switchMicSource(deviceId) {
  if (state.phase !== "recording" && state.phase !== "paused") {
    return;
  }
  try {
    const options = getOptions();
    const constraints = buildMicConstraints({ ...options, micDeviceId: deviceId });
    let newStream;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: constraints });
    } catch {
      newStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    }
    const previousMic = state.micStream;
    state.micStream = newStream;
    stopStream(previousMic);

    if (state.audioMixContext && state.mixedDestination) {
      try {
        if (state.micSourceNode) {
          state.micSourceNode.disconnect();
        }
      } catch {}
      state.micSourceNode = null;
      state.micGainNode = null;

      const micSource = state.audioMixContext.createMediaStreamSource(state.micStream);
      let micNode = micSource;
      if (options.bassBoost250) {
        const warmthBoost = createWarmthBoostFilter(state.audioMixContext);
        micNode.connect(warmthBoost);
        micNode = warmthBoost;
      }
      if (options.micCompressor) {
        const micCompressor = createRecorderMicCompressor(state.audioMixContext);
        micNode.connect(micCompressor);
        micNode = micCompressor;
      }
      const micGain = state.audioMixContext.createGain();
      micGain.gain.value = 1.0;
      micNode.connect(micGain).connect(state.mixedDestination);
      state.micSourceNode = micSource;
      state.micGainNode = micGain;
    }

    if (state.silenceMonitor.context && state.silenceMonitor.analyser) {
      try {
        if (state.silenceMonitor.source) {
          state.silenceMonitor.source.disconnect();
        }
      } catch {}
      const newSource = state.silenceMonitor.context.createMediaStreamSource(state.micStream);
      newSource.connect(state.silenceMonitor.analyser);
      state.silenceMonitor.source = newSource;
    }

    await startMicLevelMonitor();
    await refreshDeviceSelectors({ requestAccess: false, silent: true });
    el.supportHint.textContent = "Microphone switched.";
  } catch (error) {
    console.warn("Mic switch failed:", error);
    el.supportHint.textContent = "Mic switch failed: " + (error.message || error.name || "Unknown error");
  }
}

async function syncPreparedCaptureSelection(options) {
  const displayRefreshed = didDisplayCaptureSelectionChange(state.preparedOptions, options);
  if (displayRefreshed) {
    await refreshDisplayCapture(options);
  }

  await applyUserMediaSelection(options, { updateHint: false });
  state.preparedOptions = options;
  state.preparedInputSignature = getInputSignature(options);
  return { displayRefreshed };
}

async function handleStagedInputSelectionChange() {
  if (state.phase !== "staged" && state.phase !== "ready") {
    return;
  }

  await applyPreparedInputChanges(getOptions());
}

async function applyPreparedInputChanges(options) {
  if (state.phase !== "staged" && state.phase !== "ready") {
    return;
  }

  if (state.applyingInputChanges) {
    state.pendingInputChangeApply = true;
    return;
  }

  const transitionToken = nextPhaseTransitionToken();
  state.applyingInputChanges = true;
  setPhase("ready", "Updating");

  try {
    const result = await syncPreparedCaptureSelection(options);
    if (!isPhaseTransitionTokenCurrent(transitionToken) || state.phase !== "ready") {
      if (state.phase === "idle") {
        await teardownSession({ keepDownloads: true });
      }
      return;
    }
    if (!state.renderHandle) {
      startRenderLoop();
    }
    setPhase("staged", "Ready");
    el.supportHint.textContent = result.displayRefreshed
      ? "Display source refreshed to apply capture changes. Adjust webcam placement, then click Start Recording."
      : "Inputs updated. Adjust webcam placement, then click Start Recording.";
  } catch (error) {
    if (!isPhaseTransitionTokenCurrent(transitionToken) || state.phase === "idle") {
      if (state.phase === "idle") {
        await teardownSession({ keepDownloads: true });
      }
      return;
    }
    reportError(error);
    setPhase("staged", "Ready");
  } finally {
    state.applyingInputChanges = false;
    if (state.pendingInputChangeApply && isPhaseTransitionTokenCurrent(transitionToken) && (state.phase === "staged" || state.phase === "ready")) {
      state.pendingInputChangeApply = false;
      await applyPreparedInputChanges(getOptions());
    } else if (state.phase === "idle") {
      state.pendingInputChangeApply = false;
    }
  }
}

async function startSession() {
  if (state.phase === "idle") {
    await prepareSession();
    return;
  }

  if (state.phase === "staged") {
    await beginRecordingSession();
  }
}

async function prepareSession() {
  const transitionToken = nextPhaseTransitionToken();
  state.cancelCountdown = false;
  clearRunAnalysisState();
  setPhase("ready", "Preparing");

  try {
    const options = getOptions();
    applyOutputResolutionSelection({ redraw: false });
    state.preparedOptions = options;
    state.preparedInputSignature = getInputSignature(options);
    await acquireStreams(options);
    if (!isPhaseTransitionTokenCurrent(transitionToken) || state.phase !== "ready") {
      if (state.phase === "idle") {
        await teardownSession({ keepDownloads: true });
      }
      return;
    }
    startRenderLoop();
    if (!isPhaseTransitionTokenCurrent(transitionToken) || state.phase !== "ready") {
      if (state.phase === "idle") {
        await teardownSession({ keepDownloads: true });
      }
      return;
    }

    setPhase("staged", "Ready");
    el.supportHint.textContent = "Adjust webcam placement in preview, then click Start Recording.";
  } catch (error) {
    if (!isPhaseTransitionTokenCurrent(transitionToken)) {
      if (state.phase === "idle") {
        await teardownSession({ keepDownloads: true });
      }
      return;
    }
    if (!isCancellation(error)) {
      reportError(error);
    }
    await teardownSession({ keepDownloads: true });
    setPhase("idle", "Idle");
  }
}

async function beginRecordingSession() {
  if (state.phase !== "staged" || state.isRecordingStarting) {
    return;
  }

  state.isRecordingStarting = true;
  setPhase("ready", "Starting");

  try {
    const options = getOptions();
    applyOutputResolutionSelection({ redraw: false });
    const inputSignature = getInputSignature(options);
    if (inputSignature !== state.preparedInputSignature) {
      await syncPreparedCaptureSelection(options);
    }

    if (options.countdownSeconds > 0) {
      await runCountdown(options.countdownSeconds);
    }

    if (state.cancelCountdown) {
      throw new Error("Recording canceled");
    }

    await startRecorder();
    setPhase("recording", "Recording");
    startClock();

    await startTranscriptionIfEnabled(options);
    await startSilenceMonitorIfEnabled(options);
  } catch (error) {
    if (!isCancellation(error)) {
      reportError(error);
    }
    if (state.phase !== "idle" && !state.isStopping) {
      state.isRecordingStarting = false;
      await teardownSession({ keepDownloads: true });
      setPhase("idle", "Idle");
    }
  } finally {
    state.isRecordingStarting = false;
  }
}

async function acquireStreams(options) {
  await refreshDisplayCapture(options);

  try {
    await applyUserMediaSelection(options, { updateHint: false });
  } catch (error) {
    console.warn("User media unavailable, continuing without webcam/mic:", error);
    el.supportHint.textContent = "Camera/microphone unavailable. Continuing with screen-only capture.";
    if (state.previewMode === "camera") {
      state.previewMode = "screen";
      updatePreviewModeButtons();
    }
  }

  state.displayVideo.srcObject = new MediaStream(state.displayStream.getVideoTracks());
  await safePlay(state.displayVideo);

  state.overlay.x = 0.72;
  state.overlay.y = 0.69;
}

async function applyUserMediaSelection(options, { updateHint = false } = {}) {
  const needsUserMedia = options.includeWebcam || options.includeMic;
  if (!needsUserMedia) {
    stopStream(state.webcamStream);
    stopStream(state.micStream);
    state.webcamStream = null;
    state.micStream = null;
    state.webcamVideo.srcObject = null;
    stopFaceDetection();
    resetFaceTarget();
    stopMicLevelMonitor();
    return;
  }

  const userStream = await requestUserMediaForOptions(options);
  const webcamTrack = userStream.getVideoTracks()[0] || null;
  const micTrack = userStream.getAudioTracks()[0] || null;

  const prevWebcam = state.webcamStream;
  const prevMic = state.micStream;

  state.webcamStream = webcamTrack ? new MediaStream([webcamTrack]) : null;
  state.micStream = micTrack ? new MediaStream([micTrack]) : null;
  applyActiveTrackContentHints();

  stopStream(prevWebcam);
  stopStream(prevMic);

  if (state.webcamStream) {
    state.webcamVideo.srcObject = new MediaStream(state.webcamStream.getVideoTracks());
    await safePlay(state.webcamVideo);
    await startFaceDetectionIfEnabled();
  } else {
    state.webcamVideo.srcObject = null;
    stopFaceDetection();
    resetFaceTarget();
  }

  if (!state.webcamStream && state.previewMode === "camera") {
    state.previewMode = "screen";
  }
  updatePreviewModeButtons();

  await refreshDeviceSelectors({ requestAccess: false, silent: true });
  await startMicLevelMonitor();

  if (updateHint) {
    el.supportHint.textContent = "Inputs updated. Adjust webcam placement, then click Start Recording.";
  }
}

async function requestUserMediaForOptions(options) {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: options.includeWebcam ? buildVideoConstraints(options) : false,
      audio: options.includeMic ? buildMicConstraints(options) : false
    });
  } catch (error) {
    const selectedDeviceFailed =
      (options.cameraDeviceId || options.micDeviceId) &&
      (error?.name === "OverconstrainedError" || error?.name === "NotFoundError");

    if (!selectedDeviceFailed) {
      throw error;
    }

    el.deviceHint.textContent = "Selected device unavailable. Falling back to default inputs.";
    return navigator.mediaDevices.getUserMedia({
      video: options.includeWebcam ? buildVideoConstraints({ ...options, cameraDeviceId: "" }) : false,
      audio: options.includeMic ? buildMicConstraints({ ...options, micDeviceId: "" }) : false
    });
  }
}

function buildVideoConstraints(options) {
  const constraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 30 }
  };

  if (options.cameraDeviceId) {
    constraints.deviceId = { exact: options.cameraDeviceId };
  }

  return constraints;
}

function buildMicConstraints(options) {
  const constraints = {
    channelCount: { ideal: 1 },
    sampleRate: { ideal: 48000 },
    sampleSize: { ideal: 16 }
  };

  if (!el.voiceIsolation.disabled) {
    constraints.voiceIsolation = options.voiceIsolation;
  }
  if (!el.echoCancellation.disabled) {
    constraints.echoCancellation = options.echoCancellation;
  }
  if (!el.noiseSuppression.disabled) {
    constraints.noiseSuppression = options.noiseSuppression;
  }
  if (!el.autoGainControl.disabled) {
    constraints.autoGainControl = options.autoGainControl;
  }
  if (options.micDeviceId) {
    constraints.deviceId = { exact: options.micDeviceId };
  }
  return constraints;
}

function createRecorderMicCompressor(audioContext) {
  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -28;
  compressor.knee.value = 18;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.01;
  compressor.release.value = 0.2;
  return compressor;
}

function createWarmthBoostFilter(audioContext) {
  const filter = audioContext.createBiquadFilter();
  filter.type = "peaking";
  filter.frequency.value = 250;
  filter.Q.value = 0.9;
  filter.gain.value = 6;
  return filter;
}

async function safePlay(video) {
  try {
    await video.play();
  } catch (error) {
    if (error?.name !== "AbortError") {
      throw error;
    }
  }
}

async function runCountdown(seconds) {
  el.countdownOverlay.classList.remove("hidden");
  state.countdownRemaining = seconds;
  updateDocumentTitle();
  for (let n = seconds; n >= 1; n -= 1) {
    state.countdownRemaining = n;
    updateDocumentTitle();
    if (state.cancelCountdown) {
      el.countdownOverlay.classList.add("hidden");
      state.countdownRemaining = 0;
      updateDocumentTitle();
      throw new Error("Countdown canceled");
    }
    el.countdownOverlay.textContent = String(n);
    await beep(840, 120);
    await sleep(900);
  }

  el.countdownOverlay.textContent = "REC";
  await beep(1040, 90);
  await sleep(100);
  await beep(1240, 100);
  await sleep(240);
  el.countdownOverlay.classList.add("hidden");
  state.countdownRemaining = 0;
  updateDocumentTitle();
}

async function beep(frequency, durationMs) {
  const audioContext = await getUiAudioContext();
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000 + 0.03);
}

async function getUiAudioContext() {
  if (!state.uiAudioContext || state.uiAudioContext.state === "closed") {
    state.uiAudioContext = new AudioContext();
  }
  if (state.uiAudioContext.state === "suspended") {
    await state.uiAudioContext.resume();
  }
  return state.uiAudioContext;
}

async function startRecorder() {
  state.chunks = [];
  try {
    const db = await openRecoveryDB();
    state.recovery.db = db;
    state.recovery.sessionId = "rec-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    state.recovery.totalChunksFlushed = 0;
    await clearRecoveryDB(db);
  } catch (error) {
    console.warn("Recovery DB init failed, recording without crash recovery:", error);
    state.recovery.db = null;
  }
  const options = getOptions();
  state.outputStream = await buildOutputStream(options);
  renderFrameForPipeline(true);

  state.recorderConfig = resolveRecorderConfig(options);
  state.mimeType = state.recorderConfig.mimeType;
  const recorderOptions = {};
  if (state.mimeType) {
    recorderOptions.mimeType = state.mimeType;
  }
  recorderOptions.videoBitsPerSecond = state.recorderConfig.videoBitsPerSecond;
  if (state.recorderConfig.audioBitsPerSecond > 0) {
    recorderOptions.audioBitsPerSecond = state.recorderConfig.audioBitsPerSecond;
  }

  try {
    state.mediaRecorder = new MediaRecorder(state.outputStream, recorderOptions);
  } catch (error) {
    console.warn("Recorder bitrate options unsupported, falling back:", error);
    const fallbackOptions = state.mimeType ? { mimeType: state.mimeType } : undefined;
    state.mediaRecorder = new MediaRecorder(state.outputStream, fallbackOptions);
  }

  state.mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      state.chunks.push(event.data);
    }
  };
  state.mediaRecorder.start(1000);

  if (state.recovery.db) {
    try {
      await saveSessionMeta(state.recovery.db, state.recovery.sessionId, state.mimeType);
      startRecoveryFlush();
    } catch (error) {
      console.warn("Recovery session meta save failed:", error);
    }
  }

  const recorderSummary =
    state.recorderConfig.requestedCodec !== "auto" && state.recorderConfig.fallbackCodec
      ? `${state.recorderConfig.requestedCodecLabel} is not available here, using ${state.recorderConfig.resolvedCodecLabel} at about ${(state.recorderConfig.videoBitsPerSecond / 1_000_000).toFixed(1)} Mbps.`
      : `Recording ${state.recorderConfig.qualityLabel.toLowerCase()} with ${state.recorderConfig.resolvedCodecLabel} at about ${(state.recorderConfig.videoBitsPerSecond / 1_000_000).toFixed(1)} Mbps.`;
  el.supportHint.textContent = recorderSummary;
}

async function buildOutputStream(options = getOptions()) {
  // Use manual frame requests so audio callbacks can keep video frames flowing in background tabs.
  syncCaptureCanvasSize();
  const canvasStream = captureCanvas.captureStream(0);
  const canvasTrack = canvasStream.getVideoTracks()[0] || null;
  const tracks = [];
  if (canvasTrack) {
    tracks.push(canvasTrack);
  }

  const mixContext = new AudioContext();
  if (mixContext.state === "suspended") {
    await mixContext.resume();
  }
  const destination = mixContext.createMediaStreamDestination();
  let hasMixedAudio = false;
  if (state.micStream?.getAudioTracks().length) {
    const micSource = mixContext.createMediaStreamSource(state.micStream);
    let micNode = micSource;
    if (options.bassBoost250) {
      const warmthBoost = createWarmthBoostFilter(mixContext);
      micNode.connect(warmthBoost);
      micNode = warmthBoost;
    }
    if (options.micCompressor) {
      const micCompressor = createRecorderMicCompressor(mixContext);
      micNode.connect(micCompressor);
      micNode = micCompressor;
    }
    const micGain = mixContext.createGain();
    micGain.gain.value = 1.0;

    micNode.connect(micGain).connect(destination);
    state.micSourceNode = micSource;
    state.micGainNode = micGain;
    hasMixedAudio = true;
  }

  if (state.displayStream?.getAudioTracks().length) {
    const displayAudioStream = new MediaStream(state.displayStream.getAudioTracks());
    const displaySource = mixContext.createMediaStreamSource(displayAudioStream);
    const displayGain = mixContext.createGain();
    displayGain.gain.value = 1.0;
    displaySource.connect(displayGain).connect(destination);
    state.displayAudioSourceNode = displaySource;
    state.displayAudioGainNode = displayGain;
    hasMixedAudio = true;
  } else {
    state.displayAudioSourceNode = null;
    state.displayAudioGainNode = null;
  }

  startAudioRenderHeartbeat(mixContext, hasMixedAudio ? destination : mixContext.destination);

  if (hasMixedAudio) {
    const mixedTrack = destination.stream.getAudioTracks()[0] || null;
    if (mixedTrack) {
      tracks.push(mixedTrack);
    }
  }

  state.audioMixContext = mixContext;
  state.mixedDestination = destination;
  state.canvasTrack = canvasTrack;
  applyActiveTrackContentHints();

  return new MediaStream(tracks);
}

function pickMimeType(codecPreference = "auto") {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
    return {
      key: "default",
      label: "Browser default",
      mimeType: "",
      requestedLabel: getRecordingCodecOption(codecPreference).label,
      fallbackCodec: false
    };
  }

  const codecOption = getRecordingCodecOption(codecPreference);
  for (const candidate of codecOption.candidates) {
    if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
      return {
        key: candidate.key,
        label: candidate.label,
        mimeType: candidate.mimeType,
        requestedLabel: codecOption.label,
        fallbackCodec: false
      };
    }
  }

  if (codecPreference !== "auto") {
    const fallback = pickMimeType("auto");
    return {
      ...fallback,
      requestedLabel: codecOption.label,
      fallbackCodec: true
    };
  }

  for (const type of ["video/webm", "video/mp4"]) {
    if (MediaRecorder.isTypeSupported(type)) {
      return {
        key: type.includes("mp4") ? "mp4" : "webm",
        label: type.includes("mp4") ? "MP4" : "WebM",
        mimeType: type,
        requestedLabel: codecOption.label,
        fallbackCodec: false
      };
    }
  }

  return {
    key: "default",
    label: "Browser default",
    mimeType: "",
    requestedLabel: codecOption.label,
    fallbackCodec: false
  };
}

function applyTrackContentHint(track, hint) {
  if (!track || !hint || !("contentHint" in track)) {
    return;
  }

  try {
    if (track.contentHint !== hint) {
      track.contentHint = hint;
    }
  } catch {
    // Browsers may reject unsupported hint values.
  }
}

function applyActiveTrackContentHints() {
  const displayTrack = state.displayStream?.getVideoTracks?.()[0] || null;
  const webcamTrack = state.webcamStream?.getVideoTracks?.()[0] || null;
  const canvasTrack = state.canvasTrack;
  const outputHint = state.previewMode === "camera" ? "motion" : "detail";

  applyTrackContentHint(displayTrack, "detail");
  applyTrackContentHint(webcamTrack, "motion");
  applyTrackContentHint(canvasTrack, outputHint);
}

async function togglePause() {
  if (!state.mediaRecorder) {
    return;
  }

  if (state.phase === "recording") {
    pauseRecorder({ automatic: false, reason: "Paused by user." });
    return;
  }

  if (state.phase === "paused") {
    if (state.autoPauseActive) {
      finishCurrentSilenceSegment();
    }
    resumeRecorder({ automatic: false });
  }
}

async function resetCurrentTake({ keepDownload }) {
  if (state.timing.pausedAt) {
    state.timing.pausedTotal += Date.now() - state.timing.pausedAt;
    state.timing.pausedAt = 0;
  }

  if (state.autoPauseActive) {
    finishCurrentSilenceSegment();
    state.autoPauseActive = false;
  }

  await stopTranscription();
  finishCurrentSilenceSegment();
  stopSilenceMonitor();

  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    await new Promise((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) {
          return;
        }
        resolved = true;
        resolve();
      };

      state.mediaRecorder.addEventListener("stop", done, { once: true });
      try {
        state.mediaRecorder.stop();
      } catch {
        done();
      }
      setTimeout(done, 1800);
    });
  }

  stopRecoveryFlush();
  if (state.recovery.flushPromise) {
    try { await state.recovery.flushPromise; } catch {}
  }
  if (keepDownload && state.recovery.db) {
    try {
      await flushChunksToIDB();
      const idbChunks = await loadAllChunksFromIDB(state.recovery.db);
      state.chunks = idbChunks;
    } catch (error) {
      console.warn("Recovery reassembly failed, using in-memory chunks:", error);
    }
  }

  if (keepDownload && state.chunks.length > 0) {
    addDownloadItem();
  }

  if (state.recovery.db) {
    try { await clearRecoveryDB(state.recovery.db); } catch {}
  }

  stopClock();
  clearCountdown();
  stopStream(state.outputStream);
  state.outputStream = null;
  state.canvasTrack = null;
  state.mediaRecorder = null;
  state.chunks = [];
  state.mimeType = "";

  stopAudioRenderHeartbeat();
  if (state.audioMixContext && state.audioMixContext.state !== "closed") {
    await state.audioMixContext.close();
  }
  state.audioMixContext = null;
  state.mixedDestination = null;
  state.displayAudioSourceNode = null;
  state.displayAudioGainNode = null;
  state.micSourceNode = null;
  state.micGainNode = null;
}

async function restartTake() {
  if ((state.phase !== "recording" && state.phase !== "paused") || state.isStopping || state.isRestarting) {
    return;
  }

  state.cancelCountdown = false;
  state.isRestarting = true;
  setPhase("ready", "Restarting");

  try {
    await resetCurrentTake({ keepDownload: false });
    clearRunAnalysisState();

    const options = getOptions();
    if (options.countdownSeconds > 0) {
      await runCountdown(options.countdownSeconds);
    }

    if (state.cancelCountdown) {
      throw new Error("Recording canceled");
    }

    await startRecorder();
    setPhase("recording", "Recording");
    startClock();

    await startTranscriptionIfEnabled(options);
    await startSilenceMonitorIfEnabled(options);
    el.supportHint.textContent = "Restarted take. Sources stayed connected.";
  } catch (error) {
    const canceled = isCancellation(error);
    if (!canceled) {
      reportError(error);
      if (state.phase !== "idle") {
        try {
          await resetCurrentTake({ keepDownload: false });
        } catch (cleanupError) {
          console.warn("Restart cleanup failed:", cleanupError);
        }
      }
    }
    if (state.phase !== "idle") {
      setPhase("staged", "Ready");
      if (canceled) {
        el.supportHint.textContent = "Restart canceled. Sources are still ready.";
      }
    }
  } finally {
    state.isRestarting = false;
    if (state.phase === "recording") {
      setPhase("recording", "Recording");
    } else if (state.phase === "paused") {
      setPhase("paused", "Paused");
    } else if (state.phase === "staged") {
      setPhase("staged", "Ready");
    } else if (state.phase === "idle") {
      setPhase("idle", "Idle");
    }
  }
}

async function stopSession() {
  if (state.phase === "idle" || state.isStopping) {
    return;
  }
  nextPhaseTransitionToken();
  state.cancelCountdown = true;
  state.isStopping = true;

  try {
    if (state.timing.pausedAt) {
      state.timing.pausedTotal += Date.now() - state.timing.pausedAt;
      state.timing.pausedAt = 0;
    }

    if (state.autoPauseActive) {
      finishCurrentSilenceSegment();
      state.autoPauseActive = false;
    }

    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      await new Promise((resolve) => {
        let resolved = false;
        const done = () => {
          if (resolved) {
            return;
          }
          resolved = true;
          resolve();
        };

        state.mediaRecorder.addEventListener("stop", done, { once: true });
        try {
          state.mediaRecorder.stop();
        } catch {
          done();
        }
        setTimeout(done, 1800);
      });
    }

    await stopTranscription();

    stopRecoveryFlush();
    if (state.recovery.flushPromise) {
      try { await state.recovery.flushPromise; } catch {}
    }
    if (state.recovery.db) {
      try {
        await flushChunksToIDB();
        const idbChunks = await loadAllChunksFromIDB(state.recovery.db);
        state.chunks = idbChunks;
      } catch (error) {
        console.warn("Recovery reassembly failed, using in-memory chunks:", error);
      }
    }

    if (state.chunks.length > 0) {
      addDownloadItem();
    }

    if (state.recovery.db) {
      try { await clearRecoveryDB(state.recovery.db); } catch {}
    }
  } finally {
    await teardownSession({ keepDownloads: true });
    setPhase("idle", "Idle");
    state.isStopping = false;
  }
}

function addDownloadItem() {
  const mimeType = state.mimeType || "video/webm";
  const blob = new Blob(state.chunks, { type: mimeType });
  const ext = mimeType.includes("mp4") ? "mp4" : "webm";
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `screenrecord-${stamp}.${ext}`;

  const item = document.createElement("li");
  item.className = "download-item";
  const sizeMb = `${(blob.size / (1024 * 1024)).toFixed(1)} MB`;

  const links = document.createElement("div");
  links.className = "download-links";

  const blobUrls = [url];

  const videoLink = document.createElement("a");
  videoLink.href = url;
  videoLink.download = filename;
  videoLink.textContent = filename;
  videoLink.addEventListener("click", () => {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  });
  links.append(videoLink);

  const markerText = buildMarkerExportText(filename);
  if (markerText) {
    const markerFilename = filename.replace(/\.[a-z0-9]+$/i, "-markers.txt");
    const markerBlob = new Blob([markerText], { type: "text/plain;charset=utf-8" });
    const markerUrl = URL.createObjectURL(markerBlob);
    blobUrls.push(markerUrl);
    const markerLink = document.createElement("a");
    markerLink.href = markerUrl;
    markerLink.download = markerFilename;
    markerLink.textContent = "Markers";
    links.append(markerLink);
  }

  const transcriptText = buildTranscriptExportText(filename);
  if (transcriptText) {
    state.sessionExports.transcriptText = transcriptText;
    state.sessionExports.transcriptFilename = filename.replace(/\.[a-z0-9]+$/i, ".txt");

    const transcriptBlob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const transcriptUrl = URL.createObjectURL(transcriptBlob);
    blobUrls.push(transcriptUrl);
    const transcriptLink = document.createElement("a");
    transcriptLink.href = transcriptUrl;
    transcriptLink.download = state.sessionExports.transcriptFilename;
    transcriptLink.textContent = "Transcript";
    links.append(transcriptLink);

    el.downloadTranscriptBtn.disabled = false;
    toggleTranscriptPanel(true);
  }

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = sizeMb;

  item.append(links, meta);
  item._blobUrls = blobUrls;
  el.downloadList.prepend(item);
  el.downloadsPanel.classList.remove("hidden");
}

async function teardownSession({ keepDownloads }) {
  stopRecoveryFlush();
  state.recovery.sessionId = "";
  state.recovery.flushPromise = null;
  state.recovery.totalChunksFlushed = 0;
  state.recovery.flushHandle = 0;

  stopClock();
  stopRenderLoop();
  stopFaceDetection();
  clearCountdown();

  stopMicLevelMonitor();
  finishCurrentSilenceSegment();
  stopSilenceMonitor();
  await stopTranscription();

  stopStream(state.displayStream);
  stopStream(state.webcamStream);
  stopStream(state.micStream);
  stopStream(state.outputStream);

  state.displayStream = null;
  state.webcamStream = null;
  state.micStream = null;
  state.outputStream = null;
  state.canvasTrack = null;
  state.mediaRecorder = null;
  state.chunks = [];
  state.mimeType = "";
  state.autoPauseActive = false;
  state.preparedOptions = null;
  state.preparedInputSignature = "";
  state.applyingInputChanges = false;
  state.pendingInputChangeApply = false;
  state.displaySourceSize = {
    width: 0,
    height: 0
  };

  state.displayVideo.srcObject = null;
  state.webcamVideo.srcObject = null;

  stopAudioRenderHeartbeat();
  if (state.audioMixContext && state.audioMixContext.state !== "closed") {
    await state.audioMixContext.close();
  }
  state.audioMixContext = null;
  state.mixedDestination = null;
  state.displayAudioSourceNode = null;
  state.displayAudioGainNode = null;
  state.micSourceNode = null;
  state.micGainNode = null;

  if (state.uiAudioContext && state.uiAudioContext.state !== "closed") {
    await state.uiAudioContext.close();
  }
  state.uiAudioContext = null;

  if (!keepDownloads) {
    for (const item of el.downloadList.children) {
      if (item._blobUrls) {
        item._blobUrls.forEach((u) => URL.revokeObjectURL(u));
      }
    }
    el.downloadList.innerHTML = "";
    el.downloadsPanel.classList.add("hidden");
  }

  drawIdleSlate();
}

function stopStream(stream) {
  if (!stream) {
    return;
  }
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

function startRenderLoop() {
  stopRenderLoop();
  state.renderClock.lastFrameAt = 0;
  const draw = () => {
    renderFrameForPipeline();
    state.renderHandle = requestAnimationFrame(draw);
  };
  renderFrameForPipeline(true);
  state.renderHandle = requestAnimationFrame(draw);
}

function stopRenderLoop() {
  if (state.renderHandle) {
    cancelAnimationFrame(state.renderHandle);
  }
  state.renderHandle = 0;
}

function renderFrameForPipeline(force = false) {
  const now = performance.now();
  if (!force && now - state.renderClock.lastFrameAt < state.renderClock.frameIntervalMs) {
    return;
  }

  renderFrame();
  publishCleanFrameForRecording();
  drawPreviewOnlyOverlays(el.previewCanvas.width, el.previewCanvas.height);
  drawCropGuides(el.previewCanvas.width, el.previewCanvas.height);
  state.renderClock.lastFrameAt = now;
}

function syncCaptureCanvasSize() {
  const width = el.previewCanvas.width;
  const height = el.previewCanvas.height;
  if (captureCanvas.width !== width) {
    captureCanvas.width = width;
  }
  if (captureCanvas.height !== height) {
    captureCanvas.height = height;
  }
  configureCanvasContext(captureCtx);
}

function publishCleanFrameForRecording() {
  if (!state.canvasTrack) {
    return;
  }
  syncCaptureCanvasSize();
  if (captureCtx) {
    captureCtx.drawImage(el.previewCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
  }
  requestCanvasFrame();
}

function requestCanvasFrame() {
  if (state.canvasTrack?.requestFrame) {
    state.canvasTrack.requestFrame();
  }
}

function isRecorderOutputCanvasActive() {
  return Boolean(
    state.outputStream ||
    state.canvasTrack ||
    (state.mediaRecorder && state.mediaRecorder.state !== "inactive")
  );
}

function renderFrame() {
  const cw = el.previewCanvas.width;
  const ch = el.previewCanvas.height;

  stepFaceRenderState();
  ctx.fillStyle = "#060b10";
  ctx.fillRect(0, 0, cw, ch);

  if (state.previewMode === "camera") {
    drawCameraFullscreen(cw, ch);
  } else {
    drawDisplayTrack(cw, ch);
    drawWebcamOverlay(cw, ch);
  }
  if (!isRecorderOutputCanvasActive()) {
    drawFaceDebugOverlay(cw, ch);
  }
}

function drawPreviewOnlyOverlays(cw, ch) {
  drawFaceTrackingStatusBadge(cw, ch);
  if (isRecorderOutputCanvasActive()) {
    drawFaceDebugOverlay(cw, ch);
  }
}

function drawCropGuides(cw, ch) {
  if (!el.showCropGuides.checked) {
    return;
  }
  const currentAspect = cw / ch;
  const guides = [];
  const GUIDE_ASPECTS = {
    "16:9": { ratio: 16 / 9, label: "16:9" },
    "9:16": { ratio: 9 / 16, label: "9:16" },
    "1:1": { ratio: 1, label: "1:1" }
  };
  for (const [key, info] of Object.entries(GUIDE_ASPECTS)) {
    if (Math.abs(info.ratio - currentAspect) < 0.01) {
      continue;
    }
    guides.push(info);
  }
  ctx.save();
  for (const guide of guides) {
    let gw, gh;
    if (guide.ratio > currentAspect) {
      gw = cw;
      gh = cw / guide.ratio;
    } else {
      gh = ch;
      gw = ch * guide.ratio;
    }
    const gx = (cw - gw) / 2;
    const gy = (ch - gh) / 2;
    ctx.setLineDash([10, 6]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx, gy, gw, gh);
    const fontSize = Math.max(11, Math.round(ch * 0.018));
    ctx.font = `600 ${fontSize}px "Chakra Petch", sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.setLineDash([]);
    ctx.fillText(guide.label, gx + 5, gy + 4);
  }
  ctx.restore();
}

function drawDisplayTrack(cw, ch) {
  const video = state.displayVideo;
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    drawIdleSlate();
    return;
  }

  const scale = Math.min(cw / video.videoWidth, ch / video.videoHeight);
  const width = video.videoWidth * scale;
  const height = video.videoHeight * scale;
  const x = (cw - width) / 2;
  const y = (ch - height) / 2;

  ctx.fillStyle = "#02040a";
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(video, x, y, width, height);
}

function drawCameraFullscreen(cw, ch) {
  const video = state.webcamVideo;
  if (!state.webcamStream || !video || video.readyState < 2 || !el.includeWebcam.checked) {
    drawDisplayTrack(cw, ch);
    return;
  }

  const source = getWebcamCropRect(video.videoWidth, video.videoHeight, cw / ch, "fullscreen");
  ctx.drawImage(video, source.sx, source.sy, source.sw, source.sh, 0, 0, cw, ch);
}

function drawWebcamOverlay(cw, ch) {
  const video = state.webcamVideo;
  if (!state.webcamStream || !video || video.readyState < 2 || !el.includeWebcam.checked) {
    return;
  }

  const shape = el.webcamShape.value;
  const sizePct = Number(el.webcamSize.value) / 100;
  const webcamAspect = video.videoWidth / video.videoHeight || 16 / 9;
  const width = Math.round(cw * sizePct);
  const isCircle = shape === "circle";
  const isRoundedSquare = shape === "rounded-square";
  const height = isCircle || isRoundedSquare ? width : Math.round(width / webcamAspect);
  const uiScale = Math.max(1, cw / 1280);
  const cornerRadius = isCircle ? width / 2 : Math.min(28 * uiScale, width * 0.16, height * 0.16);
  const faceCropEnabled = el.faceCrop.checked && Boolean(state.faceDetector);
  const trackingActive = faceCropEnabled && Date.now() - state.faceTarget.lastSeenAt < FACE_DETECTION_RECENT_MS;

  const clamped = clampOverlayPosition(state.overlay.x, state.overlay.y, width, height, cw, ch);
  state.overlay.x = clamped.x;
  state.overlay.y = clamped.y;
  state.overlay.width = width;
  state.overlay.height = height;

  const x = Math.round(state.overlay.x * cw);
  const y = Math.round(state.overlay.y * ch);

  const source = getWebcamCropRect(video.videoWidth, video.videoHeight, width / height, shape);
  const path = new Path2D();
  drawRoundedPath(path, x, y, width, height, cornerRadius);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 22;
  ctx.fillStyle = "rgba(12, 18, 28, 0.4)";
  ctx.fill(path);
  ctx.restore();

  ctx.save();
  ctx.clip(path);
  ctx.drawImage(video, source.sx, source.sy, source.sw, source.sh, x, y, width, height);
  ctx.restore();

  ctx.save();
  const borderSetting = el.webcamBorder.value;
  const borderColorMap = {
    green: "rgba(88, 208, 95, 0.95)",
    blue: "rgba(76, 182, 255, 0.95)",
    white: "rgba(240, 245, 250, 0.9)"
  };
  let resolvedBorderColor;
  if (borderSetting === "none") {
    resolvedBorderColor = null;
  } else if (faceCropEnabled) {
    resolvedBorderColor = trackingActive
      ? (borderColorMap[borderSetting] || borderColorMap.green)
      : "rgba(244, 201, 96, 0.95)";
  } else {
    resolvedBorderColor = borderColorMap[borderSetting] || borderColorMap.green;
  }
  if (resolvedBorderColor) {
    ctx.strokeStyle = resolvedBorderColor;
    ctx.lineWidth = 3 * uiScale;
    ctx.stroke(path);
  }

  ctx.restore();
}

function drawFaceTrackingStatusBadge(cw, ch) {
  if (!el.faceCrop.checked || !state.faceDetector || !state.webcamStream || !el.includeWebcam.checked) {
    return;
  }

  const uiScale = Math.max(1, cw / 1280);
  const trackingActive = Date.now() - state.faceTarget.lastSeenAt < FACE_DETECTION_RECENT_MS;
  const badgeText = trackingActive ? "Face Lock" : "Face Search";
  const overlayWidth = state.previewMode === "camera" ? cw : state.overlay.width;
  const overlayHeight = state.previewMode === "camera" ? ch : state.overlay.height;
  if (overlayWidth < 92 * uiScale || overlayHeight < 48 * uiScale) {
    return;
  }

  const overlayX = state.previewMode === "camera" ? 0 : Math.round(state.overlay.x * cw);
  const overlayY = state.previewMode === "camera" ? 0 : Math.round(state.overlay.y * ch);
  ctx.save();
  ctx.font = `600 ${Math.round(11 * uiScale)}px "IBM Plex Mono", monospace`;
  const textWidth = Math.ceil(ctx.measureText(badgeText).width);
  const badgeWidth = Math.min(overlayWidth - Math.round(12 * uiScale), textWidth + Math.round(16 * uiScale));
  const badgeHeight = Math.round(20 * uiScale);
  const badgeX = overlayX + Math.round(8 * uiScale);
  const badgeY = overlayY + overlayHeight - badgeHeight - Math.round(8 * uiScale);

  ctx.fillStyle = trackingActive ? "rgba(11, 44, 18, 0.88)" : "rgba(56, 41, 8, 0.9)";
  ctx.strokeStyle = trackingActive ? "rgba(114, 246, 136, 0.95)" : "rgba(255, 214, 122, 0.95)";
  ctx.lineWidth = 1.2 * uiScale;
  roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, Math.round(8 * uiScale));
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = trackingActive ? "#b8ffc4" : "#ffe1a2";
  ctx.fillText(badgeText, badgeX + Math.round(8 * uiScale), badgeY + Math.round(14 * uiScale));
  ctx.restore();
}

function getWebcamCropRect(videoW, videoH, targetAspect, shape = "rounded") {
  const autoCropEnabled = el.faceCrop.checked && state.faceDetector;
  let scale = state.faceRender.scale;
  let cx = state.faceRender.cx;
  let cy = state.faceRender.cy;

  if (!autoCropEnabled) {
    scale = 1;
    cx = 0.5;
    cy = 0.5;
  } else {
    scale = getAspectAwareFaceScale({
      fallbackScale: state.faceRender.scale,
      boxWidthRatio: state.faceRender.boxWidthRatio,
      boxHeightRatio: state.faceRender.boxHeightRatio,
      sourceAspect: videoW / videoH || 16 / 9,
      targetAspect,
      shape
    });
    cy += getFaceCompositionYOffset(shape, targetAspect, state.faceRender.boxHeightRatio, videoH);
  }

  let sw = Math.max(1, Math.min(videoW, videoW * scale));
  let sh = sw / targetAspect;
  if (sh > videoH) {
    sh = videoH;
    sw = sh * targetAspect;
  }

  if (autoCropEnabled) {
    const maxCropHeight = videoH * getFaceCompositionMaxCropHeightRatio(shape, targetAspect);
    if (sh > maxCropHeight) {
      sh = maxCropHeight;
      sw = sh * targetAspect;
    }
  }

  cx = clamp(cx, sw / (2 * videoW), 1 - sw / (2 * videoW));
  cy = clamp(cy, sh / (2 * videoH), 1 - sh / (2 * videoH));

  const sx = cx * videoW - sw / 2;
  const sy = cy * videoH - sh / 2;

  const crop = { sx, sy, sw, sh, cx, cy, targetAspect, shape };
  if (state.faceDebug.enabled) {
    state.faceDebug.lastCrop = {
      sx,
      sy,
      sw,
      sh,
      cx,
      cy,
      targetAspect,
      shape,
      videoWidth: videoW,
      videoHeight: videoH,
      autoCropEnabled: Boolean(autoCropEnabled)
    };
    state.faceDebug.lastRender = {
      cx: state.faceRender.cx,
      cy: state.faceRender.cy,
      scale: state.faceRender.scale,
      boxWidthRatio: state.faceRender.boxWidthRatio,
      boxHeightRatio: state.faceRender.boxHeightRatio
    };
  }

  return crop;
}

function getFaceCompositionYOffset(shape, targetAspect, boxHeightRatio, videoH) {
  if (!boxHeightRatio) {
    return 0;
  }

  let bias = FACE_TRACK_COMPOSITION_Y_BIAS_WIDE;
  if (shape === "circle") {
    bias = FACE_TRACK_COMPOSITION_Y_BIAS_CIRCLE;
  } else if (shape === "rounded-square" || targetAspect <= 1.08) {
    bias = FACE_TRACK_COMPOSITION_Y_BIAS_SQUARE;
  }

  return clamp(
    boxHeightRatio * bias + FACE_TRACK_COMPOSITION_EXTRA_RAISE_PX / Math.max(1, videoH || 0),
    0.012,
    bias + FACE_TRACK_COMPOSITION_EXTRA_RAISE_PX / Math.max(1, videoH || 0)
  );
}

function getFaceCompositionMaxCropHeightRatio(shape, targetAspect) {
  if (shape === "circle") {
    return FACE_TRACK_MAX_CROP_HEIGHT_RATIO_CIRCLE;
  }
  if (shape === "rounded-square" || targetAspect <= 1.08) {
    return FACE_TRACK_MAX_CROP_HEIGHT_RATIO_SQUARE;
  }
  if (targetAspect < 1.45) {
    return 0.97;
  }
  return FACE_TRACK_MAX_CROP_HEIGHT_RATIO_WIDE;
}

function installFaceDebugHooks() {
  window.__screenRecorderFaceDebug = {
    enabled: state.faceDebug.enabled,
    getSnapshot: () => getFaceDebugSnapshot()
  };
}

function getFaceDebugSnapshot() {
  return {
    buildId: SCREENRECORDER_BUILD_ID,
    enabled: state.faceDebug.enabled,
    backend: state.faceDebug.backend,
    trackingActive: state.faceDebug.trackingActive,
    lastMessage: state.faceDebug.lastMessage,
    lastDetectionAt: state.faceDebug.lastDetectionAt,
    sourceWidth: state.faceDebug.sourceWidth,
    sourceHeight: state.faceDebug.sourceHeight,
    trackSettings: cloneFaceDebugValue(state.faceDebug.trackSettings),
    lastDetection: cloneFaceDebugValue(state.faceDebug.lastDetection),
    lastAnchor: cloneFaceDebugValue(state.faceDebug.lastAnchor),
    lastCrop: cloneFaceDebugValue(state.faceDebug.lastCrop),
    lastRender: cloneFaceDebugValue(state.faceDebug.lastRender)
  };
}

function cloneFaceDebugValue(value) {
  if (!value || typeof value !== "object") {
    return value ?? null;
  }
  return JSON.parse(JSON.stringify(value));
}

function updateFaceDebugDetection({ message, width = 0, height = 0, face = null, anchor = null, backend = "" }) {
  if (!state.faceDebug.enabled) {
    return;
  }

  state.faceDebug.backend = backend || state.faceDebug.backend || "";
  state.faceDebug.trackingActive = Boolean(face?.boundingBox && anchor);
  state.faceDebug.lastMessage = message || "";
  state.faceDebug.lastDetectionAt = Date.now();
  state.faceDebug.sourceWidth = width || state.faceDebug.sourceWidth || 0;
  state.faceDebug.sourceHeight = height || state.faceDebug.sourceHeight || 0;
  const webcamTrack = state.webcamStream?.getVideoTracks?.()[0] || null;
  state.faceDebug.trackSettings = webcamTrack?.getSettings ? cloneFaceDebugValue(webcamTrack.getSettings()) : null;
  state.faceDebug.lastDetection = face
    ? {
        boundingBox: cloneFaceDebugValue(face.boundingBox || null),
        rawBoundingBox: cloneFaceDebugValue(face.rawBoundingBox || null),
        keypoints: cloneFaceDebugValue(face.keypoints || [])
      }
    : null;
  state.faceDebug.lastAnchor = anchor ? cloneFaceDebugValue(anchor) : null;
}

function logFaceDebug(reason) {
  if (!state.faceDebug.enabled) {
    return;
  }
  const now = Date.now();
  if (now - state.faceDebug.lastLogAt < FACE_DEBUG_LOG_INTERVAL_MS) {
    return;
  }
  state.faceDebug.lastLogAt = now;
  console.debug("[face-debug]", {
    buildId: SCREENRECORDER_BUILD_ID,
    reason,
    backend: state.faceDebug.backend,
    trackingActive: state.faceDebug.trackingActive,
    message: state.faceDebug.lastMessage,
    source: {
      width: state.faceDebug.sourceWidth,
      height: state.faceDebug.sourceHeight
    },
    trackSettings: state.faceDebug.trackSettings,
    detection: state.faceDebug.lastDetection,
    anchor: state.faceDebug.lastAnchor,
    crop: state.faceDebug.lastCrop,
    render: state.faceDebug.lastRender
  });
}

function drawFaceDebugOverlay(cw, ch) {
  if (!state.faceDebug.enabled || !state.webcamStream) {
    return;
  }

  const video = state.webcamVideo;
  const sourceWidth = state.faceDebug.sourceWidth || video?.videoWidth || 0;
  const sourceHeight = state.faceDebug.sourceHeight || video?.videoHeight || 0;
  const sourceAspect = sourceWidth && sourceHeight ? sourceWidth / sourceHeight : 16 / 9;
  const uiScale = Math.max(1, cw / 1280);
  const padding = Math.round(14 * uiScale);
  const frameWidth = Math.min(Math.round(280 * uiScale), Math.round(cw * 0.28));
  const frameHeight = Math.round(frameWidth / sourceAspect);
  const textLineHeight = Math.round(14 * uiScale);
  const panelHeight = frameHeight + padding * 2 + textLineHeight * 4 + Math.round(16 * uiScale);
  const panelX = cw - frameWidth - padding * 2 - Math.round(18 * uiScale);
  const panelY = Math.round(18 * uiScale);
  const frameX = panelX + padding;
  const frameY = panelY + padding + Math.round(18 * uiScale);
  const detection = state.faceDebug.lastDetection;
  const anchor = state.faceDebug.lastAnchor;
  const crop = state.faceDebug.lastCrop;

  ctx.save();
  ctx.fillStyle = "rgba(5, 9, 14, 0.88)";
  ctx.strokeStyle = "rgba(118, 180, 255, 0.4)";
  ctx.lineWidth = 1 * uiScale;
  roundRect(ctx, panelX, panelY, frameWidth + padding * 2, panelHeight, Math.round(12 * uiScale));
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#b8d8ff";
  ctx.font = `600 ${Math.round(12 * uiScale)}px "IBM Plex Mono", monospace`;
  ctx.fillText("Face Debug", frameX, panelY + padding + Math.round(2 * uiScale));

  ctx.fillStyle = "#0a1118";
  ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
  if (video && video.readyState >= 2 && video.videoWidth && video.videoHeight) {
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, frameX, frameY, frameWidth, frameHeight);
  }

  if (detection?.boundingBox && sourceWidth && sourceHeight) {
    const scaleX = frameWidth / sourceWidth;
    const scaleY = frameHeight / sourceHeight;
    const box = detection.boundingBox;
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 2 * uiScale;
    ctx.strokeRect(frameX + box.x * scaleX, frameY + box.y * scaleY, box.width * scaleX, box.height * scaleY);

    ctx.fillStyle = "#56f28a";
    for (const keypoint of detection.keypoints || []) {
      const kpX = frameX + normalizeDebugCoordinate(keypoint.x, sourceWidth) * frameWidth;
      const kpY = frameY + normalizeDebugCoordinate(keypoint.y, sourceHeight) * frameHeight;
      ctx.beginPath();
      ctx.arc(kpX, kpY, Math.max(2, 2.5 * uiScale), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (crop && sourceWidth && sourceHeight) {
    const scaleX = frameWidth / sourceWidth;
    const scaleY = frameHeight / sourceHeight;
    ctx.strokeStyle = "#51c7ff";
    ctx.lineWidth = 2 * uiScale;
    ctx.strokeRect(frameX + crop.sx * scaleX, frameY + crop.sy * scaleY, crop.sw * scaleX, crop.sh * scaleY);
  }

  if (anchor) {
    const anchorX = frameX + anchor.cx * frameWidth;
    const anchorY = frameY + anchor.cy * frameHeight;
    const radius = Math.max(5, 6 * uiScale);
    ctx.strokeStyle = "#5dff73";
    ctx.lineWidth = 1.5 * uiScale;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(anchorX - radius - 4 * uiScale, anchorY);
    ctx.lineTo(anchorX + radius + 4 * uiScale, anchorY);
    ctx.moveTo(anchorX, anchorY - radius - 4 * uiScale);
    ctx.lineTo(anchorX, anchorY + radius + 4 * uiScale);
    ctx.stroke();
  }

  const textY = frameY + frameHeight + Math.round(18 * uiScale);
  ctx.fillStyle = "#ecf5ff";
  ctx.font = `500 ${Math.round(11 * uiScale)}px "IBM Plex Mono", monospace`;
  ctx.fillText(`backend=${state.faceDebug.backend || "none"} msg=${state.faceDebug.lastMessage || "idle"}`, frameX, textY);
  ctx.fillText(formatFaceDebugBoxLine(detection?.boundingBox), frameX, textY + textLineHeight);
  ctx.fillText(formatFaceDebugAnchorLine(anchor), frameX, textY + textLineHeight * 2);
  ctx.fillText(formatFaceDebugCropLine(crop), frameX, textY + textLineHeight * 3);
  ctx.restore();
}

function formatFaceDebugBoxLine(box) {
  if (!box) {
    return "box=none";
  }
  return `box x=${formatFaceDebugNumber(box.x)} y=${formatFaceDebugNumber(box.y)} w=${formatFaceDebugNumber(box.width)} h=${formatFaceDebugNumber(box.height)}`;
}

function formatFaceDebugAnchorLine(anchor) {
  if (!anchor) {
    return "anchor=none";
  }
  return `anchor cx=${formatFaceDebugNumber(anchor.cx, 3)} cy=${formatFaceDebugNumber(anchor.cy, 3)}`;
}

function formatFaceDebugCropLine(crop) {
  if (!crop) {
    return "crop=none";
  }
  return `crop sx=${formatFaceDebugNumber(crop.sx)} sy=${formatFaceDebugNumber(crop.sy)} sw=${formatFaceDebugNumber(crop.sw)} sh=${formatFaceDebugNumber(crop.sh)}`;
}

function formatFaceDebugNumber(value, digits = 1) {
  return Number.isFinite(value) ? Number(value).toFixed(digits) : "n/a";
}

function normalizeDebugCoordinate(value, sourceSize) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (Math.abs(value) <= 1.5) {
    return value;
  }
  return value / Math.max(1, sourceSize);
}

function drawRoundedPath(path, x, y, width, height, radius) {
  if (radius >= width / 2 && radius >= height / 2) {
    path.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
    return;
  }

  path.moveTo(x + radius, y);
  path.lineTo(x + width - radius, y);
  path.quadraticCurveTo(x + width, y, x + width, y + radius);
  path.lineTo(x + width, y + height - radius);
  path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  path.lineTo(x + radius, y + height);
  path.quadraticCurveTo(x, y + height, x, y + height - radius);
  path.lineTo(x, y + radius);
  path.quadraticCurveTo(x, y, x + radius, y);
}


function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawIdleSlate() {
  const cw = el.previewCanvas.width;
  const ch = el.previewCanvas.height;
  const uiScale = Math.max(1, cw / 1280);
  ctx.fillStyle = "#060b10";
  ctx.fillRect(0, 0, cw, ch);

  ctx.strokeStyle = "rgba(39, 56, 66, 0.45)";
  ctx.lineWidth = 1 * uiScale;
  for (let x = 0; x < cw; x += Math.round(64 * uiScale)) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ch);
    ctx.stroke();
  }
  for (let y = 0; y < ch; y += Math.round(64 * uiScale)) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(88, 208, 95, 0.16)";
  ctx.fillRect(0, ch - Math.round(44 * uiScale), cw, Math.round(44 * uiScale));

  ctx.fillStyle = "rgba(231, 240, 245, 0.96)";
  ctx.font = `700 ${Math.round(36 * uiScale)}px "Chakra Petch", sans-serif`;
  ctx.fillText("Ready to Record", Math.round(48 * uiScale), ch / 2 - Math.round(10 * uiScale));

  ctx.fillStyle = "rgba(151, 172, 183, 0.95)";
  ctx.font = `500 ${Math.round(22 * uiScale)}px "Chakra Petch", sans-serif`;
  ctx.fillText("Choose screen, window, or tab to begin.", Math.round(48 * uiScale), ch / 2 + Math.round(28 * uiScale));
}

function startClock() {
  state.timing.startedAt = Date.now();
  state.timing.pausedAt = 0;
  state.timing.pausedTotal = 0;
  stopClock();
  state.timerHandle = setInterval(() => {
    el.timerText.textContent = formatTime(getElapsedMs());
    if (state.autoPauseActive) {
      updateSmartEditStatus();
    }
    updateDocumentTitle();
  }, 200);
  updateSmartEditStatus();
  updateDocumentTitle();
}

function stopClock() {
  if (state.timerHandle) {
    clearInterval(state.timerHandle);
  }
  state.timerHandle = 0;
  el.timerText.textContent = "00:00";
  updateSmartEditStatus();
  updateDocumentTitle();
}

function getElapsedMs() {
  if (!state.timing.startedAt) {
    return 0;
  }
  const anchor = state.phase === "paused" ? state.timing.pausedAt : Date.now();
  return Math.max(0, anchor - state.timing.startedAt - state.timing.pausedTotal);
}

function canAddMarker() {
  const recorderState = state.mediaRecorder?.state || "";
  return !state.isRestarting && !state.isStopping && (
    state.phase === "recording" ||
    state.phase === "paused" ||
    recorderState === "recording" ||
    recorderState === "paused"
  );
}

function updateMarkerButton() {
  if (!el.markerBtn) {
    return;
  }

  const count = state.markers.entries.length;
  const canMark = canAddMarker();
  el.markerBtn.textContent = count ? `Marker (${count})` : "Marker";
  el.markerBtn.disabled = !canMark;
  el.markerBtn.classList.toggle("btn-tool-ready", canMark);
  el.markerBtn.title = canMark ? "Add a cut marker now (M)" : "Start recording to place markers";
}

function setToggleState(labelEl, stateEl, { active, live, text }) {
  if (!labelEl || !stateEl) {
    return;
  }

  labelEl.classList.toggle("toggle-option-active", active);
  labelEl.classList.toggle("toggle-option-live", live);
  stateEl.textContent = text;
  stateEl.className = `toggle-state ${live ? "toggle-state-live" : active ? "toggle-state-on" : "toggle-state-off"}`;
}

function getTotalSkippedSilenceMs() {
  return state.silenceMonitor.segments.reduce((sum, segment) => sum + segment.durationMs, 0);
}

function getSilenceWindowLabel() {
  return el.silenceSeconds?.selectedOptions?.[0]?.textContent?.trim() || (el.silenceSeconds.value + " seconds");
}

function updateSmartEditStatus() {
  if (!el.smartEditStatus) {
    return;
  }

  const autoSkipEnabled = Boolean(el.autoSkipSilence?.checked);
  const transcriptionEnabled = Boolean(el.enableTranscription?.checked);
  const autoSkipLive = Boolean(state.autoPauseActive && state.phase === "paused");
  const transcriptionLive = Boolean(transcriptionEnabled && state.transcript.active && state.phase !== "idle");
  const skippedCount = state.silenceMonitor.segments.length;
  const skippedMs = getTotalSkippedSilenceMs();
  const liveSkipMs = autoSkipLive && state.silenceMonitor.currentSkipStartMs
    ? Math.max(0, Date.now() - state.silenceMonitor.currentSkipStartMs)
    : 0;
  const totalVisibleSkipMs = skippedMs + liveSkipMs;
  const markerCount = state.markers.entries.length;
  const markerReady = canAddMarker();

  setToggleState(el.autoSkipSilenceLabel, el.autoSkipSilenceState, {
    active: autoSkipEnabled,
    live: autoSkipLive,
    text: autoSkipLive ? "Trimming" : autoSkipEnabled ? "On" : "Off"
  });

  setToggleState(el.enableTranscriptionLabel, el.enableTranscriptionState, {
    active: transcriptionEnabled,
    live: transcriptionLive,
    text: transcriptionLive ? "Live" : transcriptionEnabled ? "On" : "Off"
  });

  const markerText = markerCount
    ? `${markerCount} marker${markerCount === 1 ? "" : "s"} added.`
    : markerReady
      ? "Marker button is ready."
      : "";

  let summary = "No smart editing tools armed.";
  if (autoSkipLive) {
    summary = `Auto Skip Silence is trimming now below ${el.silenceThreshold.value} dB. ${formatSeconds(totalVisibleSkipMs / 1000)} removed so far, including the active cut.`;
  } else if (autoSkipEnabled) {
    const removalText = skippedCount
      ? `${formatSeconds(totalVisibleSkipMs / 1000)} removed across ${skippedCount} cut(s).`
      : "No silence removed yet.";
    summary = `Auto Skip Silence is armed for pauses longer than ${getSilenceWindowLabel()} below ${el.silenceThreshold.value} dB. ${removalText}`;
  } else if (transcriptionEnabled) {
    summary = transcriptionLive ? "Live transcription is listening now." : "Live transcription is enabled for the next take.";
  }

  if (markerText) {
    summary += ` ${markerText}`;
  }

  el.smartEditStatus.textContent = summary.trim();
}

function setPhase(phase, label) {
  state.phase = phase;
  el.statusPill.textContent = label;
  el.statusPill.className = `pill ${phaseToPillClass(phase)}`;

  const startDisabled =
    !state.mediaRecorderSupported ||
    phase === "ready" ||
    phase === "recording" ||
    phase === "paused" ||
    state.isRecordingStarting ||
    state.isRestarting;
  const stopDisabled = phase === "idle";
  const pauseDisabled = !(phase === "recording" || phase === "paused") || state.isRestarting;
  const restartDisabled = !(phase === "recording" || phase === "paused") || state.isRestarting;

  const switchSourceDisabled = !(phase === "recording" || phase === "paused" || phase === "staged") || state.isRestarting;

  el.startBtn.disabled = startDisabled;
  el.stopBtn.disabled = stopDisabled;
  el.pauseBtn.disabled = pauseDisabled;
  el.restartBtn.disabled = restartDisabled;
  el.switchSourceBtn.disabled = switchSourceDisabled;
  el.pauseBtn.textContent = phase === "paused" ? "Resume" : "Pause";
  el.restartBtn.textContent = state.isRestarting ? "Restarting..." : "Restart Take";
  updateMarkerButton();
  const recordingConfigLocked = phase === "recording" || phase === "paused" || phase === "ready";
  el.outputResolution.disabled = recordingConfigLocked;
  el.recordingQuality.disabled = recordingConfigLocked;
  el.recordingCodec.disabled = recordingConfigLocked;

  if (phase === "idle") {
    el.startBtn.textContent = "Prepare Sources";
  } else if (phase === "staged") {
    el.startBtn.textContent = "Start Recording";
  } else if (phase === "ready") {
    el.startBtn.textContent = "Preparing...";
  }

  syncMicDependentControls();
  updateSmartEditStatus();
  updateDocumentTitle();
}

function phaseToPillClass(phase) {
  if (phase === "recording") {
    return "pill-recording";
  }
  if (phase === "paused") {
    return "pill-paused";
  }
  if (phase === "ready" || phase === "staged") {
    return "pill-ready";
  }
  return "pill-idle";
}

function getOptions() {
  return {
    countdownSeconds: Number(el.countdownSeconds.value),
    aspectRatio: el.aspectRatio.value,
    outputResolution: el.outputResolution.value,
    recordingQuality: el.recordingQuality.value,
    recordingCodec: el.recordingCodec.value,
    includeWebcam: el.includeWebcam.checked,
    includeMic: el.includeMic.checked,
    includeSystemAudio: el.includeSystemAudio.checked,
    voiceIsolation: el.voiceIsolation.checked,
    autoGainControl: el.autoGainControl.checked,
    noiseSuppression: el.noiseSuppression.checked,
    echoCancellation: el.echoCancellation.checked,
    micCompressor: el.micCompressor.checked,
    bassBoost250: el.bassBoost250.checked,
    autoSkipSilence: el.autoSkipSilence.checked,
    silenceSeconds: Number(el.silenceSeconds.value),
    silenceThreshold: Number(el.silenceThreshold.value),
    enableTranscription: el.enableTranscription.checked,
    transcriptionLang: el.transcriptionLang.value,
    cameraDeviceId: el.cameraDevice.value,
    micDeviceId: el.micDevice.value
  };
}

function getOutputResolutionPreset(value, aspectValue = el.aspectRatio ? el.aspectRatio.value : "16:9") {
  const sourceSize = refreshDisplaySourceSize();

  if (value === SOURCE_MATCH_VALUE) {
    return resolveSourceResolution(sourceSize);
  }

  if (OUTPUT_RESOLUTION_BASE[value]) {
    if (aspectValue === SOURCE_MATCH_VALUE) {
      return resolveResolutionForSourceAspect(value, sourceSize);
    }
    return resolveResolutionForAspect(value, aspectValue);
  }
  return resolveResolutionForAspect("1920x1080", aspectValue);
}

function getRecordingQualityPreset(value) {
  const preset = RECORDING_QUALITY_PRESETS[value] || RECORDING_QUALITY_PRESETS.balanced;
  return {
    ...preset,
    key: RECORDING_QUALITY_PRESETS[value] ? value : "balanced"
  };
}

function getRecordingCodecOption(value) {
  return RECORDING_CODEC_OPTIONS[value] || RECORDING_CODEC_OPTIONS.auto;
}

function applyOutputResolutionSelection({ redraw = true } = {}) {
  const preset = getOutputResolutionPreset(el.outputResolution.value);
  el.previewCanvas.width = preset.width;
  el.previewCanvas.height = preset.height;
  configureCanvasContext(ctx);
  syncCaptureCanvasSize();

  const clamped = clampOverlayPosition(
    state.overlay.x,
    state.overlay.y,
    state.overlay.width,
    state.overlay.height,
    preset.width,
    preset.height
  );
  state.overlay.x = clamped.x;
  state.overlay.y = clamped.y;
  state.renderClock.lastFrameAt = 0;

  if (redraw) {
    renderFrame();
    publishCleanFrameForRecording();
    drawPreviewOnlyOverlays(preset.width, preset.height);
    drawCropGuides(preset.width, preset.height);
  }
}

function estimateVideoBitrate(width, height, qualityValue = "balanced") {
  const quality = getRecordingQualityPreset(qualityValue);
  const basePixels = 1280 * 720;
  const targetPixels = Math.max(basePixels, width * height);
  const scaled = 8_000_000 * (targetPixels / basePixels) * quality.bitrateMultiplier;
  return Math.round(clamp(scaled, quality.minBitrate, quality.maxBitrate));
}

function estimateMegabytesPerMinute(videoBitsPerSecond, audioBitsPerSecond = 0) {
  return ((videoBitsPerSecond + audioBitsPerSecond) * 60) / 8_000_000;
}

function resolveRecorderConfig(options) {
  const quality = getRecordingQualityPreset(options.recordingQuality);
  const mimeChoice = pickMimeType(options.recordingCodec);
  const audioBitsPerSecond = state.outputStream?.getAudioTracks().length ? quality.audioBitrate : 0;
  return {
    qualityKey: quality.key,
    qualityLabel: quality.label,
    requestedCodec: options.recordingCodec,
    requestedCodecLabel: mimeChoice.requestedLabel,
    resolvedCodec: mimeChoice.key,
    resolvedCodecLabel: mimeChoice.label,
    mimeType: mimeChoice.mimeType,
    videoBitsPerSecond: estimateVideoBitrate(el.previewCanvas.width, el.previewCanvas.height, quality.key),
    audioBitsPerSecond,
    fallbackCodec: mimeChoice.fallbackCodec
  };
}

function updateOutputQualityHint() {
  if (!el.outputQualityHint) {
    return;
  }

  const preset = getOutputResolutionPreset(el.outputResolution.value);
  const quality = getRecordingQualityPreset(el.recordingQuality.value);
  const codec = pickMimeType(el.recordingCodec.value);
  const audioBitsPerSecond = el.includeMic.checked || el.includeSystemAudio.checked ? quality.audioBitrate : 0;
  const videoBitsPerSecond = estimateVideoBitrate(preset.width, preset.height, quality.key);
  const mbps = (videoBitsPerSecond / 1_000_000).toFixed(1);
  const sizePerMinute = estimateMegabytesPerMinute(videoBitsPerSecond, audioBitsPerSecond).toFixed(0);
  const codecSummary =
    el.recordingCodec.value !== "auto" && codec.fallbackCodec
      ? `${codec.requestedLabel} requested, ${codec.label} available`
      : codec.label;
  el.outputQualityHint.textContent =
    `${preset.label} • ${quality.label} • ${codecSummary} • about ${mbps} Mbps video (~${sizePerMinute} MB/min).`;
}

function onPointerDown(event) {
  if (state.previewMode !== "screen") {
    return;
  }

  if (!state.webcamStream) {
    return;
  }

  const point = pointerToCanvas(event);
  const left = state.overlay.x * el.previewCanvas.width;
  const top = state.overlay.y * el.previewCanvas.height;
  const right = left + state.overlay.width;
  const bottom = top + state.overlay.height;
  if (point.x < left || point.x > right || point.y < top || point.y > bottom) {
    return;
  }

  state.overlay.dragActive = true;
  state.overlay.dragOffsetX = point.x - left;
  state.overlay.dragOffsetY = point.y - top;
  el.previewCanvas.classList.add("dragging");
  el.previewCanvas.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (!state.overlay.dragActive) {
    return;
  }

  const point = pointerToCanvas(event);
  const canvasWidth = el.previewCanvas.width;
  const canvasHeight = el.previewCanvas.height;
  let nextX = (point.x - state.overlay.dragOffsetX) / canvasWidth;
  let nextY = (point.y - state.overlay.dragOffsetY) / canvasHeight;
  const clamped = clampOverlayPosition(
    nextX,
    nextY,
    state.overlay.width,
    state.overlay.height,
    canvasWidth,
    canvasHeight
  );
  state.overlay.x = clamped.x;
  state.overlay.y = clamped.y;
}

function onPointerUp(event) {
  if (!state.overlay.dragActive) {
    return;
  }
  state.overlay.dragActive = false;
  el.previewCanvas.classList.remove("dragging");
  try {
    el.previewCanvas.releasePointerCapture(event.pointerId);
  } catch {
    // no-op
  }
}

function pointerToCanvas(event) {
  const rect = el.previewCanvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (el.previewCanvas.width / rect.width),
    y: (event.clientY - rect.top) * (el.previewCanvas.height / rect.height)
  };
}

function clampOverlayPosition(x, y, width, height, canvasWidth, canvasHeight) {
  const margin = 10;
  const maxX = Math.max(margin, canvasWidth - width - margin) / canvasWidth;
  const maxY = Math.max(margin, canvasHeight - height - margin) / canvasHeight;
  return {
    x: clamp(x, margin / canvasWidth, maxX),
    y: clamp(y, margin / canvasHeight, maxY)
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const min = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;
  if (hours > 0) {
    return `${hours}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setPreviewMode(mode) {
  const wantsCamera = mode === "camera";
  if (wantsCamera && !el.includeWebcam.checked) {
    el.supportHint.textContent = "Enable Webcam to use Camera Fullscreen mode.";
    state.previewMode = "screen";
  } else {
    state.previewMode = wantsCamera ? "camera" : "screen";
  }

  applyActiveTrackContentHints();
  updatePreviewModeButtons();
  renderFrame();
  publishCleanFrameForRecording();
  drawPreviewOnlyOverlays(el.previewCanvas.width, el.previewCanvas.height);
  drawCropGuides(el.previewCanvas.width, el.previewCanvas.height);
  saveSettingsToStorage();
}

function updatePreviewModeButtons() {
  if (!el.showScreenBtn || !el.showCameraBtn) {
    return;
  }

  const cameraSelectable = el.includeWebcam.checked;
  el.showCameraBtn.disabled = !cameraSelectable;
  el.showScreenBtn.classList.toggle("mode-active", state.previewMode === "screen");
  el.showCameraBtn.classList.toggle("mode-active", state.previewMode === "camera");
}

function startAudioRenderHeartbeat(mixContext, sinkNode) {
  stopAudioRenderHeartbeat();
  if (!mixContext || !sinkNode) {
    return;
  }
  void startRenderHeartbeatGraph(mixContext, sinkNode);
}

function stopAudioRenderHeartbeat() {
  const source = state.renderClock.keepAliveSource;
  const gain = state.renderClock.keepAliveGain;
  const processor = state.renderClock.keepAliveProcessor;

  if (processor) {
    if (processor.port) {
      processor.port.onmessage = null;
    } else {
      processor.onaudioprocess = null;
    }
    processor.disconnect();
  }
  if (gain) {
    gain.disconnect();
  }
  if (source) {
    try {
      source.stop();
    } catch {
      // no-op
    }
    source.disconnect();
  }

  state.renderClock.keepAliveSource = null;
  state.renderClock.keepAliveGain = null;
  state.renderClock.keepAliveProcessor = null;
}

async function startRenderHeartbeatGraph(mixContext, sinkNode) {
  if (typeof AudioWorkletNode === "function" && mixContext.audioWorklet) {
    try {
      const heartbeat = await createAudioHeartbeatNode(mixContext, sinkNode, () => {
        if (state.phase === "idle") {
          return;
        }
        renderFrameForPipeline();
      }, 23);
      state.renderClock.keepAliveSource = heartbeat.source;
      state.renderClock.keepAliveGain = heartbeat.gain;
      state.renderClock.keepAliveProcessor = heartbeat.node;
      return;
    } catch (error) {
      console.warn("AudioWorklet heartbeat failed, falling back:", error);
    }
  }

  if (typeof mixContext.createScriptProcessor !== "function") {
    return;
  }

  const keepAliveSource = mixContext.createOscillator();
  const keepAliveGain = mixContext.createGain();
  const keepAliveProcessor = mixContext.createScriptProcessor(1024, 1, 1);

  keepAliveSource.type = "sine";
  keepAliveSource.frequency.value = 23;
  keepAliveGain.gain.value = 0;

  keepAliveSource.connect(keepAliveGain);
  keepAliveGain.connect(keepAliveProcessor);
  keepAliveProcessor.connect(sinkNode);

  keepAliveProcessor.onaudioprocess = () => {
    if (state.phase === "idle") {
      return;
    }
    renderFrameForPipeline();
  };

  keepAliveSource.start();
  state.renderClock.keepAliveSource = keepAliveSource;
  state.renderClock.keepAliveGain = keepAliveGain;
  state.renderClock.keepAliveProcessor = keepAliveProcessor;
}

function clearCountdown() {
  el.countdownOverlay.classList.add("hidden");
  el.countdownOverlay.textContent = "";
  state.countdownRemaining = 0;
  updateDocumentTitle();
}

function updateDocumentTitle() {
  const appTitle = "VDO.Ninja Screen Recorder";

  if (state.countdownRemaining > 0) {
    document.title = "Starting in " + state.countdownRemaining + " | " + appTitle;
    return;
  }

  if (state.phase === "recording") {
    document.title = "🔴 REC " + formatTime(getElapsedMs()) + " | " + appTitle;
    return;
  }

  if (state.phase === "paused") {
    document.title = "⏸ PAUSED " + formatTime(getElapsedMs()) + " | " + appTitle;
    return;
  }

  if (state.phase === "staged") {
    document.title = "Ready to Record | " + appTitle;
    return;
  }

  if (state.phase === "ready") {
    document.title = "Preparing Sources | " + appTitle;
    return;
  }

  document.title = defaultDocumentTitle;
}

function reportError(error) {
  console.error(error);
  let detail = "Capture failed.";
  if (error?.name === "NotAllowedError") {
    detail = "Permissions denied or picker canceled.";
  } else if (error?.name === "NotReadableError") {
    detail = "Capture device is busy.";
  } else if (error?.message) {
    detail = error.message;
  }
  el.supportHint.textContent = detail;
}

function isCancellation(error) {
  return error?.name === "AbortError" || error?.message === "Recording canceled" || state.cancelCountdown;
}

function isDisplayConstraintCompatibilityError(error) {
  if (!error) {
    return false;
  }

  if (error.name === "TypeError" || error.name === "OverconstrainedError") {
    return true;
  }

  const message = String(error.message || "");
  return /(constraint|unsupported|not supported|systemaudio|surfaceswitching)/i.test(message);
}

async function startFaceDetectionIfEnabled() {
  stopFaceDetection();
  state.faceDetectionDisabledReason = "";
  state.faceDetectionFailureCount = 0;
  const token = state.faceDetectionToken;

  if (!el.faceCrop.checked || !state.webcamStream || !hasFaceDetectionSupport()) {
    state.faceDetector = null;
    updateFaceCropStatus();
    return;
  }

  state.faceDetectionLoading = true;
  updateFaceCropStatus();

  try {
    const detector = await createFaceDetectorInstance();
    if (token !== state.faceDetectionToken || !el.faceCrop.checked || !state.webcamStream) {
      disposeFaceDetector(detector);
      return;
    }
    state.faceDetector = detector;
  } catch (error) {
    disableFaceDetection("Auto Face Crop could not start in this browser session. Toggle it off and on to retry.", error);
    return;
  } finally {
    if (token === state.faceDetectionToken) {
      state.faceDetectionLoading = false;
    }
  }

  updateFaceCropStatus();
  await startFaceDetectionHeartbeat(token);
  requestFaceDetectionTick(0);
}

function stopFaceDetection() {
  state.faceDetectionToken += 1;
  state.faceDetectBusy = false;
  state.faceDetectionLoading = false;
  stopFaceDetectionHeartbeat();
  disposeFaceDetector(state.faceDetector);
  state.faceDetector = null;
  state.faceDetectionFailureCount = 0;
  resetFaceTarget();
  updateFaceDebugDetection({ message: "stopped", backend: "" });
  updateFaceCropStatus();
}

function resetFaceTarget() {
  state.faceTarget.cx = 0.5;
  state.faceTarget.cy = 0.5;
  state.faceTarget.scale = 1;
  state.faceTarget.boxWidthRatio = 0;
  state.faceTarget.boxHeightRatio = 0;
  state.faceTarget.lastSeenAt = 0;
  state.faceRender.cx = 0.5;
  state.faceRender.cy = 0.5;
  state.faceRender.scale = 1;
  state.faceRender.boxWidthRatio = 0;
  state.faceRender.boxHeightRatio = 0;
  state.faceRender.lastStepAt = 0;
  if (state.faceDebug.enabled) {
    state.faceDebug.trackingActive = false;
    state.faceDebug.lastMessage = "reset";
    state.faceDebug.lastAnchor = null;
    state.faceDebug.lastCrop = null;
    state.faceDebug.lastRender = null;
    state.faceDebug.lastDetection = null;
  }
}

function getFaceDetectionFrame(video) {
  const sourceWidth = Math.max(1, Number(video?.videoWidth) || 0);
  const sourceHeight = Math.max(1, Number(video?.videoHeight) || 0);
  const longestEdge = Math.max(sourceWidth, sourceHeight);
  const scale = longestEdge > FACE_DETECTION_INPUT_MAX_DIMENSION
    ? FACE_DETECTION_INPUT_MAX_DIMENSION / longestEdge
    : 1;
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  let canvas = state.faceDetectionFrame.canvas;
  let context = state.faceDetectionFrame.context;
  if (!canvas) {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d", { alpha: false, desynchronized: true });
    state.faceDetectionFrame.canvas = canvas;
    state.faceDetectionFrame.context = context;
  }

  if (!context) {
    throw new Error("Unable to create face detection canvas context.");
  }

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  } else {
    context.clearRect(0, 0, width, height);
  }

  context.drawImage(video, 0, 0, sourceWidth, sourceHeight, 0, 0, width, height);
  state.faceDetectionFrame.width = width;
  state.faceDetectionFrame.height = height;
  return {
    surface: canvas,
    width,
    height
  };
}

async function createFaceDetectorInstance() {
  let nativeError = null;

  if (typeof window.FaceDetector === "function") {
    try {
      return createNativeFaceDetectorInstance();
    } catch (error) {
      nativeError = error;
    }
  }

  if (canUseMediaPipeFaceDetection()) {
    return createMediaPipeFaceDetectorInstance();
  }

  throw nativeError || new Error("No supported face detection backend is available.");
}

function createNativeFaceDetectorInstance() {
  const constructors = [
    () => new FaceDetector({ fastMode: true, maxDetectedFaces: 1 }),
    () => new FaceDetector({ maxDetectedFaces: 1 }),
    () => new FaceDetector()
  ];
  let lastError = null;

  for (const factory of constructors) {
    try {
      const nativeDetector = factory();
      return {
        kind: "native",
        async detect(source) {
          const { width, height } = getFaceDetectionSourceSize(source);
          return normalizeNativeFaceDetections(await nativeDetector.detect(source), width, height);
        },
        dispose() {}
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("FaceDetector construction failed.");
}

async function createMediaPipeFaceDetectorInstance() {
  const module = await loadMediaPipeVisionModule();
  const vision = await module.FilesetResolver.forVisionTasks(MEDIAPIPE_VISION_WASM_ROOT_URL);
  const detector = await module.FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MEDIAPIPE_FACE_MODEL_URL
    },
    runningMode: "VIDEO",
    minDetectionConfidence: 0.55,
    minSuppressionThreshold: 0.35
  });

  return {
    kind: "mediapipe",
    async detect(source) {
      const { width, height } = getFaceDetectionSourceSize(source);
      const timestampMs = Number.isFinite(source?.currentTime) ? Math.round(source.currentTime * 1000) : Math.round(performance.now());
      return normalizeMediaPipeDetections(detector.detectForVideo(source, timestampMs), width, height);
    },
    dispose() {
      if (typeof detector.close === "function") {
        detector.close();
      }
    }
  };
}

async function loadMediaPipeVisionModule() {
  if (!state.faceDetectorModulePromise) {
    state.faceDetectorModulePromise = import(MEDIAPIPE_VISION_BUNDLE_URL);
  }
  return state.faceDetectorModulePromise;
}

function getFaceDetectionSourceSize(source) {
  const width = Number(source?.videoWidth ?? source?.width ?? 0);
  const height = Number(source?.videoHeight ?? source?.height ?? 0);
  return {
    width: Math.max(1, width || 0),
    height: Math.max(1, height || 0)
  };
}

function normalizeMediaPipeDetections(result, sourceWidth, sourceHeight) {
  return (result?.detections || []).map((detection) => {
    const keypoints = normalizeFaceKeypoints(detection?.keypoints || [], sourceWidth, sourceHeight);
    const box = normalizeMediaPipeBoundingBox(detection?.boundingBox || {}, sourceWidth, sourceHeight, keypoints);
    return {
      boundingBox: box,
      rawBoundingBox: cloneMediaPipeBoundingBox(detection?.boundingBox || {}),
      keypoints
    };
  });
}

function normalizeNativeFaceDetections(faces, sourceWidth, sourceHeight) {
  return (faces || []).map((face) => {
    const rawBox = face?.boundingBox || {};
    return {
      boundingBox: {
        x: Number(rawBox.x ?? 0),
        y: Number(rawBox.y ?? 0),
        width: Number(rawBox.width ?? 0),
        height: Number(rawBox.height ?? 0)
      },
      keypoints: normalizeNativeFaceKeypoints(face?.landmarks || [], sourceWidth, sourceHeight)
    };
  });
}

function cloneMediaPipeBoundingBox(box) {
  return {
    originX: Number(box?.originX),
    originY: Number(box?.originY),
    x: Number(box?.x),
    y: Number(box?.y),
    xCenter: Number(box?.xCenter),
    yCenter: Number(box?.yCenter),
    width: Number(box?.width),
    height: Number(box?.height)
  };
}

function normalizeMediaPipeBoundingBox(box, sourceWidth, sourceHeight, keypoints = []) {
  const widthRaw = Number(box?.width ?? 0);
  const heightRaw = Number(box?.height ?? 0);
  const normalizedBox = widthRaw > 0 && widthRaw <= 1.5 && heightRaw > 0 && heightRaw <= 1.5;
  const width = normalizedBox ? widthRaw * Math.max(1, sourceWidth) : widthRaw;
  const height = normalizedBox ? heightRaw * Math.max(1, sourceHeight) : heightRaw;
  const keypointBounds = getFaceKeypointPixelBounds(keypoints, sourceWidth, sourceHeight);
  const xCandidates = getMediaPipeBoxAxisCandidates({
    directValues: [box?.originX, box?.x],
    centerValue: box?.xCenter,
    sourceSize: sourceWidth,
    size: width,
    normalizedBox
  });
  const yCandidates = getMediaPipeBoxAxisCandidates({
    directValues: [box?.originY, box?.y],
    centerValue: box?.yCenter,
    sourceSize: sourceHeight,
    size: height,
    normalizedBox
  });
  const x = chooseBestMediaPipeBoxAxisCandidate(
    xCandidates,
    width,
    keypointBounds ? { min: keypointBounds.left, max: keypointBounds.right } : null
  );
  const y = chooseBestMediaPipeBoxAxisCandidate(
    yCandidates,
    height,
    keypointBounds ? { min: keypointBounds.top, max: keypointBounds.bottom } : null
  );

  return {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0
  };
}

function getMediaPipeBoxAxisCandidates({ directValues = [], centerValue, sourceSize, size, normalizedBox }) {
  const candidates = [];

  for (const rawValue of directValues) {
    const direct = normalizeMediaPipeBoxValue(rawValue, sourceSize, normalizedBox);
    if (Number.isFinite(direct)) {
      candidates.push(direct);
      candidates.push(direct - size / 2);
    }
  }

  const center = normalizeMediaPipeBoxValue(centerValue, sourceSize, normalizedBox);
  if (Number.isFinite(center)) {
    candidates.push(center - size / 2);
  }

  return dedupeFiniteNumbers(candidates);
}

function normalizeMediaPipeBoxValue(value, sourceSize, normalizedBox) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return NaN;
  }
  if (normalizedBox || Math.abs(numericValue) <= 1.5) {
    return numericValue * Math.max(1, sourceSize);
  }
  return numericValue;
}

function chooseBestMediaPipeBoxAxisCandidate(candidates, size, keypointRange) {
  if (!candidates.length) {
    return 0;
  }
  if (!keypointRange || !Number.isFinite(keypointRange.min) || !Number.isFinite(keypointRange.max)) {
    return candidates[0];
  }

  const targetCenter = (keypointRange.min + keypointRange.max) / 2;
  let bestCandidate = candidates[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const boxMin = candidate;
    const boxMax = candidate + size;
    const overflow = Math.max(0, boxMin - keypointRange.min) + Math.max(0, keypointRange.max - boxMax);
    const centerError = Math.abs(candidate + size / 2 - targetCenter);
    const score = overflow * 8 + centerError;
    if (score < bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}

function getFaceKeypointPixelBounds(keypoints, sourceWidth, sourceHeight) {
  if (!Array.isArray(keypoints) || !keypoints.length || !sourceWidth || !sourceHeight) {
    return null;
  }

  const xs = [];
  const ys = [];
  for (const keypoint of keypoints) {
    if (!Number.isFinite(keypoint?.x) || !Number.isFinite(keypoint?.y)) {
      continue;
    }
    xs.push(keypoint.x * sourceWidth);
    ys.push(keypoint.y * sourceHeight);
  }

  if (!xs.length || !ys.length) {
    return null;
  }

  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys)
  };
}

function dedupeFiniteNumbers(values) {
  const unique = [];
  for (const value of values) {
    if (!Number.isFinite(value)) {
      continue;
    }
    if (unique.some((entry) => Math.abs(entry - value) < 0.5)) {
      continue;
    }
    unique.push(value);
  }
  return unique;
}

function normalizeFaceKeypoints(keypoints, sourceWidth = 0, sourceHeight = 0) {
  return (keypoints || [])
    .map((keypoint, index) => {
      const label = typeof keypoint?.label === "string" && keypoint.label
        ? keypoint.label
        : FACE_DETECTION_KEYPOINT_LABELS[index] || "";
      return {
        label,
        x: normalizeFaceKeypointCoordinate(keypoint?.x, sourceWidth),
        y: normalizeFaceKeypointCoordinate(keypoint?.y, sourceHeight)
      };
    })
    .filter((keypoint) => Number.isFinite(keypoint.x) && Number.isFinite(keypoint.y));
}

function normalizeFaceKeypointCoordinate(value, sourceSize) {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }
  if (Math.abs(numericValue) <= 1.5 || !sourceSize) {
    return numericValue;
  }
  return numericValue / Math.max(1, sourceSize);
}

function normalizeNativeFaceKeypoints(landmarks, sourceWidth, sourceHeight) {
  return (landmarks || [])
    .flatMap((landmark) => {
      const locations = Array.isArray(landmark?.locations) ? landmark.locations : [];
      if (!locations.length) {
        return [];
      }
      const point = locations[0];
      return [{
        label: String(landmark?.type || ""),
        x: Number(point?.x ?? 0) / Math.max(1, sourceWidth),
        y: Number(point?.y ?? 0) / Math.max(1, sourceHeight)
      }];
    })
    .filter((keypoint) => Number.isFinite(keypoint.x) && Number.isFinite(keypoint.y));
}

function disposeFaceDetector(detector) {
  if (!detector || typeof detector.dispose !== "function") {
    return;
  }
  try {
    detector.dispose();
  } catch (error) {
    console.warn("Face detector cleanup failed:", error);
  }
}

function disableFaceDetection(reason, error) {
  if (error) {
    console.warn("Disabling face detection:", error);
  }
  state.faceDetectBusy = false;
  state.faceDetectionLoading = false;
  stopFaceDetectionHeartbeat();
  disposeFaceDetector(state.faceDetector);
  state.faceDetector = null;
  state.faceDetectionDisabledReason = reason;
  state.faceDetectionFailureCount = 0;
  resetFaceTarget();
  updateFaceDebugDetection({ message: reason || "disabled", backend: "" });
  logFaceDebug("disabled");
  updateFaceCropStatus();
}

async function startFaceDetectionHeartbeat(token) {
  stopFaceDetectionHeartbeat();

  let context = state.faceClock.context;
  if (!context || context.state === "closed") {
    context = new AudioContext();
    state.faceClock.context = context;
  }
  if (context.state === "suspended") {
    await context.resume();
  }
  if (token !== state.faceDetectionToken) {
    return;
  }

  if (typeof AudioWorkletNode === "function" && context.audioWorklet) {
    try {
      const heartbeat = await createAudioHeartbeatNode(context, context.destination, () => {
        if (token !== state.faceDetectionToken || !state.faceDetector || !el.faceCrop.checked || !state.webcamStream) {
          return;
        }
        const nextTickAt = state.faceClock.nextTickAt;
        if (!nextTickAt) {
          return;
        }
        const now = performance.now();
        if (now + 1 < nextTickAt) {
          return;
        }
        state.faceClock.nextTickAt = 0;
        void runFaceDetectionTick(token);
      }, 31);
      state.faceClock.keepAliveSource = heartbeat.source;
      state.faceClock.keepAliveGain = heartbeat.gain;
      state.faceClock.keepAliveProcessor = heartbeat.node;
      return;
    } catch (error) {
      console.warn("Face detection AudioWorklet heartbeat failed, falling back:", error);
    }
  }

  if (typeof context.createScriptProcessor !== "function") {
    return;
  }

  const keepAliveSource = context.createOscillator();
  const keepAliveGain = context.createGain();
  const keepAliveProcessor = context.createScriptProcessor(1024, 1, 1);

  keepAliveSource.type = "sine";
  keepAliveSource.frequency.value = 31;
  keepAliveGain.gain.value = 0;

  keepAliveSource.connect(keepAliveGain);
  keepAliveGain.connect(keepAliveProcessor);
  keepAliveProcessor.connect(context.destination);

  keepAliveProcessor.onaudioprocess = () => {
    if (token !== state.faceDetectionToken || !state.faceDetector || !el.faceCrop.checked || !state.webcamStream) {
      return;
    }
    const nextTickAt = state.faceClock.nextTickAt;
    if (!nextTickAt) {
      return;
    }
    const now = performance.now();
    if (now + 1 < nextTickAt) {
      return;
    }
    state.faceClock.nextTickAt = 0;
    void runFaceDetectionTick(token);
  };

  keepAliveSource.start();
  state.faceClock.keepAliveSource = keepAliveSource;
  state.faceClock.keepAliveGain = keepAliveGain;
  state.faceClock.keepAliveProcessor = keepAliveProcessor;
}

function stopFaceDetectionHeartbeat() {
  const { keepAliveSource, keepAliveGain, keepAliveProcessor } = state.faceClock;

  if (keepAliveProcessor) {
    if (keepAliveProcessor.port) {
      keepAliveProcessor.port.onmessage = null;
    } else {
      keepAliveProcessor.onaudioprocess = null;
    }
    keepAliveProcessor.disconnect();
  }
  if (keepAliveGain) {
    keepAliveGain.disconnect();
  }
  if (keepAliveSource) {
    try {
      keepAliveSource.stop();
    } catch {
      // no-op
    }
    keepAliveSource.disconnect();
  }

  state.faceClock.keepAliveSource = null;
  state.faceClock.keepAliveGain = null;
  state.faceClock.keepAliveProcessor = null;
  state.faceClock.nextTickAt = 0;
}

let heartbeatWorkletModuleUrl = "";
const heartbeatWorkletLoads = new WeakMap();

async function createAudioHeartbeatNode(context, sinkNode, onPulse, frequency) {
  await ensureAudioHeartbeatWorklet(context);

  const source = context.createOscillator();
  const gain = context.createGain();
  const node = new AudioWorkletNode(context, AUDIO_HEARTBEAT_WORKLET_NAME);

  source.type = "sine";
  source.frequency.value = frequency;
  gain.gain.value = 0;

  node.port.onmessage = onPulse;
  source.connect(gain);
  gain.connect(node);
  node.connect(sinkNode);
  source.start();

  return { source, gain, node };
}

async function ensureAudioHeartbeatWorklet(context) {
  let loadPromise = heartbeatWorkletLoads.get(context);
  if (loadPromise) {
    return loadPromise;
  }

  if (!heartbeatWorkletModuleUrl) {
    heartbeatWorkletModuleUrl = URL.createObjectURL(
      new Blob([
        `class ScreenRecorderHeartbeatProcessor extends AudioWorkletProcessor {
          process(inputs, outputs) {
            const output = outputs[0];
            if (output) {
              for (const channel of output) {
                channel.fill(0);
              }
            }
            this.port.postMessage(0);
            return true;
          }
        }
        registerProcessor("${AUDIO_HEARTBEAT_WORKLET_NAME}", ScreenRecorderHeartbeatProcessor);`
      ], { type: "application/javascript" })
    );
  }

  loadPromise = context.audioWorklet.addModule(heartbeatWorkletModuleUrl).catch((error) => {
    heartbeatWorkletLoads.delete(context);
    throw error;
  });
  heartbeatWorkletLoads.set(context, loadPromise);
  return loadPromise;
}

function requestFaceDetectionTick(delayMs = getFaceDetectionIntervalMs()) {
  state.faceClock.nextTickAt = performance.now() + Math.max(0, delayMs);
}

function getFaceDetectionIntervalMs() {
  return Date.now() - state.faceTarget.lastSeenAt < FACE_DETECTION_RECENT_MS
    ? FACE_DETECTION_ACTIVE_INTERVAL_MS
    : FACE_DETECTION_SEARCH_INTERVAL_MS;
}

async function runFaceDetectionTick(token) {
  if (token !== state.faceDetectionToken) {
    return;
  }
  if (!state.faceDetector || !el.faceCrop.checked || !state.webcamStream) {
    updateFaceDebugDetection({ message: "inactive", backend: state.faceDetector?.kind || "" });
    updateFaceCropStatus();
    return;
  }
  if (state.faceDetectBusy) {
    requestFaceDetectionTick(24);
    return;
  }

  const video = state.webcamVideo;
  const webcamTrack = state.webcamStream.getVideoTracks()[0] || null;
  if (
    !video ||
    video.readyState < 2 ||
    !video.videoWidth ||
    !video.videoHeight ||
    !webcamTrack ||
    webcamTrack.readyState !== "live" ||
    webcamTrack.muted
  ) {
    updateFaceDebugDetection({
      message: "waiting-video",
      width: video?.videoWidth || 0,
      height: video?.videoHeight || 0,
      backend: state.faceDetector?.kind || ""
    });
    updateFaceCropStatus();
    requestFaceDetectionTick(48);
    return;
  }

  state.faceDetectBusy = true;
  try {
    const { faces, width, height } = await detectFacesFromVideoFrame(video);
    if (token !== state.faceDetectionToken) {
      return;
    }

    state.faceDetectionFailureCount = 0;
    const face = faces?.[0];
    const hit = face?.boundingBox;
    if (isValidFaceBoundingBox(hit)) {
      const anchor = getTrackedFaceAnchor(face, width, height);
      const targetScale = getTargetFaceScale(hit, width, height);
      const settledTarget = applyFaceTrackingDeadband(anchor, targetScale, hit, width, height);
      state.faceTarget.cx = settledTarget.cx;
      state.faceTarget.cy = settledTarget.cy;
      state.faceTarget.scale = settledTarget.scale;
      state.faceTarget.boxWidthRatio = hit.width / width;
      state.faceTarget.boxHeightRatio = hit.height / height;
      state.faceTarget.lastSeenAt = Date.now();
      updateFaceDebugDetection({
        message: "face-hit",
        width,
        height,
        face,
        anchor,
        backend: state.faceDetector?.kind || ""
      });
      logFaceDebug("face-hit");
    } else if (Date.now() - state.faceTarget.lastSeenAt > FACE_DETECTION_RECENT_MS) {
      state.faceTarget.scale = lerp(state.faceTarget.scale, 1, 0.08);
      state.faceTarget.cx = lerp(state.faceTarget.cx, 0.5, 0.08);
      state.faceTarget.cy = lerp(state.faceTarget.cy, 0.5, 0.08);
      state.faceTarget.boxWidthRatio = lerp(state.faceTarget.boxWidthRatio, 0, 0.1);
      state.faceTarget.boxHeightRatio = lerp(state.faceTarget.boxHeightRatio, 0, 0.1);
      updateFaceDebugDetection({
        message: "searching",
        width,
        height,
        backend: state.faceDetector?.kind || ""
      });
      logFaceDebug("searching");
    }
  } catch (error) {
    if (token !== state.faceDetectionToken) {
      return;
    }
    updateFaceDebugDetection({
      message: `error:${String(error?.message || error || "unknown")}`,
      width: video?.videoWidth || 0,
      height: video?.videoHeight || 0,
      backend: state.faceDetector?.kind || ""
    });
    logFaceDebug("error");
    if (!(await tryPromoteFaceDetectionFallback(error, token))) {
      handleFaceDetectionFailure(error);
    }
  } finally {
    if (token !== state.faceDetectionToken) {
      return;
    }
    state.faceDetectBusy = false;
    updateFaceCropStatus();
    if (state.faceDetector) {
      requestFaceDetectionTick();
    }
  }
}

async function detectFacesFromVideoFrame(video) {
  const frame = getFaceDetectionFrame(video);
  const faces = await state.faceDetector.detect(frame.surface);
  return {
    faces,
    width: frame.width,
    height: frame.height
  };
}

function isValidFaceBoundingBox(bounds) {
  return Boolean(
    bounds &&
      Number.isFinite(bounds.x) &&
      Number.isFinite(bounds.y) &&
      Number.isFinite(bounds.width) &&
      Number.isFinite(bounds.height) &&
      bounds.width > 1 &&
      bounds.height > 1
  );
}

function getTargetFaceScale(bounds, sourceWidth, sourceHeight) {
  const widthRatio = bounds.width / sourceWidth;
  const heightRatio = bounds.height / sourceHeight;
  return clamp(Math.max(widthRatio * 2.35, heightRatio * 2.1), 0.34, 1);
}

function applyFaceTrackingDeadband(anchor, targetScale, bounds, sourceWidth, sourceHeight) {
  const faceWidth = Number(bounds?.width ?? 0);
  const faceHeight = Number(bounds?.height ?? 0);
  const deadbandX = clamp(
    faceWidth * FACE_TRACK_POSITION_DEADBAND_FACE_RATIO,
    FACE_TRACK_POSITION_DEADBAND_MIN_PX,
    FACE_TRACK_POSITION_DEADBAND_MAX_PX
  ) / Math.max(1, sourceWidth);
  const deadbandY = clamp(
    faceHeight * FACE_TRACK_POSITION_DEADBAND_FACE_RATIO,
    FACE_TRACK_POSITION_DEADBAND_MIN_PX,
    FACE_TRACK_POSITION_DEADBAND_MAX_PX
  ) / Math.max(1, sourceHeight);

  return {
    cx: clamp(
      applyDeadband(state.faceTarget.cx, anchor.cx, deadbandX, {
        softZoneMultiplier: FACE_TRACK_POSITION_SOFT_ZONE_MULTIPLIER,
        softZoneResponse: FACE_TRACK_POSITION_SOFT_ZONE_RESPONSE
      }),
      0,
      1
    ),
    cy: clamp(
      applyDeadband(state.faceTarget.cy, anchor.cy, deadbandY, {
        softZoneMultiplier: FACE_TRACK_POSITION_SOFT_ZONE_MULTIPLIER,
        softZoneResponse: FACE_TRACK_POSITION_SOFT_ZONE_RESPONSE
      }),
      0,
      1
    ),
    scale: clamp(
      applyDeadband(state.faceTarget.scale, targetScale, FACE_TRACK_SCALE_DEADBAND, {
        softZoneMultiplier: FACE_TRACK_SCALE_SOFT_ZONE_MULTIPLIER,
        softZoneResponse: FACE_TRACK_SCALE_SOFT_ZONE_RESPONSE
      }),
      0.34,
      1
    )
  };
}

function applyDeadband(currentValue, nextValue, threshold, { softZoneMultiplier = 1, softZoneResponse = 1 } = {}) {
  if (!Number.isFinite(currentValue) || !Number.isFinite(nextValue) || threshold <= 0) {
    return nextValue;
  }

  const delta = nextValue - currentValue;
  const magnitude = Math.abs(delta);
  if (magnitude <= threshold) {
    return currentValue;
  }

  const direction = Math.sign(delta);
  const softThreshold = threshold * Math.max(1, softZoneMultiplier);
  const clampedResponse = clamp(softZoneResponse, 0.01, 1);

  if (magnitude <= softThreshold) {
    return currentValue + direction * (magnitude - threshold) * clampedResponse;
  }

  const softTravel = (softThreshold - threshold) * clampedResponse;
  const fastTravel = magnitude - softThreshold;
  return currentValue + direction * (softTravel + fastTravel);
}

function getTrackedFaceAnchor(face, sourceWidth, sourceHeight) {
  const bounds = face?.boundingBox || {};
  const keypoints = indexFaceKeypoints(face?.keypoints || []);
  const eyeMid = averageKeypoints(keypoints.leftEye, keypoints.rightEye);
  const cheekMid = averageKeypoints(keypoints.leftTragion, keypoints.rightTragion);
  const nose = keypoints.noseTip || null;
  const mouth = keypoints.mouth || null;

  const fallbackCx = (bounds.x + bounds.width / 2) / sourceWidth;
  const fallbackCy = (bounds.y + bounds.height * 0.46) / sourceHeight;
  let cx = fallbackCx;
  let cy = fallbackCy;

  let featureCx = fallbackCx;
  if (eyeMid && nose) {
    featureCx = lerp(eyeMid.x, nose.x, 0.55);
  } else if (eyeMid) {
    featureCx = eyeMid.x;
  } else if (nose) {
    featureCx = nose.x;
  }

  cx = featureCx;
  if (cheekMid) {
    cx = lerp(cx, cheekMid.x, 0.12);
  }

  if (eyeMid && mouth) {
    cy = eyeMid.y + (mouth.y - eyeMid.y) * 0.45;
  } else if (nose && eyeMid) {
    cy = eyeMid.y + (nose.y - eyeMid.y) * 0.65;
  } else if (nose && mouth) {
    cy = nose.y + (mouth.y - nose.y) * 0.28;
  } else if (nose) {
    cy = nose.y + (bounds.height / sourceHeight) * 0.07;
  }

  return {
    cx: clamp(cx, 0, 1),
    cy: clamp(cy, 0, 1)
  };
}

function indexFaceKeypoints(keypoints) {
  const indexed = {};
  for (const keypoint of keypoints) {
    const normalizedLabel = normalizeFaceKeypointLabel(keypoint?.label);
    if (!normalizedLabel || indexed[normalizedLabel]) {
      continue;
    }
    indexed[normalizedLabel] = {
      x: Number(keypoint.x),
      y: Number(keypoint.y)
    };
  }
  return indexed;
}

function normalizeFaceKeypointLabel(label) {
  const value = String(label || "").toLowerCase();
  if (!value) {
    return "";
  }
  if (value.includes("left") && value.includes("eye")) {
    return "leftEye";
  }
  if (value.includes("right") && value.includes("eye")) {
    return "rightEye";
  }
  if (value.includes("nose")) {
    return "noseTip";
  }
  if (value.includes("mouth")) {
    return "mouth";
  }
  if (value.includes("left") && (value.includes("tragion") || value.includes("ear"))) {
    return "leftTragion";
  }
  if (value.includes("right") && (value.includes("tragion") || value.includes("ear"))) {
    return "rightTragion";
  }
  return "";
}

function averageKeypoints(a, b) {
  if (a && b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  }
  return a || b || null;
}

function stepFaceRenderState(now = performance.now()) {
  const render = state.faceRender;
  const target = state.faceTarget;

  if (!render.lastStepAt) {
    render.cx = target.cx;
    render.cy = target.cy;
    render.scale = target.scale;
    render.boxWidthRatio = target.boxWidthRatio;
    render.boxHeightRatio = target.boxHeightRatio;
    render.lastStepAt = now;
    return;
  }

  const dtMs = clamp(now - render.lastStepAt, 0, 120);
  render.lastStepAt = now;

  if (!dtMs) {
    return;
  }

  const trackingActive = Date.now() - target.lastSeenAt < FACE_DETECTION_RECENT_MS;
  const positionAlpha = getSmoothingAlpha(dtMs, trackingActive ? FACE_RENDER_POSITION_HALFLIFE_MS : FACE_RENDER_SEARCH_HALFLIFE_MS);
  const scaleAlpha = getSmoothingAlpha(dtMs, trackingActive ? FACE_RENDER_SCALE_HALFLIFE_MS : FACE_RENDER_SEARCH_HALFLIFE_MS);

  render.cx = lerp(render.cx, target.cx, positionAlpha);
  render.cy = lerp(render.cy, target.cy, positionAlpha);
  render.scale = lerp(render.scale, target.scale, scaleAlpha);
  render.boxWidthRatio = lerp(render.boxWidthRatio, target.boxWidthRatio, scaleAlpha);
  render.boxHeightRatio = lerp(render.boxHeightRatio, target.boxHeightRatio, scaleAlpha);
}

function getSmoothingAlpha(dtMs, halfLifeMs) {
  if (dtMs <= 0) {
    return 1;
  }
  return 1 - Math.exp(-dtMs / Math.max(1, halfLifeMs));
}

function getAspectAwareFaceScale({ fallbackScale, boxWidthRatio, boxHeightRatio, sourceAspect, targetAspect, shape }) {
  if (!boxWidthRatio || !boxHeightRatio || !sourceAspect || !targetAspect) {
    return fallbackScale;
  }

  const coverage = getDesiredFaceCoverage(targetAspect, shape);
  const widthScale = boxWidthRatio / coverage.width;
  const heightScale = (boxHeightRatio * targetAspect) / (sourceAspect * coverage.height);
  return clamp(Math.max(fallbackScale, widthScale, heightScale), 0.34, 1);
}

function getDesiredFaceCoverage(targetAspect, shape) {
  if (shape === "circle") {
    return { width: 0.41, height: 0.5 };
  }
  if (shape === "rounded-square" || targetAspect <= 1.08) {
    return { width: 0.45, height: 0.57 };
  }
  if (targetAspect < 1.45) {
    return { width: 0.44, height: 0.61 };
  }
  return { width: 0.44, height: 0.65 };
}

async function tryPromoteFaceDetectionFallback(error, token) {
  if (
    token !== state.faceDetectionToken ||
    !state.faceDetector ||
    state.faceDetector.kind !== "native" ||
    !canUseMediaPipeFaceDetection() ||
    !shouldUseMediaPipeFallback(error)
  ) {
    return false;
  }

  state.faceDetectionLoading = true;
  updateFaceCropStatus();

  try {
    const fallbackDetector = await createMediaPipeFaceDetectorInstance();
    if (token !== state.faceDetectionToken || !el.faceCrop.checked || !state.webcamStream) {
      disposeFaceDetector(fallbackDetector);
      return true;
    }
    disposeFaceDetector(state.faceDetector);
    state.faceDetector = fallbackDetector;
    state.faceDetectionFailureCount = 0;
    state.faceDetectionDisabledReason = "";
    updateFaceDebugDetection({ message: "fallback-mediapipe", backend: fallbackDetector.kind });
    logFaceDebug("fallback-mediapipe");
    return true;
  } catch (fallbackError) {
    console.warn("Face detection fallback failed:", fallbackError);
    return false;
  } finally {
    if (token === state.faceDetectionToken) {
      state.faceDetectionLoading = false;
      updateFaceCropStatus();
    }
  }
}

function shouldUseMediaPipeFallback(error) {
  const detail = String(error?.message || error || "");
  return /not implemented|service unavailable|not supported|unavailable/i.test(detail);
}

function handleFaceDetectionFailure(error) {
  state.faceDetectionFailureCount += 1;

  if (state.faceDetectionFailureCount === 1 || state.faceDetectionFailureCount >= FACE_DETECTION_MAX_FAILURES) {
    console.warn("Face detection failed:", error);
  }

  if (state.faceDetectionFailureCount >= FACE_DETECTION_MAX_FAILURES) {
    disableFaceDetection("Auto Face Crop paused after repeated detector errors. Toggle it off and on to retry.");
  }
}

function pauseRecorder({ automatic, reason }) {
  if (!state.mediaRecorder || state.mediaRecorder.state !== "recording") {
    return;
  }

  state.mediaRecorder.pause();
  state.autoPauseActive = Boolean(automatic);
  state.timing.pausedAt = Date.now();
  state.transcript.interimText = "";
  renderTranscriptFeed();
  setPhase("paused", automatic ? "Silence Skip" : "Paused");

  if (reason) {
    el.supportHint.textContent = reason;
  }
  updateSmartEditStatus();
}

function resumeRecorder({ automatic }) {
  if (!state.mediaRecorder || state.mediaRecorder.state !== "paused") {
    return;
  }
  if (automatic && !state.autoPauseActive) {
    return;
  }

  state.mediaRecorder.resume();
  if (state.timing.pausedAt) {
    state.timing.pausedTotal += Date.now() - state.timing.pausedAt;
    state.timing.pausedAt = 0;
  }

  state.autoPauseActive = false;
  setPhase("recording", "Recording");
  if (automatic) {
    const skippedMs = getTotalSkippedSilenceMs();
    const skippedCount = state.silenceMonitor.segments.length;
    el.supportHint.textContent = skippedCount
      ? `Speech detected. Recording resumed after trimming ${formatSeconds(skippedMs / 1000)} across ${skippedCount} silence cut(s).`
      : "Speech detected. Recording resumed.";
  }
  updateSmartEditStatus();
}

async function startMicLevelMonitor() {
  stopMicLevelMonitor();

  if (!state.micStream?.getAudioTracks().length) {
    el.micLevelRow.style.display = "none";
    return;
  }

  const monitorContext = new AudioContext();
  if (monitorContext.state === "suspended") {
    await monitorContext.resume();
  }

  const source = monitorContext.createMediaStreamSource(state.micStream);
  const analyser = monitorContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.3;
  source.connect(analyser);

  state.micLevelMonitor.context = monitorContext;
  state.micLevelMonitor.source = source;
  state.micLevelMonitor.analyser = analyser;
  state.micLevelMonitor.buffer = new Float32Array(analyser.fftSize);

  el.micLevelRow.style.display = "";

  const poll = () => {
    if (!state.micLevelMonitor.analyser) {
      return;
    }

    state.micLevelMonitor.analyser.getFloatTimeDomainData(state.micLevelMonitor.buffer);
    const db = calculateRmsDb(state.micLevelMonitor.buffer);

    const minDb = -60;
    const maxDb = 0;
    const pct = Math.max(0, Math.min(100, ((db - minDb) / (maxDb - minDb)) * 100));

    el.micLevelBar.style.width = pct + "%";
    el.micLevelBar.classList.toggle("level-hot", db > -3);

    state.micLevelMonitor.raf = requestAnimationFrame(poll);
  };

  state.micLevelMonitor.raf = requestAnimationFrame(poll);
}

function stopMicLevelMonitor() {
  if (state.micLevelMonitor.raf) {
    cancelAnimationFrame(state.micLevelMonitor.raf);
  }
  state.micLevelMonitor.raf = 0;

  if (state.micLevelMonitor.context && state.micLevelMonitor.context.state !== "closed") {
    state.micLevelMonitor.context.close().catch(() => {});
  }

  state.micLevelMonitor.context = null;
  state.micLevelMonitor.source = null;
  state.micLevelMonitor.analyser = null;
  state.micLevelMonitor.buffer = null;

  el.micLevelBar.style.width = "0%";
  el.micLevelBar.classList.remove("level-hot");
  el.micLevelRow.style.display = "none";
}

async function startSilenceMonitorIfEnabled(options) {
  stopSilenceMonitor();
  if (!options.autoSkipSilence) {
    return;
  }

  if (!state.micStream?.getAudioTracks().length) {
    el.supportHint.textContent = "Auto skip silence requires microphone input.";
    return;
  }

  const monitorContext = new AudioContext();
  if (monitorContext.state === "suspended") {
    await monitorContext.resume();
  }

  const source = monitorContext.createMediaStreamSource(state.micStream);
  const analyser = monitorContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.2;
  source.connect(analyser);

  state.silenceMonitor.context = monitorContext;
  state.silenceMonitor.source = source;
  state.silenceMonitor.analyser = analyser;
  state.silenceMonitor.buffer = new Float32Array(analyser.fftSize);
  state.silenceMonitor.silenceSinceMs = 0;
  state.silenceMonitor.currentSkipStartMs = 0;

  const poll = () => {
    if (state.phase === "idle" || !state.silenceMonitor.analyser) {
      return;
    }

    const thresholdDb = Number(el.silenceThreshold.value);
    const silenceWindowMs = Number(el.silenceSeconds.value) * 1000;
    const nowMs = performance.now();

    state.silenceMonitor.analyser.getFloatTimeDomainData(state.silenceMonitor.buffer);
    const db = calculateRmsDb(state.silenceMonitor.buffer);

    if (db < thresholdDb) {
      if (!state.silenceMonitor.silenceSinceMs) {
        state.silenceMonitor.silenceSinceMs = nowMs;
      }

      const silenceFor = nowMs - state.silenceMonitor.silenceSinceMs;
      if (!state.autoPauseActive && state.phase === "recording" && silenceFor >= silenceWindowMs) {
        pauseRecorder({
          automatic: true,
          reason: "Silence below " + thresholdDb + " dB; pausing to skip dead air."
        });
        state.silenceMonitor.currentSkipStartMs = Date.now();
        updateSmartEditStatus();
      }
    } else {
      state.silenceMonitor.silenceSinceMs = 0;
      if (state.autoPauseActive && state.phase === "paused") {
        finishCurrentSilenceSegment();
        resumeRecorder({ automatic: true });
      }
    }

    state.silenceMonitor.raf = requestAnimationFrame(poll);
  };

  state.silenceMonitor.raf = requestAnimationFrame(poll);
}

function calculateRmsDb(floatData) {
  let sum = 0;
  for (let i = 0; i < floatData.length; i += 1) {
    const value = floatData[i];
    sum += value * value;
  }
  const rms = Math.sqrt(sum / floatData.length);
  if (rms < 0.00001) {
    return -100;
  }
  return 20 * Math.log10(rms);
}

function finishCurrentSilenceSegment() {
  if (!state.silenceMonitor.currentSkipStartMs) {
    return;
  }

  const endMs = Date.now();
  const durationMs = endMs - state.silenceMonitor.currentSkipStartMs;
  if (durationMs > 120) {
    state.silenceMonitor.segments.push({
      startMs: state.silenceMonitor.currentSkipStartMs,
      endMs,
      durationMs
    });
  }

  state.silenceMonitor.currentSkipStartMs = 0;
  updateSmartEditStatus();
}

function stopSilenceMonitor() {
  if (state.silenceMonitor.raf) {
    cancelAnimationFrame(state.silenceMonitor.raf);
  }
  state.silenceMonitor.raf = 0;

  if (state.silenceMonitor.context && state.silenceMonitor.context.state !== "closed") {
    state.silenceMonitor.context.close().catch(() => {
      // no-op
    });
  }

  state.silenceMonitor.context = null;
  state.silenceMonitor.source = null;
  state.silenceMonitor.analyser = null;
  state.silenceMonitor.buffer = null;
  state.silenceMonitor.silenceSinceMs = 0;
  state.silenceMonitor.currentSkipStartMs = 0;
  updateSmartEditStatus();
}

async function startTranscriptionIfEnabled(options) {
  await stopTranscription();
  if (!options.enableTranscription) {
    return;
  }

  if (!state.transcript.supported || !SpeechRecognitionCtor) {
    el.supportHint.textContent = "Live transcription is not supported in this browser.";
    return;
  }

  if (!state.micStream?.getAudioTracks().length) {
    el.supportHint.textContent = "Live transcription requires microphone access.";
    return;
  }

  const recognition = new SpeechRecognitionCtor();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = el.transcriptionLang.value;

  recognition.onresult = onTranscriptionResult;
  recognition.onerror = (event) => {
    console.warn("Transcription error:", event.error);
    if (event.error === "not-allowed") {
      el.supportHint.textContent = "Microphone permission is required for transcription.";
      state.transcript.shouldRestart = false;
    }
  };
  recognition.onend = () => {
    state.transcript.active = false;
    updateSmartEditStatus();
    if (state.transcript.shouldRestart && state.phase !== "idle") {
      try {
        recognition.start();
        state.transcript.active = true;
        updateSmartEditStatus();
      } catch {
        // Browser may require user gesture after repeated restarts.
      }
    }
  };

  state.transcript.recognition = recognition;
  state.transcript.shouldRestart = true;

  try {
    recognition.start();
    state.transcript.active = true;
    toggleTranscriptPanel(true);
    renderTranscriptFeed();
    updateSmartEditStatus();
  } catch (error) {
    console.warn("Unable to start transcription:", error);
    el.supportHint.textContent = "Unable to start transcription in this tab.";
    state.transcript.shouldRestart = false;
    updateSmartEditStatus();
  }
}

function onTranscriptionResult(event) {
  const shouldCaptureSpeech = state.phase === "recording";
  let interim = "";

  for (let i = event.resultIndex; i < event.results.length; i += 1) {
    const result = event.results[i];
    const text = result[0]?.transcript?.trim();
    if (!text) {
      continue;
    }

    if (result.isFinal) {
      if (!shouldCaptureSpeech) {
        continue;
      }
      state.transcript.entries.push({
        timeMs: getElapsedMs(),
        text
      });
    } else if (shouldCaptureSpeech) {
      interim = text;
    }
  }

  state.transcript.interimText = shouldCaptureSpeech ? interim : "";
  renderTranscriptFeed();
}

function addMarker() {
  if (!canAddMarker()) {
    return;
  }

  const markerNumber = state.markers.entries.length + 1;
  const timeMs = getElapsedMs();
  state.markers.entries.push({
    index: markerNumber,
    timeMs
  });
  updateMarkerButton();
  updateSmartEditStatus();
  el.supportHint.textContent = "Marker " + markerNumber + " added at " + formatTime(timeMs) + ".";
}

async function stopTranscription() {
  const recognition = state.transcript.recognition;
  state.transcript.shouldRestart = false;
  state.transcript.active = false;

  if (!recognition) {
    state.transcript.interimText = "";
    updateSmartEditStatus();
    return;
  }

  await new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) {
        return;
      }
      done = true;
      resolve();
    };

    recognition.onend = finish;

    try {
      recognition.stop();
    } catch {
      finish();
    }

    setTimeout(finish, 700);
  });

  state.transcript.recognition = null;
  state.transcript.interimText = "";
  renderTranscriptFeed();
  updateSmartEditStatus();
}

function renderTranscriptFeed() {
  if (!el.transcriptFeed) {
    return;
  }

  el.transcriptFeed.innerHTML = "";
  const entries = state.transcript.entries;
  const interimText = state.transcript.interimText;

  if (!entries.length && !interimText) {
    const empty = document.createElement("div");
    empty.className = "transcript-empty";
    empty.textContent = "No transcript yet. Enable Live Transcription to capture speech while recording.";
    el.transcriptFeed.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  const visibleEntries = entries.slice(-30);
  for (const entry of visibleEntries) {
    const line = document.createElement("div");
    line.className = "transcript-line";

    const time = document.createElement("span");
    time.className = "transcript-time";
    time.textContent = formatTime(entry.timeMs);

    const text = document.createElement("span");
    text.className = "transcript-text";
    text.textContent = entry.text;

    line.append(time, text);
    fragment.append(line);
  }

  if (interimText) {
    const line = document.createElement("div");
    line.className = "transcript-line transcript-interim";

    const time = document.createElement("span");
    time.className = "transcript-time";
    time.textContent = "live";

    const text = document.createElement("span");
    text.className = "transcript-text";
    text.textContent = interimText;

    line.append(time, text);
    fragment.append(line);
  }

  el.transcriptFeed.append(fragment);
}

function toggleTranscriptPanel(forceValue) {
  if (!el.transcriptPanel) {
    return;
  }

  const shouldShow =
    typeof forceValue === "boolean"
      ? forceValue
      : el.enableTranscription.checked || state.transcript.entries.length > 0 || Boolean(state.sessionExports.transcriptText);

  if (shouldShow) {
    el.transcriptPanel.classList.remove("hidden");
  } else {
    el.transcriptPanel.classList.add("hidden");
  }
}

function buildTranscriptExportText(videoFilename) {
  const entries = state.transcript.entries;
  const silenceSegments = state.silenceMonitor.segments;
  if (!entries.length && !silenceSegments.length) {
    return "";
  }

  const lines = [];
  lines.push("VDO.Ninja Screen Recorder Transcript");
  lines.push("Source: " + videoFilename);
  lines.push("Created: " + new Date().toISOString());
  lines.push("");

  if (silenceSegments.length) {
    const totalSkippedMs = silenceSegments.reduce((sum, segment) => sum + segment.durationMs, 0);
    lines.push("Auto Skip Silence: " + silenceSegments.length + " segment(s), " + formatSeconds(totalSkippedMs / 1000) + " removed.");
    lines.push("");
  }

  if (entries.length) {
    lines.push("Transcript:");
    for (const entry of entries) {
      lines.push("[" + formatTime(entry.timeMs) + "] " + entry.text);
    }
  }

  const smartHints = buildSmartEditHints(entries, silenceSegments);
  if (smartHints.length) {
    lines.push("");
    lines.push("Smart Edit Notes:");
    smartHints.forEach((hint, index) => {
      lines.push((index + 1) + ". " + hint);
    });
  }

  return lines.join("\n");
}

function buildMarkerExportText(videoFilename) {
  const markers = state.markers.entries;
  if (!markers.length) {
    return "";
  }

  const lines = [];
  lines.push("VDO.Ninja Screen Recorder Markers");
  lines.push("Source: " + videoFilename);
  lines.push("Created: " + new Date().toISOString());
  lines.push("Timeline: timestamps are relative to the exported recording.");
  lines.push("");
  lines.push("Markers:");
  for (const marker of markers) {
    lines.push("[" + formatTime(marker.timeMs) + "] Marker " + marker.index);
  }

  return lines.join("\n");
}

function buildSmartEditHints(entries, silenceSegments) {
  const hints = [];

  if (silenceSegments.length) {
    const totalSkippedMs = silenceSegments.reduce((sum, segment) => sum + segment.durationMs, 0);
    hints.push("Detected and removed " + formatSeconds(totalSkippedMs / 1000) + " of low-volume pauses.");
  }

  if (entries.length) {
    const text = entries.map((entry) => entry.text).join(" ").toLowerCase();
    const fillerPattern = /\b(um+|uh+|you know|sort of|kind of)\b/g;
    const fillerMatches = text.match(fillerPattern) || [];
    if (fillerMatches.length >= 3) {
      hints.push("Frequent filler words detected (" + fillerMatches.length + "). Consider trimming those clips.");
    }

    if (entries.length >= 6) {
      hints.push("Consider chapter markers every 3-5 transcript lines for faster tutorial navigation.");
    }
  }

  return hints;
}

function downloadTranscriptFromLastSession() {
  if (!state.sessionExports.transcriptText) {
    return;
  }

  const blob = new Blob([state.sessionExports.transcriptText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = state.sessionExports.transcriptFilename || "screenrecord-transcript.txt";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function formatSeconds(seconds) {
  return seconds.toFixed(1) + "s";
}

function lerp(from, to, alpha) {
  return from + (to - from) * alpha;
}
