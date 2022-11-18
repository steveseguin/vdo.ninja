---
description: >-
  Auto-hides remote guests videos when added, if those guests are not speaking
  actively
---

# \&activespeaker

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&sas`
* `&speakerview`

## Options

| Value                   | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `1` \| (no value given) | will only show one speaker at a time; the loudest or last-loud speaker                  |
| `2`                     | will show whoever is talking; mixed together; if no one is talking, just shows yourself |
| `3`                     | the same as `1`, but it will not switch to show audio-only sources (just video only)    |
| `4`                     | the same as `2`, but it will not switch to show audio-only sources (just video only)    |

In all four cases, if someone else is talking/active, your local preview will become a [mini-preview](../../source-settings/and-minipreview.md) in the top right.
