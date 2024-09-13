---
description: Encoder options that can offer smooth playback
---

# Recommended OBS WHIP settings

OBS Studio v30 now has WHIP output, which can stream into VDO.Ninja. While there are a few limitations of using OBS Studio with VDO.Ninja directly, some H264 settings that have reported offered good results are the following:

* Rate Control: CRF
* CRF: 23
* Keyframe Interval: 1s
* Preset: Veryfast
* Profile: High
* Tune: Fastdecode (required for WebRTC playback)
* x264 Options: bframes=0 (required for WebRTC playback)

In some cases when using VDO.Ninja to view the WHIP video, adding [`&buffer=2500`](../advanced-settings/view-parameters/buffer.md) to the VDO.Ninja view link can further help reduce any lost of skipped frames, but at the cost of increased latency.

## How to view WHIP streams using VDO.Ninja

There's a guide here for those looking to go live from OBS to VDO.Ninja via WHIP

{% embed url="https://docs.vdo.ninja/guides/from-obs-to-vdo.ninja-using-whip" %}

If looking for alternatives to publishing into VDO.Ninja, consider checking out [Raspberry.Ninja](../updates/updates-raspberry.ninja.md) also, which supports a broad range of encoders, including AV1-AOM, Intel QuickSync, Raspberry Pis, Nvidia Jetson, and many other hardware and software options. Playback is smooth, with support for multiple viewers. Runs on most systems, including Linux and _Windows for Linux Subsystem_ (WSL).
