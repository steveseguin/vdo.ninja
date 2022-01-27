---
description: How to screen share your iPhone or iPad to VDO.Ninja
---

# Screen Share your iPhone / iPad

If on iOS, there isn't an option available to screen share from within the browser or native iOS app, but you can wirelessly airplay your screen to a computer, and then window capture that output.

Better than Airplay though, if you can connect your iPhone to a mac via USB, QuickTime supports USB-connected access to an iPhone's camera. This does not require any downloads and offers a high-quality stream. Using a virtual audio device, you can even capture IOS audio with this method.

In this guide we will show you how to screen-share to VDO.Ninja using QuickTime over USB with a Macbook and an iPhone. On Windows, you may wish to use Airplay instead, leveraging one of the free Airplay clients designed for PC.

{% hint style="info" %}
Android users can use the native VDO.Ninja Android app to screen share directly to VDO.Ninja.
{% endhint %}

1. Connect your iPhone to your mac via a USB cable. You may need a USB to USB-C adapter if you do not have a lightning to USB-C adapter already.

![](<../.gitbook/assets/image (106).png>)

2\. Open the QuickTime Player on your mac.

![](<../.gitbook/assets/image (90).png>)

3\. From the QuickTime Player menu, select File -> New Movie Recording.

![](<../.gitbook/assets/image (92).png>)

4\. The QuickTime Player may show your laptop's webcam initially, but you can select from the hover-over menu the option to select your iPhone's video and audio as a video source instead.

For this to work, your iPhone needs to be connected and turned on. It will not work if locked and sleeping.

![](<../.gitbook/assets/image (123).png>)

5a. OPTIONAL: If you want to capture audio from your iPhone, you will need to install a virtual audio driver.

There are several choices, although the popular ones are [Loopback ](https://rogueamoeba.com/loopback/)(\$$), [Blackhole ](https://blackhole.soullabs.com/horizon/dashboard)(Free), and [VB Cable](https://vb-audio.com/Cable/) (Free). Install one of your choice; in this walk-thru we are using Blackhole.

![](<../.gitbook/assets/image (115).png>)

5b. OPTIONAL: If using Loopback, you will have the ability to customize the audio routing, but with Blackhole we will just output all the system's audio to the virtual audio cable. In the macOS audio settings, we just need to select the Blackhole audio device as the audio output destination.

![](<../.gitbook/assets/image (95).png>)

5.c. OPTIONAL: Assuming QuickTime Player is capturing audio from the iPhone, we simply just need to unmute the QuickTime Player. You won't hear audio playback, as it is being streamed to the Blackhole virtual audio device instead, but you should be able to see the audio meter bouncing around if there is audio.

![](<../.gitbook/assets/image (124).png>)

6\. We can now start streaming to VDO.Ninja; we just need to visit the site and click Share Screen. Using Chrome or another Chromium-based browser is required, such as the Electron Capture app. Safari will not work as it lacks the ability to select a window.

.![](<../.gitbook/assets/image (120).png>)![](<../.gitbook/assets/image (131).png>)

7\. To start screen sharing, we will want to select "Window" as the capture source, and then select the QuickTime, which should be showing our iPhone.&#x20;

If we want to capture audio, we can also select the Blackhole virtual audio device from the Audio Sources menu in VDO.Ninja, but we can also do this after we start streaming. We can also select our local macBook microphone if we wanted.

![](<../.gitbook/assets/image (121).png>)

8\. Once we start streaming, there is a settings menu that we can use to select audio sources. If we select the Blackhole virtual audio device (or Loopback / VB Cable), we will be sharing our audio that we are capturing from the iPhone. We can hold down the `CMD` (⌘) key while selecting audio sources to select and mix more than one audio source.

&#x20;![](<../.gitbook/assets/image (128).png>)

9\. Finally, we can add the VDO.Ninja view link to our remote OBS Studio or share it with friends.&#x20;

The view link is normally found at the top of the VDO.Ninja page, but it can be formed based on the stream ID found in the site's URL as well. You can customize it the link and add it to OBS, making sure to enable "Control audio via OBS" and ensuring the resolution matches what you want.

![](<../.gitbook/assets/image (132).png>)

10\. If you want to increase the frame rate and quality of the VDO.Ninja stream, adding [`&videobitrate=6000`](../viewers-settings/bitrate.md) to the URL will increase the quality by more than double. If you're looking to stream a game, you may want to increase this value even higher, although the default bitrate is more than enough for text and basic screen sharing.

Please see the rest of the documentation for me details on customizing VDO.Ninja.
