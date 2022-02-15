---
description: Pre-configures the selected audio device
---

# \&audiodevice

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

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-nosettings.md" %}
[and-nosettings.md](../advanced-settings/settings-parameters/and-nosettings.md)
{% endcontent-ref %}

{% content-ref url="videodevice.md" %}
[videodevice.md](videodevice.md)
{% endcontent-ref %}
