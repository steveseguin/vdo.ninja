---
description: Option to change outbound audio bitrate of the &meshcast parameter
---

# \&meshcastaudiobitrate

Meshcast Option / Sender-Side Option! ([`&meshcast`](../../newly-added-parameters/and-meshcast.md), [`&push`](../../source-settings/push.md))

## Aliases

* `&mcaudiobitrate`
* `&mcab`
* `&meshcastab`

## Options

Example: `&meshcastaudiobitrate=128`

<table><thead><tr><th width="273">Value</th><th>Description</th></tr></thead><tbody><tr><td>(integer value)</td><td>publishing Meshcast audio bitrate in kbps</td></tr></tbody></table>

## Details

`&meshcastab` controls the outbound audio bitrate of the [`&meshcast`](../../newly-added-parameters/and-meshcast.md) parameter. Without it, it will be a variable bitrate, up to 32-kbps per channel. With it added, it will be CBR, at the specified bitrate.

## Related

{% content-ref url="../../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="../../meshcast-settings/and-meshcastbitrate.md" %}
[and-meshcastbitrate.md](../../meshcast-settings/and-meshcastbitrate.md)
{% endcontent-ref %}
