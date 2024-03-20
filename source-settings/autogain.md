---
description: Sets whether audio auto-normalization is ON or OFF
---

# \&autogain

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&agc`
* `&ag`

## Options

Example: `&autogain=1`

| Value | Description                  |
| ----- | ---------------------------- |
| `0`   | audio auto-normalization off |
| `1`   | audio auto-normalization On  |

## Details

Audio auto-normalization is ON by default in VDO.Ninja.

You can turn off auto-normalization by adding `&autogain=0` to a source link (guest). If you are using [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md), auto-normalization gets turned off. You can enable it again with `&proaudio&autogain=1`.

You can also switch it on or off via the audio settings. If you want the guests to be able to change the audio settings by themselves, use [`&mediasettings`](../newly-added-parameters/and-mediasettings.md) on the guests' link, as per default only the director can change the audio settings of the guests.

![](<../.gitbook/assets/image (90).png>)

Your browser will try to keep optimum audio levels.

## Known issues with auto-gain

Some microphones or devices with software-based gain controls can have problems with auto-gain. The microphone volume might go to high, causing clipping, for example, or it might interfere with the gain of other applications.

If using a Chromium-based browser, like Chrome, Edge or Brave, you can either disable auto-gain or you can go into your browser's settings and disable the browser from being able to control the device's input volume. The link to this option is here: [chrome://flags/#enable-webrtc-allow-input-volume-adjustment](chrome://flags/#enable-webrtc-allow-input-volume-adjustment) (as of March 2024 at least)\
\
Please note that this issue seems to be a Chromium-related issue, and it is not VDO.Ninja specific. If you do disable auto-gain within VDO.Ninja, the option to manually increase your gain is still normally available also.

## Related

{% content-ref url="../newly-added-parameters/and-screenshareautogain.md" %}
[and-screenshareautogain.md](../newly-added-parameters/and-screenshareautogain.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/audio-parameters/and-audiogain.md" %}
[and-audiogain.md](../advanced-settings/audio-parameters/and-audiogain.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/audio-parameters/and-volume.md" %}
[and-volume.md](../advanced-settings/audio-parameters/and-volume.md)
{% endcontent-ref %}
