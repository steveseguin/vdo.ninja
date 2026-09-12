---
description: Camera and screen-share capture defaults, outbound bitrate targets, room budgets, scene quality, and mobile exceptions.
---

# Default resolution and bitrate by mode

VDO.Ninja has separate defaults for **capture resolution**, **outbound video bitrate**, and **the bitrate requested by each viewer**. A room preview and an OBS scene can receive different quality from the same publisher at the same time.

This reference describes the normal browser WebRTC/RTP paths, reviewed against the local source on September 12, 2026. Older deployed versions can differ, particularly for automatic room-only tiers. These are configured targets and limits, not measured or guaranteed output. Audio, retransmissions, and transport overhead add bandwidth beyond the video values below. Native apps, WHIP/Meshcast, recording, and opt-in chunked/WebCodecs encoders have separate settings.

## Quick reference

The table assumes a fresh session, no bitrate or quality URL overrides, no prior UI changes, and a viewer that has not requested a different bitrate.

| Publishing mode | Default capture request | Starting outbound video target before room/mobile limits |
| --- | --- | --- |
| Camera, outside a room | Device-selected 1080p, 720p, or 360p; see device table below | 4000 kbps |
| Camera, inside a room | Normally 720p; weaker devices can start at 360p | 4000 kbps; room previews request substantially less |
| Start directly with the main screen-share source, inside or outside a room | 1920x1080 ideal | Approximately 2500 kbps fallback |
| Replace an already-running camera with a main screen share (`sstype=1`) | Camera/session quality tier unless a screen-share quality has been selected; normally 720p in a room | Retains the session's outbound setting, normally 4000 kbps after default camera setup |
| Secondary screen share in a separate session (`sstype=2`) | 1920x1080 ideal | Approximately 2500 kbps fallback, independent of the parent camera target |
| Secondary screen stream in the same session (`sstype=3`) | 1920x1080 ideal | Shares the parent session's outbound setting, normally 4000 kbps after default camera setup |

**There is no universal “screen share = 6000 kbps” default.** Starting with screen sharing and switching an existing camera to screen sharing are different initialization paths.

A normal visible scene or solo viewer releases the room-preview restriction and uses the negotiated/publisher target. That means a default camera can target 4000 kbps while a fresh direct screen-share session falls back to about 2500 kbps. An explicit viewer bitrate changes this request, subject to sender caps and browser adaptation.

## What primary and secondary mean

* **Main/primary screen share:** either start with screen sharing as the source, or replace the camera on the existing stream. Replacing the camera keeps that session and its existing connection settings.
* **Secondary, separate session (`sstype=2`):** publishes an additional stream through a generated screen-share page. The camera keeps running. The generated URL defaults to `q=0`, but screen capture does not run the camera bitrate-preset code.
* **Secondary, same session (`sstype=3`):** adds a screen stream using the current session. It has its own screen capture constraints but uses shared session-level outbound settings.

`screenshare2`/`ss2` is an entry-page option; its name alone does not mean `sstype=2`.

## Camera resolution when quality is omitted

The initial camera estimate uses browser-reported CPU threads and memory, not a reliable model or chipset database. Conditions are checked in the order below.

| Device signal | Outside-room camera tier |
| --- | --- |
| iOS/iPadOS with detected Safari/WebKit version 17 or newer | 1080p |
| Detected Intel Mac, fewer than 6 reported threads | 360p |
| Detected Intel Mac, 6 or more reported threads | 720p |
| Mobile, fewer than 4 reported threads or reported memory at most 2 GB | 360p |
| Mobile, at least 8 threads and memory either unavailable or at least 6 GB | 1080p |
| Other mobile with at least 4 threads | 720p |
| Remaining devices, thread count unavailable | 720p |
| Remaining devices, fewer than 4 threads | 360p |
| Remaining devices, more than 8 threads | 1080p |
| Remaining devices, 4–8 threads | 720p |

The room camera default starts at 720p and is lowered to 360p if this estimate selects 360p. A 1080p device estimate does not automatically make the room capture 1080p. UI selections and explicit quality parameters can change these defaults. Browser detection can misclassify hardware; an M-series Mac is not automatically a promise of a particular tier.

These are resolution presets, with browser-specific constraints and fallback behavior. Camera frame rate is device/browser-dependent unless separately specified. Screen capture normally requests an **ideal 60 fps**, not a guaranteed 60 fps.

## Explicit quality versus automatic quality

