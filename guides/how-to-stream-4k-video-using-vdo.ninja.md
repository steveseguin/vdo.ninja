# How to stream 4K video using VDO.Ninja

{% hint style="warning" %}
Sending a 4K video feed with VDO.Ninja is very CPU intensive. Be prepared to use all of 8 real cpu cores (not threads).
{% endhint %}

## How VDO.Ninja handles video quality

VDO.Ninja has 3 predefined [`&quality`](../source-settings/quality.md) levels:

* `&quality=0` tries to do 1080p (1920x1080 @ 60fps)
* `&quality=1` is the default. It tries to select 720p (1280x720 @ 30fps ) for both screen capture and webcam.
* `&quality=2` tries to do 360p (640x360 @ 30 fps).

By “trying”, I mean that if the resolution is not available, VDO.Ninja defaults to another resolution that the camera supports instead. This way, no errors are thrown and a compatible stream is sent, even if it’s not exactly what you might have desired.

VDO.Ninja is however capable of doing higher resolutions and custom resolutions however; you just need to manually specify the resolution you want. When you manually specify a resolution, if it doesn’t work, an error is thrown.

While I could make a selectable option for 4K in the user interface, another problem with 4K is that it requires a LOT of CPU power to encode. Most users will always select the highest resolution allowed, not understanding that it might actually be a bad idea. Maxing out your CPU can actually result in worse quality with lower frame rates than selecting a lower, safer, resolution.

## Pushing 4K resolution

![4k comparison chart with lesser resolutions](../.gitbook/assets/4KComparison)

That all said, you can give “4K” a go by adding [`&width=3840`](../source-settings/and-width.md)``[`&height=2160`](../source-settings/and-height.md) to the invite link.

For example then, [https://vdo.ninja/?push=inviteGuest123\&width=3840\&height=2160](https://obs.ninja/?push=inviteGuest123\&width=3840\&height=2160)

If the guest does not support 4K, this will give an error to the guest, stating that the video device is over-constrained.&#x20;

The default frame rate is 60-fps, although if their device does not support that, it will use a lower support frame rate. If you manually specify a frame rate, and the camera or display does not support it, it will also give an error.

If streaming from a smartphone, not all phones can do 4K; my old LG V30 could do 4K30 via [VDO.Ninja](https://vdo.ninja), but my Pixel 4a seems stuck at 1080p30. Just because you can record to disk at 4K does not mean the manufacture has added support for 4K streaming via the browser.

Samsung devices can sometimes use the built in Samsung Internet browser instead of Chrome to get access to higher resolutions and frame rates; 1080p60 for example with new flagship devices. As for Apple devices, you'll need to switch to VP8 as a codec to achieve 1080p, as they default to 720p otherwise.&#x20;

## What about the bitrate?

Next, while you might have selected 4K, with the exception of static video screen shares, you cannot transfer 4K video with the default video bitrates set. For action, you will need closer to 40-mbps video bitrates set on the viewer’s end. For talking head videos, you will want over 10-mbps and possibly even more. Without a high enough bitrate set, the video will not stream at 4K and more than likely not maintain 60-fps.

To set a target bitrate add [`&videobitrate=20000`](../advanced-settings/view-parameters/bitrate.md) for 20-mbps for example. This goes on the viewer link.

## Performance issues

As a result, to successfully stream 4K video, you generally need a computer system with 8 real CPU cores or more, running at 3.6ghz or higher. A modern AMD 3900X-series CPU or Intel 9900K CPU are ideal for this task, but a quad-core laptop will not be. You might be able to get away with lesser bitrates and lesser CPU requirements if just screen-sharing text, but it still is not for the faint of heart.

Lastly, macOS users may find that 4K is simply not possible or very difficult. If you do manage to get it working, it might only operate at 5-fps or so. I don’t quite know why this is, but if you intend on sharing 4K video, you might be better off using a Windows PC. It seems to perform better.

We've successfully streamed 4K50 over 5G cellular Internet at 65-mbps using a Macbook Air M1 and VDO.Ninja.
