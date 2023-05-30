---
description: Filters ICE candidates
---

# \&icefilter

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Options

Example: `&icefilter=tcp`

<table><thead><tr><th width="222">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>tcp</code></td><td>Filters TCP ICE candidates</td></tr><tr><td><code>udp</code></td><td>Filters UDP ICE candidates</td></tr><tr><td><code>host</code></td><td>Filters HOST ICE candidates</td></tr></tbody></table>

## Details

Filters out ICE candidates that do not include the specified word in the candidate string.

Added for advanced use-cases and testing purposes.

{% hint style="warning" %}
This is an advanced parameter that can stop your links from working correctly.
{% endhint %}