`quality` (`q`) sets the general capture preset. `screensharequality` (`ssq`) takes priority for screen capture. Setting screen-share quality does not apply the camera bitrate table to a fresh screen-share publisher.

| Camera URL setting | Requested camera resolution | Automatic outbound camera target, if no outbound override |
| --- | --- | --- |
| Omitted | Device/room estimate above | 4000 kbps |
| `q=0`, `q=1080p` | 1920x1080 | 4000 kbps |
| `q=1`, `q=720p` | 1280x720 | Approximately 2500 kbps fallback |
| `q=2`, `q=360p` | 640x360 | Approximately 2500 kbps fallback |
| `q=-1` | Unlocked preset constraints | 4000 kbps |
| `q=-3`, `q=1440p` | 2560x1440 preset | 6000 kbps |
| `q=-2`, `q=4k` | 3840x2160 preset | 8000 kbps |

The omitted-quality camera bitrate is a current implementation detail: the stored default is `false`, and the camera setup comparison treats it as equal to zero. Consequently, automatic 720p capture and explicit `q=1` can have different outbound defaults. Selecting a resolution in the UI also does not necessarily have the same bitrate side effect as setting `q` in the URL.

For screen capture, `ssq=0` requests 1080p, `ssq=1` requests 720p, `ssq=2` requests 360p, and `ssq=-1` leaves preset dimensions unlocked. Direct screen capture and the secondary capture paths also map `ssq=-3` to 1440p and `ssq=-2` to 4K. The camera-replacement path currently lacks those two explicit dimension mappings; use `width`/`height` there if you need explicit dimensions.

Explicit `width` and `height` can override preset dimensions. Aspect-ratio controls, device capabilities, browser fallback, and subsequent adaptation can still affect the result. In particular, presets are not guarantees that a camera or selected screen surface will produce that exact size.

## Room previews versus scenes and solo links

### Standard production-room budget

The normal room receive budget is **500 kbps total video per viewer**, divided among eligible visible incoming streams. It is not 500 kbps for every camera and is not a total upload cap on the publisher.

Let `B` be that viewer's room budget, `C` its visible incoming camera count, and `S` its visible incoming screen-share count. With no screen-specific override, the current allocation is:

| Visible incoming streams | Requested bitrate |
| --- | --- |
| Cameras only | `B / C` per camera |
| Cameras and screen shares | Each screen share: `B / (1.5 * S)`; each camera: `(B - B / (1.5 * S)) / C` |
| Screen shares only | `B` per screen share |

With the default budget, two cameras alone receive about 250 kbps each. One screen share plus two cameras requests about 333 kbps for the screen and 83 kbps for each camera.

The multi-screen formula is intentionally shown as implemented: it subtracts one screen allocation from the camera pool, and the screens-only branch gives each screen the whole budget. With multiple screen shares, the sum can exceed the nominal total budget. Treat the budget as allocation logic, not a strict aggregate network limiter.

Both primary and secondary screen shares get screen-share priority when advertised as screen sharing. Camera feeds can also be downscaled at low requested bitrates; screen shares bypass that particular camera downscaling heuristic, so their frame rate can suffer while preserving detail.

### Automatic guest-only rooms

When all eligible visible sources advertise room-only status, an ordinary guest viewer can automatically use a **2000 kbps** allocation budget instead of 500. For camera feeds from weak tier-1 mobile senders, the request is additionally capped at `1500 / visible-stream-count` kbps. The screen-share priority branch uses its screen allocation instead of that camera-specific division.

A sender qualifies when its active outgoing peers are room guests, with no director, scene, or other non-guest viewer connection. Directors, scene sessions, WHIP output, and Meshcast do not qualify. An explicit room budget, explicit viewer `bitrate`, or a numeric control-room budget prevents the viewer's automatic increase. Qualification can change as viewers connect or leave.

See [Room-only mobile bitrate tiers](room-only-mobile-bitrate-tiers.md) for configuration details.

### Scenes, solo viewers, and hidden video

| Viewer mode | Default behavior |
| --- | --- |
| Visible solo view, with or without a room affiliation | Uses normal negotiated/publisher bitrate when treated as a solo/scene viewer rather than a room preview |
| Visible scene stream | Releases the room-preview cap; no default shared scene budget |
| Explicit scene `bitrate=6000` | Requests 6000 kbps per visible feed, subject to caps |
| Explicit `totalscenebitrate` | Divides a scene budget; screen-share allocation has special handling |
| Hidden scene feed | Default hidden video target is 0; optimization controls how suspension/resumption is applied |
| Hidden room-preview feed | Requests 0 video bitrate |

