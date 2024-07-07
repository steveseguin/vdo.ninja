---
description: >-
  WHIP allows you to publish to supported sites, like Twitch, directly from
  VDO.Ninja
---

# WHIP and WHEP tooling

Using the newly added WHIP ingest end point at Twitch, you can now publish directly from VDO.Ninja to Twitch. Low-latency, no downloads needed, and free.

WHIP is a bit like the classic RTMP publishing, but it's far more advanced, includes AV1 video codec support, and can even work within your browser. Best of all, VDO.Ninja supports it. VDO.Ninja can both act as a host for WHIP publishers, such as OBS Studio, or it can publish video via WHIP to WHIP broadcasting hosts, such as Twitch, Janus, Mediamtx, Pion, Cloudflare, and many more.

WHEP, on the other hand, is generally used to playback video using the same technology, rather to publish it. VDO.Ninja also supports WHEP playback and hosting, with advanced statistic panels, recording, and buffering options.&#x20;

### Our WHIP page for making WHIP / WHEP easy

To make using WHIP and WHEP more accessible, VDO.Ninja has a hosted page with common tools for making use of it, such as publishing a video or screen share to Twitch.

{% embed url="https://vdo.ninja/whip" %}
[https://vdo.ninja/whip](https://vdo.ninja/whip)
{% endembed %}

This is the future! To try it out, visit [https://vdo.ninja/whip](https://vdo.ninja/whip), enter your Twitch stream token in the correct field, GO, and then select your camera in VDO.Ninja as normal.\
\
![](<../.gitbook/assets/image (198).png>)![](<../.gitbook/assets/image (199).png>)

### Alpha version of WHIP support and features

The alpha version of VDO.Ninja has the cutting edge available to it, often with even more advanced features and fixes that have not yet made it available to the production stable release.

Check out the alpha version here: [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip)

### WHIP ingest from OBS Studio or other

While VDO.Ninja can act as a host for incoming WHIP requests (published to `https://whip.vdo.ninja/YOURTOKENHERE`), many such publishing clients do not support NAT traversal or STUN server support yet.&#x20;

OBS Studio v30 does not, for example, so it may not work if publishing to someone who is behind a firewall. Still, even in those cases, the WHIP ingest feature will still work when:

* on the same Local Area Network as the publisher,&#x20;
* if hosting VDO.Ninja on a cloud server with public IP address available,&#x20;
* if your UDP ports are being forwarded (UDP ports 4096-65535)
* or if your local IP address is set to the DMZ mode target within your router's network settings.

For WHIP publishing clients that do support NAT traversal, such as Gstreamer's whip element, VDO.Ninja will already work with them.

I welcome support and engagement from other developers to work through these issues, so please reach out if you'd like to speak.

In terms of ideal settings for OBS v30's WHIP output into VDO.Ninja, below you can find a link to some recommended encoder options, to ensure smoothest playback

{% content-ref url="../guides/obs-whip-output-settings.md" %}
[obs-whip-output-settings.md](../guides/obs-whip-output-settings.md)
{% endcontent-ref %}

For more help, join the Discord

{% embed url="https://discord.vdo.ninja" %}
Contact me on Discord
{% endembed %}

### Using WHIP + WHEP to host your own Meshcast service

For more advanced users, you can use VDO.Ninja's WHIP/WHEP support, with your own WHIP/WHEP compatible broadcasting host, to provide your own Meshcast functionality within VDO.Ninja.

The [Meshcast service](meshcast.io.md) long offered by VDO.Ninja works like a WHIP/WHEP host, offloading video distribution via the hosted servers, thus avoiding the need for multiple p2p streams. As a result, it was pretty easy to add support for generic WHIP/WHEP hosting alternatives.

Currently a guide on using Cloudflare as the host is available, located here, [https://vdo.ninja/cloudflare](https://vdo.ninja/cloudflare), with guides for other self-hosted providers becoming available all the time.

For the highly technical and curious, please note that if your WHIP server's response header includes a WHEP URL in it, where the WHIP stream can be viewed from, VDO.Ninja will automatically provide that URL to connected viewers to use as the main video source.

ie: WHEP: [`https://whep.urdomain.com/yourstreamtoken`](https://whep.urdomain.com/yourstreamtoken)

### Demo video, showing us publishing from VDO.Ninja to Twitch

{% embed url="https://youtu.be/_RHBsAJmfGs?si=653vhKBJesct_cmS" %}
[https://youtu.be/\_RHBsAJmfGs?si=653vhKBJesct\_cmS](https://youtu.be/\_RHBsAJmfGs?si=653vhKBJesct\_cmS)
{% endembed %}

### The VDO.Ninja Mixer app supports WHIP out also

The VDO.Ninja [Mixer App](mixer-app.md) ([https://vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer)) supports WHIP output, with an option to publish directly to Twitch as well. If OBS is too much for you, and you need just a simple studio and mixing controls, this could be a great option for you.

### `&publish` URL option

While still a work in progress, some of the features of the [https://vdo.ninja/whip](https://vdo.ninja/whip) page, primarily the WHIP publishing features, are also slowly being added as an integral part of VDO.Ninja itself.

While this may change in the future, adding `&publish` to the URL of a VDO.Ninja (v24) will let you select a screen to capture and publish to a WHIP endpoint. This may also be added as built-in menu option at some point as well, allowing you to select any screen, page, or element to publish via WHIP.

### Raspberry Ninja also now supports WHIP output

[Raspberry.Ninja](raspberry.ninja/) isn't just for Raspberry Pis, but works on a Linux system really, along with Windows WSL.

If you want low-level controls over AV1 codec encoding and other facets of WHIP publishing that can't be obtained via the browser, check it out. It of course also supports VDO.Ninja, has a built-in SFU for VDO.Ninja, and lots more!

{% embed url="https://raspberry.ninja" %}

## Related

{% content-ref url="../advanced-settings/whip-parameters/" %}
[whip-parameters](../advanced-settings/whip-parameters/)
{% endcontent-ref %}

{% content-ref url="../guides/obs-whip-output-settings.md" %}
[obs-whip-output-settings.md](../guides/obs-whip-output-settings.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/whip-parameters/and-whip.md" %}
[and-whip.md](../advanced-settings/whip-parameters/and-whip.md)
{% endcontent-ref %}

## Updates

{% content-ref url="../updates/updates-whip-whep.md" %}
[updates-whip-whep.md](../updates/updates-whip-whep.md)
{% endcontent-ref %}
