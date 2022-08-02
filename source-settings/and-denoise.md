---
description: Turn audio noise reduction filter ON or OFF
---

# \&denoise

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&dn`

## Options

| Value | Description |
| ----- | ----------- |
| 0     | Filter Off  |
| 1     | Filter On   |

## Details

Noise suppression reduces background audio noise from your surrounding environment.

Noise suppression is ON by default in VDO.Ninja.

You can turn off noise suppression by adding `&denoise=0` to a source link (guest). If you are using [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md), echo-cancellation gets turned off. You can enable it again with `&proaudio&denoise=1`.

You can also switch it on or off via the audio settings. If you want the guests to be able to change the audio settings by themselves, use [`&mediasettings`](../newly-added-parameters/and-mediasettings.md) on the link of the guests, as per default only the director can change the audio settings of the guests.

![](<../.gitbook/assets/image (91).png>)

## Related

{% content-ref url="noisegate.md" %}
[noisegate.md](noisegate.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-screensharedenoise.md" %}
[and-screensharedenoise.md](../newly-added-parameters/and-screensharedenoise.md)
{% endcontent-ref %}
