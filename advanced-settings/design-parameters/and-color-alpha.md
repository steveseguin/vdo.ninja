---
description: You can specify the background color independent of the border color
---

# \&color (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

Example: `&color=ffffff` or `&color=white`

| Value                 | Description                           |
| --------------------- | ------------------------------------- |
| (no value given)      | black background                      |
| (HEX) \| (color name) | specifies the color of the background |
| `ffffff`              | white background                      |

{% hint style="danger" %}
Do not include the # character with the hex value.
{% endhint %}

## Details

You can specify the background color independent of the border color with `&color`. If using [`&border`](and-border.md), it will not set the background color, so you may need to use both `&border` and `&color`.

May not yet work with [`&forcedlandscape`](../mobile-parameters/and-forcelandscape.md) or [`&rotate`](and-rotate.md).\


<figure><img src="../../.gitbook/assets/image (14).png" alt=""><figcaption></figcaption></figure>

## Related

{% content-ref url="and-structure-alpha.md" %}
[and-structure-alpha.md](and-structure-alpha.md)
{% endcontent-ref %}

{% content-ref url="and-border.md" %}
[and-border.md](and-border.md)
{% endcontent-ref %}

{% content-ref url="and-blur-alpha.md" %}
[and-blur-alpha.md](and-blur-alpha.md)
{% endcontent-ref %}

{% content-ref url="and-bordercolor.md" %}
[and-bordercolor.md](and-bordercolor.md)
{% endcontent-ref %}
