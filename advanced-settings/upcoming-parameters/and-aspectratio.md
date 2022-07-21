---
description: Changes the aspect ratio on the publisher side
---

# \&aspectratio

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&ar`

## Options

| Value            | Description                     |
| ---------------- | ------------------------------- |
| landscape        | aspect ratio of 16:9 (1.777777) |
| portrait         | aspect ratio of 9:16 (0.5625)   |
| square           | aspect ratio of 1:1 (1)         |
| 1.33333          | aspect ratio of 4:3             |
| (decimal number) | aspect ratio                    |

## Details

`&aspectratio` changes the aspect ratio on the publisher side. Floating point value; 1.777777 is common; not supported by all browsers.

[https://vdo.ninja/alpha/?webcam\&aspectratio=1.33333](https://vdo.ninja/alpha/?webcam\&aspectratio=1.33333)\
![](<../../.gitbook/assets/image (102).png>)

You can also change the aspect ratio via the video settings menu.

![](<../../.gitbook/assets/image (103) (1).png>)

If using `&aspectratio`, it will keep the [height](../../source-settings/and-height.md) constant, and vary width, unless [`&width`](../../source-settings/and-width.md) is set, which will then be the fixed constant.

## Related

{% content-ref url="../../source-settings/quality.md" %}
[quality.md](../../source-settings/quality.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-width.md" %}
[and-width.md](../../source-settings/and-width.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-height.md" %}
[and-height.md](../../source-settings/and-height.md)
{% endcontent-ref %}
