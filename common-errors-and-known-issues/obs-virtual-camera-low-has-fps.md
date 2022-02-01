---
description: >-
  Why are the resolution and framerate sometimes not the same as my OBS output
  settings?
---

# OBS Virtual Camera has low FPS

If you open an OBS Virtual Camera device in VDO.Ninja before starting the output in OBS, the OBS virtual camera will default to 1080p 30fps. If you start OBS first, it will use whatever is set as the Output resolution and framerate in OBS Studio's options, under Settings -> Video.\
\
So, make sure the set OBS to 60-fps and then start the OBS Virtual camera before starting Chrome and/or VDO.Ninja. If you don't do this, you may be capturing at 30-fps max.

![](<../.gitbook/assets/image (85).png>)

You may also have low frame rates if you are using the OBS virtual camera straight from OBS rather than by adding a filter to the video source. Filters may reduce the frame rate by 30% or so in my testing. Instead, considering opening two instances of OBS instead, if that is needed.

Of course, frame rates with VDO.Ninja can also be low if you don't have the video bitrate set high enough; for gaming, you might want to consider adding [`&videobitrate=20000`](../advanced-settings/viewer-parameters/bitrate.md) to the view link. You can also try different video codecs, such as [`&codec=h264`](../advanced-settings/viewer-parameters/codec.md). If you are on a WiFi or weak Internet connection, that also can limit the frame rate of a stream due to heavy packet loss.&#x20;
