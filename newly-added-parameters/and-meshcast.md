---
description: >-
  Triggers the service, causing the outbound audio/video stream to be
  transferred to a hosted server
---

# \&meshcast

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Options

Example: `&meshcast=video`

<table><thead><tr><th width="200">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>audio</code></td><td>Only audio via Meshcast</td></tr><tr><td><code>video</code></td><td>Only video via Meshcast</td></tr><tr><td>(no value given)</td><td>Audio and video via Meshcast</td></tr></tbody></table>

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
Understanding Meshcast as a tool for VDO.Ninja
{% endembed %}

As a director you can also select the Meshcast server on the bottom left of the director's control center. This method will show you the current load on a server, so you can avoid servers that are over-capacity.\
\
![](<../.gitbook/assets/image (2) (3) (1) (1).png>)\


You can also specify the Meshcast server based on geographic timezone values using the [`&tz=300`](and-tz.md) parameter, where the value passed is the UTC timezone value in negative minutes. Eastern Europe I suppose would be a negative value, while North America would be a positive value. The [`&tz`](and-tz.md) will also use the closest TURN server to that timezone, if needed; just keep in mind that timezones are east/west accurate; not north/south accurate.

Normally during peak-hours, around 7pm, the Internet in general can get slow, and Meshcast servers can occasionally become slow also as a result. Using a Meshcast server that's located in a different timezone, even if on the other side of the world, can sometimes avoid the bottlenecks in your local region, offering better results.

Lastly, if a Meshcast server fails to respond, please contact steve@seguin.email or Steve on discord ([discord.vdo.ninja](https://discord.com/invite/cKkj5nN8pH)) so it can be fixed.

{% embed url="https://youtu.be/-7QsLChfdsE" %}
Meshcast /w VDO.Ninja to host even Larger Rooms
{% endembed %}

### Server Codes

You can select the Meshcast server (region) via URL Parameter, if you want low-level control there:

{% content-ref url="../advanced-settings/meshcast-parameters/and-meshcastcode.md" %}
[and-meshcastcode.md](../advanced-settings/meshcast-parameters/and-meshcastcode.md)
{% endcontent-ref %}

## Related

{% content-ref url="../advanced-settings/meshcast-parameters/" %}
[meshcast-parameters](../advanced-settings/meshcast-parameters/)
{% endcontent-ref %}

{% embed url="https://meshcast.io/" %}
https://meshcast.io/
{% endembed %}
