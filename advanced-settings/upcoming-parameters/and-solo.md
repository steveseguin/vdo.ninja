---
description: Similar to &scene, but tells the system to be a solo-link
---

# \&solo

Viewer-Side Option! ([`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Details

`&solo` is used to bring a solo-link of a guest in a room into OBS Studio.\
[https://vdo.ninja/alpha/?view=streamid1\&room=roomname\&solo](https://vdo.ninja/alpha/?view=streamid1\&room=roomname\&solo)

This tells the system to only view `streamid1` in the specified room. `&solo` and [`&scene`](../view-parameters/scene.md) also tells the system not to be a publisher, but a viewer.

This parameter behaves just as [`&scene`](../view-parameters/scene.md). The only difference is, that the system does not apply custom 'layouts' to `&solo` links.

Links updates in the director's room from Version 22 onwards.

![](<../../.gitbook/assets/image (2).png>)

## Related

{% content-ref url="../view-parameters/scene.md" %}
[scene.md](../view-parameters/scene.md)
{% endcontent-ref %}
