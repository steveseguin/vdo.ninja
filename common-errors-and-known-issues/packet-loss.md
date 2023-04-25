---
description: When data is lost or delayed during transfer between peers
---

# Packet Loss

Packet loss can cause audio distortion, clicking, and is the cause for numerous video problems. WiFi is often the main contributor to packet loss. Virtually any low-latency audio streaming application will recommend not using WiFi is possible for this very reason. Ethernet is preferable and worth investing in an Ethernet cable and adapter.

That said, there are things to try still if WiFi is needed or packet loss persists:

* Make sure the guest is plugged in and powered; battery mode can cause issues.
* try to sit closer to the WiFi router and try to limit the traffic on the network; the more that's going through the air, the more packet loss.
* If the guest can use the 4G LTE instead of WiFi (tethered via USB) , that will often be much better than WiFi.
* The guest can also Tether their 4G LTE /w their WiFi using bonding apps like Speedify or with hardware from Peplink; these services can give you more control over network settings.
* Try to have the guest use Chrome, Edge, or Electron Capture rather than Safari -- preferably in Incognito mode.
* Disable any Anti-virus software.
* Turning down the audio bitrate ([`&audiobitrate=128`](../advanced-settings/view-parameters/audiobitrate.md)) will be less prone to issues vs something high, like 256-kbps.
* You can add [`&enhance`](../advanced-settings/view-parameters/enhance.md) on the viewer side to try to prioritize the audio over the video.
* Host your OBS and VDO.Ninja on a cloud server, like Amazon AWS Workspaces or Google GCP.
* Forcing the TURN relay servers into use may help at times; adding [`&relay`](../general-settings/and-relay.md) to the links can enable this mode. It may add some latency though.

I have a video talking about packet loss, with details on how to setup Speedify as well: [https://www.youtube.com/watch?v=je2ljlvLzlYAnd](https://www.youtube.com/watch?v=je2ljlvLzlYAnd)

There is a speedtest that the user can try out here to give them feedback on their packet loss: [https://vdo.ninja/speedtest](https://vdo.ninja/speedtest)
