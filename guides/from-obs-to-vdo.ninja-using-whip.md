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

Remember to test your setup before any important broadcasts to ensure everything works smoothly.\


{% embed url="https://www.youtube.com/watch?v=ynSOE2d4Z9Y" %}

Related WHIP videos:

{% embed url="https://www.youtube.com/watch?v=_RHBsAJmfGs" %}



