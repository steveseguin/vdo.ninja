---
description: >-
  A detailed guide to VDO.Ninja's recording URL parameters, codec choices,
  container formats, browser compatibility, and tips for getting the best
  results across desktop and mobile.
---

# Recording Format Options and Settings

VDO.Ninja can record streams directly in the browser using the MediaRecorder API. This guide covers the recording-related URL parameters, codec and container format options, and the important differences between browsers and platforms.

***

## How Recording Works in VDO.Ninja

There are several ways to start a recording:

* **Right-click any video** and choose "Record to disk"
* **Use the Director control room** buttons (Record Local, Record Remote, Google Drive)
* **Add `&record` to a guest URL** to give them a dedicated record button
* **Use `&autorecord`** variants to start recording automatically on page load

When you start a recording (via right-click or director UI), a dialog appears with these options:

* **Use PCM audio format** — checkbox to record uncompressed audio
* **Audio-only recording** — checkbox to skip video
* **Bitrate slider** — adjustable from 50 to 10,000 kbps

> **Important:** There is no codec or container format selector in the recording dialog. The video codec must be set via URL parameter _before_ joining. The container format (WebM vs MP4) is chosen automatically based on your browser.

***

## URL Parameter Reference

| Parameter | Purpose | Default |
| --- | --- | --- |
| [`&record`](../advanced-settings/recording-parameters/and-record.md) | Enable recording / set bitrate | 4000 kbps |
| [`&autorecord`](../advanced-settings/recording-parameters/and-autorecord.md) | Auto-record local + remote on load | — |
| [`&autorecordlocal`](../advanced-settings/recording-parameters/and-autorecordlocal.md) | Auto-record local video only | — |
| [`&autorecordremote`](../advanced-settings/recording-parameters/and-autorecordremote.md) | Auto-record remote video(s) only | — |
| [`&recordcodec`](../advanced-settings/recording-parameters/and-recordcodec.md) (`&rc`) | Choose video codec | VP8 (Chromium), H.264 (Safari) |
| [`&pcm`](../advanced-settings/recording-parameters/and-pcm.md) | Record uncompressed PCM audio | off (uses Opus) |
| `&splitrecording` | Split recording into segments | 5 min |
| [`&recordmotion`](../advanced-settings/recording-parameters/and-recordmotion.md) | Snapshot on motion detection | sensitivity 15 |
| `&recordwindow` (`&rw`) | Record entire browser tab/scene | 6000 kbps |
| [`&chunked`](../newly-added-parameters/and-chunked.md) | Low-CPU chunked-transfer recording | ~2000 kbps |
| `&recordfolder` | Google Drive folder name for uploads | — |
| `&studioiso` | Enable/disable podcast studio isolated recording | on |
| `&framegrab` | Frame capture source URL | — |

***

## `&record` — The Core Parameter

Add `&record` to a guest/sender link to give them a record button, or use it with a value to set the recording bitrate.

| Value | Behaviour |
| --- | --- |
| _(no value)_ | Video + audio at 4000 kbps |
| Positive integer (e.g. `6000`) | Video + audio at that kbps |
| `0` | Audio-only, 32-bit PCM lossless |
| Negative integer (e.g. `-120`) | Audio-only, Opus at that kbps |
| `false` or `off` | Disable recording entirely (hides buttons, blocks remote triggering) |

When recording is started from the right-click menu or from the director panel without `&record` in the URL, the default bitrate is **6000 kbps**.

The Director can also start and stop recordings remotely for all guests via the director control room, using the "Record Local", "Record Remote", and batch "start all / stop all" buttons.

***

## Auto-Record Variants

These work exactly like `&record` but start recording automatically when the page loads — no user interaction required.

* **`&autorecord`** — records both local and all remote streams
* **`&autorecordlocal`** — records only your own local stream
* **`&autorecordremote`** — records only incoming remote streams

All accept the same bitrate values as `&record`.

***

## Choosing the Video Codec (`&recordcodec`)

Use `&recordcodec` (alias `&rc`) **in the URL** to choose which video codec the recording uses. This is the only way to select the codec — it cannot be changed from the recording dialog mid-session.

**Example:** `https://vdo.ninja/?push=abc123&record=6000&recordcodec=h264`

