---
description: Should 'up to' double the amount of playback video resolution
---

# \&sharper

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&solo`](and-solo.md))\
\* on [https://vdo.ninja/beta/](https://vdo.ninja/beta/) and [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&sharpen`
* ``[`&dpi=2`](../view-parameters/dpi.md)``

## Details

`&sharper` is now an alias of [`&dpi=2`](../view-parameters/dpi.md), which should 'up to' double the amount of playback video resolution, if the dynamic resolution optimization is enabled at least, in certain cases. This is a lot like [`&scale=100`](../view-parameters/scale.md), but perhaps _slightly_ more efficient in some cases. This is mainly for when you intend to have a large screen-share in a scene, where you don't want the tiny guest videos to be a 100% scale, but 50% scale is fine (up from 25% scale). [`&dpi`](../view-parameters/dpi.md) already exists on production, but by adding these aliases, I hope it's more discoverable.

As an alternative to `&sharper`, I've also added [`&sharperscreen`](and-sharperscreen.md), which sets [`&scale=100`](../view-parameters/scale.md), but _only_ for screen-shares (virtual cameras not included). This is probably even more efficient than [`&scale=100`](../view-parameters/scale.md) or `&sharper`, and it's designed for when screen-sharing a lot of text. Text looks a bit soft when streaming video at 1:1 pixel resolution.

It's recommended to only use these parameters within the context of a scene link, and not on guest links, due to the higher CPU / bandwidth it may use.

## Related

{% content-ref url="and-sharperscreen.md" %}
[and-sharperscreen.md](and-sharperscreen.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/dpi.md" %}
[dpi.md](../view-parameters/dpi.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/scale.md" %}
[scale.md](../view-parameters/scale.md)
{% endcontent-ref %}
