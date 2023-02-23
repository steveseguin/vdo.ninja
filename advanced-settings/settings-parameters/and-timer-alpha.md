---
description: Positions the countdown timer
---

# \&timer (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md), [`&director`](../../viewers-settings/director.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

Example: `&timer=5`

| Value                   | Description                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `1` - `9` \*on alpha    | Shows the current countdown timer as in the graphic below. Each option specifies where the countdown timer will appear on the screen |
| `2` \| (no value given) | Shows the countdown timer in the top center                                                                                          |

![](<../../.gitbook/assets/image (12).png>)

## Details

`&timer=N` can be used to position where the countdown timer is positioned on a guest's window. Default is still center top but a value of 1 to 9 can be be passed to change positions.

You can enable the countdown as a director via the room settings.\
![](<../../.gitbook/assets/image (11).png>)

The director has a button that lets them also enable a global count-down timer. Holding `CTRL + click` will let the director pause the timer. If someone joins the room or reloads, the timer will also be reloaded, in sync. Button also in the room settings menu.

This count down timer is the same concept as the per-guest timer the director already has, and will actually conflict with it if both are used, since it uses the same state/variable to keep track of time remaining.

The director will see the global count down timer also; it will just be a bit smaller on screen.

## Related

{% content-ref url="and-clock.md" %}
[and-clock.md](and-clock.md)
{% endcontent-ref %}
