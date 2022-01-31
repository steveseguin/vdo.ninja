# \&recordcodec

## Aliases

* `&rc`

## Options

| Value | Description             |
| ----- | ----------------------- |
| h264  | request the h264 codec  |
| vp8   | request the VP8 codec   |
| vp9   | request the VP9 codec   |
| av1   | request the AV1 codec   |

## Details

Adding `&recordcodec` to a source or director link lets you set the video recording codec (saving to disk mode; ala [`&record`](../source-settings/and-record.md)). The container format is still webm, and not all codecs are going to be supported, but things will fail back to vp8 if not supported. Main reason for this is because vp8 on chrome for android kinda stinks, so at least you have an option to tinker with things now.

As a guest or source side don't forget to add [`&record`](../source-settings/and-record.md) to the URL to get the record button.

## Related

{% content-ref url="../source-settings/and-record.md" %}
[and-record.md](../source-settings/and-record.md)
{% endcontent-ref %}

{% content-ref url="../viewers-settings/codec.md" %}
[codec.md](../viewers-settings/codec.md)
{% endcontent-ref %}

{% content-ref url="../source-settings/and-pcm.md" %}
[and-pcm.md](../source-settings/and-pcm.md)
{% endcontent-ref %}
