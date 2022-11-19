---
description: Tells the system to not filter out audio streams when using &group
---

# \&groupaudio

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&ga`

## Details

This just enables the guest or scene to not filter out audio streams that are contained in other sub-groups.

By default a stream assigned to one group won't be visible or audible to those in another group. `&groupaudio` prevents audio from being filtered, but keeps the video filtering in place.

## Related

{% content-ref url="and-group.md" %}
[and-group.md](and-group.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/setup-parameters/and-groupmode.md" %}
[and-groupmode.md](../advanced-settings/setup-parameters/and-groupmode.md)
{% endcontent-ref %}
