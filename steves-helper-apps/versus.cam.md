---
description: Focus on ease of use and high-bitrate / e-sports streams
---

# Versus.cam

{% embed url="https://versus.cam/" %}

Versus.cam is the upcoming and standalone replacement for the [vdo.ninja/monitor](https://vdo.ninja/monitor) page. Versus.cam has some interesting features that are specific to the upcoming version of VDO.Ninja, so at the moment it only works in conjunction with [vdo.ninja/alpha](https://vdo.ninja/alpha/).

### Details

* It contains a larger and dedicated graph per scene/view link than what the [vdo.ninja/beta/'s ](https://vdo.ninja/beta/)director room has under scene-stats. Both color code to indicate packet loss, where red is bad, and green is good.&#x20;
* It is setup to use a group room by default, with a very simple interface to login and get started without visiting vdo.ninja itself.&#x20;
* Despite having a group room by default, it works with standalone push/view links as well, via the "Add a stream manually" button, which lets you include normal view links that exist outside rooms.
* All the scene links and invite links are preconfigured for E-Sports , where video is set to pull around 20-mbps for smooth 1080p60 game play. The idea is, if you choose to use this page for creating links, it's all already setup to be used for ingestion.
* The room is configured so that guests cannot see or talk to each other. All guests can do is text-chat with the versus host.

![](<../.gitbook/assets/image (1) (2) (2).png>)

* Versus.cam is compatible with a director and the director room, so you can use a director room AND the Versus.cam room at the same time, without conflict.
* A new feature that Versus.cam has, that will also soon be coming to the normal VDO.Ninja directors' room, is the ability to **dynamically change the resolution and bitrate of remote scenes**. This works by means of the [`&remote`](../general-settings/remote.md) control feature, which is preconfigured in the links already, so no director is needed when using versus. This will then also work with non-room links, so long as [`&remote`](../general-settings/remote.md) is included in their URL.
* I don't intend to add many advanced features to this site.
* It's designed to be very simple, elegant, and hyper focused on a single use case and user type.
* E-Sports and one-way ingestion of very high quality video. I'll likely be making more scenario-specific interfaces in the future like this, to make VDO.Ninja easier and less cluttered for common use cases.
* Versus.cam is built using the VDO.Ninja IFRAME API, which I hope demonstrates the flexibility of it.
* Versus.cam is only supported by Chrome/Chromium-based browsers; it isn't yet compatible with Firefox/Safari (they lack the features needed for it to operate).

[Please report bugs](https://discord.gg/qWDshMsTar). It's a first release, using the alpha version of VDO.Ninja, so bugs are kind of expected.

{% embed url="https://youtu.be/I12ASNWHPPI" %}
[https://youtu.be/I12ASNWHPPI](https://youtu.be/I12ASNWHPPI)
{% endembed %}

## Updates

{% content-ref url="../updates/updates-versus.cam.md" %}
[updates-versus.cam.md](../updates/updates-versus.cam.md)
{% endcontent-ref %}
