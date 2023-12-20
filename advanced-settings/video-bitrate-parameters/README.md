---
description: Changing the bitrate of the outgoing and incoming video and for rooms
---

# Video Bitrate Parameters

They are separated in two groups: [source side](./#source-side-options) (push) options for the sender of the video and [viewer side](./#viewer-side-options) (view) options for the viewer of the video. Some of them are especially for rooms.

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

<table><thead><tr><th width="150">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="and-outboundvideobitrate.md"><code>&#x26;outboundvideobitrate</code></a></td><td>Target video bitrate and max bitrate for outgoing video streams</td></tr><tr><td><a href="and-maxvideobitrate.md"><code>&#x26;maxvideobitrate</code></a></td><td>Limits the max video bitrate out for this publisher, per stream out</td></tr><tr><td><a href="limittotalbitrate.md"><code>&#x26;limittotalbitrate</code></a></td><td>Limits the total outbound bitrate</td></tr><tr><td><a href="and-controlroombitrate.md"><code>&#x26;controlroombitrate</code></a></td><td>Allows a guest to control their total room video bitrate dynamically from the settings panel (under video settings)</td></tr><tr><td><a href="roombitrate.md"><code>&#x26;roombitrate</code></a></td><td>Limits any guest viewer in the group chat room from pulling the video stream at more than the specified bitrate value</td></tr><tr><td><a href="and-maxbandwidth.md"><code>&#x26;maxbandwidth</code></a></td><td>Judges the available bandwidth of a sender's connection</td></tr></tbody></table>

## **Viewer side options**

You have to add them to the viewer side ([`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md)).

<table><thead><tr><th width="150">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="bitrate.md"><code>&#x26;videobitrate</code></a></td><td>Sets the "desired target" bitrate in kbps</td></tr><tr><td><a href="and-totalscenebitrate.md"><code>&#x26;totalscenebitrate</code></a></td><td>Max. video bitrate a scene uses</td></tr><tr><td><a href="totalroombitrate.md"><code>&#x26;totalroombitrate</code></a></td><td>The total bitrate a guest in a room can view video streams with</td></tr><tr><td><a href="and-totalbitrate.md"><code>&#x26;totalbitrate</code></a></td><td>Sets both <a href="and-totalscenebitrate.md"><code>&#x26;totalscenebitrate</code></a> and <a href="totalroombitrate.md"><code>&#x26;totalroombitrate</code></a> flags</td></tr><tr><td><a href="and-zoomedbitrate.md"><code>&#x26;zoomedbitrate</code></a></td><td>Lets you set the target bitrate for a guest when they 'zoom in' (fullscreen) on a video</td></tr><tr><td><a href="optimize.md"><code>&#x26;optimize</code></a></td><td>Video bitrate reduced when the video is not visible in OBS (not active in a scene)</td></tr><tr><td><a href="../../newly-added-parameters/and-screensharebitrate.md"><code>&#x26;screensharebitrate</code></a></td><td>Lets you manually set the video bitrate for screen-shares</td></tr></tbody></table>

## Related

{% content-ref url="../video-parameters/" %}
[video-parameters](../video-parameters/)
{% endcontent-ref %}

{% content-ref url="../../guides/video-bitrate-in-rooms.md" %}
[video-bitrate-in-rooms.md](../../guides/video-bitrate-in-rooms.md)
{% endcontent-ref %}

{% content-ref url="../../guides/video-bitrate-for-push-view-links.md" %}
[video-bitrate-for-push-view-links.md](../../guides/video-bitrate-for-push-view-links.md)
{% endcontent-ref %}
