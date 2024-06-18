---
description: Set a custom screenshare quality
---

# \&screensharequality

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ssq`

## Options

Example: `&screensharequality=1`

| Value | Description   |
| ----- | ------------- |
| `0`   | 1080p         |
| `1`   | 720p          |
| `2`   | 360p          |
| -1    | unconstrained |

## Details

{% hint style="info" %}
Update on V22:\
`&screensharequality` applies now to both primary and secondary types of screen-shares. Before [`&quality`](../advanced-settings/video-parameters/and-quality.md) was needed for primary screen share quality setting.
{% endhint %}

When a guest shares their screen during a group chat, it creates a secondary VDO.Ninja session to share that screen, alongside their active webcam. Two streams as a result.

Using this parameter will give you control over the quality of the screen share, specifically, overriding what you might have set with [`&quality`](../advanced-settings/video-parameters/and-quality.md). It will not impact the webcam quality.

Set a target quality for your screen share, when you screen share as a secondary stream (in a room).



### Achieving higher sharpness

If looking to screen share a document at the highest quality possible, consider the follow URL parameters:

* `&screensharequality=-1` may be a good option for screen sharing documents, where more sharpness is needed.
* `&screensharecontenthint=detail` to hint to use higher resolution over frame rates; this would be applied to the viewer's URL.
* `&codec=av1` can also be applied to the viewer's URL to change to a better video codec.
* `&screensharebitrate=6000` on the viewer side can increase the video bitrate, but you can go upwards of 20000-kbps if needed for heavier motion-based video.
* `&scale=100` on the viewer end can avoid scaling down the image if the playback window is smaller than the video's native resolution.  This will avoid double aliasing issues.
* As well, if using OBS Studio for playback, you can add a sharpness filter to the video to improve the clarity. This can undo some of the softness caused by video compression, improving edge sharpness.
*   If in a group room, as a guest, the director can increase the total bitrate of the room, which will improve the screen share quality for all the guests in the room. By default, guests and directors view a screen share at a relatively low bitrate.\
    \


    <figure><img src="../.gitbook/assets/image (242).png" alt=""><figcaption></figcaption></figure>

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
