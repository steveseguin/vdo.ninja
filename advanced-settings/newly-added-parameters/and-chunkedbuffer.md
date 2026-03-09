---
description: Sender-side backlog control for chunked/WebCodecs publishing.
---

# &chunkedbuffer

Also known as: `&sendingbuffer`

## Description

Sets the sender-side chunk backlog target, in milliseconds, for [`&chunked`](../../newly-added-parameters/and-chunked.md) publishing.

This is not the same as the viewer playout buffer. Use `&chunkbuffer`, `&chunkbufferfloor`, `&chunkbufferceil`, and `&chunkjitterslack` for viewer-side chunked playback tuning.

## Usage

* `&chunkedbuffer=5000` keeps about 5 seconds of chunk backlog on the sender side. This is the current default target.
* `&chunkedbuffer=2000` reduces latency and sender memory usage, but leaves less room for retries.
* `&chunkedbuffer=10000` gives more retry headroom on unstable links, but increases backlog and end-to-end delay.
* `&sendingbuffer=3000` is an alias for the same setting.

## Examples

```text
https://vdo.ninja/?push=streamID&chunked&chunkedbuffer=3000
https://vdo.ninja/?push=streamID&chunked&sendingbuffer=5000
https://vdo.ninja/?room=roomname&chunked=2500&chunkedbuffer=7000
```

## How it works

1. The sender encodes media into chunk payloads.
2. Those payloads are queued for transmission over data channels.
3. `&chunkedbuffer` defines how much queued media the sender tries to keep available.
4. Larger values give FEC/NACK/retry logic more time to recover missing data before the backlog runs dry.

## Guidelines

* `1000-2000` ms: lower latency, better only on strong links
* `3000-5000` ms: balanced range for most testing
* `5000-10000` ms: more resilient on lossy or high-RTT paths

## Notes

* Requires [`&chunked`](../../newly-added-parameters/and-chunked.md)
* Applies on the publishing side
* Higher values use more memory and increase overall delay
* Viewer-side latency is still controlled separately

## Related Parameters

* [`&chunked`](../../newly-added-parameters/and-chunked.md) - Enables chunked publishing
* [`&chunkbuffer`](../../newly-added-parameters/and-chunked.md) - Viewer playout target for chunked streams
* [`&retransmit`](../settings-parameters/and-retransmit.md) - Relays chunked streams without transcoding
