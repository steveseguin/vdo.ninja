---
description: Audio Troubleshooting Guide for VDO.Ninja
---

# Audio Clicking / Popping

## Common Issues and Solutions

### Bluetooth Microphone Clicking/Popping

Bluetooth microphones can cause clicking or popping sounds. Consider using a wired microphone for better reliability.

### Sample Rate Mismatch

VDO.Ninja uses 48kHz audio (48000hz). To ensure maximum compatibility:

* If different sample rates are used, conversion may cause issues in rare situations.

#### High Sample Rate Devices

Devices like FiiO DAC can sometimes have very high audio sample rates, potentially causing buffer underruns and clicking problems.

**Recommended Audio Settings:**

* Set playback audio device and microphone capture device to 48000hz.
* Use no more than 24-bit audio depth.
* Disable any Audio Enhancements in your audio drivers
* Ensure to only use mono or stereo audio with your devices; surround can cause issues.
* Adjust these settings in Windows audio settings.

### Buffer Size Issues

* Increase audio buffer packet sizes for any  virtual audio cables or pro audio gear.
* Small audio buffers on mic preamps or virtual audio cables can lead to clicking or distortion.

### System Overload

* Restart OBS or address heavy CPU load to prevent buffer underruns.
* Ensure the computer isn't running near 100% load.
* Consider running OBS Studio in admin mode.
* Consider reducing video resolution and bitrate to free up CPU resources for audio processing.

### OBS Studio Issues

* Restarting OBS or addressing heavy CPU load may also help prevent buffer underruns, which sometimes appear in the OBS logs as a max buffer reached error.
* Make sure the computer isn't running near 100% load to ensure it's not just overloaded.
  * Do not rely on the OBS CPU usage value, but instead use Windows Task Manager to judge CPU usage
* Consider running OBS Studio in Administrator mode, if on Windows

### Surround Sound Headphones

Some surround sound headphones (e.g., Logitech, Corsair) can cause audio problems:

* Symptoms: robotic noises, distortion
* Solutions:
  * Disable surround sound / DTX mode
  * Disable Enhanced Audio settings in your Windows audio driver&#x20;

### MacOS-Specific Issues

Ensure your Mac is plugged into a power outlet, not running on battery power.

* If an older Macbook, 2016-era for example, overheating is very likely.
* Consider having the guest join with `&meshcast&q=2`, to reduce CPU load,&#x20;

### Network-Related Issues

#### Wi-Fi vs. Ethernet

* Avoid using Wi-Fi for streaming high-quality music.
* Use wired Ethernet connections on both ends to prevent packet loss and clipping.
  * Sometimes changing Ethernet cables can help, or actually even switching to WiFi oddly
* Using cellular (tethered / hotspot), might validate if a network issue

#### Bandwidth Usage

* Keep bandwidth usage below 80% of total upload capacity.
* Using 100% of bandwidth can cause packet stalling and audio clicking.
* https://vdo.ninja/speedtest can help you judge your max bandwidth

#### Packet Loss Solutions

1. Enable TCP transfer:
   * For WHIP/WHEP services, configure to use TCP instead of UDP.
   * Use a VPN service like Speedify.com with TCP transfer mode.
   * For VDO.Ninja, add `&relay&tcp` to the publishing link.
2. Use a TURN relay server in TCP mode:
   * Add `&relay&tcp` to the VDO.Ninja publishing link. Example: `https://vdo.ninja/?webcam&relay&tcp`
3. Enable RED audio mode:
   * Add to `&audiocodec=red` the viewer-side links
   * This will switch from OPUS Forward Error Correcting to OPUS Redundancy mode

### Additional Troubleshooting Steps

#### Audio Processing tweaks

Try adding these URL parameters to viewer and sender links:

* `&noaudioprocessing`
  * This disables web-audio nodes, which disabling will break some functionality of VDO.Ninja
* `&samplerate=48000`
* `&micsamplerate=48000`

#### Further Resources

For issues with audio distortion or robotic voices, [you can see this article.](robotic-audio.md)\
