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

It will normally take an integer value in the range of `1` to `255`, at least for a Logitech webcam, but will vary based on the camera / device you are using. On Android, it's a specific time value, represented as exposure time, often in milliseconds.

VDO.Ninja already tries to auto-save camera settings for android devices that support video settings, but for desktop browsers, it does not. Using these new values though you can manually set things to auto-configure as you want.

These settings will apply to ALL video devices though, not just a specific one. If a setting isn't supported by your camera or browser, it will just fail quietly, and not apply. You'll see an error in the console log though.

## Shutter Speed

On Android/Chrome , the `exposureTime` value is often loosely consider the same as shutter speed. Depending on what the camera driver reports, it might be in seconds of milliseconds. To be safe,  you might want to try a few different exposure times, look at the current frame rate, and deduce your own look-up-chart. See [https://vdo.ninja/supports](https://vdo.ninja/supports) for other support values.

| Shutter Speed (photography) | `exposureTime` (seconds) | `exposureTime` (milliseconds) |
| --------------------------- | ------------------------ | ----------------------------- |
| 1/8000 s                    | 0.000125                 | 0.125 ms                      |
| 1/4000 s                    | 0.00025                  | 0.25 ms                       |
| 1/2000 s                    | 0.0005                   | 0.5 ms                        |
| 1/1000 s                    | 0.001                    | 1 ms                          |
| 1/500 s                     | 0.002                    | 2 ms                          |
| 1/250 s                     | 0.004                    | 4 ms                          |
| 1/125 s                     | 0.008                    | 8 ms                          |
| 1/60 s                      | 0.0167                   | 16.7 ms                       |
| 1/30 s                      | 0.0333                   | 33.3 ms                       |
| 1/15 s                      | 0.0667                   | 66.7 ms                       |
| 1/8 s                       | 0.125                    | 125 ms                        |
| 1/4 s                       | 0.25                     | 250 ms                        |
| 1/2 s                       | 0.5                      | 500 ms                        |
| 1 s                         | 1.0                      | 1000 ms                       |

{% hint style="warning" %}
* Firefox and Safari may not support this feature.
* Not all cameras/smartphones will support this option
{% endhint %}

You can check the video settings menu as to whether a device supports a certain feature or what value ranges are support; you can also check it out here [https://vdo.ninja/supports](https://vdo.ninja/supports).

## Related

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}
