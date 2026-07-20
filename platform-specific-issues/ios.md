---
description: "iOS-specific notes, limitations, and tips for using VDO.Ninja on iPhone and iPad."
---

# iOS (iPhone/iPad)

[VDO.Ninja](https://vdo.ninja/) relies on the WebRTC and media-capture APIs supplied by the installed iOS/iPadOS browser engine. Use a current OS release whenever possible; older devices that cannot install a modern WebKit release may be unable to publish reliably.

Browser media capabilities change between OS updates. Test the exact device, camera, browser or native-app version, codec, and resolution before production use.

### 1080p mode

Add [`&quality=0`](../advanced-settings/video-parameters/and-quality.md) to target 1920x1080. This is a non-strict resolution preset: the camera and browser may return a lower supported mode. Actual frame rate depends on the device, selected camera, browser engine, codec, lighting, temperature, and encoder load. Use [`&maxframerate`](../source-settings/and-maxframerate.md) when a lower fallback is acceptable; `&fps` is strict and can cause capture to fail when the requested mode is unavailable.

H.264 is generally the safest first choice on iPhone and iPad because it commonly has hardware acceleration. VP8, VP9, AV1, and HEVC availability varies by OS release and device hardware. Forcing a software codec can increase heat and reduce sustained performance. Leave codec selection at its default first, then test a forced codec only on the exact devices used for production.

WebKit continues to add media support over time; see the official [Safari 18.4 media updates](https://webkit.org/blog/16574/webkit-features-in-safari-18-4/) and [Safari 26 WebRTC updates](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/). These release notes describe available APIs, not a guarantee that every camera exposes every resolution, frame rate, or codec combination.

### External microphones and audio device support on iOS

#### Native App (recommended for external audio)

The [VDO.Ninja native iOS app](../steves-helper-apps/native-mobile-app-versions.md) now has improved USB microphone support, including external USB audio devices such as DJI wireless mics. If you need reliable external microphone support on iOS, the native app is the recommended approach.

#### Safari (browser-based)

External microphone support in Safari on iOS remains finicky. Just because a device is listed doesn't mean it will work or stay selected. This is a long-known WebKit issue, not specific to VDO.Ninja: [https://bugs.webkit.org/show\_bug.cgi?id=211192](https://bugs.webkit.org/show_bug.cgi?id=211192)

A video going over possible solutions is here: [https://www.youtube.com/watch?v=BBus\_S8iJUE](https://www.youtube.com/watch?v=BBus_S8iJUE)

Users with an **iPhone 15 Pro or iPad with USB 3.x support** have generally reported success with external USB-based microphones, whereas devices with Lightning or USB 2.0 ports have had poor success.

Some certified Lightning-based TRRS microphone adapters that register as headsets tend to work better than other devices. Using a XLR to 3.5mm adapter, professional microphones can be connected to older iPhones. One Lightning-based TRRS adapter that has been tested successfully: [https://www.amazon.ca/gp/product/B07Q49SVYR](https://www.amazon.ca/gp/product/B07Q49SVYR)

Many cheap Amazon wireless Lightning-based lavalier microphones do not work with Safari.

AirPods generally work, but can create clicking or distortion as a microphone — ensure they are fully charged for live production use.

Changing browser apps often does not change microphone behavior because most iOS browsers use WebKit. Apple permits entitled alternative browser engines only in specific regions and configurations; see Apple's [alternative browser engine requirements](https://developer.apple.com/support/alternative-browser-engines/). Verify the actual engine before assuming Chrome or Firefox will provide different capture support.

### Low quality audio from iOS

Audio quality on iOS can vary by device and input. Disabling audio enhancements can sometimes improve clarity when using a clean microphone signal. Wear headphones if echo cancellation is disabled to avoid feedback.

iOS does not work with the volume visualizer meter; it causes clicking noises when used, so it has been disabled.

### Random issues

* If full-screening a video on iOS devices, sometimes that can cause the outbound video to freeze.
* Video out from an iOS device may initially be choppy; this usually smooths out over the course of seconds to a minute. If not, try to lower the resolution.
* If your camera does not load or fails to load, fully close Safari / Chrome, and then try again. There seems to be an issue where old tabs or idle apps can block VDO.Ninja from accessing the camera.
* Video shared by an iPhone/iPad to other guests in a group room may be choppy or of low-quality. This is intentional, as otherwise the iPhone would overheat or become too slow to use. Adding [`&forceios`](../advanced-settings/mobile-parameters/and-forceios.md) to the URL of a specific guest can force a different, smoother, behavior for them, but use it sparingly.

### Limited and capability-dependent browser controls

Zoom, focus, exposure, torch, external-camera, and screen-capture controls vary by iOS/iPadOS release and device. VDO.Ninja exposes camera controls only when the active video track reports the corresponding capability; their absence is not necessarily a VDO.Ninja error. Browser screen capture remains more limited than desktop capture, so test the native app when Safari cannot provide a required control.

The native iOS app overcomes many of these browser limitations — see below.

### Native app option

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}

The VDO.Ninja native iOS app has grown significantly in features and is recommended when Safari's limitations are a problem. Current capabilities include:

* **Local recording** while publishing
* **Screen recording** (still hit and miss on iOS, but functional in many cases)
* **Dual-camera mode** — front and rear cameras simultaneously
* **Ultra-wide camera support**
* **Improved USB microphone support** — including external USB audio devices (DJI mics, etc.)
* Torch light and zoom controls
* Background operation

Screen sharing on iOS remains somewhat unreliable, but the native app provides the best available support for it on the platform.

For more details, see [Native mobile app versions](../steves-helper-apps/native-mobile-app-versions.md).
