---
description: >-
  Video bitrate reduced when the video is not visible in OBS (not active in a
  scene)
---

# \&optimize

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Options

| Value            | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| (integer value)  | value in kbps                                               |
| (no value given) | 600                                                         |
| 0                | disables the video track when not considered visible in OBS |

## Details

Video bitrate reduced when the video is not visible in OBS (not active in a scene).\
This is mainly there to help with reducing load for OBS and for guests.\
This does not work with iPhone-sourced video streams.\
Can take a few seconds for the bitrate to ramp back up after it becomes active again.

## Related

{% content-ref url="bitrate.md" %}
[bitrate.md](bitrate.md)
{% endcontent-ref %}
