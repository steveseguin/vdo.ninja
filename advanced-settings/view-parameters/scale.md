---
description: Scales the video resolution of the inbound video by the given percent
---

# \&scale

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Options

| Value                             | Description                                      |
| --------------------------------- | ------------------------------------------------ |
| (integer value between 0 and 100) | scale the incoming video feed by this percentage |

## Details

Example: If the video inbound has a resolution of 1920x1080, a `&scale=50` would limit it to 960x540 instead.

The nice thing about this is that it doesn't matter which resolution their camera supports; the scale is software based and doesn't care about resolutions or aspect ratios.

This can help a viewer reduce frame stuttering, cpu load, and improve frame rates, without having to have the guest rejoin the stream.

Requires the publisher of the stream to support dynamic scaling; Firefox and Chrome should be supported.

## Related

{% content-ref url="../upcoming-parameters/and-sharper.md" %}
[and-sharper.md](../upcoming-parameters/and-sharper.md)
{% endcontent-ref %}

{% content-ref url="../upcoming-parameters/and-sharperscreen.md" %}
[and-sharperscreen.md](../upcoming-parameters/and-sharperscreen.md)
{% endcontent-ref %}

{% content-ref url="dpi.md" %}
[dpi.md](dpi.md)
{% endcontent-ref %}
