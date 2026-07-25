---
description: >-
  How to open VDO.Ninja's statistics panel, what the numbers mean, and how to
  use them to find the actual cause of a quality problem.
---

# The stats panel

Every VDO.Ninja video has a live statistics panel behind it. It is the fastest way to answer the questions that otherwise turn into guesswork: is this a network problem or a CPU problem, is the sender or the receiver at fault, is audio even being sent, and is the bitrate you asked for the bitrate you are getting.

<figure><img src="../../.gitbook/assets/stats-menu/stats-viewer-stream-info.png" alt="The Statistics panel showing the stream ID and the Stream Info section"><figcaption><p>The stats panel on the viewing side. The header stays fixed while the list below it scrolls.</p></figcaption></figure>

## Opening it

**Ctrl + click** on any video (**Cmd + click** on macOS). Ctrl + click the same video again to close it.

There are three other ways in:

* **Right-click a video** and choose *Show Stats* from the context menu.
* **Click the connection readout** in the top-right of the header on a publishing page. That opens your own outbound stats.
* **On a phone or tablet**, tap the video five times in quick succession. Each tap has to land within half a second of the last one, and the sequence resets if you pause.

<figure><img src="../../.gitbook/assets/stats-menu/stats-header-readout.png" alt="Header readout showing connection count, audio streams, video streams and upload bitrate"><figcaption><p>The header readout on a publishing page: connections, outbound audio streams, outbound video streams, and total upload bitrate. Click it to open your stats.</p></figcaption></figure>

Press **Escape** to close the panel, or use the **✕** in its top-right corner.

## There are two different panels

Which panel you get depends on which video you clicked, and they show different things. This trips people up constantly, so it is worth being explicit:

| You clicked | You get | It tells you |
| --- | --- | --- |
| A remote guest's video | [The viewer panel](viewer-stats.md) | What is arriving at **your** machine, and what the sender says about themselves |
| Your own camera preview | [The publisher panel](publisher-stats.md) | What **you** are sending, broken down per connected viewer |

A useful consequence: if a guest looks bad to you, their publisher panel and your viewer panel describe the same connection from opposite ends. Comparing the two is usually what identifies whether the problem is upstream or downstream.

## Panel controls

* **Copy** puts the entire panel on your clipboard as readable text. This is what you want when asking for help — see [asking an AI to read your stats](llm-prompt.md).
* The numbers refresh every 3 seconds by default.
* Refreshing pauses while you are dragging a slider or have text selected inside the panel, so you can select and copy a single value without it disappearing.

Only one panel is open at a time. Ctrl + clicking a second video replaces the panel rather than opening another one, so to compare two guests you need to capture one with **Copy** before switching to the other.

## URL parameters

| Parameter | Effect |
| --- | --- |
| `&stats` | Opens the stats panel automatically as soon as a connection is made |
| `&nostats` or `&stats=0` | Disables the panel entirely, and hides it from the right-click menu |
| `&statsinterval=1000` | Refresh interval in milliseconds. The minimum is 250 |

`&nostats` is worth knowing about for kiosk-style or public-facing scenes, since the panel exposes the machine details of whoever is on the other end.

## The 60-second triage

If you only remember one thing from this guide, remember this table. Open the panel on the **receiving** side and read four numbers.

| What you see | What it usually means | Where to go next |
| --- | --- | --- |
| **Packet Loss** above ~1% | Network congestion or a weak link somewhere on the path | [Diagnosing problems](troubleshooting.md#video-is-blocky-soft-or-keeps-freezing) |
| **Bitrate** far below what you asked for | The sender cannot push more, or is being told not to | [Diagnosing problems](troubleshooting.md#the-bitrate-is-far-lower-than-i-asked-for) |
| **Candidate type** says `relay` | Traffic is going through a TURN relay, adding latency and a bandwidth ceiling | [Diagnosing problems](troubleshooting.md#the-connection-is-using-a-relay) |
| **Quality limited by** says `cpu` | The sender's machine cannot encode fast enough | [Diagnosing problems](troubleshooting.md#cpu-is-the-bottleneck-on-the-sending-side) |

Everything else in the panel is supporting detail for one of those four.

## What "good" looks like

For a healthy 1080p30 connection between two well-connected machines:

```text
Packet Loss           0 %
Round Trip Time       under 100 ms
Candidate type        host or srflx (not relay)
Quality limited by    none
FPS                   within 1-2 of the sender's capture rate
Jitter Buffer Delay   under ~100 ms
Bitrate               close to the target you set
```

None of these are hard thresholds. A 200 ms round trip is completely normal between continents, and 1% packet loss on a cellular uplink is a good day. Read them as a relative picture, and compare against the same stream when it *was* behaving.

## Pages in this guide

* [Reading the viewer panel](viewer-stats.md) — every field on the receiving side
* [Reading the publisher panel](publisher-stats.md) — every field on the sending side
* [Diagnosing problems](troubleshooting.md) — symptom-first recipes
* [Asking an AI to read your stats](llm-prompt.md) — a copy-paste prompt that teaches an LLM what these numbers mean

## Related reading

* [How to control bitrate/quality](../how-do-i-control-bitrate-quality.md)
* [Stable IRL streaming](../irl-streaming-stability.md)
* [Video bitrate for push/view links](../video-bitrate-for-push-view-links.md)
* [Handling guest disconnects and connection recovery](../handling-guest-disconnects-and-connection-recovery.md)
* [`&showconnections`](../../advanced-settings/settings-parameters/and-showconnections.md) — puts the viewer count on the video itself, without opening the panel
* [`&maxconnections`](../../source-settings/and-maxconnections.md) — caps how many viewers a source will accept
