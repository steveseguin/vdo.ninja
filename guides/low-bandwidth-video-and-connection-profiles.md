---
description: Adaptive camera profiles, frame-rate and bitrate limits, degradation preferences and recovery options for weak connections, with Pixel test results and browser limits.
---

# Low-bandwidth video and connection profiles

When video falls to 30–35 kbps, smooth motion can leave too little detail to recognize a face. Sending fewer frames keeps more detail, but holding resolution too firmly can cause long freezes. The aim is a usable compromise that recovers automatically when the connection improves.

* **Ordinary connection:** keep the defaults.
* **Mostly still webcam:** add `&connectionprofile=talkinghead` to the publisher for a clearer picture with less motion.
* **Moving camera:** `&connectionprofile=irl` is an experimental compromise. Test it on your actual device and network.

{% hint style="info" %}
Connection profiles are a recent addition. A host running an older VDO.Ninja version ignores `&connectionprofile`. The results on this page come from tests on September 7, 2026.
{% endhint %}

## Choose the control that matches the problem

The publisher is the camera or guest sending video. The viewer is the receiving page, including a view link in an OBS Browser Source. A viewer setting can ask the publisher to change; the publisher's browser still does the encoding.

| Control | Put it on | What it does | Limit |
| --- | --- | --- | --- |
| `connectionprofile=talkinghead` | Publisher | Adjusts FPS and resolution per viewer, favoring detail | Can become a roughly 2 FPS slideshow; no minimum resolution |
| `connectionprofile=irl` | Publisher | Higher motion caps and smaller resolutions, down to 3 FPS at a 180-pixel short edge | Experimental; still froze under severe conditions |
| `rtpprofile=talkinghead` or `irl` | Publisher | Alias for the same profiles | If both names appear, `rtpprofile` wins |
| `degrade=maintain-resolution` | Viewer | Asks the publisher's encoder to keep resolution as resources fall | No profile tiers; FPS can get very low |
| `degrade=maintain-framerate` | Viewer | Asks it to keep frame rate | Resolution can get very small. Bare `&degrade` does this. |
| `degrade=balanced` | Viewer | Lets the encoder trade both | Browser-managed, not the profile's tiers |
| [`contenthint=detail` or `motion`](../advanced-settings/video-parameters/and-contenthint.md) | Publisher | States the source's detail or motion priority | Browser-dependent; overrides the profile's preference |
| [`fps=15`](../advanced-settings/video-parameters/and-fps.md) | Publisher | Requests a capture frame rate | Always applies, not only in emergencies; devices vary |
| [`maxframerate=15`](../source-settings/and-maxframerate.md) | Publisher | Sets a capture-rate ceiling | Profile recovery respects it |
| [`quality=1`](../advanced-settings/video-parameters/and-quality.md) | Publisher | Requests 720p capture; `quality=2` requests 360p | Capture size is not the sent size |
| [`bitrate=800`](../advanced-settings/video-bitrate-parameters/bitrate.md) | Viewer | Requests a video bitrate in kbps | A request, not reserved capacity or a floor |
| [`outboundvideobitrate=800`](../advanced-settings/video-bitrate-parameters/and-outboundvideobitrate.md) | Publisher | Sets the sender's default video bitrate | Still subject to limits and congestion control |
| [`maxvideobitrate=800`](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md) | Publisher | Caps each outgoing video stream | Not a minimum; several viewers still add up |

Bitrates are in kbps. A 2 FPS slideshow shows one frame every half-second. `fps` and `maxframerate` accept whole numbers only, so `fps=0.5` does not work.

## What the profiles do

Profiles are off unless selected; `connectionprofile=off` or no parameter keeps normal behavior. They adjust the outgoing camera encoding for each viewer separately, without changing the shared capture track or local recordings.

The tier is chosen from the encoder's target bitrate, or the connection's outgoing bandwidth estimate if that is missing. This is not a speed-test result or measured throughput: a link limited to 250 kbps can have an encoder target of 30 kbps after loss.

