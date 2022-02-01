---
description: >-
  Hides the mouse cursor over videos at a CSS level; useful for Electron Capture
  window capturing purposes.
---

# \&nocursor

## Details

This does not hide the mouse cursor for Chrome-based screen capture, as Chrome does not yet support that. This feature is designed for hiding the mouse when using the [Electron Capture](https://github.com/steveseguin/electroncapture) app, to avoid mousing over the capture area by accident.\
\
Works better in Windows than on macOS, due to OS-level limitations.\
\
If you're looking to hide the cursor while screen-recording, consider using OBS to capture and OBS Virtualcam as the source into VDO.NInja. You can also check out: [https://github.com/rdp/screen-capture-recorder-to-video-windows-free](https://github.com/rdp/screen-capture-recorder-to-video-windows-free) as an option to turn a screen into a virtual camera without needing OBS.

## Related

{% content-ref url="../../common-errors-and-known-issues/cursor-shows-when-screen-sharing.md" %}
[cursor-shows-when-screen-sharing.md](../../common-errors-and-known-issues/cursor-shows-when-screen-sharing.md)
{% endcontent-ref %}

{% content-ref url="../source-parameters/cursor.md" %}
[cursor.md](../source-parameters/cursor.md)
{% endcontent-ref %}
