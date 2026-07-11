---
description: Enables the connection-recovery bundle for unstable P2P paths
---

# \&autorecover

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&director`](../../viewers-settings/director.md))

## Options

Examples:

- `&autorecover`
- `&autorecover=1`
- `&autorecover=0`

| Value | Description |
| --- | --- |
| `1`, `true`, `on`, `yes` | Enable recovery bundle |
| `0`, `false`, `off`, `no` | Disable recovery bundle |

## What it toggles

When enabled, this currently enables:

- `autoRelay` behavior (equivalent to using [`&autorelay`](../turn-and-stun-parameters/and-autorelay.md))
- Adaptive disconnect timing
- Automatic WHEP fallback signaling where WHIP/WHEP settings are available

When disabled (`&autorecover=0`), those three assists are turned off. Baseline ICE recovery still runs. A later explicit `&autorelay=1` can re-enable only relay escalation because the dedicated flag is parsed after this bundle.

{% hint style="info" %}
Auto-relay itself now defaults enabled, while adaptive disconnect timing and automatic WHEP fallback remain off by default. Use `&autorecover=1&autorelay=off` when you want those other bundle features without forced-relay escalation.
{% endhint %}

## Details

- Intended for links where guests may roam networks or experience intermittent P2P failures.
- Best used with [`&p2pfailtimeout`](and-p2pfailtimeout.md) and [`&peerrecoversteps`](and-peerrecoversteps.md) to tune aggressiveness.
- Keeps direct P2P as the first connection path; the bundle changes recovery behavior only after a connection degrades or fails.

## Usage examples

- Conservative: `?room=show123&autorecover=1&p2pfailtimeout=12000&peerrecoversteps=3`
- Aggressive: `?room=show123&autorecover=1&p2pfailtimeout=6000&peerrecoversteps=5`

## Related

{% content-ref url="and-p2pfailtimeout.md" %}
[and-p2pfailtimeout.md](and-p2pfailtimeout.md)
{% endcontent-ref %}

{% content-ref url="and-peerrecoversteps.md" %}
[and-peerrecoversteps.md](and-peerrecoversteps.md)
{% endcontent-ref %}

{% content-ref url="../turn-and-stun-parameters/and-autorelay.md" %}
[and-autorelay.md](../turn-and-stun-parameters/and-autorelay.md)
{% endcontent-ref %}
