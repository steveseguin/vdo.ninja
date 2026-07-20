---
description: A practical field guide for stable VDO.Ninja IRL streams from phones and mobile encoders over cellular, Starlink, bonded networks, TURN relay, and chunked mode.
---

# Stable IRL streaming with VDO.Ninja

Start with 720p30 at about 2 Mbps. A 6000-kbps viewing target does not reserve 6000 kbps or make a cellular path more reliable. It asks for larger frames and can make packet loss, recovery bursts, phone heat, and encoder instability worse.

## 1. Start with this profile

Replace `STREAMID` with a unique stream ID.

Publisher/push link:

```text
https://vdo.ninja/?push=STREAMID&quality=1&fps=30&codec=h264&outboundvideobitrate=2000&maxvideobitrate=2500&autorecover=1
```

OBS/view link:

```text
https://vdo.ninja/?view=STREAMID&videobitrate=2000&buffer=1000&retry=10&autorecover=1&degrade=maintain-framerate
```

This profile uses:

* 720p at 30 fps instead of 1080p or 60 fps;
* hardware-friendly H.264 when available;
* a 2000-kbps target with a 2500-kbps sender cap;
* a 1-second viewer buffer for jitter;
* periodic stream discovery plus VDO.Ninja's staged connection recovery.

If it still freezes while moving, use the weak-signal profile before trying a higher bitrate.

Publisher/push link:

```text
https://vdo.ninja/?push=STREAMID&quality=2&fps=30&codec=h264&outboundvideobitrate=900&maxvideobitrate=1200&autorecover=1
```

OBS/view link:

```text
https://vdo.ninja/?view=STREAMID&videobitrate=900&buffer=1500&retry=10&autorecover=1&degrade=maintain-framerate
```

The weak-signal profile targets 360p30. It is less sharp, but its smaller frames need less upload capacity and recover faster after loss.

## 2. Prepare the mobile encoder

1. Update the device OS, browser, and VDO.Ninja app before the event.
2. Record locally when the device supports it. A local copy protects the program when no live transport can cross a real coverage hole.
3. Keep browser-based capture foregrounded, the device awake, and interruptions disabled during the stream.
4. Keep the encoder shaded and ventilated. Avoid 1080p60, direct sun, and an insulating case; charging plus encoding can create significant heat.
5. Test with the same device, mount, power source, carriers, route, and time of day that will be used live.

The [native VDO.Ninja mobile apps](../steves-helper-apps/native-mobile-app-versions.md) add mobile-specific camera features, local recording, improved external audio support, and background-operation options. Test both the native app and browser on the actual device; neither path can compensate for a complete network outage.

### iPhone and iPad notes

Do not assume switching from Safari to Chrome or Firefox changes the media engine on iPhone; common iOS builds still use WebKit. Keep browser capture foregrounded and the screen awake. If Safari is unstable, test the native VDO.Ninja app rather than assuming iOS Chrome will behave like desktop Chrome.

### Android notes

Test current Chrome and the native VDO.Ninja app. Disable aggressive battery optimization for the chosen app, prevent the screen from sleeping during browser capture, and confirm the OS does not revoke camera, microphone, or background-network access during a long field test.

## 3. Identify what is failing

| Symptom | Likely layer | First test |
| --- | --- | --- |
| Bitrate falls and the image becomes soft | Congestion control | Lower bitrate or resolution; relay usually does not create more radio capacity. |
| Audio and video freeze together during movement | Cellular loss or network handoff | Test a bonded path and keep `autorecover=1`. |
| Audio continues but remote video turns black or freezes | Video encoder, track, or decoder recovery | Add `&keyframe=2000` to the view link as a test and compare the local phone preview. |
| The local preview also freezes or turns black | Device capture, thermal, or app lifecycle | Cool the device, keep browser capture foregrounded, and test 360p30 in the native app. |
| The app or page closes or reloads | Mobile OS memory, thermal, or application failure | Lower capture load, close unused apps/tabs, and preserve a local recording. |

`&keyframe=2000` is a diagnostic for video that remains damaged after loss. It requests a new keyframe every two seconds. Remove it if it causes larger bitrate bursts or more loss; it is not a general cellular fix.

## 4. Choose the network path

| Path | Best use | Main tradeoff |
| --- | --- | --- |
| Direct WebRTC | Normal low-latency IRL with a usable cellular path | Fastest, but short outages are visible. |
| Automatic recovery | Roaming or intermittent peer-path failures | Recovery takes time; `autorecover=1` enables the broader recovery bundle. |
| Forced TURN relay | Carrier NAT or a poor direct route | Adds a server hop and latency; it does not repair weak RF coverage. |
| Bonded connection | Carrier handoffs, moving coverage, or critical streams | Uses more data, battery, equipment, and sometimes VPN latency. |
| Chunked/WebCodecs | Supported devices where 1-4 seconds of delay is acceptable | Browser-dependent and cannot bridge a complete outage by itself. |

