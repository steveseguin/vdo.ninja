---
description: >-
  Can't load camera both in both VDO.NInja and OBS (or other app) at the same
  time
---

# Can't load camera both in OBS and VDON

If using a physicall camera in OBS, or using a physical camera in [VDO.Ninja](https://vdo.ninja/), it can't be used by a second app.

If using the camera with [VDO.Ninja](https://vdo.ninja/), you can use it with other websites within the same browser though. So you can use the web version of Discord with [VDO.Ninja](https://vdo.ninja/); no issues with that.

#### However if you need to load the camera up in two different desktop apps, try the following:

\- Open up a second OBS instance, and load your camera in that instead\
\- Enable its Virtual Camera.\
\- Select the Virtual Camera in [VDO.Ninja](https://vdo.ninja/)\
\- Select the Virtual Camera now also in the first OBS instance (or other app). \
\
Your camera \*may\* now be working in both apps; this has been tested with OBS and VDO.NInja on Windows 11 anyways.

_Example:_&#x20;

<figure><img src="../.gitbook/assets/image.png" alt=""><figcaption><p>Demo of it working</p></figcaption></figure>

#### If that doesn't work, another option that works well:

\- Just pull your video into OBS from VDO.Ninja. It uses up a bit more CPU, but it simplifies things to just use [VDO.Ninja](https://vdo.ninja/) as the source for OBS.\
\- You can also always use the Virtual Camera from OBS to load the VDO.Ninja camera feed into another app.
