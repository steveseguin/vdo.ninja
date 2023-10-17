---
description: >-
  When a relay candidate is selected, the connection is being forwarded
  (securely) via a hosted TURN relay server, rather than directly via peer to
  peer. This can add latency and limit the video quality
---

# Relay candidate being selected

There's many reasons why your computer&#x20;





### Cellular connections

If on cellular, some cellular providers will configure the system to not support peer to peer networking or UDP-traffic. Some others will also throttle UDP-traffic, which is what VDO.Ninja uses, and they may stop the UDP-traffic entirely after a few seconds or moments.

* Use a VPN service, such as Speedify, and consider enabling TCP encapsulation mode if UDP throttling is an issue. If you host a VPN service yourself, perhaps near your studio host computer, you can minimize performance and latency concerns
* Change networks

### Browser issues, settings, or extension

A common cause is a browser setting or extension that is causing the issue.

* Try a different browser, such as Firefox, Chrome, or Edge
* Update your browser
* Try incognito mode
* Disable your browser extensions or disable security options; some can block webRTC
* Allow IP leaking in your browser settings or extension
* Ensure WebRTC is not disabled in your browser
* De-Googled browsers or highly secured/privacy focused browsers can cause issues

### Other common causes with potential solution

These issues can be hard to judge, especially if they are issues on the remote guest's side

* Corporate firewalls blocking webRTC or UDP traffic
  * Ask your IT department for a solution, perhaps be given an isolated network space.
  * Use a VPN, preferably something hosted close by to reduce performance issues
* PFSense firewalls will block webRTC or UDP traffic.
  * Modify your firewall settings to allow those two options.
* Symmetrical firewalls, such as with some fiber internet services, may cause issues.
  * Contact your ISP if this is the case.
* Strict security software installed
  * Try from a different computer on the same network to see if its a local software issue
* Endless other reasons...

### Doubled up NAT firewalls

In the following example diagram. we see a Main Router, a travel router, smartphone, production laptop, and a gaming desktop.&#x20;

<figure><img src="../.gitbook/assets/image (1).png" alt="" width="333"><figcaption><p>An example diagram, for reference</p></figcaption></figure>

The smartphone and the production laptop will be able to make a direct peer to peer connection, obtaining HOST candidates, since they are connected to the same router.

The gaming desktop however will struggle to make a peer to peer connection with the laptop on the other router, since they are on different networks. As a result, the connection might end up going thru the relay server, on the Internet, which is a disappointing result given the opportunity for a much better connection.

To fix such a scenario,&#x20;

* Replace the travel router with an ethernet switch and if needed, a wireless access point for the smartphone to connect to; all systems are on the same network.
* Enable an point the travel router's DMZ at the production laptop's local IP address; this makes the travel router transparent to the gaming desktop.
* Move all devices to the same router, using the main router or the travel router\* for all devices.

\*Assuming you connect the gaming laptop to the travel router instead, another issue might occur, and that is any VDO.Ninja user you try to connect to on the Internet may end up in relay mode with you.  We can solve this issue potentially by putting our main router into bridge mode, which is often available as an option on cable modems in its gateway settings.

### Final words

Identifying which client is the problem can go a long way to troubleshooting.

Don't be afraid to try from different networks, computers, browsers, or other remote clients.

Join the discord if still stuck and need help: [https://discord.vdo.ninja ](https://discord.vdo.ninja)

