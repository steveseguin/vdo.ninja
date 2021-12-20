---
description: >-
  Sometimes 4G or 5G, or even some corporate networks, block VDO.Ninja from
  working
---

# Works on WiFi but not on 4G

When using 4G or 5G Internet, some network providers have firewalls or network routing settings that make it very hard to establish direct peer to peer connections with others.

If a director of a room, you may see guests join and then disconnected repeatedly, with video and audio never actually showing. This means the peer connection has failed, and is constantly retrying. The issue should go away though if the guest user changes networks; switching to WiFi for example or a different ISP provider.

VDO.Ninja uses TURN servers to bypass most 4G-related network issues, offering solutions to network traversal, TCP, UDP, and IPv6 routing issues. Sometimes, in rare cares, even this isn't enough.

There are solutions usually.

1. One option is to try adding `&privacy&tz=-60` or `&privacy&tcp&tz=300` to the guest's URL.  This attempts to force the TURN servers into action, with a couple different configurations set. Sometimes, especially in the case of active firewalls, this can fix the issue.
2. Using speedify.com on the mobile device often will solve the problem. It's a paid service that's free to try, but it's well worth buying if it works. It creates a VPN designed for live video that solves many issues mobile 4G devices commonly face.&#x20;
3. If you're an advanced user, setting up your own TURN server that is tweaked to your specific scenario and problem is an option. Please do let me know what works for you in this regard though, as I'd be keen to add such support to VDO.Ninja's TURN network also.&#x20;

{% hint style="info" %}
Please note, if you have self-deployed VDO.Ninja onto your own servers, it becomes your responsibility to deploy your own TURN servers or purchase TURN services from a third-party. Any TURN server access provided currently by VDO.Ninja for private deployments is out of generosity and isn't a guaranteed service.
{% endhint %}

