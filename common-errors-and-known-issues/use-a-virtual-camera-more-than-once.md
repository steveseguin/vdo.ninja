---
description: Using Smartphone as Virtual Camera with VDO.Ninja across multiple applications
---

# Use a Virtual Camera more than Once

### Problem

When using your smartphone as a camera via VDO.Ninja, you may want to use the camera feed in multiple applications simultaneously. By default, most video inputs can only be accessed by one application at a time.

If the conflict is specifically between OBS and VDO.Ninja/Chrome trying to open the same physical webcam, see [Camera already in use by OBS or VDO.Ninja](cant-load-camera-both-in-obs-and-vdon.md).

### Solutions

#### 1. OBS Studio Virtual Camera with Multiple VDO.Ninja Streams

OBS Studio has a built-in virtual camera feature with an important limitation:

* **The standard OBS Studio installation only provides ONE virtual camera output**
* However, smartphones on a LAN can often handle sending 2-3 VDO.Ninja streams simultaneously:
  * You can create multiple VDO.Ninja push links from your phone (e.g., one link for OBS, another for StreamLabs)
  * Each application receives its own direct stream from your phone
  * This works well on strong networks and with newer smartphones, though it increases battery usage

This approach allows you to bring separate phone camera streams into different applications (like OBS Studio and StreamLabs) without relying on a single virtual camera.

**Note**: While OBS Studio itself only offers one virtual camera by default, other applications like StreamLabs OBS offer their own virtual cameras. This means you could potentially use both the OBS virtual camera and StreamLabs virtual camera simultaneously for two different outputs.

#### 2. Using Electron Capture App

The Electron Capture app provides a flexible window-capture solution:

* Install Electron Capture from [https://electroncapture.app](https://electroncapture.app/)
* Load VDO.Ninja into Electron Capture
* Multiple applications can capture the Electron Capture window simultaneously

This approach allows you to have multiple applications access your phone's camera feed via window capture, rather than as a virtual camera.

#### 3. Single Browser Method

If all your applications support browser access, this method is simple:

* Open your applications that need camera access in the same browser (Chrome, Firefox, etc.)
* Connect your smartphone to VDO.Ninja in one browser tab
* Open Discord, Google Meet, Microsoft Teams, etc. in other tabs of the same browser
* Each application can access the smartphone camera stream simultaneously

This works because browsers manage camera permissions across all tabs and windows of the same browser instance.

#### 4. NDI Method (Advanced)

For professional setups requiring multiple distinct outputs:

* Connect your smartphone to VDO.Ninja
* Capture in OBS with the NDI plugin installed
* Output NDI streams from OBS
* Use NDI Virtual Input to create virtual cameras from these streams
* Different applications can use these separate virtual camera feeds

#### Future Developments

Multiple virtual cameras may be added to the Electron Capture app in the future, but this feature is not planned for the near term.
