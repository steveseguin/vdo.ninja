---
description: Flip certain UI/layout defaults to right-align
---

# \&alignright / \&rightalign

General option (works with [`&push`](../../source-settings/push.md) and viewer links).

Add `&alignright` (or `&rightalign`) to nudge certain layout defaults to the right edge. Today it:

- Right-aligns the screen-share dock/mini-preview when using screen-share layouts.
- Uses the right-hand side when the UI chooses a default position for some overlays.

Passing a blank value enables it. To explicitly disable, set `&alignright=0`/`false`.
