---
description: A guide on how to use Audio Filters & Bitrate in VDO.Ninja
---

# Audio Filters & Bitrate

## Filter Options

There are several Audio Filters in VDO.Ninja. Some of them are turned on by default, some are not. To activate these Audio Filters you have to add them to the source side.\
So for example:\
[https://vdo.ninja/?push](https://vdo.ninja/?push) (for a basic push link)\
[https://vdo.ninja/?room=SOMEROOMNAME](https://vdo.ninja/?room=SOMEROOMNAME) (for a guest in a room)

| Name                   | Parameter                                                                | By default | Change the default setting   |
| ---------------------- | ------------------------------------------------------------------------ | ---------- | ---------------------------- |
| Outbound Audio Bitrate | ``[`&oab`](../source-settings/and-outboundaudiobitrate.md)               | 32-kbps    | `&oab=XX` (0-510; in kbps)   |
| Pro Audio              | ``[`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md)`` | off        | `&proaudio`                  |
| Master Gain            | ``[`&audiogain`](../source-settings/gain.md)``                           | 100%       | `&audiogain=XX` (0-200 in %) |
| Auto Gain Control      | ``[`&autogain`](../source-settings/autogain.md)``                        | on         | `&autogain=0`                |
| Echo Cancellation      | ``[`&aec`](../source-settings/aec.md)``                                  | on         | `&aec=0`                     |
| Noise Suppression      | ``[`&denoise`](../source-settings/and-denoise.md)``                      | on         | `&denoise=0`                 |
| Noise Gating           | ``[`&noisegate`](../source-settings/noisegate.md)``                      | off        | `&noisegate`                 |
| Compressor             | ``[`&compressor`](../source-settings/and-compressor.md)``                | off        | `&compressor`                |
| Limiter                | ``[`&limiter`](../source-settings/and-limiter.md)``                      | off        | `&limiter`                   |
| Equalizer              | ``[`&equalizer`](../source-settings/and-equalizer.md)``                  | off        | `&equalizer`                 |
| Lowcut                 | ``[`&lowcut`](../source-settings/lowcut.md)``                            | off        | `&lowcut=XX` (in hz)         |
| Microphone Delay       | ``[`&micdelay`](../source-settings/and-micdelay.md)``                    | 0-ms       | `&micdelay=XX` (in ms)       |

Default settings of VDO.Ninja:\
![](<../.gitbook/assets/image (109).png>)

{% hint style="info" %}
the [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) parameter is the same as the [`&stereo`](../general-settings/stereo.md) parameter
{% endhint %}

Adding [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) to a source link disables [Auto Gain](../source-settings/autogain.md), [Echo Cancellation](../source-settings/aec.md) and [Noise Suppression](../source-settings/and-denoise.md), sets the audio to stereo and the possible outbound audio bitrate to 256-kbps.

There is a very useful google sheet with a matrix for the [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) ([`&stereo`](../general-settings/stereo.md)) parameter:

{% embed url="https://docs.google.com/spreadsheets/d/1onfIh1hNR1Gh_mthkhmezzWNUMYKMGKPrwx7T428_hc/edit#gid=0" %}
[https://docs.google.com/spreadsheets/d/1onfIh1hNR1Gh\_mthkhmezzWNUMYKMGKPrwx7T428\_hc/edit#gid=0](https://docs.google.com/spreadsheets/d/1onfIh1hNR1Gh\_mthkhmezzWNUMYKMGKPrwx7T428\_hc/edit#gid=0)
{% endembed %}

## Audio Bitrate

Options to control the audio bitrate:

1. Add `&proaudio` to the source AND view link to get 256-kbps (echo cancellation, noise suppression and auto gain are then DISABLED)
2. Add `&proaudio` to the view link to get 256-kbps (echo cancellation, noise suppression and auto gain are still ENABLED)
3. Add [`&oab=100`](../source-settings/and-outboundaudiobitrate.md) to the source link to get 100-kbps
4. Add [`&audiobitrate=200`](../advanced-settings/view-parameters/audiobitrate.md) to the view link to get 200-kbps

{% hint style="info" %}
* `&proaudio` overrides the bitrate of `&oab` if set on the source AND view link or only on the view link -> you get 256-kbps.
* `&audiobitrate` overrides `&proaudio` and `&oab`
{% endhint %}

This also works for [`&room`](../general-settings/room.md) on the source side and [`&scene`](../advanced-settings/view-parameters/scene.md) on the view side if you are in a room.

Some examples:

1\)\
[https://vdo.ninja/?push=SOMESTREAMID](https://vdo.ninja/?push=SOMESTREAMID)\
[https://vdo.ninja/?view=SOMESTREAMID\&proaudio](https://vdo.ninja/?view=SOMESTREAMID\&proaudio)\
\-> 256-kbps

2\)\
[https://vdo.ninja/?push=SOMESTREAMID\&oab=100](https://vdo.ninja/?push=SOMESTREAMID\&oab=100)\
[https://vdo.ninja/?view=SOMESTREAMID\&audiobitrate=200](https://vdo.ninja/?view=SOMESTREAMID\&audiobitrate=200)\
\-> 200-kbps

3\)\
[https://vdo.ninja/?push=SOMESTREAMID\&proaudio](https://vdo.ninja/?push=SOMESTREAMID\&proaudio)\
[https://vdo.ninja/?view=SOMESTREAMID](https://vdo.ninja/?view=SOMESTREAMID)\
\-> 32-kbps

4\)\
[https://vdo.ninja/?push=SOMESTREAMID\&proaudio](https://vdo.ninja/?push=SOMESTREAMID\&proaudio)\
[https://vdo.ninja/?view=SOMESTREAMID\&audiobitrate=96](https://vdo.ninja/?view=SOMESTREAMID\&audiobitrate=96)\
\-> 96-kbps

{% hint style="info" %}
To see the audio bitrate\
`Right-Click -> Show Stats` or\
`Control (Command) + Left-Click`\
``on a video source
{% endhint %}
