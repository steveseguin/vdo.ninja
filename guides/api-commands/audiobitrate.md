---
description: Set a video bitrate for a video; scene or view link; kbps. Lockable.
---

# audiobitrate

## Type

number

## Co-actions

| Action | Type    | Required |                                                        |
| ------ | ------- | -------- | ------------------------------------------------------ |
| "lock" | boolean | No       | Locks bitrate (prevents the automixer from overriding) |

### Example

```
iframe.contentWindow.postMessage({ "audiobitrate": 3000, "lock": true });
```
