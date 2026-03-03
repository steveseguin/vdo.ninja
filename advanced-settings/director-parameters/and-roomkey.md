---
description: Add a trusted bypass key for claim-time room admission controls
---

# \&roomkey

General Option! ([`&director`](../../viewers-settings/director.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&rk`

## Options

Example: `&roomkey=TRUSTED_BYPASS_KEY`

<table><thead><tr><th width="250">Value</th><th>Description</th></tr></thead><tbody><tr><td>String</td><td>Trusted bypass key shared between director and selected invite links.</td></tr></tbody></table>

## Details

`&roomkey` is used with room-admission controls on claimed rooms.

If the room director sets a bypass key, guests joining with the same key can bypass:

* manual approval queues from [`&requireapproval`](and-requireapproval.md)
* admission limits from [`&roomcap`](and-roomcap.md)

This behavior works on the official hosted VDO.Ninja service (`vdo.ninja`) and on self-hosted signaling services that support claim-time admission controls.

## Security Notes

* Treat room keys like passwords; only share with trusted users.
* Changing the key rotates who can bypass admission checks.

## Related

{% content-ref url="and-requireapproval.md" %}
[and-requireapproval.md](and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="and-roomcap.md" %}
[and-roomcap.md](and-roomcap.md)
{% endcontent-ref %}
