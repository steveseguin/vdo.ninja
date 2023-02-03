---
description: The preview video will be fullscreen
---

# \&fullscreen

Sender-Side Option! ([`&push`](push.md))

## Details

If publishing a video outside **of** a room, and not viewing any other video except your own preview, that preview will be windowed. This command will make that preview larger, sized to fit the window.

### Purpose

If you combine this command with [`&cleanoutput`](../advanced-settings/design-parameters/cleanoutput.md), you can then cleanly window-capture your preview window and use that instead as a local webcam source elsewhere, such as in OBS. This may potentially use less CPU than using a virtual camera, while still having access to the webcam in multiple applications.

If you load the webcam in OBS first, you'll need to use the Virtual Camera and some special settings to have the webcam be available in other applications, like the browser. Window-capturing is an alternative that uses less CPU and does not require special drivers to be installed.

It is recommend to consider using the Electron Capture app as the window-capture source app, as it is frameless, can be pinned on top, uses less CPU than the Chrome browser, and can be screen-captured or window-captured by most applications. It's also designed for VDO.Ninja, so lots of command line options available.

## Related

{% content-ref url="../advanced-settings/design-parameters/cleanoutput.md" %}
[cleanoutput.md](../advanced-settings/design-parameters/cleanoutput.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-fullscreenbutton.md" %}
[and-fullscreenbutton.md](../advanced-settings/settings-parameters/and-fullscreenbutton.md)
{% endcontent-ref %}
