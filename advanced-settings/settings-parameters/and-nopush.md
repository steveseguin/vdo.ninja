---
description: Blocks outbound publishing connections
---

# \&nopush

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../upcoming-parameters/and-solo.md))

## Aliases

* `&noseed`
* `&viewonly`
* `&viewmode`

## Details

To help avoid some types of connections showing up when using [`&showall`](../design-parameters/and-showall.md), I've also added a `&nopush` mode, which blocks outbound publishing connections. This acts a bit like a `&scene=1` link, so unless [`&showall`](../design-parameters/and-showall.md) is added, you'll need to use the IFRAME API to show/hide videos in it.

## Related

{% content-ref url="../design-parameters/and-showall.md" %}
[and-showall.md](../design-parameters/and-showall.md)
{% endcontent-ref %}
