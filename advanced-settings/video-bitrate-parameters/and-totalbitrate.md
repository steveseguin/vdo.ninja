---
description: Shortcut that sets both &totalscenebitrate and &totalroombitrate
---

# \&totalbitrate

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Aliases

* `&tb`

## Options

Example: `&totalbitrate=3000`

<table><thead><tr><th width="245">Value</th><th>Description</th></tr></thead><tbody><tr><td>(integer value)</td><td>max. video bitrate in kbps a scene/room uses</td></tr></tbody></table>

## Details

`&totalbitrate` sets both [`&totalscenebitrate`](and-totalscenebitrate.md) and [`&totalroombitrate`](totalroombitrate.md) flags. It is a shortcut for cases where you want one total bitrate value to apply whether the link ends up acting as a scene/view link or a room link.

[`&totalscenebitrate`](and-totalscenebitrate.md) and [`&totalroombitrate`](totalroombitrate.md) limit the total incoming bitrate, dividing up the bandwidth available to each video being played back. There are nuances in differences, with the main one being [`&totalroombitrate`](totalroombitrate.md) is for a guest link and [`&totalscenebitrate`](and-totalscenebitrate.md) is for a scene/view link.

If you know the target, use the more specific parameter:

* Use [`&totalroombitrate`](totalroombitrate.md) or `&trb` for guest-to-guest room viewing.
* Use [`&totalscenebitrate`](and-totalscenebitrate.md) or `&tsb` for scene, solo, or view links.

## Related

{% content-ref url="and-totalscenebitrate.md" %}
[and-totalscenebitrate.md](and-totalscenebitrate.md)
{% endcontent-ref %}

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}
