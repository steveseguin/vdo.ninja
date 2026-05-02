---
description: Enables chroma key green removal
---

# \&chromakey

Sender-Side Option! ([`&push`](push.md))

## Options

Example: `&chromakey=30`

| Value             | Description                                          |
| ----------------- | ---------------------------------------------------- |
| (no value given)  | Enables chroma key with default threshold (25)       |
| (integer value)   | Sets the green detection threshold (1-50)            |

## Details

`&chromakey` is a shortcut for [`&effects=14`](effects.md). It removes green-colored areas from the video using HSL-based chroma key detection.

The threshold value controls sensitivity: lower values remove more green (more aggressive), higher values retain more green. The default is 25.

If the user manually adjusts the threshold via the slider during a session, that value is remembered per room and streamID and restored on the next visit.

## Related

{% content-ref url="and-chromakeybg.md" %}
[and-chromakeybg.md](and-chromakeybg.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/and-viewchroma.md" %}
[and-viewchroma.md](../advanced-settings/view-parameters/and-viewchroma.md)
{% endcontent-ref %}

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
