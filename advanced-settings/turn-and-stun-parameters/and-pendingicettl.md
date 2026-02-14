---
description: Sets how long queued ICE candidates are kept before being discarded
---

# \&pendingicettl

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&director`](../../viewers-settings/director.md))

## Options

Example: `&pendingicettl=20000`

| Value | Description |
| --- | --- |
| Integer milliseconds | ICE candidate queue TTL |

## Details

- Controls how long pending ICE candidates are retained when they arrive before a matching peer connection is ready.
- Default is `15000` ms.
- Allowed range is clamped to `3000` through `60000` ms.
- Higher values can help on high-latency paths where signaling arrives out of order.
- Lower values reduce stale-candidate buildup and memory pressure.

## Usage examples

- `?room=show123&pendingicettl=20000`
- `?view=streamA&pendingicettl=10000`

## Related

{% content-ref url="and-autorelay.md" %}
[and-autorelay.md](and-autorelay.md)
{% endcontent-ref %}

{% content-ref url="../settings-parameters/and-p2pfailtimeout.md" %}
[and-p2pfailtimeout.md](../settings-parameters/and-p2pfailtimeout.md)
{% endcontent-ref %}

