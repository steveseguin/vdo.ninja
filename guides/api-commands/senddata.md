---
description: >-
  Send generic data via p2p. Send whatever you want I guess; there is a max
  chunk size of course.
---

# sendData

General Option! ([`&push`](../../source-settings/push.md), [`&view`](../../advanced-settings/view-parameters/view.md), [`&scene`](../../advanced-settings/view-parameters/scene.md))

| Value | Description                      |
| ----- | -------------------------------- |
| (any) | Small amount of data to send P2P |

### CODE EXAMPLE

```
iframe.contentWindow.postMessage({ "sendData": { foo: "bar" });
```
