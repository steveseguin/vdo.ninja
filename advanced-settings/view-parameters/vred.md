---
description: Asks WebRTC negotiation to prefer video RED right after the chosen video codec
---

# \&vred

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

{% hint style="warning" %}
Experimental. `&vred` only changes codec order during negotiation. The browser still decides whether to send any RED or FEC repair packets.
{% endhint %}

## Options

Example: `&codec=vp8&vred`

| Value | Description |
| --- | --- |
| (no value) | Prefer video RED during negotiation |

There is no default; without `&vred`, codec order is left alone.

## Details

`&vred` reorders the video codec list in the session description so the requested codec comes first and `video/red` comes right after it, when the browser offers RED.

On a viewer link, it only takes effect together with [`&codec`](codec.md), because VDO.Ninja reorders codecs only when a codec is requested. On a publisher using [`&meshcast`](../../newly-added-parameters/and-meshcast.md) or [`&whipout`](../whip-parameters/and-whipout.md), it also applies to the outgoing WHIP offer.

Start with VP8. Chromium can disable the RED/ULPFEC combination in some cases, such as H.264 with NACK enabled.

```text
https://vdo.ninja/?view=STREAMID&codec=vp8&vred&buffer=500
```

## What it does not do

* It does not force a FEC percentage or parity rate, and does not guarantee repair packets are sent.
* VDO.Ninja has no URL parameter that forces browser video FEC on normal WebRTC video.
* It does not configure the Ninja OBS Plugin publisher, which does not offer video RED, ULPFEC or FlexFEC. That plugin's **Packet Duplication** setting is separate and is not turned on by `&vred` or `&pvred`.

If you need VDO.Ninja-controlled parity, use the chunked (WebCodecs) path instead. It adds buffering:

```text
https://vdo.ninja/?push=STREAMID&chunked=2500&chunkfec=4&chunknack=1
https://vdo.ninja/?view=STREAMID&chunkbuffer=1500
```

`&chunkfec=4` sends one parity payload per four data chunks.

## Bandwidth

`&vred` adds no fixed overhead. If the browser sends repair data, it comes out of the same uplink budget as the video. On a tight link, that can make congestion worse. Pair RED tests with a lower bitrate and some headroom, for example `&videobitrate=2500&maxbandwidth=60` on the viewer, or `&outboundvideobitrate=2500&maxvideobitrate=2500&maxbandwidth=60` on the publisher.

## When to use it

Try `&codec=vp8&vred` when the stream has short, random packet loss, round-trip time is not extreme, and there is bitrate headroom. Always compare against the same link without `&vred`.

For other problems, use other controls:

| Problem | Try |
| --- | --- |
| Jitter or reordering | [`&buffer=500`](buffer.md) or [`&buffer2`](../video-parameters/and-buffer2.md) |
| Smeared video that lingers after a dropout | [`&keyframe=3000`](keyframerate.md); avoid very frequent keyframes |
| Motion breaking up under bandwidth pressure | `&degrade=maintain-framerate` |
| Screen sharing or text | `&degrade=maintain-resolution` |
| Burst loss, cellular handoffs or multi-second outages | [`&chunked`](../../newly-added-parameters/and-chunked.md), SRT, RTMP, or WHIP/WHEP with an SFU |
| Audio dropouts | `&audiocodec=red` |

Do not add `&nonack`, `&nopli` or `&noremb` for reliability. They remove the feedback WebRTC uses to recover and adapt.

## How to test

1. Compare the same stream with and without `&vred`, keeping codec and bitrate fixed.
2. Open `chrome://webrtc-internals` (Chrome) or `about:webrtc` (Firefox).
3. Check the negotiated video codec and payloads.
4. Compare bitrate, packet loss, NACK count, freezes, keyframes and picture stability.

Browser support for RED varies. Check the target browser, including older OBS Browser Source versions, before relying on it.

## Related

| Parameter | Side | Use |
| --- | --- | --- |
| `&pvred` | Publisher | Prefer video RED in the publisher's own codec ordering |
| `&prefervideocodec=vp8` | Publisher | Preferred video codec for viewers |
| `&redaudio`, `&fecaudio`, `&predaudio`, `&pfecaudio` | Viewer / publisher | Experimental audio RED/FEC ordering |
| `&chunkfec`, `&chunknack` | Chunked publisher / viewer | VDO.Ninja-controlled parity and retransmission |

{% content-ref url="codec.md" %}
[codec.md](codec.md)
{% endcontent-ref %}

{% content-ref url="buffer.md" %}
[buffer.md](buffer.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}

{% content-ref url="../../guides/packet-loss-recovery-and-resilient-media.md" %}
[packet-loss-recovery-and-resilient-media.md](../../guides/packet-loss-recovery-and-resilient-media.md)
{% endcontent-ref %}
