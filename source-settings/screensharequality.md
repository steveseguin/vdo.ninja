---
description: Set a custom screenshare quality
---

# \&screensharequality

When a guest shares their screen during a group chat, it creates a secondary VDO.Ninja session to share that screen, alongside their active webcam.  Two streams as a result.\
\
Using this parameter will give you control over the quality of the screen share, specifically, overriding what you might have set with \&quality.    It will not impact the webcam quality.

## Aliases

* `&ssq`

## Options

| Value | Description |
| ----- | ----------- |
| 0     | 1080p       |
| 1     | 720p        |
| 2     | 360p        |

## Details

Set a target quality for your screenshare, when you screenshare as a secondary stream (in a room). Use [\&quality](quality.md) if you want to set the screenshare quality when only screensharing.

## Related

{% content-ref url="screenshareid.md" %}
[screenshareid.md](screenshareid.md)
{% endcontent-ref %}

{% content-ref url="screensharefps.md" %}
[screensharefps.md](screensharefps.md)
{% endcontent-ref %}
