---
description: Cover the local page with a black overlay while the session continues.
---

# &blackoutmode

Use blackout mode to cover the VDO.Ninja page on your screen. Click the overlay to return to the controls.

**Audio and video continue while the overlay is open.** It does not mute your microphone, stop your camera, silence playback or change what remote viewers receive. To stop sharing audio or video, use the microphone and camera controls before entering blackout mode, or hang up.

## Aliases

* `&blackout`
* `&bo`
* `&bom`

## Options

| Value | Result |
| --- | --- |
| No value | Show the blackout button |
| `1` (or any non-empty value) | Show the button and open the overlay immediately |

`0` and `false` also open the overlay because they are non-empty URL values. Omit the parameter to leave the button hidden.

```text
https://vdo.ninja/?room=roomname&blackoutmode
https://vdo.ninja/?push=streamID&blackoutmode=1
```

## Related

* [`&mute`](../../source-settings/and-mute.md) - Start with the microphone muted
* [`&videomute`](../../source-settings/and-videomute.md) - Start with the camera muted
* [`&hidemenu`](../design-parameters/and-hidemenu.md) - Hide interface controls
