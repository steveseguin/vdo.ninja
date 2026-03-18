---
description: Enables the face mesh overlay effect
---

# \&facemesh

Sender-Side Option! ([`&push`](push.md))

## Details

`&facemesh` is a shortcut for [`&effects=6`](effects.md). It uses TensorFlow.js to render a face mesh overlay on the sender's video.

{% hint style="warning" %}
This effect is slow to load as it downloads a TensorFlow.js model. Performance may vary by device.
{% endhint %}

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
