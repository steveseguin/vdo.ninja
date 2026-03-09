---
description: How to screen share an iPhone or iPad to OBS and VDO.Ninja using the native app, QuickTime on macOS, or related mobile workflows.
---

# How to screen share your iPhone or iPad to OBS with VDO.Ninja

If you want to screen share an iPhone or iPad into OBS or VDO.Ninja, there are a few practical paths. The simplest modern option is the native VDO.Ninja mobile app. Another reliable option is to connect the device to a Mac and capture it through QuickTime, then share that window into VDO.Ninja.

If you are on iOS, there is not a full browser-based screen sharing option in Safari, so you will generally want to use one of the methods below.

One recently added way to screen share is with the VDO.Ninja native mobile app. It now supports screen sharing, however system audio capture may be missing.

{% content-ref url="../steves-helper-apps/native-mobile-app-versions.md" %}
[native-mobile-app-versions.md](../steves-helper-apps/native-mobile-app-versions.md)
{% endcontent-ref %}

\
<img src="../.gitbook/assets/image (192).png" alt="" data-size="original"><img src="../.gitbook/assets/image (193).png" alt="" data-size="original">

When using the native app to screen share, be sure to select the VDO.Ninja Screen Recorder option once prompted by Apple. Then click Start Broadcast.

If you do not see the option, try scrolling down. If you still do not see it, update your iOS system version to the newest available version. Older versions may not support screen sharing, such as iOS 15.x.

If you still cannot find it, check that the app has the correct permissions in your iOS settings, seek support, or try one of the other options below.

You can leave all other settings as default when using the [VDO.Ninja native app](../steves-helper-apps/native-mobile-app-versions.md). Once you start your broadcast, you will be provided a link at the top of the app that you can put into your browser or OBS browser source.

### Other options

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
