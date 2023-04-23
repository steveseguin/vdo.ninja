---
description: Publish directly from OBS to VDO.Ninja without a virtual camera
---

# \&whip (alpha)

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&director`](../../viewers-settings/director.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/) and [vdo.ninja/beta](https://vdo.ninja/beta/)

## Options

Example: `&whip=bearertoken`

| Value          | Description           |
| -------------- | --------------------- |
| (string value) | bearer token from OBS |

## Details

Added experimental "WHIP" support to VDO.Ninja, which means in the near future you'll be able to publish directly from OBS to VDO.Ninja without a virtual camera. There's some big caveats to it all, so I don't recommend it over the normal method to most users, but we'll see how it evolves.

To publish use: [https://whip.vdo.ninja/bearertoken](https://whip.vdo.ninja/bearertoken)\
To view use: [https://vdo.ninja/alpha/?whip=bearertoken](https://vdo.ninja/alpha/?whip=bearertoken)\


You have to use a version of OBS that contains WHIP support to get this working.   As of April 2023, these are some builds of OBS that support WHIP:\
[https://github.com/obsproject/obs-studio/suites/12263428876/artifacts/649328007](https://github.com/obsproject/obs-studio/suites/12263428876/artifacts/649328007) win (x64)\
[https://github.com/obsproject/obs-studio/suites/12263428876/artifacts/649328001](https://github.com/obsproject/obs-studio/suites/12263428876/artifacts/649328001) mac (arm)\
[https://github.com/obsproject/obs-studio/actions/runs/4711358202?pr=7926](https://github.com/obsproject/obs-studio/actions/runs/4711358202?pr=7926) (others here)\
\
Hopefully WHIP support will be in OBS officially sometime soon.\


See this video for details how to set it up:

{% embed url="https://youtu.be/ynSOE2d4Z9Y" %}
Publishing from OBS directly to VDO.Ninja
{% endembed %}

### Update in V23

I've refined the WHIP service on `vdo.ninja/alpha/?whip=xxx`, making it as robust as I can I think, so if some third-party WHIP client/app doesn't work with it, it may not an issue with VDO.Ninja. In those cases it will be up to the client to ensure full support of the WHIP specification, else it may not work with VDO.Ninja.

## Related

{% content-ref url="../../guides/publish-from-obs-into-vdo.ninja.md" %}
[publish-from-obs-into-vdo.ninja.md](../../guides/publish-from-obs-into-vdo.ninja.md)
{% endcontent-ref %}
