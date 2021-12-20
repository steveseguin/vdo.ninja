---
description: Sets the maximum frame rate of the video in frames per second.
---

# \&framerate

## Aliases

* `&fps`
* `&fr`

## Options

| Value                         | Description                  |
| ----------------------------- | ---------------------------- |
| (some positive integer value) | Frame rate frames per second |

## Details

Actual frame rate could be less.\
Limiting the frame rate can reduce the CPU load.\
Limiting the frame rate can reduce bandwidth.

{% hint style="danger" %}
If the camera cannot support this frame rate, **it will fail**.
{% endhint %}
