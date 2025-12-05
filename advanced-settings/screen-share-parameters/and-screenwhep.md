---
description: Control whether screen-shares use WHEP relays or stay P2P
---

# \&screenwhep

General option (works with [`&push`](../../source-settings/push.md) and [`&view`](../view-parameters/view.md) / [`&scene`](../view-parameters/scene.md)).

| Parameter | Values | Description |
| --- | --- | --- |
| `&screenwhep` | (no value) or `1` | Prefer WHEP relayed transport for screen-shares. |
|  | `0` \| `false` | Force screen-shares to stay P2P. |
| `&screenp2p` \| `&noscreenwhep` | flag | Shortcut to force P2P for screen-shares. |
| `&screenwheponly` | flag | Force WHEP-only for screen-shares. |

These flags only affect screen-share transports; camera streams still follow the normal WHIP/WHEP/peer-to-peer settings.
