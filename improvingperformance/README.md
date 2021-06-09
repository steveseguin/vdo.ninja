# WORK IN PROGRESS: FIXING VDO.NINJA PERFORMANCE ISSUES

## SYMPTOMS

<img src="symptoms200.jpg" width="50">

Depending on several factors, you might see

* stuttery video (aka frame drops)
* low frame rates
* video being out of sync with audio (typically video lagging behind audio)

## CULPRITS

<img src="culprits200.jpg" width="50">


The main reason for performance issues are

- **Bandwidth.** Zoom, Teams, etc. use big servers to do all the work while VDO.Ninja is a peer-to-peer system. That's why it can be free and offer lower latency at great quality. Because of this design, in most cases VDO.Ninja will use more bandwidth than the others.
- **CPU.** Higher video quality requires more work by the sending system to encode the video.
- **TURN server.** Depending on the firewall setup of the involved networks, it can be necessary to route the video and audio traffic through a TURN server. This can introduce higher latency.
- **iOS.** Low frame rates from iOS devices in the guest room and control center is normal and by design. iPhones and iPads can only encode a limited amount of video streams at the same time. VDO Ninja works around that by lowering their frame rates to around 1 fps in the guest rooms as well as in the director's control center. Audio in the guest room will be just fine though. This will not affect frame rates viewed in OBS through solo links or in group scenes.

## TOOLS

<img src="tools200.jpg" width="50">


An important tool to help you troubleshoot connections is the stats view that you can open by holding CTRL (Win) or command (Mac) and right clicking on a guest window.

Status information includes:

- remote connection type (*TBD* = TURN server, *ethernet* = local)
- received audio bitrate in kbps
- received video bitrate in kbps 
- packet loss (lower is better, 0 is ideal)
- buffer delay (TBD)
- FPS (frames per second)
- resolution
- codec
- quality linmitation reason (only visible on the sending side, can be bandwidth or CPU)

## BANDWIDTH

<img src="bandwidth200.jpg" width="50">


* **Use ethernet!** Ask your guest to use ethernet. Being on WIFI is the most common reason for bandwidth issues. Avoid WIFI if you can. Being closer to your router can help, but often doesn't. 

* **Stop other traffic sources.** Those include online backups, dropbox, and even youtube or netflix being watched in the other room.

* **Use speedify.com**, a streaming-centric VPN that prioritizes streaming traffic and can bond your ethernet connection with an LTE phone connection.

Video and audio bandwidth used by VDO.Ninja are determined on the receiving side. TBD

## CPU - SENDING SYSTEM

<img src="cpu200.jpg" width="50">

TBD

## CPU - RECEIVING SYSTEM

<img src="cpu200.jpg" width="50">

TBD
