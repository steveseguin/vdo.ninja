---
description: Move the on-page control buttons up or down
---

# \&menuoffset

General option (works with [`&push`](../../source-settings/push.md) and viewer links).

`&menuoffset=<CSS length>` adjusts the vertical position of the on-page control buttons (menu/mute strip). Useful when embedding under another overlay so the buttons don’t overlap.

Example: `&menuoffset=80px` places the buttons 80 pixels from the bottom. Include a CSS unit such as `px` for nonzero lengths. With no value, the offset is `50px`.
