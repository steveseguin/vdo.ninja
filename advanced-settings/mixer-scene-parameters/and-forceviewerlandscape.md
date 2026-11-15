---
description: >-
  Rotate incoming portrait video for a landscape scene.
---

# \&forceviewerlandscape (alpha)

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&forceviewerlandscape=90`

* **No value:** rotate a portrait feed by 270 degrees.
* **`90`:** rotate a portrait feed the other way.
* **`180`:** turn a portrait feed upside down. This does not make it landscape.

Try `90` or the default `270` and keep the one that puts your camera picture the right way up.

## Details

With the default value or `90`, `&forceviewerlandscape` rotates incoming portrait video into landscape. Video that is already landscape stays unchanged.

ie: [https://vdo.ninja/?forceviewerlandscape\&view=xxx](https://vdo.ninja/?forceviewerlandscape\&view=xxx)

Use this viewer option when an incoming feed rotates to portrait but your scene needs landscape. Check the sender's orientation and capture settings first; forcing the viewer orientation does not change the camera capture.

## Related

{% content-ref url="../video-parameters/and-aspectratio.md" %}
[and-aspectratio.md](../video-parameters/and-aspectratio.md)
{% endcontent-ref %}

{% content-ref url="../mobile-parameters/and-forcelandscape.md" %}
[and-forcelandscape.md](../mobile-parameters/and-forcelandscape.md)
{% endcontent-ref %}
