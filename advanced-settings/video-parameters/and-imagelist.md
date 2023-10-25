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

<div align="left">

<figure><img src="../../.gitbook/assets/image (2) (1) (6).png" alt=""><figcaption><p>When selecting a background image, you'll get a gentle glow around the selected image now. There's also a horizontal scroll bar, if the number of images listed are too much to fit.</p></figcaption></figure>

</div>

### Complicated? It's simple if using Imgur (free hosting service)

If looking for a free image host, I think [Imgur.com](https://imgur.com) offers free image hosting that is CORS friendly. The URLs it provides are also seemingly safe to use without URL encoding. You can just replace the `XXXXXXX` in the link below, with your Imgur provided ID value, and it might get you going.\
\
Example: `&imagelist=[%22https://i.imgur.com/XXXXXXX.png%22]`

### Mirroring issues

By default, the image may be mirrored to the publisher, as webcam previews are by default mirrored in VDO.Ninja. The image will not be mirrored in the output however; just in the preview.

You can disable the mirroring on the preview though; use `&nomirror` on the URL as a parameter.

## Related

{% content-ref url="../../source-settings/effects.md" %}
[effects.md](../../source-settings/effects.md)
{% endcontent-ref %}
