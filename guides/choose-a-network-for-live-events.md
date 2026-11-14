---
description: Compare venue Wi-Fi, Ethernet, 5G, 4G/LTE, and hotspots for a phone camera at a crowded event.
---

# Choose a network for a live event

Choose the connection that delivers steady video from your filming position. Signal bars, a 5G icon, and a fast download result do not tell you whether a connection can sustain your camera's upload.

For the complete camera and OBS workflow, start with [Stream sports and events from a phone](streaming-sports-and-events.md).

## Compare the available connections

| Connection | What to check |
| --- | --- |
| Venue Ethernet | Ask for a production connection. Use a compatible phone adapter and test power delivery with it. Wire the OBS computer too when possible. |
| Venue Wi-Fi | Ask for a production network rather than crowded guest Wi-Fi. Complete any sign-in page before starting. Stay near the access point; compare 5 GHz with 2.4 GHz if available. 5 GHz Wi-Fi is different from 5G cellular. |
| Phone's cellular data | Turn Wi-Fi off for the comparison so you know which connection is carrying the feed. Test where the camera will actually stand. |
| Another phone or dedicated hotspot | Compare its carrier, reception, and upload limit. Keep it close to the camera phone and test for heat over a full session. A hotspot on the same congested carrier may offer little improvement. |

Both Wi-Fi and cellular service can slow down when an audience arrives. Test during a similarly busy period, then repeat shortly before going live. If possible, arrange a backup on a different carrier or venue connection.

## 5G versus 4G/LTE

Try the phone's normal automatic setting first. If it repeatedly stalls, compare LTE with 5G using the same stream, location, and quality settings. Keep whichever gives steadier video. Switching network modes can disconnect an active stream, so do this during rehearsal.

* **iPhone:** open **Settings > Cellular/Mobile Data**, select your data line if needed, then **Cellular Data Options > Voice & Data**. Compare **5G Auto** with **LTE**. **5G On** keeps using available 5G and can use more battery. [Apple's settings guide](https://support.apple.com/en-ca/108383)
* **Android:** look under **Settings > Network & internet > SIMs > Preferred network type**, or **Connections > Mobile networks**. Labels and availability depend on the phone and carrier. [Pixel settings guide](https://support.google.com/pixelphone/answer/2926415?hl=en)

An LTE connection can be sufficient for a good stream; 5G can also be congested or weak indoors. If neither works well, try another position or carrier. Restore your preferred automatic setting after the comparison if the change did not help.

## Test the stream, not just a speed number

1. Check **upload** capacity with the [VDO.Ninja speed and quality tests](../steves-helper-apps/speed-and-quality-tests.md). Test before the broadcast; a speed test competes with a live feed.
2. Run the actual phone-to-OBS connection with moving video and sound. Keep the intended cameras and production viewers connected.
3. Watch for stalls and quality drops, and use the [stats panel](stats-menu/README.md). Leave capacity beyond the video bitrate for audio, packet recovery, and changing conditions.
4. Pause cloud backups, large uploads, and unnecessary previews. If OBS shares the same internet connection, include its outgoing broadcast in the rehearsal.
5. Check your plan's data allowance and any separate hotspot limit. At a steady 4 Mbps, video alone uses about **1.8 GB per hour**; audio and overhead add more.

If you need a VPN, compare the stream with and without it where your network policy permits. Ordinary Wi-Fi plus cellular, or two SIMs, does not automatically combine their bandwidth. Specialized [bonding setups](mobile-uplink-starlink-cellular-bonding.md) are a later option when simpler connection changes are insufficient.

For continued loss or freezes, follow [Packet Loss](../common-errors-and-known-issues/packet-loss.md). For smooth but compressed action, adjust [video bitrate and quality](how-do-i-control-bitrate-quality.md).
