---
description: List of apps and helper tools Steve has created to be used with VDO.Ninja
---

# Steve's helper apps & tools

## Electron Capture

[https://github.com/steveseguin/electroncapture](https://github.com/steveseguin/electroncapture)

Created for [VDO.Ninja](https://vdo.ninja) users, it can provide users a clean way of window capturing websites. In the case of [VDO.Ninja](https://vdo.ninja), it may offer a more flexible and reliable method of capturing live video than the browser source plugin built into OBS.

![](<../.gitbook/assets/image (36).png>)

### Why ?

On some systems the OBS Browser Source plugin isn't available or doesn't work all that well, so this tool is a viable alternative. It lets you cleanly screen-grab just a video stream without the need of the Browser Source plugin. It also makes it easy to select the output audio playback device, such as a Virtual Audio device: ie) [https://vb-audio.com/Cable/](https://vb-audio.com/Cable/) (Windows & macOS; donationware).

The app can also be set to remain on top of other windows, attempts to hide the mouse cursor when possible, provides accurate window sizes for 1:1 pixel mapping, and supports global system hotkeys (`CTRL+M` on Windows, for example).

Windows users may find it beneficial too, as it offers support for VDO.Ninja's [`&buffer`](https://docs.vdo.ninja/viewers-settings/buffer) audio sync command and it has robust support for video packet loss. In other words, it can playback live video better than OBS can, with fewer video playback errors and with better audio/video sync. If you have a spare monitor, it may at times be worth the hassle to use instead of OBS alone.

The Electron Capture app uses recent versions of Chromium, which is more resistant to desync, video smearing, and other issues that might exist in the native OBS browser source capture method. [More benefits listed here](https://github.com/steveseguin/electroncapture/blob/master/BENEFITS.md)

Lastly, since playback is agnostic, you can window-capture the same video multiple times, using one copy in a mixed-down live stream, while using a window-capture to record a clean full-resolution isolated video stream.

## YouTube, Twitch chat and social comment Overlays plugin

[https://github.com/steveseguin/twitch-youtube-restream-chat-overlay](https://github.com/steveseguin/twitch-youtube-restream-chat-overlay)

This Chrome browser extension turns your social chat and comments section into selectable social overlays for OBS Studio or other studio production software.

This Chat overlay extensions will forward the selected chat message over a web-socket connection to a secondary webpage, which can be used in OBS-Studio as a simple browser source. This makes capturing the chat messages from a live video stream very easy and fast -- no Chroma keying or window-capturing needed. It also makes customizing the style pretty easy, with no Chrome extension development needed.

**Supported sites as of August 2022 (requests welcomed)**

* glimesh.tv (pop-out chat)
* youtube.com (pop-out chat)
* twitch.tv (pop-out chat)
* restream.io (go here: [https://chat.restream.io/chat](https://chat.restream.io/chat))
* trovo.live (pop-out chat)
* Instagram (posts) (trigger it with a button)
* Instagram Live (click on chat messages)
* Twitter (works with tweets and replies)
* Facebook Live chat (no pop up option; does not support Mobile/4G/LTE - wifi or ethernet only)
* Crowdcast.io
* Zoom.us (text chat and polls)
* polleverywhere.com ([https://www.polleverywhere.com/discourses/xxxxx](https://www.polleverywhere.com/discourses/xxxxx) question page)
* Trovo (open the chat pop-up page: [https://trovo.live/chat/xxxxxx](https://trovo.live/chat/xxxxxx))

📺 Video demoing how to install and use here: [https://youtu.be/UOg3RvHO-xk](https://youtu.be/UOg3RvHO-xk)

![](<../.gitbook/assets/image (35).png>)

## Meshcast.io

[https://meshcast.io](https://meshcast.io)

This is a free to use service that can work in conjunction with VDO.Ninja. It's a low latency video CDN (content delivery network), which can be used to host larger group rooms in VDO.Ninja. It's not designed for mass broadcast, not at present anyways, but it can handle upwards of 100-viewers without taxing your CPU or network.

{% embed url="https://www.youtube.com/watch?v=-7QsLChfdsE" %}
[https://youtu.be/-7QsLChfdsE](https://youtu.be/-7QsLChfdsE)
{% endembed %}

## Caption.Ninja

#### Caption

[https://caption.ninja/](https://caption.ninja/)

Although VDO.Ninja supports captions, sometimes you need something simple yet flexible. Caption.Ninja lets you use the browser's built in speech-to-text service to provide overlay captions for your live stream.\
\
Captions are streamed via a web-socket service to your OBS or other studio software, where they can be shown over your video.

Transcriptions can be saved by means of copy and paste when done, multiple languages are supported, and even **manual** user-entered captions support is provided at [https://caption.ninja/manual](https://caption.ninja/manual)

#### Translation

[https://caption.ninja/translate](https://caption.ninja/translate)

Added a "translation" component to caption.ninja, so you can convert speakers to a single language for overlay on stream. I tried this before, but only now do I think I have it working okay. There's two ways to use it:

1\. You can go here to explore and tinker.[ https://caption.ninja/translate](https://caption.ninja/translate) which offers a bit of a menu to play with, but is sender's side-based translation (works in a single page, but you can't translate to more than one language)

2\. And then there's the normal way of using caption.ninja, which offers viewer-side translation and scrolling support, so you can use this mode to have different languages as outputs instead of just one (assuming the viewer supports the translation code).

[https://caption.ninja/?room=ufv3QaH\&lang=en-US](https://caption.ninja/?room=ufv3QaH\&lang=en-US) (to capture as english) and [https://caption.ninja/overlay?room=ufv3QaH\&translate=fr](https://caption.ninja/overlay?room=ufv3QaH\&translate=fr) (viewer-side, which converts to french).

I welcome feedback.

## Raspberry Ninja

[https://github.com/steveseguin/raspberry\_ninja](https://github.com/steveseguin/raspberry\_ninja)

Turn your Raspberry Pi or Nvidia Jetson into a Ninja-cam with hardware-acceleration enabled! Publish live streaming video to VDO.Ninja on the cheap at very high resolutions! The script for the Nvidia Jetson ($69 and up) is setup to plug in a $10 1080p30 HDMI to USB adapter and go, while the Raspberry Pi is setup as a quick-deploy image that can work with the official Raspicam.\


![An Nvidia Jetson NX pushing 1080p video to VDO.Ninja, captured with a $10 HDMI to USB adapter](<../.gitbook/assets/image (38).png>)

## Native mobile app versions for VDO.Ninja

Mobile native app versions of VDO.Ninja can be found behind the link below. These are mainly backup options for when the browser-based versions fail to work or lack a certain feature due to system restrictions.

{% content-ref url="native-mobile-app-versions.md" %}
[native-mobile-app-versions.md](native-mobile-app-versions.md)
{% endcontent-ref %}

## Consolidated social live chat tool

[https://github.com/steveseguin/social\_stream#readme](https://github.com/steveseguin/social\_stream#readme)

Consolidate your live social messaging streams, including Youtube and Twitch, into a single chat stream that can be docked into OBS and be used to to select featured chat messages as an overlay.

Very much like Chat Overlay Ninja, except is purely for live chat and has a focus on consolidation of chat messages, instead of just featured chat.

![](<../.gitbook/assets/image (98) (1) (1) (1).png>)

{% embed url="https://social.overlay.ninja" %}
[https://github.com/steveseguin/social\_stream#readme](https://github.com/steveseguin/social\_stream#readme)
{% endembed %}

## Versus.cam

[https://versus.cam/](https://versus.cam/)

Versus.cam is the upcoming and standalone replacement for the [vdo.ninja/monitor](https://vdo.ninja/monitor) page. Versus.cam has some interesting features that are specific to the upcoming version of VDO.Ninja, so at the moment it only works in conjunction with [vdo.ninja/alpha](https://vdo.ninja/alpha/).

### Details

* It contains a larger and dedicated graph per scene/view link than what the [vdo.ninja/beta/'s ](https://vdo.ninja/beta/)director room has under scene-stats. Both color code to indicate packet loss, where red is bad, and green is good.&#x20;
* It is setup to use a group room by default, with a very simple interface to login and get started without visiting vdo.ninja itself.&#x20;
* Despite having a group room by default, it works with standalone push/view links as well, via the "Add a stream manually" button, which lets you include normal view links that exist outside rooms.
* All the scene links and invite links are preconfigured for E-Sports , where video is set to pull around 20-mbps for smooth 1080p60 game play. The idea is, if you choose to use this page for creating links, it's all already setup to be used for ingestion.
* The room is configured so that guests cannot see or talk to each other. All guests can do is text-chat with the versus host.

![](<../.gitbook/assets/image (1) (1).png>)

* Versus.cam is compatible with a director and the director room, so you can use a director room AND the Versus.cam room at the same time, without conflict.
* A new feature that Versus.cam has, that will also soon be coming to the normal VDO.Ninja directors' room, is the ability to **dynamically change the resolution and bitrate of remote scenes**. This works by means of the [`&remote`](../general-settings/remote.md) control feature, which is preconfigured in the links already, so no director is needed when using versus. This will then also work with non-room links, so long as [`&remote`](../general-settings/remote.md) is included in their URL.
* I don't intend to add many advanced features to this site.
* It's designed to be very simple, elegant, and hyper focused on a single use case and user type.
* E-Sports and one-way ingestion of very high quality video. I'll likely be making more scenario-specific interfaces in the future like this, to make VDO.Ninja easier and less cluttered for common use cases.
* Versus.cam is built using the VDO.Ninja IFRAME API, which I hope demonstrates the flexibility of it.
* Versus.cam is only supported by Chrome/Chromium-based browsers; it isn't yet compatible with Firefox/Safari (they lack the features needed for it to operate).

Please report bugs. It's a first release, using the alpha version of VDO.Ninja, so bugs are kind of expected.

{% embed url="https://versus.cam/" %}
[https://versus.cam/](https://versus.cam/)
{% endembed %}
