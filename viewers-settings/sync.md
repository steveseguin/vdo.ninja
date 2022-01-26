---
description: Sets an offset (in ms) for the automatic audio sync fix node
---

# \&sync

## Options

| Value           | Description |
| --------------- | ----------- |
| (integer value) | value in ms |

## Details

[`&buffer=0`](../advanced-settings.md#buffer) or `&sync=0` will do the same thing -- it will try to auto-sync video and audio.\
Tiny negative offsets _may_ work, like `&sync=-25` is possible, but large negative offsets will not work.\
No clue if it is supported in OBS or not; works in Chromium/Chrome v76 or newer tho. Useful if the video device has a large delay that needs compensating for that isn't fixed automatically.\
`&sync=500` without the [`&buffer`](buffer.md) command also will only add an audio delay; there will be no additional video buffer or delay.

{% hint style="info" %}
Using may stop Echo Cancellation from working.
{% endhint %}

## Related

{% content-ref url="buffer.md" %}
[buffer.md](buffer.md)
{% endcontent-ref %}
