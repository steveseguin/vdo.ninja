---
description: Tells a sender to provide a p2p stream, rather than a Meshcast stream
---

# \&nomeshcast (alpha)

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&solo`](../mixer-scene-parameters/and-solo.md))\
**ALPHA-ONLY** - Only available at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Details

`&nomeshcast` is a viewer-side option that tells a sender to provide a p2p stream, rather than a Meshcast stream, if they have [`&meshcast`](../../newly-added-parameters/and-meshcast.md) active. A bit of a niche option, but might be useful if bandwidth or latency is a consideration for a specific viewer, like the director.

## Related

{% content-ref url="../../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}
