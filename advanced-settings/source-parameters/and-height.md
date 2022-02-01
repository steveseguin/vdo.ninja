---
description: Sets the maximum height of the video allowed in pixels
---

# \&height

## Aliases

* `&h`

## Options

| Value                         | Description  |
| ----------------------------- | ------------ |
| (some positive integer value) | height in px |

## Details

Sets the maximum height of the video allowed in pixels.

Actual height may be less based on bandwidth allowances.

Limiting the height can force the camera to use higher frame rates.

Limiting the height can reduce the CPU load.

[https://vdo.ninja/supports](https://obs.ninja/supports) will list the support resolutions of your default camera.

[https://webrtchacks.github.io/WebRTC-Camera-Resolution/](https://webrtchacks.github.io/WebRTC-Camera-Resolution/) Is a tool to help you find the resolutions supported by your camera.

You can use [`&scale=50`](../viewer-parameters/scale.md) also, as a viewer, to scale down a selected width/height to something more exact.

{% hint style="danger" %}
If the camera cannot support the height, **it will fail**.
{% endhint %}

## Related

{% content-ref url="and-width.md" %}
[and-width.md](and-width.md)
{% endcontent-ref %}

{% content-ref url="quality.md" %}
[quality.md](quality.md)
{% endcontent-ref %}
