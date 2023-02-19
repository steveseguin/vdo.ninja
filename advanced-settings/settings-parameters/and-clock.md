---
description: Shows the current time
---

# \&clock

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md), [`&director`](../../viewers-settings/director.md))

## Options

Example: `&clock=5` or `&clock=false`

| Value                   | Description                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `1` - `9` \*on alpha    | Shows the current time as in the graphic below. Each option specifies where the clock will appear on the screen |
| `9` \| (no value given) | Shows the current time in the lower right                                                                       |
| `false`                 | Will force-disable the clock from being remotely triggerable                                                    |

![](<../../.gitbook/assets/image (1) (10).png>)

## Details

`&clock` shows the current time in the lower right; this can be applied to pretty much all link types.

<figure><img src="../../.gitbook/assets/image (1) (8).png" alt=""><figcaption></figcaption></figure>

The director has a button that lets them enable the clock for everyone in the room (via the director's room settings button).

<figure><img src="../../.gitbook/assets/image (3) (3).png" alt=""><figcaption></figcaption></figure>

`&clock=false` or [`&cleanoutput`](../design-parameters/cleanoutput.md) will force-disable the clock from being remotely triggerable.

The director will see the clock also; it will just be a bit smaller on screen.

![](<../../.gitbook/assets/image (1) (1) (1) (3).png>)

## Related

{% content-ref url="and-timer-alpha.md" %}
[and-timer-alpha.md](and-timer-alpha.md)
{% endcontent-ref %}
