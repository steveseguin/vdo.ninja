---
description: Inverts the video so it is the mirror reflection
---

# \&mirror

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Options

Example: `&mirror=2`

<table><thead><tr><th width="217">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>Mirrors all videos via CSS (local preview and all remote)</td></tr><tr><td><code>0</code></td><td>Forces your local preview to be unmirrored; guests/views are unchanged (excluding rear cameras and OBS Virtualcam/NDI)</td></tr><tr><td><code>1</code></td><td>Mirrors all videos via CSS (local preview and all remote).</td></tr><tr><td><code>2</code></td><td>Behaves like &#x26;mirror=1 (mirrors everything); does not invert just the local preview.</td></tr><tr><td><code>3</code></td><td>Mirrors everything, including page text/UI, for teleprompter use.</td></tr></tbody></table>

## Details

Mirroring does not work if using the browser's native video full-screen button. Use [`&effects=2`](../../source-settings/effects.md) instead for this use case.

Try `F11` or the Electron Capture app (right-click → Resize window -> Fullscreen) to hide the browser menu instead.

#### Alternative method for mirroring and flipping

If you are looking for a form of rotation and flipping that rotates the actual video, rather than relying on CSS to achieve it, you can check out the sender-side [`&effects`](../../source-settings/effects.md) options:



* CSS mirroring does not apply when using the browser’s native full-screen button; use \&effects=2 instead. F11 or Electron Capture avoids the native controls.
* Right-click “Mirror” on a video toggles the same CSS mirror state; with \&mirror=0/2 it may feel reversed because those modes already override the preview.
* Sender-side \&effects will transform the actual video:
  * ?effects=-1 flips vertically
  * ?effects=-2 flips + mirrors
  * ?effects=2 mirrors Note: effects can increase CPU/GPU use, especially in background tabs
* **\&nomirror**: Skips the usual device-based auto-mirror on your local preview (rear cameras/OBS/etc.). Your preview starts unmirrored unless you override with \&mirror=1/2/3 or right-click “Mirror.” It does not affect guest/output mirroring.
* **\&mirroroutput**: Parses truthy/falsey (0/false/off disables). When enabled it flips the local preview and signals a “mirror guest globally” state to peers/ director (same plumbing as the director “Mirror Video” button).  It effectively forces the outgoing/remote view into a mirrored state regardless of the local device heuristics.

### Dedicated teleprompter tool that works for most sites

There's a dedicated tool for mirror, flipping, and rotating websites as part of VDO.Ninja as well:

[teleprompter-tool.md](../../steves-helper-apps/teleprompter-tool.md "mention")

In case the built-in options to mirror or flip don't work, the teleprompter app might be a good alternative.

## Related

{% content-ref url="../../steves-helper-apps/teleprompter-tool.md" %}
[teleprompter-tool.md](../../steves-helper-apps/teleprompter-tool.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/effects.md" %}
[effects.md](../../source-settings/effects.md)
{% endcontent-ref %}

{% content-ref url="and-flip.md" %}
[and-flip.md](and-flip.md)
{% endcontent-ref %}
