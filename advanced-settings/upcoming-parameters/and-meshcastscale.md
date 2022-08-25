---
description: Scales down the meshcast video output via the URL
---

# \&meshcastscale

Meshcast Option / Sender-Side Option! ([`&meshcast`](../../newly-added-parameters/and-meshcast.md), [`&push`](../../source-settings/push.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&mcscale`

## Options

| Value                 | Description                                       |
| --------------------- | ------------------------------------------------- |
| (percentage 1 to 100) | will scale down the video to the percentage given |

## Details

The `&meshcastscale` parameter will scale down the meshcast video output via the URL, post camera capture setup. Because of how Meshcast works, this is a sender-side parameter. You may wish to use this to lower the resolution if your camera has a fixed capture resolution. (Alternatively, if you need to dynamically adjust the resolution, that option already exists via camera settings via width/height slider adjustments)

[https://vdo.ninja/alpha/?meshcast\&mcscale=50](https://vdo.ninja/alpha/?meshcast\&mcscale=50)

## Related

{% content-ref url="../../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/scale.md" %}
[scale.md](../view-parameters/scale.md)
{% endcontent-ref %}
