---
description: Like &sink, but selects the default audio output device
---

# \&outputdevice

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](view.md), [`&scene`](scene.md))

## Aliases

* `&od`
* `&audiooutput`

## Options

| Value          | Description                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| (string value) | partial string that matches the device's label/name                                                                 |
| Cable\_Input   | will match against "CABLE Input (VB-Audio Virtual Cable). Use any other string to match against other device names. |

## Details

This option lets you set the default audio output device, based on its name.

Matches on "string contains", so a partial string of the device name is enough. Use lower case, with underscores replacing special characters or spaces.

[`&sink`](and-sink.md) takes priority, if used, and [`&sink`](and-sink.md) is more strict in matching.  While `&outputdevice` matches on the device name, `&sink` matches on the device ID.

`&outputdevice=labelname` is consistent across domains / cookie sessions, while [`&sink=deviceid`](and-sink.md) isn't.

if parameter's value is left blank, it hides the option to change the output device, including under the settings cog.

{% hint style="info" %}
Visit [vdo.ninja/devices](https://vdo.ninja/devices) to find the available device IDs and device names on your system. \
\
Device IDs are specific to VDO.Ninja's domain, while device names are not. \
\
This web-based tool will also auto-create links for you, just by clicking on the respective device.
{% endhint %}



## Related

{% content-ref url="and-sink.md" %}
[and-sink.md](and-sink.md)
{% endcontent-ref %}
