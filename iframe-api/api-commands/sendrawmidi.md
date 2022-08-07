---
description: Webrtc send to publishers
---

# sendRawMIDI

Sender Option! ([`&push`](../../source-settings/push.md))

## Options

| Value  | Description |
| ------ | ----------- |
| (midi) |             |

## Modifiers

| Action   | Value    | Required | Description |
| -------- | -------- | -------- | ----------- |
| UUID     | (string) | no       |             |
| streamID | (string) | no       |             |

### Example

```
iframe.contentWindow.postMessage({ 
    "sendRawMIDI": "11110001",
    "streamID": "someid"
});
```
