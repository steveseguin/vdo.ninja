---
description: Auto-derive a WHEP share URL from a WHIP output URL
---

# \&autowhep

[WHIP Option](../../steves-helper-apps/whip-and-whep-tooling.md) / Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example:

`&whipout=https%3A%2F%2Fexample.com%2Fstream%2Fwhip&autowhep`

| Value            | Description                                      |
| ---------------- | ------------------------------------------------ |
| (no value given) | Attempts to infer and advertise a WHEP play URL |

## Details

`&autowhep` is an opt-in helper for WHIP publishing links. If a WHIP output URL is configured with [`&whipout`](and-whipout.md), [`&whippush`](and-whipout.md), or [`&pushwhip`](and-whipout.md), and no explicit [`&whepshare`](and-whepshare.md) value is already set, VDO.Ninja will try to derive the matching WHEP playback URL and share it with room peers.

This is useful when each guest has a known WHIP publishing endpoint and you want the other guests/viewers to pull that guest via WHEP instead of direct peer-to-peer media.

Known URL patterns include:

| WHIP pattern        | WHEP pattern        |
| ------------------- | ------------------- |
| Cloudflare Stream `.../{publish-token}/webRTC/publish` | `.../{playback-id}/webRTC/play` |
| `.../whip`          | `.../whep`          |
| `.../webRTC/publish` | `.../webRTC/play` |
| `.../publish`       | `.../play`          |

Explicit [`&whepshare`](and-whepshare.md) values take priority. If you use [`&whepsharetoken`](and-whepsharetoken.md), it will still be attached after the WHEP URL is auto-derived.

`&autowhep` does not change the default WHIP behavior; it only runs when added to the sender URL.

## Related

{% content-ref url="and-whipout.md" %}
[and-whipout.md](and-whipout.md)
{% endcontent-ref %}

{% content-ref url="and-whepshare.md" %}
[and-whepshare.md](and-whepshare.md)
{% endcontent-ref %}

{% content-ref url="and-whepsharetoken.md" %}
[and-whepsharetoken.md](and-whepsharetoken.md)
{% endcontent-ref %}
