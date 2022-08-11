---
description: Sets both &totalscenebitrate and &totalroombitrate flags
---

# \&totalbitrate

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md))\
\* on [https://vdo.ninja/beta/](https://vdo.ninja/beta/)

## Aliases

* `&tb`

## Options

| Value           | Description                                  |
| --------------- | -------------------------------------------- |
| (integer value) | max. video bitrate in kbps a scene/room uses |

## Details

`&totalbitrate` sets both [`&totalscenebitrate`](../../newly-added-parameters/and-maxtotalscenebitrate.md) and [`&totalroombitrate`](../view-parameters/totalroombitrate.md) flags. Not quite sure how well it will work, but since a scene and a guest are exclusive possibilities, it's a bit of a flexible way to just learn one flag to do it all, as I realize all the options can get confusing.

[`&totalscenebitrate`](../../newly-added-parameters/and-maxtotalscenebitrate.md) and [`&totalroombitrate`](../view-parameters/totalroombitrate.md) limit the total incoming bitrate, dividing up the bandwidth available to each video being played back. There are nuances in differences, with the main one being [`&totalroombitrate`](../view-parameters/totalroombitrate.md) is for a guest link and [`&totalscenebitrate`](../../newly-added-parameters/and-maxtotalscenebitrate.md) is for a scene/view link.

## Related

{% content-ref url="../../newly-added-parameters/and-maxtotalscenebitrate.md" %}
[and-maxtotalscenebitrate.md](../../newly-added-parameters/and-maxtotalscenebitrate.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/totalroombitrate.md" %}
[totalroombitrate.md](../view-parameters/totalroombitrate.md)
{% endcontent-ref %}
