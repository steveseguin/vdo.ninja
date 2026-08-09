---
description: >-
  Video bitrate reduced when the video is not visible in OBS (not active in a
  scene)
---

# \&optimize

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&optimize=1000`

| Value                         | Description                                                           |
| ----------------------------- | --------------------------------------------------------------------- |
| Parameter omitted             | optimization is off                                                   |
| `&optimize` or `&optimize=0`  | disables the video track while it is not visible in a scene (OBS)     |
| Positive integer, such as 600 | hidden-source bitrate in kbps                                         |

## Details

`&optimize` reduces the work done for a video source while OBS is not showing it. It is a viewer-side option, so add it to the OBS view or scene URL.

In simple terms:

1. OBS hides the source or switches away from its scene.
2. VDO.Ninja lowers that connection to the bitrate specified by `&optimize`.
3. When OBS shows the source again, VDO.Ninja restores its previous bitrate and resolution and requests a fresh keyframe.

If the parameter is omitted, this visibility-based optimization is disabled. If `&optimize` is included without a number, the code treats it as `&optimize=0`: the video track is deactivated while hidden and resumed when visible.

A positive value keeps the video connected at reduced quality instead of turning it off. For example, `&optimize=600` keeps the hidden source running at up to 600-kbps. Values around 300 to 600-kbps are a useful middle ground for frequent scene switching: they reduce CPU and bandwidth while generally resuming faster and more cleanly than `0` or extremely low values.

It can still take a few seconds for quality to ramp back up after a source becomes visible.

{% hint style="warning" %}
Very low values, such as `&optimize=35` or `&optimize=50`, cause aggressive bitrate and resolution changes. Some H264 hardware encoders can resume to a black frame when OBS makes the source visible again; `&optimize=0`, which deactivates the track while hidden, can be especially prone to this. If this happens, try `&codec=vp8` and/or use a non-zero floor of about 300 to 600-kbps for frequent scene switching.
{% endhint %}

### Consider using \&optimize=0&#x20;

As of VDO.NInja v26, \&optimize=0 will make it so that a remote guest will not connect to a manual scene (\&scene=1, for example) until the director manually adds the guest to the scene.

What this means is that you can have each guest assigned to their own scene (eg: 1 to 8) and have each be treated like a \&solo link, so long as you never add more than one at a time and wait for the previous guest to disconnect.

Normally, otherwise, if you had 8 guests in a room, and each had their own scene, without \&optimize=0 set, each scene would still have each of those guests connected; so each guest would be connecting 7 additional times, without it being needed. This reduces stress on the VDO.Ninja servers, but also avoids connection issues when there are perhaps dozens of users in a room.\
\
While adding a guest to a scene this way takes about a second, for the connection to be made, once added you can remove and add the guest back quickly, as they stay connected at that point. \&optimize=0 will also, as before, mute the video/audio tracks, lowering the video/audio bitrate of those tracks to 0, when not needed.

Pausing and resuming a video/audio track does take a split second to do, and it may result in temporarily low quality video after being enabled, it you don't intend to add/remove guests frequently to a scene, it is highly recommended you use it.\
\
The only time you shouldn't use \&optimize=0 is perhaps when you have just a single group scene, and you prefer speed and quality as you add/remove guests to the room. This might also be the case if using the \&activespeaker mode, where guests are hidden and removed when not active speaking.<br>

{% hint style="warning" %}
This does not work with iPhone-sourced video streams.
{% endhint %}

## Related

{% content-ref url="bitrate.md" %}
[bitrate.md](bitrate.md)
{% endcontent-ref %}
