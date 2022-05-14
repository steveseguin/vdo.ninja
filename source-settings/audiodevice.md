---
description: Pre-configures the selected audio device
---

# \&audiodevice

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&adevice`
* `&ad`

## Options

| Value         | Description                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| 0             | disable audio source automatically. No option to change it during setup is provided.                                 |
| 1             | auto-select the default audio. No option to change it will be allowed.                                               |
| cable\_output | will match against "CABLE Output (VB-Audio Virtual Cable). Use any other string to match against other device names. |

## Details

It can be changed after the connection has been established.\
Useful for helping a remote guest skip-past the complex setup of their camera/audio.\
\
You can pass a string name to auto-select an audio device that has a label containing that same string.\
\
You can pass a device ID as well; see [vdo.ninja/devices](https://vdo.ninja/devices) to see the device IDs (specific to VDO.Ninja's domain)\
\
Setting this option to `0` will also disable the guest's microphone, potentially allowing for guest connections that have no video or audio. You might do this if you needed midi-only transport, hidden IFRAME control, or just to chatting.



{% hint style="info" %}
See [vdo.ninja/devices](https://vdo.ninja/devices) to see the device IDs and device names. DeviceIDs are specific to VDO.Ninja's domain, while device names are not. \
\
This web-based tool will also auto-create links for you, just by clicking on the respective device.
{% endhint %}

##

## Related

{% content-ref url="and-nosettings.md" %}
[and-nosettings.md](and-nosettings.md)
{% endcontent-ref %}

{% content-ref url="videodevice.md" %}
[videodevice.md](videodevice.md)
{% endcontent-ref %}
