# How does it work

[VDO.Ninja](https://vdo.ninja) relies heavily on [WebRTC](https://webrtc.org/), a secure peer-to-peer streaming technology that exists in most modern web browsers. Most of the VDO.Ninja code runs completely within your browser, although some server-side components are hosted to help facilitate an initial ‘handshake’ between connecting peers.

As video data is streamed directly from one peer to the other, extremely low-latency and very high video quality is possible. If both peers are on the same Local Area Network (LAN), data transfer will stay local to your network, saving your bandwidth.

Since applications like OBS have a built-in browser, you can use VDO.Ninja to stream low-latency video directly into the application without any downloads or user accounts. It's possible to start streaming within seconds to OBS and many modern applications -- you can even watch VDO.Ninja streams on a Tesla EV or within the Unity game engine.

Essentially, the basic usage of VDO.Ninja makes use of two URLs; one for **input** (i.e. PUSH) and one as an **output** (i.e. VIEW).

The **PUSH** URL is loaded up in the browser on the **remote device**, which obtains access to the device's camera and microphone.

To view the stream, you load up the corresponding **VIEW** URL in another browser, from anywhere. That's it. The video will begin playing in a full-window, without pesky watermarks or visual distractions, ready for professional-level video capture.

Since collaboration is a big part of live streaming video, VDO.Ninja also offers [group chat rooms](help/how-does-group-chat-work.md), allowing for more complex options and controls over multiple streams at a time. What's possible with VDO.Ninja can be rather overwhelming, as the feature set does not end there, but the basic defaults are designed to satisfy the needs of most users.

One thing that may not be intuitive at first is the use of [URL-parameters](advanced-settings.md) to control settings, video quality, and many of the other options. URL parameters are used by VDO.Ninja in the same conceptual way that command-line parameters are used, such as by FFmpeg. Some URL parameters are set on the VIEW side, while others can be set on the PUSH side to allow for configuration of a standard offering with the opportunity for viewers to further refine their experience.  The documentation is a great resource for finding out more on all the advanced options and how to use them.
