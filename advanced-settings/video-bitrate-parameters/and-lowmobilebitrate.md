---
description: Sets the lower fallback mobile sender bitrate cap for guest room publishing
---

# \&lowmobilebitrate

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&lowmobilebitrate=150`

| Value | Description |
| --- | --- |
| positive integer value | lower mobile video bitrate cap per outgoing guest room stream, in kbps |

## Details

`&lowmobilebitrate` changes the lower mobile sender cap used when VDO.Ninja decides a mobile guest needs extra protection.

The default is `35`-kbps.

This can apply to older mobile browsers or larger room situations where a phone may need to send several outbound streams. The goal is to keep audio stable and avoid overheating or encoder overload.

Most users should not need this parameter. For normal room-only conferencing, use [`&roomtier1bitrate`](roomtier1bitrate.md) and [`&roomtier2bitrate`](roomtier2bitrate.md) instead.

## Related

{% content-ref url="and-maxmobilebitrate.md" %}
[and-maxmobilebitrate.md](and-maxmobilebitrate.md)
{% endcontent-ref %}

{% content-ref url="roomtier1bitrate.md" %}
[roomtier1bitrate.md](roomtier1bitrate.md)
{% endcontent-ref %}

{% content-ref url="../../guides/room-only-mobile-bitrate-tiers.md" %}
[room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md)
{% endcontent-ref %}
