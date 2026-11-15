---
description: Mobile and laptop devices may overheat under prolong use
---

# Overheating

If the phone gets hot and video starts stuttering, reduce its workload before raising quality settings.

1. Close duplicate viewers and unused previews.
2. Try 720p at 30 fps in the native app, or a lower browser capture quality.
3. Keep the device out of direct sun and give it airflow. Check the received picture again after it has cooled.

### Lowering the quality&#x20;

For long games, conferences, and other events, use the [event preparation checklist](../guides/streaming-sports-and-events.md#prepare-for-a-full-event) to test power and cooling before going live.

The viewer has control over the requested quality. 1080p video on a mobile device uses up a lot of power, including by data-transmission and the video encoding itself. Try using a lowering resolution, either by adding [`&quality=2`](../advanced-settings/video-parameters/and-quality.md) to the publisher's link or by adding [`&scale=50`](../advanced-settings/view-parameters/scale.md) to the viewer link.

Lowering video bitrate can also reduce load. Try a lower target, such as `https://vdo.ninja/?view=MYSTREAM&codec=h264&scale=50&bitrate=1500`, and compare motion quality and temperature. [Defaults depend on the capture mode and device](../guides/default-resolution-and-bitrate.md).

### Hardware encoders on mobile devices

Hardware encoding can reduce CPU load and heat. If the normal codec is expensive on the phone, compare [`&codec=h264`](../advanced-settings/view-parameters/codec.md) on the direct viewer link. H.264 is often hardware-encoded on phones, but the device, browser, capture mode, and available encoder resources decide what is used.

Compare temperature and sustained frame rate with the actual setup. A codec request does not guarantee hardware acceleration or a particular resolution. See [hardware-accelerated video encoding](../guides/hardware-accelerated-video-encoding.md) for details.

### Meshcast.io and server-based restreaming

VDO.Ninja is peer-to-peer-based, which works great for linking one camera to one viewer. The more viewers though, as mentioned, the more load is created on that guest. Just the act of uploading data uses power, so mobile devices are also quite poor at restreaming to multiple viewers even if encoding video wasn't already an issue. This is why the video quality on mobile devices between guests is set very low by default.

First close duplicate viewers and pause unused director previews. If several viewers still need the feed, [Meshcast](../guides/meshcast-setup.md) can distribute one upload through a server. Check its current plan limits for the intended audience and event length.

### Group rooms, multiple-scenes, or multiple viewers

Every viewer of a stream adds to the heat and load experienced by the publisher of that stream. To reduce heat as much as possible, only allow one viewer of a stream to be active. Group-scenes, multiple-guests in a room, and multiple view-links each consistent as an active viewer. There are ways to optimize in these situations, but they may not be obvious. ([`&optimize=0`](../advanced-settings/video-bitrate-parameters/optimize.md), for example).

Phones have limited encoder resources. Several direct viewers can increase load even when the camera preview looks smooth.

You can force-limit the number of connections and viewers with the [`&maxconnections=1`](../source-settings/and-maxconnections.md) parameter, added to the publisher's URL. If you are accidentally viewing the video stream multiple times, this will help prevent more than one viewer from having access.

### Start with a full-battery

Charging a mobile phone creates heat. If you start charging your device after you've already started streaming, that will increase the heat. Try starting with the phone already at a 100% full-charge to avoid even more unnecessary heat.

### Smartphone add-on heatsink and fan

Professional cameras do often include a small fan inside them to reduce heat. Consider buying a heatsink that can be mounted onto the back of your smartphone, with an optional fan to turn on if it starts getting hot. These are not super common, probably not super effective, but they can be had for not much money.

![](<../.gitbook/assets/image (4) (1) (1) (1) (1) (1) (1) (1) (1).png>)

Sometimes a thick protective case can insulate a smartphone, making it hotter than needed, too.

I've done a YouTube video demoing how cooling your smartphone can reduce heat and also improve performance, as a hot phone my throttle the performance. See below:

{% embed url="https://www.youtube.com/shorts/kH2Y3kAysv4" %}

### Web apps are intentionally limited on mobile devices

For browser camera capture, keep the page in the foreground and the screen on. Lower the screen brightness to reduce power use. Use the native app for phone screen sharing and supported background workflows.

### Native mobile app of VDO.Ninja

The [Android and iPhone apps](../steves-helper-apps/native-mobile-app.md) provide camera controls, local recording, and optional server outputs. Compare the normal app camera mode with the browser using the same resolution, frame rate, viewers, and test duration. Lower its [capture quality](../guides/improving-quality-of-the-native-app.md) if the phone gets hot; switching protocols alone does not solve overheating.

### Laptops and MacBooks

Older 2011-era Apple notebooks are prone to overheating. Even newer generation Macbooks can overheat if stressed. Normally these systems throttle the CPU to be MUCH slower when they get too hot, so it may appear like there is a network issue.&#x20;

Ensure you are not running a laptop at 100% CPU load, make sure it has plenty of cool ventilation, ensure the fans are clean and not full of dust, start with a full battery and keep the computer plugged in

![](<../.gitbook/assets/image (5) (1) (1) (1) (1) (1) (1) (1) (1).png>)

### Raspberry Pi, NVIDIA Jetson, and dedicated hardware-encoders

For a dedicated capture device, see [Raspberry.Ninja](../steves-helper-apps/raspberry.ninja/README.md). For an RTMP or SRT encoder, follow [Meshcast to OBS](../guides/meshcast-rtmp-srt-to-obs.md). These move capture and encoding off the phone.
