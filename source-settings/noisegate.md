---
description: >-
  Lowers your mic volume to 10% of its current value based on volume-level
  activity
---

# \&noisegate

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&gating`
* `&gate`
* `&ng`

## Options

Example: `&noisegate=1`

| Value                   | Description                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| `0`                     | hides it from the menu                                                     |
| `1` \| (no value given) | enables the new noise gate (see Details)                                   |
| `2`                     | will mute the speakers when you are talking                                |
| `3`                     | will mute the speakers when someone else is talking (mainly for debugging) |
| `4`                     | will mute the microphone when someone else is speaking                     |

## Details

The default setting is OFF. You can switch on the noise gate in the audio settings:\
![](<../.gitbook/assets/image (95).png>)

This is a new noise gate, that lowers your mic volume to 10% of its current value based on volume-level activity. If you haven't made a significant sound in few seconds, the noise gate kicks in, and will re-enable when a significant noise is detected. It will take about 300-ms for the volume to recover once the noise triggers it back on, which can be a small bit harsh/distracting at times.

The point of this feature is to allow guests who might be in a rather noisy room or who are unable to use echo cancellation to still engage with a chat, without them introducing feedback back into the room.

This is a very hard and aggressive noise filter, and a guest won't be audible to others in the room if others in the room are currently talking.

User feedback on this feature welcomed.

### Noise Gate Settings

[`&noisegatesettings`](../advanced-settings/audio-parameters/and-noisegatesettings.md) is used in conjunction with `&noisegate`. This feature lets you tweak the noise-gate's variables, making it more or less aggressive as needed.

It takes a comma separated list:

* First value is the closed-gate target gain as a percentage of normal volume. The code accepts 0 to 100. Use 0 to 40 for noticeable ducking; use 0 to 3 for near-mute.
* Second value is the threshold value where the gate is triggered if below it. \~ 100 is loudly speaking, \~ 20 is light background noise levels, and under 5 is quiet background levels.
* Third value is how sticky the gate-open position is, in milliseconds. The current implementation checks this in 100-ms steps, so use multiples of 100 ms. For example, `3000` means about 3 seconds.

Example:\
[`https://vdo.ninja/alpha/?noisegate&noisegatesettings=10,25,3000`](https://vdo.ninja/alpha/?noisegate\&noisegatesettings=10,25,3000)

To help users with testing the noise gate and configuring the noise gate settings, there's an interactive page here for it: [https://vdo.ninja/noisegate](https://vdo.ninja/noisegate)

{% hint style="warning" %}
The `/noisegate` test page uses a classic DAW-style 5-parameter format. Its output string is **not** directly compatible with the `&noisegatesettings` URL parameter, which uses the 3-value internal format. See [`&noisegatesettings`](../advanced-settings/audio-parameters/and-noisegatesettings.md) for the correct format.
{% endhint %}

## Related

{% content-ref url="../advanced-settings/audio-parameters/and-noisegatesettings.md" %}
[and-noisegatesettings.md](../advanced-settings/audio-parameters/and-noisegatesettings.md)
{% endcontent-ref %}

{% content-ref url="and-denoise.md" %}
[and-denoise.md](and-denoise.md)
{% endcontent-ref %}
