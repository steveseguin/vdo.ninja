---
description: Keep a transferred guest queued in the destination room until activated.
---

# \&queuetransfer

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&qt`

## Details

`&queuetransfer` changes what happens after a guest is transferred from one room to another.

Normally, a transferred guest is admitted into the destination room immediately if the destination room accepts the transfer. With `&queuetransfer` on the guest invite link, the guest lands in the destination room's queue flow instead, so the destination director can activate them when ready.

Guest invite link:

```text
https://vdo.ninja/?room=LobbyRoom&queuetransfer
```

When the lobby director transfers this guest to another room, the guest arrives there in queue mode rather than going live immediately.

This is useful when a public lobby director is routing guests into production rooms, breakout rooms, or private green rooms, but the destination director still wants final control.

## Interaction with room admission approval

`&queuetransfer` is a queue workflow option.

If the destination room also uses [`&requireapproval`](../director-parameters/and-requireapproval.md), the transferred guest remains pending until the destination director approves them.

If the destination room has [`&roomcap`](../director-parameters/and-roomcap.md) and is full, the transfer is rejected.

## Related

{% content-ref url="../../general-settings/queue.md" %}
[queue.md](../../general-settings/queue.md)
{% endcontent-ref %}

{% content-ref url="../../getting-started/rooms/transfer-rooms.md" %}
[transfer-rooms.md](../../getting-started/rooms/transfer-rooms.md)
{% endcontent-ref %}

{% content-ref url="../director-parameters/and-requireapproval.md" %}
[and-requireapproval.md](../director-parameters/and-requireapproval.md)
{% endcontent-ref %}
