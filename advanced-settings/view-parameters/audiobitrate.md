---
description: Manually sets the audio bitrate in kbps
---

# \&audiobitrate

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&ab`

## Options

| Value           | Description     |
| --------------- | --------------- |
| (integer value) | bitrate in kbps |

## Details

The default is around 32-kbps per track with a mono-channel (VBR on by default).

The audio codec used is OPUS and the target sample rate is 48khz.

510-kbps is the highest value allowed, with around 300-kbps the highest value for a mono-channel track.

When an audio bitrate is manually specified, CBR is enabled by default.

If you do not disable [Echo-Cancellation (`&aec`)](../../source-settings/aec.md) and [`&denoise`](../../source-settings/and-denoise.md), audio quality will still be stuck at telephone quality.

Setting the audio bitrate to be very high can sometimes cause video bitrates on weak connections to become stuck at around 30-kbps.

{% hint style="info" %}
For reference, Spotify uses around 96-kbps for stereo audio on mobile devices.
{% endhint %}

## Related

{% content-ref url="bitrate.md" %}
[bitrate.md](bitrate.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/stereo.md" %}
[stereo.md](../../general-settings/stereo.md)
{% endcontent-ref %}
