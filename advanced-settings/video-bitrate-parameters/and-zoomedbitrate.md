---
description: >-
  Lets you set the target bitrate for a guest when they 'zoom in' (fullscreen)
  on a video
---

# \&zoomedbitrate

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&zb`

## Options

Example: `&zoomedbitrate=2000`

| Value            | Description                                    |
| ---------------- | ---------------------------------------------- |
| (no value given) | zoomed bitrate = 2500-kbps instead of 600-kbps |
| (integer value)  | zoomed bitrate in kbps                         |

## Details

Lets you set the target bitrate for a guest in a room when they 'zoom in' on a video using the full-window icon in the top-right of a video.

The idea is, you might want to still have a group call, but occasionally share a high resolution screen. This will increase the load a lot on the guest who is being zoomed-in on, but it's an option if increasing [`&totalroombitrate`](totalroombitrate.md) is not acceptable.

Using the flag unset increases the bitrate from 600-kbps to 2500-kbps.

## Related

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}
