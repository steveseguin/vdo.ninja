---
description: Sets the maximum frame rate of the video in frames per second
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

`&fps` sets the maximum frame rate of the video in frames per second on the publisher side. The actual frame rate could be less. Limiting the frame rate can reduce the CPU load and the bandwidth.

You can change the frame rate dynamically, as the sender, via the settings -> video options, if your browser and device supports it. The viewer cannot change or request a specific frame rate however, but they can specific \&contenthint, indicating that they would prefer detail or motion.\
\
\&codec=av1 on the viewer side may achieve more stable encoded frame rates than \&codec=h264 or \&codec=vp8, which are normally the defaults.  Higher bitrates and more stable network conditions can also help ensure more stable frame rates of the actually streamed video. The encoded frame rate is often a bit less than what is captured, especially when dealing with packet loss.

If screen sharing, window, vs tab, vs display capture methods can result in different max frame rates. Refer to the screen sharing section for details, but consider experimenting with different methods and browsers to find something that works for you. If screen sharing a game, consider setting the bitrate to at least 12- to 20-mbps, to keep the encoded frame rates steady.

#### Compatibility and flicker with 24, 25, 50, and 144-hz frame rates.

24-fps capture devices may fail, so it is recommended to target 30- or 60-fps is possible. If in the UK or a country that has 50-hz lights or displays, you may wish to capture at 25-fps or 50-fps to avoid flicker caused by a mismatch between your display and the lights in the room.

If your display is set to 144-hz or some other odd frame rate, it is suggested to set your display to 120-hz or some multiple of 25- or 30-hz, depending on your location, to also avoid flicker with the camera as well.

#### Higher than 60-fps, such as 120-fps

Capturing video higher than 60-fps, such as 120-fps, is supported in certain situations, such as if screen sharing an entire display that has higher 120-hz set. Normally however, the video encoding is limited to 60-fps max, so capturing at a higher frame rate doesn't make sense.

If using \&chunked mode on the sender's link however, chunked mode supports higher than 60-fps encoding, such as 120-fps.  It is considered an experimental option though, but it has been tested between two Windows 11 systems on a LAN running with Chrome.

Raspberry.Ninja or using a remote WHIP/WHEP stream as a source may also unlock the option for higher than 60-fps streaming, but this isn't a suggested approach to the problem.

{% hint style="danger" %}
If the camera cannot support this frame rate, **it will fail**. Use [`&maxframerate`](../../source-settings/and-maxframerate.md) instead then, as this option will not error out if the target frame rate is not supported.
{% endhint %}

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
