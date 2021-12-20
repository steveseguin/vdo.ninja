---
description: Disables Screen-sharing as an option.
---

# \&webcam

## Aliases

* `&wc`

## Details

Full-screens the Webcam selection window.

{% hint style="danger" %}
Do not use while on a director page to autostart a camera; `&autostart&vd=video_device` should handle that.
{% endhint %}

If you would still like the guest to have access to the screen-sharing button once they have joined the call, you can force it to appear with the `&ssb` option.  The `&webcam` option by default will hide the screen-share button otherwise.

{% content-ref url="ssb.md" %}
[ssb.md](ssb.md)
{% endcontent-ref %}

Starting with v19 of VDO.Ninja, there is also the `&webcam2` option; a minor UI variant that requires an additional button press, but more clearly preps the guest to the fact they will be sharing their webcam.
