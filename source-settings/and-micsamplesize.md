---
description: Sets the microphone capture sample size (bit depth)
---

# \&micsamplesize

Sender-Side Option! ([`&push`](push.md))

## Options

Example: `&micsamplesize=16`

| Value        | Description                             |
| ------------ | --------------------------------------- |
| Integer (bits) | Target mic sample size (e.g., 16, 24) |

## Details

- Capture constraint: requests `getUserMedia({ audio: { sampleSize } })` for the microphone.
- Support varies by browser and device; the constraint may be ignored if unsupported.
- Common value is 16-bit; higher values may not be honored.

## Related

{% content-ref url="and-micsamplerate.md" %}
[and-micsamplerate.md](and-micsamplerate.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/audio-parameters/minptime-1.md" %}
[audiocodec (PCM/Opus)](../advanced-settings/audio-parameters/minptime-1.md)
{% endcontent-ref %}

