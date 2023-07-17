---
description: Rotates the camera
---

# \&rotate

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&rotate=180`

<table><thead><tr><th width="212">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>90 degree</td></tr><tr><td>(degree)</td><td>Rotates the camera in the specified value in degree</td></tr></tbody></table>

## Details

Applies to the publisher's side. Rotates the camera 90-deg by default, or specify `&rotate=180` or `&rotate=270` to rotate more.

Rotates your video for the guests/OBS as well. The rotation uses CSS.

{% hint style="warning" %}
CSS-based video effects will not work in full-screen mode. As well, the control-bar gets rotated with the video, when using CSS.&#x20;
{% endhint %}

#### If looking to flip or mirror a video instead:

If you are looking for a form of mirroring and flipping that changes the actual video, rather than relying on CSS to achieve the effect, you can check out the sender-side [`&effects`](../../source-settings/effects.md) options.\
\
`https://vdo.ninja/beta/?effects=-1`,  which will flip the video `https://vdo.ninja/beta/?effects=-2`,  which will flip and mirror the video\
`https://vdo.ninja/beta/?effects=2`,  which will mirror the video\
\
Effects however may increase CPU/GPU usage, and could cause frame rate instability, especially if the browser tab is not in active focus.

There's also the [`&flip`](and-flip.md) and [`&mirror`](mirror.md) options, which use CSS, but are generally viewer-side only.



### Dedicated teleprompter tool that works for most sites

There's a dedicated tool for mirror, flipping, and rotating websites as part of VDO.Ninja as well:

[https://vdo.ninja/teleprompter](https://vdo.ninja/teleprompter)

In case the built-in options to mirror or flip don't work, the teleprompter app might be a good alternative.

## Related

{% content-ref url="../../source-settings/effects.md" %}
[effects.md](../../source-settings/effects.md)
{% endcontent-ref %}

{% content-ref url="and-flip.md" %}
[and-flip.md](and-flip.md)
{% endcontent-ref %}

{% content-ref url="mirror.md" %}
[mirror.md](mirror.md)
{% endcontent-ref %}
