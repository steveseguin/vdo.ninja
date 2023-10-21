---
description: >-
  WHIP allows you to publish to supported sites, like Twitch, directly from
  VDO.Ninja
---

# WHIP and WHEP tooling

Using the newly added WHIP ingest end point at Twitch, you can now publish directly from VDO.Ninja to Twitch. Low-latency, no downloads needed, and free.

WHIP is a bit like the classic RTMP publishing, but it's far more advanced, includes AV1 video codec support, and can even work within your browser. Best of all, VDO.Ninja supports it. VDO.Ninja can both act as a host for WHIP publishers, such as OBS Studio, or it can publish video via WHIP to WHIP broadcasting hosts, such as Twitch, Janus, Mediamtx, Pion, Cloudflare, and many more.\
\
WHEP, on the other hand, is generally used to playback video using the same technology, rather to publish it. VDO.Ninja also supports WHEP playback and hosting, with advanced statistic panels, recording, and buffering options.&#x20;

### Our WHIP page for making WHIP / WHEP easy

To make using WHIP and WHEP more accessible, VDO.Ninja has a hosted page with common tools for making use of it, such as publishing a video or screen share to Twitch.

{% embed url="https://vdo.ninja/whip" %}
[https://vdo.ninja/whip](https://vdo.ninja/whip)
{% endembed %}

This is the future!  To try it out, visit [https://vdo.ninja/whip](https://vdo.ninja/whip), enter your Twitch stream token in the correct field, GO, and then select your camera in VDO.Ninja as normal.\
\
![](<../.gitbook/assets/image (198).png>)![](<../.gitbook/assets/image (199).png>)

### Alpha version of WHIP support and features

The alpha version of VDO.Ninja has the cutting edge available to it, often with even more advanced features and fixes that have not yet made it available to the production stable release.

Check out the alpha version here: [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip)



### WHIP ingest from OBS Studio or other

While VDO.Ninja can act as a host for incoming WHIP requests (published to `https://whip.vdo.ninja/YOURTOKENHERE)`, many such publishing clients do not support NAT traversal or STUN server support.

I hope more do support NAT traversal in the future, but until then, you might find this WHIP ingest feature only works when on the same Local Area Network as the publisher, if hosting VDO.Ninja on a cloud server with public IP address available, or if your local IP address is set to the DMZ mode target within your router's network settings.

I welcome support and engagement from other developers to work through these issues, so plese reach out if you'd like to speak.

{% embed url="https://discord.vdo.ninja" %}
Contact me on Discord
{% endembed %}

### Using WHIP + WHEP to host  your own Meshcast service

For more advanced users, you can use VDO.Ninja's WHIP/WHEP support, with your own WHIP/WHEP compatible broadcasting host, to provide your own Meshcast functionality within VDO.NInja.

The Meshcast service long offered by VDO.Ninja works like a WHIP/WHEP host, offloading video distribution via the hosted servers, thsu avoiding the need for multiple p2p streams. As a result, it was pretty easy to add support for generic WHIP/WHEP hosting alternatives.

Currently a guide on using Cloudflare as the host is available, located here, [https://vdo.ninja/alpha/cloudflare](https://vdo.ninja/alpha/cloudflare), with guides for other self-hosted providers becoming available all the time.

For the highly technical and curious, please note that if your WHIP server's response header includes a WHEP URL in it, where the WHIP stream can be viewed from, VDO.Ninja will automatically provide that URL to connected viewers to use as the main video source.

ie:   `whep: https://whep.urdomain.com/yourstreamtoken`&#x20;

### Demo video, showing us publishing from VDO.Ninja to Twitch

{% embed url="https://youtu.be/_RHBsAJmfGs?si=653vhKBJesct_cmS" %}
[https://youtu.be/\_RHBsAJmfGs?si=653vhKBJesct\_cmS](https://youtu.be/\_RHBsAJmfGs?si=653vhKBJesct\_cmS)
{% endembed %}

##

### The VDO.Ninja Mixer app supports WHIP out also

The VDO.Ninja mixer app (https://vdo.ninja/alpha/mixer) supports WHIP output, with an option to publish directly to Twitch as well. If OBS is too much for you, and you need just a simple studio and mixing controls, this could be a great option for you.



### \&publish URL option

While still a work in progress, some of the features of the https://vdo.ninja/whip page, primarily the WHIP publishing features, are also slowly being added as an integral part of VDO.Ninja itself.

While this may change in the future, adding `&publish` to the URL of a VDO.Ninja (v24) will let you select a screen to capture and publish to a WHIP endpoint. This may also be added as built-in menu option at some point as well, allowing you to select any screen, page, or element to publish via WHIP.

## Related

{% content-ref url="../advanced-settings/whip-parameters/and-whip.md" %}
[and-whip.md](../advanced-settings/whip-parameters/and-whip.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/whip-parameters/" %}
[whip-parameters](../advanced-settings/whip-parameters/)
{% endcontent-ref %}

## Updates

{% content-ref url="../updates/updates-whip-whep.md" %}
[updates-whip-whep.md](../updates/updates-whip-whep.md)
{% endcontent-ref %}
