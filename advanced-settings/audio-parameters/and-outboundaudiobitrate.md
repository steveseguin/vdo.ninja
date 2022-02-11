---
description: Target audio bitrate and max bitrate for outgoing audio streams
---

# \&outboundaudiobitrate

## Aliases

* `&oab`

## Options

| Value           | Description        |
| --------------- | ------------------ |
| (integer value) | value will be kbps |

## Details

Target audio bitrate and max bitrate for outgoing audio streams.

Allows the Director to set their outbound audio bitrate to be shared with guests at something like 160-kbps, while having the guests still be able to share their audio between other guests at the default audio bitrate of around 32-kbps. If the guest sets the audio bitrate ([`&stereo=1`](stereo.md) or [`&ab=200`](audiobitrate.md)), it will override the publisher's `&oab` parameter.

## Related

{% content-ref url="../../source-settings/and-outboundvideobitrate.md" %}
[and-outboundvideobitrate.md](../../source-settings/and-outboundvideobitrate.md)
{% endcontent-ref %}
