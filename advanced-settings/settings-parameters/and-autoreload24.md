---
description: Automatically reload at a specific time of day
---

# \&autoreload24

General Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&autoreload24=03:30`

| Value     | Description                               |
| --------- | ----------------------------------------- |
| HH:MM     | 24‑hour time to reload once per day       |

## Details

- Parses a 24‑hour time (e.g., 03:30). If the time has already passed today, it schedules for tomorrow.
- On reload, the page starts fresh and re-schedules the next day automatically.
- Useful for daily resets of dashboards or studio scenes.

## Related

{% content-ref url="and-autoreload.md" %}
[and-autoreload.md](and-autoreload.md)
{% endcontent-ref %}

