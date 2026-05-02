---
description: Enables chroma key green removal with a background image
---

# \&chromakeybg

Sender-Side Option! ([`&push`](push.md))

## Options

Example: `&chromakeybg=30`

| Value             | Description                                          |
| ----------------- | ---------------------------------------------------- |
| (no value given)  | Enables chroma key + background with default threshold (25) |
| (integer value)   | Sets the green detection threshold (1-50)            |

## Details

`&chromakeybg` is a shortcut for [`&effects=15`](effects.md). It removes green-colored areas from the video and replaces them with a background image, combining chroma key detection with background replacement.

Use [`&imagelist`](effects.md) to provide custom background image URLs.

The threshold value controls sensitivity. If the user manually adjusts the threshold via the slider, that value is remembered per room and streamID and restored on the next visit.

## Related

{% content-ref url="and-chromakey.md" %}
[and-chromakey.md](and-chromakey.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/and-viewchroma.md" %}
[and-viewchroma.md](../advanced-settings/view-parameters/and-viewchroma.md)
{% endcontent-ref %}

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