The explicit scene-budget path has a current mixed-content quirk: when cameras and screen shares are both present, its allocation calculation uses the room-budget variable. Do not assume `totalscenebitrate` is evenly divided in that case; use explicit per-feed/screen-share settings when exact targets matter.

Zooming a preview, director controls, visibility changes, manual per-feed settings, and layout optimization can also change requests. A scene never creates a higher-resolution capture than the sender supplies.

## Mobile: flagship versus ordinary mode

`flagship` is a manual mobile capability hint. It does **not** select 1080p, change the automatic capture estimate, or set a 4000/6000 kbps preset.

These sender caps apply to connections classified as guest viewers, unless the mobile-cap bypass applies; they are not blanket caps on OBS scene/solo output.

| Mobile sender situation | Default guest-connection cap |
| --- | --- |
| Eligible room-only tier 1 | 1500 kbps |
| Eligible room-only tier 2 | 2000 kbps |
| Production-style connections, ordinary mobile, at most 4 peer entries | 350 kbps |
| Production-style connections, ordinary mobile, more than 4 peer entries | 35 kbps |
| Production-style connections, iOS/iPadOS WebKit 13 or older | 35 kbps |
| Production-style connections with `flagship` | 350 kbps, including the larger-peer-count/older-iOS cases |

Room-only tiers take precedence over `flagship`. A lower viewer request or sender maximum can still produce less than these caps. `flagship` also makes some low-bitrate mobile camera downscaling less aggressive. It does not disable downscaling entirely.

`maxmobilebitrate` changes the normal 350 cap; `lowmobilebitrate` changes the lower cap. `nomobilebitratecap` bypasses this mobile guest-cap mechanism. The peer-specific `forceios` override also bypasses this guard. None of these makes the device's encoding capacity unlimited.

## Which parameter controls which part?

| Parameter | Where to set it | Purpose |
| --- | --- | --- |
| `quality` / `q` | Publisher | General capture preset; camera setup also selects a default outbound target |
| `screensharequality` / `ssq` | Publisher | Screen-specific capture preset |
| `width`, `height` | Publisher | Explicit capture dimensions |
| `fps`, `maxframerate` | Publisher | General capture frame-rate controls |
| `screensharefps` | Publisher | Screen-specific frame-rate request/maximum |
| `bitrate` / `videobitrate` | Solo/scene viewer | Requested video bitrate per feed |
| `outboundvideobitrate` | Publisher | Default outbound target when the viewer has not supplied one |
| `maxvideobitrate` | Publisher | Sender-side video ceiling |
| `totalroombitrate` | Room viewer/guest | Room receive allocation budget |
| `roombitrate` | Publisher | Outbound cap for room guest viewers |
| `screensharebitrate` | Receiving page | Explicit bitrate request for streams marked as screen shares |
| `totalscenebitrate` | Scene viewer | Shared scene allocation, with the mixed-content caveat above |
| `screensharecontenthint=motion` | Publisher | Prefer motion for screen content where supported; does not select a bitrate or resolution |

A separate secondary session receives a selected subset of parent settings through its generated URL, not every parent parameter. In particular, do not assume the parent's outbound camera bitrate is copied to that session. Setting the desired screen bitrate on the receiving solo/scene page avoids that ambiguity.

## Verification and source map

These tables document source behavior, not a completed browser/device test matrix. Inspect live outbound/inbound statistics for actual width, height, frame rate, bitrate, loss, and encoder limitation reason. Compare the specific OBS connection with the room preview rather than assuming their values match.

Maintainer reference: reviewed local checkout based on `91f23cca3cb79b7fa175264347c18dfbaccf75c5`, including existing working-tree changes. Relevant source functions are `judgePerformance`, `grabVideo`, `publishScreen`, `publishScreen2`, `toggleScreenShare`, `grabScreen`, `createScreenShareURL`, `createSecondStream`, and the room allocation in `updateMixer` in root `lib.js`; session defaults, `getRoomOnlyTier`, `getMobileGuestBitrateCap`, `limitBitrate`, `getOptimizedScale`, and SDP bitrate negotiation in root `webrtc.js`; and URL parsing in `main.js`. Line numbers move as the application changes.

For practical setup, see [How to control bitrate/quality](how-do-i-control-bitrate-quality.md), [Video bitrate for push/view links](video-bitrate-for-push-view-links.md), and [Video bitrate in rooms](video-bitrate-in-rooms.md).
