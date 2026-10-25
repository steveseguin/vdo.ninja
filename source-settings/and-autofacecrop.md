---
description: Crops and pans the camera to keep your face framed
---

# \&autofacecrop

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&facecrop`
* `&effects=facecrop`
* `&effects=autofacecrop`

## Details

`&autofacecrop` turns on the experimental **Auto face crop** effect. It crops and pans the sender's camera so the detected face stays framed. It matches the **Auto face crop** option in the effects menu.

```
https://vdo.ninja/?push=STREAMID&autofacecrop
```

It uses the browser's built-in `FaceDetector` API when available. Otherwise, it uses the MediaPipe face detector bundled with VDO.Ninja, which needs a secure page (HTTPS or localhost).

This is separate from [`&facetracker`](and-facetracker.md) / [`&effects=1`](effects.md), which keeps its original behavior for backwards compatibility.

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}

{% content-ref url="and-facetracker.md" %}
[and-facetracker.md](and-facetracker.md)
{% endcontent-ref %}
