---
description: Sets the "desired target" bitrate in kbps
---

# \&videobitrate

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&bitrate`
* `&vb`

## Options

Example: `&videobitrate=6000`

| Value           | Description     |
| --------------- | --------------- |
| (integer value) | bitrate in kbps |

## Details

`&videobitrate` sets the target video bitrate of a video feed in a solo link or the video feeds in a scene.

For rooms, use [`&totalroombitrate`](totalroombitrate.md) / `&trb` when you specifically want to control guest-to-guest room viewing quality. If `&totalroombitrate` is not set on a room link, `&videobitrate` can be used as that guest's initial total room bitrate target.

If the sender uses [`&outboundvideobitrate`](and-outboundvideobitrate.md), that sets the default target bitrate on the push side. A viewer-set `&videobitrate` overrides that default. A sender-side [`&maxvideobitrate`](and-maxvideobitrate.md) still caps the maximum bitrate, regardless of what the viewer requests.

In some cases, `&videobitrate` is enforced via SDP munging, so it can also act as a maximum cap depending on browser/negotiation.

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

{% content-ref url="../../guides/video-bitrate-for-push-view-links.md" %}
[video-bitrate-for-push-view-links.md](../../guides/video-bitrate-for-push-view-links.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/audiobitrate.md" %}
[audiobitrate.md](../view-parameters/audiobitrate.md)
{% endcontent-ref %}
