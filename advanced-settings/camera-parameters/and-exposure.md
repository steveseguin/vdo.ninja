---
description: Lets you manually pre-set the exposure of the camera/webcam
---

# \&exposure

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&exposure=128`

<table><thead><tr><th width="270">Value</th><th>Description</th></tr></thead><tbody><tr><td>(integer value; <code>1</code> to <code>255</code>)</td><td>exposure of the camera for a Logitech webcam</td></tr><tr><td>(integer value; <code>1</code> to <code>8000</code>)</td><td>exposure of the camera for a Pixel 4a Android smartphone</td></tr></tbody></table>

## Details

Lets you manually pre-set the exposure of the camera/webcam:

It will normally take an integer value in the range of `1` to `255`, at least for a Logitech webcam, but will vary based on the camera / device you are using.

VDO.Ninja already tries to auto-save camera settings for android devices that support video settings, but for desktop browsers, it does not. Using these new values though you can manually set things to auto-configure as you want.

These settings will apply to ALL video devices though, not just a specific one. If a setting isn't supported by your camera or browser, it will just fail quietly, and not apply. You'll see an error in the console log though.\
\
Firefox and Safari may not support this feature, and not all cameras/smartphones offer exposure controls.

You can check the video settings menu as to whether a device supports a certain feature or what value ranges are support; you can also check it out here [https://vdo.ninja/supports](https://vdo.ninja/supports).

## Related

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}
