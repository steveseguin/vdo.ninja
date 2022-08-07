---
description: Sets the speaker (output) volume of a video element
---

# volume

## Related URL Param

{% content-ref url="../../../advanced-settings/upcoming-parameters/and-volume.md" %}
[and-volume.md](../../../advanced-settings/upcoming-parameters/and-volume.md)
{% endcontent-ref %}

## Options

| Value   | Description                      |
| ------- | -------------------------------- |
| (0-100) | audio playback volume as percent |
| (0-1.0) | audio playback volume as decimal |

## Modifiers

|          | value      | Required | Description                   |
| -------- | ---------- | -------- | ----------------------------- |
| "target" | (streamID) | no       | Targets a guest by streamID   |
| "target" | "\*"       | no       | Targets every guest (default) |
|          |            |          |                               |

## Example

```
iframe.contentWindow.postMessage({
    "volume": 0.5,
    "target": "*"
});
```
