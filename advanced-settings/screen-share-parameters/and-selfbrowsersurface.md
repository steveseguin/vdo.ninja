---
description: Excludes the current tab as a screen-share source option
---

# \&selfbrowsersurface

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&selfbrowsersurface=include` or `&selfbrowsersurface=exclude`

| Value            | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| (no value given) | **Excludes** the current tab as a screen-share source option |
| `include`        | In**cludes** the current tab as a screen-share source option |
| `exclude`        | **Excludes** the current tab as a screen-share source option |

## Details

`&selfbrowsersurface` excludes the current tab as a screen-share source option. You can pass `include` or `exclude` as a value to control this though.

For more details on these new features see here:\
[https://developer.chrome.com/docs/web-platform/screen-sharing-controls/](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/)\
(Chrome/chromium-browsers only)

## Related

{% content-ref url="../../source-settings/screenshare.md" %}
[screenshare.md](../../source-settings/screenshare.md)
{% endcontent-ref %}
