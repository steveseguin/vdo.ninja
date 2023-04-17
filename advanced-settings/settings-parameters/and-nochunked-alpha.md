---
description: Will ignore the chunked version and use the low-latency version
---

# \&nochunked (alpha)

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Aliases

* `&nochunk`

## Details

If a VDO.Ninja guest has [`&chunked`](../../newly-added-parameters/and-chunked.md) added, the viewer or another guest can use `&nochunked` to ignore the chunked version, and use the low-latency version. In this way, guests in a room can still use the low latency streams to chat, but publish chunked video to OBS for (delayed) high quality video.

## Related

{% content-ref url="../../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
