---
description: Reduce heat and improve streaming stability on phones and laptops.
---

# Overheating

If the phone gets hot and video starts stuttering, reduce its workload before raising quality settings.

1. Close duplicate viewers and unused previews.
2. Try 720p at 30 fps in the native app, or a lower browser capture quality.
3. Keep the device out of direct sun and give it airflow. Check the received picture again after it has cooled.

### Lowering the quality&#x20;

For long games, conferences, and other events, use the [event preparation checklist](../guides/streaming-sports-and-events.md#prepare-for-a-full-event) to test power and cooling before going live.

For browser capture, try [`&quality=2`](../advanced-settings/video-parameters/and-quality.md) on the publisher's link to request 360p, or [`&scale=50`](../advanced-settings/view-parameters/scale.md) on the viewer link to request half-size video. Check that the received picture is still clear enough for your show.

Lowering video bitrate can also reduce load. Try a lower target, such as `https://vdo.ninja/?view=MYSTREAM&codec=h264&scale=50&bitrate=1500`, and compare motion quality and temperature. [Defaults depend on the capture mode and device](../guides/default-resolution-and-bitrate.md).

### Hardware encoders on mobile devices

Hardware encoding can reduce CPU load and heat. If the normal codec is expensive on the phone, compare [`&codec=h264`](../advanced-settings/view-parameters/codec.md) on the direct viewer link. H.264 is often hardware-encoded on phones, but the device, browser, capture mode, and available encoder resources decide what is used.

Compare temperature and sustained frame rate with the actual setup. A codec request does not guarantee hardware acceleration or a particular resolution. See [hardware-accelerated video encoding](../guides/hardware-accelerated-video-encoding.md) for details.

### Meshcast.io and server-based restreaming

Each direct viewer adds work and upload traffic to the sending phone.

First close duplicate viewers and pause unused director previews. If several viewers still need the feed, [Meshcast](../guides/meshcast-setup.md) can distribute one upload through a server. Check its current plan limits for the intended audience and event length.

### Group rooms, multiple-scenes, or multiple viewers

Start with one viewer, then add only the room guests and OBS sources you need. Several direct viewers can increase load even when the camera preview looks smooth.

You can force-limit the number of connections and viewers with the [`&maxconnections=1`](../source-settings/and-maxconnections.md) parameter, added to the publisher's URL. If you are accidentally viewing the video stream multiple times, this will help prevent more than one viewer from having access.

### Start with a full-battery

Charge the phone before the event. Charging while streaming adds heat, so test the power setup for the expected event length.

### Smartphone add-on heatsink and fan

Give the phone airflow and avoid covering it. If you use a phone cooler, check that it fits without blocking the camera or controls. Compare the received video and phone temperature during a full-length trial.

![](<../.gitbook/assets/image (4) (1) (1) (1) (1) (1) (1) (1) (1).png>)

Sometimes a thick protective case can insulate a smartphone, making it hotter than needed, too.

See this [phone cooling demonstration](https://www.youtube.com/shorts/kH2Y3kAysv4):

{% embed url="https://www.youtube.com/shorts/kH2Y3kAysv4" %}

### Web apps are intentionally limited on mobile devices

For browser camera capture, keep the page in the foreground and the screen on. Lower the screen brightness to reduce power use. Use the native app for phone screen sharing and supported background workflows.

### Native mobile app of VDO.Ninja

The [Android and iPhone apps](../steves-helper-apps/native-mobile-app.md) provide camera controls, local recording, and optional server outputs. Compare the normal app camera mode with the browser using the same resolution, frame rate, viewers, and test duration. Lower its [capture quality](../guides/improving-quality-of-the-native-app.md) if the phone gets hot; switching protocols alone does not solve overheating.

### Laptops and MacBooks

Heat can make a laptop slow its processor, which may look like a network problem in the received video.

Use a firm surface that leaves the vents clear. Close unnecessary apps and previews, and lower capture quality if CPU use stays high. Check for blocked or dusty vents using the computer manufacturer's maintenance instructions.

![](<../.gitbook/assets/image (5) (1) (1) (1) (1) (1) (1) (1) (1).png>)

### Raspberry Pi, NVIDIA Jetson, and dedicated hardware-encoders

For a dedicated capture device, see [Raspberry.Ninja](../steves-helper-apps/raspberry.ninja/README.md). For an RTMP or SRT encoder, follow [Meshcast to OBS](../guides/meshcast-rtmp-srt-to-obs.md). These move capture and encoding off the phone.
