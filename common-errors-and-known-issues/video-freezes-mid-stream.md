# Video freezes mid-stream

If the stream or camera _freezes_ after a while, there could be many reasons. Let's explore some causes and solutions below.

### Camera / USB issues

If cycling the camera to a different camera, or refreshing the camera via the settings menu, fixes the issue, then this normally implies the issue is with the camera or its USB connection.

As a stop-gap solution, the director has the remote control ability to toggle the camera of a guest to unfreeze it. This can be done without the guest's permission even if the `&consent` flag is added to the guest's URL ahead of time. In a pinch, this can at least give the director some comfort to go live, fixing any stuck camera within a few seconds themselves, versus asking the guest to refresh their page.

If not using a group room, the publisher of a stream can also refresh their own camera via the settings menu, and clicking the refresh icon next to the camera.

![](<../.gitbook/assets/image (97).png>)\


To fix the problem though, a bit of troubleshooting may be needed.  More often than not, if using a USB 3.x camera, the cause is a USB-related issue.

* Try a different USB 3.0 cable; ideally a short cable that conforms to the USB 3.1 specification or newer.
* Do not plug any USB camera into a USB hub, dock, or use it alongside other high-bandwidth USB devices.&#x20;
* Try a different USB port; try them all if needed; a blue USB 3.0 port is normally required.
* Reduce the frame rate and/or resolution of the camera. Lowering the bandwidth over the USB connection may help. 1280x720 @ 30fps is recommend trying, if possible.
* Update the drivers on the computer, especially those for the USB controller and camera. Update the operating system as well, if needed, re-installing old drivers if possible.
* If using an AMD motherboard, update the BIOS of your motherboard, and perhaps set your PCIe lane speed to Gen3, instead of Gen4.
* If using a laptop in particular, ensure the USB port is not set to go to sleep; this would be a Windows setting. Also, enabling _Performance Mode and being plugged into the wall,_ may help as well.  See the below images:

![](<../.gitbook/assets/image (108).png>)![](<../.gitbook/assets/image (89).png>)

### Internet /connection issues

\
If the issue is not fixed by toggling your camera, make sure your internet connection is stable and you're device is not overloaded. Bad connections, network firewalls, or VPNs can cause the video to lose connection and then reconnect, causing the picture to appear to freeze for several seconds or longer. &#x20;

VDO.Ninja requires a solid Internet connection with no interfering services to work its best. On some networks, especially during prime-time evening hours of the day, connections can drop out for seconds at the time constantly.&#x20;

Mobile devices may also have the video freeze for a few moments at a time if switching between cellular networks and WiFi networks, but in these cases things will auto-reconnect within a few seconds normally.

Services like [https://speedify.com](https://speedify.cm) can offer a VPN with bonding, designed for streaming, and it can help avoid network issues on mobile networks, where IP addresses or wireless connections constantly are changing.

### iPhone specific issues

Regarding mobile, iOS users can only send video to 3 viewers at a time if using the H264 hardware encoder.  Newer versions of VDO.Ninja will try to keep track of how many H264 streams are being used, and revert to VP8-software-based encoding when the hardware encoders are maxed out, however VP8 encoding can cause iPhones to get very warm. If forcing H264 with an iPhone or iPad, and you max them out, you might cause videos to freeze or go black though.\
\
View links and scenes can sometimes can use an iPhone H264's encoder, even if the video isn't visible in OBS. If having issues, try to avoid forcing the H264 encoder or using it sparingly for only the active sources. If using \&broadcast mode, only the director and scenes could possibly contribute to using an H264 encoder; other guests won't have access to the guest's video stream, so they won't count towards this H264 encoder total.

### H264 specific issues

Some Windows computers that can offer H264 hardware encoding with AMD or Nvidia GPUs run into the same limitations that an iPhone device may have.  That is, if more than 2 or 3 video streams are being published that use H264 encoding, the hardware encoder on those devices may fail.

If someone if using OBS to publish H264 video via RTMP using Nvidia's NVenc, while also publishing H264 video to VDO.Ninja, conflicts may arise, and video streams may fail. This shouldn't happen really, but in theory, it's something to be aware of.
