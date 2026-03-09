---
description: The guest waits on a hold message until activated or transferred by the director.
---

# \&hold

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&queue3`

## Details

`&hold` places the guest into a waiting state until the director activates them.

Before activation:

* the guest sees a "please wait" style message
* the guest does not see or hear the director
* the director sees the guest control box and metadata, but not the guest's live audio/video

After activation or transfer:

* the waiting overlay is cleared
* the guest begins normal publishing into the room
* the director and guest see each other normally

This mode applies to guest invite links when the director is not using the room-wide `&queue` screening model.

## Related

{% content-ref url="../../general-settings/queue.md" %}
[queue.md](../../general-settings/queue.md)
{% endcontent-ref %}
