---
description: Rotates the camera
---

# \&rotate

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

| Value            | Description                                         |
| ---------------- | --------------------------------------------------- |
| (degree)         | Rotates the camera in the specified value in degree |
| (no value given) | 90 degree                                           |

## Details

Applies to the publisher's side. Rotates the camera 90-deg by default, or specify `&rotate=180` or `&rotate=270` to rotate more.

Rotates your video for the guests/OBS as well. The rotation uses CSS.

{% hint style="warning" %}
CSS-based video effects will not work in full-screen mode. As well, the control-bar gets rotated with the video, when using CSS.&#x20;
{% endhint %}

#### If looking to flip or mirror a video instead:

If  you are looking for a form of mirroring and flipping that changes the actual video, rather than relying on CSS to achieve the effect, you can check out the sender-side \&effects options.\
\
`https://vdo.ninja/beta/?effects=-1`,  which will flip the video `https://vdo.ninja/beta/?effects=-2`,  which will flip and mirror the video\
`https://vdo.ninja/beta/?effects=2`,  which will mirror the video\
\
Effects however may increase CPU/GPU usage, and could cause frame rate instability, especially if the browser tab is not in active focus.&#x20;

There's also the \&flip and \&mirror options, which use CSS, but are generally viewer-side only.

## Related

{% content-ref url="../view-parameters/and-portrait.md" %}
[and-portrait.md](../view-parameters/and-portrait.md)
{% endcontent-ref %}
