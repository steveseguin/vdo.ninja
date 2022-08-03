---
description: Automatic echo-cancellation is ON or OFF
---

# \&aec

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ec`
* `&echocancellation` (only on [alpha](https://vdo.ninja/alpha/))

## Options

| Value | Description                               |
| ----- | ----------------------------------------- |
| 0     | Turns OFF the automatic echo-cancellation |
| 1     | Turns ON the automatic echo-cancellation  |

## Details

Automatic echo-cancellation is ON by default in VDO.Ninja.

You can turn off echo-cancellation by adding `&aec=0` to a source link (guest). If you are using [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md), echo-cancellation gets turned off. You can enable it again with `&proaudio&aec=1`.

You can also switch it on or off via the audio settings. If you want the guests to be able to change the audio settings by themselves, use [`&mediasettings`](../newly-added-parameters/and-mediasettings.md) on the link of the guests, as per default only the director can change the audio settings of the guests.

![](<../.gitbook/assets/image (92).png>)

May need to be disabled to use [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) on some older browsers.

## Related

{% content-ref url="../advanced-settings/audio-parameters/and-proaudio.md" %}
[and-proaudio.md](../advanced-settings/audio-parameters/and-proaudio.md)
{% endcontent-ref %}

{% content-ref url="noisegate.md" %}
[noisegate.md](noisegate.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-screenshareaec.md" %}
[and-screenshareaec.md](../newly-added-parameters/and-screenshareaec.md)
{% endcontent-ref %}
