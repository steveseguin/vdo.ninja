---
description: >-
  Sets the audio mode for screen-shares to stereo and changes default audio
  settings to improve audio quality
---

# \&screensharestereo

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&ssproaudio`
* `&sss`

## Options

| Value            | Description                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| (no value given) | It behaves like 3 or 1, depending on if you are a guest or not                                        |
| `0`              | will try to down-mix the screen-share to mono. Does not enable any pro-audio settings                 |
| `1`              | enables it for both push and view (if used on both links)                                             |
| `2`              | enables it just for viewing requests and not publishing requests                                      |
| `3`              | enables it for just publishing requests and not viewing requests                                      |
| `4`              | enables 5.1-multichannel audio support (Experimental and may require a Chrome flag to be set)         |
| `5`              | This is the default if nothing is set. It behaves like 3 or 1, depending on if you are a guest or not |

View [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) for more details.

## Details

Like [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) but for screen-shares. For more information click here:

## Related

{% content-ref url="../advanced-settings/audio-parameters/and-proaudio.md" %}
[and-proaudio.md](../advanced-settings/audio-parameters/and-proaudio.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/stereo.md" %}
[stereo.md](../general-settings/stereo.md)
{% endcontent-ref %}
