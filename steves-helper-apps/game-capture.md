---
description: Windows game, window, and Spout2 capture app for VDO.Ninja with VTuber alpha video, hardware encoding, window audio, and multi-viewer support.
---

# Game Capture for VDO.Ninja

Game Capture sends a game, app window, camera, or Spout2 source directly into VDO.Ninja. It includes hardware encoding, window audio capture, and transparent video for avatars and graphics. Windows is the stable release; an Apple Silicon Mac beta has fewer features.

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

## Transparent Spout2 video in browsers and OBS

Game Capture 0.2.68 adds H.264 browser alpha. The source app must supply transparent pixels through Spout2. Choose the playback mode for your receiver:

* **Browser or OBS Browser Source:** select H.264, set **Alpha Playback** to **Browser / OBS Browser Source (H.264)**, and enable browser alpha. Use the generated viewer link with the `https://vdo.ninja/alpha/` base, preserve its query parameters, and add `&transparent`.
* **Ninja OBS Plugin:** set **Alpha Playback** to **OBS native receiver**, select H.264 or VP9, and enable alpha. In the plugin's **VDO.Ninja Source**, enable **Use Native Receiver (Experimental)**.

Start at 720p30, then raise the resolution or frame rate after checking playback. Stop streaming and capture before changing alpha modes.

If a sender is listed but displays black, configure Game Capture and the sender app to use the same GPU in Windows Graphics settings.

The complete setup and troubleshooting flow is in [Using Game Capture and Spout2 with VDO.Ninja](../guides/using-game-capture-with-vdo.ninja.md).

## Downloads

The latest installer, portable app, and ZIP package are linked from:

* [https://github.com/steveseguin/game-capture/releases/latest](https://github.com/steveseguin/game-capture/releases/latest)

## Notes

* Spout2 capture is Windows-only
* for macOS or Linux users already using OBS, the [Ninja OBS Plugin](ninja-obs-plugin.md) supports OBS v32 systems
* intended for esports, game capture, and other high-performance capture cases
* capture and encoder settings are locked while streaming, so stop the stream first before changing advanced capture settings
* for receivers without alpha support, use H.264 with alpha off, or choose **Chroma background** and remove the color at the receiver
