---
description: Audio playback sample-rate, in hz
---

# \&samplerate

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&sr`

## Options

Example: `&samplerate=48000`

| Value           | Description       |
| --------------- | ----------------- |
| (integer value) | sample-rate in hz |

## Details

`&samplerate` sets the audio playback sample-rate in Hz (not capture or transmission sample-rate).

This is mainly for debugging audio distortion or clicking issues.

Sometimes it can remove clicking when used, even if set to the typical 48000 value.
