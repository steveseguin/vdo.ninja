---
description: Use the Ninja OBS Plugin to publish from OBS to VDO.Ninja, receive VDO.Ninja sources, and reduce reliance on separate browser tabs.
---

# Using the Ninja OBS Plugin with VDO.Ninja

The Ninja OBS Plugin adds VDO.Ninja publishing and receiving to OBS Studio, so you manage fewer separate browser tabs.

* [https://steveseguin.github.io/ninja-obs-plugin/](https://steveseguin.github.io/ninja-obs-plugin/)

Download the release package that matches your installed OBS version. Builds for different OBS versions are not interchangeable.

## When to use it

* OBS is already the center of your production.
* You want to send an OBS scene or clean output into a VDO.Ninja room or to remote viewers.
* You want VDO.Ninja guests as OBS sources without separate browser windows.

Test it on the same computer, network and OBS scene you will use for the real session.

## Publishing and receiving

* **Publishing** uses OBS's streaming output (**Settings -> Stream**), so OBS cannot stream to another destination at the same time. **Tools -> VDO.Ninja Studio** holds the basic stream ID, password, room and **Go Live** controls.
* **Receiving** uses the **VDO.Ninja Source**. By default it plays the feed through an internal browser source. **Use Native Receiver (Experimental)** switches to a native VP9/H.264/Opus receiver, which is also required for transparent VP9 alpha from [Game Capture](using-game-capture-with-vdo.ninja.md).
* **Auto Manage Inbound Streams** can add incoming room feeds to a scene as sources.

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