### Test forced relay instead of assuming it helps

Current VDO.Ninja recovery starts direct and can automatically escalate a failed path to TURN. `&relay` forces TURN from the beginning, so use it as an A/B test rather than a default cure.

1. Run the stable profile for at least 10 minutes on the real route.
2. Add `&relay` to both the publisher and view links, then repeat the same route.
3. Keep relay only if it produces fewer failures at an acceptable delay.

TURN can help when a carrier's NAT or direct route is the problem. It cannot combine connections, restore missing cellular coverage, or provide bandwidth that the uplink does not have. Sustained high-bitrate relay use should use an appropriately provisioned TURN service.

### Bond separate internet paths

A bond is the most relevant upgrade when the stream fails during cellular handoffs or brief coverage holes. Use genuinely independent paths when possible, such as different carriers.

On a phone or laptop, a practical software setup is cellular plus Wi-Fi from a second carrier hotspot, vehicle router, or Starlink. Most dual-SIM phones expose only one active cellular data path at a time, so two SIMs in one phone are not the same as two bonded modems.

For Speedify:

1. Confirm both Wi-Fi and cellular show as connected inside Speedify.
2. Start with Speed mode plus Enhance Streaming.
3. Try Redundant mode for a critical stream with packet loss; it duplicates traffic and uses more data and battery.
4. Leave transport on Auto first, then A/B test UDP for latency-sensitive live streaming.
5. Select a nearby server and repeat the actual moving route.

For a Peplink/SpeedFusion-style router, prioritize Smoothing and Hot Failover for real-time WebRTC. Plain bandwidth bonding is aimed more at aggregate throughput; it is not automatically the best mode for low-latency media. Use separate carrier modems and a nearby SpeedFusion endpoint.

### Treat chunked mode as a device-specific experiment

Chunked mode adds VDO.Ninja-controlled buffering, indexed chunks, NACK retransmission, parity repair, and adaptation. It can absorb more loss than an extremely low-latency path, but it is not network bonding.

Recent Chromium-based runtimes are the primary target. Current VDO.Ninja code disables chunked publishing on Firefox. Safari/WebKit publishing is capability-gated: it is enabled only when the complete WebCodecs audio/video stack and required worker track-processing APIs are present. Test the exact device, OS, browser/app runtime, and OBS receiver before relying on it.

Experimental publisher/push link:

```text
https://vdo.ninja/?push=STREAMID&quality=1&fps=30&chunked=1400&chunkbitrate=1400&chunkprofile=mobile&chunkedbuffer=2000&autorecover=1
```

Experimental OBS/view link:

```text
https://vdo.ninja/?view=STREAMID&chunkbuffer=1500&chunkbufferfloor=1000&chunkbufferceil=3500&chunkjitterslack=500&retry=10&autorecover=1
```

Expect extra delay. If VDO.Ninja reports that chunked mode is unsupported, or if the publisher heats or crashes, return to the standard 720p30 profile.

## 5. Run a field test before going live

1. Record 10 minutes while parked and 10 minutes while moving with the stable profile.
2. Repeat with the weak-signal profile; test forced relay separately.
3. At the receiver, record bitrate, packet loss, RTT, jitter, decoded FPS, candidate type, and recovery time; do not rely only on a speed-test result.
4. Repeat under the real heat, movement, and charging conditions so thermal behavior matches the event.
5. Choose the lowest profile that completes the route without a black screen or manual reconnect.

For critical work, run two outputs: the live VDO.Ninja feed and a local recording on the publisher device. No WebRTC flag can recover media that was never transmitted during a complete coverage outage.

## Related guides and references

{% content-ref url="mobile-uplink-starlink-cellular-bonding.md" %}
[mobile-uplink-starlink-cellular-bonding.md](mobile-uplink-starlink-cellular-bonding.md)
{% endcontent-ref %}

{% content-ref url="video-bitrate-for-push-view-links.md" %}
[video-bitrate-for-push-view-links.md](video-bitrate-for-push-view-links.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/and-relay.md" %}
[and-relay.md](../general-settings/and-relay.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}

* [Speedify supported connection types](https://support.speedify.com/article/56-what-internet-connections-can-i-use-with-speedify)
* [Speedify bonding modes](https://support.speedify.com/article/870-bonding-mode)
* [Speedify transport modes](https://support.speedify.com/article/882-transport-mode)
* [Peplink SpeedFusion bonding, smoothing, and hot failover](https://www.peplink.com/technology/speedfusion-bonding-technology/)
* [WebKit features in Safari 26](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
