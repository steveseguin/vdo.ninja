---
description: Sets the video buffer
---

# \&buffer

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&buffer=500`

| Value           | Description |
| --------------- | ----------- |
| (numeric value) | delay in ms |

## Details

This feature will increase the size of the audio and video _playout delay_ by means of tweaking the webRTC _jitter buffer_ pipeline (or a related buffer).&#x20;

Current VDO.Ninja code clamps normal WebRTC receiver buffer hints to **0-4000 ms**. These are requests to the browser, not a guarantee of the resulting delay or an upper bound on total end-to-end latency. The browser may honor less, add its own buffering, or take time to settle after a change.

While in theory this option can also help to improve video and audio quality, as a larger playback buffer should help reduce the effects of network jitter and packet loss, it's not a miracle solution in this regard. Adding 200-ms of buffer delay using this feature is worth trying however, as some users have reported it has helped improve their connections.

The problem is that the browser doesn't fully make use of the available buffer if set high, and so it's largely used as mainly a hint. Network conditions, memory limits and other factors may impact the results as well. \
\
Older browser versions behaved differently. For current native WebRTC playback, do not rely on a request above 4000 ms producing more video delay. An enabled audio compensation node can still add audio delay, so oversized requests can separate audio from video.

### Keeping audio synchronized when changing the buffer

If audio and video are synchronized initially but separate when you change the buffer, add [`&sync=0`](sync.md) to the **viewer URL before connecting**. This enables a Web Audio delay node that tries to compensate audio as the requested buffer changes, including changes through iframe [`setBufferDelay`](../../guides/iframe-api-documentation/iframe-api-basics.md).

This is a viewer-side setting for normal WebRTC input. `&sync=0` does not require `&buffer2` or chunked mode. Browser buffer changes are approximate and may take time to settle; this is not a frame-accurate playout guarantee.

### Example values

`&buffer=0` requests minimal browser buffering. Add [`&sync=0`](sync.md) separately to enable explicit audio compensation.

`&buffer=100` requests a 100 ms buffer target; it is not necessarily another 100 ms on top of the existing browser delay.

`&buffer=200` can help reduce video problems, such as frame jitter, with 200-ms of added delay.

If the issue is short random packet loss rather than jitter, [`&codec=vp8&vred`](vred.md) is another advanced normal-WebRTC experiment to compare. It does not replace buffering; it only asks negotiation to prefer video RED when the browser supports it.

{% hint style="warning" %}
* This feature will only work if playing the video in Chrome or Chromium-based browsers of around version 80 and newer.
* OBS v27.1.3 or older (on PC) uses v75 though, so you will need to update to OBS 27.2 or newer to use it there.
* The Electron Capture app also supports the `&buffer` command, along with vMix using a compatible Chromium version.
* Using the `&buffer` command may stop [Echo Cancellation](../../source-settings/aec.md) from working due to the audio delay this feature produces.
* Beyond 3-seconds of buffering may cause audio/video sync issues.
{% endhint %}

{% hint style="info" %}
Use [`&sync=0`](sync.md) to enable audio compensation while adjusting the buffer. A nonzero `&sync` value adds an audio offset relative to that compensation. The browser's normal buffering alone may not keep both tracks aligned during changes.
{% endhint %}

## Chunked mode

When using \&buffer with a stream that is being sent using chunked-mode ([\&chunked](../../newly-added-parameters/and-chunked.md)), the method of buffering will be different as it doesn't rely on the built-in system playout webRTC buffer delay function.

Chunked buffering has separate limits: shared audio/video targets are capped at **30000 ms**. The video-only ceiling defaults to **180000 ms** and can be configured with `&chunkbufferceil`; memory, decoding, and actual playback behavior still limit practical use.

As well, the buffering works to buffer the stream, in a way similar to HLS or RTMP buffering.\
\
The default chunked viewer buffer depends on how chunked mode is being used. Plain `&chunked` starts around 3000-ms if no profile or buffer override is used, while `&chunkprofile` presets use lower starting targets. For clearer control with chunked mode, use `&chunkbuffer`, `&chunkbufferfloor`, and `&chunkbufferceil`.

Current shared chunked audio/video buffering is limited to about 30 seconds. Minute-long chunked buffering is therefore best treated as an experimental video-only path; use HLS or an encoded OBS/server workflow when synchronized audio and video must be delayed by minutes.

Please refer to \&chunked mode for more details, but it could be an option if your goal is to improve stream stability under high packet loss. Recent Chromium-based runtimes are the primary target. Firefox publishing is disabled, while Safari/WebKit publishing is enabled only when its complete WebCodecs and worker track-processing stack passes VDO.Ninja's capability checks.

For the separate audio-node capacity and examples of reducing compensation with `&sync=-100`, see [`&sync`](sync.md#negative-sync-reduce-added-audio-delay). Negative buffer values do not provide negative latency; use zero for minimum practical buffering.

## Update in [v23](../../releases/v23.md)

The option to right click a remote video and add/adjust the [`&buffer`](buffer.md) delay for that specific video dynamically.\
![](<../../.gitbook/assets/image (173).png>)

## Related

{% content-ref url="../video-parameters/and-buffer2.md" %}
[and-buffer2.md](../video-parameters/and-buffer2.md)
{% endcontent-ref %}

{% content-ref url="sync.md" %}
[sync.md](sync.md)
{% endcontent-ref %}

{% content-ref url="vred.md" %}
[vred.md](vred.md)
{% endcontent-ref %}

{% content-ref url="../../guides/delay-an-incoming-feed.md" %}
[delay-an-incoming-feed.md](../../guides/delay-an-incoming-feed.md)
{% endcontent-ref %}
