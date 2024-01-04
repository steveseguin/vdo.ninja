---
description: >-
  Last updated November 17th 2021; keep in mind, this article may become dated
  quickly.
---

# iOS (iPhone/iPad)

[VDO.Ninja](https://vdo.ninja/) has been tested with iOS v12 thru v17, but iOS v10 and under is strictly not supported. Older iPad and iPhone devices as a result are not compatible and likely never will be; an iPhone 5 for example will never be supported.

Please upgrade your iOS to at least v16 to avoid some critical bugs, although even newer is generally better.&#x20;

### 1080p mode

H264 is the default video encoder on iOS, yet H264 only supports up to 720p30 on iOS 14 or older. On iOS 15 devices, H264 (the default codec used), supports 1080p30. A frame rate of 60-fps is still not supported though. Newer iOS devices may even support 1080p60 with certain cameras.

Both new and old iOS devices support 1080p30 when using the VP8 codec, which uses software-encoding rather than hardware. You may need to manually specific [`&width`](../source-settings/and-width.md) and [`&height`](../source-settings/and-height.md) to access 1080p mode on iOS 14 and older, but you can use also [`&quality=0`](../advanced-settings/video-parameters/and-quality.md) on iOS 15 and newer.

VP9 is supported on iOS 14, but you have to enable it as an experimental flag in the iOS Safari advanced settings. It supports 1080p, software-based encoding, and acts a lot like VP8. It generally is finicky, with low-frame rates being common, so use at your own risk.

The AV1 video codec is now also supported with modern iOS versions and works quite well with newer iOS devices. You may need to enable this however in the experimental advanced settings though in your Safari settings.

### Microphones and Audio

Some external microphones are supported by Safari on iOS, however iOS devices are very finicky as to which microphones are supported. Just because your device is listed, doesn't mean it will work or stay selected.\
\
Users with an **iPhone 15 Pro or iPad, which have with USB 3.x support**, have reported success usually with external USB-based microphones, where as devices with Lightning or USB 2.0 ports have had poor success. Given this fact, I'd recommend getting an iPhone 15 Pro (rather than an iPhone 15 or iPhone 14), or perhaps a newer iPad, if wanting to stay in the Apple ecosystem.

That all said, I did find that some certified Lightning-based TRRS microphone adapters, which register as headsets, sometime seem to work better than other devices. Using an XLR to 3.5mm adapter, I've been able to connect professional microphones to an older iPhone 11 for example.

One Lightning-based TRRS adapter that I have tested for myself that seems to usually work is this one: [https://www.amazon.ca/gp/product/B07Q49SVYR](https://www.amazon.ca/gp/product/B07Q49SVYR)

Many of those cheap Amazon wireless Lightning-based lavalier microphones do not seem to work though, and while they may work with specific applications, they are not well supported by Safari. In testing I can't get them to work, however it's perhaps possible they will in future iOS updates.

AirPods do seem to also often work, if needing something wireless though. **AirPods** can however create clicking or distortion if used as a microphone; please ensure that they are fully-charged if you intend to use them in a live production. If they are on low-power, they will create audible problems.

Audio quality from an iOS generally is pretty low quality. Disabling audio enhancements can sometimes help improve the clarity. It is recommended that the user be wearing headphones though to avoid any feedback issues.

iOS does not work with the volume visualizer meter; it causes clicking noises when used, so it has been disabled.

If willing to use Android, some users have noted that Firefox for Android often works with USB microphones. Firefox mobile on Android supports USB microphones reliably, if that is a potential solution.

### Random issues

* If full-screening a video on iOS devices, sometimes that can cause the outbound video to freeze.
* Video out from an iOS device may initially be choppy; this usually smooths out over the course of seconds to a minute. If not, try to lower the resolution.
* If your camera does not load or fails to load, fully close Safari / Chrome, and then try again. There seems to be an issue where old tabs or idle apps can block VDO.Ninja from accessing the camera.
* Video shared by an iPhone/iPad to other guests in a group room may be choppy or of low-quality. This is intentional, as otherwise the iPhone would overheat or become too slow to use. Adding [`&forceios`](../advanced-settings/mobile-parameters/and-forceios.md) to the URL of a specific guest can force a different, smoother, behavior for them, but use it sparingly.

### Limited features; no focus/exposure control

iOS does not yet support for many features that VDO.Ninja would like to make use of. It lacks zoom, focus, screen-sharing, exposure, and many other advanced options. These are features Apple needs to enable and allow the browser to access, which currently it does not.

### Native app option

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}

There is a basic native iOS app provided by VDO.Ninja at this time, but it is extremely basic. It lacks useful screen-capture support, group-room support, and password support. It does work with the Torch light function though, you can zoom with it also, and it's useful to have when Safari refuses to work.

Supporting a native app for iOS takes a lot of resources and time, so it's being developed in tandem with the Android native app using a mobile development framework.
