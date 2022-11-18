---
description: Changes the screen-share aspect ratio on the publisher side
---

# \&screenshareaspectratio

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&ssar`

## Options

| Value            | Description                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| (no value given) | overrides [`&aspectratio`](../video-parameters/and-aspectratio.md) and sets the screen-share to the default aspect ratio |
| (decimal number) | sets the screen-share aspect ratio                                                                                       |
| `landscape`      | screen-share aspect ratio of 16:9 (1.777777)                                                                             |
| `portrait`       | screen-share aspect ratio of 9:16 (0.5625)                                                                               |
| `square`         | screen-share aspect ratio of 1:1 (1)                                                                                     |
| `1.33333`        | screen-share aspect ratio of 4:3                                                                                         |

## Details

`&screenshareaspectratio` sets the aspect ratio for screen-shares on the publisher side.

[`&aspectratio`](../video-parameters/and-aspectratio.md) works with screen-shares, so you can force crop an incoming screen-share to be a certain aspect ratio. If `&screenshareaspectratio` is used it will apply to just screen-shares. If `&screenshareaspectratio` does not have a value passed, it's assumed to be set as "default", which overrides [`&aspectratio`](../video-parameters/and-aspectratio.md) option, if used also.

## Related

{% content-ref url="../video-parameters/and-aspectratio.md" %}
[and-aspectratio.md](../video-parameters/and-aspectratio.md)
{% endcontent-ref %}
