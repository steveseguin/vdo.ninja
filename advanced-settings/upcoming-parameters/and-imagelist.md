---
description: Can be used to pass a list of background images via the URL
---

# \&imagelist

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

| Value | Description                         |
| ----- | ----------------------------------- |
| (URL) | Passes a list of images via the URL |

## Details

Added options to host your own default background images for the virtual background effect. `&imagelist=xxxx` can be used to pass a list of images via the URL.

Code to generate the list properly can be found here: [https://jsfiddle.net/steveseguin/w7z28kgb/](https://jsfiddle.net/steveseguin/w7z28kgb/) (images must be cross origin enabled) - at the base of index.html, if self-hosting VDO.Ninja, you can hard-code the list of images as well.

Related: when selecting a background image, you'll get a gentle glow around the selected image now. There's also a horizontal scroll bar, if the number of images listed are too much to fit.

## Related

{% content-ref url="../../source-settings/effects.md" %}
[effects.md](../../source-settings/effects.md)
{% endcontent-ref %}
