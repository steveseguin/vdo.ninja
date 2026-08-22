---
description: Provides users a clean way of window capturing websites
---

# Electron Capture

{% embed url="https://github.com/steveseguin/electroncapture" %}
[https://github.com/steveseguin/electroncapture](https://github.com/steveseguin/electroncapture)
{% endembed %}

Created for [VDO.Ninja](https://vdo.ninja) users, it can provide users a clean way of window capturing websites. In the case of [VDO.Ninja](https://vdo.ninja), it may offer a more flexible and reliable method of capturing live video than the browser source plugin built into OBS.

![](<../.gitbook/assets/image (36) (1).png>)

## Why ?

On some systems the OBS Browser Source plugin isn't available or doesn't work all that well, so this tool is a viable alternative. It lets you cleanly screen-grab just a video stream without the need of the Browser Source plugin. It also makes it easy to select the output audio playback device, such as a Virtual Audio device: i.e.) [https://vb-audio.com/Cable/](https://vb-audio.com/Cable/) (Windows & macOS; donationware).

The app can also be set to remain on top of other windows, attempts to hide the mouse cursor when possible, provides accurate window sizes for 1:1 pixel mapping, and supports global system hotkeys (`CTRL+M` on Windows, for example).

Windows users may find it beneficial too, as it offers support for VDO.Ninja's [`&buffer`](https://docs.vdo.ninja/viewers-settings/buffer) audio sync command and it has robust support for video packet loss. In other words, it can playback live video better than OBS can, with fewer video playback errors and with better audio/video sync. If you have a spare monitor, it may at times be worth the hassle to use instead of OBS alone.

The Electron Capture app uses recent versions of Chromium, which is more resistant to desync, video smearing, and other issues that might exist in the native OBS browser source capture method. [More benefits listed here](https://github.com/steveseguin/electroncapture/blob/master/BENEFITS.md)

Lastly, since playback is agnostic, you can window-capture the same video multiple times, using one copy in a mixed-down live stream, while using a window-capture to record a clean full-resolution isolated video stream.

For a multi-guest setup, give every Electron Capture window a unique title and use strict title matching in OBS. See [Stable mobile guest production with OBS and Electron Capture](../guides/stable-mobile-guest-production-with-obs-and-electron-capture.md) for menu and command-line title instructions, fixed guest mappings, broadcast return options, and troubleshooting.

## ASIO Support (Windows)

The Electron Capture app for Windows now supports ASIO audio device input via VDO.Ninja. ASIO (Audio Stream Input/Output) provides significantly lower audio latency compared to standard Windows audio drivers, making it ideal for:

- Musicians using professional audio interfaces
- IEM (in-ear monitor) applications
- Real-time audio monitoring with minimal delay

When combined with the [`&lowlatency`](../newly-added-parameters/and-lowlatency.md) parameter, ASIO support enables ultra-low latency audio workflows directly through VDO.Ninja.

## Updates

{% content-ref url="../updates/updates-electron-capture-app.md" %}
[updates-electron-capture-app.md](../updates/updates-electron-capture-app.md)
{% endcontent-ref %}
