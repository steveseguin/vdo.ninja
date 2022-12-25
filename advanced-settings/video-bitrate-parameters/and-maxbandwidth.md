---
description: Judges the available bandwidth of a sender's connection
---

# \&maxbandwidth

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

| Value                 | Description                                                                         |
| --------------------- | ----------------------------------------------------------------------------------- |
| (percentage 1 to 100) | the connection never uses more than that amount of the available reported bandwidth |

## Details

Made a new bitrate option called `&maxbandwidth`, which differs from other commands as it leverages a chromium (chrome/edge/brave/electron) feature to judge the available bandwidth of a sender's connection. Passing a value to it as the sender (a percentage; 1 to 100 ideally), you can try to ensure the connection never uses more than that amount of the available reported bandwidth.

So the notion is, if you want to set the invite link bitrate to 50-mbps, but one guest only has only a 20-mbps connection, `&maxbandwidth=80` will try to limit the bitrate to around 16-mbps. I sometimes will tell people to set the bit rate to about 80% of what their connection can allow, as higher than that can result in some frame stutter when there is packet loss, since the connection lacks headroom to recover. This command will try to do it automatically, for all the viewers of a stream.

My goal here is to use it with the [Mixer App](../../steves-helper-apps/mixer-app.md) or [Versus.cam](../../steves-helper-apps/versus.cam.md), so eSports users can crank out high bitrates with less tinkering per guest. I have no idea how well it will work in practice so far.

The upcoming and standalone replacement vor vdo.ninja/monitor:\
[https://versus.cam/](https://versus.cam/)

## Related

{% content-ref url="and-outboundvideobitrate.md" %}
[and-outboundvideobitrate.md](and-outboundvideobitrate.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-outboundaudiobitrate.md" %}
[and-outboundaudiobitrate.md](../../source-settings/and-outboundaudiobitrate.md)
{% endcontent-ref %}
