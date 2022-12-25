---
description: Sets both &totalscenebitrate and &totalroombitrate flags
---

# \&totalbitrate

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Aliases

* `&tb`

## Options

| Value           | Description                                  |
| --------------- | -------------------------------------------- |
| (integer value) | max. video bitrate in kbps a scene/room uses |

## Details

`&totalbitrate` sets both [`&totalscenebitrate`](and-totalscenebitrate.md) and [`&totalroombitrate`](totalroombitrate.md) flags. Not quite sure how well it will work, but since a scene and a guest are exclusive possibilities, it's a bit of a flexible way to just learn one flag to do it all, as I realize all the options can get confusing.

[`&totalscenebitrate`](and-totalscenebitrate.md) and [`&totalroombitrate`](totalroombitrate.md) limit the total incoming bitrate, dividing up the bandwidth available to each video being played back. There are nuances in differences, with the main one being [`&totalroombitrate`](totalroombitrate.md) is for a guest link and [`&totalscenebitrate`](and-totalscenebitrate.md) is for a scene/view link.

## Related

{% content-ref url="and-totalscenebitrate.md" %}
[and-totalscenebitrate.md](and-totalscenebitrate.md)
{% endcontent-ref %}

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}
