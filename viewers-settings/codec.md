---
description: Sets the codec to encode the video.
---

# \&codec

## Options

| Value | Description             |
| ----- | ----------------------- |
| h264  | request the h264 codec  |
| vp8   | request the VP8 codec   |
| vp9   | request the VP9 codec   |
| av1   | request the AV1 codec   |

### Example usage

`https://vdo.ninja/?view=abc123`**`&codec=h264`**\
****\
****`https://vdo.ninja/?room=xxx7654&scene=1&bitrate=2000`**`&codec=vp9`**\
****\
****The **\&codec** parameter is added to the viewer-side; so the \&view or \&scene link. &#x20;



### **Description**

Video that is captured by a camera is compressed and sent over VDO.Ninja. The default codec is left up to the peer-connection to decide on, where the viewer and the sender agree on what is best automatically.

Normally VP8 is selected, which is an older codec that uses little CPU, but isn't as efficient as some others. Some mobile devices may hardware-encoder VP8, such as Google Pixel phones, but the vast majority will use software (CPU) to encode VP8.

H264 is the second most common codec automatically selected, which is popular with Apple-devices and many Android devices.  H264 is commonly hardware-encoded, which uses less CPU and battery power, but hardware-encoding is more fickle than software-based encoding.

VP9 and AV1 are more modern codecs, with AV1 only support by Chromium-based browsers using Version 90 or newer, although. VP9 may not be available on older Apple devices, but is becoming more available. It is not common to find VP9 or AV1 hardware encoded currently.

Hardware-encoding has pros and cons. A device generally has limited hardware-encoders, and they are also normally more problematic.&#x20;

**If running into problems with video distortion, switching the codec to VP9 may resolve the issue, although at the cost of higher-CPU load.**\
****

## Details

### **H264**

H264 may offer hardware encoding for better battery life with mobile and embedded devices. In these causes, it is often used automatically by VDO.Ninja.

iOS devices should generally use H264, but the max resolution supported then is 1280x720p30 with iOS 14 and under. With iOS 15, 1080p30 is supported.&#x20;

macOS systems generally prefer H264 and will sometimes hardware-encode.

As for Windows PCs, if using a Chromium-based browsers (Chrome/Edge), your system may choose to use hardware-encoding when using publishing via a H264. This typically happens at 360p or higher resolutions, but it may not always happen.  You can check to see if you are hardware-encoding by checking your video out stats, via CTRL + Clicking on your video: "External Encoder" would likely indicate hardware acceleration of some sort.\
\
If you have an Nvidia graphics card, you may be limited to two or three H264 hardware encoders, which could cause problems if you intend to use NVEnc for RTMP streaming also.&#x20;

#### Customizing H264 further

Starting with VDO.Ninja v20, you can specify the flavour of H264 being used with the `&h264profile` flag.\
\
Using that parameter without specifying a particular H264 profile ID will trigger the software OpenH264 encoder to be used, blocking any hardware H264 encoder.  On Windows, OpenH264 may actually use less CPU than the a hardware encoder and may side step video glitching issues.&#x20;

Definitely worth trying to use this flag, in combination with \&codec=h264, if you're looking to inch out every bit of performance, but testing is needed if going this direction.

### **VP8**

VP8 is the default codec selected in most cases, even though Apple devices may default to H264.&#x20;

OBS on PC does not handle packet loss well when using VP8, while the [Electron Capture](https://github.com/steveseguin/electroncapture) app handles VP8 very well.

iOS devices can stream at 1080p30 or 720p60 when using VP8, but they get warm in doing so

Google Pixel smartphones may default to VP8, using hardware-encoding, but may also face video distortion with some browsers as a result. Switching to VP9 may fix the issue.

VP8 generally uses more CPU than H264, but not by a lot. Maybe there's a 5 to 15% difference? You may wish to consider using H264 if CPU load is an issue as a result.

### **VP9**

VP9 offers better compression than VP8, but it is also more CPU-intensive to use. It might use 25 to 30% more CPU than H264, but can offer potentially a cleaner image than VP8 or H264, especially with screen-shares.

VP9 seems to reduce the chance of "rainbow puke" video problems in OBS Studio vs VP8

Do not feel compelled to stream at HD resolutions; even 540p can look good and runs much cooler.

VP9 is often not hardware encoded, so it may solve video distortion issues that persist with H264 or even VP8.

### **AV1**

AV1 is the most advanced codec, but also the most CPU-intensive to use.

Requires Chrome v90 or newer on both publisher and viewer to work. The Electron Capture app 2.6.0 and newer supports AV1, as well. OBS Studio v28 may also support it, but as of the time of this writing, that hasn't been released yet.

Experimental at this point in time and may not perform well, but if very bandwidth constrained, it is a worthwhile option.
