---
description: >-
  Forces the video output to landscape mode, regardless of how the phone is
  rotated
---

# \&forcelandscape

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&forcedlandscape`
* `&fl`

## Details

Forces the video output to landscape mode (16:9), regardless of how the phone is rotated.

You add this flag to the sender's side, and it applies to the sender and the viewers of that video stream. There is a short sub-second delay that it takes to counter-act any system-flipping. It can be used in conjunction with [`&rotate`](../design-parameters/and-rotate.md), if you need to do a 180 or something also.

## Related

{% content-ref url="and-forceportrait.md" %}
[and-forceportrait.md](and-forceportrait.md)
{% endcontent-ref %}
