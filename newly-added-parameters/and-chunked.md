---
description: >-
  Chunked WebCodecs publishing mode: bitrate and codec, sender backlog, viewer
  playout buffer, iframe buffer control, parity and NACK reliability,
  adaptation, presets and long-delay sync workflows.
---

# \&chunked WebCodecs publishing mode

Sender-side option! ([`&push`](../source-settings/push.md))

`&chunked` (alias `&chunk`) replaces RTP video with a WebCodecs path: the publisher encodes frames, splits them into chunks and sends them over WebRTC data channels, and the viewer rebuilds and schedules them. Use it for explicit control of bitrate, playout delay and resends, for direct encoded-chunk recording, and for external-sync work such as NINJAM-style music sessions, where video needs a set delay.

![Chunked mode settings by location. On the publisher, chunkbitrate sets the encoder rate, chunkedbuffer sets the send backlog and chunkcache keeps chunks for resending. Chunks travel over an ordered data channel. On the viewer, chunkbuffer sets the playout delay, and NACK requests go back to the publisher's cache.](../.gitbook/assets/network-chunked-buffers.svg)

## Quick start

Publisher, then a viewer with a one-second buffer:

```text
https://vdo.ninja/?push=STREAMID&chunked=2500
https://vdo.ninja/?view=STREAMID&chunkbuffer=1000
```

{% hint style="warning" %}
The number after `&chunked` is the video bitrate in kbps, not a delay: `&chunked=60` asks for about 60 kbps. Set the delay with `&chunkbuffer` or the iframe `setBufferDelay` command.
{% endhint %}

## Publisher: bitrate and codec

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunked` | flag or kbps | Enables chunked publishing. A number sets the legacy target bitrate; with no number the default is 2500 kbps. |
| `&chunkbitrate` | kbps | Explicit chunked video bitrate. Takes priority over the `&chunked` number. Aliases: `&chunkvideobitrate`, `&webcodecsbitrate`. |
| `&maxvideobitrate` | kbps | Caps the chunked bitrate when it is lower. |
| `&chunkcodec` | `av1`, `vp9`, `vp8`, `h264` | Preferred WebCodecs codec. A comma-separated list is accepted. Aliases: `&chunkcodecs`, `&chunkvideocodec`, `&webcodecscodec`. |

Without `&chunkcodec`, VDO.Ninja tries AV1, VP9, VP8 and then H.264, and uses the first one the browser can encode. A failed request falls back the same way. [`&codec`](../advanced-settings/view-parameters/codec.md) only affects RTP negotiation, and [`&bitrate`](../advanced-settings/video-bitrate-parameters/bitrate.md) is a viewer request for RTP video; neither changes the chunked encoder.

## Publisher: sender backlog

[`&chunkedbuffer`](../advanced-settings/newly-added-parameters/and-chunkedbuffer.md) (alias `&sendingbuffer`) sets how many milliseconds of encoded media can queue before relief and adaptation start. It is not the viewer delay. The default is 500 ms; the flag with no number uses 5000 ms. Values of 1000–2000 ms react faster and suit sync and mobile profiles. Larger values tolerate bursts but adapt later and use more memory.

## Viewer: playout buffer

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunkbuffer` | ms (0–180000) | Starting playout target. Default 3000. |
| [`&buffer`](../advanced-settings/view-parameters/buffer.md) | ms | General viewer buffer; overrides `&chunkbuffer` when present |
| `&chunkbufferfloor` | ms (0–180000) | Lowest target the adaptive buffer may choose |
| `&chunkbufferceil` | ms (0–180000) | Highest target the adaptive buffer may choose |
| `&chunkbufferadaptive` | `0` or `1` | Automatic target adjustment. On by default. |
| `&fixedchunkbuffer` | flag | Same as `&chunkbufferadaptive=0` |
| `&chunkjitterslack` | ms (0–10000) | Extra headroom before stale-frame and rebuffer decisions |

When chunked audio plays with the video, the shared target is capped at 30 seconds. For longer video-only delays, add `&noaudio` to the viewer. Example: `&chunkbuffer=1000&chunkbufferfloor=700&chunkbufferceil=2000`.

## Iframe API buffer control

An embedding page can change the delay, in milliseconds, with `postMessage`:

```javascript
iframe.contentWindow.postMessage({ setBufferDelay: 60000 }, "*"); // default for all peers
iframe.contentWindow.postMessage({ setBufferDelay: 60000, UUID: "*" }, "*"); // every current peer
iframe.contentWindow.postMessage({ setBufferDelay: 60000, streamID: "STREAMID" }, "*"); // one peer
```

To target one peer you can also pass `UUID: "PEER_UUID"` or an exact, unique `label`. With no target, the command changes the default (`session.buffer`) used by peers without their own setting. The `commands` API offers `setBufferDelay(value, target)`. To read state, send `{ getStats: true }`, `{ getStreamIDs: true }` or `{ getDetailedState: true }`; chunked video stats are under `stats.chunked_mode_video` (see the [debugging checklist](#debugging-checklist)).

## Reliability

Reliability is opt-in. Plain `&chunked` uses compatible positional framing with no parity or resends. Enabling `chunknack`, or `chunkfec=2` or higher, turns on indexed framing automatically.

| Parameter | Link | Values | Description |
| --- | --- | --- | --- |
| `&chunkindex` | Publisher | `0` or `1` | Indexed framing, so missing chunks are detectable |
| `&chunknack` | Publisher | `0` or `1` | Viewers may request missing chunks from the publisher's cache |
| `&chunkfec` | Publisher | 0–12 | XOR parity when 2 or higher (see below) |
| `&chunkchunksize` | Publisher | 2048–65536 bytes | Largest indexed chunk. Default 16384. |
| `&chunkcache` | Publisher | 0–60000 ms | Resend cache window. Unset, it is derived from the buffers: 6–30 s, up to 64 MB. |
| `&chunkretry` | Publisher | 0–60000 ms | Extra input to the derived cache window |
| `&chunknackattempts` | Viewer | 1–20 | Requests per missing chunk. Default 3. |
| `&chunknackdelay` | Viewer | 50–5000 ms | Delay between requests. Default 180. |

`chunkfec=N` adds one parity chunk for each group of up to N data chunks in a frame. A frame with fewer than N chunks still gets a full parity chunk, so overhead is often well above 1/N, and near 100% when each frame fits in one chunk. A smaller `&chunkchunksize` splits frames into more chunks. Measure the added byte rate.

Typical settings:

```text
Publisher: &chunkindex=1&chunknack=1&chunkchunksize=4096&chunkcache=30000
Viewer:    &chunknackattempts=8&chunknackdelay=250
```

Parity and NACK help with loss, not with too little bandwidth; if the route cannot carry the bitrate, lower it. A long playout delay does not need a long resend cache, because a resend only helps before the viewer gives up on that frame. About 30 s is enough for most long-delay sync work.

## Adaptation

Chunked mode responds to sender backlog by lowering bitrate, dropping frames, or both. All of these settings go on the publisher.

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunkadapt` | `bitrate`, `framerate`, `hybrid` | Mode. Default `bitrate`. |
| `&chunkadaptfloor` | kbps | Lowest bitrate. Default 20% of the start, at least 200. |
| `&chunkadaptceil` | kbps | Highest bitrate. Default is the starting bitrate. |
| `&chunkadaptthreshold` | ms | Backlog before stepping down. Default 380. |
| `&chunkadaptmaxdrop` | frames (0–120) | Most frames queued for dropping in `framerate`/`hybrid` mode. Default 6. |
| `&chunkadaptinterval` | ms | Minimum time between bitrate changes. Default 800. |
| `&chunkadaptresolution` | `0` or `1` | Also lowers resolution as the bitrate falls |

`bitrate` keeps motion even while the picture softens; it is the least surprising choice for music sync and rooms, because one encoder serves every viewer. `framerate` keeps detail by dropping frames, so motion becomes uneven. `hybrid` does both; test it carefully with many viewers.

## Presets

`&chunkprofile` applies a group of defaults. Parameters you add yourself override them. Add the same profile to both links: the publisher uses the parity, NACK and adaptation values, and the viewer uses the buffer values.

| Profile | Parity | Viewer buffer (target / floor / ceiling / slack, ms) | Adaptation |
| --- | --- | --- | --- |
| `mobile` | `chunkfec=3` | 900 / 600 / 1600 / 250 | `framerate`, 320–1400 kbps |
| `balanced` | `chunkfec=4` | 750 / 450 / 1400 / 220 | `hybrid`, 420–2600 kbps |
| `desktop` | `chunkfec=5` | 620 / 400 / 1100 / 180 | `bitrate`, 580–4200 kbps |

All three also turn on `chunknack`. Their small buffer ceilings suit low-delay testing, not long-delay music sync.

## External sync and NINJAM-style workflows

For external audio sync, let the music app set the video delay rather than VDO.Ninja's automatic logic.

Viewer baseline:

```text
&scene&noaudio&chunkbufferadaptive=0&chunkbufferfloor=0&chunkbufferceil=180000&chunknackattempts=8&chunknackdelay=250
```

Balanced publisher baseline (720p, 900 kbps):

```text
&quality=1&fps=30&chunked=900&chunkbitrate=900&maxvideobitrate=900&chunkindex=1&chunknack=1&chunkchunksize=4096&chunkcache=30000&chunkedbuffer=1500&chunkadapt=bitrate&chunkadaptfloor=300&chunkadaptceil=900&noaudio
```

Mobile or weak-link publisher baseline (360p, 600 kbps):

```text
&quality=2&fps=30&chunked=600&chunkbitrate=600&maxvideobitrate=600&chunkindex=1&chunknack=1&chunkchunksize=4096&chunkcache=30000&chunkedbuffer=1500&chunkadapt=bitrate&chunkadaptfloor=250&chunkadaptceil=600&noaudio
```

Then set the exact delay with `setBufferDelay`. In six-publisher TURN/TCP tests, 720p at 900 kbps stayed in sync but did not always build a full 60 s buffer under heavy relay load; 360p at 600 kbps held one much more reliably. Avoid 1080p at 900 kbps unless you have measured the route. Mobile guests are often on TURN, so start them lower.

## Recording

Chunked recordings can be written directly from the encoded chunks, without a second video encode, which saves CPU. Test it before a real session. A common layout is a chunked, buffered view for OBS recording plus a separate normal view, with `&nochunked`, for low-latency monitoring.

## Disabling chunked paths

On the viewer, [`&nochunked`](../advanced-settings/settings-parameters/and-nochunked.md) (alias `&nochunk`) refuses chunked media and stays on normal RTP. `&nochunkaudio` (alias `&nochunkedaudio`) accepts chunked video but keeps audio on the normal path.

## Compatibility

* Chunked mode targets recent Chromium-based browsers.
* Firefox cannot publish in chunked mode; VDO.Ninja warns and uses the regular media path.
* Safari can publish only when the required WebCodecs and worker track-processing APIs are present.
* A viewer that cannot decode chunked video receives normal RTP instead.
* This path is more experimental than RTP video. Test with your real browsers, devices and networks first.

## Debugging checklist

Check these fields in the viewer's `stats.chunked_mode_video`:

* `buffer_buffer` (effective target, ms) is near the requested target, and `buffer_level` (queued video, ms) fills and stays near it. `buffer_delta` shows scheduling headroom.
* `rebuffering` and `awaiting_keyframe` return to `false` after warm-up or recovery.
* `nacks_sent` and `fec_repairs` rise only when you expect loss. `orphan_chunks` counts indexed chunks that arrived without matching frame state.

If playback stays in sync but the buffer never reaches the target, the bitrate or resolution is too high for the current network or CPU load.

## Related

{% content-ref url="../advanced-settings/newly-added-parameters/and-chunkedbuffer.md" %}
[and-chunkedbuffer.md](../advanced-settings/newly-added-parameters/and-chunkedbuffer.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-nochunked.md" %}
[and-nochunked.md](../advanced-settings/settings-parameters/and-nochunked.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-retransmit.md" %}
[and-retransmit.md](../advanced-settings/settings-parameters/and-retransmit.md)
{% endcontent-ref %}

{% content-ref url="../guides/recording-video-with-consistent-results.md" %}
[recording-video-with-consistent-results.md](../guides/recording-video-with-consistent-results.md)
{% endcontent-ref %}
