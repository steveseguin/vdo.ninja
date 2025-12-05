---
description: Override whether screen-share video or audio is allowed
---

# \&allowscreenvideo / \&allowscreenaudio

Viewer-side overrides for screen-shares. Use on [`&view`](../view-parameters/view.md) / [`&scene`](../view-parameters/scene.md) links to explicitly allow or block incoming screen video/audio tracks.

| Parameter | Values | Description |
| --- | --- | --- |
| `&allowscreenvideo=` | `1` \| `true` | Force-enable screen-share video even if defaults would block it. |
|  | `0` \| `false` | Block screen-share video. |
| `&allowscreenaudio=` | `1` \| `true` | Force-enable screen-share audio. |
|  | `0` \| `false` | Block screen-share audio. |

Empty values default to “enabled.” These flags only affect screen-share tracks; camera audio/video are unaffected.
