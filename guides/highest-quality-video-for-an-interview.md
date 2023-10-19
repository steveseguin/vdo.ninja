---
description: >-
  A common question on how to achieve the highest quality capture into OBS for a
  remote interview.
---

# How to get highest video quality (for an interview)

The highest quality possible is a bit tricky, as that will depend on certain factors that may be hard to determine without testing and tweaking in advanced.&#x20;

Depending on what you're trying to do exactly, how many people are being interviewed, and your technical level of savviness, different options may appeal to you.

### Group Room method

The VDO.NInja group room has a director role, with everyone else being a guest.

The director can record locally in brower, to their own disk, or they can record remotely, to the guest's computer. The highest quality recording possible will be to record to the guest's own computer directly, bypassing the Internet. This however currently requires the guest send the recording to you afterwards, which introduces a risk of failure, nor is it always feasible.

While recording the stream as the director themselves is an option, via VDO.Ninja's director control center, better performance and more reliable results can be obtained by using OBS Studio to record the stream.

When using OBS to record, you may wish to use the provided solo-links for each guest, putting each into its own OBS Studio instance, and recording each guest independently. OBS Studio can be opened multiple times, and hardware accelerated encoding is often available up to 3 streams or more. You can also consider checking out [https://obsproject.com/forum/resources/source-record.1285](https://obsproject.com/forum/resources/source-record.1285/), which is a plugin for OBS that lets you record multiple sources at a time with one OBS instance.\
\
If using OBS to record, configure OBS to record at a high bitrate, let's say 20,000-kbps, at perhaps 1920x1080 resolution. For each OBS browser source, which contains the solo-links, will we ensure they are 1920x1080 resolution also, and we will append \&bitrate=12000\&ab=160 to each view link. \
\
You can speak to the guest via the director's control center, which will provide echo cancellation for the director's mic, and this provides the easiest setup and operation. If you want even more control over settings and optimizations though, but don't want a director role, you may way to try the next method.

### Manual push/view links method

In this mode, there is no group room, and all guest stream IDs need to be manually specified. You can typically get excellent 1080p recording quality though with the following parameters:\
\
**Guest link:** [`https://vdo.ninja/?push=GUEST_ID&quality=0&stereo&view=HOST_ID&vb=200&ab=16`](https://vdo.ninja/?push=GUEST\_ID\&quality=0\&stereo\&view=HOST\_ID\&vb=200\&ab=16)&#x20;

**Host link:** [`https://vdo.ninja/?push=HOST_ID&view=GUEST_ID&vb=50&ab=16`](https://vdo.ninja/?push=HOST\_ID\&view=GUEST\_ID\&vb=50\&ab=16)

**OBS link\*:** [`https://vdo.ninja/?view=GUEST_ID&vb=12000&ab=128&scale=100`](https://vdo.ninja/?view=GUEST\_ID\&vb=12000\&ab=128\&scale=100) \
\
_\* Note the OBS Browser source should be set to a width of 1920 and a height of 1080._

The idea here is both you and the guest can talk to each other in the browser, at relatively very low quality, while in OBS you are capturing a very high quality version of just the guest. I'd imagine you can record the host locally in OBS, without needing VDO.Ninja in most cases.

I am also assuming the guest is wearing headphones; if not, you may need to remove [`&stereo`](../general-settings/stereo.md) from their invite link. Removing it will lower the audio quality, but with it added you will not have echo cancellation enabled.

You can improve the quality a small bit further with some added complexity, by having the host use OBS as the video/audio monitor when speaking to the guest, rather than pulling any audio/video in via a browser window. You can also consider using the Electron Capture app, instead of an OBS browser source, which will let you share one guest video stream with several apps via window-capture.

For the highest quality, you'll want to record the guest at their native resolution, so if each guest is 1080p resolution, you can capture 4 guests in OBS if OBS is recording at 4K resolution, or you can record each guest as their own independent video. Common options here could be to have multiple OBS instances being open, or by using the source-record plugin for OBS [https://obsproject.com/forum/resources/source-record.1285](https://obsproject.com/forum/resources/source-record.1285/).

### Added sharpening

If doing screen shares, or overlays, adding a bit of sharpening as an OBS video effects filter can also help the recording look better. Sharpening will make lines and fine details, like hair, pop out a bit more. This is especially helpful for text, which is usually a bit soft in video otherwise.

### AV1 video codec

The relatively new AV1 video codec offers better colors, better compression, and often better frame rates than other codecs.  If your guest supports it, with a computer that won't overheat because of it, it might be worth trying.

Add `&codec=av1` to the solo- or view-link of the guest  you are recording, to get the system to prefer using it instead.

### Packet loss and connection quality

The biggest impact and limitation is normally the connection itself; please sure that both sides have excellent high-quality connections. Bad connections will ruin a stream.

Sometimes using [`&relay`](../general-settings/and-relay.md) or [`&meshcast`](../newly-added-parameters/and-meshcast.md) can help with certain bad connections, in rare cases at least. Meshcast can be used on the sender's side, while \&relay can be used on either/both side. Normally just avoiding WiFi can resolve many such packet loss issues though.&#x20;

If the guest is on a mobile device, consider using a USB (lightning) to Ethernet adapter for that phone, to connect it to the Internet router directly, rather than using WiFi. If that isn't an option, bonded cellular connections may be an option for some users as well.

[packet-loss.md](../common-errors-and-known-issues/packet-loss.md "mention")

{% embed url="https://www.youtube.com/watch?v=je2ljlvLzlY" %}

If packet loss is a still serious issue, then there is a feature in VDO.Ninja to let you record the video directly on the guest's computer, remotely, bypassing the Internet during the recording itself. It's experimental though, so it might only be useful as a backup, but when it works, it's fantastic!  The `&record` option, added to the guest's link, will let them control the recording, if there is no director present to start/stop the recording.

[and-record.md](../advanced-settings/recording-parameters/and-record.md "mention")

### Smartphone / computer overheating

If your phone is getting warm, putting a metal heatsink on the backside of the phone directly can help keep it from thermal throttling. You can also try changing codecs, to see if perhaps there is a better option.

As for laptops, ensure they are plugged in and are not overheating.

### Update your smartphone or change browsers

Some smartphones will have limited functionality if using an older version of the operating system. This is especially true of iOS devices, where iOS 16 has several core improvements over iOS 16, for example.

Certain browsers, such as Firefox, should also be avoided in most cases. Chromium-based browsers will offer better control over video bitrates, with more options and features to use.



### As per audio

Avoid bluetooth or mobile devices for audio sources.

Also refer to `&audiobitrate` or `&proaudio` for options to improve audio bitrate.

