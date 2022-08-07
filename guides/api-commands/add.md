# add

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
    "add": true
});
```
