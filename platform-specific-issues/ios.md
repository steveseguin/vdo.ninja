---
description: "iOS-specific notes, limitations, and tips for using VDO.Ninja on iPhone and iPad."
---

# iOS (iPhone/iPad)

[VDO.Ninja](https://vdo.ninja/) has been tested with iOS v12 thru v17, but iOS v10 and under is strictly not supported. Older iPad and iPhone devices as a result are not compatible and likely never will be; an iPhone 5 for example will never be supported.

Please upgrade your iOS to at least v16 to avoid some critical bugs, although even newer is generally better.&#x20;

### 1080p mode

H264 is the default video encoder on iOS, yet H264 only supports up to 720p30 on iOS 14 or older. On iOS 15 devices, H264 (the default codec used), supports 1080p30. A frame rate of 60-fps is still not supported though. Newer iOS devices may even support 1080p60 with certain cameras.

Both new and old iOS devices support 1080p30 when using the VP8 codec, which uses software-encoding rather than hardware. You may need to manually specific [`&width`](../source-settings/and-width.md) and [`&height`](../source-settings/and-height.md) to access 1080p mode on iOS 14 and older, but you can use also [`&quality=0`](../advanced-settings/video-parameters/and-quality.md) on iOS 15 and newer.

VP9 is supported on iOS 14, but you have to enable it as an experimental flag in the iOS Safari advanced settings. It supports 1080p, software-based encoding, and acts a lot like VP8. It generally is finicky, with low-frame rates being common, so use at your own risk.

The AV1 video codec is now also supported with modern iOS versions and works quite well with newer iOS devices. You may need to enable this however in the experimental advanced settings though in your Safari settings.

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

Since Apple does not allow third-party browser engines on iOS, Chrome and Firefox for iOS are essentially re-skinned Safari and offer no additional microphone compatibility.

### Low quality audio from iOS

Audio quality from an iOS generally is pretty low quality. Disabling audio enhancements can sometimes help improve the clarity. It is recommended that the user be wearing headphones though to avoid any feedback issues.

iOS does not work with the volume visualizer meter; it causes clicking noises when used, so it has been disabled.

### Random issues

* If full-screening a video on iOS devices, sometimes that can cause the outbound video to freeze.
* Video out from an iOS device may initially be choppy; this usually smooths out over the course of seconds to a minute. If not, try to lower the resolution.
* If your camera does not load or fails to load, fully close Safari / Chrome, and then try again. There seems to be an issue where old tabs or idle apps can block VDO.Ninja from accessing the camera.
* Video shared by an iPhone/iPad to other guests in a group room may be choppy or of low-quality. This is intentional, as otherwise the iPhone would overheat or become too slow to use. Adding [`&forceios`](../advanced-settings/mobile-parameters/and-forceios.md) to the URL of a specific guest can force a different, smoother, behavior for them, but use it sparingly.

### Limited browser features; no focus/exposure control

Safari on iOS does not yet support many features that VDO.Ninja would like to make use of. It lacks zoom, focus, screen-sharing, exposure, and many other advanced options. These are features Apple needs to enable and allow the browser to access.

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
