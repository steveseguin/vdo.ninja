---
description: Similar to &scene, but tells the system to be a solo-link
---

# \&solo

Viewer-Side Option! ([`&room`](../../general-settings/room.md))

## Details

`&solo` is used to bring a solo-link of a guest in a room into OBS Studio.\
[https://vdo.ninja/?view=streamid1\&room=roomname\&solo](https://vdo.ninja/?view=streamid1\&room=roomname\&solo)

This tells the system to only view `streamid1` in the specified room. `&solo` and [`&scene`](../view-parameters/scene.md) also tells the system not to be a publisher, but a viewer.

This parameter behaves just as [`&scene`](../view-parameters/scene.md). The only difference is, that the system does not apply custom 'layouts' to `&solo` links.

Links updates in the director's room from Version 22 onwards.

![](<../../.gitbook/assets/image (1) (3) (1) (1).png>)



### Alternative using \&optimize=0&#x20;

If using a normal manual scene, such as \&scene=3, you can add [\&optimize=0](and-solo.md#alternative-using-and-optimize-0) to the scene URL to enable a mode that is similar to \&solo. It's one of a few different ways to have permanent generic scene links that you can place specific guests into with varying stream IDs. There's also slots, however \&optimize=0 is tweaked for low CPU and network usage, at the cost of a slight added delay in adding a guest to the scene

## Related

{% content-ref url="../video-bitrate-parameters/optimize.md" %}
[optimize.md](../video-bitrate-parameters/optimize.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/scene.md" %}
[scene.md](../view-parameters/scene.md)
{% endcontent-ref %}
