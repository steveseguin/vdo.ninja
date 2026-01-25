---
description: Enables a preset of settings optimized for ultra-low latency streaming
---

# \&lowlatency

General Option! ([`&push`](../source-settings/push.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&room`](../general-settings/room.md))

## Aliases

* `&ll`
* `&ultralow`

## Details

The `&lowlatency` parameter applies a collection of settings designed to minimize end-to-end latency in VDO.Ninja streams. It targets audio processing delays, packet timing, buffering, and WebAudio pipeline overhead.

This is ideal for:
- Musicians needing ultra-low latency for remote jamming
- IEM (in-ear monitor) applications
- Real-time audio monitoring scenarios
- Any use case where minimizing delay is critical

### What it configures

| Setting | Value | Effect |
| --- | --- | --- |
| `echoCancellation` | `false` | Removes ~30-50ms processing delay |
| `autoGainControl` | `false` | Removes ~10-20ms processing delay |
| `noiseSuppression` | `false` | Removes ~10-20ms processing delay |
| `ptime` | `10` | 10ms audio packets (vs 20ms default) |
| `minptime` | `10` | Minimum 10ms packets |
| `maxptime` | `20` | Caps packet growth |
| `noFEC` | `true` | No forward error correction overhead |
| `cbr` | `1` | Constant bitrate (predictable timing) |
| `buffer` | `0` | Minimal jitter buffer |
| `audioBuffer` | `0` | Minimal audio buffer |
| `sync` | `0` | No A/V sync delay |
| `disableWebAudio` | `true` | Bypasses WebAudio pipeline |
| `audioLatency` | `10` | 10ms AudioContext latency hint |

### Override behavior

All settings applied by `&lowlatency` can be individually overridden by explicit URL parameters. The explicit parameter takes precedence:

```
&lowlatency&buffer=100   → uses buffer=100, not 0
&lowlatency&aec=1        → enables echo cancellation
&lowlatency&vbr          → uses VBR instead of CBR
```

This allows you to use `&lowlatency` as a baseline and fine-tune specific settings as needed.

## Usage examples

```
?lowlatency&push=xxx                    # Basic low-latency push
?ll&proaudio&push=xxx                   # Low-latency + stereo audio
?ultralow&codec=pcm&push=xxx            # Ultra-low with PCM (higher bandwidth)
?ll&view=xxx&novideo                    # Low-latency audio-only viewing
```

{% hint style="warning" %}
Since echo cancellation is disabled, **headphones are required** to prevent feedback loops. Without headphones, the remote audio will be picked up by your microphone and sent back.
{% endhint %}

{% hint style="info" %}
For the absolute lowest latency, consider combining `&lowlatency` with:
- [`&novideo`](../advanced-settings/video-parameters/and-novideo.md) to eliminate video sync overhead
- [`&codec=pcm`](../advanced-settings/view-parameters/codec.md) for uncompressed audio (requires more bandwidth)
- A wired Ethernet connection (Wi-Fi adds latency variability)
- [Electron Capture](../steves-helper-apps/electron-capture.md) for playback, which now supports ASIO audio devices on Windows for even lower audio latency
{% endhint %}

## Technical background

WebRTC audio processing (echo cancellation, auto-gain, noise suppression) introduces processing delays. The browser's jitter buffer adds additional delay to smooth out network variations. The WebAudio API pipeline can add further latency.

By disabling these features and minimizing buffers, `&lowlatency` can achieve significantly lower end-to-end latency at the cost of:
- Requiring headphones (no echo cancellation)
- Potentially more audio glitches on unstable connections (smaller buffers)
- Less tolerance for network jitter (no FEC, minimal buffering)

### References

For more technical background on WebRTC latency optimization:
- [Reducing Latency in WebRTC](https://bloggeek.me/reducing-latency-webrtc/)
- [CBR vs VBR](https://antmedia.io/cbr-vs-vbr/)
- [WebRTC Media Resilience](https://bloggeek.me/webrtc-media-resilience/)

## Related

{% content-ref url="../guides/lowest-audio-latency-possible.md" %}
[lowest-audio-latency-possible.md](../guides/lowest-audio-latency-possible.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/buffer.md" %}
[buffer.md](../advanced-settings/view-parameters/buffer.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/sync.md" %}
[sync.md](../advanced-settings/view-parameters/sync.md)
{% endcontent-ref %}

{% content-ref url="and-audiolatency.md" %}
[and-audiolatency.md](and-audiolatency.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/and-ptime.md" %}
[and-ptime.md](../advanced-settings/view-parameters/and-ptime.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/audio-parameters/and-proaudio.md" %}
[and-proaudio.md](../advanced-settings/audio-parameters/and-proaudio.md)
{% endcontent-ref %}
