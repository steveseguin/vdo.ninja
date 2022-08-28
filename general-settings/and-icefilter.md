---
description: Filters ICE candidates
---

# \&icefilter

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Options

| Value  | Description                 |
| ------ | --------------------------- |
| `tcp`  | Filters TCP ICE candidates  |
| `udp`  | Filters UDP ICE candidates  |
| `host` | Filters HOST ICE candidates |

## Details

Filters out ICE candidates that do not include the specified word in the candidate string.

Added for advanced use-cases and testing purposes.

{% hint style="warning" %}
This is an advanced parameter that can stop your links from working correctly.
{% endhint %}
