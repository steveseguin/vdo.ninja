---
description: Puts guests into sub-groups, so they only see others in the same group
---

# \&group

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&groups`

## Options

| Value     | Description                                          |
| --------- | ---------------------------------------------------- |
| `1`       | adds the guest or director to group 1                |
| `2`       | adds the guest or director to group 2                |
| `3,4,5,6` | adds the guest or director to group 3, 4, 5 and 6    |
| string    | creates/adds the guest or director to a custom group |

## Details

The idea is, you can put guests of a room into sub-groups. When added to a sub group, those guests will only be able to see and hear others in that same sub group.&#x20;

Guests can be assigned to multiple subgroups. Groups can be specified via the URL using `&group=1,5,6` or/and the director can dynamically assign sub-groups, as seen in the below image.&#x20;

![](<../.gitbook/assets/image (129).png>)

If not in a group, that guest will still see/hear everyone, regardless of which group they are in, even if a guest in another group may not be able to see/hear that guest back.

Scenes can be put into groups as well, via the URL group option, such `&group=3`, but the director will not be able to dynamically change which group a scene is in. Not yet at least.

Using this group function is an alternative to transfer rooms, however it's perhaps less secure, as a guest could just tinker with their URL parameters or just refresh their page to perhaps see everyone in the room again.

[`&groupaudio`](and-groupaudio.md) can be used to enable audio in-between different groups, instead of audio being group-specific. Useful for blind-dating show formats or such.

### New in Version 22

Custom groups used by remote guests now show in the director's view, just like custom scenes do. If you use `&groups=group,test,vdo`, new group buttons will appear.\
![](<../.gitbook/assets/image (171).png>)

With [`&groupmode`](../advanced-settings/upcoming-parameters/and-groupmode.md) added to your URL, when not assigned to a group, you don't hear or see anything. This also goes for remote participants who are not in a group - you will not see or hear them if they are not in a group, even if you also are not in a group.

## Related

{% content-ref url="and-groupaudio.md" %}
[and-groupaudio.md](and-groupaudio.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/upcoming-parameters/and-groupmode.md" %}
[and-groupmode.md](../advanced-settings/upcoming-parameters/and-groupmode.md)
{% endcontent-ref %}

{% content-ref url="../director-settings/rooms.md" %}
[rooms.md](../director-settings/rooms.md)
{% endcontent-ref %}
