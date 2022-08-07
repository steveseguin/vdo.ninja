---
description: Sets whether audio auto-normalization is ON or OFF
---

# \&autogain

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ag`

## Options

| Value | Description |
| ----- | ----------- |
| 0     | Off         |
| 1     | On          |

## Details

Auto-normalization is ON by default in VDO.Ninja.

You can turn off auto-normalization by adding `&autogain=0` to a source link (guest). If you are using [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md), auto-normalization gets turned off. You can enable it again with `&proaudio&autogain=1`.

You can also switch it on or off via the audio settings. If you want the guests to be able to change the audio settings by themselves, use [`&mediasettings`](../newly-added-parameters/and-mediasettings.md) on the guests' link, as per default only the director can change the audio settings of the guests.

![](<../.gitbook/assets/image (90) (2).png>)

Your browser will try to keep optimum audio levels.

## Related

{% content-ref url="../newly-added-parameters/and-screenshareautogain.md" %}
[and-screenshareautogain.md](../newly-added-parameters/and-screenshareautogain.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/audio-parameters/and-audiogain.md" %}
[and-audiogain.md](../advanced-settings/audio-parameters/and-audiogain.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/upcoming-parameters/and-volume.md" %}
[and-volume.md](../advanced-settings/upcoming-parameters/and-volume.md)
{% endcontent-ref %}
