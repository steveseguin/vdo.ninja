---
description: Set a custom screenshare quality
---

# \&screensharequality

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ssq`

## Options

| Value | Description |
| ----- | ----------- |
| 0     | 1080p       |
| 1     | 720p        |
| 2     | 360p        |

## Details

{% hint style="info" %}
Update on V22:\
`&screensharequality` applies now to both primary and secondary types of screen-shares. Before [`&quality`](../advanced-settings/video-parameters/and-quality.md) was needed for primary screen share quality setting.
{% endhint %}

When a guest shares their screen during a group chat, it creates a secondary VDO.Ninja session to share that screen, alongside their active webcam. Two streams as a result.\
\
Using this parameter will give you control over the quality of the screen share, specifically, overriding what you might have set with [`&quality`](../advanced-settings/video-parameters/and-quality.md). It will not impact the webcam quality.

Set a target quality for your screenshare, when you screenshare as a secondary stream (in a room). Use [`&quality`](../advanced-settings/video-parameters/and-quality.md) if you want to set the screenshare quality when only screensharing.

## Related

{% content-ref url="../advanced-settings/video-parameters/and-quality.md" %}
[and-quality.md](../advanced-settings/video-parameters/and-quality.md)
{% endcontent-ref %}

{% content-ref url="screenshareid.md" %}
[screenshareid.md](screenshareid.md)
{% endcontent-ref %}

{% content-ref url="screensharefps.md" %}
[screensharefps.md](screensharefps.md)
{% endcontent-ref %}
