---
description: >-
  Option to change outbound screen-share video bitrate of the &meshcast
  parameter
---

# \&mcscreensharebitrate

Meshcast Option / Sender-Side Option! ([`&meshcast`](../newly-added-parameters/and-meshcast.md), [`&push`](../source-settings/push.md))

## Aliases

* `&mcssbitrate`

## Options

| Value           | Description                                            |
| --------------- | ------------------------------------------------------ |
| (integer value) | publishing screen-share meshcast video bitrate in kbps |

## Details

`&mcscreensharebitrate` controls the outbound screen-share video bitrate of the [`&meshcast`](../newly-added-parameters/and-meshcast.md) parameter while screen-sharing via meshcast. It will override the [`&meshcastbitrate`](and-meshcastbitrate.md) if the video is a screen-share.

## Related

{% content-ref url="../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="and-meshcastbitrate.md" %}
[and-meshcastbitrate.md](and-meshcastbitrate.md)
{% endcontent-ref %}

{% content-ref url="and-mcscreensharecodec.md" %}
[and-mcscreensharecodec.md](and-mcscreensharecodec.md)
{% endcontent-ref %}
