---
description: Require manual director approval before guests can join a claimed room.
---

# \&requireapproval

Director Option! ([`&director`](../../viewers-settings/director.md))

## Details

`&requireapproval` enables server-side room admission approval for a claimed room.

When enabled, guests do not auto-join the room. They are placed in a pending state until the active room director approves or denies them.

This is different from [`&queue`](../../general-settings/queue.md). Queue mode is a guest workflow after the guest has reached the room flow. `&requireapproval` is a handshake-server admission check tied to the live director claim.

## Example

Director link:

```text
https://vdo.ninja/?director=MyRoom&requireapproval
```

Guest link:

```text
https://vdo.ninja/?room=MyRoom
```

To show the director a modal popup for each pending request, add [`&approvepopup`](and-approvepopup.md):

```text
https://vdo.ninja/?director=MyRoom&requireapproval&approvepopup
```

## Behavior notes

* Guests waiting for approval see a pending/waiting message.
* Directors see pending join requests and can approve or deny them.
* Pending requests are scoped to the room, not to the director's browser session, so a director reload does not orphan them.
* If the director is not present, new guests are not blocked by that director's live approval setting.
* If a director claims or reclaims the room, pending guests are re-evaluated against the director's current admission settings.
* Matching [`&roomkey`](and-roomkey.md) values can bypass manual approval.
* [`&roomcap`](and-roomcap.md) can be combined with approval to limit the number of admitted and pending guests.

## Transfers

If a guest is transferred into a destination room that also uses `&requireapproval`, the transferred guest remains pending in the destination room until that destination room's director approves them.

If the pending transferred guest disconnects before approval, they may need to rejoin from the original invite flow.

## Notifications

`&requireapproval` does not automatically enable sounds or system notifications.

Use [`&approvepopup`](and-approvepopup.md) for a modal popup. Add [`&notify`](../../source-settings/and-notify.md) or `&beep` for audio alerts.

## Related

{% content-ref url="and-approvepopup.md" %}
[and-approvepopup.md](and-approvepopup.md)
{% endcontent-ref %}

{% content-ref url="and-roomcap.md" %}
[and-roomcap.md](and-roomcap.md)
{% endcontent-ref %}

{% content-ref url="and-roomkey.md" %}
[and-roomkey.md](and-roomkey.md)
{% endcontent-ref %}

{% content-ref url="../../getting-started/rooms/transfer-rooms.md" %}
[transfer-rooms.md](../../getting-started/rooms/transfer-rooms.md)
{% endcontent-ref %}
