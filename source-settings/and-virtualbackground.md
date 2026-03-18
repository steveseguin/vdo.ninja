---
description: Enables the virtual background replacement effect
---

# \&virtualbackground

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&vbg`

## Details

`&virtualbackground` is a shortcut for [`&effects=5`](effects.md). It enables ML-based background replacement, allowing the sender to choose a background image.

Use [`&imagelist`](effects.md) to provide custom background image URLs. For example:\
`&virtualbackground&imagelist=` + `encodeURIComponent(JSON.stringify(["image1.webp", "image2.webp"]))`

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
