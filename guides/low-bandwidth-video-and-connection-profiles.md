---
description: Compare adaptive camera profiles, frame-rate and bitrate controls, degradation preferences, and recovery options for weak connections, with Pixel test results and browser limitations.
---

# Low-bandwidth video and connection profiles

When video falls to 30–35 kbps, keeping motion smooth can leave too little detail to recognize a face or understand a moving scene. Sending fewer frames can help preserve useful detail, but holding resolution too firmly can also cause long freezes. The aim is a usable compromise, followed by automatic recovery when the connection improves.

For an ordinary connection, keep the existing defaults. For a mostly stationary webcam, `&connectionprofile=talkinghead` is the clearer-picture, less-motion option. For a moving camera, `&connectionprofile=irl` is an experimental compromise that needs testing on the actual device and network.

{% hint style="info" %}
Availability: this page documents the implementation tested on September 7, 2026. At that validation point, the new camera profiles, their 3 FPS IRL refinement, and the Chrome `degrade` wiring fix were local changes, not deployed to production. Use a host serving those changes; adding a new parameter to an older deployment does not enable the feature. This page is not a release announcement.
{% endhint %}

## Choose the control that matches the problem

Publisher means the camera or guest sending video. Viewer means the receiving page, including a VDO.Ninja view link in an OBS Browser Source. A setting on the viewer can request a change from the publisher; it does not change which browser performs the encoding.

| Control | Put it on | What it changes | Useful for | Tradeoff or limit |
| --- | --- | --- | --- | --- |
| `connectionprofile=talkinghead` | Publisher | Automatically adjusts per-viewer FPS and resolution caps; favors detail through most tiers | Fixed webcams, interviews, recognizable faces on weak links | Can become a roughly 2 FPS slideshow; no guaranteed minimum resolution |
| `connectionprofile=irl` | Publisher | Uses higher motion caps and smaller resolution tiers, reaching 3 FPS/180-pixel short edge in the emergency tier | Testing a compromise for moving cameras on poor Wi-Fi/cellular | Experimental; improved in the Pixel follow-up but still froze under severe conditions |
| `rtpprofile=talkinghead` or `rtpprofile=irl` | Publisher | Alias for the same profiles | Existing technical URLs | `rtpprofile` takes precedence if both parameter names appear; use one name |
| `degrade=maintain-resolution` | Viewer | Asks the publisher's encoder to favor resolution as resources fall | Detail matters more than smooth movement | No automatic profile tiers; FPS can become very low |
| `degrade=maintain-framerate` | Viewer | Favors frame rate as resources fall | Motion matters more than fine detail | Resolution can become very small; bare `&degrade` selects this behavior |
| `degrade=balanced` | Viewer | Allows the encoder to trade both resolution and FPS | A browser-managed compromise | Does not select the VDO.Ninja profile's specific tiers |
| [`contenthint=detail` or `motion`](../advanced-settings/video-parameters/and-contenthint.md) | Publisher | Expresses the source's detail/motion preference | Choosing a publisher-side priority | Browser-dependent; an explicit hint overrides the profile's adaptation preference |
| [`fps=15`](../advanced-settings/video-parameters/and-fps.md) | Publisher | Requests a camera capture frame rate | Reducing source demand from the start | Persistent capture setting, not an emergency-only cap; device support varies |
| [`maxframerate=15`](../source-settings/and-maxframerate.md) | Publisher | Sets a capture-rate ceiling while allowing lower rates | A more flexible source limit | Profile recovery respects the limit; actual encoded/received FPS can be lower |
| [`quality=1`](../advanced-settings/video-parameters/and-quality.md) | Publisher | Requests a 720p camera preset; `quality=2` requests 360p | Starting with less demanding capture | Capture resolution is not a guarantee of transmitted resolution |
| [`bitrate=800`](../advanced-settings/video-bitrate-parameters/bitrate.md) | Viewer, primarily | Requests a video bitrate in kbps | Choosing the desired viewing quality/bandwidth | A target/request, not reserved capacity or a guaranteed floor |
| [`outboundvideobitrate=800`](../advanced-settings/video-bitrate-parameters/and-outboundvideobitrate.md) | Publisher | Sets the sender-side default video bitrate | Choosing a default before viewer overrides | Still subject to limits and congestion control |
| [`maxvideobitrate=800`](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md) | Publisher | Caps allowed video bitrate per outgoing stream | Preventing viewers from requesting excessive upload | Not a minimum; multiple viewers still consume aggregate capacity; low limits can also select existing downscaling |

