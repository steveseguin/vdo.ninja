---
description: Changes the aspect ratio on the publisher side
---

# \&screenshareaspectratio

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&ssar`

## Options

| Value            | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| (no value given) | overrides [`&aspectratio`](and-aspectratio.md) and sets the screen-share to the default aspect ratio |
| (decimal number) | sets the screen-share aspect ratio                                                                   |
| `landscape`      | screen-share aspect ratio of 16:9 (1.777777)                                                         |
| `portrait`       | screen-share aspect ratio of 9:16 (0.5625)                                                           |
| `square`         | screen-share aspect ratio of 1:1 (1)                                                                 |
| `1.33333`        | screen-share aspect ratio of 4:3                                                                     |

## Details

`&screenshareaspectratio` sets the aspect ratio for screen-shares on the publisher side.

[`&aspectratio`](and-aspectratio.md) works with screen-shares, so you can force crop an incoming screen-share to be a certain aspect ratio. If `&screenshareaspectratio` is used it will apply to just screen-shares. If `&screenshareaspectratio` does not have a value passed, it's assumed to be set as "default", which overrides [`&aspectratio`](and-aspectratio.md) option, if used also.

## Related

{% content-ref url="and-aspectratio.md" %}
[and-aspectratio.md](and-aspectratio.md)
{% endcontent-ref %}
