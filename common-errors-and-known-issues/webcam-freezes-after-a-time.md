---
description: >-
  Some laptops will put the webcam to sleep for a moment to save power, causing
  freezing
---

# Webcam freezes after a time

If using a laptop with a USB camera, it's possible the the system is putting the camera to sleep for a split second; just enough to cause the video to freeze. This is definitely a possible cause if on a laptop, but might not be an issue for a desktop user.  Enabling performance mode in the Windows power options might help things, but you can also disable USB power savings selectively.



One place to is in the Windows Power Options settings, which you can find in the Power and Sleep settings pane.

![](<../.gitbook/assets/image (96) (1).png>)

You can also try disabling the "Allow the computer to turn off this device to save power" options in the Windows Device Manager for each USB device/host controller. (uncheck them)

![](<../.gitbook/assets/image (117).png>)

If the problem isn't resolved, you can still reload the camera with the refresh button in the VDO.Ninja settings menu when it happens. This just reloads the camera and should fix the problem until it happens again.

The director of a room can also refresh a camera remotely of a guest, when it freezes, via the video settings of the guest.

If it's a common occurrence, you can load the camera into OBS or SnapCamera and then bring the video into VDO.Ninja as a virtual camera device. While VDO.Ninja does try to automatically reconnect devices when they become disconnected, it sometimes isn't alerted by the browser that the camera has glitched. OBS or Snapcamera might handle these conditions better.

Another reason for a camera freezing randomily is that it may be a bad USB 3.0 cable or a USB 3.0 hub that is overloaded with other USB devices already. Plug any camera directly into the back of the computer, on a dedicated USB 3.0 port, with a high quality USB 3.0 or better cable. Unplug other unneeded USB devices.

If this doesn't work, it probably isn't related to your camera, and may be instead related to your network.

For more reasons why a video may freeze during a stream, see the following:

{% content-ref url="video-freezes-mid-stream.md" %}
[video-freezes-mid-stream.md](video-freezes-mid-stream.md)
{% endcontent-ref %}

