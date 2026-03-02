---
description: Troubleshooting guide for Video lag grows over time in VDO.Ninja and OBS with likely causes and practical fixes.
---

# Video lag grows over time

Video lag that goes over time typically hints at a CPU being overloaded; it might not be able to handle the capture resolution or the load required to encode video for several viewers at once.

\
Some users report this issue happens when using the Streamlabs Virtual Camera, but not when using their webcam or screen share. For others, it might commonly happen if using an older laptop, like an Intel-based Apple MacBook, where they thermal throttle performance after a short while.

## Solutions:

### Reduce quality

Using `&quality=2` and a reduced bitrate by viewers can lower the load

### Meshcast

Using Meshcast (\&meshcast) or self-hosting your own MediaMTX server (\&mediamtx) can allow the publisher to relay their video thru a broadcast server, reducing the number of encodes on that computer to one; rather than potentially serveral

### Get a faster computer and plug-in

Laptops that run on battery power will run at reduced performance, so make sure you are plugged into the AC wall outlet. If that doesn't help, try running your apps in performance mode (rather than battery saver), and if that still doesn't work, consider getting a new computer.  8-core or faster is suggested, but it will depend on your needs.

### If the issue is only with the Streamlabs or OBS Virtual camera

Loading the virtual camera into the Electron Capture app ([https://electroncapture.app](https://electroncapture.app)) will give you the built-in option to full-window the virtual camera. This makes it super easy to screen share the window using VDO.Ninja, and this should bypass any performance problems caused by trying to load the virtual camera directly as a webcam source.\
\
When opening the Electron Capture app, it will auto-detect a virtual camera device, and offer you the option to full-window it.

<figure><img src="../.gitbook/assets/image (1) (1) (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

For reference, these are the devices that get auto-detected by the Electron Capture app:

```
    "OBS Virtual Camera"
    "Streamlabs Desktop Virtual Webcam"
    "vMix Video"
    "Blackmagic"
    "NDI Video
```

