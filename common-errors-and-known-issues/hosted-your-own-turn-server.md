# Hosted your own TURN server?

For a guide on deploying your own TURN server on a Ubuntu server, see the below link: [https://github.com/steveseguin/vdo.ninja/blob/master/turnserver.md](https://github.com/steveseguin/vdo.ninja/blob/master/turnserver.md)

The benefits of a turn server include Increased security when actively used (less chance of IP leaking) and better network compatibility. Without a TURN server, about 10% of remote guests will not be able to connect with each other. In some cases, at the cost of added latency, a TURN server can also provide better video quality by means of forcing TCP data transfer.

I do offer a basic TURN server for VDO.Ninja users, but it is costly to operate and maintain. Deploying your own can offer better reliability and it frees up potential resources for other VDO.Ninja users. Please do not abuse it.

Google Cloud offers a free small server for life, so it’s possible to do this for free, so long as you keep it all private. GCP also often comes with a $300 free credit tier, even though GCP is a bit expensive for heavy usage in the long-run. It doesn't support IPv6 either, but it does have a good network backbone (\~20-cents per gig).

Twilio offers a paid TURN server service, which works well, but it's hard to setup for non-coders and it is twice the cost of Google to operating (40-cents per gig).

Another alternative to a TURN server is to bypass the NAT firewall that your OBS computer uses. You can do this in the network's router settings, normally by setting the DMZ to point to the IP address of your computer. This is dangerous, as it exposes you to the internet, but without a firewall you are less likely to need a STUN or TURN server.

Another option is to run OBS in the cloud on a virtual workstation, where you can open specific ports without the concern of a personal-computer hack. Some guests will still need a TURN server, but the likelihood is dramatically reduced.

You can also have remote guests who are needing a TURN server to install a VPN, like Speedify, which can bypass firewalls and other issues that might otherwise require a TURN server. Enabling TCP-mode within Speedify or other VPN service can also help combat packet loss, at the cost of added latency.

If going the VPN route, you also have the ability to secure your privacy/IP-address more securely; in some cases, more so than even a TURN server. See this article for more information there: [https://www.expressvpn.com/webrtc-leak-test](https://www.expressvpn.com/webrtc-leak-test)
