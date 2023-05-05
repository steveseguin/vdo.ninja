---
description: Newer iOS devices can support 1080p60 output in some cases
---

# How to get iPhones to output 1080p Videos

iPhones 12 and newer, running higher than iOS 16.0, and with the **rear** camera selected, can access 1080p60 video output in VDO.Ninja.  This was tested last with Safari on an iPhone 12 Pro, running iOS 16.2 on VDO.Ninja v23. (May 5th 2023)\
\
The actual frame rate of the video that the viewer receives may be lower than the 60 or 30-fps capture rate. It may end up ranging from 20-fps to 45-fps. As a result, limiting the capture frame rate of the device to 30-fps, such as with \&mfr=30, may help offer more stable frame rates, even if limited to 30-fps. So, 1080p30 may be preferable to 1080p60 in some cases.\
\
Keep in mind, high motion and highly detailed scenes may also require higher bitrates; the default VDO.Ninja encoding bitrate is just barely suitable for stationary talking heads at 1080p60, but increasing the video bitrate to 4000-kbps, up to as high as 20000-kbps, may help.\
\
1080p60 seems to work with H264 video encoding (default) and even VP9 video encoding, if enabled. On a side note, H265 (HEVC) may work Safari to Safari, but it is untested at present and may only work in highly controlled situations. The state of AV1 support though is quickly changing, and may be supported by iPhones in the near future. Both these newer codec options may be quite useful for when 4K streaming becomes more common.\


As for older devices, iPhone 11 and older, they may only be able to achieve 1080p30 or 720p60 capture, assuming they are running iOS 16 and up. The front and rear cameras may achieve different frame rates or resolutions, depending on the device. You may need to experiment to find what works best for you specific iOS device, though such as if using an iPhone SE or iPad.\


If selecting 1080p60, but getting 720p60, that may be the result of the device defaulting to 720p60 rather than 1080p30.  Using `&mfr=30&q=0`, you might be able to to achieve 1080p30 instead.\
\
For example, front facing cameras on an iPhone 6S might be able to achieve 720p60, but the rear camera may achieve 1080p30 max.  Trying to force 1080p60 on the iPhone 6S may result in a lower resolution being actually selected, or an error message may appear.

\
Older versions of VDO.Ninja (v22 and older), and some specific iOS device models, may need some custom URL tweaking to get the maximum available resolution / frame rate.&#x20;



### For devices running older iOS versions, see below:

\
You can force 1080p on many iPhones, but you then need to use [`&codec=vp8`](../advanced-settings/view-parameters/codec.md) also then on older iOS versions.

for example:

[`https://vdo.ninja/?push=streamid&width=1920&height=1080`](https://vdo.ninja/?push=streamid\&width=1920\&height=1080)

and:

[`https://vdo.ninja/?view=streamid&codec=vp8&videobitrate=6000`](https://vdo.ninja/?view=streamid\&codec=vp8\&videobitrate=6000)

Older iOS versions do not support h264 at resolutions higher than 720p30.

If you use VP8 though, you will be using the software-based encoder, which will make the iPhone pretty warm/hot. It also only works only on newer iOS versions (iOS 14, for example).

In newer versions of iOS , it's possible to do 1080p60 with H264 encoding, but only under specific circumstances.
