---
description: >-
  Audio capture device to select N-number of audio channels; force mono or
  stereo capture
---

# \&inputchannels

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&channelcount`
* `&ac`

## Options

| Value             | Description                                 |
| ----------------- | ------------------------------------------- |
| `1`               | Audio capture device set to mono; 1 channel |
| `2`               | Audio capture device set to 2 channels      |
| `6`               | Audio capture device set to 6 channels      |
| (integer value X) | Audio capture device set to X channels      |

## Details

`&inputchannels=N` tells the audio capture device explicitly to select N-number of audio channels.&#x20;

Setting [`&stereo=0`](../../general-settings/stereo.md) will set `&inputchannels=1` by default.

If using [`&proaudio`](and-proaudio.md) you want want to disable stereo-audio capture, particularly if you are using an XLR to USB microphone preamp that has two channels, but only one microphone connected.

For example, if a guest joins and you can only hear them in the left or right channel, either add [`&mono`](../view-parameters/mono.md) to the view-link or add `&inputchannels=1` to the respective guest invite-link.

### Mono-specific alias

If looking for a memorable parameter to set a guest's audio input to mono (1-channel), [`&monomic`](../upcoming-parameters/and-monomic.md) is the same as `&inputchannels=1`. This was added in VDO.Ninja v22.

## Related

{% content-ref url="../upcoming-parameters/and-monomic.md" %}
[and-monomic.md](../upcoming-parameters/and-monomic.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/mono.md" %}
[mono.md](../view-parameters/mono.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/stereo.md" %}
[stereo.md](../../general-settings/stereo.md)
{% endcontent-ref %}
