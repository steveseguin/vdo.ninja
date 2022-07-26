---
description: >-
  Audio capture device to select N-number of audio channels; force mono or
  stereo capture.
---

# \&channelcount

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ac`
* `&inputchannels`

## Options

| Value             | Description                                 |
| ----------------- | ------------------------------------------- |
| 2                 | Audio capture device set to 2 channels      |
| 6                 | Audio capture device set to 6 channels      |
| 1                 | Audio capture device set to mono; 1 channel |
| (integer value X) | Audio capture device set to X channels      |

## Details

`&channelcount=N` tells the audio capture device explicitly to select N-number of audio channels.&#x20;

Setting [`&stereo=0`](../general-settings/stereo.md) will set `&channecount=1` by default.

If using \`\&proaudio\` or `&stereo=1` , you want want to disable stereo-audio capture, particularly if you are using an XLR to USB microphone preamp that has two channels, but only one microphone connected.

For example, if a guest joins and you can only hear them in the left or right channel, either add [`&mono`](../advanced-settings/view-parameters/mono.md) to the view-link or add `&ac=1` to the respective guest invite-link.

### Mono-specific alias

If looking for a memorable parameter to set a guest's audio input to mono (1-channel), `&monomic` is the same as `&ac=1`. This was added in VDO.Ninja v22.
