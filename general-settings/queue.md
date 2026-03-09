---
description: VDO.Ninja guest approval, waiting room, screening room, and green-room style queue workflows for directors and invite links.
---

# \&queue guest approval and waiting room

Director and/or Sender Option! ([`&director`](../viewers-settings/director.md), [`&push`](../source-settings/push.md), [`&room`](room.md))

## Details

`&queue` lets the director control when guests are admitted into a room. It can be used in two different ways:

* screening-room mode, when `&queue` is on both the director link and the guest link
* simple activation mode, when `&queue` is only on the guest invite link

Since v24, base `&queue` no longer lets the guest see or hear the director before activation. Use [`&screen`](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md) if you want the older screening behavior where the guest can talk with the director before activation.

## Using `&queue` on both director and guest links

Example director link:

```text
https://vdo.ninja/?director=roomname&queue
```

Example guest link:

```text
https://vdo.ninja/?room=roomname&queue
```

When both sides use `&queue`, guests join a wait list instead of fully loading into the director room. The director can pull in guests from the wait list as needed, review them, and transfer them to another room if desired.

This is the higher-scale screening-room model. It reduces the number of active connections the director has to carry at once and is the recommended approach when many guests might join.

## Using `&queue` only on guest invite links

Example:

```text
https://vdo.ninja/?room=roomname&queue
```

with the director link left in normal room mode.

In this mode, the guest still connects to the director immediately, but they are held outside the shared room until the director presses the pink "Activate Guest" button. Once activated, the guest joins the current room like a normal participant.

This is simpler than a screening room, but it is less protective if you expect many guests or hostile joins.

## Other queue modes for guest invite links

These modes apply when the guest invite uses the queue flag, but the director link itself is not running the room in queue mode:

* [`&screen`](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md) / `&queue2`
  The guest can see and hear the director before activation.
* [`&hold`](../advanced-settings/guest-queuing-parameters/and-hold-alpha.md) / `&queue3`
  The guest waits on a message screen. The director only sees the guest control box until activation.
* [`&holdwithvideo`](../advanced-settings/guest-queuing-parameters/and-holdwithvideo-alpha.md) / `&queue4`
  The guest waits on a message screen, but the director can already see and hear the guest before activation.

For all three modes above, transferring the guest to another room also counts as activation.

## Approval and room-cap controls

Separate from `&queue`, claimed rooms also support approval and capacity controls tied to the active director session:

* `&requireapproval` forces manual approval before a guest can join the claimed room.
* `&roomcap=NUMBER` or `&rcap=NUMBER` sets the room guest cap.
* `&roomkey=KEY` or `&rk=KEY` acts as a trusted bypass key for approval and room-cap checks.

These controls are tied to the current director. If the director leaves, the approval and cap state is removed with them.

## Co-directors and queue state

Co-directors now inherit the main director's queued guest state through the normal sync path. A co-director who joins late should still see the same "Activate Guest" controls for held guests, and using that control routes through the main activation flow.

`&view` can still be useful for intentionally exempting specific stream IDs from queue behavior, but it is no longer the main workaround for co-directors seeing queued guests.

## Related

{% content-ref url="../advanced-settings/guest-queuing-parameters/and-screen-alpha.md" %}
[and-screen-alpha.md](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/guest-queuing-parameters/and-hold-alpha.md" %}
[and-hold-alpha.md](../advanced-settings/guest-queuing-parameters/and-hold-alpha.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/guest-queuing-parameters/and-holdwithvideo-alpha.md" %}
[and-holdwithvideo-alpha.md](../advanced-settings/guest-queuing-parameters/and-holdwithvideo-alpha.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-queuetransfer.md" %}
[and-queuetransfer.md](../advanced-settings/settings-parameters/and-queuetransfer.md)
{% endcontent-ref %}
