---
description: Disable mouse events on the page (prevent clicks/drag)
---

# \&nomouseevents

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&nme`

## Options

Example: `&nomouseevents`

| Value      | Description                         |
| ---------- | ----------------------------------- |
| (no value) | Disables pointer/mouse interactions |

## Details

- Disables pointer/mouse events on the viewer page. Useful for kiosk/signage and embedded overlays where interaction must be prevented.
- Combine with layout/design flags like [`&pagezoom`](and-pagezoom.md) or [`&nocursor`](../../general-settings/and-nocursor.md) for clean display outputs.

## Related

{% content-ref url="and-pagezoom.md" %}
[and-pagezoom.md](and-pagezoom.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/and-nocursor.md" %}
[and-nocursor.md](../../general-settings/and-nocursor.md)
{% endcontent-ref %}

