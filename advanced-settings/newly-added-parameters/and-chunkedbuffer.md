---
description: Sender-side backlog control for chunked/WebCodecs publishing.
---

# \&chunkedbuffer

Also known as: `&sendingbuffer`

## Description

Sets the sender-side chunk backlog target, in milliseconds, for [`&chunked`](../../newly-added-parameters/and-chunked.md) publishing.

This is not the viewer playout buffer. It does not directly add receiver delay. Use `&chunkbuffer`, `&chunkbufferfloor`, `&chunkbufferceil`, `&chunkbufferadaptive`, iframe `setBufferDelay`, and `&chunkjitterslack` for viewer-side chunked playback tuning.

## Usage

* If not set, the current base sender backlog target is about 500 ms.
* `&chunkedbuffer` or `&sendingbuffer` without a value falls back to about 5000 ms.
* `&chunkedbuffer=5000` keeps about 5 seconds of chunk backlog on the sender side.
* `&chunkedbuffer=1500` reacts quickly to weak peers and is useful for music-sync/mobile profiles.
* `&chunkedbuffer=3000` to `5000` gives more burst tolerance, but adaptation reacts later.
* `&chunkedbuffer=10000` gives more backlog headroom on unstable links, but can increase memory use and delay down-adaptation.
* `&sendingbuffer=3000` is an alias for the same setting.

## Examples

```text
https://vdo.ninja/?push=streamID&chunked&chunkedbuffer=3000
https://vdo.ninja/?push=streamID&chunked&sendingbuffer=5000
https://vdo.ninja/?room=roomname&chunked=2500&chunkedbuffer=7000
```

## How it works

1. The sender encodes media into chunk payloads.
2. Those payloads are queued for transmission over DataChannels.
3. `&chunkedbuffer` defines the sender pacing/adaptation window.
4. Per-peer relief and bitrate adaptation use this window to decide how much backlog is tolerable.
5. Larger values can tolerate more bursty delivery, while smaller values react sooner when a viewer or route is weak.

## Guidelines

* `1000-2000` ms: lower latency and faster weak-peer relief; good for sync/mobile testing
* `3000-5000` ms: balanced range for many chunked experiments
* `5000-10000` ms: more burst tolerance, but watch memory, queue growth, and adaptation delay

## Notes

* Requires [`&chunked`](../../newly-added-parameters/and-chunked.md)
* Applies on the publishing side
* Higher values use more memory and can allow more sender backlog
* Viewer-side latency is controlled separately
* NACK resend cache is controlled separately with `&chunkcache`; do not use a huge `chunkedbuffer` just to keep retransmission history

## Related Parameters

* [`&chunked`](../../newly-added-parameters/and-chunked.md) - Enables chunked publishing
* [`&chunkbuffer`](../../newly-added-parameters/and-chunked.md) - Viewer playout target for chunked streams
* [`&chunknack`](../../newly-added-parameters/and-chunked.md) - Selective retransmission control
* [`&chunkcache`](../../newly-added-parameters/and-chunked.md) - Sender resend cache window
* [`&retransmit`](../settings-parameters/and-retransmit.md) - Relays chunked streams without transcoding
