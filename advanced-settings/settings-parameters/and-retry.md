---
description: Control automatic retry/reconnect timing for lost streams
---

# \&retry

General Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Also controls

* `&retrytimeout` — minimum milliseconds to wait before attempting to recover a lost stream (default 5000ms)

## Options

Examples:

- `&retry=30` (seconds)
- `&retrytimeout=8000` (milliseconds)

| Parameter       | Value           | Description                                         |
| --------------- | --------------- | --------------------------------------------------- |
| `&retry`        | Integer seconds | Periodically re-queries streams and refreshes state |
| `&retrytimeout` | Integer ms      | Min wait before trying to recover a lost stream     |

## Details

- `&retry` schedules a periodic maintenance task that refreshes stream state (e.g., every N seconds). Lower bounds may be clamped (min ~10s internally).
- `&retrytimeout` sets how long VDO.Ninja waits before proactively trying to recover a missing stream. Minimum enforced is 5000ms.
- Useful for long-running overlays and multi-view pages where a guest might temporarily disconnect.

## Related

{% content-ref url="../newly-added-parameters/and-waitimage.md" %}
[and-waitimage.md](../newly-added-parameters/and-waitimage.md)
{% endcontent-ref %}

{% content-ref url="and-autorecover.md" %}
[and-autorecover.md](and-autorecover.md)
{% endcontent-ref %}

{% content-ref url="and-p2pfailtimeout.md" %}
[and-p2pfailtimeout.md](and-p2pfailtimeout.md)
{% endcontent-ref %}

{% content-ref url="and-peerrecoversteps.md" %}
[and-peerrecoversteps.md](and-peerrecoversteps.md)
{% endcontent-ref %}
