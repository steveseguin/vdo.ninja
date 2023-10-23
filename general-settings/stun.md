---
description: Lets you specify a STUN server for webRTC negotiation
---

# \&stun

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Details

This parameter lets you specify a STUN server for webRTC negotiation. The default STUN servers use those provided by Google (and recently also Cloudflare), at `stun:stun.l.google.com:19302`, but with this command you can set your own.

`&stun` will overwrite the existing STUN values provided by VDO.Ninja. If you wish to keep the existing STUN server options, adding additional options, or if you wish to add multiple custom STUN servers, you can use the related [`&addstun`](../newly-added-parameters/and-addstun.md) parameter. This is the same idea, but when used it won't overwrite the existing STUN options.

Using `&stun` and [`&addstun`](../newly-added-parameters/and-addstun.md) together will let you specify two custom STUN servers.

Setting `&stun` to false will clear the default STUN servers.

If your STUN server requires a password, you can pass the STUN server address with semi-comma separated values in the form `&stun=USERNAME;PASSWORD;ADDRESS`

Basic sample usage of `&stun`:

[`https://vdo.ninja/?push&stun=stun:stun4.l.google.com:19302`](https://vdo.ninja/?push\&stun=stun:stun4.l.google.com:19302)

### About STUN servers

A STUN (Session Traversal Utilities for NAT) server is used to discover a device's public IP address and port, especially when it is behind a Network Address Translator (NAT), facilitating peer-to-peer communication in technologies like WebRTC.

If your browser has disabled WebRTC IP leaking, then the STUN servers may be pretty useless, as the only IP your browser will share with other peers is any obtained from the relay server.

Without a STUN server though, you will still share your local IP, the HOST candidate type, as well as any RELAY candidates obtained from available turn servers.

The magic with VDO.Ninja and peer-to-peer webRTC is largely made possible by STUN servers.

### More about SRFLX vs PRFLX candidate modes

When dealing with ICE (Interactive Connectivity Establishment) candidates, you may encounter terms like "srflx" and "prflx," which refer to different types of ICE candidates. ICE is a protocol used for establishing peer-to-peer communication sessions, often for real-time audio and video communication.

1. **srflx (Server Reflexive)**:
   * Server reflexive candidates are created when a device behind a Network Address Translator (NAT) sends a request to a STUN (Session Traversal Utilities for NAT) server. The STUN server then sends a response back, and this response contains a reflexive candidate. This reflexive candidate represents the public IP and port of the NAT device.
   * Srflx candidates are used to traverse NATs and allow the devices on both sides to find a route to communicate through the NAT.
   * Srflx is the most common candidate type seen when making a connection with another remote peer on the Internet, via VDO.Ninja.
2. **prflx (Peer Reflexive)**:
   * Peer reflexive candidates are also a result of communication with a STUN server, but unlike server reflexive candidates, they represent the reflexive address of the remote peer, not the local device. In other words, they are the public IP and port of the other side, as observed by the STUN server.
   * Prflx candidates can be helpful in situations where a WebRTC peer wants to communicate with another peer, and it needs to discover the public address of that peer to establish direct communication.
   * Prflx are not common among VDO.Ninja connections, but may be seen when tethering, using a symmetrical firewall, or other non-common networking setups.

In summary, srflx and prflx candidates both involve the use of STUN servers to discover reflexive addresses, but srflx represents the public address of the local device (behind NAT), while prflx represents the public address of the remote peer. These types of candidates are crucial for WebRTC communication because they help establish peer-to-peer connections across NAT devices and firewalls.

## Related

{% content-ref url="../newly-added-parameters/and-addstun.md" %}
[and-addstun.md](../newly-added-parameters/and-addstun.md)
{% endcontent-ref %}

{% content-ref url="turn.md" %}
[turn.md](turn.md)
{% endcontent-ref %}
