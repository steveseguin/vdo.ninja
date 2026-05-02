---
description: Sets the automatic room-only bitrate tier for normal and stronger devices
---

# \&roomtier2bitrate

Room Option! ([`&room`](../../general-settings/room.md))

## Aliases

* `&rt2b`
* `&roomonlybitrate`
* `&rob`

## Options

Example: `&roomtier2bitrate=2000`

| Value | Description |
| --- | --- |
| positive integer value | total room-only bitrate budget, in kbps, for normal or stronger devices |

## Details

`&roomtier2bitrate` changes the higher automatic room-only bitrate tier.

The default is `2000`-kbps.

This value is used for normal or stronger devices in guest-only room calls. It is a total room budget, not a per-stream bitrate. If the guest is watching three visible videos and the tier is `2000`, each video is requested at about `666`-kbps.

If you set [`&totalroombitrate`](totalroombitrate.md), that explicit value takes priority over automatic room-only tiering.

{% hint style="warning" %}
Higher values can improve video quality, but they also increase outbound load for every sender in the mesh room. Test carefully with mobile guests.
{% endhint %}

## Related

{% content-ref url="roomtier1bitrate.md" %}
[roomtier1bitrate.md](roomtier1bitrate.md)
{% endcontent-ref %}

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="../../guides/room-only-mobile-bitrate-tiers.md" %}
[room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md)
{% endcontent-ref %}
