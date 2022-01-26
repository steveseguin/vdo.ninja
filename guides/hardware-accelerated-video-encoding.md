---
description: Typically only supported with H264 video and often hit and miss
---

# Hardware-accelerated video encoding

Hardware-accelerated video encoding is a tricky topic; it can sometimes work, but when it does, it doesn't always work as hoped.

It generally only works with H264 video, but it may work with other codecs in rare cases.

On a Windows PC, a Chromium-based browser offers your best chance of it working. Every month it seems the support for hardware encoding improves, which is great. The viewer just needs to request H264 video from your computer for it to have a chance of working. `&codec=h264`

If it works, in the video stats window (CTRL + Click), you'll see the video codec type to be listed as External Encoder, if the hardware acceleration is working. CPU load may not decrease always, and there isn't an easy way to tell which encoder is being used, but if it says the codec is h264, then it's likely still using just software.\


![Sample of the H264 Hardware Encoder working with VDO.Ninja](<../.gitbook/assets/image (17).png>)

Despite software using a lot of CPU, it offers better compatibility, fewer glitches, and technically can handle dozens of video streams at a time if you CPU is fast enough. Hardware however can be finicky, where glitching is common and more often than not, a hardware encoder can only support three video encoding sessions at a time.

On iOS, the h264 encoders can only support 720p30, while the VP8 software encoder on iOS can support 1080p.&#x20;

On the Google Pixel the H264 encoder will glitch like crazy when used in Portrait mode, however it's glitch free when using the VP9 codec via software encoding.

If a director, choosing to publish video to your group with H264 might reduce some CPU load, but if using an Nvidia graphics card, you may end up forfeiting your ability to use NVenc encoding for RTMP or MKV file recording, since Nvidia only offers typically three encoders.

VP9 often offers better video quality and compression, especially for screen sharing, where H264 is typically inefficient and blocky in comparison. If using a CDN-service like meshcast.io, where a server redistributes the video to a large audience, H264 is highly compatible with most viewers, however due to its low compression, it costs more to host via a CDN and offers lower flexibility for advanced streaming options.

On the bright side, H264 is supported well on macOS, and H264 in OBS for PC offers lower packet-loss-induced "rainbow puke" than the VP8 codec.

### Embedded and Linux hardware-encoding support

If you're comfortable with Linux, basic publishing into VDO.Ninja is available using GStreamer and Python. The project is located here: [https://github.com/steveseguin/raspberry\_ninja/](https://github.com/steveseguin/raspberry\_ninja/)

Hardware encoding with multiple viewer per encoded stream is supported with this option, although features are very limited.  It is not for the faint of heart; generally this approach is still reserved for enthusiastic and developers.

Code and quick start deployment images are available for the Raspberry Pi and Nvidia Jetson embedded development boards, along with hardware-encoding support for those platforms. &#x20;

Other Linux systems are support with the provided code, but it is up to you to ensure the hardware driver and configuration is setup correctly in those cases.

The project will hopefully keep expanding, to include more devices and operating systems,



