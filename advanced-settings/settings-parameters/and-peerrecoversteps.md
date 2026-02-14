---
description: Sets how many automated recovery steps are attempted per peer before giving up
---

# \&peerrecoversteps

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&director`](../../viewers-settings/director.md))

## Aliases

- `&p2precoversteps`

## Options

Example: `&peerrecoversteps=4`

| Value | Description |
| --- | --- |
| Integer | Max number of recovery steps |

## Details

- Default is `3`.
- Allowed range is clamped to `1` through `6`.
- Higher values allow more retries before the peer is closed/rebuilt.
- Lower values fail fast and rely on fresh reconnection sooner.

Current recovery ladder (simplified):

1. Attempt ICE restart.
2. Rotate ICE/TURN preference and attempt relay escalation, then ICE restart.
3. Additional attempts continue up to the configured step limit; with `&autorecover` and WHIP/WHEP configured, auto-fallback signaling may be attempted for eligible peers.

## Usage examples

- Balanced default-like behavior: `?room=show123&peerrecoversteps=3`
- Very persistent recovery: `?room=show123&autorecover=1&peerrecoversteps=6`

## Related

{% content-ref url="and-p2pfailtimeout.md" %}
[and-p2pfailtimeout.md](and-p2pfailtimeout.md)
{% endcontent-ref %}

{% content-ref url="and-autorecover.md" %}
[and-autorecover.md](and-autorecover.md)
{% endcontent-ref %}

