---
description: >-
  Does not use webRTC's video streaming protocols; rather it uses a custom-made
  protocol
---

# \&chunked

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Options

Example: `&chunked=2000`

| Value           | Description                           |
| --------------- | ------------------------------------- |
| (integer value) | bitrate in kbps (default around 2000) |

## Details

### Chunked video transfer mode

[Version 20](../release-notes/v20.md) introduces the option to enable a chunked-video transfer mode, which is similar to how Twitch or YouTube Live broadcasts videos, but using a different and newer technology. This still uses VDO.Ninja's peer to peer connections to distribute video to viewers, except it does not use WebRTC's video streaming protocols; rather it uses a custom protocol over WebRTC data-channels.

The upsides of this mode is that packet loss on a network connection impacts the video stream less, so the quality can be higher. It also makes it easier to record the stream to disk on the viewer's end with no added quality loss and with lower CPU usage. This is because recording a chunked-stream to disk does not require any transcoding on the viewers-end; it just writes the encoded chunks directly to a WebM media container on your disk.

In theory, this mode also allows a video stream to be only encoded once, and then it can be shared with multiple viewers. There is an experimental `&retransmit` option that lets you push this concept even further, where you can broadcast chunked video from peer-to-peer-to-peer-and so on, without any additional transcoding.

Chunked mode is a bit similar to the previously released [`&webp`](../advanced-settings/view-parameters/webp.md) broadcast mode, which streamed a series of images as a custom-made video protocol over the WebRTC data-channels, but the [`&webp`](../advanced-settings/view-parameters/webp.md) mode had poor compression, low quality, and would drop frames if the connection couldn't keep up. This new chunked option though uses cutting edge features in modern browsers to allow for high bitrates and advanced video-encoder controls; it uses encoded video chunks rather than still image frames.

The downsides of the chunk-transfer mode is that if the connection stalls out long enough, the video will be forced to pause and buffer. It also has a buffer, which is currently around 1 second by default. The chunked-transfer mode might be suitable for doing remote recordings of interviews where the highest quality is desirable, but it may not be suitable for live and interactive chat if on a bad connection.

The default and normal WebRTC video and audio sending modes used by VDO.Ninja are largely handled by the browser, with few encoder and controls for apps like VDO.Ninja to control. The chunked mode offers lower-level access to the encoder on the other hand, but it's up to the app then to handle the sending, buffering, recovery, and all other aspects of streaming video. It's quite hard to do well, so `&chunked` mode isn't yet the best solution for all users; the normal mode has broader support and is better tested by the global community.

#### Random notes

* The option to save the chunked stream as a viewer is to use `&chunked=2` on the sender side. Using just `&chunked` will just enable viewing, and not saving, of the video.
* `&chunked=2` and [`&maxvideobitrate`](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md) will likely get changed up and moved to the viewer side eventually; currently doing this just for convenience of development/testing. Multiple viewers is not recommended. There seems to be an issue with audio clicking that I'm trying to solve currently.
* Using [`&buffer`](../advanced-settings/view-parameters/buffer.md) on the viewer side can vary the buffering amount, however setting it too low may cause the stream to fail if it faces a buffer underrun event. You can change the buffer dynamically by right-clicking a video as a viewer, and changing the buffer listed value there.

#### Info and issues about using the chunked transfer mode

* It does not work with Meshcast.
* Chunked transfer is supported in recent Chromium-based browsers, including OBS v27.2 and newer.
* Audio and video sync isn't always guaranteed.
* If screen sharing your entire display, and assuming that display supports higher than 60-fps, chunked mode will support the higher frame rate. I've tested 120-fps on my gaming monitor, using chunked mode while screen sharing the entire display. Adding [`&fps=120`](../advanced-settings/video-parameters/and-fps.md) to the sender's URL will configure the chunked mode to both capture and publish at 120-fps. It will error out if not supported however.
* While support for alpha-channels (RGBA/transparencies) has been added to chunked mode, it's up to the browser to provide video encoders that support alpha-channels. VDO.Ninja as of v24 will look for any compatible alpha-enabled encoders when `&alpha` along with the `&chunked` parameter, but fall back to the normal RGB mode if none are found.

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-nochunked.md" %}
[and-nochunked.md](../advanced-settings/settings-parameters/and-nochunked.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-retransmit.md" %}
[and-retransmit.md](../advanced-settings/settings-parameters/and-retransmit.md)
{% endcontent-ref %}
