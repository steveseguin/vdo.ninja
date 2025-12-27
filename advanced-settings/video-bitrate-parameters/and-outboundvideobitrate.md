---
description: Default target video bitrate for outgoing video streams
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

Target video bitrate for outgoing video streams (sender-side default).

`&outboundvideobitrate` sets the default target for viewers that do not specify [`&videobitrate`](bitrate.md). If the viewer uses `&videobitrate`, their request overrides this default. A sender-side [`&maxvideobitrate`](and-maxvideobitrate.md) still caps the maximum bitrate, regardless of viewer request.

In some cases, `&outboundvideobitrate` is applied via SDP munging, so it can also act as a maximum cap depending on browser/negotiation.

It won't override the room's total bitrate parameter, as that's a dynamically set bitrate, so **to get higher bitrate in group rooms you still need to use** [`&totalroombitrate`](totalroombitrate.md).

## Related

{% content-ref url="../../source-settings/and-outboundaudiobitrate.md" %}
[and-outboundaudiobitrate.md](../../source-settings/and-outboundaudiobitrate.md)
{% endcontent-ref %}
