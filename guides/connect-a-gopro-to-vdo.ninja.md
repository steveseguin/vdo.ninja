---
description: Connect GoPro cameras to VDO.Ninja using USB webcam mode or HDMI capture adapters for live streaming.
---

# How to connect a GoPro to VDO.Ninja

A GoPro itself doesn't support streaming directly to a remote VDO.Ninja viewer, but there are indirect methods to achieve this.

#### **Using a GoPro Hero 8 Black or newer as a USB webcam**

This approach requires a computer. You can connect a GoPro to VDO.Ninja via USB and a computer, where the GoPro will appear in your browser as a webcam for live streaming.\
[Guide to using a GoPro as a webcam](https://gopro.com/en/ca/news/how-to-use-gopro-for-webcam)

If you need to connect it to a smartphone instead of a computer, there is an Android application that supports UVC-compatible video devices. However, it may require a powered OTG USB hub.

The Android APK (currently in beta) is available for testing here: [Android UVC App](https://drive.google.com/file/d/1L8meslXPEzivocH3wz48abNtJ926hQUr/view?usp=drive_link).

#### **Using older GoPros as a webcam via HDMI to USB adapters**

Older GoPro models that don’t support direct webcam functionality can still be connected to a computer with an HDMI to USB adapter. While the adapter itself doesn’t provide wireless streaming, the host computer can stream the GoPro's video feed wirelessly to any other device using VDO.Ninja.

[Guide to using GoPro with HDMI to USB](https://gopro.com/en/ca/news/how-to-use-gopro-for-webcam)

Once the adapter is set up, the GoPro feed will function like a standard webcam.

#### **Portable laptop-in-a-backpack option**

You can create a mobile setup by using a lightweight laptop (like a Chromebook or MacBook M1) in a backpack. Connect the GoPro to the laptop with an HDMI cable and use an HDMI to USB adapter. You can then stream the video feed through a browser using VDO.Ninja.

For GoPro Hero 8 Black or newer models, USB-C can replace HDMI.

Using a service like [Speedify](https://speedify.com) on the laptop allows you to bond Wi-Fi and cellular connections, improving mobility and reducing the chances of video drops. Professionals requiring even more reliable connections may consider hardware cellular bonding solutions.

#### **Android systems with HDMI input support**

Certain Android tablets or devices with built-in HDMI input can also work, though these solutions are less common and may require testing.

One example is the [YoloBox](https://www.yololiv.com/), which supports HDMI input and allows installation of Chrome. If HDMI input can be selected in Chrome, streaming via VDO.Ninja may be possible. There's also DIY Android embedded systems with HDMI input, such as Orange Pi 5 Pro, which may let you access the HDMI camera from Chromium.

#### **iPad via USB**

Some iPads support USB camera connections, and using an HDMI to USB adapter may enable GoPro streaming through an iPad.

Newer GoPros might work without HDMI adapters on the latest USB-C compatible iPads or iPhones, such as the iPhone 15 Pro. However, this hasn’t been confirmed yet.

#### **Screen-sharing the GoPro video preview on Android**

Currently, there are no native apps for HDMI input on iOS. However, you can screen share the GoPro's video preview using the VDO.Ninja app. This method involves using an iOS app that displays the GoPro feed in full-screen mode, which you can then share via VDO.Ninja.

#### **Raspberry Pi or NVIDIA Jetson encoder**

A Raspberry Pi can be configured to ingest the GoPro's HDMI feed and stream it to VDO.Ninja over Wi-Fi.

The project code is available here: [Raspberry Ninja on GitHub](https://github.com/steveseguin/raspberry_ninja).

This solution is suitable for tinkerers, and with some ingenuity, it could turn your GoPro into a powerful streaming device, or even replace the GoPro if  you choose to use your own camera sensor. Cheap, too.

![](<../.gitbook/assets/image (127) (1).png>)![](<../.gitbook/assets/image (227).png>)

#### **RTMP to WHEP/WHIP**

Open-source tools can convert RTMP streams to WHEP, which is supported by VDO.Ninja. For example, MediaMTX can perform RTMP to WHEP transcoding. The [VDO.Ninja WHEP player](https://vdo.ninja/whep) is available for playback of WHIP and WHEP sources, and more services are adopting WHEP compatibility everyday.

In the future, GoPro may support WHIP output natively, which would provide an alternative to RTMP and be directly compatible with VDO.Ninja.

#### **Alternatives to VDO.Ninja**

Platforms like [StageTEN](https://stageten.tv) support RTMP and WHIP ingest. They can output clean feeds for use in VDO.Ninja or OBS Studio.

Services like [Restream.io](https://restream.io) also offer RTMP ingestion. While this may introduce latency, you can pull RTMP feeds into OBS Studio. Some users even use Twitch as an intermediary by publishing streams to Twitch and pulling the feed into OBS Studio, bypassing ads with Twitch Turbo and custom CSS.\
\
I discuss some other free and easy options of bringing RTMP video into OBS in the following video:

{% embed url="https://www.youtube.com/watch?v=MGA4bx7FRC4" %}

### **SRT and Dedicated IRL Streaming Tools**

While VDO.Ninja focuses on WebRTC and RTMP, there are alternative technologies like **SRT (Secure Reliable Transport)** that might be better suited for IRL streaming.

SRT offers robust performance in environments with unstable network conditions. It’s especially useful for high-latency scenarios, as it optimizes reliability through packet retransmissions. Tools such as [OBS Studio](https://obsproject.com) or dedicated SRT encoders can bridge GoPro video streams to platforms like VDO.Ninja or other destinations.

For professional-grade setups, hardware solutions like Teradek encoders support SRT with features such as HDMI input and bonded network connections. These solutions ensure reliability by combining multiple internet connections, such as Wi-Fi, cellular, and Ethernet. Though these tools can be expensive, they are ideal for professionals requiring consistent and high-quality streams on the go.

If you need more detailed recommendations or insights, feel free to consult resources like LiveU, which specializes in IRL streaming equipment.\
