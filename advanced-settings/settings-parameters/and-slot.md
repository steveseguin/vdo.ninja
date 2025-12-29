---
description: Tells the director which slot the guest should prefer to be in
---

# \&slot

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&slot=4`

| Value           | Description                                    |
| --------------- | ---------------------------------------------- |
| 0               | Exclude this guest from the slot system        |
| (integer value) | The slot number the guest should be assigned to |

## Details

`&slot=N` is a guest side property (sender side). It tells the director ([Mixer App](../../steves-helper-apps/mixer-app.md) / [`&slotmode`](../director-parameters/and-slotmode.md)) which slot the guest should prefer to be in, if slots are being auto-assigned. If the desired slot is already taken, then that guest will then not be assigned a slot. If the guest was assigned a slot by the [director](../../viewers-settings/director.md), refreshing will keep the assigned slot, and the URL-specified slot preference will be ignored.

### Excluding from Slots with `&slot=0`

Using `&slot=0` explicitly excludes the guest from the slot system entirely. This is useful for:

* **Instructors or hosts** who should join the room but not consume a student slot
* **Musicians or special guests** who use fixed stream IDs instead of slot-based layouts
* **Control room operators** who need to monitor but not appear in slot-based scenes

Example: `https://vdo.ninja/?room=classroom&slot=0&push=Instructor1`

This guest will join the room and be visible in the director's control panel, but will not be assigned any slot number and won't appear in `&viewslot` scene links.

### Note

If looking to set the guest order for the auto-mixer's layout, the [`&order`](../../source-settings/order.md) parameter is generally intended for that purpose. You can set the order as a director dynamically using the Mix Order button in the guest's control box.

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
