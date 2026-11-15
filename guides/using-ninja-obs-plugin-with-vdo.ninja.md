---
description: Use the Ninja OBS Plugin to publish from OBS to VDO.Ninja, receive VDO.Ninja sources, and reduce reliance on separate browser tabs.
---

# Using the Ninja OBS Plugin with VDO.Ninja

The Ninja OBS Plugin adds VDO.Ninja publishing and receiving to OBS Studio, so you manage fewer separate browser tabs.

* [Install the Ninja OBS Plugin](https://github.com/steveseguin/ninja-obs-plugin/blob/main/INSTALL.md)

Download the release package that matches your installed OBS version. Builds for different OBS versions are not interchangeable.

## Receive a stream in OBS

1. Install the plugin and restart OBS.
2. Ask the sender to start their VDO.Ninja stream and send you its stream ID and password, if used.
3. In OBS, select **Sources > + > VDO.Ninja Source**.
4. Enter the matching stream details and confirm the source settings.
5. Check moving video and the OBS audio meter. Record a short sample and play it back.

For a transparent Game Capture feed, follow the [native receiver setup](using-game-capture-with-vdo.ninja.md#ninja-obs-plugin). For an ordinary feed, start with the default source settings.

## Publish your OBS scene

1. Prepare the scene you want viewers to see.
2. Open **Tools > VDO.Ninja Studio** and enter your stream ID, password, and room if needed.
3. Select **Go Live**. This uses OBS's main streaming output.
4. Open the matching VDO.Ninja viewer link on another device and check picture and sound.

For the full publishing setup, see [Publish from OBS into VDO.Ninja](publish-from-obs-into-vdo.ninja.md).

## When to use it

* OBS is already the center of your production.
* You want to send an OBS scene or clean output into a VDO.Ninja room or to remote viewers.
* You want VDO.Ninja guests as OBS sources without separate browser windows.

Test it on the same computer, network and OBS scene you will use for the real session.

## Publishing and receiving

* **Publishing with Go Live** uses OBS's main streaming output (**Settings -> Stream**). **Tools -> VDO.Ninja Studio** holds the basic stream ID, password, room and **Go Live** controls.
* **Receiving** uses the **VDO.Ninja Source**. By default it plays the feed through an internal browser source. **Use Native Receiver (Experimental)** switches to a native VP9/H.264/Opus receiver. For transparent [Game Capture](using-game-capture-with-vdo.ninja.md) feeds, match this with Game Capture's **Alpha Playback -> OBS native receiver** mode.
* **Auto Manage Inbound Streams** can add incoming room feeds to a scene as sources.

Game Capture also supports transparency in an ordinary OBS **Browser Source**, using H.264 and its separate **Browser** alpha mode. Follow the [browser alpha setup](using-game-capture-with-vdo.ninja.md#browser-or-obs-browser-source) for that path.

## Loss-protection settings

Start with **Packet Duplication: Off**. Video NACK retransmission and pacing are automatic in every mode; `Off` only disables proactive duplicate packets.

| Mode | What it copies | Extra video traffic (best effort) |
| --- | --- | --- |
| Off | Nothing; NACK repair only | None |
| Low | Keyframe packets | Up to 20% |
| Medium | Keyframes plus a quarter of delta packets | Up to 50% |
| High | Every video packet | Up to 100% |

Use **Low** when isolated random loss remains and the uplink has spare capacity. Keep **High** for measured loss on a route that can carry nearly double the video traffic. The cost applies to each direct viewer.

**Audio RED (Experimental)** and **Adaptive Bitrate from REMB (Experimental)** are separate options, off by default. Audio RED adds the previous Opus frame when the viewer supports it. Adaptive bitrate lowers a supported OBS encoder's bitrate when viewers report congestion; it avoids loss rather than repairing it.

The plugin does not generate video RED/ULPFEC or FlexFEC. See the [advanced packet-loss reference](packet-loss-recovery-and-resilient-media.md#ninja-obs-plugin) for protocol details, timing and cache limits, native-receiver limitations and testing.

## Before using it live

* Confirm the plugin is installed and visible in OBS.
* Publish into the intended VDO.Ninja room or stream ID.
* Check audio routing.
* Record a short sample.
* Confirm the receiving side gets the expected video and audio.

## Related

{% content-ref url="../steves-helper-apps/ninja-obs-plugin.md" %}
[ninja-obs-plugin.md](../steves-helper-apps/ninja-obs-plugin.md)
{% endcontent-ref %}

{% content-ref url="recording-video-with-consistent-results.md" %}
[recording-video-with-consistent-results.md](recording-video-with-consistent-results.md)
{% endcontent-ref %}

{% content-ref url="publish-from-obs-into-vdo.ninja.md" %}
[publish-from-obs-into-vdo.ninja.md](publish-from-obs-into-vdo.ninja.md)
{% endcontent-ref %}
