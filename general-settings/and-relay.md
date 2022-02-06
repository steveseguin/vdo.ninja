---
description: Forces TURN relay server into use
---

# \&relay

## Aliases

* `&private`
* `&privacy`

## Details

Forcing relay mode is provided for testing and emergency purposes. It will increase latency; sometimes by a lot.

Alternatives to relay mode include:

* Using wired Ethernet instead of Wi-Fi will also reduce packet loss.
* A VPN service, like Speedify, will likely be better than using a TURN server.

Uses of relay mode include:

* Can potentially reduce packet loss with some guests on bad connections.
* Has the advantage of hiding your IP address from peers.

You can [deploy your own TURN server](https://github.com/steveseguin/obsninja/blob/master/turnserver.md) if intending to use this feature a lot.

Please feel free to donate to OBS.Ninja to help support the provided TURN servers.\
Current TURN servers are deployed in North America and Germany.\
TCP/UDP on port 443.

{% hint style="info" %}
More information on what is TURN [here](https://en.wikipedia.org/wiki/Traversal\_Using\_Relays\_around\_NAT).
{% endhint %}

## Related

{% content-ref url="turn.md" %}
[turn.md](turn.md)
{% endcontent-ref %}
