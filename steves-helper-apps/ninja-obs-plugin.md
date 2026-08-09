---
description: Publish to or receive from VDO.Ninja in OBS, including transparent Spout2 and VTuber video from Game Capture through the native receiver.
---

# Ninja OBS Plugin for VDO.Ninja

The Ninja OBS Plugin adds native VDO.Ninja publishing and receiving tools to OBS Studio. It is useful when you want a more integrated OBS workflow than opening a separate browser publisher or Browser Source.

## Link

* [https://steveseguin.github.io/ninja-obs-plugin/](https://steveseguin.github.io/ninja-obs-plugin/)

## Key features

* publish live from OBS directly to VDO.Ninja
* receive a VDO.Ninja stream as a **VDO.Ninja Source**
* multi-viewer support
* peer-to-peer publishing model
* open-source plugin
* support for OBS v32 systems, including Windows, macOS, and Linux
* can auto-add room participants into OBS as browser sources
* experimental native VP9/H.264/Opus receiver with dual-track VP9 alpha support
* automatic paced video NACK repair, with optional packet duplication, Audio RED, and REMB adaptation for advanced loss testing

## Packet-loss protection

Leave **Packet Duplication** set to **Off** for the normal starting point. Video NACK retransmission, paced sending, and
the plugin's two-second keyframe safety limit still operate while duplication is off.

The optional modes add delayed copies of selected video RTP packets:

* **Low:** keyframe packets, up to 20% best-effort extra video traffic
* **Medium:** keyframes plus one quarter of delta packets, up to 50% extra
* **High:** every packet can receive one copy, up to 100% extra

These modes are packet duplication, not video RED, ULPFEC, FlexFEC, or RTX. **Audio RED** is a separate negotiated
option that can carry one previous Opus frame. **Adaptive Bitrate from REMB** tries to avoid congestion by lowering a
supported OBS encoder; it does not repair a missing packet.

For the exact NACK cache, timing, bandwidth/fan-out costs, mode-selection guidance, receiver limitations, and the reason
H.264 ULPFEC is not offered, see [Advanced packet-loss recovery and resilient media](../guides/packet-loss-recovery-and-resilient-media.md#ninja-obs-plugin).

## Receive transparent Game Capture video

The tested transparent workflow uses a Spout2 avatar or graphics source in [Game Capture](game-capture.md), VDO.Ninja for transport, and the plugin's native receiver in OBS:

1. In Game Capture, choose **Spout2 (avatar apps)** and select the sender.
2. Choose **VP9 (OBS Alpha Preview, auto fallback)** and enable the alpha workflow.
3. Publish with a stream ID or room workflow.
4. In OBS, add a **VDO.Ninja Source**, enter the matching stream details, and enable **Use Native Receiver (Experimental)**.

OBS Browser Sources and normal browser viewers receive the standard color track but do not composite the separate alpha track. If software VP9 is too CPU-heavy, use Game Capture's H.264/NVENC **Chroma background** workflow and apply a chroma-key filter in OBS instead.

See [Using Game Capture and Spout2 with VDO.Ninja](../guides/using-game-capture-with-vdo.ninja.md) for the complete sender setup and troubleshooting flow.

## Notes

* positioned as a simpler publishing workflow than relying on a separate browser publisher
* useful for non-Windows users who want an OBS-native publishing workflow, since the standalone Game Capture app is currently Windows-only
* **Use Native Receiver (Experimental)** is required for the dual-track VP9 alpha workflow
* packet protection is applied per direct viewer, so its upload cost grows with P2P fan-out
