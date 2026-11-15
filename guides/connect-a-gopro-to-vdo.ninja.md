---
description: Send a GoPro to VDO.Ninja or OBS using Meshcast RTMP, an Android USB capture adapter, or a computer.
---

# How to connect a GoPro to VDO.Ninja

Choose the connection your camera supports:

| Your setup | Use |
| --- | --- |
| GoPro with custom RTMP live streaming | [Meshcast relay](#send-rtmp-through-meshcast) |
| GoPro with HDMI output and an Android phone | [VDO.Ninja app with a USB capture adapter](#use-an-android-phone) |
| GoPro beside a computer | [USB webcam mode or HDMI capture](#use-a-computer) |

## Send RTMP through Meshcast

For a wireless GoPro feed, use Meshcast to receive RTMP and provide a viewing link for OBS or VDO.Ninja. You need a registered Meshcast account and a GoPro that supports a custom RTMP destination.

1. Open [Meshcast Studio](https://app.meshcast.io/studio), select a stream, and copy its **RTMP Server** and **Publish Key**.
2. In the GoPro app's live-stream setup, select **RTMP**. If it asks for one URL, append the publish key to the server address with a `/` between them. Keep this URL private.
3. Connect the GoPro to Wi-Fi or a hotspot and start its live stream.
4. In Meshcast Studio, open **Watch Links** and copy **VDO.Ninja View Link** into an OBS Browser Source.

Browser playback needs H.264 video without B-frames. If your GoPro cannot disable B-frames and the browser feed stays black, use Meshcast's HLS playback link in an OBS **Media Source** instead. HLS adds delay. Follow [Meshcast's GoPro walkthrough](https://app.meshcast.io/docs/gopro-to-obs) and [GoPro's RTMP setup](https://gopro.com/en/us/news/how-to-live-stream-on-gopro) for the camera-side steps.

To send the same feed to several platforms, follow [multistreaming with Meshcast](multistream-with-meshcast.md).

## Use an Android phone

For a GoPro with HDMI output, use a compatible HDMI-to-USB UVC capture adapter and the **VDO.Ninja native app**. Check which HDMI accessory your GoPro model needs before buying an adapter.

**GoPro HDMI output > USB capture adapter > Android phone > VDO.Ninja viewer**

1. Connect the GoPro to the capture adapter, then connect the adapter to the phone. Use a powered USB hub if needed.
2. Open the [VDO.Ninja app](../steves-helper-apps/native-mobile-app.md#usb-camera), choose **USB CAMERA**, and approve Android's USB permission.
3. Select the microphone or capture-device audio input, then start sharing.
4. Copy the app's viewer link into OBS as a Browser Source. Check moving video and sound.

The phone must support USB host mode and the adapter must expose a compatible UVC camera. A USB-C connector alone does not make the GoPro a UVC webcam for Android.

## Use a computer

Use GoPro's webcam software with a supported camera, or connect HDMI through a USB capture adapter. Once the feed appears as a camera on the computer, open [VDO.Ninja](https://vdo.ninja/), choose **Add your Camera to OBS**, and select it. Copy the resulting viewer link to the receiving OBS.

For current camera and computer requirements, see [GoPro Webcam](https://community.gopro.com/s/article/GoPro-Webcam).

## iPhone and iPad

The VDO.Ninja iOS app does not expose USB/HDMI camera input. Use the GoPro's RTMP output through Meshcast, or capture through a computer or Android phone.

If a GoPro companion app shows the camera preview and allows screen capture, you can also [share that screen with VDO.Ninja](screen-share-your-iphone-ipad.md). This captures the app's visible interface, so check the result before using it on air.

## Dedicated encoder

For a small Linux capture device, see [Raspberry.Ninja](../steves-helper-apps/raspberry.ninja/README.md). An RTMP or SRT hardware encoder can also use the [Meshcast-to-OBS workflow](meshcast-rtmp-srt-to-obs.md).
