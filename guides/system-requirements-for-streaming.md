---
description: >-
  System requirements for streaming using with OBS Studio, including a VDO.Ninja
  source
---

# System requirements for streaming

### Introduction

This guide outlines a general sense of system requirements and options for streaming using VDO.Ninja in combination with OBS Studio, targeting multiple platforms such as Kick, Twitch, and YouTube. \
\
System requirements will vary from user to user, and use case to use case, so there is no official minimum system requirement. Even a Raspberry Pi may be sufficient for some users, while others may need to rethink their strategy completely if their idea is outside the bounds of current physics.

### System Requirements for the average streamer

#### CPU

* Minimum suggested: Intel Core i5-8400 or AMD Ryzen 5 2600
* Recommended: Intel Core i7-12700K or AMD Ryzen 7 5800X
* High-end for flexibility: Intel Core i9-14900K or AMD Ryzen 9 7950X

Note: More powerful CPUs will handle multiple streams and VDO.Ninja cameras better. Each additional VDO.Ninja published stream will require more CPU power due to WebRTC's CPU-intensive nature. If using a GPU to accelerate the video encoding, a quad-core computer may also be minimally sufficient.

#### GPU

* Minimum: NVIDIA GTX 1660 or AMD RX 570
* Recommended: NVIDIA RTX 3060 or AMD RX 6600 XT
* High-end: NVIDIA RTX 4090 or AMD RX 7900 XTX

Note:

* Newer NVIDIA GPUs (RTX 30 and 40 series) offer better NVENC acceleration.
* RTX 40 series and some high-end 30 series cards support AV1 encoding.
* AMD GPUs from RX 6000 series onwards offer improved encoding capabilities.

#### RAM

* Minimum: 8GB
* Recommended: 16GB
* High-end: 32GB or more

#### Storage

* SSD recommended for faster load times and smoother performance

#### Internet Connection

* Upload speed: At least 5 Mbps per 720p stream at 30 fps
* Recommended: 10+ Mbps for single 1080p stream at 60 fps
* Multi-broadcast or group video: 30+ Mbps
* Wired Ethernet recommended for all computers

VDO.Ninja connections made over LAN do not use Internet normally. Also, VDO.Ninja will adapt to the Internet bandwidth available, however quality will suffer if being choked. It's best to not exceed 80% of the available upload and download bandwidth to avoid buffer bloat and other such issues.

### A basic streaming setup with VDO.Ninja as a remote camera

#### VDO.Ninja to OBS Studio

1. Use VDO.Ninja to capture your phone's camera feed.
2. Add the VDO.Ninja source to OBS Studio as a browser source.

#### OBS Studio to Streaming Platforms

1. Set up your scene in OBS Studio, incorporating the VDO.Ninja feed and any other sources.
2. Configure output settings based on your hardware capabilities and target platforms.

### Hardware Encoding Options

* NVIDIA NVENC: Available on GTX 10 series and newer
* AMD AMF: Available on RX 400 series and newer
* Intel Quick Sync: Available on most Intel CPUs with integrated graphics

### Multi-Platform Streaming Options

#### Local Solutions

1. OBS Studio with Multiple Outputs:
   * Use the "Multiple RTMP Outputs" plugin for OBS Studio.
   * Configure separate outputs for each platform (Kick, Twitch, YouTube).
2. Restream.io OBS Plugin:
   * Install the Restream.io plugin for OBS Studio.
   * Configure your Restream account with your target platforms.

#### Cloud-Hosted Solutions

1. Restream.io:
   * Stream to Restream's servers, which then distribute to multiple platforms.
   * Reduces local hardware requirements but may introduce slight delay.
2. Castr.io:
   * Another cloud-based multi-streaming service.
   * Offers low-latency options and analytics.

### Quality Considerations

* Start with 720p at 30 fps for a balance of quality and performance.
* Increase to 1080p at 60 fps if your hardware and internet connection can handle it.
* Consider lowering the quality if streaming to multiple platforms simultaneously from a local setup.

### Optimizing Performance

1. Use hardware encoding (NVENC, AMF, or QuickSync) when available.
2. Close unnecessary background applications.
3. Monitor CPU and GPU usage during streams to identify bottlenecks.
4. Consider a dedicated streaming PC for high-quality, multi-platform setups.

### Conclusion

The exact requirements will depend on your specific use case, desired quality, and number of platforms. Start with the recommended specifications and adjust based on your experience and needs. Always test your setup thoroughly before going live.
