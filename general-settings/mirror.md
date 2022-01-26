---
description: Inverts the video so it is the mirror reflection.
---

# \&mirror

## Options

| Value               | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| (no value provided) | preview video is mirrored only (excluding rear cameras and OBS Virtualcam/NDI)             |
| 0                   | No mirroring                                                                               |
| 1                   | Inverts the default. Local previews are not mirrored, but guests are mirrored.             |
| 2                   | Mirroring is forced for all videos.                                                        |
| 3                   | Same as default, except everything is mirrored, including text - useful for teleprompters. |

## Details

Mirroring does not work if using the browser's native video full-screen button. Use [`&effects=2`](effects.md#values) instead for this use case.

Try `F11` or the Electron Capture app (right-click → Fullscreen) to hide the browser menu instead.
