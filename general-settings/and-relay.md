---
description: Forces TURN relay server into use
---

# \&relay

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&private`
* `&privacy`

## Details

Forcing relay mode is provided for testing and emergency purposes. It will typically increase latency; sometimes by a lot.

Alternatives to relay mode include:

* Using wired Ethernet instead of Wi-Fi will also reduce packet loss.
* A VPN service, like Speedify, will likely be better than using a TURN server.

Uses of relay mode include:

* Can potentially reduce packet loss with some guests on bad connections.
* Some peer to peer connections over residential networks struggle, and introducing a relay server can help avoid those issues
* Has the advantage of hiding your IP address from peers.

You can [deploy your own TURN server](https://github.com/steveseguin/obsninja/blob/master/turnserver.md) if intending to use this feature a lot or needing more bandwidth

Please feel free to donate to VDO.Ninja to help support the provided TURN servers.\
\
Currently TURN servers are deployed numerous countries around the world.\
\
Ports that a TURN server may use include 443, 3478, and potentially others.

{% hint style="info" %}
More information on what TURN is [here](https://en.wikipedia.org/wiki/Traversal\_Using\_Relays\_around\_NAT)
{% endhint %}

## Related

{% content-ref url="turn.md" %}
[turn.md](turn.md)
{% endcontent-ref %}
