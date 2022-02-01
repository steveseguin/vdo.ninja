---
description: Orders guest's by their stream ID in the director's room
---

# \&orderby

## Details

`&orderby` is a director's URL parameter. While the default ordering of guests in the director's room is by time of joining, if you use `&orderby` it instead orders by guest's stream ID. I'll be adding different ordering options later, but for now it's just by stream ID (case ignored; a to z, etc).

You can still manual reorder a guest, but when you shift someone up or down the list, they will be ignored by the ordering from there on. This order is different than the mix-order; this order is largely cosmetic and only impacts the MIDI mix order IDs really.

## Related

{% content-ref url="../source-parameters/order.md" %}
[order.md](../source-parameters/order.md)
{% endcontent-ref %}
