---
description: Publish directly from OBS to VDO.Ninja without a virtual camera
---

# \&whip (alpha)

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&director`](../../viewers-settings/director.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

| Value          | Description           |
| -------------- | --------------------- |
| (string value) | bearer token from OBS |

## Details

Added experimental "WHIP" support to VDO.Ninja, which means in the near future you'll be able to publish directly from OBS to VDO.Ninja without a virtual camera. There's some big caveats to it all, so I don't recommend it over the normal method to most users, but we'll see how it evolves. (

To publish use: [https://whip.vdo.ninja/bearertoken](https://whip.vdo.ninja/bearertoken)\
To view use: [https://vdo.ninja/alpha/?whip=bearertoken](https://vdo.ninja/alpha/?whip=bearertoken)

See this video for details how to set it up:

{% embed url="https://youtu.be/ynSOE2d4Z9Y" %}
Publishing from OBS directly to VDO.Ninja
{% endembed %}

## Related

{% content-ref url="../../guides/publish-from-obs-into-vdo.ninja.md" %}
[publish-from-obs-into-vdo.ninja.md](../../guides/publish-from-obs-into-vdo.ninja.md)
{% endcontent-ref %}
