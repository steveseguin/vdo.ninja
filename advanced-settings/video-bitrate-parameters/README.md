---
description: Changing the bitrate of the outgoing and incoming video and for rooms
---

# Video Bitrate Parameters

They are separated in two groups: [source side](./#source-side-options) (push) options for the sender of the video and [viewer side](./#viewer-side-options) (view) options for the viewer of the video. Some of them are especially for rooms.

Viewer-side `&videobitrate` overrides the sender default from `&outboundvideobitrate`, while `&maxvideobitrate` remains a software-enforced cap. Room-level limits still apply where relevant.

Depending on browser/negotiation, `&videobitrate` and `&outboundvideobitrate` can also be enforced via SDP munging and may act as caps.

For room guest-to-guest quality, the main setting is [`&totalroombitrate`](totalroombitrate.md) / `&trb`. If the main director is connected, the director's current room bitrate is sent to guests. If no main director is controlling the room bitrate, each guest uses their own URL value or the default room behavior.

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

<table><thead><tr><th width="150">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="and-outboundvideobitrate.md"><code>&#x26;outboundvideobitrate</code></a></td><td>Default target video bitrate for outgoing streams</td></tr><tr><td><a href="and-maxvideobitrate.md"><code>&#x26;maxvideobitrate</code></a></td><td>Hard max video bitrate out for this publisher, per stream</td></tr><tr><td><a href="limittotalbitrate.md"><code>&#x26;limittotalbitrate</code></a></td><td>Limits the total outbound bitrate</td></tr><tr><td><a href="roombitrate.md"><code>&#x26;roombitrate</code></a></td><td>Caps how much other guests can request from this publisher inside a group room</td></tr><tr><td><a href="and-maxbandwidth.md"><code>&#x26;maxbandwidth</code></a></td><td>Judges the available bandwidth of a sender's connection</td></tr></tbody></table>

## **Viewer side options**

You have to add them to the viewer side ([`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md)).

<table><thead><tr><th width="150">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="bitrate.md"><code>&#x26;videobitrate</code></a></td><td>Sets the desired per-stream bitrate in kbps; in rooms it can initialize the total room bitrate only when no <code>&#x26;trb</code> is set</td></tr><tr><td><a href="and-totalscenebitrate.md"><code>&#x26;totalscenebitrate</code></a></td><td>Total bitrate budget a scene/view link uses across visible video feeds</td></tr><tr><td><a href="totalroombitrate.md"><code>&#x26;totalroombitrate</code></a></td><td>Total guest-to-guest room viewing budget; alias <code>&#x26;trb</code></td></tr><tr><td><a href="and-totalbitrate.md"><code>&#x26;totalbitrate</code></a></td><td>Shortcut that sets both scene and room total bitrate flags; use <code>&#x26;trb</code> or <code>&#x26;tsb</code> when you want one specific target</td></tr><tr><td><a href="and-controlroombitrate.md"><code>&#x26;controlroombitrate</code></a></td><td>Lets a guest lower their own room receive budget from the settings panel</td></tr><tr><td><a href="and-zoomedbitrate.md"><code>&#x26;zoomedbitrate</code></a></td><td>Lets you set the target bitrate for a guest when they 'zoom in' (fullscreen) on a video</td></tr><tr><td><a href="optimize.md"><code>&#x26;optimize</code></a></td><td>Video bitrate reduced when the video is not visible in OBS (not active in a scene)</td></tr><tr><td><a href="../../newly-added-parameters/and-screensharebitrate.md"><code>&#x26;screensharebitrate</code></a></td><td>Lets you manually set the video bitrate for screen-shares</td></tr></tbody></table>

## Room-only and mobile room options

These parameters are for guest room calls where mobile device safety and mesh-network load matter.

| Parameter | Explanation |
| --- | --- |
| [`&roomtier1bitrate`](roomtier1bitrate.md) | Automatic room-only total bitrate tier for weaker mobile devices |
| [`&rt1b`](rt1b.md) | Short alias for `&roomtier1bitrate` |
| [`&roomonlylowbitrate`](roomonlylowbitrate.md) | Alias for `&roomtier1bitrate` |
| [`&rolb`](rolb.md) | Short alias for `&roomtier1bitrate` |
| [`&roomtier2bitrate`](roomtier2bitrate.md) | Automatic room-only total bitrate tier for normal or stronger devices |
| [`&rt2b`](rt2b.md) | Short alias for `&roomtier2bitrate` |
| [`&roomonlybitrate`](roomonlybitrate.md) | Alias for `&roomtier2bitrate` |
| [`&rob`](rob.md) | Short alias for `&roomtier2bitrate` |
| [`&maxmobilebitrate`](and-maxmobilebitrate.md) | Normal mobile sender cap for guest room publishing |
| [`&lowmobilebitrate`](and-lowmobilebitrate.md) | Lower fallback mobile sender cap for older or overloaded mobile devices |
| [`&nomobilebitratecap`](and-nomobilebitratecap.md) | Disables only the mobile sender bitrate safety cap |

{% hint style="info" %}
Automatic room-only tiers are meant for guest-only conferencing rooms. If a director or scene viewer is connected, use explicit room or scene bitrate parameters instead.
{% endhint %}

## Related

{% content-ref url="../../guides/room-only-mobile-bitrate-tiers.md" %}
[room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md)
{% endcontent-ref %}

{% content-ref url="../video-parameters/" %}
[video-parameters](../video-parameters/)
{% endcontent-ref %}

{% content-ref url="../../guides/video-bitrate-in-rooms.md" %}
[video-bitrate-in-rooms.md](../../guides/video-bitrate-in-rooms.md)
{% endcontent-ref %}

{% content-ref url="../../guides/video-bitrate-for-push-view-links.md" %}
[video-bitrate-for-push-view-links.md](../../guides/video-bitrate-for-push-view-links.md)
{% endcontent-ref %}
