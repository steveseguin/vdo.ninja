---
description: >-
  Forces the video output to portrait mode, regardless of how the phone is
  rotated
---

# \&forceportrait

## Aliases

* `&forcedportrait`
* `&fp`

## Details

Forces the video output to portrait mode (9:16), regardless of how the phone is rotated.

You add this flag to the sender's side, and it applies to the sender and the viewers of that video stream. There's a short sub-second delay that it takes to counter-act any system-flipping. It can be used in conjunction with [`&rotate`](../advanced-settings/design-parameters/and-rotate.md), if you need to do a 180 or something also.

## Related

{% content-ref url="and-forcelandscape.md" %}
[and-forcelandscape.md](and-forcelandscape.md)
{% endcontent-ref %}
