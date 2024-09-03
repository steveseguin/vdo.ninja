---
description: When the video turns into a rainbow puke with distorted colors
---

# Video stream looks corrupted

{% hint style="info" %}
Update: This issue of rainbow puke impacted OBS v25 and older, but is no longer an issue for most users.

If having issues with the video being very low quality, this is often due to high packet loss caused by weak WiFi or other network issue. More info: [https://www.youtube.com/watch?v=je2ljlvLzlY](https://www.youtube.com/watch?v=je2ljlvLzlY)\

{% endhint %}

{% hint style="warning" %}
**DO NOT USE WIFI**. Have everyone connect to stable wired Internet whenever possible.
{% endhint %}



### Video is smeared or "pixelated"

"Pixelation" (as seen here: [https://imgur.com/oKEPOvu](https://imgur.com/oKEPOvu)) is a difficult issue to troubleshoot as there are several potential upstream configurations which can ultimately lead to high packet loss which is the primary cause. Here are some potential fixes and configurations that may assist in lowering packet loss:

* Change the video codec or video encoder used: h264, VP8, and VP9 are options. VP9 seems to handle packet loss the best within OBS, but it also creates the most CPU load. VP8 handles packet loss the worst in OBS.
* Use Speedify.com (in AUTO or TCP mode).
* Use the Electron Capture app instead of OBS to capture video. The Electron Capture app uses a newer version of Chromium, which works far better than OBS when dealing with packet loss related issues.
* Lowering the framerate or resolution, especially for those using H264, can provide smoother video, and perhaps with less distortion.
* You can increase the jitter buffer size by using the [`&buffer`](../advanced-settings/view-parameters/buffer.md) URL parameter; such as "[https://obs.ninja?view=abs\&buffer=300](https://obs.ninja/?view=abs\&buffer=300)". This only works if using Chrome/Chromium v76 or newer though; OBS v25 currently uses Chromium v75 and so is not yet compatible.
* You connect two peers via TCP, instead of UDP, which will ensure there is no packet loss. This option is for more advanced users and requires a compatible TURN server (or VPN). Please use your own TURN servers for this option if so, as the bandwidth costs can be quite high for me.
* You can scale down the video while viewing with [`&scale=50`](../advanced-settings/view-parameters/scale.md) to potentially reduce stutter and reduce the frequency of frame corruption.
* Normally the video should "fix itself" after a moment of so, but if not that is likely a bug in the browser used for decoding. If in OBS you can toggle the visibility of the element to try to trigger a resolution. I've also provided a "SEND KEYFRAME" button in the hidden stats menu that lets the publish do this from their end.
* Mentioning this again, but connect over wired ETHERNET if possible and avoid wireless connections, including WiFi networks. DSL connections are also often quite poor. Do so for both OBS and the video-connected device for optimal results. Even 4G LTE is better than Wi-Fi in many cases.
* Do not watch a 4K Netflix or Youtube video while streaming; it will increase network congestion and can cause packet loss and buffer-bloat.
* If you have LOW QUALITY video, or low resolution or low bitrates, that perhaps can be adjusted. Please see below re: [bitrates and resolutions](https://github.com/steveseguin/obsninja/wiki/FAQ#bnr)
* Ensure your computer and remote computer are not maxing out their CPU power. If they are, have them lower the resolution and bitrate.
* If using an SFU server, like Janus or MediaMTX, or if using WHIP from OBS, increase the keyframe rate, ensure the PLI is working, and perhaps consider switching the server to work in TCP mode. It's also possible to try to set a keyframe rate with VDO.Ninja, however this is a last resort.



### Green or pink or wrong colors

* try using \&codec=av1 or perhaps vp8, vp9, or h264.  Sometimes a device, like a smartphone/Samsung will not encode the video in a way that the viewer supports
* Try a different browser; sometimes Firefox is problematic or sometimes its the solution.
* Try a different resolution. Some smartphones only work with 640x480, at least on specific cameras, while others will work with 1920x1080 or 1280x720, but fail with lower resolutions
* If the video works for a bit, and then stops, or just spins as if loading, try \&codec=vp8, as perhaps the h264 encoder is unable to handle those high resolutions. This is especially try when screen sharing on mobile.

### Colors slightly off

* If colors aren't perfect, try disabling hardware acceleration in OBS (obs browser source hardware acceleration)
* Use \&codec=av1 on the view link, as this codec seems to handle colors better than h264/vp8
* Use the Electron Capture app instead of OBS browser source; window capturing may be required
* Use a different graphics card (AMD sometimes work better than NVidia) or update graphics drivers
* avoid HDR mode and reset any color filters you may have applied to your system/monitor
* Try different browsers; Safari, Firefox, and Chromium may handle colors different
* Increase the video bitrate; lower bitrate videos will have worse colors
