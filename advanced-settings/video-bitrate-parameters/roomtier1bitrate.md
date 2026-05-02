---
description: Sets the automatic room-only bitrate tier for weaker mobile devices
---

# \&roomtier1bitrate

Room Option! ([`&room`](../../general-settings/room.md))

## Aliases

* `&rt1b`
* `&roomonlylowbitrate`
* `&rolb`

## Options

Example: `&roomtier1bitrate=1500`

| Value | Description |
| --- | --- |
| positive integer value | total room-only bitrate budget, in kbps, for weaker mobile devices |

## Details

`&roomtier1bitrate` changes the lower automatic room-only bitrate tier.

The default is `1500`-kbps.

This value is used for mobile devices that appear weaker, older, or under CPU pressure. It is a total room budget, not a per-stream bitrate. If the guest is watching three visible videos and the tier is `1500`, each video is requested at about `500`-kbps.

This automatic tier is mainly for guest-only room calls. If the guest is connected to a director or scene viewer, production-safe behaviour takes priority unless you explicitly use room bitrate parameters.

{% hint style="info" %}
Use this on the guest invite links if you want all guests in a room-only call to share the same low-tier value.
{% endhint %}

## Related

{% content-ref url="roomtier2bitrate.md" %}
[roomtier2bitrate.md](roomtier2bitrate.md)
{% endcontent-ref %}

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="../../guides/room-only-mobile-bitrate-tiers.md" %}
[room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md)
{% endcontent-ref %}
