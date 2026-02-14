---
description: Enables pan/tilt/zoom control of the device, if compatible
---

# \&ptz

Sender-Side Option! ([`&push`](push.md))

## Details

Enables pan/tilt/zoom control of the device, if compatible.

This will trigger a new permission popup though.

Can be added to a guest's URL in a room. Then the director can manually change pan, tilt and zoom for the guest's camera via the video settings menu.

Can also be added to a simple push link, then you can change pan, tilt and zoom in the video settings. To allow a viewer to control PTZ directly, add `&remote` to both the sender and viewer links (optionally with a matching passcode).
\
![](<../.gitbook/assets/image (127).png>)

The dedicated PTZ controller is available at:
`https://vdo.ninja/alpha/ptz.html`

For API/automation workflows, `targetGuest` supports PTZ actions:
`ptzZoom`, `ptzPan`, `ptzTilt`, `ptzFocus`, `ptzAutofocus`.

The dedicated PTZ surface and API also support remote output transforms:
`remoteMirror` (aliases: `mirror`, `mirrorGuest`) and `remoteRotate` (aliases: `rotate`, `rotateGuest`).

{% hint style="info" %}
Chrome blocks PTZ changes when the sender page is hidden. Keep the sender visible on screen if controls appear to do nothing or you see "page is not visible" errors.
{% endhint %}

{% content-ref url="../guides/ptz-remote-control.md" %}
[ptz-remote-control.md](../guides/ptz-remote-control.md)
{% endcontent-ref %}
