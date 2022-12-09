---
description: Adds a full-screen button to the control bar
---

# \&fullscreenbutton

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&fsb`

## Details

`&fullscreenbutton` adds a full-screen button to the control bar. It essentially just mimics F11, with added support for detecting the Escape button to exit full screen.

![](../../.gitbook/assets/image.png)

Also while using `&fullscreenbutton`, the previous little 'full window' button in the top-right of videos (if in a group room) will also auto-F11 and isolate that video, rather than just isolate the video.

You can still right-click and select "full-window" on any video to isolate it without going full screen, if you need that.

You can test by opening two such guest links:\
[https://vdo.ninja/?fsb\&room=test123123123\&webcam\&autostart](https://vdo.ninja/?fsb\&room=test123123123\&webcam\&autostart)

Ultimately I'd like to override the native video full screen button with this behaviour, when `&fullscreenbutton` is used, but I'm still working on that aspect.

## Related

{% content-ref url="../../source-settings/fullscreen.md" %}
[fullscreen.md](../../source-settings/fullscreen.md)
{% endcontent-ref %}
