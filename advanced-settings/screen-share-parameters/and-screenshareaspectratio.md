---
description: Changes the screen-share aspect ratio on the publisher side
---

# \&screenshareaspectratio

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&ssar`

## Options

Example: `&screenshareaspectratio=landscape`

<table><thead><tr><th width="192">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>overrides <a href="../video-parameters/and-aspectratio.md"><code>&#x26;aspectratio</code></a> and sets the screen-share to the default aspect ratio</td></tr><tr><td>(decimal number)</td><td>sets the screen-share aspect ratio</td></tr><tr><td><code>landscape</code></td><td>screen-share aspect ratio of 16:9 (1.777777)</td></tr><tr><td><code>portrait</code></td><td>screen-share aspect ratio of 9:16 (0.5625)</td></tr><tr><td><code>square</code></td><td>screen-share aspect ratio of 1:1 (1)</td></tr><tr><td><code>1.33333</code></td><td>screen-share aspect ratio of 4:3</td></tr></tbody></table>

## Details

`&screenshareaspectratio` sets the aspect ratio for screen-shares on the publisher side.

[`&aspectratio`](../video-parameters/and-aspectratio.md) works with screen-shares, so you can force crop an incoming screen-share to be a certain aspect ratio. If `&screenshareaspectratio` is used it will apply to just screen-shares. If `&screenshareaspectratio` does not have a value passed, it's assumed to be set as "default", which overrides [`&aspectratio`](../video-parameters/and-aspectratio.md) option, if used also.

## Related

{% content-ref url="../video-parameters/and-aspectratio.md" %}
[and-aspectratio.md](../video-parameters/and-aspectratio.md)
{% endcontent-ref %}
