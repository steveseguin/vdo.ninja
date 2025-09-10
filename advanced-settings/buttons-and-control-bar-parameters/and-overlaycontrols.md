---
description: Overlay the control bar without reserving layout space
---

# \&overlaycontrols

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&overlaycontrols`

| Value       | Description                                  |
| ----------- | -------------------------------------------- |
| (no value)  | Overlay control bar; do not reserve height   |

## Details

- Keeps the user control bar overlayed on top of the video area instead of reserving a dedicated area below it. This avoids layout height changes when showing/hiding controls.
- Useful for tight layouts where vertical space is limited, or when combined with widgets/iframes.
- Related behavior: [`&controlbarspace`](../settings-parameters/and-controlbarspace.md) forces a dedicated space for the control bar. Do not use both together.
- Mobile: behavior may vary depending on screen height; overlay avoids shrinking the grid area when controls appear.

## Related

{% content-ref url="../settings-parameters/and-controlbarspace.md" %}
[and-controlbarspace.md](../settings-parameters/and-controlbarspace.md)
{% endcontent-ref %}

