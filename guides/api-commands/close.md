---
description: Disconnect and hangup all inbound streams.
---

# close

General Option! ([`&push`](../../source-settings/push.md), [`&view`](../../advanced-settings/view-parameters/view.md), [`&scene`](../../advanced-settings/view-parameters/scene.md))

## Aliases

hangup

## Options

| Value | Description |
| ----- | ----------- |
| true  |             |
| false |             |

## Modifiers

| Action | Value | Required | Description |
| ------ | ----- | -------- | ----------- |
|        |       |          |             |
|        |       |          |             |
|        |       |          |             |

### Example

```

iframe.contentWindow.postMessage({ 
    "close": true,
});
```
