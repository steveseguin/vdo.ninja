---
description: Will pre-select display-share, rather than tab-share, when screen-sharing
---

# \&displaysurface

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&displaysurface=monitor`

| Value     | Description                     |
| --------- | ------------------------------- |
| `monitor` | Will pre-select "display-share" |
| `browser` | Will pre-select "tab-share"     |
| `window`  | Will pre-select "window-share"  |

## Details

`&displaysurface` will pre-select "display-share", rather than tab-share, when screen-sharing. You can pass `monitor`, `browser`, or `window` as options to customize this though.

![](<../../.gitbook/assets/image (1).png>)

For more details on these new features see here:\
[https://developer.chrome.com/docs/web-platform/screen-sharing-controls/](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/)\
(Chrome/chromium-browsers only)

## Related

{% content-ref url="../../source-settings/screenshare.md" %}
[screenshare.md](../../source-settings/screenshare.md)
{% endcontent-ref %}
