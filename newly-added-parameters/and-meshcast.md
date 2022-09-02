---
description: >-
  Triggers the service, causing the outbound audio/video stream to be
  transferred to a hosted server
---

# \&meshcast

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Details

[Meshcast ](https://meshcast.io/)is a free-to-use server-based service for broadcasting low-latency video streams. It can be used with VDO.Ninja in a couple different ways, either as an iFrame or as a peer-2-peer replacement for guest and director streams. It can be used to help lower system requirements of VDO.Ninja for some users or use cases.

Adding `&meshcast` to a guest or director link will trigger the service, causing the outbound audio/video stream to be transferred to a hosted server, which then distributes the stream to all the viewers. This adds a bit of latency to the stream and reduces the theoretical privacy, but it implies the guest/director does not need to encode and upload multiple videos, lowering CPU load and bandwidth usage.

Viewers will automatically attempt to use the server-based feed over the peer-to-peer feed. Peer to peer is still used to send data though, and it can be optionally be used for sending audio p2p (lower latency).

Unlike the [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) flag, which uses IFrames, this new server-side mode does not; it's more deeply integrated. Echo cancellation should work as a result.

If publishing using `&meshcast`, I don't bother to show the viewer count, as it won't be accurate currently anyways; instead I just say you're broadcasting. I'll try to improve this in the future.

![](<../.gitbook/assets/image (93) (1) (1) (1).png>)

There is a toggle in the director's room which adds `&meshcast` to the guest's invite link.\
![](<../.gitbook/assets/image (105) (1).png>)

Steve made a YouTube video explaining all the Meshcast stuff:

{% embed url="https://youtu.be/YxduINMXw1M" %}
[https://youtu.be/YxduINMXw1M](https://youtu.be/YxduINMXw1M)
{% endembed %}

## Options

You can select the Meshcast server via URL Parameter. If you don't set it, the best one will be chosen automatically.

| Value        | Description     |
| ------------ | --------------- |
| (servercode) | Meshcast server |
| `cae1`       | Canada-East     |
| `use1`       | USA-East        |
| `usw1`       | USA-West        |
| `fr1`        | France          |
| `de1`        | Germany         |

Full server list: [https://meshcast.io/servers.json](https://meshcast.io/servers.json)

As a director you can select the Meshcast server on the bottom left of the director's control center\
![](<../.gitbook/assets/image (2).png>)

## Related

{% content-ref url="../advanced-settings/meshcast-parameters/" %}
[meshcast-parameters](../advanced-settings/meshcast-parameters/)
{% endcontent-ref %}

{% embed url="https://meshcast.io/" %}
https://meshcast.io/
{% endembed %}
