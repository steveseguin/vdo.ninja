---
description: Allow only STUN (no TURN/relay) ICE candidates
---

# \&stunonly

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Options

Example: `&stunonly`

| Value        | Description                       |
| ------------ | --------------------------------- |
| (no value)   | Enable STUN-only (disable TURN)   |

## Details

- Filters ICE to exclude TURN/relay candidates, preventing use of TURN servers.
- Useful for testing direct P2P connectivity; can reduce latency when direct paths work.
- Risk: connections behind strict NAT/firewalls may fail without TURN fallback.
- Combine with [`&icefilter`](../../general-settings/and-icefilter.md) for custom filtering, or with [`&lanonly`](and-lanonly.md) for local-only tests.

## Related

{% content-ref url="../../general-settings/and-relay.md" %}
[and-relay.md](../../general-settings/and-relay.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/and-icefilter.md" %}
[and-icefilter.md](../../general-settings/and-icefilter.md)
{% endcontent-ref %}

