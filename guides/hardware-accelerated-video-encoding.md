---
description: Typically only supported with H264 video and often hit and miss
---

# Hardware-accelerated video encoding

Hardware-accelerated video encoding is a tricky topic; it can sometimes work, but when it does, it doesn't always work as hoped.

It generally only works with H264 video, but it may work with other codecs in rare cases.

On a Windows PC, a Chromium-based browser offers your best chance of it working. Every month it seems the support for hardware encoding improves, which is great. The viewer just needs to request H264 video from your computer for it to have a chance of working. [`&codec=h264`](../advanced-settings/view-parameters/codec.md)

If it works, in the video stats window (`CTRL + Click`), you'll see the video codec type to be listed as External Encoder, if the hardware acceleration is working. CPU load may not decrease always, and there isn't an easy way to tell which encoder is being used, but if it says the codec is `h264`, then it's likely still using just software.\


![Sample of the H264 Hardware Encoder working with VDO.Ninja](<../.gitbook/assets/image (17) (1).png>)

Despite software using a lot of CPU, it offers better compatibility, fewer glitches, and technically can still handle dozens of video streams at a time if you CPU is fast enough. Hardware however can be finicky, where glitching is common and a hardware encoder typically can only support three video encoding sessions at a time.

What's really strange about hardware encoding on a PC is that it may actually use MORE CPU than the software-based openH264 alternative. If your goal is to save CPU power, a hardware encoder may just introduce more problems and offer no benefit at all; at least if encoding with a PC.&#x20;

You can specify whether to use software or hardware H264 by changing the H264 profile ID; this can be specified, for example, using `&h264profile=42e01f`. `42e01f` should trigger the OpenH264 software encoder, if available.&#x20;

AMD systems, and some Intel systems, the default H264 hardware encoder will limit bitrates. Using VP8 or a software-based H264 encoder could allow for higher bitrates. The software VP8 encoder does seem to use more CPU than the H264 encoders, but it often is more stable, especially for screen shares.

On a macOS system, Chrome may drop frame rates suddenly when using the H264 encoder.&#x20;

On iOS, the H264 encoders can only support 720p30, while the VP8 software encoder on iOS can support 1080p. (This recently changed with the iOS \~15; it can now support 1080p30 with H264, but your phone may get very hot, so I am unsure if its actually hardware-accelerated).

On the Google Pixel the H264/VP8 encoder will glitch like crazy when used in Portrait mode, however it's glitch free when using the VP9 codec via software encoding.

Many Android phones may not support H264 encoding in Chrome; this seems to vary based on the browser version, device chipset, and other factors. Trying to force H264 with such incompatible devices might result in no video, as the browser isn't always smart enough to know it isn't working. Chrome on Android doesn't seem to have a software-based H264 encoder.

If a director, choosing to publish video to your group with H264 might reduce some CPU load, but if using an Nvidia graphics card, you may end up forfeiting your ability to use NVenc encoding for RTMP or MKV file recording, since Nvidia only offers typically three encoders. You can unlock this limit, but the benefits of using NVenc with VDO.Ninja often provides no benefits it seems over a software H264 option.

If using a CDN-service like meshcast.io, where a server redistributes the video to a large audience, H264 is highly compatible with most viewers, but this is only true for the OpenH264 profile ID `42e01f` of H264. Hardware-encoded version of H264 may not be compatible with all browsers, such as with Safari viewers, so its not advised.

OperaGX tends to have issues with H264 encoding.

On the bright side, H264 is supported well on macOS, and it seems to use less CPU to decode than VP8. H264 on OBS 27.1 and older (for PC) offers lower packet-loss-induced "rainbow puke" than the VP8 codec, but this isn't a factor anymore with OBS 27.2 and newer. On PC, VP8 and H264 seem to use about the same CPU to decode in OBS. I'd advise you to do your own testing though.

### Embedded and Linux hardware-encoding support

If you're comfortable with Linux, basic publishing into VDO.Ninja is available using GStreamer and Python. The project is located here: [https://github.com/steveseguin/raspberry\_ninja/](https://github.com/steveseguin/raspberry\_ninja/)

Hardware encoding with multiple viewer per encoded stream is supported with this option, although features are limited. It is not for the faint of heart; generally this approach is still reserved for hobbyists, enthusiasts, and developers. A Raspberry Pi can publish 1080p30 to VDO.Ninja, and supports HDMI connected cameras; at least when using this project's code.

Code and quick start deployment images are available for the Raspberry Pi and Nvidia Jetson embedded development boards, along with hardware-encoding support for those platforms.

Other Linux systems are support with the provided code, but it is up to you to ensure the hardware driver and configuration is setup correctly in those cases.

The project will hopefully keep expanding, to include more devices and operating systems.
