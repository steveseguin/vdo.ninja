---
description: Like &sink, but selects the audio output device
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

Matches on "string contains"; lower case, with underscores marking special characters or spaces.

[`&sink`](and-sink.md) takes priority, if used, and [`&sink`](and-sink.md) is more strict in matching.  While `&outputdevice` matches on the device name, `&sink` matches on the device ID.

`&outputdevice=labelname` is consistent across domains / cookie sessions, while [`&sink=deviceid`](and-sink.md) isn't.

if parameter's value is left blank, it hides the option to change the output device, including under the settings cog.

There is a site available that generates the `&outputdevice` value for you, based on devices found on your local system. Find that web-based tool here: [https://vdo.ninja/devices](https://vdo.ninja/devices)

## Related

{% content-ref url="and-sink.md" %}
[and-sink.md](and-sink.md)
{% endcontent-ref %}
