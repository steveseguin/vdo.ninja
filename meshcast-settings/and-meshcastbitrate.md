---
description: Option to change outbound video bitrate of the &meshcast parameter
---

# \&meshcastbitrate

Meshcast Option / Sender-Side Option! ([`&meshcast`](../newly-added-parameters/and-meshcast.md), [`&push`](../source-settings/push.md))

## Aliases

* `&mcbitrate`
* `&mcb`

## Options

| Value           | Description                               |
| --------------- | ----------------------------------------- |
| (integer value) | publishing meshcast video bitrate in kbps |

## Details

Adding `&meshcastbitrate` to the publisher's side together with [`&meshcast`](../newly-added-parameters/and-meshcast.md) gives the option to change the video bitrate for Meshcast.

Example usage: `https://vdo.ninja/?meshcast&meshcastbitrate=2000`

Increased the default bitrate of [`&meshcast`](../newly-added-parameters/and-meshcast.md) from like 500-kbps to max of 3200-kbps; will probably change as the feature evolves and becomes more customizable.

The default Meshcast bitrate is normally set to around 2400-kbps.

Each guest will see a Meshcast video at the same bitrate and resolution as everyone else. It's the same video stream to everyone in the room, control center, view links, and scenes. This is unlike the [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md), which varies the bitrate per video that guests see based on the number of guests in the room; [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) and [`&videobitrate`](../advanced-settings/video-bitrate-parameters/bitrate.md) will not impact the bitrate of a Meshcast stream, nor will [`&scale`](../advanced-settings/view-parameters/scale.md) change its resolution.

## Related

{% content-ref url="../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="and-meshcastcodec.md" %}
[and-meshcastcodec.md](and-meshcastcodec.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/meshcast-parameters/and-meshcastaudiobitrate.md" %}
[and-meshcastaudiobitrate.md](../advanced-settings/meshcast-parameters/and-meshcastaudiobitrate.md)
{% endcontent-ref %}
