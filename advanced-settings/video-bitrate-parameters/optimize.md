---
description: >-
  Video bitrate reduced when the video is not visible in OBS (not active in a
  scene)
---

# \&optimize

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&optimize=1000`

| Value            | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| (integer value)  | value in kbps                                                         |
| (no value given) | 600-kbps                                                              |
| `0`              | disables the video track when not considered visible in a scene (OBS) |

## Details

`&optimize` reduces the video bitrate to 600-kbps when the video is not visible in OBS (not active in a scene). This is mainly there to help with reducing load for OBS and for guests. It can take a few seconds for the bitrate to ramp back up after it becomes active again.



### Consider using \&optimize=0&#x20;

As of VDO.NInja v26, \&optimize=0 will make it so that a remote guest will not connect to a manual scene (\&scene=1, for example) until the director manually adds the guest to the scene.

What this means is that you can have each guest assigned to their own scene (eg: 1 to 8) and have each be treated like a \&solo link, so long as you never add more than one at a time and wait for the previous guest to disconnect.

Normally, otherwise, if you had 8 guests in a room, and each had their own scene, without \&optimize=0 set, each scene would still have each of those guests connected; so each guest would be connecting 7 additional times, without it being needed. This reduces stress on the VDO.Ninja servers, but also avoids connection issues when there are perhaps dozens of users in a room.\
\
While adding a guest to a scene this way takes about a second, for the connection to be made, once added you can remove and add the guest back quickly, as they stay connected at that point. \&optimize=0 will also, as before, mute the video/audio tracks, lowering the video/audio bitrate of those tracks to 0, when not needed.

Pausing and resuming a video/audio track does take a split second to do, and it may result in temporarily low quality video after being enabled, it you don't intend to add/remove guests frequently to a scene, it is highly recommended you use it.\
\
The only time you shouldn't use \&optimize=0 is perhaps when you have just a single group scene, and you prefer speed and quality as you add/remove guests to the room. This might also be the case if using the \&activespeaker mode, where guests are hidden and removed when not active speaking.\


{% hint style="warning" %}
This does not work with iPhone-sourced video streams.
{% endhint %}

## Related

{% content-ref url="bitrate.md" %}
[bitrate.md](bitrate.md)
{% endcontent-ref %}
