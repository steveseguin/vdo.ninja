---
description: >-
  Webrtc send message to every connected peer; like send and request; a hammer
  vs a knife.
---

# getStats

Sender Option! ([`&push`](../../source-settings/push.md))

## Options

| Value | Description    |
| ----- | -------------- |
| (any) | Reloads iframe |

### Example

```

iframe.contentWindow.postMessage({ 
    "getStats": null,
});
```
