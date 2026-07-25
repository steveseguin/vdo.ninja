---
description: >-
  Symptom-first recipes for using VDO.Ninja's stats panel to find the real cause
  of quality, audio, and connection problems.
---

# Diagnosing problems with the stats panel

Each section below starts from something you can actually observe, tells you which numbers to read, and says what to change. Open the panel on **both** ends where you can — most wrong diagnoses come from looking at only one side.

## Video is blocky, soft, or keeps freezing

**Read, on the receiving side:** `Packet Loss`, `NACKs sent`, `Keyframes requested (PLI)`, `Jitter Buffer Delay`.

| Reading | Diagnosis | Action |
| --- | --- | --- |
| Loss 0%, rising PLI | Not a loss problem. The decoder is losing sync for another reason | Have the sender press **Send Keyframe to Viewers** |
| Loss under 1%, NACKs recovering it | Normal. Retransmission is doing its job | Nothing |
| Loss 1–5%, PLIs climbing | Congestion. Retransmission is not keeping up | Lower the bitrate, add `&buffer=500`, drop resolution or framerate |
| Loss above 5% | The path cannot carry what you are sending | Drop to a much lower profile — see [stable IRL streaming](../irl-streaming-stability.md) |
| Loss 0% but jitter buffer climbing | Packets are arriving late rather than being lost | Usually an overloaded network or a wireless link. Wired connection, or add buffer |

The counter-intuitive one: **raising the bitrate when you have packet loss makes it worse.** More data on a path that is already dropping packets means more retransmissions, more keyframes, and more loss. If loss is high, go down, not up.

## The bitrate is far lower than I asked for

**Read, on the sending side:** `Available outgoing bitrate`, `Quality limited by`, `Scale factor`.

The order to check:

1. **`Quality limited by` says `bandwidth`** — compare `Video bitrate` to `Available outgoing bitrate`. If they are close, you have hit the real ceiling of your upload and the congestion controller is correct. A higher target will not help.
2. **`Quality limited by` says `cpu`** — see [CPU is the bottleneck on the sending side](#cpu-is-the-bottleneck-on-the-sending-side) below.
3. **`Quality limited by` says `none` but the bitrate is still low** — nothing is holding you back, so the target itself is the limit. Check your `&videobitrate` / `&maxvideobitrate` settings and, in rooms, the room's own bitrate rules.
4. **`Scale factor` is below 100%** — the frame is being downscaled. In VDO.Ninja this is usually deliberate: the viewer requested a smaller size because the video is drawn small on their screen.

Then check the receiving side: if the viewer's `Requested resolution` is small, the sender is being asked for a small stream and is doing exactly what it was told. That is the bandwidth optimisation working, not a fault. Use `&scale` on the view link if you need to force it larger.

See [how to control bitrate/quality](../how-do-i-control-bitrate-quality.md) for the parameters themselves.

## Nobody can hear me, or a guest has no audio

This is where the panel saves the most time, because it splits one vague symptom into four distinct causes.

**On the sending side**, read `Mic level (sent)` and `Audio bitrate`:

| Reading | Cause |
| --- | --- |
| `Mic level (sent)` is 0 | The microphone is producing silence. Wrong device, muted at the OS, or a virtual cable with nothing feeding it. Nothing downstream can fix this |
| `Mic level (sent)` is healthy, `Audio bitrate` is 0 ⚠️ | Audio is being captured but not transmitted to that viewer |
| Both healthy | You are sending audio correctly. The problem is on the receiving end |
| No `Audio bitrate` row at all for a viewer | No audio track was negotiated with them — check whether that viewer used `&noaudio` |

<figure><img src="../../.gitbook/assets/stats-menu/stats-warning-dead-audio.png" alt="Publisher panel showing Audio bitrate flagged with a warning triangle at 0 kbps"><figcaption><p>A ⚠️ next to a bitrate means the track exists but nothing is moving through it. Hover it for the explanation.</p></figcaption></figure>

**On the receiving side**, look for the *Audio track* section:

* **No Audio track section at all** — nothing is arriving. Go back to the sender.
* **Section present, `Bitrate` healthy, `Audio Level` at 0** — the sender is transmitting silence.
* **Section present, `Audio Level` moving** — audio is arriving fine and the problem is local: output device, browser volume, or the stream being muted in your scene.

## The connection is using a relay

**Read:** `Candidate type - Local` and `Candidate type - Remote`, on either side.

`relay` (shown as `💸 relay server`) means the connection could not be made directly and is being carried through a TURN server. Consequences: extra latency, a bandwidth ceiling imposed by the relay, and cost.

If you also see `⚠️ You're blocking` or `⚠️ They're blocking`, a browser or system setting at that end is actively preventing direct connections — often a VPN, a privacy extension, or a corporate network policy.

What to try, in order:

1. Disable VPNs and WebRTC-blocking browser extensions at both ends.
2. Get at least one end off a restrictive network (mobile hotspot is a quick test).
3. If relay is unavoidable, plan for it: lower your bitrate target, since relays are shared infrastructure.

`host` on both ends means you are on the same local network. `srflx` means a direct connection through NAT, which is the normal good result across the internet.

## CPU is the bottleneck on the sending side

**Read:** `Quality limited by` = `cpu`, plus `CPU`, `GpGPU` and `Power level` in the sender's info.

The encoder cannot keep up. Bitrate changes will not help. In rough order of effectiveness:

1. Lower the **framerate** before lowering resolution — encoding cost scales hard with fps.
2. Switch codec. H.264 usually has hardware encoding available where VP8/VP9 do not. See [hardware-accelerated video encoding](../hardware-accelerated-video-encoding.md).
3. Reduce the number of viewers pulling directly from that sender. Every viewer is a separate encode.
4. Close other applications, and check `Power level` — a laptop on battery often throttles aggressively.

For phone guests, also check `Plugged in`. A hot or low phone will throttle no matter what settings you use.

## The connection keeps dropping and re-establishing

**Read:** `Time active` on the receiving side, and the `Reliability counters` on the sending side.

`Time active` resetting to zero repeatedly is the clearest signal that the connection is flapping rather than merely degraded. On the sending side, watch whether `Peer recovery attempts` and `Media stall restarts` climb during the session.

If they do, the network path is unstable rather than merely slow. `&autorecover` and a lower, more conservative bitrate profile will do more than any quality setting. See [handling guest disconnects](../handling-guest-disconnects-and-connection-recovery.md).

## Video is fine but badly out of sync with audio

**Read:** `Jitter Buffer Delay` on both tracks, and `Total Playout Delay` if you are using `&buffer`.

Audio and video have independent jitter buffers, and a large gap between the two is the usual cause of drift. [`&buffer`](../../advanced-settings/view-parameters/buffer.md) on the viewer sets a target playout delay for both tracks, which trades a little latency for sync. If audio specifically needs a different target, [`&bufferaudio`](../../advanced-settings/audio-parameters/and-bufferaudio.md) overrides it for the audio track alone.

Note that `Total Playout Delay` does **not** include Bluetooth headphone latency, monitor delay, or capture-card delay. If the numbers look right and it still sounds wrong, suspect the hardware after the browser.

## What to do when none of this helps

Use the **Copy** button and share the output. Both panels if you can — sender and receiver — since almost every remaining case is decided by comparing the two ends.

* [Asking an AI to read your stats](llm-prompt.md) — a prompt that gives an LLM the context to interpret the dump
* The [VDO.Ninja Discord](https://discord.vdo.ninja) — include both stats dumps and your full URLs, with any sensitive parts redacted
