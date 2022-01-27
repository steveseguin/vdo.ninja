---
description: >-
  A useful flag to allow the director to present their own video to the group,
  often used in conjunction with a virtual webcam; it can allow for larger
  groups rooms by reducing load on guests
---

# \&broadcast

## Aliases

* `&bc`

## Options

| Value    | Description                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (string) | <p>You can pass an optional stream-ID to specify the stream's source manually.<br>If no value is passed, the source will be the room's director video out feed.</p> |

## Details

This command is like [`&novideo`](../advanced-settings.md#novideo), but with some extras added to make setup of large group rooms easier.

* It also disables the local video preview..
* it also disables the video from other guests, unless their stream ID is specified as the {xxx} value
* It hides the audio-only guest windows that would appear normally; this is akin to [`&style=1`](../advanced-settings.md#style).
* It disables the top page header ([`&noheader`](../advanced-settings.md#noheader)).
* It defaults to the director's stream, if no value is passed.
* You cannot pass multiple stream IDs to the `&broadcast` flag; just one. If needing more, consider using the [`&novideo`](novideo.md) flag instead

You can imitate the `&broadcast` parameter using `&novideo=PC1,PC2&noheader&nopreview&style=1`

#### Performance considerations

While the \&broadcast flag is great for reducing the load on guests in a room, it will put all the load onto the director instead. &#x20;

* Consider using NVEnc or other hardware-encoders to encode any RTMP streams in your studio software to reduce CPU load there
* Make sure you have a capable computer; an AMD 5900x CPU is recommend for most users using this mode, allowing for medium-sized group rooms with some headroom to spare.
* A quad-core computer might only be able to support 1 or 2 guests adequately in this mode
* Consider using the [`&webp`](webp.md) flag to reduce the CPU load on the director further; this will lower the quality that the guests see however.
* If you would like the guests to see even higher quality video, consider using [`&trb=2500`](totalroombitrate.md) as an option to greatly improve the video quality. This also will greatly also increase the load on the director, so good internet and a powerful CPU will be needed
* Using a service like meshcast.io, along with the [`&website`](../source-settings/and-website.md) parameter, can also greatly reduce load on the director and guests, but this comes at the cost of added latency usually.

If you'd like to understand how [Meshcast.io](https://meshcast.io) can help reduce CPU load greatly, leveraging VDO.Ninja's group broadcast-feature, you can see this video:&#x20;

{% embed url="https://www.youtube.com/watch?v=-7QsLChfdsE" %}
