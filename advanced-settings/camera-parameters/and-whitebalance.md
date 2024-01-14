---
description: Lets you manually pre-set the white balance of the camera/webcam
---

# \&whitebalance

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&wb`

## Options

Example: `&whitebalance=5000`

<table><thead><tr><th width="186">Value</th><th>Description</th></tr></thead><tbody><tr><td>(integer value)</td><td>white balance in Kelvin (5000 to 6500 are typical values)</td></tr></tbody></table>

## Details

Lets you manually pre-set the white balance of the camera/webcam:

It is in Kelvin, so `5000` or `6500` are typical values it will take.

I already currently auto-save camera settings for android devices that support video settings, but for desktop browsers, I am not. Using these new values though you can manually set things to auto-configure as you want.

These settings will apply to ALL video devices though, not just a specific one. If a setting isn't supported by your camera or browser, it will just fail quietly, and not apply. You'll see an error in the console log though.

You can check the video settings menu as to whether a device supports a certain feature or what value; you can also check out [https://vdo.ninja/supports](https://vdo.ninja/supports).

## Related

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}
