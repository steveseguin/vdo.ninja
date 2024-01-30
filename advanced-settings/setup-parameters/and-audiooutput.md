---
description: Like &sink, but selects the default audio output device
---

# \&audiooutput

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&outputdevice`
* `&od`

## Options

Example: `&audiooutput=Cable_Input`

<table><thead><tr><th width="186">Value</th><th>Description</th></tr></thead><tbody><tr><td>(string value)</td><td>partial string that matches the device's label/name</td></tr><tr><td><code>Cable_Input</code></td><td>will match against "CABLE Input" (VB-Audio Virtual Cable). Use any other string to match against other device names.</td></tr><tr><td>(no value given)</td><td>hides the option to change the output device, including under the settings cog</td></tr></tbody></table>

## Details

`&audiooutput` lets you set the default audio output device, based on its name.

Matches on "string contains", so a partial string of the device name is enough. Use lower case, with underscores replacing special characters or spaces.

[`&sink`](../view-parameters/and-sink.md) takes priority, if used, and [`&sink`](../view-parameters/and-sink.md) is more strict in matching.  While `&audiooutput` matches on the device name, `&sink` matches on the device ID.

`&audiooutput=labelname` is consistent across domains / cookie sessions, while [`&sink=deviceid`](../view-parameters/and-sink.md) isn't.

If the parameter's value is left blank, it hides the option to change the output device, including under the settings cog.

{% hint style="info" %}
Visit [vdo.ninja/devices](https://vdo.ninja/devices) to find the available device IDs and device names on your system.

Device IDs are specific to VDO.Ninja's domain, while device names are not.

This web-based tool will also auto-create links for you, just by clicking on the respective device.
{% endhint %}

You can change the audio output device dynamically via the settings menu.\
![](<../../.gitbook/assets/image (137).png>)

In Version 22 of VDO.Ninja you can change the audio output device of each video feed individually via `Right-Click -> Audio Destination` on the video feed.\
![](<../../.gitbook/assets/image (147).png>)

### Electron Capture

You can specify an audio output device via the Electron Capture app's command line using this URL parameter  (when used in conjunction with VDO.Ninja).\
\
Example: \
\
`electron.exe --url="https://vdo.ninja/?view=guest1&outputdevice=mixer_usb"`

## Related

{% content-ref url="../view-parameters/and-sink.md" %}
[and-sink.md](../view-parameters/and-sink.md)
{% endcontent-ref %}
