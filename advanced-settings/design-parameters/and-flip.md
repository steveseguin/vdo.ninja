---
description: Inverts the video so it is upside down
---

# \&flip

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Details

Inverts the video so it is upside down. That's it. It doesn't change the viewer's link. If you want to have the viewer's link. If you want to flip the viewer's link as well, you have to add `&flip` to the viewer's side as well.



#### Alternative option to rotating and flipping

If  you are looking for a form of rotation and flipping that rotates the actual video, rather than relying on CSS to achieve it, you can check out the sender-side \&effects options.\
\
`https://vdo.ninja/beta/?effects=-1`,  which will flip the video `https://vdo.ninja/beta/?effects=-2`,  which will flip and mirror the video\
`https://vdo.ninja/beta/?effects=2`,  which will mirror the video\
\
Effects however may increase CPU/GPU usage, and could cause frame rate instability, especially if the browser tab is not in active focus.&#x20;

## Related

{% content-ref url="mirror.md" %}
[mirror.md](mirror.md)
{% endcontent-ref %}
