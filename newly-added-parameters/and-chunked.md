---
description: >-
  VDO.Ninja chunked and WebCodecs publishing mode, including bitrate, codec,
  receiver buffer, iframe control, reliability, NACK/FEC, and sync-workflow
  tuning parameters.
---

# \&chunked WebCodecs publishing mode

Sender-side option! ([`&push`](../source-settings/push.md))

`&chunked` switches video publishing from the browser-managed RTP video path to a VDO.Ninja WebCodecs/DataChannel path. The publisher encodes video with WebCodecs, splits encoded frames into chunks, sends them over WebRTC DataChannels, and the viewer reconstructs and schedules those frames for playback.

This mode is useful when you need explicit control over video bitrate, delayed playback, retransmission behavior, and direct encoded-chunk recording. It is especially useful for recording workflows and external-sync workflows such as NINJAM-style music sessions where audio timing is handled outside VDO.Ninja and video needs a deliberate delay.

## Quick start

Basic chunked publisher:

```text
https://vdo.ninja/?push=STREAMID&chunked=2500
```

Basic chunked viewer with a 1 second chunk buffer:

```text
https://vdo.ninja/?view=STREAMID&chunkbuffer=1000
```

External music-sync viewer with fixed long-delay video:

```text
https://vdo.ninja/?scene&room=ROOM&noaudio&chunkbufferadaptive=0&chunkbufferceil=180000
```

Long-delay publisher profile used by sync tools:

```text
https://vdo.ninja/?push=STREAMID&room=ROOM&quality=1&fps=30&chunked=900&chunkbitrate=900&bitrate=900&maxvideobitrate=900&chunkindex=1&chunknack=1&chunknackattempts=8&chunknackdelay=250&chunkchunksize=4096&chunkcache=30000&chunkedbuffer=1500&chunkadapt=bitrate&chunkadaptfloor=300&chunkadaptceil=900&noaudio
```

Weak-link/mobile long-delay profile:

```text
https://vdo.ninja/?push=STREAMID&room=ROOM&quality=2&fps=30&chunked=600&chunkbitrate=600&bitrate=600&maxvideobitrate=600&chunkindex=1&chunknack=1&chunkchunksize=4096&chunkcache=30000&chunkedbuffer=1500&chunkadapt=bitrate&chunkadaptfloor=250&chunkadaptceil=600&noaudio
```

## Important mental model

Do not treat every buffer-looking value as the same thing. Chunked mode has separate controls:

| Control | Direction | What it does |
| --- | --- | --- |
| Encoder bitrate | Publisher | Controls WebCodecs video quality and encoded byte rate. |
| Sender backlog window | Publisher | Controls how much encoded media can queue before relief/adaptation behavior starts. |
| Receiver playout buffer | Viewer | Controls how long video is delayed before playback. |
| Resend cache | Publisher | Controls how long chunks stay available for NACK retransmission. |
| Adaptive buffer/adaptation | Viewer and publisher | Raises/lower targets or bitrate/framerate under pressure. |

The common mistake is using a music interval or receiver delay as `chunked=<value>`. In current VDO.Ninja, `chunked` is still the legacy WebCodecs enable and bitrate value. If you send `chunked=60`, the encoder may run near 60 kbps. Use `chunkbuffer`, iframe `setBufferDelay`, or per-peer buffer controls for playout delay.

## Sender bitrate and codec controls

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunked` | flag or integer kbps | Enables chunked/WebCodecs publishing. If an integer is provided, it is treated as the legacy target video bitrate in kbps. `&chunked=2500` means about 2.5 Mbps. |
| `&chunkbitrate` | integer kbps | Explicit WebCodecs/chunked video bitrate. Prefer this in integrations because the name describes the setting. |
| `&chunkvideobitrate` | integer kbps | Alias for `chunkbitrate`. |
| `&webcodecsbitrate` | integer kbps | Alias for `chunkbitrate`. |
| `&bitrate` | integer kbps | Also accepted as a chunked bitrate alias, and used elsewhere by VDO.Ninja. |
| `&maxvideobitrate` | integer kbps | Caps the chosen video bitrate. If lower than the chunked bitrate, the cap wins. |
| `&chunkcodec` | `av1`, `vp9`, `vp8`, `h264` | Preferred WebCodecs/chunked video codec. Browser support decides whether the request can be honored. |
| `&chunkcodecs` | codec string | Alias for `chunkcodec`. |
| `&chunkvideocodec` | codec string | Alias for `chunkcodec`. |
| `&webcodecscodec` | codec string | Alias for `chunkcodec`. |
| `&codec` | codec string | RTP/SDP codec preference. It does not, by itself, select the WebCodecs chunked encoder. Use `chunkcodec` for chunked mode. |

If `chunkbitrate` is present, it is used before the legacy `chunked` bitrate value. If no explicit chunked bitrate is provided, the chunked encoder falls back to the `chunked` value and then to its default.

Codec support is browser-dependent. Recent Chromium builds commonly support AV1/VP9/VP8 WebCodecs paths, but H264 WebCodecs encode support can fail and fall back depending on runtime support.

## Sender backlog controls

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunkedbuffer` | ms | Sender-side chunk backlog/pacing window. This is not the viewer playout delay. |
| `&sendingbuffer` | ms | Alias for `chunkedbuffer`. |