All numeric bitrate examples above are **kbps**, while FPS means **frames per second**. A 2 FPS slideshow is one frame every half-second. It is not 0.5 FPS, which is one frame every two seconds. The current `fps` and `maxframerate` URL parsers use integers; do not use `fps=0.5` to request a half-second update interval.

## What the profiles do

Profiles are disabled unless selected. `connectionprofile=off`, or removing the parameter, leaves normal behavior in place. They adjust the outgoing camera encoding for each eligible viewer independently, rather than changing the shared camera capture track or local recording settings.

The tier is selected from the encoder's reported target bitrate, falling back to the connection's outgoing bandwidth estimate. This is **not** the same as a speed-test result, measured payload bitrate, or the total link capacity. A connection nominally limited to 250 kbps can have an encoder target of only 30 kbps after loss.

| Tier | Talking head: budget below | FPS cap | Short-edge cap | IRL: budget below | FPS cap | Short-edge cap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | Original settings | Original | Original | Original settings | Original | Original |
| 1 | 700 kbps | 10 | 720 px | 900 kbps | 20 | 540 px |
| 2 | 300 kbps | 5 | 480 px | 400 kbps | 15 | 360 px |
| 3 | 120 kbps | 2 | 360 px | 180 kbps | 10 | 240 px |
| 4 | 55 kbps | 2 | 240 px | 70 kbps | 3 | 180 px |

Short edge means height in landscape and width in portrait. Caps do not upscale a smaller source or override a stricter manual limit. They are requested limits, not promised output dimensions or frame delivery rates.

Talking head asks the browser to maintain resolution in tiers 1–3, then permits balanced adaptation in tier 4. IRL lowers resolution through its own tiers and asks the browser to preserve each reduced tier's resolution. This avoids a second browser-driven spatial reduction, but does not guarantee that frames arrive or decode.

The controller samples every two seconds. Four seconds of sustained pressure can move it down by up to two tiers. Persistently poor encoding relative to actual source cadence can also trigger a reduction. A nominal 60 FPS camera supplying only 24 FPS is not itself considered encoder overload. Without source-cadence stats, low FPS alone requires a reported CPU/bandwidth limitation; bitrate-based adaptation still works.

Recovery requires at least 16 seconds of sufficient estimated headroom per tier, with loss/CPU checks where available. Full recovery can take over a minute, or longer if the estimate stays low. This avoids repeatedly jumping between high and low settings.

### Combining settings

Start with the profile alone. An explicit viewer `degrade` preference or publisher `contenthint` overrides the profile's preference and changes the tested tradeoff. In particular, adding `degrade=maintain-framerate` to an IRL profile can reintroduce the spatial reduction it is intended to avoid.

Manual FPS and scaling limits remain recovery ceilings. Bitrate controls remain independent. Profiles do not change audio, TURN selection, or bitrate floors. They skip screen sharing, multiple video senders, simulcast/multiple encodings, and active chunked transport. WHIP uses a separate publishing path.

## Can I force a 200 kbps minimum?

There is no demonstrated reliable minimum-bitrate switch for this browser camera path. Raising `bitrate` or `maxvideobitrate` does not force Chrome to sustain that rate under congestion.

In the connected Pixel tests, both phones' active VP8 codec stats already included `x-google-min-bitrate=250`. In those same connections, Chrome's video `targetBitrate` still fell to **30000 bits/s**. The negotiated 250 kbps hint therefore did not enforce a 250 kbps encoder target in this configuration.

