---
description: Puts guests into sub-groups, so they only see others in the same group
---

# \&group

## Details

The idea is, you can put guests of a room into sub-groups. When added to a sub group, those guests will only be able to see and hear others in that same sub group.&#x20;

Guests can be assigned to multiple subgroups. Groups can be specified via the URL using `&group=1,5,6` or/and the director can dynamically assign sub-groups, as seen in the below image.&#x20;

![](<../.gitbook/assets/image (129).png>)

If not in a group, that guest will still see/hear everyone, regardless of which group they are in, even if a guest in another group may not be able to see/hear that guest back.&#x20;

Scenes can be put into groups as well, via the URL group option, such `&group=3`, but the director will not be able to dynamically change which group a scene is in. Not yet at least.&#x20;

Using this group function is an alternative to transfer rooms, however it's perhaps less secure, as a guest could just tinker with their URL parameters or just refresh their page to perhaps see everyone in the room again.

``[`&groupaudio`](and-groupaudio.md) can be used to enable audio in-between different groups, instead of audio being group-specific. Useful for blind-dating show formats or such.

## Related

{% content-ref url="and-groupaudio.md" %}
[and-groupaudio.md](and-groupaudio.md)
{% endcontent-ref %}
