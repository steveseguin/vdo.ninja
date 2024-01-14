---
description: >-
  For those on macOS, if the camera works in Safari, but not Chrome, try the
  following options
---

# Camera works in Safari; not Chrome

### Check if its VDO.Ninja specific or browser-wide

Often the camera will not just fail ot load in VDO.Ninja, but fail to load with any web app in Chrome or browser.

You can confirm its not VDO.Ninja specific by going to the following page and seeing if the camera works with this simple camera app: [https://webrtc.github.io/samples/src/content/devices/input-output/](https://webrtc.github.io/samples/src/content/devices/input-output/)

If it fails only within VDO.Ninja, make sure you've enabled the Camera and Microphone permissions for VDO.Ninja.

<figure><img src="../.gitbook/assets/image (1) (1) (1) (1).png" alt=""><figcaption><p>Make sure VDO.Ninja has access to the camera and microphone</p></figcaption></figure>

### Close other apps or restart the computer

Sometimes another app is using the camera, and closing all other apps or restarting the operating system can fix it up. You cannot use your camera in OBS and in Chrome at the same time, for example.

### Force close the camera app

You can try running the following from your Terminal in MacOS:

```
sudo killall appleh13camerad
sudo killall VDCAssistant 
sudo killall AppleCameraAssistant
```

You can also close the camera app in MacOS via&#x20;

```
Apple Logo > Force Quit > Select All Apps > (find 'Camera process') -> Force Quit.  
```

### Turn off hardware acceleration

In Chrome, you can turn off "Use hardware acceeleration when available" in the `chrome://settings/system` page. You'll want to restart the browser after

### Make sure Chrome has access to your microphone and camera

Go to your Security & Privacy page in your MacOS settings, select the privacy tab, and make sure Google Chrome has access to your camera and microphone.

### Reinstall Chrome

Do a full and complete uninstall of Chrome and then re-install. Perhaps try using the Chrome Beta version.  Also make sure not to have any browser extensions install, as they can conflict.

### Try a different camera

Maybe your camera is not working or compatible, for whatever reason. Try a different camera and see if it works.

### Update or reinstall your macOS

As a last resort, reinstalling the system fresh might be an option.
