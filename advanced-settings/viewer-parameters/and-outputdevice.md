---
description: Like &sink, but selects the audio output device
---

# \&outputdevice

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

[`&sink`](and-sink.md) takes priority, if used, and \&sink is more strict in matching.

`&outputdevice=labelname` is consistent across domains / cookie sessions, while `&sink=deviceid` isn't.

if parameter's value is left blank, it hides the option to change the output device, including under the settings cog.

## Related

{% content-ref url="and-sink.md" %}
[and-sink.md](and-sink.md)
{% endcontent-ref %}
