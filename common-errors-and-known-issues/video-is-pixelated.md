# Video is pixelated

{% hint style="warning" %}
**DO NOT USE WIFI**. Have everyone connect to stable wired Internet whenever possible.
{% endhint %}

"Pixelation" (as seen here: [https://imgur.com/oKEPOvu](https://imgur.com/oKEPOvu)) is a difficult issue to troubleshoot as there are several potential upstream configurations which can ultimately lead to high packet loss which is the primary cause. Here are some potential fixes and configurations that may assist in lowering packet loss:

* Change the video codec or video encoder used: h264, VP8, and VP9 are options. VP9 seems to handle packet loss the best within OBS, but it also creates the most CPU load. VP8 handles packet loss the worst in OBS.
* Use Speedify.com (in AUTO or TCP mode).
* Use the Electron Capture app instead of OBS to capture video. The Electron Capture app uses a newer version of Chromium, which works far better than OBS when dealing with packet loss related issues.
* Lowering the framerate or resolution, especially for those using H264, can provide smoother video, and perhaps with less distortion.
* You can increase the jitter buffer size by using the [`&buffer`](../viewers-settings/buffer.md) URL parameter; such as "[https://obs.ninja?view=abs\&buffer=300](https://obs.ninja/?view=abs\&buffer=300)". This only works if using Chrome/Chromium v76 or newer though; OBS v25 currently uses Chromium v75 and so is not yet compatible.
* You connect two peers via TCP, instead of UDP, which will ensure there is no packet loss. This option is for more advanced users and requires a compatible TURN server (or VPN). Please use your own TURN servers for this option if so, as the bandwidth costs can be quite high for me.
* You can scale down the video while viewing with [`&scale=50`](../viewers-settings/scale.md) to potentially reduce stutter and reduce the frequency of frame corruption.
* Normally the video should "fix itself" after a moment of so, but if not that is likely a bug in the browser used for decoding. If in OBS you can toggle the visibility of the element to try to trigger a resolution. I've also provided a "SEND KEYFRAME" button in the hidden stats menu that lets the publish do this from their end.
* Mentioning this again, but connect over wired ETHERNET if possible and avoid wireless connections, including WiFi networks. DSL connections are also often quite poor. Do so for both OBS and the video-connected device for optimal results. Even 4G LTE is better than Wi-Fi in many cases.
* Do not watch a 4K Netflix or Youtube video while streaming; it will increase network congestion and can cause packet loss and buffer-bloat.
* If you have LOW QUALITY video, or low resolution or low bitrates, that perhaps can be adjusted. Please see below re: [bitrates and resolutions](https://github.com/steveseguin/obsninja/wiki/FAQ#bnr)
* Ensure your computer and remote computer are not maxing out their CPU power. If they are, have them lower the resolution and bitrate.
