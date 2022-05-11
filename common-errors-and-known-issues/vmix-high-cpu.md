---
description: Some ideas on how to reduce total system load on a VMix system using VDO.Ninja
---

# VMix High CPU

VMix is a great studio mixer, although some users find the CPU load can get a bit high at times.  Below are some options that might help to reduce that load, with solutions generally targetting VMix, but could perhaps be applicable to other studio mixing software

* Browser sized at 1920x1080 can stress VMix out; try 1280x720 or lower to reduce the total load.
* Ensure GPU hardware acceleration is enabled; particularly for the browser source.
* Using the H264 codec may reduce CPU ; adding \&codec=h264 to the view link may help.
* Disabling de-interlacing, sharpening, or aliasing of the browser source might free up some load.
* Electron Capture or Vingester.app can be used instead of the VMix browser source; they can use window capture, which can reduce the CPU load.
* If you have a spare computer, Vingester.app has a VDO.Ninja to NDI output option, which can perhaps help with distributing load if the browser source is causing issues.
* Lowering the frame rate of the browser source and incoming VDO.Ninja videos might help reduce CPU load.  \&maxframerate=30, for example, on the guest link can help cap the frame rate.
* The director of a room can adjust settings of incoming videos via the video settings options under advanced settings. This includes the max resolution, frame rate, and aspect ratio of incoming videos.
* Updating your graphics card drivers can sometimes help.
* If acting as a VDO.Ninja director, consider hosting the director on a different computer than VMix. If not possible, consider using \&meshcast with the director's link to use \&meshcast to help reduce the CPU load when in larger group rooms.
* Try to use your local camera as a source in VMix, rather than bringing your local video into Vmix with VDO.Ninja. Using a virtual camera, like Snapcamera, OBS Virtual Camera, Manycam, or such can allow a webcam to be accessed using the browser and VMix at the same time.
* Avoid using multiple group scene link, unless solo-view links. Instead, consider using the VDO.Ninja mixer app to use a single group scene link, switching between different layouts using the mixer interface. (The Mixer app is relatively new, as of May 2022, so still undergoing feature enhancements).

There are additional other options available to reduce CPU / GPU / Network load when using VDO.Ninja; this list is specific to VMix issues.
