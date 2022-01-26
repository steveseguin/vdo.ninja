---
description: >-
  Outputs the audio to the specified audio output device, rather than the
  default
---

# \&sink

## Options

| Value          | Description |
| -------------- | ----------- |
| (string value) | device id   |

## Details

{% hint style="danger" %}
Device IDs are tied to the browser + domain + cookie session combination.
{% endhint %}

Outputs the audio to the specified audio output device, rather than the default.

Designed to be used in conjunction with [https://vdo.ninja/electron.](https://vdo.ninja/electron)

You can find out the string value of your audio outputdevice here: [https://vdo.ninja/devices](https://vdo.ninja/devices)

## Related

{% content-ref url="and-outputdevice.md" %}
[and-outputdevice.md](and-outputdevice.md)
{% endcontent-ref %}
