---
description: Adds a fixed extra delay to incoming audio in milliseconds
---

# \&audiodelay

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&audiodelay=1000`

| Value | Description |
| ----- | ----------- |
| Positive number | Fixed extra audio delay in milliseconds; decimals are accepted |
| `0`, negative, empty, or invalid value | Disabled |
| Above `179000` | Capped at 179000 ms (179 seconds) |
| Parameter omitted | Disabled by default |

## Details

`&audiodelay=1000` adds a fixed extra second to incoming audio on this viewer. Use it when audio consistently arrives ahead of video and you want a manual audio offset.

The viewer holds decoded audio in a Web Audio delay node. Its delay stays constant during playback: jitter, RTT, and buffer updates do not adjust this fixed offset. It applies to incoming audio streams processed by the viewer's audio pipeline.

This parameter does not request additional video buffering or change the WebRTC audio receiver's buffer target. The browser's normal audio buffering remains active. The value is an **additional audio delay**, not a target for total end-to-end latency.

### Examples

Add a fixed second to received audio:

```text
https://vdo.ninja/?view=STREAMID&audiodelay=1000
```

Add a fixed 150 ms offset to incoming audio in a scene:

```text
https://vdo.ninja/?room=ROOMNAME&scene=1&audiodelay=150
```

These examples require a VDO.Ninja build that includes this new option. Replace the hostname with your own deployment when using a locally hosted build.

### Interaction with other delay settings

* [`&sync`](../view-parameters/sync.md) enables adaptive audio compensation. `&audiodelay` works without it. If both are enabled, the fixed delay adds to the separately changing sync delay, so the total audio delay can still change.
* [`&buffer`](../view-parameters/buffer.md), [`&buffer2`](../video-parameters/and-buffer2.md), and [`&bufferaudio`](and-bufferaudio.md) retain their buffering behavior. Changing those targets does not change the fixed `audiodelay` offset.
* [`&buffer3`](../video-parameters/and-buffer3.md) automatically enables adaptive audio compensation. An additional `audiodelay` remains fixed, while that compensation continues separately.
* [`&micdelay`](../../source-settings/and-micdelay.md) is the existing **sender-side microphone delay**. Use `audiodelay` for received audio and `micdelay` for the outgoing microphone.
* [`&noap`](../../general-settings/noaudioprocessing.md) disables the viewer's Web Audio processing, including this fixed delay.

Set the value in the viewer URL before connecting. Reload the viewer to apply a different fixed delay; iframe `setBufferDelay` changes buffering, not this option.

The fixed delay cannot advance audio or recover audio packets already lost or discarded. For automatic alignment with changing video buffering, see [`&sync`](../view-parameters/sync.md) or experimental [`&buffer3`](../video-parameters/and-buffer3.md).
