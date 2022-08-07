---
description: Mutes / unmutes mic
---

# mic

Sender Option! ([`&push`](../../source-settings/push.md))

## Related URL Param

{% content-ref url="../../source-settings/and-mute.md" %}
[and-mute.md](../../source-settings/and-mute.md)
{% endcontent-ref %}

## Options

| Value    | Description    |
| -------- | -------------- |
| true     | Turns mic on   |
| false    | Turns mic off  |
| "toggle" | Toggles on/off |

## Example

```
iframe.contentWindow.postMessage({
    "mic": true
});
```
