---
description: Set a server-side cap on how many guests can be admitted to a claimed room.
---

# \&roomcap

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&rcap`

## Options

Example: `&roomcap=20`

| Value | Description |
| --- | --- |
| Integer greater than `0` | Maximum admitted guests for the claimed room |

## Details

`&roomcap` sets a handshake-server admission cap for a claimed room.

```text
https://vdo.ninja/?director=MyRoom&roomcap=10
```

On the official `vdo.ninja` service:

* Default cap is `80` when not set.
* Maximum accepted value is `80`; higher values are clamped.
* New join attempts are blocked when the room is full.
* Pending approval requests count toward the cap so the room is not overfilled while the director is deciding.
* Transfers into the destination room also respect the destination room's cap.
* Matching [`&roomkey`](and-roomkey.md) values can bypass a lower custom cap, but cannot bypass the server hard cap.

## Live director behavior

Room caps are attached to the live director claiming the room. If the director is not present, that director's live cap is not present either.

If a director claims or reclaims the room, pending guests are re-evaluated using the director's current cap and approval settings.

## Combining with approval

`&roomcap` can be combined with [`&requireapproval`](and-requireapproval.md):

```text
https://vdo.ninja/?director=MyRoom&requireapproval&roomcap=10
```

This makes guests wait for approval and also prevents the room from admitting more than the cap allows.

## Not the same as source connection limits

`&roomcap` limits admission to a claimed room. It is not the same as [`&maxconnections`](../../source-settings/and-maxconnections.md), which limits peer connections to a single source/push stream.

## Related

{% content-ref url="and-requireapproval.md" %}
[and-requireapproval.md](and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="and-roomkey.md" %}
[and-roomkey.md](and-roomkey.md)
{% endcontent-ref %}
