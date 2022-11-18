---
description: Sets the maximum frame rate of the video in frames per second
---

# \&fps

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&framerate`
* `&fr`

## Options

| Value                         | Description                    |
| ----------------------------- | ------------------------------ |
| (some positive integer value) | Frame rate (frames per second) |

## Details

`&fps` sets the maximum frame rate of the video in frames per second on the publisher side. The actual frame rate could be less. Limiting the frame rate can reduce the CPU load and the bandwidth.

{% hint style="danger" %}
If the camera cannot support this frame rate, **it will fail**. Use [`&maxframerate`](../../source-settings/and-maxframerate.md) instead then.
{% endhint %}

## Related

{% content-ref url="../../source-settings/and-maxframerate.md" %}
[and-maxframerate.md](../../source-settings/and-maxframerate.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/screensharefps.md" %}
[screensharefps.md](../../source-settings/screensharefps.md)
{% endcontent-ref %}

{% content-ref url="and-contenthint.md" %}
[and-contenthint.md](and-contenthint.md)
{% endcontent-ref %}
