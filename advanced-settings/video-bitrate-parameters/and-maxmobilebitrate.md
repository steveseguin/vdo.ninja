---
description: Sets the normal mobile sender bitrate cap for guest room publishing
---

# \&maxmobilebitrate

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&maxmobilebitrate=1000`

| Value | Description |
| --- | --- |
| positive integer value | max mobile video bitrate per outgoing guest room stream, in kbps |

## Details

`&maxmobilebitrate` changes the normal mobile sender cap used when a mobile guest is publishing video to other room guests.

The default is `350`-kbps.

This parameter is mainly useful in director or scene controlled rooms where automatic room-only tiering is not active, but you still want a capable mobile guest to send better video to other guests.

Use this carefully. Mobile browsers can overheat or become CPU-limited when sending several peer-to-peer video streams, and audio quality can suffer when the device is overloaded.

For guest-only conferencing rooms, prefer [`&roomtier2bitrate`](roomtier2bitrate.md) and [`&roomtier1bitrate`](roomtier1bitrate.md).

## Related

{% content-ref url="and-lowmobilebitrate.md" %}
[and-lowmobilebitrate.md](and-lowmobilebitrate.md)
{% endcontent-ref %}

{% content-ref url="roomtier2bitrate.md" %}
[roomtier2bitrate.md](roomtier2bitrate.md)
{% endcontent-ref %}

{% content-ref url="../../guides/room-only-mobile-bitrate-tiers.md" %}
[room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md)
{% endcontent-ref %}
