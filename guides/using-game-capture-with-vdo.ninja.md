---
description: Use the standalone Game Capture app to publish game, window, or screen-style captures into VDO.Ninja with a steadier native capture path.
---

# Using Game Capture with VDO.Ninja

Game Capture is a standalone Windows app for sending a game, app window, or screen-style capture into VDO.Ninja.

It can be useful when browser screen sharing is not steady enough, or when you want a more direct capture and encoding path for gameplay, remote production, or recording workflows.

## Links

* [https://github.com/steveseguin/Game-capture](https://github.com/steveseguin/Game-capture)
* [https://vdo.ninja/gamecapture](https://vdo.ninja/gamecapture)

## Why use it

Normal browser screen sharing is convenient, but the browser may adjust capture, encoding, and performance behavior during a session.

Game Capture is more like a dedicated video publishing tool. It can provide a steadier capture pipeline for some Windows workflows, especially when publishing gameplay or a specific app window.

This does not make a bad Internet connection good, but it can remove some of the browser-related variability from the publishing side.

## Good uses

Game Capture can be a good fit for:

* gameplay capture
* app or window capture
* esports productions
* remote guests sending a specific program window
* productions where the browser screen-share path is not consistent enough
* recording workflows where a steadier capture source is worth testing

## Basic workflow

1. Create a VDO.Ninja room or stream ID.
2. Open Game Capture on the Windows computer that will publish the video.
3. Select the game, app, or window to capture.
4. Enter the VDO.Ninja room or stream details.
5. Start publishing.
6. Add the guest, solo, scene, or view link to OBS or your production system.

## Things to test

Before using it for a real show:

* confirm the selected window captures correctly
* confirm the audio source is correct
* check that the receiving OBS source is stable
* test the bitrate and frame rate on the actual network
* record a short sample and play it back

## Related

{% content-ref url="../steves-helper-apps/game-capture.md" %}
[game-capture.md](../steves-helper-apps/game-capture.md)
{% endcontent-ref %}

{% content-ref url="recording-video-with-consistent-results.md" %}
[recording-video-with-consistent-results.md](recording-video-with-consistent-results.md)
{% endcontent-ref %}

{% content-ref url="how-to-screen-share-in-1080p.md" %}
[how-to-screen-share-in-1080p.md](how-to-screen-share-in-1080p.md)
{% endcontent-ref %}
