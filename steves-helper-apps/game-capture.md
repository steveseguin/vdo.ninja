---
description: Windows game capture and window capture app for VDO.Ninja with hardware encoding, window-audio capture, and multi-viewer support.
---

# Game Capture for VDO.Ninja

Game Capture is a standalone Windows app for sending a game, app window, or esports feed directly into VDO.Ninja without relying on a browser engine in the capture application itself. It is designed for high-performance capture workflows where hardware encoding, window-specific audio, and simple guest-side publishing matter.

## Link

* [https://vdo.ninja/gamecapture](https://vdo.ninja/gamecapture)
* [https://github.com/steveseguin/game-capture](https://github.com/steveseguin/game-capture)

## When to use it

Use Game Capture when you want a player or guest to publish gameplay into VDO.Ninja without asking them to run a full OBS setup. This is useful for esports rooms, multiplayer Twitch productions, remote game commentary, and other cases where the host wants each player as a separate OBS source.

The usual workflow is:

1. The host creates the VDO.Ninja room or stream IDs.
2. Each player opens Game Capture on Windows.
3. The player selects their game or app window and starts publishing.
4. The host adds the resulting VDO.Ninja view link, or the room's solo/scene links, to OBS.

For room-based productions, Game Capture can feed the same VDO.Ninja room workflows as browser-based screen sharing. The director or OBS operator can still use isolated links, solo links, and scene links for each player.

## Key features

* game or window capture direct to VDO.Ninja
* window-specific audio capture without third-party routing tools
* hardware-accelerated video encoding and bitrate presets for gameplay
* stream ID and full VDO.Ninja URL support
* room-compatible publishing for director and OBS workflows
* dual-stream routing for high-quality and lower-quality monitor paths
* multi-viewer support from a single HD encode workflow
* native Windows app with no Electron runtime
* free and open source

## Downloads

The latest installer, portable app, and ZIP package are linked from:

* [https://github.com/steveseguin/game-capture/releases/latest](https://github.com/steveseguin/game-capture/releases/latest)

## Notes

* Windows-only at this time
* for macOS or Linux users already using OBS, the [Ninja OBS Plugin](ninja-obs-plugin.md) supports OBS v32 systems
* intended for esports, game capture, and other high-performance capture cases
* capture and encoder settings are locked while streaming, so stop the stream first before changing advanced capture settings
* if you need the broadest compatibility for non-OBS viewers, leave the alpha/transparency workflow disabled
