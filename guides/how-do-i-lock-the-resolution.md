---
description: If you don't want the resolution to vary
---

# How to lock the resolution

The browser doesn't allow much control over the resolution, which is unfortunate. The published resolution will often change based on network conditions or CPU performance, but also if the bitrate for a video stream is too low.

There are still some options though:

* Ensure you and your viewers have rock solid Internet. Packet loss can cause the resolution to drop, so make sure to avoid packet loss.
* Increase the target bitrate by using [`&videobitrate=20000`](../advanced-settings/video-bitrate-parameters/bitrate.md) on the viewer side. If in a group room, consider using [`&meshcast`](../newly-added-parameters/and-meshcast.md) or increasing the total room bitrate. This is particularly true at higher resolutions with lots of motion.
* Add [`&scale=100`](../advanced-settings/view-parameters/scale.md) to the view links. This will disable any optimization VDO.Ninja applies to limit resolution based on window playback size. You can also try [`&scale=50`](../advanced-settings/view-parameters/scale.md) to lower the resolution, helping to keep the resolution stable at a lower resolution.
* Adding [`&contenthint=detail`](../advanced-settings/video-parameters/and-contenthint.md) to the guest's link is me telling the browser to "lock the resolution to something high", but it may still ignore it. This will tell the browser to lower frame rates instead of resolution, but in some cases the resolution may still drop.
* Using [`&chunked`](../newly-added-parameters/and-chunked.md) on the guest invite links sends video over the data-channels instead, which is something that allows VDO.Ninja to lock the resolution / frame rate with, but this can be very troublesome to use and may increase latency a lot.\
  This is also experimental and can be buggy, so please report bugs and issues and over time it may be something I can more often recommend.
* In some cases, you can have guests publish video via OBS's WHIP output into VDO.Ninja. This lacks a lot of functionality and remote control, but it should lock the resolution and frame rate. Missed frames and latency may be issues though.
* You can also publish video via [Raspberry.Ninja](../steves-helper-apps/raspberry.ninja/), where I can control resolution also. Just like with OBS's WHIP output, frame loss may be an issue.
* You can record solo links in OBS Studio or with [Vingester.app](../steves-helper-apps/community-contributed-tools.md), which will record the inbound videos at a fixed resolution, despite the source having varying frame rates and resolutions. If recording at a high bitrate and with a touch of sharpness added, you can achieve great results.
