---
description: Optimizes audio settings for guests using external speakers without headphones
---

# \&noheadphones

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&nhp`

## Options

Example: `&noheadphones`

This parameter takes no value. Adding it to a guest link enables the no-headphones audio profile.

## Details

`&noheadphones` is a convenience parameter for setups where guests are using external speakers and microphones without headphones, such as panel shows or in-studio multi-guest setups.

It forces the following defaults:

* **Echo cancellation**: ON
* **Noise suppression**: ON
* **Auto gain control**: ON
* **Voice isolation**: ON (if not already set)
* **Noise gate**: ON (if not already set)

This overrides [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) or [`&stereo`](../advanced-settings/audio-parameters/and-proaudio.md) disabling of echo cancellation, noise suppression, and auto gain control. Individual parameters like `&aec=0` can still override if needed.

### When to use

Use this when guests cannot wear headphones and are using external speakers. Without `&noheadphones`, a common problem is cascading echo: Guest A speaks, their audio plays through Guest B's speakers, Guest B's mic picks it up and sends it back, creating a feedback loop.

### Example guest link

```
https://vdo.ninja/?room=YOURROOM&password=YOURPASS&noheadphones&mediasettings
```

### Physical setup tips

Even with `&noheadphones`, some physical setup improvements help:

* Keep speaker volume as low as practical
* Position the microphone close to the speaker's mouth
* Point speakers away from microphones
* Prefer directional or dynamic microphones over wide-pickup condensers

### Advanced: combining with other features

* Add [`&noisegate=4`](noisegate.md) to duck non-active speakers' microphones (more aggressive than the default gate)
* Use [`&noisegatesettings`](../advanced-settings/audio-parameters/and-noisegatesettings.md) to tune gate sensitivity
* The director can use [`&mixminus`](../other-parameters.md#mix-minus-and-mixminus) for N-1 routing to prevent self-return loops

## Related

{% content-ref url="aec.md" %}
[aec.md](aec.md)
{% endcontent-ref %}

{% content-ref url="and-denoise.md" %}
[and-denoise.md](and-denoise.md)
{% endcontent-ref %}

{% content-ref url="noisegate.md" %}
[noisegate.md](noisegate.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/audio-parameters/and-proaudio.md" %}
[and-proaudio.md](../advanced-settings/audio-parameters/and-proaudio.md)
{% endcontent-ref %}
