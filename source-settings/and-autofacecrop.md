---
description: Enables the newer auto face crop effect
---

# \&autofacecrop

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&facecrop`
* `&effects=facecrop`
* `&effects=autofacecrop`

## Details

`&autofacecrop` enables the newer auto face crop effect. It crops and pans the sender's camera feed to keep the detected face framed.

This mode first tries the browser's native `FaceDetector` API. If that is unavailable or fails, it falls back to the bundled MediaPipe face detector model when the page is running in a secure context.

This is separate from [`&facetracker`](and-facetracker.md) / [`&effects=1`](effects.md), which keeps its original behavior for backwards compatibility.

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}

{% content-ref url="and-facetracker.md" %}
[and-facetracker.md](and-facetracker.md)
{% endcontent-ref %}
