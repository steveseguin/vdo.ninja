---
description: >-
  A common question on how to achieve the highest quality capture into OBS for a
  remote interview.
---

# Highest quality video for an interview?

The highest quality possible is a bit tricky, as that will depend on certain factors that may be hard to determine without testing and tweaking in advanced. You can typically get excellent recording quality though with the following parameters:&#x20;

**Guest link:** `https://vdo.ninja/?push=GUEST_ID&quality=0&stereo&view=HOST_ID&vb=200&ab=16`&#x20;

**Host link:** `https://vdo.ninja/?push=HOST_ID&view=GUEST_ID&vb=50&ab=16`&#x20;

**OBS link:** `https://vdo.ninja/?view=GUEST_ID&vb=12000&ab=128&scale=100`&#x20;

The idea here is both you and the guest can talk to each other in the browser, at relatively very low quality, while in OBS you are capturing a very high quality version of just the guest. I'd imagine you can record the host locally in OBS, without needing Ninja in most cases.

I am also assuming the guest is wearing headphones; if not, you may need to remove [`&stereo`](../advanced-settings/general-parameters/stereo.md) from their invite link. Removing it will lower the audio quality, but with it added you will not have echo cancellation enabled.

You can improve the quality a small bit further with some added complexity, by having the host use OBS as the video/audio monitor when speaking to the guest, rather than pulling any audio/video in via a browser window. If you use the Electron Capture app instead of OBS browser source plugin, you'll get further improved video quality and audio sync, (since it's more advanced at handling packet loss).

The biggest impact and limitation is normally the connection itself; please sure that both sides have excellent high-quality connections. Bad connections will ruin a stream&#x20;

[https://docs.vdo.ninja/common-errors-and-known-issues/packet-loss](https://docs.vdo.ninja/common-errors-and-known-issues/packet-loss)&#x20;

[https://www.youtube.com/watch?v=je2ljlvLzlY](https://www.youtube.com/watch?v=je2ljlvLzlY)

If packet loss is a serious issue, then there is a feature in VDO.Ninja to let you record the video directly on the guest's computer, remotely, bypassing the Internet during the recording itself. It's experimental though, so it might only be useful as a backup, but when it works, it's fantastic!

{% content-ref url="../advanced-settings/source-parameters/and-record.md" %}
[and-record.md](../advanced-settings/source-parameters/and-record.md)
{% endcontent-ref %}

For this setup, the host can use a single computer for both capture and the interview itself; even a modern MacBook on wired internet would be enough. The remote guest can use anything modern; preferably a well-ventilated 14nm quad-core computer or better; also with wired Internet or bonded cellular.

Lastly, if you'd like to record each feed individually, you can consider checking out [https://obsproject.com/forum/resources/source-record.1285](https://obsproject.com/forum/resources/source-record.1285/), which is a plugin for OBS that lets you record multiple sources at a time.
