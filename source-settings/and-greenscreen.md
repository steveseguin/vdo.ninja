---
description: Enables the digital greenscreen effect
---

# \&greenscreen

Sender-Side Option! ([`&push`](push.md))

## Details

`&greenscreen` is a shortcut for [`&effects=4`](effects.md). It enables a virtual greenscreen on the publisher side, removing the background and replacing it with solid green (#00FF00). This is useful when you want to do chroma-key compositing in OBS or another tool.

Please enable WebAssembly-SIMD support under `chrome://flags/` for significantly reduced CPU load when using this feature.

## Related

{% content-ref url="effects.md" %}
[effects.md](effects.md)
{% endcontent-ref %}
