---
description: Automatically reload at a set interval
---

# \&autoreload

General Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&autoreload=60`

| Value          | Description                             |
| -------------- | --------------------------------------- |
| Integer minutes| Reloads the page every N minutes        |

## Details

- Schedules a periodic reload by calling an internal hangup/reload after the specified number of minutes.
- Helps keep persistent overlays healthy across long broadcasts.
- Use [`&autoreload24`](and-autoreload24.md) to reload at a specific time of day instead.

## Related

{% content-ref url="and-autoreload24.md" %}
[and-autoreload24.md](and-autoreload24.md)
{% endcontent-ref %}

