---
description: Music or jingles sound thin, ducked, or distorted
---

# Music sounds suppressed or ducked

Voice‑focused DSP (AEC/AGC/denoise) can degrade music. Options:

- Disable processing: Add `&noaudioprocessing` to source links to bypass WebAudio DSP entirely.
- Manual control: Turn off voice DSP on sources with `&aec=0&agc=0&denoise=0`.
- Pro audio: `&proaudio` disables echo‑cancellation and preserves stereo; re‑enable noise controls only if needed.
- Stereo: Use `&stereo` (or `&screensharestereo` for screen shares) where appropriate for stereo program audio.
- Monitor paths: Avoid OS enhancements or virtual devices that add processing.

Example

- `...?push=MyID&proaudio&aec=0&agc=0&denoise=0&stereo`

Related

- `general-settings/noaudioprocessing.md`
- `source-settings/aec.md`
- `source-settings/autogain.md`
- `source-settings/and-denoise.md`
- `advanced-settings/audio-parameters/and-proaudio.md`
