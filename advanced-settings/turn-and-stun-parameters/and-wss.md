---
description: Override the signaling WebSocket server endpoint
---

# \&wss

Advanced Option! (global)

## Aliases

* `&wss2` — alternative signaling server key

## Options

Examples:

- `&wss=wss://wss.piesocket.io:8443`
- `&wss2=wss://vdo.socialstream.ninja`

| Parameter | Value | Description                      |
| --------- | ----- | -------------------------------- |
| `&wss`    | URL   | Primary signaling WebSocket URL  |
| `&wss2`   | URL   | Alternate signaling protocol URL |

## Details

- Overrides the default signaling server used by VDO.Ninja.
- For troubleshooting or regional deployments; use only if you know what you’re doing.
- Does not change TURN/STUN; see related parameters for media path control.

## Related

{% content-ref url="../../general-settings/stun.md" %}
[stun.md](../../general-settings/stun.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/and-relay.md" %}
[and-relay.md](../../general-settings/and-relay.md)
{% endcontent-ref %}

