---
description: Publish games, Windows app audio, or Spout2 VTuber avatars to VDO.Ninja, including transparent alpha video for the native OBS receiver.
---

# Using Game Capture and Spout2 with VDO.Ninja

Game Capture is a standalone Windows app for sending a game, app window, or local Spout2 source into VDO.Ninja.

It can be useful when browser screen sharing is not steady enough, or when you want a more direct capture and encoding path for gameplay, remote production, or recording workflows.

## Links

* [https://github.com/steveseguin/game-capture](https://github.com/steveseguin/game-capture)
* [https://vdo.ninja/gamecapture](https://vdo.ninja/gamecapture)

## Why use it

Normal browser screen sharing is convenient, but the browser may adjust capture, encoding, and performance behavior during a session.

Game Capture is more like a dedicated video publishing tool. It can provide a steadier capture pipeline for some Windows workflows, especially when publishing gameplay or a specific app window.

This does not make a bad Internet connection good, but it can remove some of the browser-related variability from the publishing side.

## Good uses

Game Capture can be a good fit for:

* gameplay capture
* app or window capture
* Spout2 output from VTube Studio, Warudo, VSeeFace, VNyan, and similar avatar apps
* transparent VTuber or graphics feeds for the VDO.Ninja OBS native receiver
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

## Publish a Spout2 source

Spout2 shares video textures between Windows apps on the same computer. It is useful for publishing a clean avatar or graphics output without capturing the source app's menus and controls.

1. Enable Spout or Spout2 output in the avatar or graphics app.
2. Keep that app running, then open Game Capture.
3. Set **Video Source** to **Spout2 (avatar apps)**.
4. Select the named sender and confirm its preview or dimensions appear.
5. Enter the stream ID, full VDO.Ninja URL, or room details and go live.

Spout2 does not carry audio. Game Capture defaults Spout2 sources to **No audio**. Choose **Default output mix**, **Default microphone/input**, or another audio option separately if the published feed needs sound.

## Choose a transparency method

| Goal | Game Capture settings | Receiver |
| --- | --- | --- |
| Widest compatibility | H.264 with alpha disabled | Browser viewer, OBS Browser Source, or native receiver |
| True transparent video | **VP9 (OBS Alpha Preview)** with the alpha workflow enabled | [Ninja OBS Plugin](../steves-helper-apps/ninja-obs-plugin.md) **VDO.Ninja Source** with **Use Native Receiver (Experimental)** enabled |
| Hardware-encoded chroma key | H.264/NVENC with **Alpha Background → Chroma background** | Apply a chroma-key filter in OBS or the receiving production app |

True VP9 alpha uses separate color and alpha video tracks. Normal browser viewers and OBS Browser Sources receive standard color video; they do not composite the alpha track. The bundled FFmpeg supplies the required libvpx VP9 encoder.

VP9 alpha is CPU-heavy. Try 1080p30 or 720p60 first, then increase quality after checking dropped frames and system load.

## Spout2 troubleshooting

* **No senders listed:** enable Spout output in the source app, keep it running, and select **Refresh** in Game Capture.
* **Sender is black or invisible:** set both apps to the same GPU under Windows **Settings → System → Display → Graphics**.
* **Video works but there is no sound:** select an audio source separately; Spout2 itself carries no audio.
* **Transparency appears black:** enable **Use Native Receiver (Experimental)** on the Ninja OBS Plugin's **VDO.Ninja Source**, not an OBS Browser Source, and confirm the VP9 alpha workflow is active.
* **Low frame rate or high CPU:** reduce output resolution or FPS, or use the H.264/NVENC chroma workflow.

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

{% content-ref url="how-to-stream-transparent-video.md" %}
[how-to-stream-transparent-video.md](how-to-stream-transparent-video.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/ninja-obs-plugin.md" %}
[ninja-obs-plugin.md](../steves-helper-apps/ninja-obs-plugin.md)
{% endcontent-ref %}
