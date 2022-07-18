---
description: Disables camera-sharing as an option
---

# \&screenshare

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ss`

## Details

`&screenshare` will allow the guest to screen share by being directly asked to share a screen or window instead of being taken to the camera/screenshare selection screen.

Starting with [v19](../release-notes/v19.md) of VDO.Ninja, there is also the [`&screenshare2`](../newly-added-parameters/and-screenshare2.md) option; a minor UI variant that requires an additional button press, but more clearly preps the guest to the fact they will be sharing their screen.

#### Using \&screenshare with the [Electron App](https://github.com/steveseguin/electroncapture)

When using the [Electron App](https://github.com/steveseguin/electroncapture) to screen share a window/screen you have to "Elevate Privilege" via the command line with `--node true` or starting it manually via `Right-Click` -> `Elevate Privilege`.

In the [Electron App](https://github.com/steveseguin/electroncapture) you can pre define the window or screen you want to share.\
For example:\
`&screenshare=chrome` chooses the Chrome Browser\
`&screenshare=1` chooses your main screen\
`&screenshare=2` chooses your second screen

## Related

{% content-ref url="and-webcam.md" %}
[and-webcam.md](and-webcam.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-screenshare2.md" %}
[and-screenshare2.md](../newly-added-parameters/and-screenshare2.md)
{% endcontent-ref %}

{% embed url="https://github.com/steveseguin/electroncapture" %}
