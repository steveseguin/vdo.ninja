---
description: >-
  A copy-paste prompt that teaches Claude, ChatGPT or any other LLM what
  VDO.Ninja's stats fields mean, so it can troubleshoot your stream properly.
---

# Asking an AI to read your stats

A raw stats dump pasted into an LLM often gets a confident but wrong answer. Some fields are specific to VDO.Ninja, and models tend to suggest a higher bitrate for packet loss, which makes it worse. Paste the prompt below, then your stats under it.

## Before you paste: redact these

The **Copy** button captures the panel as shown, which can include:

* **IP addresses:** `Local relay IP`, `Remote relay IP` and relay URLs, when a TURN relay is used.
* **Device details:** user agent, GPU, CPU cores and OS, for both ends.
* **Labels:** real names, if you use them in `&label`.
* **Location:** `Lat` and `Lon`, if the sender shares location.
* **Stream IDs:** anyone with one may be able to view the stream unless you use a password.

Replace anything sensitive with `REDACTED`; the diagnosis does not need it.

## The prompt

````text
Help me troubleshoot a live stream sent with VDO.Ninja, a peer-to-peer WebRTC
tool. Below is text copied from its stats panel. Section headings are in
[square brackets]; rows are "Label: value".

WHICH PANEL
Both panels start with "StreamID:".
- VIEWER panel: sections like [Stream info], [Peer-to-peer connection],
  [Video track], [Audio track]. Shows what ARRIVES at the person who copied
  it. [Stream info] is reported by the REMOTE SENDER: its CPU, GPU, OS,
  browser and battery belong to the sender.
- PUBLISHER panel: "Outbound connections", then one [Viewer: <name>] block
  per viewer, each with [Remote Peer Info], then [Reliability counters].
  Shows what is SENT. Each viewer is a separate encode with its own limits.
If both are pasted, they are two ends of one connection; compare them.

FIELDS
- Packet Loss: loss in the latest sample. A low value does not rule out an
  earlier burst.
- NACKs sent / NACKs per second: resend requests. Sustained growth means lost
  packets. Retransmitted: bandwidth spent resending.
- Keyframes requested (PLI) / Keyframe requests (PLI): picture refresh
  requests. Loss, startup or decoder resets can cause them; a PLI alone does
  not prove loss.
- Jitter Buffer Delay: receiver delay to smooth uneven arrival; rising means
  less even arrival.
- DecodeLatencyMs: receiver's decode time per frame; high means a slow
  receiving computer.
- Round Trip Time / Average round trip time: latency. Stability matters more
  than the value.
- Candidate type - Local / Remote: host = local interface, srflx = public
  address via STUN, relay ("relay server") = TURN. Any relay means TURN.
- Available outgoing bitrate: the browser's estimate of path capacity, not a
  measured limit.
- Quality limited by: none, bandwidth, cpu or other. "none" means nothing is
  held back right now, not that the bitrate target is met.
- Video encoder / Hardware video encoder: ExternalEncoder and
  MediaFoundationVideoEncodeAccelerator are hardware encoders.
- Scale factor / Requested resolution: VDO.Ninja asks for the size the video
  is drawn on the viewer's screen, in device pixels. Downscaling is usually
  intentional, NOT a fault.
- Capture settings vs Resolution: what the camera produces vs what is encoded
  for a viewer.
- Video init width/height/frameRate: what the sender asked the camera for,
  not what is sent now.
- Mic level (sent): level reaching the sender's encoder, 0 to 1. Zero while
  speaking means the mic feeds silence. Audio Level: received loudness.
- A missing [Audio track] or [Video track] means that track is not received.
- A warning sign next to a bitrate means the track exists but nothing flows.
- Reliability counters: mostly zero is normal; a few "Ice candidate error
  701" are harmless. Steady growth in "Peer recovery attempts" or "Media
  stall restarts" means an unstable connection.

RULES
1. Never recommend more bitrate for packet loss. Recommend lower bitrate,
   resolution or frame rate.
2. If Quality limited by is cpu, more bitrate will not help. Lower frame rate
   or resolution; H.264 often enables hardware encoding.
3. If it is bandwidth and video bitrate is near available outgoing bitrate,
   the path is full.
4. If only some viewers have problems, look at their paths. If all show the
   same limit, check the sender first. Neither proves the exact segment.
5. Check Requested resolution and Scale factor before calling a small
   resolution a fault.
6. Time active resetting or Peer recovery attempts climbing means the
   connection keeps dropping, which needs a different fix from congestion.
7. For phone senders, check Power level and Plugged in.

ANSWER WITH
1. One sentence: what is wrong.
2. Which end: sender, receiver or the network between.
3. The numbers that support it.
4. Next steps, most likely first, with VDO.Ninja URL parameters if relevant.
5. What else you need to be sure, such as the other end's stats.
If the data is not enough, say so. Do not invent values.

My stats:

[PASTE YOUR STATS HERE]
````

## Add your context

Put a few lines before your stats:

```text
Setup: publishing from a phone on 5G, viewed in OBS on a wired desktop.
Symptom: video freezes for about a second every 30 seconds, audio is fine.
My push link: https://vdo.ninja/?push=XXXX&quality=1
My view link: https://vdo.ninja/?view=XXXX&codec=h264&buffer=500
```

## Short version

```text
This is a stats dump from VDO.Ninja, a peer-to-peer WebRTC streaming tool.
[Stream info] describes the remote sender's device, not mine. "Quality
limited by" says why the encoder is holding back. More bitrate is the wrong
fix for packet loss. Downscaled resolution is usually intentional.
Tell me what is wrong, which end it is on, and what to change.

[PASTE YOUR STATS HERE]
```

## Capturing both ends

1. On the sending computer, Ctrl + click your own preview and click **Copy**.
2. On the receiving computer, Ctrl + click the incoming video and click **Copy**.
3. Paste both, labelled `--- PUBLISHER ---` and `--- VIEWER ---`.

Both ends let the model compare what was sent with what arrived. They still cannot show where on the path loss happened.

## Next

* [Diagnosing problems](troubleshooting.md): the same reasoning, done by hand
* [Reading the viewer panel](viewer-stats.md) and [the publisher panel](publisher-stats.md): full field references
