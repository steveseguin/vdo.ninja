---
description: Shows the current time in the lower right
---

# \&clock

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](and-solo.md), [`&director`](../../viewers-settings/director.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

| Value            | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| (no value given) | Shows the current time in the lower right                    |
| `false`          | Will force-disable the clock from being remotely triggerable |

## Details

`&clock` shows the current time in the lower right; this can be applied to pretty much all link types.

<figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

The director has a button that lets them enable the clock for everyone in the room (via the director's room settings button).

`&clock=false` or [`&cleanoutput`](../design-parameters/cleanoutput.md) will force-disable the clock from being remotely triggerable.

The director has a button that lets them also enable a global count-down timer. Holding CTRL + click will let the director pause the timer. If someone joins the room or reloads, the timer will also be reloaded, in sync. Button also in the room settings menu.

<figure><img src="../../.gitbook/assets/image (3) (3).png" alt=""><figcaption></figcaption></figure>

This count down timer is the same concept as the per-guest timer the director already has, and will actually conflict with it if both are used, since it uses the same state/variable to keep track of time remaining.

The director will see the global count down timer also; it will just be a bit smaller on screen.

![](../../.gitbook/assets/image.png)
