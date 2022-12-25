---
description: Changing the bitrate of the outgoing and incoming video and for rooms
---

# Video Bitrate Parameters

They are separated in two groups: [source side](./#source-side-options) (push) options for the sender of the video and [viewer side](./#viewer-side-options) (view) options for the viewer of the video. Some of them are especially for rooms.

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

| Parameter                                                  | Explanation                                                                                                           |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ``[`&outboundvideobitrate`](and-outboundvideobitrate.md)`` | Target video bitrate and max bitrate for outgoing video streams                                                       |
| ``[`&maxvideobitrate`](and-maxvideobitrate.md)``           | Limits the max video bitrate out for this publisher, per stream out                                                   |
| ``[`&limittotalbitrate`](limittotalbitrate.md)``           | Limits the total outbound bitrate                                                                                     |
| ``[`&controlroombitrate`](and-controlroombitrate.md)``     | Allows a guest to control their total room video bitrate dynamically from the settings panel (under video settings)   |
| ``[`&roombitrate`](roombitrate.md)``                       | Limits any guest viewer in the group chat room from pulling the video stream at more than the specified bitrate value |
| ``[`&maxbandwidth`](and-maxbandwidth.md)\*                 | Judges the available bandwidth of a sender's connection                                                               |

\*NEW IN VERSION 22

## **Viewer side options**

You have to add them to the viewer side ([`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md)).

| Parameter                                            | Explanation                                                                                                     |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ``[`&videobitrate`](bitrate.md)``                    | Sets the "desired target" bitrate in kbps                                                                       |
| ``[`&totalscenebitrate`](and-totalscenebitrate.md)`` | Max. video bitrate a scene uses                                                                                 |
| ``[`&totalroombitrate`](totalroombitrate.md)``       | The total bitrate a guest in a room can view video streams with                                                 |
| ``[`&totalbitrate`](and-totalbitrate.md)\*           | Sets both [`&totalscenebitrate`](and-totalscenebitrate.md) and [`&totalroombitrate`](totalroombitrate.md) flags |
| ``[`&zoomedbitrate`](and-zoomedbitrate.md)``         | Lets you set the target bitrate for a guest when they 'zoom in' (fullscreen) on a video                         |
| ``[`&optimize`](optimize.md)``                       | Video bitrate reduced when the video is not visible in OBS (not active in a scene)                              |

\*NEW IN VERSION 22

## Related

{% content-ref url="../video-parameters/" %}
[video-parameters](../video-parameters/)
{% endcontent-ref %}

{% content-ref url="../../guides/video-bitrates-for-push-view-links.md" %}
[video-bitrates-for-push-view-links.md](../../guides/video-bitrates-for-push-view-links.md)
{% endcontent-ref %}
