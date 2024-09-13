---
description: Publishing from OBS Studio to VDO.Ninja using WHIP
---

# From OBS to VDO.Ninja using WHIP

### Prerequisites

* OBS Studio (version 29 or later)
* A stable internet connection
* Access to VDO.Ninja

### Steps

1. **Prepare VDO.Ninja**
   * Make up a unique stream token (e.g., `STREAMTOKEN123`)
   * Create your VDO.Ninja link: `https://vdo.ninja/?hidemenu&whip=STREAMTOKEN123`
   * Open this link in a web browser on the receiving end
2. **Configure OBS Studio**
   * Open OBS Studio
   * Go to Settings > Stream
   * Select "WHIP" as the service
   * For the server, enter: `https://whip.vdo.ninja`
   * For the Stream Key, enter your unique stream token (STREAMTOKEN123)
3. **Choose Encoding Settings**
   * In OBS, go to Settings > Output
   * Select your preferred encoder:
     * Software (x264) for H.264
     * NVIDIA NVENC for H.264 (if you have an NVIDIA GPU)
     * AMD AMF for H.264 (if you have an AMD GPU)
     * AV1 (if supported by your hardware and OBS version)
   * Set your desired bitrate (e.g., 2500-6000 Kbps for 1080p)
4. **Go Live**
   * In OBS, click "Start Streaming"
   * The stream should appear automatically in the opened VDO.Ninja window

### Encoder options that can offer smooth playback

Some H264 settings that have reported offered good results are the following:

* Rate Control: CRF
* CRF: 23
* Keyframe Interval: 1s
* Preset: Veryfast
* Profile: High
* Tune: Fastdecode (required for WebRTC playback)
* x264 Options: bframes=0 (required for WebRTC playback)

In some cases, adding [`&buffer=2500`](https://docs.vdo.ninja/advanced-settings/video-parameters/buffer) to the VDO.Ninja view link can further help reduce any lost of skipped frames, but at the cost of increased latency.

### Additional Notes

* **Codec Choice**:
  * H.264 is widely supported and offers good quality/compression balance
  * AV1 provides better compression but requires more processing power and may not be supported on all devices
* **Network Considerations**:
  * OBS Studio's WHIP implementation doesn't support STUN (NAT traversal)
  * The receiving computer must be on the same LAN or accessible via a public IP without firewall restrictions
* **Troubleshooting**:
  * If the stream doesn't appear, check your firewall settings
  * Ensure both OBS and VDO.Ninja are using the same stream token
  * Verify that your internet connection is stable and has sufficient upload bandwidth
* **Quality vs. Performance**:
  * Lower resolutions and bitrates will reduce latency and improve stability
  * Higher resolutions and bitrates will increase quality but may introduce more delay

Remember to test your setup before any important broadcasts to ensure everything works smoothly.

### Alternative browser-free option

If looking for alternatives to publishing into VDO.Ninja, consider checking out [Raspberry.Ninja](https://docs.vdo.ninja/updates/updates-raspberry.ninja) also, which supports a broad range of encoders, including AV1-AOM, Intel QuickSync, Raspberry Pis, Nvidia Jetson, and many other hardware and software options. Playback is smooth, with support for multiple viewers. Runs on most systems, including Linux and _Windows for Linux Subsystem_ (WSL).

{% embed url="https://www.youtube.com/watch?v=ynSOE2d4Z9Y" %}
Demoing OBS to VDO.Ninja via WHIP
{% endembed %}

Related WHIP videos:

{% embed url="https://www.youtube.com/watch?v=_RHBsAJmfGs" %}



