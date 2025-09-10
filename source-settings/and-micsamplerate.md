---
description: Sets the microphone capture sample rate (Hz)
---

# \&micsamplerate

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&msr`

## Options

Example: `&micsamplerate=48000`

| Value            | Description                                  |
| ---------------- | -------------------------------------------- |
| Integer (Hz)     | Target mic capture sample rate (e.g., 48000) |

## Details

- Capture constraint: requests `getUserMedia({ audio: { sampleRate } })` for the microphone.
- Typical values: 48000 (default), 44100, 32000, 16000. Browsers may clamp or ignore unsupported values.
- Encoding: Opus encodes at 48kHz internally; this setting mainly affects capture and any pre-encode processing.
- Do not confuse with:
  - [`&outboundsamplerate`](../advanced-settings/audio-parameters/and-outboundsamplerate.md): WebAudio processing context sample rate (publisher-side).
  - [`&samplerate`](../advanced-settings/view-parameters/and-samplerate.md): Playback sample rate (viewer-side PCM).

## Related

{% content-ref url="and-micsamplesize.md" %}
[and-micsamplesize.md](and-micsamplesize.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/audio-parameters/minptime-1.md" %}
[audiocodec (PCM/Opus)](../advanced-settings/audio-parameters/minptime-1.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/noaudioprocessing.md" %}
[noaudioprocessing.md](../general-settings/noaudioprocessing.md)
{% endcontent-ref %}

