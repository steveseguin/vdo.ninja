---
description: >-
  Outputs the audio to the specified audio output device, rather than the
  default
---

# \&sink

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](view.md), [`&scene`](scene.md))

## Options

Example: `&sink=1dee4206f5deb75973e33f7078d4c1539782e29e255799d59b8b61a855d17bea`

| Value          | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| (string value) | device ID ([https://vdo.ninja/devices](https://vdo.ninja/devices)) |

## Details

{% hint style="danger" %}
Device IDs are tied to the browser + domain + cookie session combination.
{% endhint %}

Outputs the audio to the specified audio output device, rather than the default.

Designed to be used in conjunction with [https://vdo.ninja/electron.](https://vdo.ninja/electron)

You can find out the string value of your audio output device here: [https://vdo.ninja/devices](https://vdo.ninja/devices)

## Related

{% content-ref url="../setup-parameters/and-audiooutput.md" %}
[and-audiooutput.md](../setup-parameters/and-audiooutput.md)
{% endcontent-ref %}
