---
description: Experimental viewer buffering with slower adaptive audio sync corrections
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

`&buffer3` is an experimental alternative to [`&buffer`](../view-parameters/buffer.md) for normal WebRTC/RTP playback. It uses the existing buffer calculations and automatically enables [`&sync=0`](../view-parameters/sync.md), with slower adjustments to the audio compensation delay.

It is intended for situations where frequently changing audio delay produces audible pitch wobble. The trade-off is slower correction when audio and video drift apart.

### How audio compensation changes

* Differences within 10 ms are tolerated.
* A correction must remain necessary in the same direction for at least one second before a new ramp starts. Actual response timing also depends on the statistics update interval.
* The audio delay changes at no more than 5 ms per second.
* When the requested correction reverses direction, the current ramp pauses while the new direction is observed.

This limits the pitch shift caused by adjusting the delay. **It does not eliminate pitch changes or guarantee exact A/V synchronization.** Large buffer changes can take many seconds or minutes to settle, leaving a temporary mismatch while audio catches up.

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

* An explicit [`&sync`](../view-parameters/sync.md) value overrides the automatically selected zero offset. It still uses buffer3's slower compensation.
* An explicit [`&audiobuffer`](../audio-parameters/and-bufferaudio.md) / `&bufferaudio` value retains its existing behavior.
* Buffer3 alone uses the normal `buffer` calculation without the extra RTT adjustment from [`&buffer2`](and-buffer2.md). If `buffer2` is also present, its RTT adjustment remains enabled.
* Prefer one buffer parameter per URL. When combined, a nonzero `buffer` value takes precedence over `buffer2`, which takes precedence over `buffer3`; the presence of `buffer3` still enables its audio compensation mode.
* [`&noap`](../../general-settings/noaudioprocessing.md) bypasses the Web Audio pipeline, so the slower audio compensation cannot run. The browser buffer requests still apply.

Iframe [`setBufferDelay`](../../guides/iframe-api-documentation/iframe-api-basics.md) can change the target while connected. Audio follows using the same slower correction rules.

### Limits

Normal WebRTC receiver buffer hints are clamped to 0-4000 ms. They are requests to the browser, so actual delay and settling time vary. Larger requests can add more audio delay without equivalent video delay; they are not a way to obtain synchronized long-delay playback.

The slower correction described here applies to the RTP audio sync path. [`&chunked`](../../newly-added-parameters/and-chunked.md) playback retains its separate buffering controls and refresh behavior.

## Related

* [`&buffer`](../view-parameters/buffer.md) - Normal viewer buffering.
* [`&buffer2`](and-buffer2.md) - Buffering with an RTT adjustment.
* [`&sync`](../view-parameters/sync.md) - Adaptive audio compensation and an optional offset.
* [`&audiodelay`](../audio-parameters/and-audiodelay.md) - Fixed extra delay for incoming audio.
