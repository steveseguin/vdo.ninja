---
description: Target video bitrate and max bitrate for outgoing video streams
---

# \&outboundvideobitrate

## Aliases

* `&ovb`

## Options

| Value           | Description        |
| --------------- | ------------------ |
| (integer value) | value will be kbps |

## Details

Target video bitrate and max bitrate for outgoing video streams.

Sets the viewer's bitrate and overrides the `&vb` parameter.  It won't override the room's total bitrate parameter, as that's a dynamically set bitrate, so **to get higher bitrate in group rooms you still need to use `&trb`**.&#x20;

## Related

{% content-ref url="and-outboundaudiobitrate.md" %}
[and-outboundaudiobitrate.md](and-outboundaudiobitrate.md)
{% endcontent-ref %}