If `chunkedbuffer` is not set, the base sender backlog target is about 500 ms. If `&chunkedbuffer` is present without a number, it falls back to about 5000 ms.

Guidelines:

| Value | Use |
| --- | --- |
| `1000-2000` ms | Lower latency and faster relief/adaptation. Good for sync/mobile profiles. |
| `3000-5000` ms | More burst tolerance, but adaptation reacts later. |
| `5000+` ms | Experimental. Can hide bursty delivery but may add memory/backlog and delay down-adaptation. |

## Viewer playout buffer controls

Viewer buffer controls apply on the receiving/viewing side.

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunkbuffer` | ms | Initial chunked viewer playout target. Plain chunked mode defaults around 3000 ms when no profile or buffer override is used. |
| `&buffer` | ms | General viewer buffer. For chunked playback, this can become the initial/global chunked target, but `chunkbuffer` or iframe buffer commands are clearer. |
| `&chunkbufferfloor` | ms | Minimum adaptive chunked viewer target. |
| `&chunkbufferceil` | ms | Maximum adaptive chunked viewer target. Current URL parsing clamps this at 180000 ms. |
| `&chunkbufferadaptive` | `0` or `1` | Turns automatic chunked playout target adjustment off or on. |
| `&fixedchunkbuffer` | flag | Shortcut for disabling adaptive chunked playout target changes. |
| `&chunkjitterslack` | ms | Extra headroom used before stale-frame/rebuffer recovery decisions. |

Examples:

```text
&chunkbuffer=750
&chunkbuffer=1500
&chunkbuffer=3000
&chunkbuffer=1000&chunkbufferfloor=700&chunkbufferceil=2000
&chunkbufferadaptive=0
&fixedchunkbuffer
```

For external music-sync workflows, use fixed buffering and let the external app or iframe API set the exact delay:

```text
&noaudio&chunkbufferadaptive=0&chunkbufferceil=180000
```

## Iframe API buffer control

Embedded integrations can change chunked viewer delay live with `postMessage`.

Set the default buffer for the embedded viewer:

```javascript
iframe.contentWindow.postMessage({ setBufferDelay: 60000 }, "*");
```

Set one peer by VDO peer UUID:

```javascript
iframe.contentWindow.postMessage({ setBufferDelay: 60000, UUID: "PEER_UUID" }, "*");
```

Set all current peers:

```javascript
iframe.contentWindow.postMessage({ setBufferDelay: 60000, UUID: "*" }, "*");
```

Set one peer by stream ID:

```javascript
iframe.contentWindow.postMessage({ setBufferDelay: 60000, streamID: "STREAMID" }, "*");
```

Set one peer by exact label:

```javascript
iframe.contentWindow.postMessage({ setBufferDelay: 60000, label: "PerformerName" }, "*");
```

Behavior notes:

| Target | Behavior |
| --- | --- |
| no target | Updates `session.buffer`, the default target used by peers that do not have a per-peer override. |
| `UUID` | Updates that peer's `session.rpcs[uuid].buffer`. |
| `UUID: "*"` | Updates every current remote peer. |
| `streamID` | Finds the peer with that stream ID and updates its per-peer buffer. |
| `label` | Updates peers whose label exactly matches. Use unique labels. |

The current effective target is visible in stats as:

```text
stats.chunked_mode_video.buffer_buffer
```

Useful stats fields include:

| Field | Meaning |
| --- | --- |
| `buffer_buffer` | Effective target buffer in ms after fixed/adaptive logic. |
| `buffer_level` | Estimated queued video duration in ms. |
| `buffer_delta` | Scheduling delta/headroom in ms. |
| `rebuffering` | Whether chunked video is currently refilling before playback. |
| `awaiting_keyframe` | Whether playback is waiting for a keyframe after loss/drop/recovery. |
| `nacks_sent` | Viewer retransmission requests sent for missing chunks. |
| `fec_repairs` | Frames repaired with parity FEC. |
| `orphan_chunks` | Indexed chunks that arrived without matching metadata/state. |

You can request state from the iframe with existing VDO.Ninja API messages such as:

```javascript
iframe.contentWindow.postMessage({ getStats: true }, "*");
iframe.contentWindow.postMessage({ getStreamIDs: true }, "*");
iframe.contentWindow.postMessage({ getDetailedState: true }, "*");
```

The `commands` API also exposes `setBufferDelay(value, target)`, where `target` can be omitted, `"*"`, a UUID, or a stream ID.

## Reliability controls

Reliability controls are opt-in. Plain `&chunked` can still use legacy framing for compatibility. `chunknack=1` implies indexed chunk framing.

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunkindex` | `0` or `1` | Enables indexed chunk payload framing. Indexed chunks avoid positional misassembly and make missing chunks observable. |
| `&chunknack` | `0` or `1` | Enables viewer NACK requests for missing indexed chunks and sender retransmission from cache. |
| `&chunknackattempts` | `1-20` | Maximum NACK attempts per missing frame/chunk group. Default is 3 unless overridden. |
| `&chunknackdelay` | `50-5000` ms | Base delay between NACK attempts. Default is 180 ms unless overridden. |
| `&chunkfec` | `0-12` | Enables XOR parity FEC when 2 or higher. Example: `chunkfec=5` means one parity chunk per five data chunks. |
| `&chunkchunksize` | `2048-65536` bytes | Maximum chunk payload size used by indexed reliability framing. |
| `&chunkcache` | `0-60000` ms | Sender resend cache window. If absent, VDO.Ninja derives and clamps a useful cache window, currently capped around 30s by default. |
| `&chunkretry` | `0-60000` ms | Additional retry/cache window input for reliability budgeting. |

