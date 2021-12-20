# Is the VDO.Ninja server down?

The "V" in VDO.Ninja, in the top left, will go red as an indication that the client cannot talk to the VDO.Ninja server. It will _NOT_ try to reconnect automatically, although that is a coming feature I will add eventually.

If on mobile and you tab away from the site, the server connection may be lost.

If the O is red, then you will need to REFRESH the page to reconnect. I'll fix this hassle eventually.

However, if the server goes down, the video stream will NOT stop if already start, as the video stream does not go thru the server. If the server goes down it just means that no one new can connect to the stream anymore, but if already connected, you are fine. I may also fix this in the future, but I don't see the urgency for it.

The video stream happens over a direct peer connection. This connection can be pretty unstable as cellular phones are not the most reliable things in the world. If a video stream dies, it is not the server's fault, but a failure of the peers to hold a reliable connection open.

Auto-reconnecting does depend on the server though. When connected over a high quality LAN , two devices really shouldn't see their connection fail though, but if it happens often, please let me know.

There is a **backup** **server** at[ https://backup.vdo.ninja](https://backup.vdo.ninja) if the main VDO.Ninja does ever go down.
