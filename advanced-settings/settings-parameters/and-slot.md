---
description: Tells the director which slot the guest should prefer to be in
---

# \&slot

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&slot=4`

| Value           | Description                          |
| --------------- | ------------------------------------ |
| (integer value) | the slot guest should be assigned to |

## Details

`&slot=N` is a guest side property (sender side). It just tells the director ([Mixer App](../../steves-helper-apps/mixer-app.md) / [`&slotmode`](../director-parameters/and-slotmode.md)) which slot the guest should prefer to be in, if slots are being auto-assigned. If the desired slot is already taken, then that guest will then not be assign a slot. If the guest was assigned a slot by the [director](../../viewers-settings/director.md), refreshing will keep the assign slot, and the URL-specified slot preference will be ignored.\
\
If looking to set the guest order for the auto-mixer's layout, the [\&order ](../../source-settings/order.md)parameter is generally intended for that purpose. You can set the order as a director dynamically using the Mix Order button in the guest's control box.

## Related

{% content-ref url="../../source-settings/order.md" %}
[order.md](../../source-settings/order.md)
{% endcontent-ref %}

{% content-ref url="../director-parameters/and-slotmode.md" %}
[and-slotmode.md](../director-parameters/and-slotmode.md)
{% endcontent-ref %}

{% content-ref url="../../steves-helper-apps/mixer-app.md" %}
[mixer-app.md](../../steves-helper-apps/mixer-app.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-slots.md" %}
[and-slots.md](../../newly-added-parameters/and-slots.md)
{% endcontent-ref %}
