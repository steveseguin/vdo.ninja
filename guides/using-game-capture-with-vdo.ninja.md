---
description: Publish games, Windows app audio, or Spout2 VTuber avatars to VDO.Ninja, including transparent alpha video for the native OBS receiver.
---

# Using Game Capture and Spout2 with VDO.Ninja

Game Capture is a standalone app for sending a game, app window, camera, or local Spout2 source into VDO.Ninja. The Windows version is the stable release; a Mac version for Apple Silicon is an experimental beta with fewer features.

Browser screen sharing is convenient, but the browser can change capture and encoding behavior during a session. Game Capture is a dedicated publisher with hardware encoding and per-window audio, so it can give a steadier capture for gameplay or a single app window. It does not fix a bad Internet connection.

* [https://github.com/steveseguin/game-capture](https://github.com/steveseguin/game-capture)
* [https://vdo.ninja/gamecapture](https://vdo.ninja/gamecapture)

## Good uses

* Gameplay, esports and remote guests sending one program window.
* Spout2 output from VTube Studio, Warudo, VSeeFace, VNyan and similar avatar apps.
* Transparent VTuber or graphics feeds for the Ninja OBS Plugin's native receiver.
* Shows or recordings where browser screen sharing is not consistent enough.

## Basic workflow

1. On the computer that will publish, open Game Capture.
2. Select the game, app or window to capture, and its audio.
3. Enter a Stream ID or a full VDO.Ninja URL, plus the room and password if you use them.
4. Go live.
5. Add the matching view, solo or scene link to OBS or your production system.

## Publish a Spout2 source

Spout2 shares video between Windows apps on the same computer. Use it to publish a clean avatar or graphics output without the source app's menus.

1. Turn on Spout or Spout2 output in the avatar or graphics app, and keep it running.
2. In Game Capture, set **Video Source** to **Spout2 (avatar apps)**.
3. Select the sender and confirm its preview or size appears.
4. Enter the stream details and go live.

Spout2 carries no audio, so Game Capture switches the **Audio Source** to **No audio** for Spout2. If the feed needs sound, choose **Default output mix**, **Selected microphone/input** or another audio source.

## Choose a transparency method

| Goal | Game Capture settings | Receiver |
| --- | --- | --- |
| Widest compatibility | H.264, alpha off | Browser viewer, OBS Browser Source, or the plugin |
| True transparent video | **VP9 (OBS Alpha Preview, auto fallback)** with **Enable alpha workflow (experimental)** on | [Ninja OBS Plugin](../steves-helper-apps/ninja-obs-plugin.md) **VDO.Ninja Source** with **Use Native Receiver (Experimental)** on |
| Hardware-encoded chroma key | H.264/NVENC with **Alpha Background -> Chroma background** | A chroma-key filter in OBS or the receiving app |

True VP9 alpha sends separate color and alpha video tracks. Browser viewers and OBS Browser Sources show only the color video. The bundled FFmpeg provides the libvpx VP9 encoder. VP9 alpha is CPU-heavy, so start at 1080p30 or 720p60 and raise quality after checking dropped frames and system load.

## Spout2 troubleshooting

* **No senders listed:** turn on Spout output in the source app, keep it running, and select **Refresh** in Game Capture.
* **Sender is black:** set both apps to the same GPU in Windows **Settings -> System -> Display -> Graphics**.
* **No sound:** choose an audio source; Spout2 carries no audio.
* **Transparency shows black:** use the plugin's **VDO.Ninja Source** with **Use Native Receiver (Experimental)**, not an OBS Browser Source, and confirm the VP9 alpha workflow is on.
* **Low frame rate or high CPU:** lower the resolution or FPS, or use the H.264/NVENC chroma method.

## Test before a real show

* The selected window captures correctly, with the right audio.
* The receiving OBS source is stable.
* Bitrate and frame rate hold on the real network.
* A short recorded sample plays back cleanly.

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

{% content-ref url="how-to-stream-transparent-video.md" %}
[how-to-stream-transparent-video.md](how-to-stream-transparent-video.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/ninja-obs-plugin.md" %}
[ninja-obs-plugin.md](../steves-helper-apps/ninja-obs-plugin.md)
{% endcontent-ref %}
