---
description: >-
  VDO.Ninja chunked and WebCodecs publishing mode for higher-control video
  delivery, recording workflows, buffering, FEC, retransmissions, and advanced
  transport tuning.
---

# \&chunked WebCodecs publishing mode

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Options

Example: `&chunked=2500`

| Value | Description |
| --- | --- |
| (no value) | Enables chunked/WebCodecs publishing using the default target bitrate. |
| (integer value) | Target video bitrate in kbps. Example: `2500` = about 2.5 Mbps. |

## Presets and reliability controls

| Parameter | Values | Description |
| --- | --- | --- |
| `&chunkprofile` | `mobile` \| `balanced` \| `desktop` | Applies a preset for bitrate, buffer, and recovery defaults. |
| `&chunkedbuffer` / `&sendingbuffer` | ms | Sender-side chunk backlog target. Default is about `5000`. |
| `&chunkbuffer` | ms | Viewer-side chunk playout target. |
| `&chunkbufferfloor` / `&chunkbufferceil` | ms | Adaptive playout floor and ceiling for chunked viewers. |
| `&chunkjitterslack` | ms | Extra headroom before chunked playback rebuffers. |
| `&chunkadapt` | `bitrate` \| `framerate` \| `hybrid` | Buffer-aware adaptation mode. |
| `&chunkadaptfloor` / `&chunkadaptceil` | integer | Min/max clamp for the chosen adaptation mode. |
| `&chunkadaptthreshold` | ms | Buffer threshold that starts adaptation. |
| `&chunkadaptmaxdrop` | percent | Maximum per-step adaptation drop. |
| `&chunkadaptinterval` | ms | Minimum time between adaptation changes. |
| `&chunkfec` | integer | Enables parity FEC. Example: `4` means one parity packet per four data chunks. |
| `&chunknack=1` | `1` | Enables selective retransmission requests for missing chunks. |

## Details

`&chunked` switches video publishing from the browser's normal RTP video path to a custom chunked transport built on WebRTC data channels. The sender uses encoded output, slices it into chunks, and sends those chunks directly to viewers.

This mode is useful when you want tighter control over bitrate, buffering, recording, or recovery behavior than the normal browser-managed RTP path allows. It is especially relevant for recording-first workflows, high-quality one-to-many publishing, and experimentation with FEC/NACK/buffer adaptation.

### Important behavior notes

* `&chunked` is a sender flag. If present without a valid number, VDO.Ninja still enables chunked mode and uses the default chunked bitrate target.
* Sender-side backlog is controlled with [`&chunkedbuffer`](../advanced-settings/newly-added-parameters/and-chunkedbuffer.md), not with viewer [`&buffer`](../advanced-settings/view-parameters/buffer.md).
* Viewer playout behavior is controlled with `&chunkbuffer`, `&chunkbufferfloor`, `&chunkbufferceil`, and `&chunkjitterslack`.
* Chunked mode can be used with [`&retransmit`](../advanced-settings/settings-parameters/and-retransmit.md) for chunked relay workflows.
* `&nochunked` disables the chunked path, and `&nochunkaudio` disables the chunked audio portion when applicable.

### Why use it

* Better control over bitrate and queueing than the normal RTP path
* Better fit for direct-to-disk recording of encoded chunks
* Supports chunk-level recovery options such as parity FEC and NACK-based retransmits
* Can be relayed without transcoding in supported workflows

### Tradeoffs

* This path is more experimental than standard WebRTC RTP video
* It depends heavily on modern Chromium-class browser support
* It introduces explicit buffering and can pause to recover instead of degrading as gracefully as RTP in some cases
* It is not the default behavior and should be treated as an opt-in transport mode

### Compatibility notes

* Chunked mode is primarily intended for recent Chromium-based browsers and related runtimes.
* It is still a moving target, especially around browser codec support, alpha-channel support, and advanced recovery behavior.
* If using `&alpha` with `&chunked`, encoder availability still depends on the browser/runtime.

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
