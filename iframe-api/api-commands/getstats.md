---
description: >-
  Request a current connection stats snapshot from the embedded VDO.Ninja instance.
---

# getStats

Sender Option! ([`&push`](../../source-settings/push.md))

## Options

| Value | Description    |
| ----- | -------------- |
| (any) | Returns current stats snapshot |

### Example

```

iframe.contentWindow.postMessage({ 
    "getStats": true,
});
```
