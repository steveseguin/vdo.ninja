---
description: This tells the remote publishers to send keyframes at a specified rate
---

# \&keyframerate

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&keyframeinterval`
* `&keyframe`
* `&kfi`

## Options

Example: `&keyframerate=2000`

| Value           | Description    |
| --------------- | -------------- |
| (integer value) | interval in ms |

## Details

`&keyframerate` tells the remote publishers to send keyframes at a specified rate.

Could be useful if packet loss is causing a lot frame corruption.

If you make it less than 1000-ms, you will face a pretty steep drop in video quality.

It may not work at all if set too low; under 500-ms didn't work at all in my testing.

For short random packet loss, test [`&codec=vp8&vred`](vred.md) separately from `&keyframe`. RED is a negotiation preference for repair payloads; `&keyframe` asks for new reference frames after damage. They solve different parts of packet-loss recovery, and frequent keyframes can add large bitrate bursts.

## Related

{% content-ref url="vred.md" %}
[vred.md](vred.md)
{% endcontent-ref %}
