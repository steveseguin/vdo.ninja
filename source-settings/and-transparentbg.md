---
description: Makes the video background fully transparent
---

# \&transparentbg

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&transparentbackground`

## Details

`&transparentbg` is a shortcut for [`&effects=16`](effects.md). It removes the background and makes it fully transparent (alpha channel), rather than replacing it with an image or color.

This is useful for overlaying a person on top of other content in OBS or similar tools. You may want to combine this with a codec that supports alpha channels (e.g., [`&webp`](../guides/how-to-stream-transparent-video.md)).

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
