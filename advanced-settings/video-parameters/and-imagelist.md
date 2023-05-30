---
description: Can be used to pass a list of background images via the URL
---

# \&imagelist

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&imagelist=%5B%22https%3A%2F%2Fvdo.ninja%2Fmedia%2Fold_logo.png%22%2C%22https%3A%2F%2Fvdo.ninja%2Fmedia%2Fbg_sample.webp%22%2C%22https%3A%2F%2Fvdo.ninja%2Fmedia%2Fbg_sample2.webp%22%5D`

<table><thead><tr><th width="208">Value</th><th>Description</th></tr></thead><tbody><tr><td>(URL)</td><td>Passes a list of images via the URL</td></tr></tbody></table>

## Details

Added options to host your own default background images for the virtual background effect. `&imagelist=xxxx` can be used to pass a list of images via the URL.

Code to generate the list properly can be found here: [https://jsfiddle.net/steveseguin/w7z28kgb/](https://jsfiddle.net/steveseguin/w7z28kgb/) (images must be cross origin enabled) - at the base of index.html, if self-hosting VDO.Ninja, you can hard-code the list of images as well.

![](<../../.gitbook/assets/image (2) (1) (6).png>)

Related: When selecting a background image, you'll get a gentle glow around the selected image now. There's also a horizontal scroll bar, if the number of images listed are too much to fit.

## Related

{% content-ref url="../../source-settings/effects.md" %}
[effects.md](../../source-settings/effects.md)
{% endcontent-ref %}
