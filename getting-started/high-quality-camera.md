---
description: Some basic options to achieve higher quality video
---

# Even higher quality video

You can customize the capture resolution and playback quality of videos by adding parameters to the VDO.Ninja URL.&#x20;

### Viewer side options

The default video bitrate of most modern browsers is around 2500-kbps, which is okay, but we can achieve higher video quality if we manually set this to something even higher.

[`https://vdo.ninja/?view=streamid&videobitrate=6000`](https://vdo.ninja/?view=streamid\&videobitrate=6000)

You’ll notice that we added [`&videobitrate=6000`](../advanced-settings/video-bitrate-parameters/bitrate.md) to the viewer’s side and not the publishing side. The viewer gets to control the bitrate; every viewer can set their own custom video bitrate in fact. \
\
You can also play with different video codecs; `&codec=av1` is a viewer side option and tends to offer better colors and quality than the default vp8 or h264 codecs, but av1 will use a up a lot more CPU.\
\
Another viewer side option is `&scale=100`, which will disable dynamic fit-to-window scaling optimizations.  This is especially valuable if wanting to downlscale 4K to 1080p video, as otherwise VDO.Ninja would limit the resolution to the size of the OBS Browser source window. It can also help when there is more than one video on screen, but do note that disabling the auto-scale optimizations to achieve better quality will increase the CPU and network load for all parties.\
\
Sometimes adding some sharpness to the video as a digital video effect in OBS can help improve video quality, especially for video containing fine-text, like a screen share or video overlay. By default text might look a bit soft with VDO.Ninja, and sharpening can resolve it.\
<img src="../.gitbook/assets/image (10).png" alt="" data-size="original">![](<../.gitbook/assets/image (4).png>)\


### Sender side options

On the publishing side, the _default_ target resolution is already 1280x720 @ 60-fps, but we can set this higher by adding [`&quality=0`](../advanced-settings/video-parameters/and-quality.md) to the push link. This will have the publisher’s side try to make available a 1920x1080 video stream, if their camera or video device supports it. If not, it will fall back to 1280x720p. `https://vdo.ninja/?push=streamid&quality=0`

For 1080p60 gaming, you’ll want to set the video bitrate to 12000-kbps or higher, as lower bitrates might cause the frame rate to be quite low otherwise. Otherwise, for talking head-type videos, the default video bitrate is often going to be adequate.&#x20;

Higher resolution streams, especially 1080p60, requires a LOT of CPU power. Having 4-CPU cores is generally recommend for 1080p60 video streams, and 6 to 8 cores are recommended if you are intending to game at the same time.  \
\
Up to 4K or beyond is possible as well, but you'll need to manually specify the capture resolution with `&width` and `&height` instead, and it will require significantly more cpu and network bandwidth than even 1080p.  You can also gently ask for a specific frame rate with \&maxframerate=60, which is sometimes needed with certain iPhones to force 60-fps at 1080p.

### Connection Quality

\
As VDO.Ninja dynamically also adjusts video resolution and bitrate to match the available Internet connection bandwidth availability, sometimes 1280x720 video resolutions won’t be maintainable. You can run the [https://vdo.ninja/speedtest](https://vdo.ninja/speedtest) to see if you are able to hit at least 2000-kbps, which is about what is needed for smooth 720p video.

Using Ethernet instead of Wi-Fi will also help to ensure the quality and frame loss at these higher resolutions is obtainable. At higher resolutions, frame rates are more likely to be unstable and the resolution might be throttled to something lower. Packet loss will impact the quality of a video stream quite a bit, and in rare cases, you may need to use \&relay or \&meshcast mode to assist in overcoming network throttling or routing issues.

