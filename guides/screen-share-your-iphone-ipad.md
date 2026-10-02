---
description: How to screen share an iPhone or iPad to OBS and VDO.Ninja using the native app, QuickTime on macOS, or related mobile workflows.
---

# How to screen share your iPhone or iPad to OBS with VDO.Ninja

If you want to screen share an iPhone or iPad into OBS or VDO.Ninja, there are a few practical paths. The simplest modern option is the native VDO.Ninja mobile app. Another reliable option is to connect the device to a Mac and capture it through QuickTime, then share that window into VDO.Ninja.

Safari on iOS cannot share another app's screen. To share Notes, a game, or another app, use the native VDO.Ninja app or mirror the device to a computer.

## Share with the native iOS app

The native app supports background screen broadcasting through ReplayKit. Current versions can capture app audio and microphone narration, with separate mute controls. Protected content and individual apps can still prevent audio or video capture.

{% content-ref url="../steves-helper-apps/native-mobile-app-versions.md" %}
[native-mobile-app-versions.md](../steves-helper-apps/native-mobile-app-versions.md)
{% endcontent-ref %}

\
<img src="../.gitbook/assets/image (192).png" alt="" data-size="original"><img src="../.gitbook/assets/image (193).png" alt="" data-size="original">

1. Choose **SCREEN** in the native app.
2. In **Publishing Settings**, choose a Stream ID or leave it blank for an automatic one. Use **iOS Screen Share Quality** to select **Balanced**, **Quality**, or **Maximum**; **Maximum** targets up to 1080p when resources permit. **Performance** is also available for lower load.
3. Connect and select **VDO.Ninja Screen Recorder** in Apple's broadcast picker, then tap **Start Broadcast**.
4. Enable the microphone in Apple's broadcast controls if you want narration.
5. Switch to Notes or the app you want to share. Leaving VDO.Ninja in the background should not end the broadcast.
6. Open the app-generated viewer link in your receiving browser or OBS Browser Source. The native iOS screen-sharing publisher uses a direct viewer link or configured WHIP destination; it does not join a VDO.Ninja room.

### Quality and audio

For small text, try **Maximum**. If sharing freezes or stops, choose **Quality** or **Balanced** and restart screen sharing. The app can lower resolution, frame rate, and bitrate under resource pressure. See the [quality-mode table](improving-quality-of-the-native-app.md#ios-screen-share-quality) for the current limits.

The microphone and app-audio buttons control different sources. Check both if a viewer hears narration but not the shared app, or the shared app but not narration. Unmuting in VDO.Ninja does not enable a microphone disabled in Apple's broadcast controls.

The optional **Camera overlay** adds front- or rear-camera Picture in Picture on supported devices. Keep its window visible; hiding or closing it pauses the camera inset. It generally requires iOS 18 or later on iPhone, and unsupported devices continue with screen sharing only.

Add playback parameters such as `&buffer=500` to the **receiving link**, not to the app's Stream ID. Buffering can help jitter on supported viewers at the cost of latency; it cannot increase the phone's capture detail. Viewer bitrate requests do not bypass the native screen-share preset limits.

### If the broadcast does not start

* Look for **VDO.Ninja Screen Recorder** in Apple's picker; scroll if needed.
* No video is sent until **Start Broadcast** has been selected. If you cancelled the picker, end the session and select **SCREEN** again.
* Update the installed app and iOS where available. Older app versions may have different quality controls or audio behavior.
* If it still fails, report the device model, iOS version, app version, selected quality mode, and receiving browser or OBS version.

## Other options

Another option is to use Apple AirPlay to wirelessly cast your screen to a computer, and then window-capture that output.

Better than AirPlay, if you can connect your iPhone to a Mac via USB, is QuickTime. QuickTime supports USB-connected access to an iPhone's camera and screen output. This does not require extra capture hardware and offers a high-quality workflow. Using a virtual audio device, you can even capture iOS audio with this method.

In this guide we show how to screen-share to VDO.Ninja using QuickTime over USB with a MacBook and an iPhone. On Windows, you may prefer AirPlay or the native iOS app workflow instead.

{% hint style="info" %}
Android users can use the native VDO.Ninja Android app to screen share directly to VDO.Ninja.
{% endhint %}

1. Connect your iPhone to your Mac via a USB cable. You may need a USB to USB-C adapter if you do not already have a Lightning to USB-C adapter.

![](<../.gitbook/assets/image (106) (1) (1).png>)

2. Open QuickTime Player on your Mac.

![](<../.gitbook/assets/image (90) (1) (1).png>)

3. From the QuickTime Player menu, select File -> New Movie Recording.

![](<../.gitbook/assets/image (92) (1) (1).png>)

4. QuickTime Player may show your laptop webcam initially, but you can select the iPhone's video and audio as a source from the QuickTime source picker.

For this to work, your iPhone needs to be connected, turned on, and unlocked.

![](<../.gitbook/assets/image (123) (1).png>)

5a. OPTIONAL: If you want to capture audio from your iPhone, you will need to install a virtual audio driver.

Several choices exist, although popular ones are [Loopback](https://rogueamoeba.com/loopback/), [BlackHole](https://existential.audio/blackhole/), and [VB-CABLE](https://vb-audio.com/Cable/). In this walkthrough we use BlackHole.

![](<../.gitbook/assets/image (115) (1) (1).png>)

5b. OPTIONAL: If using Loopback, you can customize the audio routing. With BlackHole, we instead output the system audio to the virtual audio cable. In macOS audio settings, select the BlackHole device as the audio output destination.

![](<../.gitbook/assets/image (95) (1) (1).png>)

5c. OPTIONAL: Assuming QuickTime Player is capturing audio from the iPhone, simply unmute QuickTime Player. You will not hear playback if it is being routed to the virtual audio device, but you should see the meter moving if audio is present.

![](<../.gitbook/assets/image (124).png>)

6. We can now start streaming to VDO.Ninja by visiting the site and clicking Share Screen. Using Chrome or another Chromium-based browser is required, such as the Electron Capture app. Safari will not work here because it cannot select a window for this workflow.

.![](<../.gitbook/assets/image (120) (1) (1).png>)![](<../.gitbook/assets/image (131) (1).png>)

7. To start screen sharing, select "Window" as the capture source, and then select the QuickTime window that is showing the iPhone.

If you want to capture audio, you can also select the BlackHole virtual audio device from the Audio Sources menu in VDO.Ninja, either before or after starting. You can also select your local Mac microphone if needed.

![](<../.gitbook/assets/image (121) (1) (1) (1).png>)

8. Once the stream starts, you can use the settings menu to select audio sources. If you select the BlackHole virtual audio device, Loopback, or VB-CABLE, you will share the audio being captured from the iPhone. Hold down the `CMD` key while selecting audio sources if you want to mix more than one source.

&#x20;![](<../.gitbook/assets/image (128).png>)

9. Finally, add the VDO.Ninja view link to your remote OBS Studio or share it with friends.

The view link is normally found at the top of the VDO.Ninja page, but it can also be formed from the stream ID found in the URL. You can customize the link and add it to OBS, making sure to enable "Control audio via OBS" and ensuring the resolution matches what you want.

![](<../.gitbook/assets/image (132) (1).png>)

10. If you want to increase the frame rate and quality of the VDO.Ninja stream, adding [`&videobitrate=6000`](../advanced-settings/video-bitrate-parameters/bitrate.md) to the URL will increase the quality significantly. If you are looking to stream a game, you may want to increase this value further, although the default bitrate is often enough for text and basic screen sharing.

Please see the rest of the documentation for more details on customizing VDO.Ninja.
