---
description: Choose direct VDO.Ninja, Meshcast, Custom WHIP, SRT, or RTMP for your phone's camera feed.
---

# Choose a phone streaming mode

For a simple phone-to-OBS connection, start with the app's normal **VDO.Ninja** output and use its viewer link in an OBS Browser Source.

For sports and busy venues, start with the [event streaming guide](../streaming-sports-and-events.md). Use the [Meshcast setup guide](../meshcast-setup.md) when you need a server to distribute the feed.

Open **Additional outputs** on **Ready to stream** when you want a server to distribute the feed or need another publishing protocol.

| Mode | When to choose it | Receive the feed |
| --- | --- | --- |
| **VDO.Ninja** | Direct video, rooms, and director controls with minimal setup. Each direct viewer uses more phone upload. | The app's VDO.Ninja viewer link. |
| **Meshcast** | A simple way to send one feed to a server for several viewers. The app uses WHIP for publishing. | The app's Meshcast-backed viewer link. |
| **Custom WHIP** | You already have a WHIP publishing URL from Meshcast or another service. | That service's playback link, or configure the app's WHEP viewer source. |
| **SRT** | An unstable mobile connection where extra buffering can help recover lost packets. | [SRT through Meshcast to OBS](srt-to-meshcast.md). |
| **RTMP** | Your receiving service expects an RTMP server and stream key. Congestion can cause stalls or growing delay. | [RTMP through Meshcast to OBS](rtmp-to-meshcast.md). |

## Keep the upload manageable

Choose only the outputs you need. SRT and RTMP are additional outputs with their own upload use; selecting one replaces the other. They do not turn off direct VDO.Ninja viewing. When using Meshcast, give viewers its viewing link and close unused direct previews.

**Custom WHIP** offers **Alongside VDO.Ninja** for keeping the direct connection and room controls, or **WHIP only** for publishing solely to the configured server. [WHIP setup and viewer options](../../steves-helper-apps/native-mobile-app.md#whip-publishing)

SRT and RTMP require a registered Meshcast account. The built-in Meshcast option can use an anonymous session. Neither mode increases the phone's available upload speed or bonds Wi-Fi and cellular connections.

## Other setups

* **Same network, no relay:** send SRT straight to OBS with the [Android](android-srt-to-obs.md) or [iPhone](iphone-srt-to-obs.md) guide.
* **Camera, USB, screen, or microphone:** see the app's [capture modes](../../steves-helper-apps/native-mobile-app.md#capture-modes).
* **Poor connection:** follow the [packet loss guide](../../common-errors-and-known-issues/packet-loss.md).
