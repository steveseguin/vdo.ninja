---
description: Adds an audio-latency to the published audio stream
---

# \&audiolatency

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Aliases

* `&latency`
* `&al`

## Options

| Value            | Description   |
| ---------------- | ------------- |
| (no value given) | 10 ms latency |
| (integer value)  | latency in ms |

## Details

This is an audio buffer for the microphone. Can be applied to the publisher of an audio stream. The browser default tends to be 10 milliseconds, but 20 or 30 might be a useful option to help reduce audio clicking caused by buffer underruns. The latency value sets the LatencyHint value of the WebAudio audioContext function.

Default is 10-ms (lowest also) and higher than like 100-ms is probably a bad idea (causes, not reduces, clicking).

That will upscale the sample rate and add a small latency buffer at the same time, so I hope that will help such issues before even hitting the webRTC pipeline