Typical robust settings:

```text
&chunkindex=1&chunknack=1&chunknackattempts=8&chunknackdelay=250&chunkchunksize=4096&chunkcache=30000
```

Notes:

* NACK/FEC help with recovery, not with insufficient bandwidth. If the encoded bitrate is higher than the route can sustain, lower bitrate/resolution or reduce publisher count.
* A long playout delay does not require a 3 minute resend cache. NACKs are only useful before the receiver gives up on a frame. Around 30s is enough for most long-delay sync workflows.
* `chunkfec` adds overhead. Use it when you want parity repair, and measure the added byte rate.

## Adaptation controls

Chunked mode can respond to pressure by lowering bitrate, dropping/spacing frames, or both.

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunkadapt` | `bitrate`, `framerate`, `hybrid` | Selects adaptation mode. |
| `&chunkadaptfloor` | integer | Lower clamp for adaptation. For bitrate mode this is kbps. |
| `&chunkadaptceil` | integer | Upper clamp for adaptation. For bitrate mode this is kbps. |
| `&chunkadaptthreshold` | ms | Pressure threshold before adaptation responds. |
| `&chunkadaptmaxdrop` | percent | Maximum per-step drop. |
| `&chunkadaptinterval` | ms | Minimum interval between adaptation changes. |

Guidelines:

| Mode | Use |
| --- | --- |
| `bitrate` | Conservative default for music sync and multi-person rooms. Motion cadence stays even, but visual quality can soften. |
| `framerate` | Can protect bitrate/detail by reducing frame cadence. More visible motion unevenness. |
| `hybrid` | Uses both approaches. Useful for experiments, but test carefully with many viewers. |

For NINJAM-style music sync, `chunkadapt=bitrate` is usually the least surprising option because one shared encoder serves all viewers.

## Presets

`&chunkprofile` applies a preset group of buffer/reliability/adaptation defaults. Manual URL parameters after parsing can override these settings.

| Profile | Main defaults | Intended use |
| --- | --- | --- |
| `mobile` | `chunkfec=3`, `chunknack=1`, `chunkbuffer=900`, `chunkbufferfloor=600`, `chunkbufferceil=1600`, `chunkjitterslack=250`, `chunkadapt=framerate`, `chunkadaptfloor=320`, `chunkadaptceil=1400` | Lower-bandwidth/mobile testing with shorter live buffers. |
| `balanced` | `chunkfec=4`, `chunknack=1`, `chunkbuffer=750`, `chunkbufferfloor=450`, `chunkbufferceil=1400`, `chunkjitterslack=220`, `chunkadapt=hybrid`, `chunkadaptfloor=420`, `chunkadaptceil=2600` | General low-delay chunked testing. |
| `desktop` | `chunkfec=5`, `chunknack=1`, `chunkbuffer=620`, `chunkbufferfloor=400`, `chunkbufferceil=1100`, `chunkjitterslack=180`, `chunkadapt=bitrate`, `chunkadaptfloor=580`, `chunkadaptceil=4200` | Stronger desktop/low-delay chunked testing. |

These presets are not the same as the long-delay NINJAM profile. For external music-sync work, avoid presets that set small buffer ceilings unless you also override them.

## External sync and NINJAM-style guidelines

For external audio sync, video delay should follow the music app, not VDO.Ninja's automatic latency optimization.

Recommended viewer baseline:

```text
&scene&noaudio&chunkbufferadaptive=0&chunkbufferfloor=0&chunkbufferceil=180000
```

Recommended balanced publisher baseline:

```text
&quality=1&fps=30&chunked=900&chunkbitrate=900&bitrate=900&maxvideobitrate=900&chunkindex=1&chunknack=1&chunknackattempts=8&chunknackdelay=250&chunkchunksize=4096&chunkcache=30000&chunkedbuffer=1500&chunkadapt=bitrate&chunkadaptfloor=300&chunkadaptceil=900
```

Recommended mobile/weak-link publisher baseline:

```text
&quality=2&fps=30&chunked=600&chunkbitrate=600&bitrate=600&maxvideobitrate=600&chunkindex=1&chunknack=1&chunknackattempts=8&chunknackdelay=250&chunkchunksize=4096&chunkcache=30000&chunkedbuffer=1500&chunkadapt=bitrate&chunkadaptfloor=250&chunkadaptceil=600
```

Notes from testing:

* `720p/900 kbps` can stay synchronized in six-publisher TURN/TCP tests, but it may not fully build a 60s safety buffer under heavy relay load.
* `360p/600 kbps` built and held a 60s buffer much more reliably in six-publisher TURN/TCP tests.
* Avoid `1080p` at `900 kbps` for this use case unless you have measured the specific route and machine.
* Mobile participants are likely to be on TURN and variable bandwidth. Start lower, then tune upward.

## Recording with chunked mode

Chunked mode can be useful when the recording path can tolerate more delay than the live conversation path.

For example:

* use a chunked, buffered view for OBS recording
* use a separate normal WebRTC view for lower-latency confidence monitoring
* use `&nochunked` on viewers that should ignore the chunked path

Chunked recordings can be written directly from encoded chunks without a second video encode. This can reduce CPU load and avoid an extra encode generation, but it should be tested before a real session.

## Disabling chunked paths

| Parameter | Description |
| --- | --- |
| `&nochunked` | Viewer-side option to disable the chunked path. |
| `&nochunk` | Alias for `nochunked`. |
| `&nochunkaudio` | Disables chunked audio handling when applicable. |
| `&nochunkedaudio` | Alias for `nochunkaudio`. |

## Compatibility notes

* Chunked mode is primarily intended for recent Chromium-based browsers and runtimes.
* Firefox publishing is disabled and falls back to the regular media path.
* Safari/WebKit publishing is capability-gated and only enabled when the required WebCodecs audio/video and worker track-processing APIs are present.
* Browser codec support varies. If a requested `chunkcodec` fails, VDO.Ninja may fall back to another supported codec.
* This path is more experimental than standard WebRTC RTP video. Test with the real browser/device/network mix before production use.

## Debugging checklist

When testing chunked mode, watch:

* open chunked DataChannels on the publisher
* remote chunked video stats on the viewer
* `buffer_buffer` near the requested target
* `buffer_level` filling and staying near target
* `rebuffering=false` after warmup
* `awaiting_keyframe=false` after recovery
* NACK/FEC counters when impairment is expected
* sender `bufferedAmount` and reliable pause/skip counters under weak peers

If playback stays synchronized but the buffer never fills to target, the selected bitrate/resolution is probably too ambitious for the current mesh/network/CPU load.

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
