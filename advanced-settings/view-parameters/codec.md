---
description: Sets the codec to encode the video
---

# \&codec

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&codec=h264`

| Value                 | Description                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `h264`                | request the h264 codec                                                                      |
| `vp8`                 | request the VP8 codec                                                                       |
| `vp9`                 | request the VP9 codec                                                                       |
| `av1`                 | request the AV1 codec                                                                       |
| ``[`webp`](webp.md)`` | request the webp codec                                                                      |
| `hardware`            | request the h264 codec and[`&h264profile`](../../newly-added-parameters/and-h264profile.md) |

### Example usage

`https://vdo.ninja/?view=abc123`**`&codec=h264`**\
****\
****`https://vdo.ninja/?room=xxx7654&scene&bitrate=2000`**`&codec=vp9`**\
****\
****The `&codec` parameter is added to the viewer-side; so the [`&view`](view.md) or [`&scene`](scene.md) link.

### **Description**

Video that is captured by a camera is compressed and sent over VDO.Ninja. The default codec is left up to the peer-connection to decide on, where the viewer and the sender agree on what is best automatically.

Normally VP8 is selected, which is an older codec that uses little CPU, but isn't as efficient as some others. Some mobile devices may hardware-encoder VP8, such as Google Pixel phones, but the vast majority will use software (CPU) to encode VP8.

H264 is the second most common codec automatically selected, which is popular with Apple-devices and many Android devices. H264 is commonly hardware-encoded, which \*sometimes\* uses less CPU and battery power, but hardware-encoding is more fickle than software-based encoding.

VP9 and AV1 are more modern codecs, with AV1 only supported by Chromium-based browsers using Version 90 or newer, although. VP9 may not be available on older Apple devices, but is becoming more available. It is not common to find VP9 or AV1 hardware encoded currently.

Hardware-encoding has pros and cons. A device generally has limited hardware-encoders, and they are also normally more problematic, including compatibility issues.

{% hint style="warning" %}
**If running into problems with video distortion, switching the codec to VP9 may resolve the issue, although at the cost of higher-CPU load.**
{% endhint %}

## Details

### **H264**

H264 may offer hardware encoding for better battery life with mobile and embedded devices. In these causes, it is often used automatically by VDO.Ninja. Support for H264 on Android devices is hit and miss though, so if enabling it, be prepared for it to potentially result in no video playback.

iOS devices should generally use H264, but the max resolution supported then is 1280x720p30 with iOS 14 and under. With iOS 15, 1080p30 is supported, but I'm not entirely sure if 1080p30 is hardware-encoded as the phone will get quite warm at that resolution.

macOS systems generally prefer H264 and will sometimes hardware-encode. It seems to use less CPU resources decoding H264 versus other codecs, so give it a go if facing CPU issues on your mac.

As for Windows PCs, if using a Chromium-based browsers (Chrome/Edge), your system may choose to use hardware-encoding when using publishing via a H264. This typically happens at 360p or higher resolutions, but it may not always happen. You can check to see if you are hardware-encoding by checking your video out stats, via `CTRL + Left-Click` on your video: "External Encoder" would likely indicate hardware acceleration of some sort.

If you have an Nvidia graphics card, you may be limited to two or three H264 hardware encoders, which could cause problems if you intend to use NVEnc for RTMP streaming also. AMD hardware encoders may limit bitrate.

On PC, while H264 encoding will use less CPU than other codecs, hardware-encoders may actually use more CPU than the software-based ones.

H264 doesn't seem to offer the picture quality, at least when screen sharing, but it seems more resistant to rainbow puke in OBS 27.1 and older.

Firefox on Apple M1 chips may not support H264. OperaGX may also not support H264.

#### Customizing H264 further

Starting with VDO.Ninja [v20](../../release-notes/v20.md), you can specify the flavour of H264 being used with the [`&h264profile`](../../newly-added-parameters/and-h264profile.md) flag.

Using that parameter without specifying a particular H264 profile ID will trigger the software OpenH264 encoder to be used, blocking any hardware H264 encoder. On Windows, OpenH264 may actually use less CPU than the a hardware encoder and may side step video glitching issues.

Definitely worth trying to use this flag, in combination with `&codec=h264`, if you're looking to inch out every bit of performance, but testing is needed if going this direction.

### **VP8**

VP8 is the default codec selected in most cases, even though Apple devices may default to H264.

OBS on PC does not handle packet loss well when using VP8, while the [Electron Capture](https://github.com/steveseguin/electroncapture) app handles VP8 very well.

iOS devices can stream at 1080p30 or 720p60 when using VP8, but they get warm in doing so.

Google Pixel smartphones may default to VP8, using hardware-encoding, but may also face video distortion with some browsers as a result. Switching to VP9 may fix the issue.

VP8 generally uses more CPU than H264, but not by a lot. Maybe there's a 5 to 15% difference? You may wish to consider using H264 if CPU load is an issue as a result.

VP8 is highly compatible these days between devices and browsers.

### **VP9**

VP9 offers better compression than VP8, but it is also more CPU-intensive to use. It might use 25 to 30% more CPU than H264, but can offer potentially a cleaner image than VP8 or H264, especially with screen-shares.

VP9 seems to reduce the chance of "rainbow puke" video problems in OBS Studio vs VP8.

Do not feel compelled to stream at HD resolutions; even 540p can look good and runs much cooler.

VP9 is often not hardware encoded, so it may solve video distortion issues that persist with H264 or even VP8.

### **AV1**

AV1 is the most advanced codec, but also the most CPU-intensive to use.

Requires Chrome v90 or newer on both publisher and viewer to work. The Electron Capture app 2.6.0 and newer supports AV1, as well. OBS Studio v27.2 and newer \*may\* also support it, but as of the time of this writing, that hasn't been confirmed.

Experimental at this point in time and may not perform well, but if very bandwidth constrained, it is a worthwhile option.

### WEBP

{% content-ref url="webp.md" %}
[webp.md](webp.md)
{% endcontent-ref %}

### HARDWARE

The parameter `&codec=hardware` is Android-specific and is the same as doing `&codec=h264`[`&h264profile`](../../newly-added-parameters/and-h264profile.md), but perhaps easier to remember. Worth trying if your android phone is struggling to publish video at a high enough quality into OBS. I may expand on this feature to be smarter.

## Related

{% content-ref url="../../newly-added-parameters/and-h264profile.md" %}
[and-h264profile.md](../../newly-added-parameters/and-h264profile.md)
{% endcontent-ref %}

{% content-ref url="webp.md" %}
[webp.md](webp.md)
{% endcontent-ref %}

{% content-ref url="../recording-parameters/and-recordcodec.md" %}
[and-recordcodec.md](../recording-parameters/and-recordcodec.md)
{% endcontent-ref %}
