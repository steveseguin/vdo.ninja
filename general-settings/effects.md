---
description: Applies effects to the video/audio feeds.
---

# \&effects

## Options

| Value            | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| 0                | Disables effects                                               |
| 1                | Face tracker                                                   |
| 2                | Mirror image                                                   |
| 3                | Background blur                                                |
| 4                | Virtual greenscreen                                            |
| 5                | Background replacement                                         |
| (no value given) | Shows a "Digital video effects" panel when setting up devices. |

## Details

### Green screen performance

Green screen doesn't require SIMD support to work, although it won't work as well without it on. There's a little warning info icon (!) if SIMD is not enabled.

Please do enable Webassembly-SIMD support under chrome://flags/ if you'd like to see a large reduction in CPU load when using this feature.
