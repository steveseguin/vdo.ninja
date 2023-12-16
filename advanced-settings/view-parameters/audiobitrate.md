---
description: Manually sets the audio bitrate in kbps
---

# \&audiobitrate

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&ab`

## Options

Example: `&audiobitrate=128`

| Value           | Description     |
| --------------- | --------------- |
| (integer value) | bitrate in kbps |

## Details

The default is around 32-kbps per track with a mono-channel (VBR on by default).

The audio codec used is OPUS and the target sample rate is 48khz.

510-kbps is the highest value allowed, with around 300-kbps the highest value for a mono-channel track.

For voice, the default audio bitrate is sufficient for most users, however 64- to 80-kbps may offer an audible improvement. For music, you may wish to go higher.

{% hint style="info" %}
For reference, music streaming providers will use around 64- to 128-kbps as their default.
{% endhint %}

When an audio bitrate is manually specified, CBR is enabled by default.

Setting the audio bitrate to be very high can sometimes cause video bitrates on weak connections to become stuck at around 30-kbps.dio on mobile devices.

### Considerations

If you are using the [Echo-Cancellation (`&aec`)](../../source-settings/aec.md) and [`&denoise`](../../source-settings/and-denoise.md) filters, audio quality may still sound like telephone quality in some cases, even with an increased bitrate. These filters are on by default.\
\
Filtering out echos and noise can impact the audio quality, so while these filters are effective in what they do, the harder they have to work, the more the audio will sound like a telephone call.

Finding ways to eliminate background noise, hum, and feedback can improve audio quality, as the echo/noise filters will then not need to activate or be used with such strength. You can of course disable those filters entirely, which when combined with a higher audio bitrate, will get you closer to what sounds like a raw audio recording; this assumes feedback isn't an issue of course.

{% content-ref url="../video-bitrate-parameters/bitrate.md" %}
[bitrate.md](../video-bitrate-parameters/bitrate.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/stereo.md" %}
[stereo.md](../../general-settings/stereo.md)
{% endcontent-ref %}