| Tier | Talking head: budget below | FPS cap | Short-edge cap | IRL: budget below | FPS cap | Short-edge cap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | Original settings | Original | Original | Original settings | Original | Original |
| 1 | 700 kbps | 10 | 720 px | 900 kbps | 20 | 540 px |
| 2 | 300 kbps | 5 | 480 px | 400 kbps | 15 | 360 px |
| 3 | 120 kbps | 2 | 360 px | 180 kbps | 10 | 240 px |
| 4 | 55 kbps | 2 | 240 px | 70 kbps | 3 | 180 px |

The short edge is the height in landscape and the width in portrait. Caps never upscale a smaller source or loosen a stricter manual limit, and they are requests, not promised output.

Talking head asks the browser to keep resolution in tiers 1–3, then allows balanced adaptation in tier 4. IRL lowers resolution through its own tiers and asks the browser to keep each reduced resolution, which avoids a second, browser-driven reduction.

The controller checks every two seconds. Four seconds of sustained pressure moves it down by up to two tiers. Encoding far below the camera's actual frame rate also triggers a step down; a camera that claims 60 FPS but delivers 24 is not treated as overloaded. Moving back up needs at least 16 seconds of enough headroom per tier, with acceptable loss and no CPU limit, so full recovery can take over a minute.

### Combining settings

Start with the profile alone. A viewer `degrade` or publisher `contenthint` overrides the profile's preference; for example, `degrade=maintain-framerate` with the IRL profile brings back the extra resolution drop it avoids. Manual FPS and scaling limits remain ceilings, and bitrate controls stay independent. Profiles do not change audio, TURN or bitrate floors. They do not apply to screen sharing, multiple video senders, simulcast, active chunked transport or WHIP publishing.

## Can I force a 200 kbps minimum?

