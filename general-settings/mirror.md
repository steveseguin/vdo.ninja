---
description: Inverts the video so it is the mirror reflection
---

# \&mirror

## Options

| Value            | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| (no value given) | Mirroring is forced for all videos                                                        |
| 0                | Preview video is mirrored only (excluding rear cameras and OBS Virtualcam/NDI)            |
| 1                | Mirroring is forced for all videos                                                        |
| 2                | Inverts the default; local previews are not mirrored, but guests are mirrored             |
| 3                | Same as default, except everything is mirrored, including text - useful for teleprompters |

## Details

Mirroring does not work if using the browser's native video full-screen button. Use [`&effects=2`](../source-settings/effects.md) instead for this use case.

Try `F11` or the Electron Capture app (right-click → fullscreen) to hide the browser menu instead.

## Related

{% content-ref url="and-flip.md" %}
[and-flip.md](and-flip.md)
{% endcontent-ref %}
