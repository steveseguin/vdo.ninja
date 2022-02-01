---
description: Sets the maximum frame rate of the video in frames per second
---

# \&framerate

## Aliases

* `&fps`
* `&fr`

## Options

| Value                         | Description                    |
| ----------------------------- | ------------------------------ |
| (some positive integer value) | Frame rate (frames per second) |

## Details

Sets the maximum frame rate of the video in frames per second.\
Actual frame rate could be less.\
Limiting the frame rate can reduce the CPU load.\
Limiting the frame rate can reduce bandwidth.

{% hint style="danger" %}
If the camera cannot support this frame rate, **it will fail**.
{% endhint %}

## Related

{% content-ref url="and-maxframerate.md" %}
[and-maxframerate.md](and-maxframerate.md)
{% endcontent-ref %}

{% content-ref url="screensharefps.md" %}
[screensharefps.md](screensharefps.md)
{% endcontent-ref %}
