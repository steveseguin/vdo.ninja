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
| `0`, `false`, `off`, `no` | Disable automatic forced-relay escalation |

## Details

- Automatic relay escalation is enabled by default. `&autorelay=1` can make that intent explicit or override an earlier `&autorecover=0`.
- Direct P2P remains the initial behavior. The default ICE policy is `all`; this feature does not make new connections TURN-only.
- On a hard connection failure, recovery first attempts one normal ICE restart. If the peer is still not connected after the recovery window, it makes one relay-eligible ICE restart.
- Useful when direct P2P paths fail intermittently due to strict NAT/firewall/routing issues.
- This does not force relay from the start like [`&relay`](../../general-settings/and-relay.md); it escalates when recovery logic decides it is needed.
- Escalation exits without changing the PC when auto-relay is disabled, no TURN server is configured, or the PC is already relay-forced by [`&relay`](../../general-settings/and-relay.md) or privacy mode.
- [`&autorecover`](../settings-parameters/and-autorecover.md) controls a broader recovery bundle. When both flags are present, the dedicated `&autorelay` value wins, so `&autorecover=1&autorelay=off` keeps the other bundle features while disabling forced relay.

{% hint style="info" %}
`&autorelay=0`, `&autorelay=off`, `&autorelay=false`, and `&autorelay=no` all prevent automatic relay escalation regardless of room size. Use `&turn=0` when TURN servers and relay candidates must be removed entirely, including normal browser ICE selection under policy `all`.
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
