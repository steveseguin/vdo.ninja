---
description: >-
  A common question on how to achieve the highest quality capture into OBS for a
  remote interview.
---

# How to get highest video quality (for an interview)

The highest quality possible is a bit tricky, as that will depend on certain factors that may be hard to determine without testing and tweaking in advanced. You can typically get excellent 1080p recording quality though with the following parameters:\
\
**Guest link:** [`https://vdo.ninja/?push=GUEST_ID&quality=0&stereo&view=HOST_ID&vb=200&ab=16`](https://vdo.ninja/?push=GUEST\_ID\&quality=0\&stereo\&view=HOST\_ID\&vb=200\&ab=16)&#x20;

**Host link:** [`https://vdo.ninja/?push=HOST_ID&view=GUEST_ID&vb=50&ab=16`](https://vdo.ninja/?push=HOST\_ID\&view=GUEST\_ID\&vb=50\&ab=16)&#x20;

**OBS link\*:** [`https://vdo.ninja/?view=GUEST_ID&vb=12000&ab=128&scale=100`](https://vdo.ninja/?view=GUEST\_ID\&vb=12000\&ab=128\&scale=100) \
\
_\* Note the OBS Browser source should be set to a width of 1920 and a height of 1080._

The idea here is both you and the guest can talk to each other in the browser, at relatively very low quality, while in OBS you are capturing a very high quality version of just the guest. I'd imagine you can record the host locally in OBS, without needing Ninja in most cases.

I am also assuming the guest is wearing headphones; if not, you may need to remove [`&stereo`](../general-settings/stereo.md) from their invite link. Removing it will lower the audio quality, but with it added you will not have echo cancellation enabled.

You can improve the quality a small bit further with some added complexity, by having the host use OBS as the video/audio monitor when speaking to the guest, rather than pulling any audio/video in via a browser window. If you use the Electron Capture app instead of OBS browser source plugin, you'll get further improved video quality and audio sync, (since it's more advanced at handling packet loss).

If doing screen shares, or overlays, adding a bit of sharpening as an OBS video effects filter can also help the recording look better. Sharpening will make lines and fine details, like hair, pop out a bit more. This is especially helpful for text, which is usually a bit soft in video otherwise.

### Packet loss and connection quality

The biggest impact and limitation is normally the connection itself; please sure that both sides have excellent high-quality connections. Bad connections will ruin a stream.

Sometimes using [`&relay`](../general-settings/and-relay.md) or [`&meshcast`](../newly-added-parameters/and-meshcast.md) can help with certain bad connections, in rare cases at least. Normally just avoiding WiFi can resolve many such packet loss issues though.

[packet-loss.md](../common-errors-and-known-issues/packet-loss.md "mention")

{% embed url="https://www.youtube.com/watch?v=je2ljlvLzlY" %}

If packet loss is a still serious issue, then there is a feature in VDO.Ninja to let you record the video directly on the guest's computer, remotely, bypassing the Internet during the recording itself. It's experimental though, so it might only be useful as a backup, but when it works, it's fantastic!

[and-record.md](../advanced-settings/recording-parameters/and-record.md "mention")

For this setup, the host can use a single computer for both capture and the interview itself; even a modern MacBook on wired internet would be enough. The remote guest can use anything modern; preferably a well-ventilated 14nm quad-core computer or better; also with wired Internet or bonded cellular.

Lastly, if you'd like to record each feed individually, you can consider checking out [https://obsproject.com/forum/resources/source-record.1285](https://obsproject.com/forum/resources/source-record.1285/), which is a plugin for OBS that lets you record multiple sources at a time.
