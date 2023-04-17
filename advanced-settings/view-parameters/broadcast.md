---
description: >-
  A useful flag to allow the director to present their own video to the group,
  often used in conjunction with a virtual webcam or Meshcast. It allows for
  larger groups rooms by reducing load on guests
---

# \&broadcast

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&bc`

## Options

Example: `&broadcast=StreamID`

| Value            | Description                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (no value given) | Only play-back the director's stream                                                                                                                                |
| (stream ID)      | <p>You can pass an optional stream-ID to specify the stream's source manually.<br>If no value is passed, the source will be the room's director video out feed.</p> |

## Details

This command is like using [`&showonly=directorsStreamID`](../video-parameters/novideo.md) but with some extras tweaks that might be appropriate to a larger group room.

In essence, `&broadcast` only allows the playback of video-tracks and [shared-websites](../../source-settings/and-website.md) that originate from the main director. You may not know the stream ID of the main director ahead of time, so this parameter handles that for you automatically as well.

You can pass a stream ID as a value, which will specify the video source to be from a guest (or co-director), rather than the main director. You cannot pass multiple stream IDs to the `&broadcast` flag; just one. If needing more, consider using the [`&showonly`](../video-parameters/novideo.md) flag instead.

You add `&broadcast` to the guest invite links. You do not add this to the director or scene links.

{% embed url="https://youtu.be/QcFKI9q0yFs" %}
Configuring VDO.Ninja in a broadcast group mode
{% endembed %}

#### Why might you want to use this option?

In `&broadcast` mode, only the director is sharing video to the guests of the group room, so only the director has the burden of encoding multiple video streams and uploading them to guests. This is great if your guests are primarily on mobile-devices, have slow-Internet, or it is a larger room; otherwise each guest would be sharing video with each other guest as well.

When used with Meshcast, the director can reduce their own system burden even further. You can achieve fairly large group rooms with modest system requirements this way.

To ensure the guests see all that's needed, if the director selects their Virtual Camera output as their video source, then all the guests in the room will be able to see the live output of that virtual camera stream. The source of this virtual camera feed could be the main OBS output mix, or a specific [custom scene mix](https://github.com/exeldro/obs-virtual-cam-filter) that's design just for the guests.

#### Default settings and styles that are applied when \&broadcast is used

* The guest's self-preview becomes a mini-preview, rather than the normal large self-preview. You can disable the preview all together by using [`&nopreview`.](../../source-settings/and-nopreview.md)
* While `&broadcast` disables the video from other guests, it does not disable or impact their audio, so guests should still be able to hear each other.
* [`&showlist`](../../source-settings/showlist.md) is enabled by default for the guests, which provides a list of those in the room to the guests. `&showlist=0` can hide this, when added to the guest link; useful if you want a cleaner output for the guests.
* The header bar, with basic stats, is shown by default. [`&noheader`](../design-parameters/and-hideheader.md) can be added to the guest links, which will hide this top bar, room name and the stats.
* It hides the audio-only playback elements of other guests in the room, so it's not possible to mute or control the volume, as a guest, or other guests, when `&broadcast` is set. This is akin to having [`&style=1`](../../advanced-settings.md#style)set.

You can some-what imitate the `&broadcast` parameter using something like :&#x20;

`&showonly=DirectorStreamID&noiframe=DirectorStreamID&minipreview&style=1`

#### Performance considerations

While the `&broadcast` flag is great for reducing the load on guests in a room, it will put all the load onto the director instead.

* Consider using NVEnc or other hardware-encoders to encode any RTMP streams in your studio software to reduce CPU load there. This frees up more CPU for VDO.Ninja.
* Make sure you have a capable computer; an AMD 5900x CPU is recommend for most users using this mode without Meshcast, allowing for medium-sized group rooms with some headroom to spare.
* A quad-core computer might only be able to support 1 or 2 guests adequately in this mode, although using Meshcast can help overcome that limitation.
* If you would like the guests to see even higher quality video, consider using [`&totalroombitrate=2500`](../video-bitrate-parameters/totalroombitrate.md) as an option to greatly improve the video quality. This also will greatly also increase the load on the director, so good internet and a powerful CPU will be needed.

#### Using `&broadcast` mode with Meshcast as a source

* Using a service like meshcast.io, along with the [`&website`](../../source-settings/and-website.md) sharing option, can also greatly reduce load on the director and guests. The website sharing function works with other video content delivery networks, not just Meshcast.io, so you have choices.
* When the director shares a website, their own low-latency VDO.Ninja audio remains active, so audio doubling could happen if the website contains their audio also. You'll want to mute either the website's audio or the director's VDO.Ninja audio, to avoid this issue. To also avoid echo-cancellation issues and audio delays, it is recommended to mute the website audio, as VDO.Ninja's audio will have not have those issues.
* You may want to add [`&novideo`](../video-parameters/novideo-1.md) to the guest invite links if you only intend to share video via the website sharing function. This ensures the director's VDO.Ninja video-track doesn't appear, as VDO.Ninja can't always tell if a website contains a video track or not, and so may show the director's video alongside the shared website in some cases otherwise.
* In more recent versions of VDO.Ninja (v22), Meshcast is available built-into VDO.Ninja via the [`&meshcast`](../../newly-added-parameters/and-meshcast.md) parameter, which sends both audio and video over meshcast in sync, without concerns of echo cancellation or audio doubling. Just add `&meshcast` to the director's URL to use this mode; the director's audio and video will auto-publish via Meshcast without needing to visit meshcast.io.
* The director's ability to share a website (meshcast.io link) is via a button found in the director's control bar. The director doesn't need to use [`&website`](../../source-settings/and-website.md) parameter since a website sharing functionality has its own dedicated button in the director's control room.

![The button used to share a website as the director](<../../.gitbook/assets/image (93) (1) (1).png>)

* If using meshcast.io and the website share functionality, rather than `&meshcast`, you will want to mute the Meshcast source to avoid echo cancellation or audio-doubling. The meshcast.io source page has options to do so there, but you can also add [`&mute`](../../source-settings/and-mute.md) to the meshcast.io when sharing it, to have it auto-mute on playback for the guests.

{% embed url="https://youtu.be/YxduINMXw1M" %}
Understanding Meshcast as a tool for VDO.Ninja
{% endembed %}

{% embed url="https://www.youtube.com/watch?v=-7QsLChfdsE" %}
An older video, but it gets some basics across still about \&broadcast mode
{% endembed %}

## Related

{% content-ref url="../video-parameters/novideo.md" %}
[novideo.md](../video-parameters/novideo.md)
{% endcontent-ref %}
