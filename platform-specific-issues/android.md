---
description: Use the VDO.Ninja Android app for phone cameras, screen sharing, and USB devices.
---

# Android

For a phone camera, start with the **VDO.Ninja native app**. Follow [phone camera to OBS](../getting-started/mobile-phone-camera-into-webcam.md) for your first stream.

Use [VDO.Ninja in the browser](https://vdo.ninja/) when you need the full director and room interface, or want to join without installing an app.

### Native Android app

[Install from Google Play](https://play.google.com/store/apps/details?id=flutter.vdo.ninja), or use the [direct APK download](../steves-helper-apps/native-mobile-app-versions.md#android-downloads).

The app supports:

* Phone cameras, compatible USB cameras, screen sharing, and microphone-only streams.
* Camera selection, zoom and other camera controls, video quality, bitrate, and frame-rate settings.
* Local recording while streaming, with a gallery to review clips.
* USB audio, talkback, and optional Social Stream Ninja chat and text-to-speech.
* Optional Meshcast, WHIP, RTMP, and SRT outputs.

Start with the [native app quick start](../steves-helper-apps/native-mobile-app.md#quick-start). Open its advanced settings only when you need another feature.

### External camera support

For a USB webcam or HDMI capture adapter:

1. Connect it to the Android phone. Use a powered USB hub if the device needs more power.
2. Choose **USB CAMERA** in the VDO.Ninja app and allow USB access.
3. Check the preview, select audio separately, and start the stream.

The phone must support USB host mode and the camera must expose compatible UVC video. See [USB camera setup](../steves-helper-apps/native-mobile-app.md#usb-camera). Browser camera lists often do not include USB cameras.

### USB audio device support

1. Connect the microphone before opening the app's **Publishing Settings**.
2. Select it in the microphone list. Tap **Refresh Mics** if it is missing.
3. Start the stream, speak, and check the sound on the receiving device.

If it is still missing, check the adapter and power supply. For diagnosis, compare with the phone's built-in microphone. See [audio troubleshooting](../common-errors-and-known-issues/audio-over-vdo.ninja-isnt-working.md#external-usb--lightning-audio).

### Samsung phones

Start with the native app for camera capture. If you need browser capture and Chrome has a problem, compare the same setup in Samsung Internet. Available lenses, frame rates, and audio devices can differ.

For talking while another app is open, follow [keep a microphone active in the background](../guides/keep-mic-active-in-background-on-android-browser.md). Check the receiving sound before relying on it for a show.

### Battery life

Try **720p at 30 fps**, close unused viewers, and keep the phone out of direct sun. Lower screen brightness if the screen must stay on. See [overheating](../common-errors-and-known-issues/overheating.md) and [native app quality settings](../guides/improving-quality-of-the-native-app.md).

### Firefox

If browser capture fails in Chrome, compare the same camera and microphone in Firefox. Check the receiving picture and sound; browser support can differ by device. For background microphone use, start with the [native app workflow](../guides/keep-mic-active-in-background-on-android-browser.md).

### Internal Cameras

Choose **BACK CAMERA**, **FRONT CAMERA**, or an extra lens such as **BACK ULTRA-WIDE** when it appears in the app. Check the preview before going live. A zoom control can crop the picture without switching lenses.

If the camera you need is missing, see [camera lens selection](../common-errors-and-known-issues/cant-select-a-camera-lens-on-mobile.md).

### Screen sharing

Choose **SCREEN** in the native app and approve Android's capture prompt. On supported Android 14+ devices, choose one app or the entire screen.

To send app sound, enable **Capture System Audio** before starting. This needs Android 10+ and an app that allows audio capture. Check both picture and sound on the receiving device. Protected content may appear blank or silent.

See [screen-sharing steps](../steves-helper-apps/native-mobile-app.md#screen-sharing). For an iPhone or iPad, use the [iOS guide](../guides/screen-share-your-iphone-ipad.md).

### Performance issues

Close duplicate viewers and unused previews, then lower resolution or frame rate. Check the received video again.

For a browser guest in a room, the director can add [`&roombitrate=0`](../advanced-settings/video-bitrate-parameters/roombitrate.md) to the guest's invite to stop sending that guest's video to other group members. Use this only when those members do not need that video. For several production viewers, consider [Meshcast distribution](../guides/meshcast-setup.md).

### Camera selection page freezes

If the browser's camera selection page freezes, switch away and back once. If it remains frozen, close other apps using the camera and reload the page, or use the native app.

### Corrupted video; green or grey pixels

First check whether the phone's own preview looks correct. For a browser feed that breaks after rotation, restart capture in the orientation you intend to use.

If the received picture is still corrupt, compare a lower resolution or try [`&codec=vp9`](../advanced-settings/view-parameters/codec.md) on the viewer link. Check motion and device temperature before using the new setting live.

### External audio

Use the [USB microphone steps above](#usb-audio-device-support). For a headset or Bluetooth device, select it in the microphone list and check the received sound before going live. The connector alone does not establish microphone compatibility.

### On-screen overlays blocking access

If Android blocks a camera or permission prompt, close floating windows and apps drawing over the screen, then try again. Allow camera and microphone access when prompted.

### Supported Android versions

The native app's minimum Android version is **5.0**, but individual features need newer versions or compatible hardware. System-audio capture needs Android 10+. Use the current app or browser supported by your device and check a complete stream before the event.
