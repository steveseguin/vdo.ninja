---
description: Will optimize the mobile experience for more capable smartphones
---

# \&flagship

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Details

`&flagship` is a manual hint that tells VDO.Ninja to treat a mobile publisher as more capable than the default mobile assumptions.

It does not detect the phone model or chipset. It is useful when you know the guest is using a high-end mobile device and you want less aggressive mobile protection.

For room-only conferencing, VDO.Ninja can also use automatic room-only bitrate tiers. Those tiers are usually safer than forcing all mobile devices into a high-performance mode. See [room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md "mention").

In director or scene controlled rooms, `&flagship` can be useful if you intentionally want a capable mobile guest to send higher quality video to other room guests. Test carefully, as mobile browsers can overheat or become CPU-limited when sending several peer-to-peer video streams.

If you need a numeric mobile cap instead of a broad hint, use [`&maxmobilebitrate`](../video-bitrate-parameters/and-maxmobilebitrate.md).

## Related

{% content-ref url="../../guides/room-only-mobile-bitrate-tiers.md" %}
[room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md)
{% endcontent-ref %}

{% content-ref url="../video-bitrate-parameters/and-maxmobilebitrate.md" %}
[and-maxmobilebitrate.md](../video-bitrate-parameters/and-maxmobilebitrate.md)
{% endcontent-ref %}

{% content-ref url="and-notmobile.md" %}
[and-notmobile.md](and-notmobile.md)
{% endcontent-ref %}

{% content-ref url="../mobile-parameters/and-forceios.md" %}
[and-forceios.md](../mobile-parameters/and-forceios.md)
{% endcontent-ref %}
