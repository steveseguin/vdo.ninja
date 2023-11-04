---
description: Inverts the video so it is upside down
---

# \&flip

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Details

Inverts the video so it is upside down. That's it. It doesn't change the viewer's link. If you want to have the viewer's link. If you want to flip the viewer's link as well, you have to add `&flip` to the viewer's side as well.

#### Alternative method for mirroring and flipping

If you are looking for a form of rotation and flipping that rotates the actual video, rather than relying on CSS to achieve it, you can check out the sender-side [`&effects`](../../source-settings/effects.md) options.\
\
`https://vdo.ninja/?effects=-1`, which will flip the video \
`https://vdo.ninja/?effects=-2`, which will flip and mirror the video\
`https://vdo.ninja/?effects=2`, which will mirror the video\
\
Effects however may increase CPU/GPU usage, and could cause frame rate instability, especially if the browser tab is not in active focus.

### Dedicated teleprompter tool that works for most sites

There's a dedicated tool for mirror, flipping, and rotating websites as part of VDO.Ninja as well:

[teleprompter-tool.md](../../steves-helper-apps/teleprompter-tool.md "mention")

In case the built-in options to mirror or flip don't work, the teleprompter app might be a good alternative.

## Related

{% content-ref url="../../steves-helper-apps/teleprompter-tool.md" %}
[teleprompter-tool.md](../../steves-helper-apps/teleprompter-tool.md)
{% endcontent-ref %}

{% content-ref url="and-mirror.md" %}
[and-mirror.md](and-mirror.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/effects.md" %}
[effects.md](../../source-settings/effects.md)
{% endcontent-ref %}
