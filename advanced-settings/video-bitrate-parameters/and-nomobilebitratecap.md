---
description: Disables only the mobile sender bitrate safety cap
---

# \&nomobilebitratecap

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&nomobilebitratecap`

| Value | Description |
| --- | --- |
| no value | disables the app-level mobile sender bitrate cap |

## Details

`&nomobilebitratecap` keeps the normal mobile interface active, but disables VDO.Ninja's extra mobile sender bitrate safety cap.

This is different from [`&notmobile`](../upcoming-parameters/and-notmobile.md), which makes VDO.Ninja treat the device as non-mobile and can also change mobile-specific controls and layout behavior.

This parameter does not override room, director, or viewer bitrate controls. Viewers still request bitrate normally, [`&totalroombitrate`](totalroombitrate.md) still controls room receive budgets, [`&maxvideobitrate`](and-maxvideobitrate.md) can still cap the publisher, and WebRTC congestion control can still reduce bitrate when needed.

Use this carefully. Mobile browsers can overheat or become CPU-limited when sending several peer-to-peer video streams, especially in mesh rooms. Overloaded mobile devices can cause audio dropouts or unstable video.

## Related

{% content-ref url="and-maxmobilebitrate.md" %}
[and-maxmobilebitrate.md](and-maxmobilebitrate.md)
{% endcontent-ref %}

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="../../guides/room-only-mobile-bitrate-tiers.md" %}
[room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md)
{% endcontent-ref %}
