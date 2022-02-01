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

This is similar to [`&totalroombitrate`](../advanced-settings/view-parameters/totalroombitrate.md), but `&maxtotalscenebitrate` applies to scenes and faux-room scenes instead. That is, it splits the total bitrate available for playback by the number of videos in the scene. It's a way to keep the inbound bitrate below a certain threshold. If [`&videobitrate`](../advanced-settings/view-parameters/bitrate.md) is also used, [`&videobitrate`](../advanced-settings/view-parameters/bitrate.md) becomes a max limit on any individual video, so you can set `&maxtotalscenebitrate=6000` and [`&videobitrate=2000`](../advanced-settings/view-parameters/bitrate.md), to keep all videos below 2-mbps each, but potentially go lower if more than 3 videos are present.

## Related

{% content-ref url="../advanced-settings/view-parameters/totalroombitrate.md" %}
[totalroombitrate.md](../advanced-settings/view-parameters/totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/bitrate.md" %}
[bitrate.md](../advanced-settings/view-parameters/bitrate.md)
{% endcontent-ref %}
