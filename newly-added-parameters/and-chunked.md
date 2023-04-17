---
description: >-
  Does not use webRTC's video streaming protocols; rather it uses a custom-made
  protocol
---

# \&chunked

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Options

Example: `&chunked=1000`

| Value            | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| (no value given) | will just enable viewing, and not saving, of the video               |
| `2`              | the option to save the chunked stream as a viewer on the sender side |
| (integer value)  | bitrate in kbps                                                      |

## Details

### Chunked video transfer mode

[Version 20](../release-notes/v20.md) introduces the option to enable a chunked-video transfer mode, which is similar to how Twitch or YouTube Live broadcasts videos. This still uses VDO.Ninja's peer to peer connections to distribute video to viewers, except it does not use webRTC's video streaming protocols; rather it uses a custom-made protocol.

The upsides of this mode is that packet loss on a network connection impacts the video stream less, so the quality can be higher. It also makes it easier to record the stream to disk on the viewer's end with no added quality loss and with lower CPU usage. It also supports video transparency, which wasn't really feasible before.

In theory, this mode also allows a video stream to be only encoded once, and then it can be shared with multiple viewers, although in this first version of chunked transfer mode, that isn't an option. The same goes with PCM audio; in theory that can now be supported in this chunked transfer mode, but it currently isn't enabled in this first release.

This chunked mode is similar to the previously released [`&webp`](../advanced-settings/view-parameters/webp.md) broadcast mode, which streamed a series of images as a custom-made video protocol, but the [`&webp`](../advanced-settings/view-parameters/webp.md) has poor compression and quality, and would drop frames if the connection couldn't keep up.

The downsides of the chunk-transfer mode is that if the connection stalls out long enough, the video will be forced to pause and buffer. It also has a buffer, which is currently around 3 to 5 seconds on a good question - so similar to that of Twitch. The chunked-transfer mode might be suitable for doing remote recordings of interviews where the highest quality is desirable, but it isn't suitable for live and interactive chat.

Future versions of this feature will include the option to record to a cloud service, the option to use PCM audio, the ability to encode-once, but stream to many, and more advanced protocol logic to lower the latency.

* The option to save the chunked stream as a viewer is to use `&chunked=2` on the sender side. Using just `&chunked` will just enable viewing, and not saving, of the video.
* `&chunked=2` and [`&maxvideobitrate`](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md) will likely get changed up and moved to the viewer side eventually; currently doing this just for convenience of development/testing. Multiple viewers is not recommended. There seems to be an issue with audio clicking that I'm trying to solve currently.
* A video demo of the chunked transfer and how to enable support for alpha-channel transparency is available here:

{% embed url="https://youtu.be/SWDlm1Jf-Oo" %}
Transparent and chunked video transfer over VDO.Ninja
{% endembed %}

#### Info and issues about using the chunked transfer mode

* Note: When doing live playback of chunked-transferred video, there is currently a clicking sound that needs to be resolved still. This clicking does not appear when recording the stream to disk though, so it is still suitable for remote recordings.
* You can enable it by adding `&chunked` on the publisher side of things. It does not yet work in group rooms, just basic push/view links. It also does not work with Meshcast.
* Chunked transfer is supported in recent Chromium-based browsers, including OBS v27.2 and newer.

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-nochunked-alpha.md" %}
[and-nochunked-alpha.md](../advanced-settings/settings-parameters/and-nochunked-alpha.md)
{% endcontent-ref %}
