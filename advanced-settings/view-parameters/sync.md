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

### Limits

* This is an attempt to compensate audio delay, not a guarantee of frame-accurate synchronization. Browser buffering and audio processing need time to adjust, especially when reducing a buffer. A requested zero buffer means minimum practical buffering, not zero end-to-end latency.
* Compensation requires the viewer's Web Audio processing path. Do not combine it with [`&noap`](../../general-settings/noaudioprocessing.md) when relying on this feature.
* The extra audio processing is opt-in; it adds processing and scheduling work, which matters on a heavily loaded viewer with many streams.
* Small negative offsets can reduce an existing added audio delay, but cannot advance audio beyond the available playback data.

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
