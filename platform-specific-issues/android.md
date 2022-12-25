---
description: Mobile app version of VDO.Ninja and other Android related topics
---

# Android

[VDO.Ninja](https://vdo.ninja/) generally works quite well with Android; even older Android devices tend to work reasonable well. The browser-based version of VDO.Ninja is recommend for most users, although there is an native mobile app version for Android that solves some limitations of the web-version.

### Native Android app

The native mobile app for Android is fairly simple, as it can be only used for one-way publishing. It does support screen-sharing though, so it has its value.  It will also work while in the background, and sometimes works on certain devices when the browser-version won't.\
\
Please note, the native app requires a modern version of Android, while the web-based version of VDO.Ninja has been tested with Android 5.1 using Chrome.

The **Google Play Store** <img src="../.gitbook/assets/image (116) (1).png" alt="" data-size="line"> hosted version is here: \
[https://play.google.com/store/apps/details?id=flutter.vdo.ninja](https://play.google.com/store/apps/details?id=flutter.vdo.ninja)  \
(It will auto-update when I push new releases.)

As well, the Android APK file for direct-downloading is hosted here:[\
https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=sharing](https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=sharing)\
(Manually installing will requires manual updating, as well.  APK last updated May 12, 2022)

Source-code for building the Android app is here:\
[https://github.com/steveseguin/vdon\_flutter/](https://github.com/steveseguin/vdon\_flutter/)

### External camera support

UVC-based video devices are not supported currently with most Android devices, but a few perhaps, like the Yolobox, may support it. If not, screen-sharing is an option to make it work, where you can load up an app that does support UVC/USB cameras, and simply screen share that output to VDO.Ninja using the native Android app.

### USB audio device support

USB-based audio devices have limited support with VDO.Ninja on Android. Some Android devices will support USB audio using Chrome, although many will not.

**Firefox mobile seems to support USB audio devices fairly often,** so give Firefox a go if looking for support there. So definitely try Firefox out if using Android and looking to use USB microphones.

If nothing works, using a 3.5mm to USB adapter will sometimes work, if your audio device has 3.5mm mic out as an option. You may also need a TRRS/TRS adapter. Below are a couple that I use  successfully on my Google Pixel smartphone:\
[https://www.amazon.ca/gp/product/B08NVRV6G9](https://www.amazon.ca/gp/product/B08NVRV6G9)\
[https://www.amazon.ca/Headphone-Splitter-KOOPAO-Compatible-Microphone/dp/B08RML676M](https://www.amazon.ca/Headphone-Splitter-KOOPAO-Compatible-Microphone/dp/B08RML676M)

### Samsung phones

For most users, using Chrome on Android is the recommended way of connecting. There are some exceptions, such as for Samsung users. Using the Samsung Galaxy browser is recommended instead of Chrome for Samsung devices if issues with Chrome exist. On the Galaxy S21 for example, it seems that you can get 60-fps when using the Galaxy browser, but only 30-fps when using Chrome. Chrome might have advantages over the Samsung browser though, such as maybe zoom-functionality, so perhaps try both and see which works better for you.

### Battery life

If battery life or heat is an issue on Samsung or other Android devices, limiting the frame rate to 30-fps and possibly the resolution to 720p can allow the H264 hardware encoder to work ([`&codec=h264`](../advanced-settings/view-parameters/codec.md)). The default target frame rate of 60-fps may prevent H264 from working on some phones, causing heat issues due to software-encoding being used.&#x20;

### Firefox

Firefox on Android seems to fix a couple Chrome-specific issues. Chrome will mute the microphone after a minute if the screen is turned off, but Firefox doesn't seem to do that. With Samsung devices, Chrome combined with H264 hardware encoding may have color issues with the OBS Browser source, but that issue isn't present when using Firefox as the mobile browser. So, for Samsung devices, you might find Firefox, with [`&fps=30`](../advanced-settings/video-parameters/and-fps.md) and [`&codec=h264`](../advanced-settings/view-parameters/codec.md) as parameters (push and view side respectively), may help keep things cool.

### Internal Cameras

Not all cameras may appear as options when using a mobile device; this comes down to the manufacturer of the phone really. If you cannot select your fish-eye camera, try instead buying a fisheye lens adapter from Amazon for a couple dollars; it will offer better performance probably anyways. The Android APK version of VDO.Ninja will reveal a few extra cameras (wide angle, for example), versus the browser, but it may still not support all.

### Screen sharing

Screen sharing on mobile devices is not support via the Browser, although Android devices can screen sharing using the native Android app (linked previously). The screen sharing function may not include audio, or at least it might be unstable, and this will hopefully be addressed over time with additional development of the mobile app.

For iPhone screen sharing, you can refer to [this guide](../guides/screen-share-your-iphone-ipad.md). It conceptually might also work for Android users, if the native app provided by VDO.Ninja does not work.

### Performance issues

Android devices are not powerhouses; disabling video sharing for mobile users in group rooms if there are problems. More than around 7 guests in a room will probably require the Android users add [`&roombitrate=0`](../advanced-settings/video-bitrate-parameters/roombitrate.md) to their URL invite links, to disable their video sharing to other group members.

### Camera selection page freezes

If using Android 11 and the camera selection page in VDO.Ninja freezes, push the browser to the background and then open it to the foreground again. This will unfreeze the window. This is a bug in Android 11; not VDO.Ninja.

### Corrupted video; green or grey pixels

Pixel devices have problems in Portrait mode, where the video may glitch to be all green or such at times. Using [`&codec=vp9`](../advanced-settings/view-parameters/codec.md) on the viewer side or [`&scale=20`](../advanced-settings/view-parameters/scale.md) can offer some solutions, maybe though. Try starting the device in landscape mode, then move to portrait, also to see if that helps.

### External audio

USB audio devices should work with Android devices, but it will depend on numerous factors. In most cases, the 3.5mm headset port on some Android phones will be the most reliable way to attach an external headset or microphone.

### On-screen overlays blocking access

On-screen overlay apps may cause some Android devices to get errors when trying to select their camera via the browser. Disable any apps on your device that may be causing an overlay on the screen or has the power to do so. Try the native Android app if this fails still.

### Supported Android versions

VDO.Ninja has been tested to work on a Nexus 9 running Android 5.1 and Chrome. Performance wasn't great, but usable as a remote webcam.
