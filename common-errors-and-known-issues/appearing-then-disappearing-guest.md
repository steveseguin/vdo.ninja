# Appearing then disappearing guest

In this case, it sounds like the remote guest is failing to create a webRTC peer connection with the director.\
\
The handshake works, so each other knows someone is trying to join, but they are unable to find themselves.  The system will time out and try again, when this occurs, causing the guest's box to continually partially appear, and then go away again.\
\
This is sometimes caused by blocked UDP traffic, where the TURN relay servers are unable to help for some reason.  Security software, privacy-focused VPNs, corporate firewalls, and certain browser extensions are common causes.\
\
Sometimes other guests in the room will see the problematic guest, and in this case, there could just be a network routing issue.  Peer to peer connections across the Internet are not common, with most clients these days talking to servers instead, so residential to residential connections may occasionally fail due to bad Internet routes or caches.

Things that often work:

* Switch browsers, with Firefox being a common winner when Chrome fails. Perhaps also try Edge or even the Electron Capture app.
* Use a VPN designed for streaming, such as Speedify.com. Free VPNs exist as Chrome extensions, if you need something quick.
* Switch networks; if using WiFi, switch to Cellular, and vice-versa.
* If behind a corporate firewall, have the IT administrators allow webRTC traffic, or use a different
* Meshcast.io is a server-based webRTC system, and it may work in place of VDO.Ninja for simple needs.
* If nothing above works, join the Discord support community for personalized help at https://discord.vdo.ninja

\
