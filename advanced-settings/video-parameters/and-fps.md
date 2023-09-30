---
description: Sets the target frame rate of the video in frames per second
---

# \&fps

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&framerate`
* `&fr`

## Options

Example: `&fps=60`

| Value                         | Description                    |
| ----------------------------- | ------------------------------ |
| (some positive integer value) | Frame rate (frames per second) |

## Details

`&fps` specifies a target frame rate for the video capture, in frames per second; it is specified on the sender's side. The actual frame rate that's encoded and sent to the viewers may be less than the captured frame rate, sometimes quite a bit lower.

In most cases, if the target captured frame rate isn't supported, VDO.Ninja will throw an error. As a result, \&fps is considered pretty strict and isn't recommended for most normal use cases.&#x20;

{% hint style="danger" %}
If the camera cannot support the targetted frame rate, **it will likely fail**. Use [`&maxframerate`](../../source-settings/and-maxframerate.md) instead if you are okay with the system to fallback onto a different frame rate, as it is less strict compared to \&fps.
{% endhint %}

Limiting the frame rate can reduce the CPU load and the bandwidth, as the encoded video frame rate will try to match the capture the captured frame rate. The higher the encoded frame rate, the more CPU is typically used. 30-fps is fairly standard, although VDO.Ninja targets 60-fps by default.

You can change the frame rate dynamically, as the sender, via the settings -> video options; if your browser and device supports it that is. The viewer cannot change or request a specific frame rate, but they can specify \&contenthint, which indicates whether they prefer higher resolution vs higher frame rates.\
\
\&codec=av1 on the viewer side may achieve more stable encoded frame rates than \&codec=h264 or \&codec=vp8, which are normally the defaults.  Higher bitrates and more stable network conditions can also help ensure more stable frame rates of the actually streamed video. The encoded frame rate is often a bit less than what is captured, especially when dealing with packet loss.

Unless using \&chunked mode or a WHIP/WHEP source, it generally isn't possible to force a specific encoded frame rate.  The system will try to keep the frame rate that's encoded and sent close to the captured frame rate, but it may drop due to packet loss, CPU limitations, or during moments of insufficient bitrate.

If screen sharing, window, vs tab, vs display capture methods can result in different max frame rates. Refer to the screen sharing section for details, but consider experimenting with different methods and browsers to find something that works for you. If screen sharing a game, consider setting the bitrate to at least 12- to 20-mbps, to keep the encoded frame rates steady.

#### Compatibility and flicker with 24, 25, 50, and 144-hz frame rates.

24-fps capture devices may fail, so it is recommended to target 30- or 60-fps is possible. If in the UK or a country that has 50-hz lights or displays, you may wish to capture at 25-fps or 50-fps to avoid flicker caused by a mismatch between your display and the lights in the room. 30-fps or 60-fps is pretty standard for modern online video though.

If your display is set to 144-hz or some other odd frame rate, it is suggested to set your display to 120-hz or some multiple of 25- or 30-hz, depending on your location, to also avoid flicker with the camera's capture rate.

#### Higher than 60-fps, such as 120-fps

Capturing video higher than 60-fps, such as 120-fps, is supported in certain situations, such as if screen sharing an entire display that has higher 120-hz set. Normally however, the video encoding is limited to 60-fps max, so capturing at a higher frame rate doesn't make sense.

If using \&chunked mode on the sender's link however, chunked mode supports higher than 60-fps encoding, such as 120-fps.  Chunked mode is considered an experimental option though, but it has been tested between two Windows 11 systems on a LAN running with Chrome.

Raspberry.Ninja or using a remote WHIP/WHEP stream as a source may also unlock the option for higher than 60-fps streaming, but this isn't a suggested approach to the problem.

## Related

{% content-ref url="../../source-settings/and-maxframerate.md" %}
[and-maxframerate.md](../../source-settings/and-maxframerate.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/screensharefps.md" %}
[screensharefps.md](../../source-settings/screensharefps.md)
{% endcontent-ref %}

{% content-ref url="and-contenthint.md" %}
[and-contenthint.md](and-contenthint.md)
{% endcontent-ref %}
