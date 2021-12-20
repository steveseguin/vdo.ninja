---
description: >-
  Share your webcam, virtual-camera, and audio source from using VDO.Ninja
  inside OBS
---

# Share webcam from inside OBS

By default, you can't select your webcam in an OBS dock or browser source. This can be changed by adding a command-line parameter to the OBS launch shortcut.

Within Windows, we can right-click the OBS launch icon or app icon, right click the "OBS Studio" option, and then click Properties. This will provide us the launch properties window.

![](<../.gitbook/assets/image (101) (1).png>)

We want to add `--enable-media-stream` to the Target field; we want to add this after the quotations, and not inside them. See below for an example.

![](<../.gitbook/assets/image (111).png>)

From there, we are good to go. We can add a dock to OBS or a browser source, and we should be able to now activate our webcam source, such as the built-in OBS virtual webcam.

If we use the following VDO.Ninja URL as a dock source, we can have VDO.Ninja auto-start every time, create a new link that you can share with others. This link is setup to auto-select the OBS virtual camera and the first VB virtual audio cable, if one is available.&#x20;

`https://vdo.ninja?webcam&vd=obs&ad=virtual&autostart&cover`

![Dockable VDO.NInja, with automatic virtual webcam sharing as an option.](<../.gitbook/assets/image (94).png>)

![](<../.gitbook/assets/image (87) (1).png>)
