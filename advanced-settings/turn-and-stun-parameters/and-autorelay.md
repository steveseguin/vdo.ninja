---
description: Automatically escalate failed peer paths to TURN relay during recovery
---

# \&autorelay

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&director`](../../viewers-settings/director.md))

## Options

Examples:

- `&autorelay`
- `&autorelay=1`
- `&autorelay=0`

| Value | Description |
| --- | --- |
| `1`, `true`, `on`, `yes` | Enable relay escalation during auto-recovery |
| `0`, `false`, `off`, `no` | Disable relay escalation during auto-recovery |

## Details

- Enables automatic TURN relay escalation as part of peer recovery attempts.
- Useful when direct P2P paths fail intermittently due to strict NAT/firewall/routing issues.
- This does not force relay from the start like [`&relay`](../../general-settings/and-relay.md); it escalates when recovery logic decides it is needed.
- Requires usable TURN servers. If no TURN servers are configured, this option has no effect.
- [`&autorecover`](../settings-parameters/and-autorecover.md) already enables this behavior, so combining both flags is redundant.

{% hint style="info" %}
Large rooms may still trigger relay escalation heuristics even without `&autorelay`, but enabling `&autorelay` makes this behavior explicit and predictable.
{% endhint %}

## Related

{% content-ref url="and-pendingicettl.md" %}
[and-pendingicettl.md](and-pendingicettl.md)
{% endcontent-ref %}

{% content-ref url="../settings-parameters/and-autorecover.md" %}
[and-autorecover.md](../settings-parameters/and-autorecover.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/and-relay.md" %}
[and-relay.md](../../general-settings/and-relay.md)
{% endcontent-ref %}
