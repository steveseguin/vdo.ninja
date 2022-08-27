---
description: Sets the maximum width of the video allowed in pixels
---

# \&width

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&w`

## Options

| Value                         | Description |
| ----------------------------- | ----------- |
| (some positive integer value) | width in px |

## Details

Sets the maximum width of the video allowed in pixels.

Actual width may be less based on bandwidth allowances.

Limiting the width can force the camera to use higher frame rates.

Limiting the width can reduce CPU load.

{% hint style="danger" %}
If the camera cannot support the width, **it will fail**.
{% endhint %}

You can get [4K](../guides/how-to-stream-4k-video-using-vdo.ninja.md) by adding `&width=3840&height=2160` to the source link if the camera supports it.

## Related

{% content-ref url="and-height.md" %}
[and-height.md](and-height.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/upcoming-parameters/and-aspectratio.md" %}
[and-aspectratio.md](../advanced-settings/upcoming-parameters/and-aspectratio.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/video-parameters/and-quality.md" %}
[and-quality.md](../advanced-settings/video-parameters/and-quality.md)
{% endcontent-ref %}
