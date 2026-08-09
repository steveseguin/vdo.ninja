---
description: Requests video RED redundancy support during WebRTC negotiation
---

# \&vred

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

{% hint style="warning" %}
This is an experimental normal-WebRTC reliability option. It can change codec negotiation, but the browser still decides whether RED or FEC repair packets are actually sent.
{% endhint %}

## Quick use

For short random packet loss, test this on the viewer or OBS link:

```text
https://vdo.ninja/?view=STREAMID&codec=vp8&vred&buffer=500
```

Use it as an A/B test, not as a default magic fix. Compare the same stream with and without `&vred` while watching VDO.Ninja stats and `chrome://webrtc-internals` or `about:webrtc`.

## Options

Example: `&codec=vp8&vred`

| Value | Description |
| --- | --- |
| (no value) | request video RED preference during negotiation |
| `1` | same as no value |

## What it does

`&vred` sets VDO.Ninja's viewer-side video error-correction preference. In the current code path, VDO.Ninja passes that flag into `CodecsHandler.preferCodec(...)`, which reorders the video SDP payload list so that the requested video codec is first and `video/red` is preferred immediately after it when the browser's SDP advertises RED.

The practical test URL is:

```text
&codec=vp8&vred
```

`&codec=vp8` asks the sender to use VP8. `&vred` asks negotiation to keep RED near the front of the payload list. VP8 is the best starting point for this experiment because Chromium's WebRTC sender logic can disable RED/ULPFEC combinations in some cases, including when NACK is enabled with payloads that do not support skipping FEC packets, such as common H.264 paths.

## What it does not do

`&vred` does not force a fixed video FEC percentage, does not force a specific parity rate, and does not guarantee that repair packets are sent. It is a negotiation preference.

It also does not configure the native Ninja OBS Plugin publisher. That publisher does not offer video RED/ULPFEC or
FlexFEC. Its **Packet Duplication** setting is an OBS-side control that sends best-effort delayed copies of selected RTP
packets; it is not activated by `&vred` or `&pvred`.

For normal WebRTC RTP video, VDO.Ninja currently does not expose a URL parameter that forces browser video parity/FEC data. The browser and its WebRTC stack decide whether repair packets are worth sending, and how much bandwidth they can spend.

If you need a VDO.Ninja URL option that explicitly adds parity data, use the chunked/WebCodecs path instead:

```text
https://vdo.ninja/?push=STREAMID&chunked=2500&chunkfec=4&chunknack=1
https://vdo.ninja/?view=STREAMID&chunkbuffer=1500
```

In chunked mode, `&chunkfec=4` means one parity payload per four data chunks. That is VDO.Ninja-controlled parity, but it is not the same low-latency browser RTP path and it adds explicit buffering.

## Bandwidth impact

`&vred` itself does not set a fixed bandwidth overhead. If the browser only negotiates RED but does not send redundant or FEC payloads, bandwidth may not meaningfully change. If the browser does send RED/ULPFEC repair data, the stream can use extra bandwidth for repair packets, and that bandwidth comes out of the same uplink budget as media quality.

On a constrained uplink, extra repair traffic can help short random loss but can also make congestion worse if there is no headroom. For unstable mobile links, pair any RED experiment with a lower target bitrate and headroom:

```text
&videobitrate=2500&maxbandwidth=60
```

or on the publisher:

```text
&outboundvideobitrate=2500&maxvideobitrate=2500&maxbandwidth=60
```

## When to use it

Try `&codec=vp8&vred` when:

* the stream has short random packet loss;
* RTT is not extremely high;
* the link still has bitrate headroom after reducing the video target;
* you can compare against the same URL without `&vred`.

Prefer other controls when the issue is different:

* jitter or packet reordering: start with [`&buffer=500`](buffer.md) or [`&buffer2`](../video-parameters/and-buffer2.md);
* lingering smeared video after a dropout: test [`&keyframe=3000`](keyframerate.md), but avoid very frequent keyframes;
* motion under bandwidth pressure: test `&degrade=maintain-framerate`;
* screen sharing or text: test `&degrade=maintain-resolution`;
* burst loss, cellular handoffs, or multi-second outages: use [`&chunked`](../../newly-added-parameters/and-chunked.md), SRT, RTMP, WHIP/WHEP with an SFU, or a bonded/smoothing path.

Do not add `&nonack`, `&nopli`, or `&noremb` when the goal is reliability. Those flags remove browser feedback mechanisms that normally help WebRTC recover and adapt.

## Related VDO.Ninja parameters

