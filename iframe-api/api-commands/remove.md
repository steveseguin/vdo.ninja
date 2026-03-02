---
description: IFRAME API command reference for remove in VDO.Ninja with syntax behavior and examples.
---

# remove

General Option! ([`&push`](../../source-settings/push.md), [`&view`](../../advanced-settings/view-parameters/view.md), [`&scene`](../../advanced-settings/view-parameters/scene.md))

## Options

| Value | Description |
| ----- | ----------- |
| true  |             |
| false |             |

## Modifiers

| Action            | Value              | Required | Description |
| ----------------- | ------------------ | -------- | ----------- |
| target (required) | '\*' \| (streamID) | yes      |             |
|                   |                    |          |             |
|                   |                    |          |             |

### Example

```

iframe.contentWindow.postMessage({ 
    "target": "*",
    "remove": true
});
```
