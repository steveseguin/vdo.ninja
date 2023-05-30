---
description: >-
  Improves the audio quality, changes default audio settings and sets the audio
  mode to stereo
---

# \&proaudio

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* [`&stereo`](../../general-settings/stereo.md)
* `&s`

## Options

Example: `&proaudio=1`

<table><thead><tr><th width="235">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>It behaves like 3 or 1, depending on if you are a guest or not</td></tr><tr><td><code>0</code></td><td>will try to down-mix your mic to mono. Does not enable any pro-audio settings</td></tr><tr><td><code>1</code></td><td>enables it for both push and view (if used on both links)</td></tr><tr><td><code>2</code></td><td>enables it just for viewing requests and not publishing requests</td></tr><tr><td><code>3</code></td><td>enables it for just publishing requests and not viewing requests</td></tr><tr><td><code>4</code></td><td>enables 5.1-multichannel audio support (Experimental and may require a Chrome flag to be set)</td></tr><tr><td><code>5</code></td><td>This is the default if nothing is set. It behaves like 3 or 1, depending on if you are a guest or not</td></tr></tbody></table>

## Details

Adding `&proaudio` to the URL will apply audio-specific setting presets. For inbound audio streams, it can be used to increase the audio bitrate from 32-kbps to 256-kbps. For outbound streams, it will disable echo-cancellation and noise-reduction. When applied to both the outbound and inbound sides of an audio stream, it will also enable stereo audio if available.

There are a variety of different modes that apply different combination of presets. You can also override any preset with other URL parameters, such as [`&audiobitrate`](../view-parameters/audiobitrate.md), [`&outboundaudiobitrate`](../../source-settings/and-outboundaudiobitrate.md), and [`&aec=1`](../../source-settings/aec.md).

If using a microphone, wearing headphones is strongly recommended if using this parameter, along with knowledge of correctly setting your microphone gain settings. Echo and feedback issues can occur if this option is used incorrectly.

When using this option in a group room, you can't simply just apply this URL option to the director and have it apply to all guests. You will need to add the flag to each guest and to each scene-link to enable the pro-audio stereo mode. Depending on the value you pass to the URL parameter, you will get slightly different outcomes.

There is a director's room toggle for guest's invite link and for scene links:\
![](<../../.gitbook/assets/image (95) (1).png>)

### More Details

`&stereo` and `&proaudio` currently do the same thing, so they are just aliases of each other. When used, they can be used to setup the audio transfer pipeline to allow for unprocessed, high-bitrate, stereo audio.

Use of this option is generally for advanced users who understand the consequences of enabling this. High-quality audio can cause audio clicking, reduced video quality, feedback issues, low volume levels, and higher background noise levels.

For stereo-channel support to work, you will want both the viewer AND the publisher of the stream to have the respective `&proaudio` flag add to their URL.

You can customize things further using [`&aec`](../../source-settings/aec.md), [`&ag`](../../source-settings/autogain.md), [`&dn`](../../source-settings/and-denoise.md), [`&ab`](../view-parameters/audiobitrate.md) and [`&mono`](../view-parameters/mono.md). These flags will override the presets applied by the `&proaudio` flag.  Please note, depending on your browser, enabling `&aec`, `&ag`, or `&dn` can force disable stereo audio.

The most powerful mode is `proaudio=1` , which if enabled:

* Turns off audio normalization or auto-gain when publishing ([`&push`](../../source-settings/push.md))
* Turns off noise-cancellation when publishing
* Turns off echo-cancellation when publishing
* Enables higher audio bitrate playback, up to 256-kbps, when listening ([`&view`](../view-parameters/view.md))

If the parameter is used, but left without a value, it is treated as a special case (either 1 or 3). Please see follow link for more info:

