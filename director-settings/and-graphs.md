---
description: Enable bitrate/codec/resolution graphs in the Director UI
---

# \&graphs

Director/Viewer Option! (primarily used with the Director)

## Options

Example: `&graphs`

| Value      | Description                            |
| ---------- | -------------------------------------- |
| (no value) | Enable performance graphs and toggles  |

## Details

- Director view: shows per-viewer graphs and a director summary panel (bitrate, resolution, codec). A small toggle in each tile can show/hide graphs.
- Interactive controls: clicking the bitrate or resolution labels in the director graphs prompts you to set a target remote bitrate or resolution for that viewer.
- Non-director viewers: when present, `&graphs` enables per-stream graphs where supported.
- Intended for diagnostics and fine-tuning; avoid using during shows if overlays are not desired.

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-showconnections.md" %}
[and-showconnections.md](../advanced-settings/settings-parameters/and-showconnections.md)
{% endcontent-ref %}

