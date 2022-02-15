---
description: Attempts to show the mouse cursor on screen shares
---

# \&screensharecursor

## Aliases

* `&cursor`

## Details

Adding `&screensharecursor` to a source link attempts to show the mouse cursor on screen shares.

This flag is introduced in v18.4, but it's largely useless currently due to lack of support from most browsers.

The default cursor state in VDO.Ninja is to not show a cursor, but Chrome/Firefox will still add a cursor overlay in regardless.\
\
If sharing a Chrome tab, Chrome adds the cursor in only when that tab is active.

According to the web spec, we should be able to control the visibility of a cursor, but we can't. Not yet.

You can see this link to tinker with different settings easily, to validate the problem:\
[https://www.webrtc-experiment.com/getDisplayMedia/](https://www.webrtc-experiment.com/getDisplayMedia/)\
\
For information on alternative ideas on how to hide or show the cursor, you can see the following article. Generally, to have better control of the cursor, maybe instead capture the screen with OBS and bring the video into VDO.Ninja as a virtual camera.

## Related

{% content-ref url="../common-errors-and-known-issues/cursor-shows-when-screen-sharing.md" %}
[cursor-shows-when-screen-sharing.md](../common-errors-and-known-issues/cursor-shows-when-screen-sharing.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/and-nocursor.md" %}
[and-nocursor.md](../general-settings/and-nocursor.md)
{% endcontent-ref %}
