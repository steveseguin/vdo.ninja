---
description: Accessing the wide-angle or zoom lens on your camera
---

# Can't select a camera lens on mobile

Some camera lenses are not easily accessible in native mobile applications, and many are not available at all in the browser.

The [native app versions](../steves-helper-apps/native-mobile-app-versions.md) of VDO.Ninja may sometimes offer additional lens options not found in the browser, but adding all options is still a work-in-progress.

On Android, you can try Firefox Mobile as well as Chrome or other browsers to see if your camera lens appears there. Some manufacturers offer better support for their cameras than others, making lens selection more accessible to browsers and app developers.

Sometimes you can zoom in and the cameras will switch automatically, but this is rare.

### Digital zoom

There is the option to digitally zoom with VDO.Ninja, [\&effects=7](../source-settings/effects.md), will allow you to adjust the digital zoom via the browser. This isn't an ideal solution, but it may work in some cases where optical zoom isn't available.

### Smartphones that support more than one rear camera

Below is a non-exhaustive short list of smartphones that appear to support more than one rear camera in the browser:

* Samsung Galaxy S23 v13.0 supports 2 front, 2 rear
* Samsung Galaxy S24 v14.0 supports 2 front, 2 rear
* Samsung Galaxy S24 Ultra v14.0 supports 2 front, 2 rear
* Samsung Galaxy S22 Ultra v12.0 supports 2 front, 2 rear
* Samsung Galaxy A52 v11.0 supports 2 front, 2 rear\

* Huawei P30 v9.0 (/w MS Edge) supports 1 front, 4 rear \

*   iPhone 15 Pro v17.0 and iPhone 15 Pro Max supports:

    * back triple camera
    * back dual wide camera
    * back ultra wide camera
    * back dual camera
    * back camera
    * back telephoto camera
    * front camera


*   iPhone 15 v17.4 supports:

    * back dual wide camera
    * back ultra wide camera
    * back camera
    * front camera


*   iPhone 14 v16 supports:

    * back camera
    * back ultra wide camera
    * desk view camera
    * back dual wide camera
    * front camera


* iPhone 14 Pro v16 supports
  * back camera
  * back telephoto camera
  * back ultra wide camera
  * desk view camera
  * front camera\

* iPhone 13 v16 supports
  * back camera
  * back ultra wide camera
  * desk view camera
  * front camera

This list was based on results obtained using BrowserStack.com, so cloud-hosted devices. There may be errors with the results obtained, however you can check yourself on BrowserStack usually for free if a camera is supported or if the results have changed.

<div align="left">

<figure><img src="../.gitbook/assets/image (237).png" alt="" width="252"><figcaption><p>The iPhone 15 Pro offers extensive camera options</p></figcaption></figure>

</div>

### WHIP mode

VDO.Ninja supports the [WHIP](../advanced-settings/whip-parameters/and-whip.md) streaming protocol, so if there is a native camera app that has proper WHIP-output support, and has the camera features you are looking for, using that can be used with VDO.Ninja.

Currently WHIP support in VDO.Ninja is a bit experimental, but the publishing URL for a WHIP-enabled device to stream to is:

_`https://whip.vdo.ninja/STREAMIDHERE`_

To view a WHIP stream then on VDO.Ninja, have open the following link in your browser:

_`https://vdo.ninja/alpha/?whip=STREAMIDHERE`_

### Lens adapter

There are camera lens adapters available for smartphones for fairly cheap; anywhere from $3 on aliexpress to $20 on Amazon. While not the best solution, it may be a solution available in a pinch that works across all mobile applications and services.

<div align="left">

<figure><img src="../.gitbook/assets/image (3) (2) (1).png" alt=""><figcaption></figcaption></figure>

</div>

### USB  external cameras

With the newest development builds of the Android native app of VDO.Ninja, many external (USB/UVC) cameras are supported.\
\
With iPhones/iPads, USB-based models (iPhone 15 Pro) seem to support some USB video devices as well, via the USB 3.0 port.\
\
Developments around USB/External camera support is ever evolving.
