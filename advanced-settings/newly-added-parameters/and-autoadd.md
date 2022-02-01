---
description: Auto-adds the specified stream IDs to the scene
---

# \&autoadd

## Options

| Value                           | Description                                                     |
| ------------------------------- | --------------------------------------------------------------- |
| (streamid1,streamid2,streamid3) | the stream IDs which should be automatically added to the scene |

## Details

`&autoadd` can be added to a scene link, passing to it a comma-separated list of stream IDs. If any of those streamIDs connect, they will be auto-added to that specific scene page. The director won't see that they were added to the scene page, but the director can still toggle the add-to-scene button to remove them. This is just an alternative to using [`&view=`](../viewer-parameters/view.md) to auto-add a guest to a scene, as [`&view`](../viewer-parameters/view.md) filters out non-listed stream IDs as well, while `&autoadd` will not.

## Related

{% content-ref url="../viewer-parameters/scene.md" %}
[scene.md](../viewer-parameters/scene.md)
{% endcontent-ref %}

{% content-ref url="../viewer-parameters/view.md" %}
[view.md](../viewer-parameters/view.md)
{% endcontent-ref %}
