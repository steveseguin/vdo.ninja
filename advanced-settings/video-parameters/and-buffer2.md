---
description: Same as &buffer, but instead includes the round-trip-time
---

# \&buffer2

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&buffer2=500`

| Value           | Description |
| --------------- | ----------- |
| (numeric value) | delay in ms |

## Details

`&buffer2=500` requests buffering like [`&buffer`](../view-parameters/buffer.md), while also accounting for an estimate of network transit time. The normal WebRTC calculation subtracts **half the available round-trip time (RTT)** as an estimate of one-way delay. For example, a 200 ms RTT contributes a 100 ms subtraction, not 200 ms. Measured jitter-buffer delay also affects the adjustment, so the requested value is not an exact end-to-end latency guarantee.

The viewer obtains this RTT from the browser's selected ICE candidate-pair statistics. It does not require a custom statistics report from the publisher. If the browser does not expose a usable RTT, the RTT correction cannot be applied.

`&buffer2` does not enable explicit audio sync compensation. If changing the buffer separates audio from video, add [`&sync=0`](../view-parameters/sync.md) to the viewer URL before connecting. This also works with iframe `setBufferDelay`; `&buffer2` is optional. If an external sync system already measures stream offsets, it can use `&sync=0` with the API without adding RTT compensation.

It won't work that well with [Meshcast](../../newly-added-parameters/and-meshcast.md).

Accuracy and settling time depend on the browser and connection. This is not a frame-accurate timing control.

## Related

{% content-ref url="../view-parameters/buffer.md" %}
[buffer.md](../view-parameters/buffer.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/sync.md" %}
[sync.md](../view-parameters/sync.md)
{% endcontent-ref %}
