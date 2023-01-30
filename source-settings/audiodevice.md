---
description: Pre-configures the selected audio device
---

# \&audiodevice

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&adevice`
* `&ad`

## Options

Example: `&audiodevice=Cable_Output`

| Value                   | Description                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `0`                     | disable audio source automatically; no option to change it during setup is provided.                                 |
| `1` \| (no value given) | auto-select the default audio; no option to change it will be allowed.                                               |
| `Cable_Output`          | will match against "CABLE Output (VB-Audio Virtual Cable). Use any other string to match against other device names. |

## Details

It can be changed after the connection has been established. Useful for helping a remote guest skip-past the complex setup of their camera/audio.\
![](<../.gitbook/assets/image (138).png>)

You can pass a string name to auto-select an audio device that has a label containing that same string.

You can pass a device ID as well; see [vdo.ninja/devices](https://vdo.ninja/devices) to see the device IDs (specific to VDO.Ninja's domain).

Setting this option to `&audiodevice=0` will also disable the guest's microphone, potentially allowing for guest connections that have no video or audio. You might do this if you needed midi-only transport, hidden IFRAME control, or just to chatting.

{% hint style="info" %}
See [vdo.ninja/devices](https://vdo.ninja/devices) to see the device IDs and device names. DeviceIDs are specific to VDO.Ninja's domain, while device names are not. \
\
This web-based tool will also auto-create links for you, just by clicking on the respective device.
{% endhint %}

There is a toggle in the director's room which adds `&ad` to the guest's invite link.![](<../.gitbook/assets/image (95) (2).png>)

### Update in V22

`&audiodevice` can accept multiple audio devices now. `&audiodevice=cam,cable` for example, will select the camlink and virtual audio cable devices as an audio source when joining.

`&audiodevice={device name}` will now also now show the selected audio devices before joining, while `&audiodevice=1` or `&audiodevice=0` will still hide the option to change or see audio devices.

## Related

{% content-ref url="and-nosettings.md" %}
[and-nosettings.md](and-nosettings.md)
{% endcontent-ref %}

{% content-ref url="videodevice.md" %}
[videodevice.md](videodevice.md)
{% endcontent-ref %}
