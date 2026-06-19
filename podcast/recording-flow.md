# Recording Flow Map

## High-Level Sequence
1. UI controls in `main.js` set up recording defaults from URL params and user actions (`recordLocalbutton`, `recordRemote` buttons). Key lines: `main.js:1841-1905`, `main.js:7364-7379`.
2. These controls call `recordLocalVideoToggle()` and `recordLocalVideo()` in `lib.js` to arm, start, and stop recordings (`lib.js:44903-45480`).
3. `recordLocalVideo()` configures a per-video recorder object that wraps `MediaRecorder`, local `WritableStream` writers, and optional Drive/Dropbox chunk handlers (`lib.js:45213-45480`).
4. When chunked/WebCodec capture is enabled, `recordLocalVideo()` delegates to the `session.webCodec` / `session.webCodecAudio` pipelines inside `webrtc.js` which stream encoded frames through `session.chunkedRecorder` (`webrtc.js:10877-13047`).
5. Recorder stop events fan out to cleanup functions, UI updates, and remote directors via `session.sendMessage` (`lib.js:45361-45466`).

## Detailed Call Graph
```
main.js UI Events
  └─▶ recordLocalVideoToggle(action?) (lib.js)
        ├─▶ recordLocalVideo('start' | 'stop', configureRecording?, remote?, altUUID?)
        │     ├─▶ setupRecorder(videoElement)
        │     │     ├─▶ new MediaRecorder(track mix)
        │     │     ├─▶ configure writer → video.recorder.writer (stream saver)
        │     │     ├─▶ bind `ondataavailable` → append blobs + dispatch cloud uploads
        │     │     └─▶ handle PCM/WebCodec fallbacks
        │     ├─▶ session.webCodec / session.webCodecAudio (webrtc.js) when `configureRecording` && chunking enabled
        │     │     └─▶ session.chunkedRecorder.enqueueFrame / sendChunks (WebSocket/WebTransport relays)
        │     └─▶ init Dropbox / Drive handlers (lib.js:45134-45212)
        └─▶ updateLocalRecordButton / updateRemoteRecordButton
```

## Data & Storage Paths
- **Local Mixdown**: Default `MediaRecorder` mux of mixed `MediaStream`. Saves locally via `video.recorder.writer` or triggers download prompts (`lib.js:45034-45300`).
- **Per-Chunk Cloud Upload**: When Drive/Dropbox connected, `addChunk` and `write` callbacks push each blob to remote APIs for redundancy (`lib.js:45263-45299`).
- **Chunked WebCodec**: High-fidelity pipeline builds encoded frames manually, tracks reliability metadata, and streams to relays (`webrtc.js:11192-12698`).

## Observed Pain Points
- Recorder is single-mix: we mix all remote audio/video into one stream before `MediaRecorder`, blocking isolated track capture.
- Recorder lifecycle interweaves UI state (`recordLocalbutton`) making headless reuse difficult.
- WebCodec chunker shares buffers for audio & video; multi-track audio will need new stream management and file packaging.

## Refactor Targets
- Extract recorder setup into `core/recording` service with explicit track selection.
- Decouple UI updates from recorder state via events, allowing alternate shells (podcast studio) to subscribe.
- Introduce multi-track pipeline that uses `session.peers[UUID].stream` assets and writes separate WAV files per participant before mixdown.
