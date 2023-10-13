---
description: Combines a bunch of flags together; no video, no audio, GUI, etc.
---

# \&datamode

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&dataonly`

## Details

The `&datamode` parameter just combines a bunch of flags together; no video, no audio, GUI, etc. It just auto connects with data-channels only open. Useful for MIDI or sensor-data modes or the like, as it lets you connect without user-interaction or pop-up requests.

## Sample code and example

If looking to use VDO.Ninja for sending data via p2p in your application, there are some projects already doing so, but also provided is a code snippet.

#### Minimal code example

While this code snippet doesn't actually use the `&datamode` parameter, as it was created before it, it achieves the same result using [`&videodevice=0`](../source-settings/videodevice.md) and such.

[https://gist.github.com/steveseguin/15bba03d1993c88d0bd849f7749ea625](https://gist.github.com/steveseguin/15bba03d1993c88d0bd849f7749ea625)

#### Social Stream Ninja

Social Stream is used by thousands of users as a free way to send text messages and image data using VDO.Ninja's p2p data function. The p2p nature of this setup keeps latency and internet usage low when the two connections are on the same LAN, but also provides a NAT firewall bypass for sending messages across the Internet, without the need for websocket servers.

{% embed url="https://socialstream.ninja" %}

### Update in [v23](../releases/v23.md)

The [`&datamode`](and-datamode.md) option was tweaked to work a bit better now when using it to both connect via push and view modes. Data-only mode is an advanced option; it's a bit like doing `&audiodevice=0&videodevice=0&webcam&autostart&hidemenu`, but a bit cleaner and disables a few other common functions that might be considered bloat. Useful perhaps if you want to use only the data-channels of VDO.Ninja, for remote control only operations or sending files.

## Related

{% content-ref url="../midi-settings/midi.md" %}
[midi.md](../midi-settings/midi.md)
{% endcontent-ref %}
