---
description: Sets the maximum width of the video allowed in pixels.
---

# \&width

## Aliases

* `&w`

## Options

| Value                         | Description |
| ----------------------------- | ----------- |
| (some positive integer value) | Width in px |

## Details

Actual width may be less based on bandwidth allowances.

Limiting the width can force the camera to use higher frame rates.

Limiting the width can reduce CPU load.

{% hint style="danger" %}
If the camera cannot support the width, **it will fail**.
{% endhint %}