| Codec | Notes |
| --- | --- |
| `vp8` | Most compatible. Default fallback on Chromium browsers. Recommended for Android devices. |
| `vp9` | Better compression than VP8. Good for high-resolution recordings. |
| `h264` | Hardware-friendly. Default on Safari. May not work well when recording remote iOS streams on Chromium. |
| `av1` | Best compression. Limited browser and hardware support — requires AV1 hardware encoder on most devices. |

### Checking codec support and choosing wisely

A useful workflow is to use [https://vdo.ninja/codecs](https://vdo.ninja/codecs) to check which recording codecs and formats your browser supports, then set `&recordcodec` accordingly. For H.265/HEVC specifically, you can check support at [https://vdo.ninja/h265](https://vdo.ninja/h265).

If a guest's browser does not support the requested codec, VDO.Ninja falls back automatically to the browser's default (VP8 on Chromium, H.264 on Safari) — the recording will still work, just with a different codec than requested.

### How VDO.Ninja selects the codec internally

1. If `&recordcodec` is set, it checks if the browser supports that codec via `MediaRecorder.isTypeSupported()`
2. If supported, it uses it
3. If not supported, it falls back to the browser's default (VP8 on Chromium, H.264 on Safari)
4. On iOS/Safari, if the selected WebM mimeType is not supported at all, it falls back to `video/mp4` and saves as `.mp4`

> If you are getting recording errors, try `&recordcodec=vp8` — it is the most widely supported codec and avoids incompatible hardware encoder issues.

***

## Container Formats and Browser Differences

**You do not choose the container format** — VDO.Ninja selects it automatically based on what the browser supports. Different browsers and platforms produce different output files.

### Chromium Browsers (Chrome, Edge, Brave — Desktop and Android)

* **Container:** WebM (`.webm`)
* **Default video codec:** VP8
* **Default audio codec:** Opus
* **Also supports:** VP9, H.264, AV1 (hardware dependent)
* Chrome 114+ also has experimental MP4 container support, but VDO.Ninja uses WebM by default

### Firefox (Desktop and Android)

* **Container:** WebM (`.webm`)
* **Default video codec:** VP8
* **Default audio codec:** Opus
* **Also supports:** VP9

### Safari — Desktop macOS

**Safari before 18.4 (before 2025):**

* **Container:** MP4 (`.mp4`) — no WebM support at all
* **Video codec:** H.264 only
* **Audio codec:** AAC only
* Known bug: older Safari could report the mimeType as `video/webm` but actually output MP4/H.264 data

**Safari 18.4+ (2025 onwards):**

* **Container:** MP4 or WebM
* **Video codecs:** H.264, HEVC, VP8, VP9, AV1 (hardware dependent)
* **Audio codecs:** AAC, Opus, ALAC (lossless), PCM (lossless)

### iOS Safari (iPhone / iPad)

**iOS before 18.4:**

* **Container:** MP4 (`.mp4`) only
* **Video codec:** H.264 only
* **Audio codec:** AAC only
* WebM recording was completely unavailable

**iOS 18.4+:**

* Same expanded support as desktop Safari 18.4+ (WebM, VP8/VP9, Opus now available)

### Android Chrome

* Same as desktop Chrome — WebM container, VP8 default
* Hardware encoding availability varies by device chipset
* VP8 is recommended (`&recordcodec=vp8`) for older or lower-end Android devices

### Summary Table

| Platform / Browser | Container | Default Video | Default Audio |
| --- | --- | --- | --- |
| Chrome / Edge / Brave (desktop) | WebM | VP8 | Opus |
| Chrome (Android) | WebM | VP8 | Opus |
| Firefox (desktop / Android) | WebM | VP8 | Opus |
| Safari < 18.4 (macOS) | **MP4** | **H.264** | **AAC** |
| Safari 18.4+ (macOS) | MP4 (default) or WebM | H.264 (default) | AAC (default) |
| iOS Safari < 18.4 | **MP4** | **H.264** | **AAC** |
| iOS Safari 18.4+ | MP4 (default) or WebM | H.264 (default) | AAC (default) |

> You can check which codecs your specific browser supports at [https://vdo.ninja/codecs](https://vdo.ninja/codecs)

### What this means in practice

If you have a room with guests on different browsers, **your recordings may be in different formats**: a Chrome guest will produce `.webm` files while a Safari guest will produce `.mp4` files. This is normal and expected. The files can be converted afterward if needed.

***

## Audio Options

### Default Audio Bitrate Scaling

VDO.Ninja automatically adjusts audio bitrate based on video bitrate:

| Recording Bitrate | Audio Bitrate |
| --- | --- |
| Below 1000 kbps | 100 kbps |
| 1000–5999 kbps | 130 kbps |
| 6000–19999 kbps | 256 kbps |
| 20000+ kbps | Included in total bitrate |

### `&pcm` — Lossless Audio Recording

Adding `&pcm` to the URL records audio as uncompressed PCM instead of Opus. This is ideal for podcasting or music production where audio quality is critical.

You can also check the "Use PCM audio format" checkbox in the recording dialog when it appears.

* Works with any video codec (e.g. `video/webm;codecs=vp8,pcm`)
* Audio-only PCM is also supported (`audio/webm;codecs=pcm`)
* Convert PCM WebM files to standard WAV using the [vdo.ninja/convert](https://vdo.ninja/convert) tool

***

## Splitting Recordings (`&splitrecording`)

Automatically splits recordings into time-based segments to protect against data loss if the browser crashes.

| Value | Behaviour |
| --- | --- |
| _(no value)_ | 5-minute segments (Safari/iOS), 10-minute segments (other browsers) |
| Integer (e.g. `10`) | Segments of that many minutes (minimum 1) |

Files are saved with numbered suffixes (e.g. `recording.webm`, `recording.webm_1`, `recording.webm_2`).

**To reassemble segments:**

```bash
# Windows
copy /b recording.webm + recording.webm_1 + recording.webm_2 output.webm

# FFmpeg
ffmpeg -i "concat:recording.webm|recording.webm_1|recording.webm_2" -c copy output.webm
```

On mobile or laptop, VDO.Ninja will also auto-save the current segment at 2% battery.

> **Note:** On Safari and iOS, split recording is applied by default (5-minute segments) even without this parameter, due to Safari's memory management limitations with long recordings. Other browsers default to 10-minute segments when `&splitrecording` is used without a value.

***

## Scene/Window Recording (`&recordwindow`)

`&recordwindow` (alias `&rw`) captures the entire browser tab as a screen share and records it as a mixed output. Default bitrate is 6000 kbps. Useful for recording a composed scene with multiple guests.

***

## Chunked Mode (`&chunked`)

An alternative recording approach that writes encoded data directly without browser re-encoding — significantly lower CPU usage.

| Sub-parameter | Purpose |
| --- | --- |
| `&chunkprofile` | Device preset: `mobile`, `balanced`, `desktop` |
| `&chunkbuffer` | Playout buffer in ms |
| `&chunkadapt` | Adaptation strategy: `bitrate`, `framerate`, `hybrid` |
| `&chunkfec` | Forward error correction parity rate |

**Limitations:** Chromium browsers only, audio sync is not always guaranteed, no Meshcast support.

See the full [`&chunked` documentation](../newly-added-parameters/and-chunked.md) for details.

***

## Motion-Triggered Recording (`&recordmotion`)

Saves a PNG snapshot to disk whenever motion is detected in a video. Useful as a basic security camera.

* Value sets sensitivity threshold (default 15)
* Maximum 1 snapshot per second
* Best in Chrome/Chromium — not recommended inside OBS

***

## Podcast Studio Multitrack Recording

The VDO.Ninja Podcast Studio (`/podcast/`) has its own advanced recording system separate from the standard `&record` approach:

* **Multitrack recording** — records each participant as a separate audio track (48 kHz)
* **WAV encoder** — produces lossless WAV files per track, ideal for post-production
* **IndexedDB crash recovery** — recording chunks are persisted to IndexedDB every 30 seconds, so recordings can be recovered if the browser crashes
* **Cloud upload** — integrates with Google Drive and Dropbox for automatic upload during recording
* **`&studioiso`** — controls whether isolated disk recording is enabled (on by default)

This is a distinct recording pipeline from the standard `&record` system — it is designed specifically for podcast workflows where you need separate, high-quality audio tracks per guest.

***

## Screen Recorder App

VDO.Ninja includes a dedicated screen recorder at `/screenrecorder/` with its own recording options:

* **Capture modes:** Screen, window, or browser tab capture
* **Webcam overlay** with customizable position and size
* **Audio sources:** Microphone, system audio, or both
* **Audio processing:** Voice isolation, auto gain, noise suppression, echo cancellation, bass boost
* **Output resolution:** 720p, 1080p, 1440p, 4K
* **Aspect ratios:** 16:9, 9:16, 1:1
* **Quality presets:**
  * Smaller File (0.78x bitrate)
  * Balanced (1x)
  * High Detail (1.45x)
  * Archive/Master (2x)
* **Codec selection:** VP8, VP9, H.264, with WebM or MP4 container
* **Auto-silence skip** — automatically skips silent sections
* **Live transcription** — with downloadable `.txt` transcript
* **IndexedDB crash recovery**

The screen recorder has its own codec selector UI, unlike the main VDO.Ninja recording which requires URL parameters.

***

## Native iOS/Android App Recording

The VDO.Ninja native apps (Raspberry.Ninja-based) support recording while publishing, but with no configurable recording options — it is simply **on or off** while streaming. There are no codec, bitrate, or format choices in the native app recording. This is a separate implementation from the browser-based recording system.

***

## Frame/Snapshot Capture

VDO.Ninja can save individual video frames as images:

* **Right-click menu** — save a single frame from any video
* **`&framegrab`** — set a source URL for frame capture mode
* **`&framegrabaudio`** — include audio with frame grab
* **`&recordmotion`** — automatic PNG snapshots on motion detection (see above)

These are not full recordings, but can be useful for thumbnails, security snapshots, or quick captures.

***

## Google Drive / Cloud Recording

The Director control room has a dedicated "Google Drive" button per guest that lets directors have remote guests upload their recordings to Google Drive automatically. This records a local copy to disk while simultaneously streaming it to the cloud.

* **`&recordfolder=NAME`** — customize the Google Drive folder name for uploads
* Uploads use resumable chunked transfer (4 MB chunks)
* Batch recording supported — the director can start Google Drive recording for all guests at once

### Dropbox Integration

Dropbox upload is also available, using OAuth2 authentication. The director can enable Dropbox upload per guest during recording. Like Google Drive, it streams the recording to the cloud while also saving a local copy.

***

## Converting Recordings

Recordings saved as WebM may need conversion for use in some video editors (e.g. Premiere Pro, DaVinci Resolve).

### WebM to MP4 — often no video transcoding needed

When the recording uses H.264 video (`&recordcodec=h264`), converting between WebM and MP4 containers can be done **without transcoding the video** — it is just a container remux, which is nearly instant. However, if the audio is Opus (the default on Chromium), the audio will need to be transcoded to a format the MP4 container supports (e.g. AAC), since MP4 does not natively support Opus audio.

If the recording uses VP8 or VP9 video, the video itself will need to be transcoded to H.264 for MP4 compatibility.

### Conversion tools

* **[vdo.ninja/convert](https://vdo.ninja/convert)** — browser-based FFmpeg tool for small files (up to ~2 GB). Supports WebM to MP4 and WebM-PCM to WAV.
* **Desktop FFmpeg** — for larger files:

```bash
# H.264 WebM to MP4 — remux video, transcode Opus audio to AAC
ffmpeg -i recording.webm -c:v copy -c:a aac output.mp4

# VP8/VP9 WebM to MP4 — full transcode needed
ffmpeg -i recording.webm -c:v libx264 -c:a aac output.mp4

# PCM WebM to WAV — no transcoding
ffmpeg -i recording.webm -c:a copy output.wav
```

***

## Tips and Recommendations

* **To change the recording codec**, add `&recordcodec=vp8` (or `h264`, `vp9`, `av1`) to the URL before joining. There is no way to change it from the recording dialog.
* **For podcasts/interviews**, use `&pcm` for lossless audio and a high video bitrate (e.g. `&record=6000`).
* **For safety**, add `&splitrecording` to protect against browser crashes.
* **For low CPU**, consider `&chunked` mode (Chromium only).
* **Mixed browser rooms** will produce mixed formats — Chrome guests will save WebM files, Safari guests will save MP4. This is normal.
* **Safari < 18.4** only supports MP4/H.264/AAC. If your guests are on older Safari or iOS, the recording format cannot be changed.
* **Check your codecs** at [https://vdo.ninja/codecs](https://vdo.ninja/codecs) to see what your browser supports.

***

## Related Documentation

* [Recording Parameters Reference](../advanced-settings/recording-parameters/README.md)
* [Options to Record Streams](options-to-record-streams.md) — overview of all recording methods (OBS, headless, Raspberry.Ninja, etc.)
* [`&chunked` mode](../newly-added-parameters/and-chunked.md)