The standard browser encoding API provides a maximum bitrate control, not a corresponding guaranteed minimum. See the [W3C encoding parameters](https://www.w3.org/TR/webrtc/#dom-rtcrtpencodingparameters). A configured ceiling and an SDP hint should not be described as a bandwidth reservation.

Earlier `minbitrate`, `minbitratebps`, REMB-only, and probe-assist experiments did not establish a reliable floor. Those experimental URL parsers are not present in the main browser source reviewed for this page; do not copy them from old experiment links and assume they work in a normal deployment.

At very low capacity, audio, packet headers, retransmissions, and keyframes also consume the link. In the failing IRL tests the sender sometimes encoded 2–4 FPS while the viewer decoded no frames for an entire five-second sample. An encoder continuing to produce frames is not proof of usable playback. The revised policy reduces demand; it does not bypass congestion control.

## Related recovery options

| Option | Where / role | What it can help | What it does not solve |
| --- | --- | --- | --- |
| [`relay`](../general-settings/and-relay.md) | Endpoint URL; forces TURN routing | Testing whether a different route avoids a bad direct path | Does not create uplink capacity or repair packets by itself; can add latency |
| [`autorelay=1`](../advanced-settings/turn-and-stun-parameters/and-autorelay.md) | Connection recovery; enabled by default in the reviewed code | Escalating to a relay-eligible recovery attempt after failure | Not an image-quality or minimum-bitrate control; unlike `relay`, it does not force TURN from startup |
| [`buffer=500`](../advanced-settings/view-parameters/buffer.md) | Viewer; playback buffering request in milliseconds | Jitter and late arrivals where supported | Adds delay; cannot restore detail discarded by the encoder or guarantee repair |
| [`codec=h264`, `vp8`, etc.](../advanced-settings/view-parameters/codec.md) | Viewer codec request | Comparing hardware load, compatibility and compression | A different codec is not a guaranteed congestion fix; the Pixel moving-source comparison below used VP8 |
| NACK/RTX and PLI | Normally negotiated RTP feedback/repair | Resending missing packets or requesting a clean keyframe | Requires time and bandwidth; large recovery frames can stress a weak link |
| RED/FEC | Negotiated redundancy, where supported | Repairing some loss patterns | Uses additional capacity and has browser/codec limits; not a bitrate floor |
| [`chunked`](../newly-added-parameters/and-chunked.md) and chunk-specific buffering/FEC/NACK/adaptation | Alternate sender/receiver media path | Testing greater buffering and explicit repair when extra latency is acceptable | Separate compatibility and tuning requirements; these RTP profiles do not control active chunked video |

See [Packet-loss recovery and resilient media](packet-loss-recovery-and-resilient-media.md) for repair mechanisms and native-tool differences, and [Stable IRL streaming](irl-streaming-stability.md) for a broader field setup. Test route, codec, and profile changes separately so the source of an improvement is clear.

## Browser and application qualification

This table describes the September 7 tests and implementation scope, not a promise that every version of an application behaves identically. The **publisher's** engine and encoder determine profile behavior, even when the viewer is OBS.

| Publisher / application path | What is established | Remaining limits |
| --- | --- | --- |
| Desktop Chrome 152, normal VDO.Ninja camera publishing | Live `degrade` wiring checks and profile adaptation/recovery passed; moving-source tests completed | Codec, camera and operating-system differences still matter |
| Pixel 4a, Android 13, Chrome 151 | Moving-source loss tests, real-camera cadence check and H.264 FPS-cap check passed | Revised IRL still had freezes; outdoor use not qualified |
| Pixel 9a, Android 17, Chrome 152 | Same checks; nominal 60 FPS/actual 24 FPS camera no longer caused a false clean-link step-down | Revised IRL still had freezes; results are from one follow-up run |
| iPhone 15 Pro Max, Safari 26.6.1 | Earlier native-camera H.264 and VP8 checks honored a 5 FPS sender cap | Revised 3 FPS policy not qualified; one talking-head run stayed degraded during recovery; native scene was nearly black, so moving-scene quality is unproven |
| Safari canvas/replayed source | Earlier sender parameters accepted a 5 FPS cap | Encoding remained about 23 FPS in that fixture; do not generalize native-camera cap results to canvas sources |
| Firefox; Edge | No direct qualification of these new profiles in this test series | Do not infer support or quality from Chrome results alone |
| OBS Browser Source as viewer | Use a normal view URL; `degrade` is a request to the remote browser publisher | This test series used Chrome viewers, not a qualified OBS/CEF version; native OBS WHIP publishing is a different path |
| Electron Capture or another embedded browser publisher | Must load the updated web application and expose the needed sender controls | Not directly qualified; embedded engine version and capture source matter |
| Native mobile app, Raspberry.Ninja, native OBS/WHIP encoders, Ninja OBS Plugin | Have their own media/encoder paths and controls | These JavaScript camera profiles are not established native-encoder controls; web content loaded inside an app needs its own qualification |
| WHIP, active chunked, screen-share, simulcast or multiple-video-sender paths | Outside the profile's implemented scope | Use the relevant path's own settings rather than assuming `connectionprofile` applies |

Browser API acceptance alone is not qualification. Check encoded and received frame progress, actual resolution, freezes and recovery—not just a returned `maxFramerate` value.

## Measured outcomes

The same 1280×720/25 FPS pedestrian replay was published from the two USB-connected phones through normal VDO.Ninja signaling and TURN/UDP. An isolated UDP proxy constrained only the test traffic. These were real phone Chrome instances, not desktop mobile emulation.

| Phase | Duration | Publisher-side capacity | Added delay each direction | Random loss each direction |
| --- | ---: | ---: | ---: | ---: |
| Clean | 20 s | 5000 kbps | 0 ms | 0% |
| Reduced | 40 s | 500 kbps | 50 ms | 0% |
| Reduced | 40 s | 250 kbps | 75 ms | 0% |
| Severe | 40 s | 100 kbps | 100 ms | 0% |
| Burst | 5 s | 250 kbps | 150 ms | 30% |
| Post-burst | 20 s | 250 kbps | 75 ms | 0% |
| Recovery | 100 s | 5000 kbps | 0 ms | 0% |

The return direction allowed 5000 kbps. The proxy dropped packets exceeding its token-bucket capacity, so a phase with 0% random loss could still have congestion drops. This is a harsh bottleneck test, not a complete cellular-network model. Audio was present, but perceptual audio quality was not scored.

| Mode | Pixel 4a: total frozen seconds | Pixel 9a: total frozen seconds | Practical outcome |
| --- | ---: | ---: | --- |
| Normal, no profile | 26.491 | 27.597 | Kept more motion in some phases but froze under severe conditions |
| Talking head | 12.605 | 12.896 | Roughly 360p/2 FPS at 250 kbps; 180–240p around 2 FPS at 100 kbps |
| Earlier IRL, 5 FPS emergency cap | 51.340 | 45.950 | Long decode stalls; 4a averaged about 0.1 decoded FPS in the post-burst phase |
| Revised IRL, 3 FPS emergency cap plus camera-cadence fix | 12.941 | 17.966 | Both ended the 100 kbps phase at 320×180/3 FPS; both averaged about 2.9 decoded FPS post-burst |

All runs eventually recovered to the original 720p/25 FPS source. The revised 4a run still recorded a roughly two-second freeze early in recovery; the revised 9a run recorded about 8.3 seconds of freezing during the 100 kbps phase.

These are cumulative receiver freeze counters, not subjective quality scores. Freeze detection depends on frame cadence, and a freeze may be reported in the phase where it ends. There was one run per initial mode and one revised IRL follow-up per phone; normal/talking-head runs were not repeated alongside the follow-up. Two code changes and stochastic network behavior prevent attributing the entire improvement to the 3 FPS cap alone. IRL therefore remains experimental.

Separate one-minute clean real-camera checks kept both phones at tier 0 throughout. The 9a supplied about 24 FPS despite reporting a nominal 60 FPS, confirming the corrected cadence check. Real-camera H.264 cap checks reduced encoding to about 4–5 FPS after requesting 5 FPS; that does not establish H.264 performance under the moving-source loss matrix.

## Example links and a practical test

Replace `YOUR_HOST` with a host serving the updated implementation and `UNIQUE_ID` with a private, unique stream ID. Use the same host for both ends. Start with one of these publisher links:

```text
https://YOUR_HOST/?push=UNIQUE_ID&webcam&connectionprofile=talkinghead
https://YOUR_HOST/?push=UNIQUE_ID&webcam&connectionprofile=irl
```

Viewer:

```text
https://YOUR_HOST/?view=UNIQUE_ID
```

To test the corrected resolution preference independently, omit the publisher profile and use:

```text
https://YOUR_HOST/?view=UNIQUE_ID&degrade=maintain-resolution
```

1. Record a clean baseline with a face and some movement. Check both sender and viewer stats.
2. Test one profile at a time under the same constrained conditions. Close the previous viewer so extra outgoing streams do not change the comparison.
3. Compare actual received resolution/FPS and freezes. The publisher's `rtp_profile_fps_cap` and `rtp_profile_short_edge` are requested caps; `rtp_profile_budget_kbps` is the encoder budget, not measured throughput.
4. Restore the connection and allow at least 100 seconds to observe recovery. If quality stays low, inspect the estimated headroom, loss and CPU limitation before raising targets.
5. Repeat on the actual camera, browser/app, codec and network intended for production. Keep the unmodified URL as a comparison.

For interpreting the measurements, see [The stats panel](stats-menu/README.md). The distinction between input cadence, encoded frames and decoded frames follows the [W3C WebRTC statistics definitions](https://www.w3.org/TR/webrtc-stats/).