| Parameter | Side | Use |
| --- | --- | --- |
| `&vred` | viewer | Prefer video RED in viewer-side negotiation. |
| `&pvred` | publisher | Publisher-side companion flag for preferred video RED negotiation. |
| `&codec=vp8` | viewer | Common codec pairing for testing video RED behavior. |
| `&prefervideocodec=vp8` | publisher | Publisher-side preferred video codec order for peers. |
| `&buffer`, `&buffer2` | viewer | Add normal-WebRTC playout delay for jitter and late packets. |
| `&keyframe=3000` | viewer | Ask remote publishers for periodic keyframes to clear lingering corruption. |
| `&degrade=maintain-framerate` | viewer | Prefer dropping resolution before frame rate under pressure. |
| `&degrade=maintain-resolution` | viewer | Prefer dropping frame rate before resolution under pressure. |
| `&videobitrate`, `&outboundvideobitrate`, `&maxvideobitrate` | viewer/publisher | Keep media bitrate within the real link budget. |
| `&maxbandwidth=60` | publisher | Leave headroom against estimated available bandwidth. |
| `&audiocodec=red` | viewer | Audio RED; more directly useful for packet-loss audio than video RED is for video. |
| `&redaudio`, `&fecaudio`, `&predaudio`, `&pfecaudio` | publisher/viewer | Experimental audio RED/FEC ordering flags. |
| `&chunkfec`, `&chunknack` | chunked push/view | VDO.Ninja-controlled chunk parity and retransmission. |

## Browser support notes

Browser support is not the same as guaranteed repair behavior.

* `RTCRtpReceiver.getCapabilities("video")` is the standard way to inspect advertised codec, RTX, RED, and FEC capabilities. MDN marks it as widely available.
* `RTCRtpTransceiver.setCodecPreferences()` is now a standard codec-ordering API, but VDO.Ninja's current normal WebRTC code path still uses SDP ordering through `CodecsHandler`.
* `RTCRtpReceiver.jitterBufferTarget`, used for receiver-side buffering where available, is still marked as limited availability by MDN. VDO.Ninja checks for support before using it and falls back to older delay hints where available.

Current Playwright checks in this repo verified:

| Browser project | Video RTP capabilities advertised in test | Delay knobs seen in test |
| --- | --- | --- |
| Chromium | `video/vp8`, `video/rtx`, `video/red`, `video/ulpfec`, plus `video/flexfec-03` on the receiver side | `jitterBufferTarget=true`, `playoutDelayHint=true` |
| Firefox | `video/vp8`, `video/rtx`, `video/red`, `video/ulpfec` | `jitterBufferTarget=true`, `playoutDelayHint=false` |

Safari was not covered by this repo's Playwright reliability test. Treat Safari and old embedded browser runtimes, including old OBS Browser Source CEF builds, as "verify on the target runtime" cases.

## Verification checklist

1. Test the same stream with and without `&vred`.
2. Keep the codec and bitrate fixed while comparing.
3. In Chrome, open `chrome://webrtc-internals`; in Firefox, open `about:webrtc`.
4. Confirm the negotiated video codec and payloads.
5. Compare bitrate, packet loss, NACK count, freezes, keyframe count, and subjective image stability.

The Playwright tests in this repo confirm URL parsing, SDP ordering, and browser capability/offer behavior. They do not prove that quality improves under loss; that requires a controlled packet-loss test with netem, clumsy, or equivalent tooling.

## Advanced notes

RED and ULPFEC are related but not identical:

* RED is an RTP payload format for carrying redundant data.
* ULPFEC is a generic RTP forward-error-correction payload format based on XOR/parity repair data.
* In WebRTC video, RED and ULPFEC are often negotiated together, but the browser may disable the combination depending on codec, NACK support, field trials, and sender logic.

The local `CodecsHandler.preferCodec(sdp, codec, useRed, useUlpfec)` helper has a fourth `useUlpfec` argument. The current normal VDO.Ninja RTP video paths pass `session.videoErrorCorrection` as `useRed`, but they do not expose a URL flag that passes `useUlpfec=true` for video. Adding such a flag could be a future experiment, but it still would not force a browser FEC percentage. It would only request a different SDP order, and the browser could still decline or disable it.

For a stronger future implementation, VDO.Ninja could investigate `RTCRtpTransceiver.setCodecPreferences()` for modern browsers, while keeping SDP reordering as a fallback for older runtimes. This would still be codec ordering, not a JavaScript API for forcing RTP video parity.

## References

* [MDN: RTCRtpReceiver.getCapabilities()](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpReceiver/getCapabilities_static)
* [MDN: RTCRtpTransceiver.setCodecPreferences()](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiver/setCodecPreferences)
* [MDN: RTCRtpReceiver.jitterBufferTarget](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpReceiver/jitterBufferTarget)
* [W3C WebRTC specification](https://www.w3.org/TR/webrtc/)
* [IETF RFC 2198: RTP Payload for Redundant Audio Data](https://datatracker.ietf.org/doc/html/rfc2198)
* [IETF RFC 5109: RTP Payload Format for Generic Forward Error Correction](https://datatracker.ietf.org/doc/html/rfc5109)
* [Chromium WebRTC RED/ULPFEC sender logic](https://chromium.googlesource.com/external/webrtc/+/master/call/rtp_video_sender.cc)

## Related

{% content-ref url="codec.md" %}
[codec.md](codec.md)
{% endcontent-ref %}

{% content-ref url="buffer.md" %}
[buffer.md](buffer.md)
{% endcontent-ref %}

{% content-ref url="keyframerate.md" %}
[keyframerate.md](keyframerate.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}

{% content-ref url="../../guides/packet-loss-recovery-and-resilient-media.md" %}
[packet-loss-recovery-and-resilient-media.md](../../guides/packet-loss-recovery-and-resilient-media.md)
{% endcontent-ref %}
