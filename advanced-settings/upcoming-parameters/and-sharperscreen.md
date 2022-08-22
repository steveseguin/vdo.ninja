---
description: Sets &scale=100, but only for screen-shares
---

# \&sharperscreen

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Details

As an alternative to [`&sharper`](and-sharper.md), I've also added `&sharperscreen`, which sets [`&scale=100`](../view-parameters/scale.md), but _only_ for screen-shares (virtual cameras not included). This is probably even more efficient than [`&scale=100`](../view-parameters/scale.md) or `&sharper`, and it's designed for when screen-sharing a lot of text. Text looks a bit soft when streaming video at 1:1 pixel resolution.

It's recommended to only use these parameters within the context of a scene link, and not on guest links, due to the higher CPU / bandwidth it may use.

## Related

{% content-ref url="and-sharper.md" %}
[and-sharper.md](and-sharper.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/dpi.md" %}
[dpi.md](../view-parameters/dpi.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/scale.md" %}
[scale.md](../view-parameters/scale.md)
{% endcontent-ref %}
