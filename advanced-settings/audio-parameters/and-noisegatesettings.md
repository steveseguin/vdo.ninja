---
description: >-
  Lets you tweak the &noisegate variables, making it more or less aggressive as
  needed
---

# \&noisegatesettings

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&noisegatesettings=10,25,3000`

| Value                                   | Description                                                          |
| --------------------------------------- | -------------------------------------------------------------------- |
| (TargetGain,Threshold,GateOpenPosition) | see [Details](and-noisegatesettings.md#details) for more information |
| `10,25,3000`                            | example                                                              |

## Details

`&noisegatesettings` is used in conjunction with [`&noisegate`](../../source-settings/noisegate.md). This feature lets you tweak the noise-gate's variables, making it more or less aggressive as needed.

It takes a comma separated list:

* First value is target volume (0 to 100), although 0 to 40 is probably the recommended range here.
  * Since how we perceive loudness isn't linear, to have the audio become inaudible, you'll want to set this to 0 to 3. Setting it to 10 for example will leave it still quite audible, but just dampened.
* Second value is the threshold value where the gate is triggered if below it. \~ 100 is loudly speaking, \~ 20 is light background noise levels, and under 5 is quiet background levels.
* Third value is how 'sticky' the gate-open position is, in milliseconds. Having this set to a few seconds should prevent someone from being cut off while speaking or if taking a short pause.
  * You may want to try a value of 10 to 300 for this third value, if just testing or want a sharper cut off.&#x20;

Example:\
[`https://vdo.ninja/?noisegate&noisegatesettings=10,25,3000`](https://vdo.ninja/?noisegate\&noisegatesettings=10,25,3000)

To help users with testing the noise gate and configuring the noise gate settings, there's an interactive page here for it: [https://vdo.ninja/noisegate](https://vdo.ninja/noisegate)

{% hint style="warning" %}
The interactive `/noisegate` test page uses a classic DAW-style parameter set (threshold in dBFS, attack ms, release ms, hold ms, depth %). The 5-value string it displays is **not** directly compatible with `&noisegatesettings`, which uses the 3-value internal format (TargetGain, Threshold, StickinessMs) described above. Use the test page to tune the live feel of the gate, then translate your preferred settings manually to the 3-value URL format.
{% endhint %}

## Related

{% content-ref url="../../source-settings/noisegate.md" %}
[noisegate.md](../../source-settings/noisegate.md)
{% endcontent-ref %}