No reliable minimum-bitrate switch exists for browser camera video. Raising `bitrate` or `maxvideobitrate` does not make Chrome hold that rate under congestion. In the Pixel tests, both phones' VP8 stats included `x-google-min-bitrate=250`, yet Chrome's `targetBitrate` still fell to 30000 bits/s. The browser encoding API offers a [maximum, not a minimum](https://www.w3.org/TR/webrtc/#dom-rtcrtpencodingparameters). Old experiment links with `minbitrate`, `minbitratebps` or similar parameters do not work in the current app.

At very low capacity, audio, headers, resends and keyframes also use the link. In failing IRL tests the sender encoded 2–4 FPS while the viewer decoded nothing for five seconds, so frames being encoded does not prove usable playback. Profiles reduce demand; they do not bypass congestion control.

## Related recovery options

| Option | Can help with | Does not |
| --- | --- | --- |
| [`relay`](../general-settings/and-relay.md) on both links | Testing whether a TURN route avoids a bad direct path | Add upload capacity; it can add latency |
| [`buffer=500`](../advanced-settings/view-parameters/buffer.md) on the viewer | Jitter and late packets | Restore detail the encoder dropped |
| [`codec=h264`, `vp8`, etc.](../advanced-settings/view-parameters/codec.md) on the viewer | Hardware load, compatibility and compression | Guarantee a congestion fix |
| NACK/RTX, PLI and RED/FEC | Resending or repairing lost packets, or requesting a clean keyframe | Come free; they use time and bandwidth |
| [`chunked`](../newly-added-parameters/and-chunked.md) | More buffering and explicit repair, with extra latency | Use these profiles; it has its own tuning |

See [Packet-loss recovery and resilient media](packet-loss-recovery-and-resilient-media.md) for repair mechanisms and [Stable IRL streaming](irl-streaming-stability.md) for field setups. Change route, codec and profile one at a time.

## Browser and app support

The **publisher's** browser and encoder decide profile behavior, even when the viewer is OBS. This reflects the September 7 tests.

| Publisher | Established | Limits |
| --- | --- | --- |
| Desktop Chrome 152 | `degrade` wiring, profile adaptation and recovery, moving-source tests | Codec, camera and OS differences still matter |
| Pixel 4a (Android 13, Chrome 151) and Pixel 9a (Android 17, Chrome 152) | Moving-source loss tests, real-camera cadence and H.264 FPS-cap checks | Revised IRL still froze; outdoor use not tested |
| iPhone 15 Pro Max, Safari 26.6.1 | Native-camera H.264 and VP8 honored a 5 FPS cap | 3 FPS policy and moving scenes not tested; one talking-head run stayed degraded. A canvas source accepted the cap but still encoded about 23 FPS. |
| Firefox, Edge, Electron Capture and other embedded browsers | Not tested with these profiles | Do not assume Chrome results apply |
| Native mobile app, Raspberry.Ninja, OBS WHIP, Ninja OBS Plugin | Use their own encoders and controls | These profiles do not apply |

An OBS Browser Source viewer uses a normal view link; its `degrade` is a request to the remote browser publisher. A browser accepting a setting is not proof it works, so check encoded and received frames, resolution, freezes and recovery.

## Measured outcomes

The same 1280×720, 25 FPS walking video was published from two USB-connected phones running real Chrome, through normal VDO.Ninja signalling and TURN/UDP. A UDP proxy limited the publisher's upload: 20 s clean at 5000 kbps; 40 s each at 500, 250 and 100 kbps with 50, 75 and 100 ms added delay; a 5 s burst of 30% loss at 250 kbps; 20 s at 250 kbps; then 100 s back at 5000 kbps. Packets over capacity were dropped, so even 0% random-loss phases had congestion loss. Audio was present but not scored.

| Mode | Pixel 4a frozen seconds | Pixel 9a frozen seconds | Result |
| --- | ---: | ---: | --- |
| No profile | 26.491 | 27.597 | More motion in some phases, but froze under severe conditions |
| Talking head | 12.605 | 12.896 | About 360p at 2 FPS at 250 kbps; 180–240p at about 2 FPS at 100 kbps |
| Earlier IRL (5 FPS emergency cap) | 51.340 | 45.950 | Long decode stalls |
| Revised IRL (3 FPS cap and cadence fix) | 12.941 | 17.966 | Both ended the 100 kbps phase at 320×180, 3 FPS; about 2.9 decoded FPS after the burst |

All runs recovered to the original 720p at 25 FPS. These are cumulative receiver freeze counts from one run per mode per phone, not quality scores. Two code changes and random network behavior mean the improvement cannot be credited to the 3 FPS cap alone, so IRL remains experimental. In separate one-minute clean checks with real cameras, both phones stayed at tier 0, and requesting 5 FPS with H.264 reduced encoding to about 4–5 FPS.

## Test it yourself

Replace `UNIQUE_ID` with a private stream ID, and use the same up-to-date host for both links. Publisher, with one of:

```text
https://vdo.ninja/?push=UNIQUE_ID&webcam&connectionprofile=talkinghead
https://vdo.ninja/?push=UNIQUE_ID&webcam&connectionprofile=irl
```

Viewer:

```text
https://vdo.ninja/?view=UNIQUE_ID
```

To test resolution preference on its own, drop the publisher profile and use `https://vdo.ninja/?view=UNIQUE_ID&degrade=maintain-resolution`.

1. Record a clean baseline with a face and some movement.
2. Test one profile at a time under the same conditions, closing the previous viewer first.
3. Compare received resolution, FPS and freezes. The publisher's `rtp_profile_fps_cap` and `rtp_profile_short_edge` stats are requested caps; `rtp_profile_budget_kbps` is the encoder budget, not throughput.
4. Restore the connection and wait at least 100 seconds to watch recovery. If quality stays low, check headroom, loss and CPU limits.
5. Repeat on the camera, browser, codec and network you will use in production, with the unmodified link as a comparison.

For reading the numbers, see [The stats panel](stats-menu/README.md) and the [W3C WebRTC statistics definitions](https://www.w3.org/TR/webrtc-stats/).
