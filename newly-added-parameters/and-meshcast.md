---
description: >-
  Will trigger the service, causing the outbound audio/video stream to be
  transferred to a hosted server
---

# \&meshcast

## Details

[Meshcast ](https://meshcast.io)is a free-to-use server-based service for broadcasting low-latency video streams. It can be used with VDO.Ninja in a couple different ways, either as an iFrame or as a peer-2-peer replacement for guest and director streams. It can be used to help lower system requirements of VDO.Ninja for some users or use cases.

Adding `&meshcast` to a guest or director link will trigger the service, causing the outbound audio/video stream to be transferred to a hosted server, which then distributes the stream to all the viewers. This adds a bit of latency to the stream and reduces the theoretical privacy, but it implies the guest/director does not need to encode and upload multiple videos, lowering CPU load and bandwidth usage.

Viewers will automatically attempt to use the server-based feed over the peer-to-peer feed. Peer to peer is still used to send data though, and it can be optionally be used for sending audio p2p (lower latency).

Unlike the [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) flag, which uses iframes, this new server-side mode does not; it's more deeply integrated. Echo cancellation should work as a result.

If publishing using `&meshcast`, I don't bother to show the viewer count, as it won't be accurate currently anyways; instead I just say you're broadcasting. I'll try to improve this in the future.

![](<../.gitbook/assets/image (93).png>)

Steve made a YouTube video explaining all the meshcast stuff:

{% embed url="https://youtu.be/YxduINMXw1M" %}

## Related

* [Meshcast.io](https://meshcast.io)
