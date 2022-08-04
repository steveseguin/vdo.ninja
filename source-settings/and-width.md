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

## Related

{% content-ref url="and-height.md" %}
[and-height.md](and-height.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/upcoming-parameters/and-aspectratio.md" %}
[and-aspectratio.md](../advanced-settings/upcoming-parameters/and-aspectratio.md)
{% endcontent-ref %}

{% content-ref url="quality.md" %}
[quality.md](quality.md)
{% endcontent-ref %}
