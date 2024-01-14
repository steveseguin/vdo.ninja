---
description: >-
  Keeps all incoming videos oriented (rotated) so that the aspect ratio is
  always above 1
---

# \&forceviewerlandscape (alpha)

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&forceviewerlandscape=90`

<table><thead><tr><th width="294">Value</th><th>Description</th></tr></thead><tbody><tr><td>(value in degrees)</td><td>value, how much the video is rotated in degree</td></tr><tr><td>(no value given)</td><td><code>270</code></td></tr><tr><td><code>180</code></td><td>locked upside down</td></tr></tbody></table>

## Details

`&forceviewerlandscape` keeps all **incoming** videos oriented (rotated) so that the [aspect ratio](../video-parameters/and-aspectratio.md) is always above 1, so effectively, forces landscape mode.

ie: [https://vdo.ninja/?forceviewerlandscape\&view=xxx](https://vdo.ninja/?forceviewerlandscape\&view=xxx)

This normally shouldn't be needed, as the sender side should control the orientation, but the native app seems to auto rotate back to portrait when the phone is locked. Until that is fixed, this can work around the issue I think, by rotating the video when it detects its been rotated.

The parameter can take a value, the default is `270`, which is how much the video is rotated. You might want to also use `90`, or in the case you want it to be locked upside down, you can technically pass `180` I guess?

## Related

{% content-ref url="../video-parameters/and-aspectratio.md" %}
[and-aspectratio.md](../video-parameters/and-aspectratio.md)
{% endcontent-ref %}

{% content-ref url="../mobile-parameters/and-forcelandscape.md" %}
[and-forcelandscape.md](../mobile-parameters/and-forcelandscape.md)
{% endcontent-ref %}
