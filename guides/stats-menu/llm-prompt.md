---
description: >-
  A copy-paste prompt that teaches Claude, ChatGPT or any other LLM what
  VDO.Ninja's stats fields mean, so it can troubleshoot your stream properly.
---

# Asking an AI to read your stats

Pasting a raw stats dump into an LLM usually produces confident nonsense. The field names look like generic WebRTC statistics but several of them are VDO.Ninja-specific, and a few mean close to the opposite of what a model will assume — most importantly, that raising the bitrate is the wrong response to packet loss.

The prompt below supplies that missing context. Paste it, then paste your stats underneath.

## Before you paste: redact these

The **Copy** button captures the panel exactly as shown, which can include:

* **IP addresses** — `Local relay IP` and `Remote relay IP` appear when the connection is going through a TURN relay.
* **Machine fingerprints** — user agent, GPU model, CPU core count, for both you and the person at the other end.
* **Guest labels** — real names, if that is what you use for `&label`.
* **Your stream IDs** — anyone with a stream ID can attempt to view or push to it, unless you are using a password.

Replace anything sensitive with `REDACTED` before sharing. The diagnosis does not depend on any of it.

## The prompt

````text
You are helping me troubleshoot a live video stream sent with VDO.Ninja, a
peer-to-peer WebRTC streaming tool. I am going to paste the contents of its
statistics panel. Read it using the following context.

WHICH PANEL IS THIS
There are two panels and they mean different things:
- A VIEWER panel starts with "StreamID:" followed by a "Stream info" section.
  It describes what is ARRIVING at the person who captured it. Critically, the
  "Stream info" section is self-reported by the REMOTE SENDER: the CPU, GPU,
  OS, browser and battery listed there belong to the sender, not the person
  who captured the dump.
- A PUBLISHER panel lists "Outbound connections" and then repeats a block per
  connected viewer, each headed "Viewer: <name>". It describes what is BEING
  SENT. Each viewer block is a separate encode with its own limits.
If both panels are pasted, they are the two ends of the same connection and
should be cross-referenced rather than analysed separately.

FIELD MEANINGS
- Packet Loss: percentage of packets that never arrived. Under 1% is fine.
- NACKs sent / NACKs per second: requests to resend a lost packet. Some is
  normal; sustained growth means real loss on the path.
- Keyframes requested (PLI): the receiver gave up recovering and asked for a
  full refresh. Climbing PLI means loss is bad enough that retransmission is
  not keeping up. Visually: freeze, then snap back into focus.
- Jitter Buffer Delay: delay added by the receiver to smooth uneven arrival.
  Rising jitter with zero loss means packets are arriving LATE, not lost.
- Round Trip Time: network latency. Stability matters more than absolute
  value; 200ms intercontinental is normal, a number that swings is not.
- Candidate type (Local and Remote): "host" = same local network, "srflx" =
  direct across the internet through NAT, "relay" = going through a TURN
  relay server, which adds latency and imposes a bandwidth ceiling. If either
  end says relay, the whole connection is relayed.
- Available outgoing bitrate: what the congestion controller believes the
  uplink can carry. If the actual video bitrate is close to this, the sender
  is at its genuine ceiling.
- Quality limited by: why the encoder is holding back. Values: none,
  bandwidth, cpu, resolution. This single field usually decides the diagnosis.
- Scale factor / Requested resolution: VDO.Ninja deliberately asks senders for
  a resolution matching how large the video is drawn on the viewer's display,
  in device pixels. A downscaled stream is usually intentional bandwidth
  optimisation, NOT a fault.
- Mic level (sent): audio level reaching the encoder, 0 to 1. Zero means the
  microphone is producing silence and nothing downstream can fix it.
- Audio Level: received audio loudness, 0 to 1.
- Capture settings vs Resolution: what the camera produces vs what is actually
  being encoded for a given viewer. They differ when scaling is applied.
