---
description: Enables the face mesh overlay effect
---

# \&facemesh

Sender-Side Option! ([`&push`](push.md))

## Details

`&facemesh` is a shortcut for [`&effects=6`](effects.md). It renders a face mesh overlay on the sender's video using the bundled MediaPipe FaceLandmarker model.

The older TensorFlow.js face mesh path is still available with `&legacyfacemesh` or `&tfjsfacemesh`, but the default path no longer depends on the retired remote TFHub face mesh URLs.

{% hint style="warning" %}
This effect loads a bundled machine-learning model. Performance may vary by device.
{% endhint %}

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
