---
description: Troubleshooting guide for Can't screen-share from certain devices in VDO.Ninja and OBS with likely causes and practical fixes.
---

# Can't screen-share from certain devices

The Screen sharing feature is highly dependent on the operating system of the device whose screen you are trying to capture.

* Chrome browser used on a PC is most compatible, fully supporting screen sharing with audio.
* Firefox on PC supports screen sharing, but it cannot screen share with audio.
* Safari on iOS does not support screen sharing via the browser.
* Android does not support screen sharing via the browser.

The native mobile apps for both [iOS and Android](../steves-helper-apps/native-mobile-app-versions.md) support screen sharing:

* **iOS:** select **SCREEN**, start **VDO.Ninja Screen Recorder** in Apple's broadcast picker, then open the app you want to share. Background broadcasting is supported. Current versions can capture ReplayKit app audio and microphone narration, with separate mute controls. If sharing stops, lower **iOS Screen Share Quality** and restart the broadcast.
* **Android:** approve the screen-capture prompt. Android 14+ can offer a single app or the entire screen. **Capture System Audio** requires Android 10+ and an app that permits audio capture.

Protected content may block video or audio on either platform. A browser camera link cannot substitute for native capture of another mobile app. See the [native-app guide](../steves-helper-apps/native-mobile-app.md#screen) for quality, audio, and camera-overlay controls.

There's other tricks as well to get screen sharing working on mobile, such as using QuickTime via USB.

{% content-ref url="../steves-helper-apps/native-mobile-app-versions.md" %}
[native-mobile-app-versions.md](../steves-helper-apps/native-mobile-app-versions.md)
{% endcontent-ref %}

{% content-ref url="../guides/screen-share-your-iphone-ipad.md" %}
[screen-share-your-iphone-ipad.md](../guides/screen-share-your-iphone-ipad.md)
{% endcontent-ref %}
