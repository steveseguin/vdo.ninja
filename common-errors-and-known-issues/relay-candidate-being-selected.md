---
description: >-
  When a relay candidate is selected, the connection is being forwarded
  (securely) via a hosted TURN relay server, rather than directly via peer to
  peer. This can add latency and limit the video quality
---

# Relay candidate being selected

There's many reasons why one client might not be able to make a direct connection with another client, resulting in their connections being relayed thru a TURN server, or perhaps failing entirely. Being in relay mode can sometimes hurt quality, add latency, and use up limited Internet bandwidth.

Some common reasons, with some solutions, are listed below.

### Cellular connections

If on cellular, some cellular providers will configure the system to not support peer to peer networking or UDP-traffic. Some others will also throttle UDP-traffic, which is what VDO.Ninja uses, and they may stop the UDP-traffic entirely after a few seconds or moments.

* Use a VPN service, such as Speedify, and consider enabling TCP encapsulation mode if UDP throttling is an issue. If you host a VPN service yourself, perhaps near your studio host computer, you can minimize performance and latency concerns
* Change networks

### Browser issues, settings, or extension

A common cause is a browser setting or extension that is causing the issue.

* Try a different browser, such as Firefox, Chrome, or Edge
* Update your browser
* Try incognito mode
* Disable your browser extensions or disable security options; some can block WebRTC
* Allow IP leaking in your browser settings or extension
* Ensure WebRTC is not disabled in your browser
* De-Googled browsers or highly secured/privacy focused browsers can cause issues

### Other common causes with potential solution

These issues can be hard to judge, especially if they are issues on the remote guest's side

* Corporate firewalls blocking WebRTC or UDP traffic
  * Ask your IT department for a solution, perhaps be given an isolated network space.
  * Use a VPN, preferably something hosted close by to reduce performance issues
  * Host your own TURN / STUN server, close to or within the corporate network, and specify it to be used within VDO.Ninja.
* pfSense firewalls will block WebRTC or UDP traffic.
  * Modify your firewall settings to allow those two options.
* Symmetrical firewalls, such as with some fiber internet services, may cause issues.
  * Contact your ISP if this is the case.
* Strict security software installed
  * Try from a different computer on the same network to see if its a local software issue
* If using WHIP / WHEP, some third party applications may not support NAT traversal, lacking STUN server support, as it can be a lot of adding coding work. In these cases, VDO.Ninja might use a TURN server to assist things along, but it's far from ideal.
  * Host your own TURN server locally, and specify it in VDO.Ninja.
  * Reach out to the developers / support staff and ask for help
* STUN servers are being block. The STUN servers are hosted by Google, so if they are blocked, TURN might be the fallback.&#x20;
  * You can specify your own STUN servers if needed via URL parameters
* Endless other reasons...

### Doubled up NAT firewalls

In the following example diagram. we see a Main Router, a travel router, smartphone, production laptop, and a gaming desktop.&#x20;

<figure><img src="../.gitbook/assets/image (1) (1) (1) (1) (1) (1).png" alt="" width="333"><figcaption><p>An example diagram, for reference</p></figcaption></figure>

The smartphone and the production laptop will be able to make a direct peer to peer connection, obtaining HOST candidates, since they are connected to the same router.

The gaming desktop however will struggle to make a peer to peer connection with the laptop on the other router, since they are on different networks. As a result, the connection might end up going thru the relay server, on the Internet, which is a disappointing result given the opportunity for a much better connection.

To fix such a scenario, some options:

* **RECOMMENDED SOLUTION:** Connect all devices to the main router instead.
  * Or alternatively, remove the main router, and connect all devices to the travel router instead, if feasible.
* **RECOMMENDED SOLUTION:** Replace the travel router with an ethernet switch, and if needed, add a wireless access point for the smartphone to connect to.
* Enable and point the travel router's DMZ at the production laptop's local IP address; this makes the travel router transparent to the gaming desktop. Just be sure to disable the DMZ mode when done.
* Move all devices to the same router, using the main router or the travel router\* for all devices.\
  \
  \*Assuming you connect the gaming laptop to the travel router instead, another issue might occur, and that is any VDO.Ninja user you try to connect to on the Internet may end up in relay mode with you. We can solve this issue potentially by putting our main router into bridge mode, which is often available as an option on cable modems in its gateway settings.

The recommended solutions have the benefit of ensuring all the clients, even clients on the Internet, can establish a peer to peer connection with any other client on the network. This wouldn't be the case for example if we simply used the DMZ mode, as the smartphone would not be able to connect to clients on the Internet in a direct p2p mode.

### Ports used by VDO.Ninja

TCP 443 and 3478 UDP are the most important ports to have open, if behind a strict firewall. These allow for WebSockets, STUN, and TURN, but they alone will not allow for direct peer to peer traffic.

The actual media in direct peer to peer WebRTC (RTP/RTCP packets) is sent over random high-numbered UDP ports. These ports are negotiated by the ICE (Interactive Connectivity Establishment) process, which uses the STUN/TURN servers to help figure out how the peers can connect to each other.

If you want to allow peer to peer traffic, and are dealing with something more complex than a NAT firewall, like PFSense Firewall, UDP ports 49152–65535 are commonly suggested to opened to allow peer to peer traffic. You might need to open lower as well though, along with port TCP 443 and UDP 3478.

These high-numbered UDP ports used are dynamically chosen by the browser, and there isn't much control on VDO.Ninja's side to control that. Since you are also dealing with peer to peer mode, unless you know the IP address of each guest you intend to connect to, you can't easily unblock based on IP address either. This isn't the case if using a TURN relay server of course, but that's not direct p2p then.

### Final comments and advice

Identifying which client is the problem can go a long way to troubleshooting.

Don't be afraid to try from different networks, computers, browsers, or other remote clients.

Advanced users can always just deploy their own TURN server locally or nearby, and specify it via VDO.Ninja. Hosting it yourself can reduce latency, improve performance, and improve security (no IP leaking). Using relay mode doesn't need to be a bad thing!

Join the Discord if still stuck and need help: [https://discord.vdo.ninja ](https://discord.vdo.ninja)
