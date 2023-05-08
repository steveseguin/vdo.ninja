---
description: >-
  Will try to add a blurred background to the video so it fits the structured
  video container
---

# \&blur (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

Example: `&blur=25`

| Value            | Description             |
| ---------------- | ----------------------- |
| (no value given) | blurring intensity = 10 |
| (integer)        | blurring intensity      |
| `25`             | blurring intensity = 25 |

## Details

`&blur` which will try to add a blurred background to the video so it fits the structured video container. Using `&blur` auto enables [`&structure`](and-structure-alpha.md).

Code in the auto mixer, so you won't see the effect in a simple preview or some self-preview types.

`&blur` doesn't work with [`&color`](and-color-alpha.md), etc.

You can change the blurring intensity with `&blur=25` or whatever; `10` is default

`&blur=0` works as well.

May be buggy if using it with [`&forcedlandscape`](../mobile-parameters/and-forcelandscape.md) or [`&rotate`](and-rotate.md)

<figure><img src="../../.gitbook/assets/image (8) (1).png" alt=""><figcaption></figcaption></figure>

## Related

{% content-ref url="and-structure-alpha.md" %}
[and-structure-alpha.md](and-structure-alpha.md)
{% endcontent-ref %}

{% content-ref url="and-border.md" %}
[and-border.md](and-border.md)
{% endcontent-ref %}

{% content-ref url="and-color-alpha.md" %}
[and-color-alpha.md](and-color-alpha.md)
{% endcontent-ref %}
