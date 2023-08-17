---
description: Disables camera-sharing as an option
---

# \&screenshare

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ss`

## Details

`&screenshare` will allow the guest to screen share by being directly asked to share a screen or window instead of being taken to the camera/screenshare selection screen.\
![](<../.gitbook/assets/image (1) (1) (1) (2) (1).png>)

Starting with [v19](../release-notes/v19.md) of VDO.Ninja, there is also the [`&screenshare2`](../newly-added-parameters/and-screenshare2.md) option; a minor UI variant that requires an additional button press, but more clearly preps the guest to the fact they will be sharing their screen.

#### Using `&screenshare` with the [Electron Capture App](../steves-helper-apps/electron-capture.md)

When using the Electron Capture App you have to "Elevate Privileges" to be able to share a window or screen. You can enable Elevated Privileges for the Electron App via the command line with `--node true` or in the app by right-clicking and selecting "Elevate Privileges" from the context-menu.

One unique feature about the [Electron Capture App](../steves-helper-apps/electron-capture.md) is that it can auto-select a screen or window when screen-sharing with VDO.Ninja, without user-input.\
For example:\
`&screenshare=1` for the main display\
`&screenshare=2` for the second display\
`&screenshare=discord` for the Discord application\
`&screenshare=googlechrome` for the Chrome Browser

## Related

{% content-ref url="and-webcam.md" %}
[and-webcam.md](and-webcam.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-screenshare2.md" %}
[and-screenshare2.md](../newly-added-parameters/and-screenshare2.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/screen-share-parameters/and-smallshare.md" %}
[and-smallshare.md](../advanced-settings/screen-share-parameters/and-smallshare.md)
{% endcontent-ref %}

{% embed url="https://github.com/steveseguin/electroncapture" %}
