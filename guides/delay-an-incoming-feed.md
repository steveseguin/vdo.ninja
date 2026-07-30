---
description: Add a fixed delay of several seconds or minutes to an incoming VDO.Ninja feed using Meshcast HLS, OBS, or experimental chunked video.
---

# Delay an incoming VDO.Ninja feed

A two-minute delay is much longer than a normal WebRTC jitter buffer. The best method depends on whether you need to delay one incoming feed, the complete OBS program output, or video without audio.

## Quick recommendation

| Goal | Recommended method |
| --- | --- |
| Delay one incoming audio/video feed by two minutes | Meshcast HLS player |
| Delay the complete outgoing OBS broadcast by two minutes | OBS Stream Delay |
| Bring a delayed program back into another production | First OBS or media server feeding a second OBS |
| Delay only VDO.Ninja video | Experimental chunked mode |
| Keep the workflow private and self-hosted | MediaMTX with an HLS DVR window |

Do not use a normal VDO.Ninja viewer link with `&buffer=120000`. With normal WebRTC, the browser-managed buffer is limited to roughly 3–5 seconds of useful delay, even when a much larger value is requested.

## Option 1: Meshcast HLS player

[Meshcast](https://app.meshcast.io) is the simplest current option for delaying audio and video together. Its current HLS configuration keeps approximately five minutes of seekable history, and its HLS player accepts a delay in seconds.

HLS playback requires a registered Meshcast account. A free registered account includes HLS on shared servers.

### Set it up

1. Sign in to [app.meshcast.io](https://app.meshcast.io) and create or select a stream.
2. Publish to that stream using Meshcast Web Studio, RTMP, SRT, WHIP, or the VDO.Ninja Meshcast 2.0 integration.
3. Let the stream run for at least two minutes before opening the delayed player. A player cannot go two minutes behind live until two minutes of media exist.
4. Copy the **HLS Player URL** from the Meshcast dashboard or studio.
5. Add `delay=120`, enable audio, and optionally hide the controls.

If the copied URL has no query string:

```text
https://app.meshcast.io/hls-player/STREAM_ID?delay=120&muted=0&controls=0
```

If the copied URL already contains a server value:

```text
https://app.meshcast.io/hls-player/STREAM_ID?server=SERVER_ID&delay=120&muted=0&controls=0
```

`delay` is in seconds. The Meshcast player currently accepts up to 240 seconds. It is muted by default, so include `muted=0` when audio is required.

### Use it in OBS

Add the HLS Player URL as an OBS **Browser Source**. Use the same width and height as the expected feed, and test that audio is reaching the desired OBS track.

For an exact two-minute offset at program start, begin the Meshcast ingest first, wait two minutes, and then load or refresh the Browser Source. If the player is opened too early, it can only seek to the oldest media currently available.

### Publishing from VDO.Ninja

Meshcast 2.0 can accept a stream key or token from a VDO.Ninja publishing URL:

```text
https://vdo.ninja/?push=STREAMID&meshcast2=live_...
```

Use the VDO.Ninja publishing URL and HLS Player URL supplied for the same Meshcast stream. Copying them from the Meshcast dashboard avoids mixing up the private publishing key and public viewing identifier.

See [Meshcast.io](../steves-helper-apps/meshcast.io.md) and [`&meshcast`](../newly-added-parameters/and-meshcast.md) for the available publishing paths.

## Option 2: OBS Stream Delay

If the complete outgoing OBS production should be delayed, use OBS's built-in **Stream Delay**:

1. Open **Settings**.
2. Select **Advanced**.
3. Enable **Stream Delay**.
4. Set the duration to `120` seconds.
5. Test starting, reconnecting, and stopping the stream before using it live.

This delays the encoded outgoing program. It does not create a delayed source inside the same OBS scene, and the local preview remains live.

Use this method when the destination is YouTube, Twitch, an RTMP server, or another streaming endpoint and every part of the program should share the same delay.

## Option 3: Feed a second OBS

If the delayed result must return as a source for switching, graphics, recording, or monitoring, separate the ingest and production roles:

```text
VDO.Ninja feed → first OBS or media server → delayed encoded stream → second OBS
```

The first OBS receives the VDO.Ninja feed and sends an encoded program through a delayed RTMP, SRT, or HLS path. The second OBS receives that delayed result as a Media Source or Browser Source.

This uses more CPU and can add another encode generation, but it is easier to reason about than trying to hold two minutes of uncompressed frames in an OBS source filter. A local [MediaMTX](deploy-your-own-meshcast-like-service.md) server can keep the delayed leg on the production network.

## Option 4: Experimental VDO.Ninja chunked video

VDO.Ninja's [`&chunked`](../newly-added-parameters/and-chunked.md) mode uses WebCodecs and a custom receiver queue. Unlike the normal WebRTC buffer, it can hold encoded video for minutes when the browser has enough memory.

Example publisher:

```text
https://vdo.ninja/?push=STREAMID&chunked=2500
```

Experimental two-minute video-only viewer:

```text
https://vdo.ninja/?view=STREAMID&noaudio&nochunkaudio&chunkbuffer=120000&chunkbufferadaptive=0&chunkbufferceil=180000
```

Important limitations:

* Current shared chunked audio/video buffering is limited to about 30 seconds, so this is not the recommended method for a two-minute feed with synchronized audio.
* Chunked publishing requires a compatible WebCodecs browser and is more experimental than normal VDO.Ninja video.
* The receiving page owns the buffer. Refreshing or closing it loses the queued media.
* Memory use grows with bitrate and delay. At 2500 kbps, two minutes of encoded video is roughly 38 MB before browser and queue overhead.
* Test the exact sending browser, receiving browser or OBS version, codec, and network before production use.

Use Meshcast HLS or an encoded OBS/server path when synchronized two-minute audio and video are required.

## Option 5: Self-hosted HLS with MediaMTX

For a private or on-premises workflow, MediaMTX can create an HLS DVR window. The server must retain more media than the requested delay.

For example, two-second segments and 150 retained segments provide approximately five minutes of seekable history:

```yaml
hls: yes
hlsVariant: fmp4
hlsSegmentDuration: 2s
hlsSegmentCount: 150
hlsDirectory: /var/lib/mediamtx/hls
```

The segment count creates the seekable history; it does not automatically force viewers to remain two minutes behind live. Use an HLS player configured to start and remain at the live edge minus 120 seconds.

H.264 video and AAC audio offer the broadest conventional HLS compatibility. A WHIP source using Opus audio may require an AAC transcode for some HLS players.

See [Deploy your own Meshcast-like service](deploy-your-own-meshcast-like-service.md) for a broader MediaMTX setup.

## Methods that are not suitable

### Normal `&buffer`

The normal [`&buffer`](../advanced-settings/view-parameters/buffer.md) parameter controls the browser's WebRTC playout target. Modern browsers usually limit its useful result to roughly 3–5 seconds. It is not a two-minute DVR.

### OBS Render Delay filters

OBS Render Delay is intended for short synchronization corrections. Holding minutes of uncompressed video consumes excessive GPU memory. Do not stack hundreds of short filters to create a broadcast delay.

### Audio sync offsets alone

An audio offset does not create matching delayed video and is not a substitute for an audio/video buffer. Use a method that stores both tracks together.

## Production checklist

Before relying on a long delay:

* run the ingest early enough to fill the complete delay;
* confirm the measured live offset with a visible clock and audible clap;
* verify that audio is enabled and remains synchronized;
* test a sender reconnect and a viewer reload;
* confirm what viewers see when the input ends;
* monitor free disk, memory, and network capacity;
* keep a low-latency confidence feed separate from the delayed program when operators need immediate monitoring.
