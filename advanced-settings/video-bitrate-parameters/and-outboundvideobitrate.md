---
description: Target video bitrate and max bitrate for outgoing video streams
---

# \&outboundvideobitrate

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&ovb`

## Options

Example: `&outboundvideobitrate=4000`

| Value           | Description        |
| --------------- | ------------------ |
| (integer value) | value will be kbps |

## Details

Target video bitrate and max bitrate for outgoing video streams.

Sets the viewer's bitrate and overrides the [`&videobitrate`](bitrate.md) parameter. It won't override the room's total bitrate parameter, as that's a dynamically set bitrate, so **to get higher bitrate in group rooms you still need to use** [`&totalroombitrate`](totalroombitrate.md).

## Related

{% content-ref url="../../source-settings/and-outboundaudiobitrate.md" %}
[and-outboundaudiobitrate.md](../../source-settings/and-outboundaudiobitrate.md)
{% endcontent-ref %}
