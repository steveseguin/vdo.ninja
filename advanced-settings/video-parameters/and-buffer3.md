---
description: Experimental viewer buffering with brief audio fades around sync corrections
---

# \&buffer3

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&buffer3=500`

| Value | Description |
| ----- | ----------- |
| Nonnegative number | Requested buffer target in milliseconds |
| `0` or no value | Zero buffer target, with the buffer3 audio compensation mode enabled |
| Parameter omitted | Buffer3 is disabled by default |

## Details

`&buffer3` is an experimental alternative to [`&buffer`](../view-parameters/buffer.md) for normal WebRTC/RTP playback. It uses the existing buffer calculations and automatically enables [`&sync=0`](../view-parameters/sync.md). When audio compensation needs to change, it briefly fades audio out, steps the delay, and fades audio back in.

It is intended for situations where changing audio delay produces audible pitch wobble. This duck-and-splice behavior is part of `buffer3` itself; there is no additional toggle. The trade-off is a brief volume dip and potentially skipped or repeated audio during a correction.

### How audio compensation changes

* Differences within 10 ms are tolerated.
* A correction must remain necessary in the same direction for at least one second before a splice starts. Actual response timing also depends on the statistics update interval.
* A dedicated gain node fades audio to silence over 15 ms. The delay steps at 18 ms, while silent. Audio fades back in from 20 ms to 35 ms.
* The 35 ms envelope is scheduled on the audio clock with a short 10 ms lead.
* Splices cannot overlap. A fresh second of sustained error is required after a completed splice before another correction; returning within tolerance or reversing direction restarts that stability check.

The compensation delay now changes in steps, avoiding the gradual pitch bend of a delay ramp. **This is not an artifact-free or exact A/V synchronization guarantee.** Fades can be audible, particularly with music or repeated corrections. A large decrease skips audio and a large increase revisits older buffered audio; a 35 ms fade does not hide an arbitrarily large jump. The browser's own audio processing also remains active.

The native WebRTC audio and video buffering paths remain active, and measured jitter still affects the target. Buffer3 does not hold the entire requested audio delay at a fixed value. For a constant extra audio offset, use [`&audiodelay`](../audio-parameters/and-audiodelay.md).

### Examples

Request a 500 ms buffer target with the experimental audio compensation:

```text
https://vdo.ninja/?view=STREAMID&buffer3=500
```

Add an explicit 80 ms sync offset:

```text
https://vdo.ninja/?view=STREAMID&buffer3=500&sync=80
```

These examples require a VDO.Ninja build that includes this experimental option. Replace the hostname with your own deployment when using a locally hosted build.

### Interaction with other settings

* An explicit [`&sync`](../view-parameters/sync.md) value overrides the automatically selected zero offset. It still uses buffer3's duck-and-splice compensation.
* An explicit [`&audiobuffer`](../audio-parameters/and-bufferaudio.md) / `&bufferaudio` value retains its existing behavior.
* Buffer3 alone uses the normal `buffer` calculation without the extra RTT adjustment from [`&buffer2`](and-buffer2.md). If `buffer2` is also present, its RTT adjustment remains enabled.
* Prefer one buffer parameter per URL. When combined, a nonzero `buffer` value takes precedence over `buffer2`, which takes precedence over `buffer3`; the presence of `buffer3` still enables its audio compensation mode.
* [`&noap`](../../general-settings/noaudioprocessing.md) bypasses the Web Audio pipeline, so the duck-and-splice audio compensation cannot run. The browser buffer requests still apply.

Iframe [`setBufferDelay`](../../guides/iframe-api-documentation/iframe-api-basics.md) can change the target while connected. Audio follows using the same stability check and duck-and-splice correction.

### Limits

Normal WebRTC receiver buffer hints are clamped to 0-4000 ms. They are requests to the browser, so actual delay and settling time vary. Larger requests can add more audio delay without equivalent video delay; they are not a way to obtain synchronized long-delay playback.

The duck-and-splice correction described here applies to the RTP audio sync path. [`&chunked`](../../newly-added-parameters/and-chunked.md) playback retains its separate buffering controls and refresh behavior.

## Related

* [`&buffer`](../view-parameters/buffer.md) - Normal viewer buffering.
* [`&buffer2`](and-buffer2.md) - Buffering with an RTT adjustment.
* [`&sync`](../view-parameters/sync.md) - Adaptive audio compensation and an optional offset.
* [`&audiodelay`](../audio-parameters/and-audiodelay.md) - Fixed extra delay for incoming audio.
