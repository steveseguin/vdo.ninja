---
description: Darkens the website and interface
---

# \&darkmode

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&nightmode`

## Options

| Value            | Description            |
| ---------------- | ---------------------- |
| 0 \| false       | disables the dark-mode |
| (no value given) | enables the dark-mode  |

## Details

Enables the dark-mode stylings of the website.

Conversely, setting [`&lightmode`](and-lightmode.md), `&darkmode=0` or `&darkmode=false` will disable the dark-mode, forcing the light-mode.

The dark-mode will be selected automatically by default if your system is set to dark color mode, so this flag can be used to override that.

## Related

{% content-ref url="and-lightmode.md" %}
[and-lightmode.md](and-lightmode.md)
{% endcontent-ref %}
