# Electron Capture

{% embed url="https://github.com/steveseguin/electroncapture" %}

Created for [VDO.Ninja](https://vdo.ninja) users, it can provide users a clean way of window capturing websites. In the case of [VDO.Ninja](https://vdo.ninja), it may offer a more flexible and reliable method of capturing live video than the browser source plugin built into OBS.

![](<../.gitbook/assets/image (36) (1).png>)

## Why ?

On some systems the OBS Browser Source plugin isn't available or doesn't work all that well, so this tool is a viable alternative. It lets you cleanly screen-grab just a video stream without the need of the Browser Source plugin. It also makes it easy to select the output audio playback device, such as a Virtual Audio device: ie) [https://vb-audio.com/Cable/](https://vb-audio.com/Cable/) (Windows & macOS; donationware).

The app can also be set to remain on top of other windows, attempts to hide the mouse cursor when possible, provides accurate window sizes for 1:1 pixel mapping, and supports global system hotkeys (`CTRL+M` on Windows, for example).

Windows users may find it beneficial too, as it offers support for VDO.Ninja's [`&buffer`](https://docs.vdo.ninja/viewers-settings/buffer) audio sync command and it has robust support for video packet loss. In other words, it can playback live video better than OBS can, with fewer video playback errors and with better audio/video sync. If you have a spare monitor, it may at times be worth the hassle to use instead of OBS alone.

The Electron Capture app uses recent versions of Chromium, which is more resistant to desync, video smearing, and other issues that might exist in the native OBS browser source capture method. [More benefits listed here](https://github.com/steveseguin/electroncapture/blob/master/BENEFITS.md)

Lastly, since playback is agnostic, you can window-capture the same video multiple times, using one copy in a mixed-down live stream, while using a window-capture to record a clean full-resolution isolated video stream.

## Updates

{% content-ref url="../updates/electron-capture-app-updates.md" %}
[electron-capture-app-updates.md](../updates/electron-capture-app-updates.md)
{% endcontent-ref %}
