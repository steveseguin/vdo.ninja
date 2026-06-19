# Audio Meter Pipeline Spec

## Legacy Behavior
- Inbound audio tracks enter `session.rpcs[UUID].inboundAudioPipeline` where `audioMeterGuest()` injects an `AnalyserNode` (`lib.js:46573-47782`).
- Loudness is computed by averaging FFT bins every 100 ms and mapped to DOM meters (`voiceMeter` elements) with style variants selected via `session.meterStyle` (`lib.js:47703-47771`).
- Meter values also feed optional features like `session.pushLoudness`, active-speaker highlighting, and iframe postMessage events.
- Meter UI updates live inside the analyser loop, coupling audio processing with DOM manipulation.

## Podcast Studio Requirements
1. **Per-track telemetry**: expose peak, RMS, and clip count per participant stream.
2. **Low-latency visuals**: 30–60 FPS updates for waveform bars in the studio shell, separate from DOM-heavy legacy meters.
3. **Extensible alerts**: thresholds for clipping, silence detection, and noisy floors.
4. **Headless access**: other modules (recording, AI markers) should subscribe without touching DOM.

## Proposed Architecture
```
MediaStreamTrack
  └─▶ MeterNode (AudioWorklet + SharedArrayBuffer)
        ├─▶ LevelBus.publish({ uuid, peak, rms, crest, clipped })
        └─▶ Optional legacy bridge updates DOM meters via event listener
Studio UI (podcast-shell)
  └─▶ subscribes to LevelBus for visual meters, notifications, analytics
Recording Service
  └─▶ listens for clip/silence to insert markers, trigger backups
```

### MeterNode Design
- Build an `AudioWorkletProcessor` (`core/meter.worklet.js`) that computes:
  - Instantaneous peak (max absolute sample).
  - RMS over 1024-sample windows.
  - Clipped sample counter (threshold > -1 dBFS).
- Post results through a `MessagePort` to the main thread every 32 ms, keeping GC pressure low.
- Provide `connect(stream, { uuid })` helper in `core/audio/meters.js`.

### Event Bus
- Introduce `LevelBus` as a lightweight `EventTarget` in `core/events/level-bus.js`.
- Emit `level` events with payload `{ uuid, trackId, peak, rms, clipped, timestamp }`.
- Legacy UI can attach a listener that maps to existing `voiceMeter` DOM updates until replaced.

### Thresholds & Alerts
- Default clip alert: `peak >= -1 dBFS` for three consecutive frames.
- Silence alert: `rms <= -60 dBFS` for >3 seconds.
- Provide `LevelPolicy` configuration for per-room overrides.

## Implementation Steps
1. Implement `MeterWorkletProcessor` and register via `audioContext.audioWorklet.addModule()`.
2. Wrap legacy `audioMeterGuest` to forward analyser metrics into `LevelBus` before modifying DOM.
3. Update podcast studio shell to subscribe for UI meters, enabling waveform/LED displays.
4. Expose metrics to recording service for embedding markers in local/remote tracks.
