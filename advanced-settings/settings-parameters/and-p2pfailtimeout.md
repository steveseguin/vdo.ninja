---
description: Sets the recovery stall/disconnect timing window for peer-to-peer links
---

# \&p2pfailtimeout

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&director`](../../viewers-settings/director.md))

## Options

Example: `&p2pfailtimeout=12000`

| Value | Description |
| --- | --- |
| Integer milliseconds | Recovery window used by disconnect/stall logic |

## Details

- Default is `12000` ms.
- Input is clamped to `3000` through `45000` ms.
- Affects how quickly repeated recovery attempts are scheduled after disconnection/media stalls.
- Lower values recover faster but may react to brief jitter.
- Higher values are more tolerant of jitter but slower to intervene.

{% hint style="info" %}
The initial "connecting watchdog" has its own floor (~45s), so very low values do not shorten first-connect watchdog behavior below that floor.
{% endhint %}

## Usage examples

- Faster retry cadence: `?room=show123&autorecover=1&p2pfailtimeout=6000`
- More tolerant on unstable mobile data: `?room=show123&autorecover=1&p2pfailtimeout=18000`

## Related

{% content-ref url="and-peerrecoversteps.md" %}
[and-peerrecoversteps.md](and-peerrecoversteps.md)
{% endcontent-ref %}

{% content-ref url="and-autorecover.md" %}
[and-autorecover.md](and-autorecover.md)
{% endcontent-ref %}

