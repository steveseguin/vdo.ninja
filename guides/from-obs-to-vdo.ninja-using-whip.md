---
description: Publishing from OBS Studio to VDO.Ninja using WHIP
---

# From OBS to VDO.Ninja using WHIP

OBS Studio v30 now has WHIP output support, which means that you can stream directly to VDO.Ninja without a browser or other software.\
\
While there are a few serious limitations with OBS's current WHIP implementation, when used with VDO.Ninja it still offers a great way to stream from one computer to another, on the same LAN, while minimizing CPU overhead and latency.

Prerequisites

* OBS Studio (version 30 or later)
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

{% hint style="info" %}
The stream token you give to OBS is the stream ID you specified in VDO.Ninja.
{% endhint %}

<figure><img src="../.gitbook/assets/image (250).png" alt=""><figcaption><p>Example setup for OBS to VDO</p></figcaption></figure>

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

### Streaming WHIP over the Internet or to more than one viewer

I offer [https://Meshcast.io](https://meshcast.io), for free, which supports WHIP input and can broadcast to dozens of viewers online.\
\
There's also MediaMTX, which is a self-hosted broadcasting server option that VDO.Ninja supports. Deeper integration with MediaMTX is being added to VDO.Ninja all the time.

In the future, OBS should be able to support 1 to 1 over the Internet, despite firewalls, with VDO.Ninja, in a peer to peer fashion.  This could be added at any time, so we'll wait and see; for now to stream over the Internet peer to peer, you need to enable port forwarding / DMZ / tunneling to have it work.

### Alternative browser-free option

If looking for alternatives to publishing into VDO.Ninja, consider checking out [Raspberry.Ninja](https://docs.vdo.ninja/updates/updates-raspberry.ninja) also, which supports a broad range of encoders, including AV1-AOM, Intel QuickSync, Raspberry Pis, Nvidia Jetson, and many other hardware and software options. Playback is smooth, with support for multiple viewers. Runs on most systems, including Linux and _Windows for Linux Subsystem_ (WSL).

{% embed url="https://www.youtube.com/watch?v=ynSOE2d4Z9Y" %}
Demoing OBS to VDO.Ninja via WHIP
{% endembed %}

Related WHIP videos:

{% embed url="https://www.youtube.com/watch?v=_RHBsAJmfGs" %}



