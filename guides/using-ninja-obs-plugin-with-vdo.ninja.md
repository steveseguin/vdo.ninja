---
description: Use the Ninja OBS Plugin to publish from OBS to VDO.Ninja, receive VDO.Ninja sources, and reduce reliance on separate browser tabs.
---

# Using the Ninja OBS Plugin with VDO.Ninja

The Ninja OBS Plugin is an OBS Studio plugin for VDO.Ninja workflows.

It can publish from OBS into VDO.Ninja and help receive VDO.Ninja sources inside OBS without managing everything through separate browser tabs.

## Link

* [https://steveseguin.github.io/ninja-obs-plugin/](https://steveseguin.github.io/ninja-obs-plugin/)

## Why use it

Browser sources are flexible, but they are still browser sources. For some production workflows, using an OBS plugin can feel more direct and easier to manage.

The plugin can be useful when:

* OBS is already the center of the production
* you want to publish from OBS into VDO.Ninja
* you want VDO.Ninja sources managed more directly inside OBS
* you want fewer separate browser windows or tabs
* you want a workflow that feels closer to a normal video pipeline

This may be more predictable than a normal browser publishing path in some setups, but it should still be tested with the same computer, network, and OBS scene setup that will be used for the real recording.

## Example uses

You might use the plugin to:

* send an OBS scene into a VDO.Ninja room
* publish a clean OBS output to remote viewers
* bring VDO.Ninja guests into OBS more directly
* simplify a recording or production setup that otherwise needs many browser tabs

## Loss-protection settings

Start with **Packet Duplication: Off**. The plugin's video NACK retransmission and pacing are automatic; `Off` only
disables proactive duplicate packets.

Use **Low** for keyframe protection when isolated random loss remains and the uplink has spare capacity. **Medium** adds
copies of selected delta packets. **High** can send every video packet twice and should be reserved for measured loss on
a route that can sustain nearly double the video traffic. The cost is per direct viewer.

**Audio RED** and **Adaptive Bitrate from REMB** are separate default-off options. Audio RED carries a previous Opus
frame when the viewer negotiates it. Adaptive bitrate reduces a supported OBS encoder when receiver estimates fall; it
is congestion avoidance rather than packet repair.

The plugin does not generate video RED/ULPFEC or FlexFEC. See the [advanced packet-loss reference](packet-loss-recovery-and-resilient-media.md#ninja-obs-plugin)
for the protocol distinctions, exact timing and cache limits, native-receiver limitations, and testing guidance.

## Before using it live

Do a short test before the real session:

* confirm the plugin is installed and visible in OBS
* test publishing into the intended VDO.Ninja room or stream ID
* check audio routing
* record a short sample
* confirm the receiving side sees the expected video and audio

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
