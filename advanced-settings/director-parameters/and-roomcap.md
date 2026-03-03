---
description: Set a server-side cap on how many guests can be admitted to a claimed room
---

# \&roomcap

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&rcap`

## Options

Example: `&roomcap=20`

<table><thead><tr><th width="200">Value</th><th>Description</th></tr></thead><tbody><tr><td>Integer (&gt; 0)</td><td>Maximum admitted guests for the claimed room.</td></tr></tbody></table>

## Details

`&roomcap` sets a server-side admission cap for a claimed room.

On the official VDO.Ninja service:

* Default cap is `80` when not set.
* Maximum accepted value is `80` (higher values are clamped).
* New join attempts are blocked when the cap is reached.
* Transfers into the destination room also respect this cap.
* Matching `&roomkey` values can bypass a lower custom `&roomcap` (for example, `50`), but cannot bypass the server hard cap of `80`.

This works on the official hosted service (`vdo.ninja`) and on self-hosted services that include the same room-admission implementation.

## Related

{% content-ref url="and-requireapproval.md" %}
[and-requireapproval.md](and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="and-roomkey.md" %}
[and-roomkey.md](and-roomkey.md)
{% endcontent-ref %}
