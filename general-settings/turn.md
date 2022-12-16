---
description: Lets you specify a custom TURN server or disable all TURN servers
---

# \&turn

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&director`](../viewers-settings/director.md))

## Options

| Value                        | Description                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------- |
| (user;pwd;turnserveraddress) | Set this TURN server to turnserveraddress with username user and password pwd |
| `false` \| `off`             | Disable the use of the TURN servers                                           |

## Details

Several TURN servers are provided by Steve for free, for now, and these are automatically selected based on your geographic location. You may wish to use your own privately hosted TURN server instead though, and the `&turn` is one flexible way to select it.

### Locations

* Canada
* Germany
* USA
* France/UK

### **Example Usage**

`https://vdo.ninja/?turn=steve;setupYourOwnPlease;turn:turn.vdo.ninja:443&relay`\
``\
``Note the use of `turn:`, and in the case of TLS/SSL, `turns:`

### **More Info**

TURN Servers are designed to help certain users connect when they are behind a firewall or other network restriction. About 1 in 10 users need a TURN server to use VDO.Ninja; if you are having problems, check to see if they are using the TURN server.

Sometimes, rarely, using your own TURN server can improve video quality for some users, if the public network routing is very bad and the TURN server is hosted on a high-quality private network, like Google Cloud. Details are provided in the code repo no how to deploy your own (turnserver.md).

TURN servers are NOT something you can use to share one video stream with multiple viewers. (That is an SFU server, which is out of scope of this article.) A TURN server acts like a middle-man, routing the encrypted data between two peers, mainly when those two peers are unable to speak directly themselves.

Using a TURN server can also hide your IP address from other peers. You will need to use [`&relay`](and-relay.md) to FORCE the TURN server to be enabled, as otherwise the system will still try to use a direct p2p connection, instead of the TURN server. You may want to add turn and relay flags to both the viewer and the sender side, to ensure things are correctly set.

[https://vdo.ninja/speedtest](https://vdo.ninja/speedtest) performs a connection test using the TURN server. It will select the closest public TURN server to you. At peak hours, these TURN servers might have lower performance compared to at off-peak hours, so consider hosting your own TURN server if absolute maximum performance is needed.

You can check to see if you are using the TURN server by checking the connection stats window (`Left-Click` + `CTRL` while viewing a video. In this stats display, "Relay" implies connected to a TURN server. HOST implies connected via a LAN. SRFLX/PRFLX implies connected directly via [STUN](stun.md).

### Installing your own TURN server

Details on how to setup and deploy your own TURN server is here, although there are also plenty of guides online for this, too:

[https://github.com/steveseguin/vdo.ninja/blob/develop/turnserver.md](https://github.com/steveseguin/vdo.ninja/blob/develop/turnserver.md)

It is possible to store credentials for your TURN server on a server, pulling them as needed via an API, such as from Twilio's API. It is also possible to hard-code the credentials into the app itself. Both these options require self-deploying the website code however.

## Related

{% content-ref url="and-tcp.md" %}
[and-tcp.md](and-tcp.md)
{% endcontent-ref %}

{% content-ref url="../common-errors-and-known-issues/hosted-your-own-turn-server.md" %}
[hosted-your-own-turn-server.md](../common-errors-and-known-issues/hosted-your-own-turn-server.md)
{% endcontent-ref %}

{% content-ref url="and-relay.md" %}
[and-relay.md](and-relay.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-tz.md" %}
[and-tz.md](../newly-added-parameters/and-tz.md)
{% endcontent-ref %}
