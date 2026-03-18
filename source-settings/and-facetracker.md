---
description: Enables the face tracker effect
---

# \&facetracker

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&facetracking`

## Details

`&facetracker` is a shortcut for [`&effects=1`](effects.md). It slowly pans, tilts, and zooms in on the first face detected.

{% hint style="warning" %}
This requires the Chromium experimental face detection API. Enable it at: `chrome://flags/#enable-experimental-web-platform-features`
{% endhint %}

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
