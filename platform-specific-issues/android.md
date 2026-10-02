---
description: Mobile app version of VDO.Ninja and other Android related topics
---

# Android

[VDO.Ninja](https://vdo.ninja/) generally works quite well with Android; even older Android devices tend to work reasonable well. The browser-based version of VDO.Ninja is recommend for most users, although there is an native mobile app version for Android that solves some limitations of the web-version.

### Native Android app

The native Android app publishes camera, USB camera, screen, and microphone sources, with optional remote-audio monitoring. It supports background operation, subject to Android's permissions and battery restrictions.

Current native app capabilities include:

* **Local recording** while publishing, with a video gallery for reviewing and deleting clips
* **Screen sharing** with optional system audio on Android 10+; supported Android 14+ devices can offer single-app or full-screen capture
* **Ultra-wide camera support** and expanded camera selection options
* **Improved USB audio support** — including external USB microphones
* **USB video (UVC) capture** support
* Background operation
* **Android video quality** presets, custom bitrate, and a maximum capture frame-rate control
* **WHIP/WHEP** publishing and viewer delivery
* Optional **professional camera controls**, stream-health stats, talkback, and Social Stream Ninja chat/TTS
* Experimental **RTMP/SRT external output** with separate video/audio encoder settings

The native Android build retains Android 5.0/API 21 compatibility, but individual features have higher OS and hardware requirements. For example, native system-audio capture requires Android 10+ and an app that allows it.

The **Google Play Store** <img src="../.gitbook/assets/image (116) (1).png" alt="" data-size="line"> hosted version is here: \
[https://play.google.com/store/apps/details?id=flutter.vdo.ninja](https://play.google.com/store/apps/details?id=flutter.vdo.ninja)  \
(It will auto-update when I push new releases.)

An Android APK for direct download is also available here (kept updated with the newest build):\
[https://drive.google.com/file/d/1L8meslXPEzivocH3wz48abNtJ926hQUr/view?usp=drive\_link](https://drive.google.com/file/d/1L8meslXPEzivocH3wz48abNtJ926hQUr/view?usp=drive\_link)\
(Manually installing requires manual updating.)

Public reference source is available here; it may lag current distributed builds:\
[https://github.com/steveseguin/vdon\_flutter/](https://github.com/steveseguin/vdon\_flutter/)

For setup and platform limits, see the [native app guide](../steves-helper-apps/native-mobile-app.md). For the camera presets, capture frame-rate ceiling, and bitrate controls, see the [quality guide](../guides/improving-quality-of-the-native-app.md).

### External camera support

UVC-based video devices are not supported via the browser on most Android devices, but a few devices like the Yolobox may support it.

The VDO.Ninja native Android app now includes USB video (UVC) capture support. Download the latest version from the Play Store or see [Native mobile app versions](../steves-helper-apps/native-mobile-app-versions.md) for the latest test APK.

If that doesn't work, screen-sharing is an option — load an app that supports UVC/USB cameras and screen share that output to VDO.Ninja using the native Android app.

The Raspberry.Ninja project also supports HDMI/USB input if you have a mobile Linux system like an Orange Pi 5 Plus, which has a built-in HDMI input port.

### USB audio device support

#### Native app (recommended)

The VDO.Ninja native Android app now has improved USB audio support, making it the most reliable option for external USB microphones on Android.

#### Browser-based

USB-based audio devices have limited support via the browser on Android. Some Android devices will support USB audio using Chrome, although many will not.

**Firefox mobile tends to support USB audio devices more often than Chrome,** so try Firefox if Chrome doesn't work with your USB microphone.

If nothing works via the browser, using a 3.5mm to USB adapter will sometimes work if your audio device has 3.5mm mic out as an option. You may also need a TRRS (not TRS) adapter. Below are a couple that have been tested successfully on a Google Pixel smartphone:\
[https://www.amazon.ca/gp/product/B08NVRV6G9](https://www.amazon.ca/gp/product/B08NVRV6G9)\
[https://www.amazon.ca/Headphone-Splitter-KOOPAO-Compatible-Microphone/dp/B08RML676M](https://www.amazon.ca/Headphone-Splitter-KOOPAO-Compatible-Microphone/dp/B08RML676M)\
\
Often a USB audio device that is treated as a headset/communication device, rather than just a microphone or game device, will work.

### Samsung phones

For most users, using Chrome on Android is the recommended way of connecting. There are some exceptions, such as for Samsung users. Using the Samsung Galaxy browser is recommended instead of Chrome for Samsung devices if issues with Chrome exist. On the Galaxy S21 for example, it seems that you can get 60-fps when using the Galaxy browser, but only 30-fps when using Chrome. Chrome might have advantages over the Samsung browser though, such as maybe zoom-functionality, so perhaps try both and see which works better for you.

### Battery life

If battery life or heat is an issue on Samsung or other Android devices, limiting the frame rate to 30-fps and possibly the resolution to 720p can allow the H264 hardware encoder to work ([`&codec=h264`](../advanced-settings/view-parameters/codec.md)). The default target frame rate of 60-fps may prevent H264 from working on some phones, causing heat issues due to software-encoding being used.&#x20;

### Firefox

Firefox on Android seems to fix a couple Chrome-specific issues. Chrome will mute the microphone after a minute if the screen is turned off, but Firefox doesn't seem to do that. With Samsung devices, Chrome combined with H264 hardware encoding may have color issues with the OBS Browser source, but that issue isn't present when using Firefox as the mobile browser. So, for Samsung devices, you might find Firefox, with [`&fps=30`](../advanced-settings/video-parameters/and-fps.md) and [`&codec=h264`](../advanced-settings/view-parameters/codec.md) as parameters (push and view side respectively), may help keep things cool.

### Internal Cameras

Not all cameras may appear as options when using a mobile device via the browser; this comes down to the manufacturer of the phone. The native Android app now supports expanded camera selection including ultra-wide cameras. If you cannot select your desired camera via the browser, try the native app instead.

### Screen sharing

Screen sharing on Android is not supported via the browser. Use **SCREEN** in the native Android app and approve the system capture prompt. **Capture System Audio** is optional on Android 10+; some apps block capture. Supported Android 14+ devices can share one app or the entire screen.

For iPhone screen sharing, you can refer to [this guide](../guides/screen-share-your-iphone-ipad.md).

### Performance issues

Android devices are not powerhouses; disabling video sharing for mobile users in group rooms if there are problems. More than around 7 guests in a room will probably require the Android users add [`&roombitrate=0`](../advanced-settings/video-bitrate-parameters/roombitrate.md) to their URL invite links, to disable their video sharing to other group members.

### Camera selection page freezes

If using Android 11 and the camera selection page in VDO.Ninja freezes, push the browser to the background and then open it to the foreground again. This will unfreeze the window. This is a bug in Android 11; not VDO.Ninja.

### Corrupted video; green or grey pixels

Pixel devices have problems in Portrait mode, where the video may glitch to be all green or such at times. Using [`&codec=vp9`](../advanced-settings/view-parameters/codec.md) on the viewer side or [`&scale=20`](../advanced-settings/view-parameters/scale.md) can offer some solutions, maybe though. Try starting the device in landscape mode, then move to portrait, also to see if that helps.

### External audio

The native Android app now has improved USB audio support, making it the most reliable way to use external microphones on Android.

For the browser-based version: 3.5mm TRRS inputs often work, and some USB devices that register as headset devices work with Chrome. Firefox tends to work with more USB audio devices than Chrome. Bluetooth devices are hit and miss.

### On-screen overlays blocking access

On-screen overlay apps may cause some Android devices to get errors when trying to select their camera via the browser. Disable any apps on your device that may be causing an overlay on the screen or has the power to do so. Try the native Android app if this fails still.

### Supported Android versions

VDO.Ninja has been tested to work on a Nexus 9 running Android 5.1 and Chrome. Performance wasn't great, but usable as a remote webcam.
