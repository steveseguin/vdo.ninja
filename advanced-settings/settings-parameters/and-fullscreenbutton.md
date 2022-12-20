---
description: Adds a full-screen button to the control bar
---

# \&fullscreenbutton

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&fsb`

## Details

`&fullscreenbutton` adds a full-screen button to the control bar. It essentially just mimics F11, with added support for detecting the Escape button to exit full screen.

![](<../../.gitbook/assets/image (4) (6).png>)

Also while using `&fullscreenbutton`, the previous little 'full window' button in the top-right of videos (if in a group room) will also auto-F11 and isolate that video, rather than just isolate the video.

You can still right-click and select "full-window" on any video to isolate it without going full screen, if you need that.

You can test by opening two such guest links:\
[https://vdo.ninja/?fsb\&room=test123123123\&webcam\&autostart](https://vdo.ninja/?fsb\&room=test123123123\&webcam\&autostart)

Ultimately I'd like to override the native video full screen button with this behaviour, when `&fullscreenbutton` is used, but I'm still working on that aspect.

### Update in v23 (currently alpha)

`&fullscreenbutton` is improved, so that even when there is a single video on the page, it will show. It also shows more reliably, without needing to move the mouse around a bit to re-show the button after going full screen. Lastly, when used, it now hides the native full-screen button, so users have to use it.

Unlike the native full screen button, this full screen mode alternative keeps the chat and control bar overlays visible (like press F11). Since this is probably the preferred way most users will want to full screen to work, I may make it the default mode at some point, after some more testing/feedback. (not supported on iOS/iPhone tho)

Testing at [https://vdo.ninja/alpha/?fsb](https://vdo.ninja/alpha/?fsb) (join a room as a guest to trigger)

## Related

{% content-ref url="../../source-settings/fullscreen.md" %}
[fullscreen.md](../../source-settings/fullscreen.md)
{% endcontent-ref %}
