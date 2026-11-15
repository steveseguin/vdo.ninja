---
description: Use Meshcast to distribute one upload, bring RTMP or SRT feeds into OBS, or stream to multiple platforms.
---

# Meshcast.io

Meshcast receives one live upload and distributes it to viewers or streaming platforms. Use it to reduce the number of uploads from a phone, bring an RTMP/SRT encoder into OBS, or send a finished show to several services.

Open [app.meshcast.io](https://app.meshcast.io) for the account dashboard, Studio, stream links, and restream destinations. The original [meshcast.io](https://meshcast.io) service remains a free, accountless entry point.

## Choose your setup

| I want to... | Start here |
| --- | --- |
| Send a phone camera to several production viewers | [Set up Meshcast in the VDO.Ninja native app](../guides/meshcast-setup.md) |
| Bring a phone or encoder's RTMP/SRT feed into OBS | [RTMP or SRT to OBS](../guides/meshcast-rtmp-srt-to-obs.md) |
| Send one show to YouTube, Twitch, or other platforms | [Multistream with Meshcast](../guides/multistream-with-meshcast.md) |
| Distribute a browser guest's feed | [Use the VDO.Ninja `&meshcast` option](../newly-added-parameters/and-meshcast.md) |
| Add a broadcast delay | [Delay an incoming feed](../guides/delay-an-incoming-feed.md) |

## Accounts and output formats

The native app's built-in Meshcast option and supported VDO.Ninja browser workflows can use anonymous WHIP/WHEP sessions. RTMP, SRT, HLS, and saved restream destinations need a registered account. Check [current plans](https://app.meshcast.io/pricing) for bandwidth, viewer counts, and destination limits.

For a phone, start with the [VDO.Ninja native app](native-mobile-app.md). Its built-in Meshcast option handles server distribution; its optional SRT and RTMP outputs are useful when you need those protocols.

Meshcast forwards video without changing its format in ordinary relay and restream workflows. Use H.264 for RTMP destinations, and disable B-frames when the feed will be watched through WebRTC/WHEP. Audio compatibility conversion is separate from paid video transcoding.

## Delayed HLS playback

Meshcast's HLS player can keep a feed behind live for a broadcast safety delay or delayed OBS source. HLS requires a registered account.

For a two-minute delay, use your public Stream ID with `delay=120`:

```text
https://app.meshcast.io/hls-player/STREAM_ID?delay=120&muted=0&controls=0
```

Start the ingest at least two minutes before opening the player. Follow the [delay guide](../guides/delay-an-incoming-feed.md) for OBS setup.

## More help

* [Meshcast guides](https://app.meshcast.io/docs)
* [VDO.Ninja Meshcast parameters](../advanced-settings/meshcast-parameters/README.md)
* [Meshcast updates](../updates/updates-meshcast.io.md)