[https://docs.google.com/spreadsheets/d/e/2PACX-1vS7Up5jgXPcmg\_tN52JLgXBZG3wfHB3pZDQWimzxixiuRIDbeMdmU11fgrMpdYFT6yy4Igrkc9hnReY/pubhtml](https://docs.google.com/spreadsheets/d/e/2PACX-1vS7Up5jgXPcmg\_tN52JLgXBZG3wfHB3pZDQWimzxixiuRIDbeMdmU11fgrMpdYFT6yy4Igrkc9hnReY/pubhtml)

<table><thead><tr><th align="center">Option</th><th>alias</th><th>aec</th><th>autogain</th><th>denoise</th><th>stereo playback</th><th width="40">stereo output</th><th>default ab in</th><th>max ab out</th><th>limited ab in</th><th>cbr</th></tr></thead><tbody><tr><td align="center"><code>&#x26;proaudio=0</code></td><td>off</td><td>on</td><td>on</td><td>on</td><td><em>off</em></td><td><em>no</em></td><td>32</td><td>510</td><td>510</td><td><em>no</em></td></tr><tr><td align="center"><code>&#x26;proaudio=1</code></td><td>both</td><td><em>off</em></td><td><em>off</em></td><td><em>off</em></td><td>on</td><td>yes</td><td>256</td><td>510</td><td>510</td><td>yes</td></tr><tr><td align="center"><code>&#x26;proaudio=2</code></td><td>in</td><td>on</td><td>on</td><td>on</td><td>on</td><td><em>no</em></td><td>256</td><td>510</td><td>510</td><td>yes</td></tr><tr><td align="center"><code>&#x26;proaudio=3</code></td><td>out</td><td><em>off</em></td><td><em>off</em></td><td><em>off</em></td><td><em>off</em></td><td>yes</td><td>32</td><td>510</td><td>510</td><td><em>no</em></td></tr><tr><td align="center"><code>&#x26;proaudio=4</code></td><td>multi</td><td><em>off</em></td><td><em>off</em></td><td><em>off</em></td><td>on (5.1)</td><td>yes</td><td>256</td><td>510</td><td>510</td><td>yes</td></tr></tbody></table>

### Newbie mode

The default mode when `&proaudio` is used alone is `&proaudio=5`, which acts like either `&proaudio=3` or `&proaudio=1`, depending on whether the link its applied to is a room guest or not. This option will make the most sense for most users.

| Option        | Context     | alias | aec   | autogain | denoise | stereo playback | stereo output | default ab in | max ab out | limited ab in | cbr  |
| ------------- | ----------- | ----- | ----- | -------- | ------- | --------------- | ------------- | ------------- | ---------- | ------------- | ---- |
| `&proaudio=5` | Regular/OBS | 5     | _off_ | _off_    | _off_   | on              | yes           | 256           | 510        | 510           | yes  |
| `&proaudio=5` | Director    | 5     | _off_ | _off_    | _off_   | on              | yes           | 32            | 510        | 510           | _no_ |
| `&proaudio=5` | Room Guest  | 5     | _off_ | _off_    | _off_   | _off_           | yes           | 32            | 510        | 510           | _no_ |

### iOS Devices

| Option      | alias | aec | autogain | denoise | stereo playback | stereo output | default ab in | max ab out | limited ab in | cbr  |
| ----------- | ----- | --- | -------- | ------- | --------------- | ------------- | ------------- | ---------- | ------------- | ---- |
| iOS devices |       | on  | on       | on      | _off_           | _off_         | 32            | 32         | 32            | _no_ |

Just for reference, the audio codec used by VDO.Ninja is OPUS (48khz), which can provide high-fidelity music transfer when the audio bitrate is set to 80-kbps per channel or higher. The default audio bitrate used is 32-kbps VBR, which is sufficient for most voice applications. Increasing the audio bitrate to a near-lossless 500-kbps or something may end up causing more problems than anything, but that is supported if needed.

### Disabling stereo when using \&proaudio

If you want to use the `&proaudio` parameter but wish the output to still be mono (1-channel), there's some options.

* [`&inputchannels=1`](and-inputchannels.md) or [`&monomic`](and-monomic.md) can be used on the sender's side, which will force their audio-capture device (microphone) to only capture in mono.
* [`&mono`](../view-parameters/mono.md) can be added to the viewer's side, which will try to playback incoming audio as mono.
* If using OBS, in the audio settings, you can set the browser-source's audio to be mono.

## Related

{% content-ref url="../view-parameters/audiobitrate.md" %}
[audiobitrate.md](../view-parameters/audiobitrate.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-outboundaudiobitrate.md" %}
[and-outboundaudiobitrate.md](../../source-settings/and-outboundaudiobitrate.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-screensharestereo.md" %}
[and-screensharestereo.md](../../newly-added-parameters/and-screensharestereo.md)
{% endcontent-ref %}
