---
description: Enables viewer-side audio sync compensation, with an optional offset in milliseconds
---

# \&sync

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&sync=50`

| Value           | Description |
| --------------- | ----------- |
| (integer value) | value in ms |

## Details

`&sync=X` enables Web Audio compensation on the viewer and adds an optional audio offset in milliseconds. **`&sync=0` enables compensation with no extra fixed offset; it does not disable synchronization.**

This is useful when changing the playback buffer makes video move ahead of or behind audio. The viewer adjusts an audio delay node using the requested buffer and measured audio jitter-buffer delay. A positive value, such as `&sync=50`, requests another 50 ms of audio delay.

[`&buffer`](buffer.md) and iframe `setBufferDelay` request changes to the browser's media buffers. They do not, by themselves, enable this extra Web Audio compensation. In particular, `&buffer=0` is not a substitute for `&sync=0`.

### Adjusting buffers with the iframe API

Add `&sync=0` to the **viewer iframe URL before the stream connects**:

```text
https://vdo.ninja/?view=STREAMID&sync=0
```

Then adjust that stream's buffer with the existing API, in milliseconds:

```javascript
iframe.contentWindow.postMessage({
    setBufferDelay: 500,
    streamID: "STREAMID"
}, "*");
```

The audio compensation follows subsequent buffer changes. This is entirely viewer-side; the publisher does not need a `sync` setting or any changes. It applies to normal WebRTC streams without requiring chunked publishing.

[`&buffer2`](../video-parameters/and-buffer2.md) accounts for estimated network delay in the buffer calculation. It is not required to enable audio compensation. If your wrapper already calculates stream offsets, start with `&sync=0` and use the API for the requested buffer.

### Negative sync: reduce added audio delay

Use a negative value when audio needs less of the extra delay added by the compensation path. For example:

```text
https://vdo.ninja/?view=STREAMID&buffer=500&sync=-100
```

This requests 100 ms less audio compensation than `sync=0`. If the measured native audio jitter-buffer delay is 200 ms, the calculation is `500 - 200 - 100 = 200 ms` of additional audio delay, instead of 300 ms with `sync=0`. The native browser buffer is still managed separately.

The final added audio delay is clamped to zero. If only 50 ms of compensation is available, `sync=-100` can remove that 50 ms; it cannot make audio play another 50 ms earlier. Likewise, negative sync alone with no available added delay cannot advance late audio. Its effect can change as the browser buffer settles.

### Maximum sync and buffer values

These limits apply to different parts of playback:

| Setting | Current limit or behavior |
| --- | --- |
| Normal WebRTC `buffer`, `buffer2`, or iframe `setBufferDelay` | Native receiver hints are clamped to **0-4000 ms**. The browser may deliver a different actual delay; this is not an end-to-end latency cap. |
| `sync` audio compensation | No separate fixed 4000 ms cap. The audio delay node is created with capacity equal to the initial nonnegative sync offset plus the initial audio buffer (or video buffer if no audio buffer is set), plus **5000 ms** of spare capacity. Later adjustments do not enlarge that existing node. |
| Web Audio capacity | The browser API requires a delay-node capacity below 180 seconds. With the extra 5-second allowance, keep the initial positive sync offset plus initial buffer **below 175000 ms** for portability. This is a technical ceiling, not a tested or recommended sync range. |
| Chunked buffering | Separate from these native WebRTC hints: shared audio/video targets are capped at **30000 ms**; video-only targets default to a **180000 ms** ceiling. See [`&buffer`](buffer.md) for the relevant options and limitations. |

For example, `sync=0&buffer=1000` creates an audio compensation node with about 6000 ms of capacity. Loading a larger initial positive `sync` value creates a larger node, but does not extend the native video buffer. Raising the iframe buffer request beyond 4000 ms can therefore delay audio further without making native video follow.

The Web Audio ceiling comes from [`createDelay()`](https://www.w3.org/TR/webaudio-1.0/#dom-baseaudiocontext-createdelay). Large audio-only offsets are not a way to obtain synchronized long-delay WebRTC playback. For ordinary A/V correction, use the smallest offsets needed and test the actual viewer.

### Other limits

* This is an attempt to compensate audio delay, not a guarantee of frame-accurate synchronization. Browser buffering and audio processing need time to adjust, especially when reducing a buffer. A requested zero buffer means minimum practical buffering, not zero end-to-end latency.
* Compensation requires the viewer's Web Audio processing path. Do not combine it with [`&noap`](../../general-settings/noaudioprocessing.md) when relying on this feature.
* The extra audio processing is opt-in; it adds processing and scheduling work, which matters on a heavily loaded viewer with many streams.

`&sync=500` without a video buffer request adds an audio offset without requesting an additional video buffer.

{% hint style="info" %}
Using may stop [Echo Cancellation](../../source-settings/aec.md) from working.
{% endhint %}

## Related

{% content-ref url="buffer.md" %}
[buffer.md](buffer.md)
{% endcontent-ref %}

{% content-ref url="../video-parameters/and-buffer2.md" %}
[and-buffer2.md](../video-parameters/and-buffer2.md)
{% endcontent-ref %}
