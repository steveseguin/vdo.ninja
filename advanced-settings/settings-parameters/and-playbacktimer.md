---
description: Shows the viewer's elapsed video playback time as an overlay
---

# \&playbacktimer

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `?view=STREAMID&playbacktimer` or `?view=STREAMID&playbacktimer=3`

| Value | Description |
| --- | --- |
| No value given, or `7` | Enables the overlay in the bottom left |
| `1` - `9` | Enables the overlay at the corresponding position below |
| `0`, `false`, or `off` | Disables the overlay |

The overlay is disabled when the parameter is omitted. Positions follow the same layout as [`&timer`](and-timer.md) and [`&clock`](and-clock.md):

| | Left | Center | Right |
| --- | --- | --- | --- |
| Top | `1` | `2` | `3` |
| Middle | `4` | `5` | `6` |
| Bottom | `7` | `8` | `9` |

## Details

`&playbacktimer` displays the received video's elapsed playback time using the existing clock overlay styling. It stays visible when the video's control bar hides, and also works with [`&cleanoutput`](../design-parameters/cleanoutput.md).

The display updates about once a second in minutes and seconds, such as `02:15`. Minutes continue past 59; one hour appears as `60:00`.

This is the viewer's playback time, not the time since the publisher started broadcasting or OBS started encoding. Each viewer has their own playback timeline. Reloading the viewer starts a new playback timeline; reconnect behavior follows the video element's playback time.

The overlay stays hidden until a received video has started. If there are multiple received videos, it uses the first eligible video, with one overlay for the page. It hides when no eligible received video remains.

The playback overlay is independent of the clock and countdown timer, so they can be used together. Choose different positions to avoid overlapping them.

## Related

{% content-ref url="and-clock.md" %}
[and-clock.md](and-clock.md)
{% endcontent-ref %}

{% content-ref url="and-timer.md" %}
[and-timer.md](and-timer.md)
{% endcontent-ref %}
