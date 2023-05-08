---
description: Added to the URL, when not assigned to a group, you don't hear or see anything
---

# \&groupmode

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Details

`&groupmode` changes the way [groups](../../general-settings/and-group.md) work when not in a group.

With `&groupmode` added to your URL, when not assigned to a group, you don't hear or see anything. This also goes for remote participants who are not in a group - you will not see or hear them if they are not in a group, even if you also are not in a group.

The default normally with VDO.Ninja is that if not in a group, you see and hear everyone. This remains true if not using `&groupmode`, even if others in the room are. Others may not be able to see or hear you though, if they have `&groupmode` enabled, and you haven't picked a group. So, `&groupmode` only impacts the local user, and will not impact remote connections.

The [Comms app](../../steves-helper-apps/comms.md) uses `&groupmode` by default.

## Related

{% content-ref url="../../general-settings/and-group.md" %}
[and-group.md](../../general-settings/and-group.md)
{% endcontent-ref %}

{% content-ref url="and-groupview.md" %}
[and-groupview.md](and-groupview.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/and-groupaudio.md" %}
[and-groupaudio.md](../../general-settings/and-groupaudio.md)
{% endcontent-ref %}
