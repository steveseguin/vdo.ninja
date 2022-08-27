---
description: Target audio bitrate and max bitrate for outgoing audio streams
---

# \&outboundaudiobitrate

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&oab`

## Options

| Value           | Description                    |
| --------------- | ------------------------------ |
| (integer value) | outbound audio bitrate in kbps |

## Details

Target audio bitrate and max bitrate for outgoing audio streams.

Allows the Director to set their outbound audio bitrate to be shared with guests at something like 160-kbps, while having the guests still be able to share their audio between other guests at the default audio bitrate of around 32-kbps. If the guest sets the audio bitrate ([`&proaudio=1`](../advanced-settings/audio-parameters/and-proaudio.md) or [`&audiobitrate=200`](../advanced-settings/view-parameters/audiobitrate.md)) on the view link will override the publisher's `&outboundaudiobitrate` parameter.

## Related

{% content-ref url="../advanced-settings/audio-parameters/and-proaudio.md" %}
[and-proaudio.md](../advanced-settings/audio-parameters/and-proaudio.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/audiobitrate.md" %}
[audiobitrate.md](../advanced-settings/view-parameters/audiobitrate.md)
{% endcontent-ref %}

{% content-ref url="and-outboundvideobitrate.md" %}
[and-outboundvideobitrate.md](and-outboundvideobitrate.md)
{% endcontent-ref %}
