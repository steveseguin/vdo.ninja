---
description: >-
  Video bitrate reduced when the video is not visible in OBS (not active in a
  scene)
---

# \&optimize

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

| Value            | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| (integer value)  | value in kbps                                                         |
| (no value given) | 600-kbps                                                              |
| `0`              | disables the video track when not considered visible in a scene (OBS) |

## Details

`&optimize` reduces the video bitrate to 600-kbps when the video is not visible in OBS (not active in a scene). This is mainly there to help with reducing load for OBS and for guests. It can take a few seconds for the bitrate to ramp back up after it becomes active again.

{% hint style="warning" %}
This does not work with iPhone-sourced video streams.
{% endhint %}

## Related

{% content-ref url="bitrate.md" %}
[bitrate.md](bitrate.md)
{% endcontent-ref %}
