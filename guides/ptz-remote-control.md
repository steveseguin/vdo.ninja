---
description: How to enable and control PTZ remotely (director, viewer, API, and remote mirror/rotate)
---

# PTZ Remote Control

## Overview

VDO.Ninja can remotely control pan, tilt, zoom, and focus on supported cameras. The sender must opt in with `&ptz`, and the camera/browser must actually expose PTZ or focus controls. Directors can control PTZ from the built-in video settings menu, while viewers can opt in using `&remote`.

Remote output transforms (mirror/rotate) are also available via `&remote` authorization, including from the dedicated `ptz.html` page and API commands.

To confirm device support, use `https://vdo.ninja/supports` with the target camera selected.

## Quick Start (Push + View)

Sender (push link):
`https://vdo.ninja/?push=STREAMID&ptz&remote`

Viewer (view link):
`https://vdo.ninja/?view=STREAMID&remote`

If you want a shared passcode, add the same value on both sides:
`&remote=somepasscode`

## Director Control (Rooms)

Director link:
`https://vdo.ninja/?director=ptztestroom`

Guest link:
`https://vdo.ninja/?room=ptztestroom&ptz`

Directors (and co-directors) can adjust PTZ from the per-guest video settings menu. Viewers do not need `&remote` for this.

## Viewer Mouse Controls (with `&remote`)

When `&remote` is enabled on both sides, viewers can use the mouse wheel over the video:

- Wheel: zoom in or out
- Shift + wheel: pan left or right
- Ctrl (or Command) + wheel: focus in or out
- Ctrl (or Command) + Shift + wheel: tilt up or down
- Hold Alt for smaller step sizes

Pan/tilt only work if the camera exposes those controls and the sender has `&ptz`.

## Right-click Menu (with `&remote`)

Right-clicking a remote video (with `&remote` enabled) exposes the remote context menu (hangup/reload). PTZ is still controlled by the mouse/keyboard shortcuts above or the sliders below; the right-click menu does not currently surface PTZ controls.

## PTZ Example App

Use the example controller:
`https://vdo.ninja/examples/ptz?view=STREAMID&remote`

Make sure the sender uses:
`https://vdo.ninja/?push=STREAMID&ptz&remote`

Chrome requires the sender page to remain visible on screen for PTZ controls to work. If the sender tab/window is hidden, the browser blocks PTZ changes.

## Dedicated PTZ Control Surface

You can also use the dedicated PTZ control page:
`https://vdo.ninja/ptz.html`

Typical use:

- Controller: `https://vdo.ninja/ptz.html?view=STREAMID&remote`
- Sender: `https://vdo.ninja/?push=STREAMID&ptz&remote`

Use matching `&remote=PASSCODE` values on both sides if you want passcode-gated control.

Additional remote transform controls in `ptz.html`:

- `Mirror Remote` button (toggle remote mirror state)
- `Rotate Remote +90` button
- `Reset Remote Rotation` button
- Hotkeys: `Ctrl/Cmd+M` (mirror), `Ctrl/Cmd+R` (rotate +90), `Ctrl/Cmd+Shift+R` (reset rotation)

### `ptz.html` URL Parameters

The dedicated PTZ page supports additional setup/tuning query parameters:

- `?view=STREAMID` or `?url=FULL_VIEW_URL`: target the stream/viewer source
- `?remote` or `?remote=PASSCODE`: enable/pass through remote authorization
- `?target=STREAMID_OR_SLOT`: explicit API target override
- `?mode=raw`: disable the light embed preset defaults
- `?stage=1`: start in stage mode
- `?previewpad=0|1`: disable/enable drag and wheel preview pad
- `?paninvert=1` (alias `?invertpan=1`): invert pan direction
- `?mirrorpreview=1`: mirror the preview pane by default
- `?rotatepreview=90|-90|180`: set preview rotation
- `?overlayautohide=0|1`: disable/enable control overlay auto-hide
- `?overlayopacity=0.3..0.95`: set stage overlay opacity
- `?overlaytransparent=0|1`: force solid/transparent stage controls
- `?noaudio`: mute viewer audio when using light preset mode
- `?nopreview`: include `&nopreview` in generated sender template links

Example:

`https://vdo.ninja/ptz.html?view=STREAMID&remote=PASSCODE&stage=1&previewpad=1&paninvert=1&overlayopacity=0.75`

## On-screen PTZ Sliders

Add `&ptzslider` to a director or view link to show PTZ sliders (zoom/pan/tilt) directly on the video element. `&zoomslider` shows a zoom-only slider.

Example:
`https://vdo.ninja/?view=STREAMID&remote&ptzslider`

## Automation with `&api`

For scripted control or Stream Deck integrations, add `&api=YOURKEY` to the controlling page and use the HTTP/WSS API or IFRAME API commands (`zoom`, `pan`, `tilt`, `focus`).

For director-side targeted control, the legacy `targetGuest` action also supports:

- `ptzZoom`
- `ptzPan`
- `ptzTilt`
- `ptzFocus`
- `ptzAutofocus`
- `remoteMirror` (aliases: `mirror`, `mirrorGuest`)
- `remoteRotate` (aliases: `rotate`, `rotateGuest`)

Example:

```javascript
iframe.contentWindow.postMessage({
    function: "targetGuest",
    target: "1", // slot or stream ID
    action: "remoteRotate",
    value: true // true=+90 step, false=reset, number=explicit rotation
}, "*");
```

References:
- [IFRAME API for Directors](iframe-api-documentation/iframe-api-for-directors.md)
- [HTTP/WSS API reference](../advanced-settings/api-and-midi-parameters/api/api-reference.md)

## Troubleshooting

- If you see `the page is not visible` or `couldn't save defaults`, the sender tab is hidden. Keep the sender visible or in a small always-on-top window.
- If controls do nothing, verify `&ptz` is on the sender link and `&remote` (with matching passcode) is on the viewer link.
- If only zoom or focus work, the camera may not support pan/tilt.
