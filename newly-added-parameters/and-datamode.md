---
description: Combines a bunch of flags together; no video, no audio, GUI, etc.
---

# \&datamode

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&dataonly`

## Details

Adding the `&datamode` parameter just combines a bunch of flags together; no video, no audio, GUI, etc. It just auto connects with data-channels only open. Useful for MIDI or sensor-data modes or the like, as it lets you connect without user-interaction or pop-up requests.

### Update in V23

The [`&datamode`](and-datamode.md) option was tweaked to work a bit better now when using it to both connect via push and view modes. Data-only mode is an advanced option; it's a bit like doing `&audiodevice=0&videodevice=0&webcam&autostart&hidemenu`, but a bit cleaner and disables a few other common functions that might be considered bloat. Useful perhaps if you want to use only the data-channels of VDO.Ninja, for remote control only operations or sending files.

## Related

{% content-ref url="../midi-settings/midi.md" %}
[midi.md](../midi-settings/midi.md)
{% endcontent-ref %}
