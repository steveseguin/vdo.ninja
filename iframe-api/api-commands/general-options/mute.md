---
description: Mutes / unmutes the speaker
---

# mute

General Option! ([`&push`](../../../source-settings/push.md), [`&room`](../../../general-settings/room.md), [`&view`](../../../advanced-settings/view-parameters/view.md), [`&scene`](../../../advanced-settings/view-parameters/scene.md), [`&director`](../../../viewers-settings/director.md))

## Related URL Param

{% content-ref url="../../../source-settings/and-mutespeaker.md" %}
[and-mutespeaker.md](../../../source-settings/and-mutespeaker.md)
{% endcontent-ref %}

## Options

| Value    | Description         |
| -------- | ------------------- |
| true     | Mute speaker        |
| false    | Un-mute speaker     |
| "toggle" | Toggle speaker mute |

## Example

```javascript
iframe.contentWindow.postMessage({
    "mute": true
});
```
