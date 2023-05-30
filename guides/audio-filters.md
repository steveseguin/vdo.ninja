---
description: A guide on how to use Audio Filters & Bitrate in VDO.Ninja
---

# Audio Filters & Bitrate

## Filter Options

There are several Audio Filters in VDO.Ninja. Some of them are turned on by default, some are not. To activate these Audio Filters you have to add them to the source side.\
So for example:\
[https://vdo.ninja/?push](https://vdo.ninja/?push) (for a basic push link)\
[https://vdo.ninja/?room=SOMEROOMNAME](https://vdo.ninja/?room=SOMEROOMNAME) (for a guest in a room)

<table><thead><tr><th width="158.25465046709974">Name</th><th width="223.45075172713555">Parameter</th><th width="150">By default</th><th>Change the default setting</th></tr></thead><tbody><tr><td>Outbound Audio Bitrate</td><td><a href="../source-settings/and-outboundaudiobitrate.md"><code>&#x26;oab</code></a></td><td>32-kbps</td><td><code>&#x26;oab=XX</code> (0-510 kbps)</td></tr><tr><td>Pro Audio</td><td><a href="../advanced-settings/audio-parameters/and-proaudio.md"><code>&#x26;proaudio</code></a></td><td>off</td><td><code>&#x26;proaudio</code></td></tr><tr><td>Master Gain</td><td><a href="../advanced-settings/audio-parameters/and-audiogain.md"><code>&#x26;audiogain</code></a></td><td>100%</td><td><code>&#x26;audiogain=XX</code> (0-200 %)</td></tr><tr><td>Auto Gain Control</td><td><a href="../source-settings/autogain.md"><code>&#x26;autogain</code></a></td><td>on</td><td><code>&#x26;autogain=0</code></td></tr><tr><td>Echo Cancellation</td><td><a href="../source-settings/aec.md"><code>&#x26;echocancellation</code></a></td><td>on</td><td><code>&#x26;echocancellation=0</code></td></tr><tr><td>Noise Suppression</td><td><a href="../source-settings/and-denoise.md"><code>&#x26;denoise</code></a></td><td>on</td><td><code>&#x26;denoise=0</code></td></tr><tr><td>Noise Gating</td><td><a href="../source-settings/noisegate.md"><code>&#x26;noisegate</code></a></td><td>off</td><td><code>&#x26;noisegate</code></td></tr><tr><td>Compressor</td><td><a href="../source-settings/and-compressor.md"><code>&#x26;compressor</code></a></td><td>off</td><td><code>&#x26;compressor</code></td></tr><tr><td>Limiter</td><td><a href="../source-settings/and-limiter.md"><code>&#x26;limiter</code></a></td><td>off</td><td><code>&#x26;limiter</code></td></tr><tr><td>Equalizer</td><td><a href="../source-settings/and-equalizer.md"><code>&#x26;equalizer</code></a></td><td>off</td><td><code>&#x26;equalizer</code></td></tr><tr><td>Lowcut</td><td><a href="../source-settings/lowcut.md"><code>&#x26;lowcut</code></a></td><td>off</td><td><code>&#x26;lowcut=XX</code> (in hz)</td></tr><tr><td>Microphone Delay</td><td><a href="../source-settings/and-micdelay.md"><code>&#x26;micdelay</code></a></td><td>0-ms</td><td><code>&#x26;micdelay=XX</code> (in ms)</td></tr></tbody></table>

{% hint style="info" %}
* Adding [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) to a source link disables [Auto Gain](../source-settings/autogain.md), [Echo Cancellation](../source-settings/aec.md) and [Noise Suppression](../source-settings/and-denoise.md), sets the audio to stereo and the possible outbound audio bitrate to 256-kbps
* the [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) parameter is the same as the [`&stereo`](../general-settings/stereo.md) parameter
{% endhint %}

Default settings of VDO.Ninja:\
![](<../.gitbook/assets/image (109).png>)

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
on a video source
{% endhint %}
