---
description: Lets you disable the option to select audio when screen sharing
---

# \&screensharevideoonly

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Aliases

* `&ssvideoonly`
* `&ssvo`
* `&screenaudio=0`
* `&screenaudio=false`

## Details

Added to the publisher's side, it disables the option to select audio when screen sharing. It will not impact the microphone or other audio options.

In Electron Capture, this also disables System Audio when screen sharing starts automatically with `&autostart`. A separately selected microphone remains available. For example:

`https://vdo.ninja/?push=YourStreamID&screenshare&screenaudio=0&autostart&audiodevice=YourVirtualMic`

For the `screenaudio` alias, only `0` and `false` disable screen-share audio. Omitting it, using it without a value, or setting it to `1` or `true` leaves the existing behavior unchanged. It does not override an explicit `&screensharevideoonly`, `&ssvideoonly`, or `&ssvo` option.

## Related

{% content-ref url="../source-settings/screenshare.md" %}
[screenshare.md](../source-settings/screenshare.md)
{% endcontent-ref %}
