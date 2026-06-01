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
