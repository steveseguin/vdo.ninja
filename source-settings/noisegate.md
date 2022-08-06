---
description: >-
  Lowers your mic volume to 10% of its current value based on volume-level
  activity
---

# \&noisegate

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&gating`
* `&ng`

## Options

{% hint style="info" %}
Updated on v22
{% endhint %}

| Value                 | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| 0                     | hides it from the menu                                                     |
| 1 \| (no value given) | enables the new noise gate (see Details)                                   |
| 2                     | will mute the speakers when you are talking                                |
| 3                     | will mute the speakers when someone else is talking (mainly for debugging) |
| 4                     | will mute the microphone when someone else is speaking                     |

## Details

#### Update on v22

The default setting is OFF. You can switch on the noise gate in the audio settings:\
![](<../.gitbook/assets/image (95).png>)

This is a new noise gate, that lowers your mic volume to 10% of its current value based on volume-level activity. If you haven't made a significant sound in few seconds, the noise gate kicks in, and will re-enable when a significant noise is detected. It will take about 300-ms for the volume to recover once the noise triggers it back on, which can be a small bit harsh/distracting at times.

The point of this feature is to allow guests who might be in a rather noisy room or who are unable to use echo cancellation to still engage with a chat, without them introducing feedback back into the room.

This is a very hard and aggressive noise filter, and a guest won't be audible to others in the room if others in the room are currently talking.

User feedback on this feature welcomed.

## Related

{% content-ref url="and-denoise.md" %}
[and-denoise.md](and-denoise.md)
{% endcontent-ref %}
