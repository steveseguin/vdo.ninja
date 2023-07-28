---
description: Orders guest's by their stream ID in the director's room
---

# \&orderby

Director Option! ([`&director`](../viewers-settings/director.md))

## Options

Example: `&orderby=label`

<table><thead><tr><th width="177">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>label</code></td><td>will sort based on the display name (<a href="../general-settings/label.md"><code>&#x26;label</code></a>) of each video, if the label is set, instead of by stream ID.</td></tr><tr><td>(no value given)</td><td>orders guest's by their stream ID in the director's room</td></tr></tbody></table>

## Details

`&orderby` is a director's URL parameter. While the default ordering of guests in the director's room is by time of joining, if you use `&orderby` it instead orders by guest's stream ID. I'll be adding different ordering options later, but for now it's just by stream ID (case ignored; a to z, etc).

You can still manual reorder a guest, but when you shift someone up or down the list, they will be ignored by the ordering from there on. This order is different than the mix-order; this order is largely cosmetic and only impacts the MIDI mix order IDs really.

#### Update in [v23.md](../releases/v23.md "mention")

I updated `&orderby` to work with non-director view links, such as with scenes or guests.

Previously `&orderby` only worked with the director's view to sort the positioning of control boxes, based on the _stream ID_, but now it can apply to the auto-mixer.

The _mix order_, or [`&order=N`](../source-settings/order.md), of each guest takes priority over the name when sorting. By default all guests have a mix order of 0, mind you. You can change it dynamically as a guest, via the mix-order option in each guest's control box, or pre-assign it via URL with `&order=N` on the guest invite.

#### Sort by label

I also added `&orderby=label` as an option, which will sort based on the display name ([`&label`](../general-settings/label.md)) of each video, if the label is set, instead of by stream ID.

This option doesn't apply to the director's view at the moment, but it does work when used with respect to the auto-mixer (guests/scenes).

The label sort ignores letter casing, while the default stream ID includes letter casing in the sorting logic.

## Related

{% content-ref url="../source-settings/order.md" %}
[order.md](../source-settings/order.md)
{% endcontent-ref %}
