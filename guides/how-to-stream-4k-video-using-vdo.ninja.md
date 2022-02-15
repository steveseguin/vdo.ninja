# Stream 4K video using VDO.Ninja

By default, VDO.Ninja tries to select 720p (1280x720 @ 60 fps) for both screen capture and webcam modes. This is considered [`&quality=1`](../advanced-settings/video-parameters/quality.md).\
\
[`&quality=0`](../advanced-settings/video-parameters/quality.md) (High Resolution) tries to do 1080p (1920x1080p60), while [`&quality=2`](../advanced-settings/video-parameters/quality.md) tries to do 360p (640x360p30).

By “trying”, I mean that if the resolution is not available, VDO.Ninja defaults to another resolution that the camera supports instead. This way, no errors are thrown and a compatible stream is sent, even if it’s not exactly what you might have desired.

VDO.Ninja is capable of doing higher resolutions and custom resolutions however; you just need to manually specify the resolution you want. When you manually specify a resolution, if it doesn’t work, an error is thrown.\
\
While I could make a selectable option for 4K in the user interface, another problem with 4K is that it requires a LOT of CPU power to encode. Most users will always select the highest resolution allowed, not understanding that it might actually be a bad idea. Maxing out your CPU can actually result in worse quality with lower frame rates than selecting a lower, safer, resolution.

That all said, you can give “4K” a go by adding `&width=3840&height=2160` to the invite link.

For example then, [https://VDO.ninja/?push=inviteGuest123\&width=3840\&height=2160](https://obs.ninja/?push=inviteGuest123\&width=3840\&height=2160)

If the guest does not support 4K, this will give an error to the guest, stating that the video device is over-constrained.&#x20;

The default frame rate is 60-fps, although if their device does not support that, it will use a lower support frame rate. If you manually specify a frame rate, and the camera or display does not support it, it will also give an error.\
\
If streaming from a smartphone, not all phones can do 4K; my old LG V30 could do 4K30 via [VDO.Ninja](https://vdo.ninja), but my Pixel 4a seems stuck at 1080p30. Just because you can record to disk at 4K does not mean the manufacture has added support for 4K streaming via the browser.

Samsung devices can sometimes use the built in Samsung Internet browser instead of Chrome to get access to higher resolutions and frame rates; 1080p60 for example with new flagship devices. As for Apple devices, you'll need to switch to VP8 as a codec to achieve 1080p, as they default to 720p otherwise.&#x20;

Next, while you might have selected 4K, with the exception of static video screen shares, you cannot transfer 4K video with the default video bitrates set. For action, you will need closer to 40-mbps video bitrates set on the viewer’s end. For talking head videos, you will want over 10-mbps and possibly even more. Without a high enough bitrate set, the video will not stream at 4K and more than likely not maintain 60-fps.

As a result, to successfully stream 4K video, you generally need a computer system with 8 real CPU cores or more, running at 3.6ghz or higher. A modern AMD 3900X-series CPU or Intel 9900K CPU are ideal for this task, but a quad-core laptop will not be. You might be able to get away with lesser bitrates and lesser CPU requirements if just screen-sharing text, but it still is not for the faint of heart.&#x20;

We've successfully streamed 4K50 over 5G cellular Internet at 65-mbps using a Macbook Air M1 and VDO.Ninja.
