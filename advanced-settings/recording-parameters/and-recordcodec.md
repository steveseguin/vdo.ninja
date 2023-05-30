---
description: Lets you set the video recording codec
---

# \&recordcodec

Sender-Side Option / Director Option! ([`&push`](../../source-settings/push.md), [`&director`](../../viewers-settings/director.md))

## Aliases

* `&rc`

## Options

Example: `&recordcodec=h264`

<table><thead><tr><th width="139">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>h264</code></td><td>request the h264 codec </td></tr><tr><td><code>vp8</code></td><td>request the VP8 codec </td></tr><tr><td><code>vp9</code></td><td>request the VP9 codec</td></tr><tr><td><code>av1</code></td><td>request the AV1 codec</td></tr></tbody></table>

## Details

Adding `&recordcodec` to a source or director link lets you set the video recording codec (saving to disk mode; ala [`&record`](and-record.md)). The container format is still webm, and not all codecs are going to be supported, but things will fail back to vp8 if not supported. Main reason for this is because vp8 on chrome for android kinda stinks, so at least you have an option to tinker with things now.

As a guest or source side don't forget to add [`&record`](and-record.md) to the URL to get the record button.

## Related

{% content-ref url="and-record.md" %}
[and-record.md](and-record.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/codec.md" %}
[codec.md](../view-parameters/codec.md)
{% endcontent-ref %}

{% content-ref url="and-pcm.md" %}
[and-pcm.md](and-pcm.md)
{% endcontent-ref %}
