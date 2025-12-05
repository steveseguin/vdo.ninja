---
description: Restrict external sensor bridge messages to a trusted origin
---

# \&sensorsorigin

General option (works with [`&push`](../../source-settings/push.md)).

When relaying sensor data into VDO.Ninja via `postMessage`, set `&sensorsorigin=<origin>` on the VDO.Ninja page to require that incoming sensor messages match that origin. Messages from other origins are dropped.

Example: `&sensorsorigin=https://example.com`
