---
description: Audio Troubleshooting Guide for VDO.Ninja
---

# Audio Clicking / Popping / Distortion

## Common Issues and Solutions

### OBS Studio related audio issues

There are numerous known causes of audio drop out or audio distortion in OBS. Often it's caused by OBS Studio being throttled by the system, or perhaps a firewall setting is causing network issues. So try the following first, if the issue is OBS specific:

* <mark style="background-color:yellow;">👉 Consider running OBS Studio in</mark> <mark style="background-color:yellow;"></mark><mark style="background-color:yellow;">**Administrator mode,**</mark> <mark style="background-color:yellow;"></mark><mark style="background-color:yellow;">if on Windows  👈</mark>
* Restarting OBS or addressing heavy CPU load may also help prevent buffer underruns, which sometimes appear in the OBS logs as a max buffer reached error.
* Make sure the computer isn't running near 100% load to ensure it's not just overloaded.
  * Do not rely on the OBS CPU usage value, but instead use Windows Task Manager to judge CPU usage
* Try a different version of OBS Studio.
* Perhaps add OBS Studio to the allowed Firewall apps list

<figure><img src="../.gitbook/assets/image (257).png" alt="" width="375"><figcaption><p>Try adding OBS or your Browser to the Firewall allow list</p></figcaption></figure>

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

![](<../.gitbook/assets/image (258).png>)



### Disable surround sound or DTX audio

* You might think you disabled the surround sound on your headphones, but you might only think you did
* Try with a different pair of headphones; something less fancy, if you are using a Bluetooth or Surround sound gaming headset.

### Buffer Size Issues

* Increase audio buffer packet sizes for any  virtual audio cables or pro audio gear.
* Small audio buffers on mic preamps or virtual audio cables can lead to clicking or distortion.

### System Overload

* Restart OBS or address heavy CPU load to prevent buffer underruns.
* Ensure the computer isn't running near 100% load.
* Consider running OBS Studio in admin mode.
* Consider reducing video resolution and bitrate to free up CPU resources for audio processing.

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
   * This asks the browser to negotiate RFC 2198 RED carrying Opus payloads. RED wrapping and Opus in-band FEC are
     different mechanisms; browser negotiation decides what is actually used.

### Meshcast /WHIP / WHEP / Servers

Audio packet loss may occur if broadcasting WebRTC media via an SFU server, where the viewer isn't able to receive the transmitted stream without error or hiccup.\
\
Adding `&buffer=2000` to the viewer's URL might help, trying a different server or lowering the audio/video bitrate could be another option.\
\
OPUS with FEC (error control) common avoid these issues, but if FEC isn't on, or if PCM is used, then then clicking may be a bit expected.

### Additional Troubleshooting Steps

#### Audio Processing tweaks

Try adding these URL parameters to viewer and sender links:

* `&noaudioprocessing`
  * This disables web-audio nodes, which disabling will break some functionality of VDO.Ninja
* `&samplerate=48000`
* `&micsamplerate=48000`

### Disable Hardware Acceleration

While it's an odd ball option, sometimes disabling Hardware Acceleration in OBS or Chrome can fix strange driver or hardware issues.

### Browser / System performance throttling

Rarely, but sometimes audio may glitch of the browser itself is throttling performance. While using the [Electron Capture app](../steves-helper-apps/electron-capture.md) instead of Chrome can minimize the odds of this happening, below are steps that might also help:

* Browser may pause non-visible windows, so you may need to disable this behaviour in your browser.&#x20;
  * To do so, "Disable" the option located at `chrome://flags/#enable-throttle-display-none-and-visibility-hidden-cross-origin-iframes`.&#x20;
  * Also "Disable" the flag `chrome://flags/#calculate-native-win-occlusion`.&#x20;
  * Restart the browser after saving the changes.
* Plug the computer into a power-outlet if using a laptop.
  * Laptops when running on battery power may throttle performance aggressively, so keep your device plugged in.
  * Avoiding being in a low-battery  or power-saving state
* Avoid minimizing any windows.&#x20;
  * Things work best if windows are kept visible and open, but if you need to put them in the background, don't minimize them at least.
  * This isn't normally an issue, but it might be if using digital effects, like a digital zoom or the whiteboard feature
* Browsers may also sometimes stop tabs/windows after an hour of inactivity.&#x20;
  * Disable any option in your browser under `chrome://settings/performance` related to performance throttling or background tabs, such as "Throttle Javascript timers in background".
* You can go to `chrome://discards/` and toggle off "Auto Discardable" on the VDO.NInja or other windows of interest.

![image](https://github.com/user-attachments/assets/692fd148-798e-4cb1-9c09-b667b50a542a)

* Try to keep the VDO.Ninja pages active and if possible, even partially visible on screen.&#x20;
  * If the windows are hidden or minimized, they may stop working if the system is designed to optimize.
* Another option to avoid throttling, if using Windows, is to do Win + Tab, and have two virtual Desktops on your PC.&#x20;
  * Put the chat windows into one virtual desktop, and use OBS in the other.&#x20;
  * Win+Tab can let you switch between desktops/windows.
* You can also try the Electron Capture desktop app, as that has more controls and will avoid common throttling / visibility issues found while using Chrome.

#### Further Resources

For issues with audio distortion or robotic voices, [you can see this article.](robotic-audio-distortion.md)

{% content-ref url="robotic-audio-distortion.md" %}
[robotic-audio-distortion.md](robotic-audio-distortion.md)
{% endcontent-ref %}
