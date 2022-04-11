---
description: Option to change outbound audio bitrate of the &meshcast parameter
---

# \&meshcastab

Meshcast Option / Sender-Side Option! ([`&meshcast`](../newly-added-parameters/and-meshcast.md), [`&push`](../source-settings/push.md))

## Aliases

* `&mcaudiobitrate`
* `&mcab`

## Options

| Value           | Description                               |
| --------------- | ----------------------------------------- |
| (integer value) | publishing meshcast audio bitrate in kbps |

## Details

`&meshcastab` controls the outbound audio bitrate of the [`&meshcast`](../newly-added-parameters/and-meshcast.md) parameter. Without it, it will be a variable bitrate, up to 32-kbps per channel. With it added, it will be CBR, at the specified bitrate.

## Related

{% content-ref url="../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="and-meshcastbitrate.md" %}
[and-meshcastbitrate.md](and-meshcastbitrate.md)
{% endcontent-ref %}
