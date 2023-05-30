---
description: Inverts the video so it is the mirror reflection
---

# \&mirror

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Options

Example: `&mirror=2`

<table><thead><tr><th width="217">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>Mirroring is forced for all videos</td></tr><tr><td><code>0</code></td><td>Preview video is mirrored only (excluding rear cameras and OBS Virtualcam/NDI)</td></tr><tr><td><code>1</code></td><td>Mirroring is forced for all videos</td></tr><tr><td><code>2</code></td><td>Inverts the default; local previews are not mirrored, but guests are mirrored</td></tr><tr><td><code>3</code></td><td>Same as default, except everything is mirrored, including text - useful for teleprompters</td></tr></tbody></table>

## Details

Mirroring does not work if using the browser's native video full-screen button. Use [`&effects=2`](../../source-settings/effects.md) instead for this use case.

Try `F11` or the Electron Capture app (right-click → Resize window -> Fullscreen) to hide the browser menu instead.

#### Alternative method for mirroring and flipping

If you are looking for a form of rotation and flipping that rotates the actual video, rather than relying on CSS to achieve it, you can check out the sender-side [`&effects`](../../source-settings/effects.md) options.\
\
`https://vdo.ninja/beta/?effects=-1`,  which will flip the video `https://vdo.ninja/beta/?effects=-2`,  which will flip and mirror the video\
`https://vdo.ninja/beta/?effects=2`,  which will mirror the video\
\
Effects however may increase CPU/GPU usage, and could cause frame rate instability, especially if the browser tab is not in active focus.

## Related

{% content-ref url="../../source-settings/effects.md" %}
[effects.md](../../source-settings/effects.md)
{% endcontent-ref %}

{% content-ref url="and-flip.md" %}
[and-flip.md](and-flip.md)
{% endcontent-ref %}
