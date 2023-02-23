---
description: How to control the video bitrate inside of a room
---

# Video bitrate in rooms

This guide will show you how to control and set up the bitrate in rooms as a director and as a guest.

## Default settings

Every guests is viewing video streams in a room with a combined bitrate of 500-kbps. If there is only one video stream, the guest will view the video on 500-kbps. Two video streams: 250-kbps per video.

## Director

As a director of a room you can control the total room bitrate dynamically.

<figure><img src="../.gitbook/assets/image (2) (3).png" alt=""><figcaption><p>Open the room settings via this button as a director</p></figcaption></figure>

<figure><img src="../.gitbook/assets/image (3).png" alt=""><figcaption><p>The default is (as explained before) 500-kbps. You can increase it op to 4000-kbps.</p></figcaption></figure>

You can control the total room bitrate also with a URL parameter: [`&totalroombitrate=6000`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md)``

<figure><img src="../.gitbook/assets/image (176).png" alt=""><figcaption><p>Default is 6000-kbps now with <code>&#x26;totalroombitrate=6000</code></p></figcaption></figure>

The default setting for the room is now 6000-kbps. You can decrease it dynamically though if the guests have any problems.

## Guest

If you add [`&roombitrate=2000`](../advanced-settings/video-bitrate-parameters/roombitrate.md) to the guest's link all the other guests can view the video of the guest with a bitrate of 2000-kbps. So three other guests watching the video stream of the guest -> 6000-kbps outgoing bitrate. [`&roombitrate`](../advanced-settings/video-bitrate-parameters/roombitrate.md) limits any guest viewer in the group chat room from pulling the video stream at more than the specified bitrate value.

You can also use [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) on the guest's URL if you want to have different settings for each guest. So adding `&totalroombitrate=4000` to a guest's URL, the guest can view all video streams in the room with a combined bitrate of 4000-kbps.

If you use [`&controlroombitrate`](../advanced-settings/video-bitrate-parameters/and-controlroombitrate.md) on the guest's URL, the guest can change the total room bitrate dynamically via a slider. If you add `&controlroombitrate&totalroombitrate=4000` to the guest's URL the guest can change the bitrate between 0 and 4000-kbps. It doesn't affect what other guest's are viewing.

![](<../.gitbook/assets/image (26).png>)![](<../.gitbook/assets/image (4) (1).png>)

## Examples

[https://vdo.ninja/?director=TestRoomName\&push=directorStreamID\&broadcast\&totalroombitrate=5000](https://vdo.ninja/?director=TestRoomName\&push=directorStreamID\&broadcast\&totalroombitrate=5000)\
When adding `&broadcast&totalroombitrate=5000` to the director's URL the guests can only see the video of the director with a bitrate of 5000-kbps. So they get pretty good video quality. If you have three guests in the room the outgoing bitrate fot the director is 15000-kbps, so it's pretty high.

If you want a guest to appear in scenes (for example in OBS) but you don't want other guests to see their video stream you can add `&roombitrate=0` to the guest's URL. [`&roombitrate`](../advanced-settings/video-bitrate-parameters/roombitrate.md) only affects the bitrate in the room, not in scenes.

Adding [`&maxbandwidth=80`](../advanced-settings/video-bitrate-parameters/and-maxbandwidth.md) to the guest's URL will allow to them to put 80 % of their available bandwidth into the video stream. This is useful for high quality gaming streams for example.

## Scenes

For scenes in OBS or other softwares ([`&scene`](../advanced-settings/view-parameters/scene.md) or [`&solo`](../advanced-settings/mixer-scene-parameters/and-solo.md)) use [`&videobitrate`](../advanced-settings/video-bitrate-parameters/bitrate.md) to specify the bitrate per video stream or [`&totalscenebitrate`](../advanced-settings/video-bitrate-parameters/and-totalscenebitrate.md) to get a combined bitrate for all videos in the scene.

3 guests in a scene -> `&videobitrate=3000`\
The bitrate of each guest will be 3000-kbps.

3 guests in a scene -> `&totalscenebitrate=3000`\
The bitrate of each guest will be 1000-kbps.

## Meshcast

If you are using [`&meshcast`](../newly-added-parameters/and-meshcast.md) on the director's or guest's URL remember that you control the bitrate via [`&meshcastbitrate`](../meshcast-settings/and-meshcastbitrate.md) on the sender's side.

## More Parameters

There are more parameters to control the bitrate. You can find them here:

{% content-ref url="video-bitrate-for-push-view-links.md" %}
[video-bitrate-for-push-view-links.md](video-bitrate-for-push-view-links.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/video-bitrate-parameters/" %}
[video-bitrate-parameters](../advanced-settings/video-bitrate-parameters/)
{% endcontent-ref %}
