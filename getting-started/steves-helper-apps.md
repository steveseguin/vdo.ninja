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

**Supported sites as of August 2021 (requests welcomed)**

* glimesh.tv (pop-out chat)
* youtube.com (pop-out chat)
* twitch.tv (pop-out chat)
* facebook.com (live video chat)
* restream.io (go here: [https://chat.restream.io/chat](https://chat.restream.io/chat))
* trovo.live (pop-out chat)
* Instagram (posts and replies)
* Twitter (tweets and replies)

📺 Video demoing how to install and use here: [https://youtu.be/UOg3RvHO-xk](https://youtu.be/UOg3RvHO-xk)

![](<../.gitbook/assets/image (35).png>)

## Meshcast.io

[https://meshcast.io](https://meshcast.io)

This is a free to use service that can work in conjunction with VDO.Ninja. It's a low latency video CDN (content delivery network), which can be used to host larger group rooms in VDO.Ninja. It's not designed for mass broadcast, not at present anyways, but it can handle upwards of 100-viewers without taxing your CPU or network.

{% embed url="https://www.youtube.com/watch?v=-7QsLChfdsE" %}

## Caption.Ninja

[https://caption.ninja/](https://caption.ninja/)

Although VDO.Ninja supports captions, sometimes you need something simple yet flexible. Caption.Ninja lets you use the browser's built in speech-to-text service to provide overlay captions for your live stream.\
\
Captions are streamed via a web-socket service to your OBS or other studio software, where they can be shown over your video.

Transcriptions can be saved by means of copy and paste when done, multiple languages are supported, and even **manual** user-entered captions support is provided at [https://caption.ninja/manual](https://caption.ninja/manual)

## Raspberry Ninja

[https://github.com/steveseguin/raspberry\_ninja](https://github.com/steveseguin/raspberry\_ninja)

Turn your Raspberry Pi or Nvidia Jetson into a Ninja-cam with hardware-acceleration enabled! Publish live streaming video to VDO.Ninja on the cheap at very high resolutions! The script for the Nvidia Jetson ($69 and up) is setup to plug in a $10 1080p30 HDMI to USB adapter and go, while the Raspberry Pi is setup as a quick-deploy image that can work with the official Raspicam.\


![An Nvidia Jetson NX pushing 1080p video to VDO.Ninja, captured with a $10 HDMI to USB adapter](<../.gitbook/assets/image (38).png>)

## Native mobile app versions for VDO.Ninja

Mobile native app versions of VDO.Ninja can be found behind the link below. These are mainly backup options for when the browser-based versions fail to work or lack a certain feature due to system restrictions.&#x20;

{% content-ref url="native-mobile-app-versions.md" %}
[native-mobile-app-versions.md](native-mobile-app-versions.md)
{% endcontent-ref %}

## Consolidated social live chat tool

Consolidate your live social messaging streams, including Youtube and Twitch, into a single chat stream that can be docked into OBS and be used to to select featured chat messages as an overlay.

Very much like Chat Overlay Ninja, except is purely for live chat and has a focus on consolidation of chat messages, instead of just featured chat.

![](<../.gitbook/assets/image (98) (1).png>)

{% embed url="https://social.overlay.ninja" %}
