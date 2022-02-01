---
description: Max. video bitrate a scene uses
---

# \&maxtotalscenebitrate

## Aliases

* `&mtsb`
* `&totalscenebitrate`
* `&tsb`

## Options

| Value           | Description                             |
| --------------- | --------------------------------------- |
| (integer value) | max. video bitrate in kbps a scene uses |

## Details

Mainly added to help offer another way to optimize performance and limit inbound bandwidth used, since why not.

This is similar to [`&totalroombitrate`](../viewers-settings/totalroombitrate.md), but `&maxtotalscenebitrate` applies to scenes and faux-room scenes instead. That is, it splits the total bitrate available for playback by the number of videos in the scene. It's a way to keep the inbound bitrate below a certain threshold. If [`&videobitrate`](../viewers-settings/bitrate.md) is also used, [`&videobitrate`](../viewers-settings/bitrate.md) becomes a max limit on any individual video, so you can set `&maxtotalscenebitrate=6000` and [`&videobitrate=2000`](../viewers-settings/bitrate.md), to keep all videos below 2-mbps each, but potentially go lower if more than 3 videos are present.

## Related

{% content-ref url="../viewers-settings/totalroombitrate.md" %}
[totalroombitrate.md](../viewers-settings/totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="../viewers-settings/bitrate.md" %}
[bitrate.md](../viewers-settings/bitrate.md)
{% endcontent-ref %}
