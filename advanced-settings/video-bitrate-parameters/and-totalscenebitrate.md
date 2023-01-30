---
description: Max. video bitrate a scene uses
---

# \&totalscenebitrate

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&tsb`
* `&maxtotalscenebitrate`
* `&mtsb`

## Options

Example: `&totalscenebitrate=4000`

| Value           | Description                             |
| --------------- | --------------------------------------- |
| (integer value) | max. video bitrate in kbps a scene uses |

## Details

Mainly added to help offer another way to optimize performance and limit inbound bandwidth used, since why not.

This is similar to [`&totalroombitrate`](totalroombitrate.md), but `&totalscenebitrate` applies to scenes and faux-room scenes instead. That is, it splits the total bitrate available for playback by the number of videos in the scene. It's a way to keep the inbound bitrate below a certain threshold. If [`&videobitrate`](bitrate.md) is also used, [`&videobitrate`](bitrate.md) becomes a max limit on any individual video, so you can set `&totalscenebitrate=6000` and [`&videobitrate=2000`](bitrate.md), to keep all videos below 2-mbps each, but potentially go lower if more than 3 videos are present.

## Related

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="and-totalbitrate.md" %}
[and-totalbitrate.md](and-totalbitrate.md)
{% endcontent-ref %}

{% content-ref url="bitrate.md" %}
[bitrate.md](bitrate.md)
{% endcontent-ref %}
