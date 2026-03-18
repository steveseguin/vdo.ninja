---
description: Enables the background blur effect
---

# \&backgroundblur

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&bgblur`

## Options

Example: `&backgroundblur=5`

| Value             | Description                                          |
| ----------------- | ---------------------------------------------------- |
| (no value given)  | Enables background blur with default amount (2)      |
| (integer value)   | Sets the blur amount (0-20)                          |

## Details

`&backgroundblur` is a shortcut for [`&effects=3`](effects.md). It enables the ML-based background blur effect on the sender's video.

You can optionally pass a value to set the blur intensity (0-20). For example, `&backgroundblur=5` applies a heavier blur. If no value is given, the default blur amount of 2 is used.

If the user manually adjusts the blur amount via the slider during a session, that value is remembered per room and streamID in localStorage and will be restored on the next visit.

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-effectvalue.md" %}
[and-effectvalue.md](../../newly-added-parameters/and-effectvalue.md)
{% endcontent-ref %}
