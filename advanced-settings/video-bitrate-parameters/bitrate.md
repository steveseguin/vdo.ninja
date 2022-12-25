---
description: Sets the "desired target" bitrate in kbps
---

# \&videobitrate

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&bitrate`
* `&vb`

## Options

| Value           | Description     |
| --------------- | --------------- |
| (integer value) | bitrate in kbps |

## Details

`&videobitrate` sets the target video bitrate of a video feed in a solo link or the video feeds in a scene.

This parameter is only for scenes and solo links. Use [`&totalroombitrate`](totalroombitrate.md) for example to set up the video bitrate for guests in a room.

{% hint style="info" %}
Default value will target around **2500**-kbps.
{% endhint %}

The maximum achievable bitrate is around 60,000-kbps (60-mbps).

**Lowering** the bitrate can sometimes **reduce CPU load**, **bandwidth**, and **stuttering** issues

You might want to increase the bitrate for game streams, to ensure smooth frame rates.

{% hint style="danger" %}
Not compatible with **Firefox**.
{% endhint %}

## Related

{% content-ref url="../../guides/video-bitrates-for-push-view-links.md" %}
[video-bitrates-for-push-view-links.md](../../guides/video-bitrates-for-push-view-links.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/audiobitrate.md" %}
[audiobitrate.md](../view-parameters/audiobitrate.md)
{% endcontent-ref %}
