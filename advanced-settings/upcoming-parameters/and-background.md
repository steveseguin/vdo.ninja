---
description: Accepts a URL-encoded image URL to make as the app's default background
---

# \&background

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&appbg`

## Options

| Value                     | Description           |
| ------------------------- | --------------------- |
| ./media/logo\_cropped.png | URL-encoded image URL |

## Details

Accepts a URL-encoded image URL to make as the app's default background.\
You can encode the URL here\
[https://www.urlencoder.org/](https://www.urlencoder.org/)

To test:\
[`https://vdo.ninja/alpha/?background=./media/logo_cropped.png`](https://vdo.ninja/alpha/?background=./media/logo\_cropped.png)``

The image will scale in size to cover the VDO.Ninja app's background. [`&chroma`](../design-parameters/chroma.md) can still be used to set the background color, if using transparencies. There already exists [`&bgimage`](and-bgimage.md), which will set the default background image for videos; this however will set a background image for the entire page.

![](<../../.gitbook/assets/image (110) (1) (1) (1).png>)

## Related

{% content-ref url="and-bgimage.md" %}
[and-bgimage.md](and-bgimage.md)
{% endcontent-ref %}

{% content-ref url="../design-parameters/chroma.md" %}
[chroma.md](../design-parameters/chroma.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-waitimage.md" %}
[and-waitimage.md](../newly-added-parameters/and-waitimage.md)
{% endcontent-ref %}
