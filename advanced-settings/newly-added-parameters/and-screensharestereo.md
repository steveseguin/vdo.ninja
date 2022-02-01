---
description: >-
  Sets the audio mode for screen-shares to stereo and changes default audio
  settings to improve audio quality
---

# \&screensharestereo

## Aliases

* `&ssproaudio`
* `&sss`

## Options

| Value            | Description                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| 0                | will try to down-mix the screen-share to mono. Does not enable any pro-audio settings                 |
| 1                | enables it for both push and view (if used on both links)                                             |
| 2                | enables it just for viewing requests and not publishing requests                                      |
| 3                | enables it for just publishing requests and not viewing requests                                      |
| 4                | enables 5.1-multichannel audio support (Experimental and may require a Chrome flag to be set)         |
| 5                | This is the default if nothing is set. It behaves like 3 or 1, depending on if you are a guest or not |
| (no value given) | It behaves like 3 or 1, depending on if you are a guest or not                                        |

View [`&stereo`](../general-parameters/stereo.md) for more details.

## Details

Like [`&stereo`](../general-parameters/stereo.md) but for screen-shares. For more information click here:

{% content-ref url="../general-parameters/stereo.md" %}
[stereo.md](../general-parameters/stereo.md)
{% endcontent-ref %}

## Related

{% content-ref url="../general-parameters/stereo.md" %}
[stereo.md](../general-parameters/stereo.md)
{% endcontent-ref %}
