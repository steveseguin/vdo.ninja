---
description: Require manual director approval before guests can join a claimed room
---

# \&requireapproval

Director Option! ([`&director`](../../viewers-settings/director.md))

## Details

`&requireapproval` enables server-side room admission controls for a claimed room.

When enabled, guests do not auto-join. They are placed in a pending state until the room director explicitly approves them.

This behavior works on the official hosted VDO.Ninja service (`vdo.ninja`) and on self-hosted signaling services that implement the same room-admission feature.

## Behavior Notes

* Guests waiting for approval will see a pending/waiting message until approved or denied.
* Directors get join requests and can approve or deny each guest.
* This can be combined with [`&roomcap`](and-roomcap.md) and [`&roomkey`](and-roomkey.md).
* Guests with a matching `&roomkey` can bypass approval.
* If a guest is transferred into a destination room that also uses `&requireapproval`, they will remain pending there. If they disconnect before being approved, they may need to rejoin from the original invite flow.

## Example

`https://vdo.ninja/?director=MyRoom&requireapproval`

## Related

{% content-ref url="and-roomcap.md" %}
[and-roomcap.md](and-roomcap.md)
{% endcontent-ref %}

{% content-ref url="and-roomkey.md" %}
[and-roomkey.md](and-roomkey.md)
{% endcontent-ref %}

{% content-ref url="../../getting-started/rooms/transfer-rooms.md" %}
[transfer-rooms.md](../../getting-started/rooms/transfer-rooms.md)
{% endcontent-ref %}
