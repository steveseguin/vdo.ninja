---
description: Some common problems and solutions with screen sharing
---

# Can't share my screen

### Windows

If using a Windows PC, and you can't see one or all of your screens to share, consider setting your display's resolution to 1080p or/and disabling any HDR (high dynamic range) on that display.

If using a laptop, the display you may wish to capture needs to be on the same GPU that the capturing is happening. Some laptops with dual graphics systems will have issues. Using an HDMI to USB adapter that has an HDMI splitter built-in is a cheap hardware-solution.

### Electron Capture

If using the Electron Capture app, please consider loading that app with Elevated privilege's, which can be done via command line or via right-clicking the app and selecting the option to elevate from the context menu.

### macOS

If on macOS, please be sure to give your browser system-level access in macOS to access your screen.

Chrome will let you share tabs, windows, and the entire screen, although audio capture is only available via Virtual Audio device (ie: Loopback) or tab-capture.

Safari has very limited options; it lets you capture the entire screen, and that is mostly it.

### iOS

If on iOS, there isn't an option available to screen share from within the browser or native iOS app, but you can wirelessly airplay your screen to a computer, and then window capture that output.

Better than Airplay though, if you can connect your iPhone to a mac via USB, QuickTime supports USB-connected access to an iPhone's camera. This does not require any downloads and offers a high-quality stream. Using a virtual audio device, you can even capture IOS audio with this method.

Please refer to this guide for more details:\
[https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad](https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad)

### Android

For Android users, downloading the VDO.Ninja APK file will let you screen share on Android, however you can't screen share via the browser on Android.

The Android app is available here: [https://docs.vdo.ninja/getting-started/native-mobile-app-versions](https://docs.vdo.ninja/getting-started/native-mobile-app-versions)
