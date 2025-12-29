---
description: Gives you the possibility to assign slots to the connected guests
---

# \&slotmode

Director Option! ([`&director`](../../viewers-settings/director.md))

## Details

Adding `&slotmode` to a director's URL gives you the possibility to assign slots to the connected guests. While the layout switching options of the [Video Mixer](../../steves-helper-apps/mixer-app.md) will be missing when doing this as a normal director, you can still specify [`&layout`](../mixer-scene-parameters/and-layout.md) via the URL for multiple scenes that will obey the slot assignments (might interest advanced users or inspire user suggestions).

<figure><img src="../../.gitbook/assets/image (2) (2) (2) (1).png" alt=""><figcaption></figcaption></figure>

### Director Slot Behavior

By default, the director does **not** consume a slot when using `&slotmode`. This means:

* Guests are assigned slots starting from slot 1
* The director remains hidden from slot-based scene links (`&viewslot`)

If you want the director to appear in scenes and consume a slot, add [`&showdirector`](../../viewers-settings/and-showdirector.md) to the director's URL:

```
&director=roomname&slotmode&showdirector
```

This is useful when the director is also a performer who should appear in slot-based layouts.

### Excluding Guests from Slots

Guests can use [`&slot=0`](../settings-parameters/and-slot.md) to join the room without consuming a slot. This is useful for instructors, musicians, or control room operators who should not appear in slot-based scenes.

## Related

{% content-ref url="../../steves-helper-apps/mixer-app.md" %}
[mixer-app.md](../../steves-helper-apps/mixer-app.md)
{% endcontent-ref %}

{% content-ref url="../settings-parameters/and-slot.md" %}
[and-slot.md](../settings-parameters/and-slot.md)
{% endcontent-ref %}

{% content-ref url="../mixer-scene-parameters/and-layout.md" %}
[and-layout.md](../mixer-scene-parameters/and-layout.md)
{% endcontent-ref %}

{% content-ref url="../../viewers-settings/director.md" %}
[director.md](../../viewers-settings/director.md)
{% endcontent-ref %}
