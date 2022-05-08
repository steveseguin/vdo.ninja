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
It will not work in full-screen, and the control-bar gets rotated also. Some browsers might have issues, too.
{% endhint %}

#### Alternative option to rotating and flipping

If  you are looking for a form of rotation and flipping that rotates the actual video, rather than relying on CSS, you can check out the \&effects options.\
\
`https://vdo.ninja/beta/?effects=-1`,  which will flip the video `https://vdo.ninja/beta/?effects=-2`,  which will flip and mirror the video\
`https://vdo.ninja/beta/?effects=2`,  which will mirror the video\
\
Effects however may increase CPU/GPU usage, and could cause frame rate instability, especially if the browser tab is not in active focus.

## Related

{% content-ref url="../view-parameters/and-portrait.md" %}
[and-portrait.md](../view-parameters/and-portrait.md)
{% endcontent-ref %}
