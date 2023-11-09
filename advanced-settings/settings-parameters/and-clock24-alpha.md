---
description: The same as &clock option, except it uses 24-hour time for the display
---

# \&clock24 (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md), [`&director`](../../viewers-settings/director.md))\
\***ALPHA-ONLY** - Only available at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

Example: `&clock24=5`

<table><thead><tr><th width="232">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code> - <code>9</code></td><td>Shows the current time as in the graphic below. Each option specifies where the clock will appear on the screen</td></tr><tr><td><code>9</code> | (no value given)</td><td>Shows the current time in the lower right</td></tr><tr><td><code>false</code></td><td>Will force-disable the clock from being remotely triggerable</td></tr></tbody></table>

![](<../../.gitbook/assets/image (1) (10).png>)

## Details

`&clock24` is the same as the existing [`&clock`](and-clock.md) option, (which shows a clock) except it uses 24-hour time for the display (vs. am/pm).\
![](../../.gitbook/assets/image.png)

If the director uses `&clock24` on their URL, and then enables the room clock, it will be 24-hour time for all guests, matching the director's settings.

Shows the current time in the lower right; this can be applied to pretty much all link types.

The director has a button that lets them enable the clock for everyone in the room (via the director's room settings button).

The director will see the clock also; it will just be a bit smaller on screen.

## Related

{% content-ref url="and-clock.md" %}
[and-clock.md](and-clock.md)
{% endcontent-ref %}

{% content-ref url="and-timer.md" %}
[and-timer.md](and-timer.md)
{% endcontent-ref %}
