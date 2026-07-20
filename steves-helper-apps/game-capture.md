---
description: Windows game, window, and Spout2 capture app for VDO.Ninja with VTuber alpha video, hardware encoding, window audio, and multi-viewer support.
---

# Game Capture for VDO.Ninja

Game Capture is a standalone Windows app for sending a game, app window, esports feed, or local Spout2 source directly into VDO.Ninja without relying on a browser engine in the capture application itself. It is designed for high-performance capture workflows where hardware encoding, window-specific audio, transparent VTuber avatars, and simple guest-side publishing matter.

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

* game, window, or Spout2 capture direct to VDO.Ninja
* window-specific audio capture without third-party routing tools
* hardware-accelerated video encoding and bitrate presets for gameplay
* stream ID and full VDO.Ninja URL support
* room-compatible publishing for director and OBS workflows
* dual-stream routing for high-quality and lower-quality monitor paths
* multi-viewer support from a single HD encode workflow
* native Windows app with no Electron runtime
* free and open source

## Spout2 and VTuber sources

On Windows, Game Capture can receive Spout2 video from avatar and graphics apps such as VTube Studio, Warudo, VSeeFace, and VNyan. This captures the sender's clean output rather than its control window and keeps transparent pixels available for the alpha or chroma workflow.

1. Enable Spout or Spout2 output in the avatar app and leave it running.
2. In Game Capture, set **Video Source** to **Spout2 (avatar apps)**.
3. Select the named sender, enter the VDO.Ninja stream or room details, and go live.

Spout2 is video-only. Game Capture defaults these sources to **No audio**; select an output mix, microphone, or additional microphone separately if needed.

## Transparent Spout2 video in OBS

For true transparency, choose **VP9 (OBS Alpha Preview, auto fallback)** and enable the alpha workflow. Receive the stream with the [Ninja OBS Plugin](ninja-obs-plugin.md), add a **VDO.Ninja Source**, and enable **Use Native Receiver (Experimental)**. OBS Browser Sources and normal browser viewers do not composite the separate alpha track.

VP9 alpha encodes both color and alpha video in software. Start with 1080p30 or 720p60 if 1080p60 drops frames. For a lighter hardware-encoded path, use H.264/NVENC with **Alpha Background → Chroma background**, then apply a chroma-key filter at the receiver.

If a sender is listed but displays black, configure Game Capture and the sender app to use the same GPU in Windows Graphics settings.

The complete setup and troubleshooting flow is in [Using Game Capture and Spout2 with VDO.Ninja](../guides/using-game-capture-with-vdo.ninja.md).

## Downloads

The latest installer, portable app, and ZIP package are linked from:

* [https://github.com/steveseguin/game-capture/releases/latest](https://github.com/steveseguin/game-capture/releases/latest)

## Notes

* Windows-only at this time
* for macOS or Linux users already using OBS, the [Ninja OBS Plugin](ninja-obs-plugin.md) supports OBS v32 systems
* intended for esports, game capture, and other high-performance capture cases
* capture and encoder settings are locked while streaming, so stop the stream first before changing advanced capture settings
* if you need the broadest compatibility for non-OBS viewers, leave the alpha/transparency workflow disabled
