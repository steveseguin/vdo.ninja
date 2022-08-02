---
description: A guide on how to use Audio Filters in VDO.Ninja
---

# Audio Filters

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

Adding [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) to a source link disables [Auto Gain](../source-settings/autogain.md), [Echo Cancellation](../source-settings/aec.md) and [Noise Suppression](../source-settings/and-denoise.md), sets the audio to stereo and the outbound audio bitrate to 256-kbps. To get the 256-kbps you have to add [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) to the view link (OBS for example) too.

``[`&audiobitrate`](../advanced-settings/view-parameters/audiobitrate.md) on the view link overrides the audio bitrate setting of the [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) parameter.

There is a very useful google doc sheet with a matrix for the [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) ([`&stereo`](../general-settings/stereo.md)) parameter:

{% embed url="https://docs.google.com/spreadsheets/d/1onfIh1hNR1Gh_mthkhmezzWNUMYKMGKPrwx7T428_hc/edit#gid=0" %}
[https://docs.google.com/spreadsheets/d/1onfIh1hNR1Gh\_mthkhmezzWNUMYKMGKPrwx7T428\_hc/edit#gid=0](https://docs.google.com/spreadsheets/d/1onfIh1hNR1Gh\_mthkhmezzWNUMYKMGKPrwx7T428\_hc/edit#gid=0)
{% endembed %}
