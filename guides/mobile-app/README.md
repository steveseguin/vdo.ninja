---
description: Set up the VDO.Ninja Android and iPhone apps, improve stream quality, and send camera video to OBS with SRT.
---

# Mobile app guides

Use the VDO.Ninja app to send your phone's camera, microphone, or supported screen capture to a viewer or production computer.

* [Start with the native mobile app guide](../../steves-helper-apps/native-mobile-app.md)
* [Download the Android or iOS app](../../steves-helper-apps/native-mobile-app-versions.md)
* [Improve stream quality](../improving-quality-of-the-native-app.md)

## Send a remote phone through Meshcast to OBS

Use Meshcast when the phone and OBS are on different networks and you want a server to distribute the feed. [Compare VDO.Ninja, Meshcast, WHIP, SRT, and RTMP](choose-an-output.md).

* [Set up SRT](srt-to-meshcast.md): buffering and packet recovery for unstable connections.
* [Set up RTMP](rtmp-to-meshcast.md): publish with a server address and stream key.

## Send camera video to OBS with SRT

Choose your phone for a step-by-step setup. The phone connects as the SRT caller; OBS listens on the same network.

{% content-ref url="android-srt-to-obs.md" %}
[android-srt-to-obs.md](android-srt-to-obs.md)
{% endcontent-ref %}

{% content-ref url="iphone-srt-to-obs.md" %}
[iphone-srt-to-obs.md](iphone-srt-to-obs.md)
{% endcontent-ref %}