- Video init width/height/frameRate: what the SENDER asked their camera for,
  not what is currently being sent.
- A missing "Audio track" or "Video track" section means that track is not
  being received at all. Absence is a finding, not missing data.
- A "⚠️" next to a bitrate means the track exists but nothing is flowing.
- Reliability counters: internal recovery telemetry. Almost all zero is
  normal. A few "Ice candidate error 701" entries are harmless. Sustained
  growth in "Peer recovery attempts" or "Media stall restarts" indicates an
  unstable connection rather than a merely slow one.

INTERPRETATION RULES
1. Raising the bitrate is the WRONG response to packet loss. More data on a
   lossy path causes more retransmission and more loss. Recommend lowering
   bitrate, resolution or framerate instead.
2. When "Quality limited by" is cpu, bitrate changes will not help. Reducing
   framerate helps more than reducing resolution. Switching to H.264 often
   enables hardware encoding.
3. When "Quality limited by" is bandwidth AND video bitrate is close to
   available outgoing bitrate, the congestion controller is correct and a
   higher target is counterproductive.
4. If several viewers show problems but one does not, the problem is on the
   affected viewer's path, not the sender's uplink. If all viewers show the
   same limit simultaneously, it is the sender's uplink.
5. Do not treat a downscaled resolution as a fault without first checking
   Requested resolution and Scale factor.
6. Distinguish "degraded" from "flapping": Time active resetting repeatedly,
   or climbing Peer recovery attempts, means the connection is dropping and
   rebuilding, which needs a different fix from mere congestion.
7. Battery and thermal state matter for phone senders. Check Power level and
   Plugged in before recommending settings changes.

WHAT I WANT BACK
1. One sentence: what is actually wrong.
2. Which end the problem is on (sender, receiver, or the network between).
3. The specific numbers in the dump that support that conclusion.
4. Concrete next steps, most likely to help first. Use VDO.Ninja URL
   parameters where relevant.
5. Anything you would need to see to be more certain, including whether you
   need the other end's stats panel.

If the data does not support a confident conclusion, say so and tell me what
to capture next. Do not invent values that are not in the dump.

Here are my stats:

[PASTE YOUR STATS HERE]
````

## Add your context

The prompt works better if you also tell it what you are actually doing. Add a couple of lines before your stats:

```text
Setup: publishing from a phone on 5G, viewed in OBS on a wired desktop.
Symptom: video freezes for about a second every 30 seconds, audio is fine.
My push link: https://vdo.ninja/?push=XXXX&quality=1&codec=h264
My view link: https://vdo.ninja/?view=XXXX&buffer=500
```

Setup, symptom and both URLs answer most of the follow-up questions an LLM would otherwise have to ask.

## Short version

If you just want a quick read and do not need the full glossary:

```text
This is a stats dump from VDO.Ninja, a peer-to-peer WebRTC streaming tool.
Notes: the "Stream info" section describes the remote sender's machine, not
mine. "Quality limited by" says why the encoder is holding back. Raising
bitrate is the wrong response to packet loss. Downscaled resolution is usually
intentional bandwidth optimisation, not a fault.
Tell me what is wrong, which end it is on, and what to change.

[PASTE YOUR STATS HERE]
```

## Capturing both ends

Most of the harder cases are only decidable by comparing sender and receiver, so capture both where you can:

1. On the sending machine, Ctrl + click your own camera preview, press **Copy**.
2. On the receiving machine, Ctrl + click the incoming video, press **Copy**.
3. Label them clearly — `--- PUBLISHER ---` and `--- VIEWER ---` — before pasting.

An LLM given both ends can tell you whether the loss is happening on the upload or the download, which is the question that decides almost everything else.

## Next

* [Diagnosing problems](troubleshooting.md) — the same reasoning, done by hand
* [Reading the viewer panel](viewer-stats.md) and [the publisher panel](publisher-stats.md) — full field references
