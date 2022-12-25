---
description: >-
  Limits any guest viewer in the group chat room from pulling the video stream
  at more than the specified bitrate value
---

# \&roombitrate

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&roomvideobitrate`
* `&rbr`

## Options

| Value                         | Description                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| `0`                           | disables access to your video for other guests in a group room |
| (some positive integer value) | max. allowed bitrate                                           |

## Details

Limits any guest viewer in the group chat room from pulling the video stream at more than the specified bitrate value.

Does not impact what the director sees and does not limit the quality of what OBS has access to.\
This is like [`&maxvideobitrate`](and-maxvideobitrate.md), but `&roombitrate` only applies to fellow group room guests.\
Practically, a guest normally won't pull more than 1200-kbps and that's only if they click the HQ full-window button.

{% hint style="info" %}
Set to 600-kbps, 200-kbps, or 80-kbps if the goal is to reduce CPU load. (2x, 3x, or 4x down-scaling is applied at those bitrate limits)
{% endhint %}

## Related

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="and-controlroombitrate.md" %}
[and-controlroombitrate.md](and-controlroombitrate.md)
{% endcontent-ref %}

{% content-ref url="and-maxvideobitrate.md" %}
[and-maxvideobitrate.md](and-maxvideobitrate.md)
{% endcontent-ref %}
