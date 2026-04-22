---
description: Troubleshooting guide for crackling, robotic, distorted, or broken audio in the outbound OBS stream when VDO.Ninja sounds clean locally.
---

# Outbound OBS stream audio is crackling

If the VDO.Ninja call sounds clean to everyone in the room, but your stream audience hears crackling, robotic voices, static, pitch changes, or otherwise broken audio — this page is for you.

If the call itself already sounds bad inside VDO.Ninja, the fix is different — start with [Audio Clicking / Popping / Distortion](audio-clicking-popping-distortion.md) instead. When the call is clean but the live stream is not, the problem is almost always somewhere in the OBS audio path: browser source audio, audio monitoring, Windows audio capture, virtual audio routing, Wave Link, a capture card, or an OBS source that has quietly started buffering badly.

## Quick live-show fixes

If you're already on-air, try these first. They won't fix the root cause, but they can often get you through the next few minutes:

1. In OBS, right-click the affected browser source and select **Properties**, then click **Refresh cache of current page** or **Refresh**.
2. If only one source is bad, hide/show that source, or deactivate/reactivate it if it has a deactivate option.
3. If all guest audio is bad, switch to a backup audio route if you have one, such as [Electron Capture](https://electroncapture.app/), Wave Link, a [virtual audio cable](https://vb-audio.com/Cable/), or a second browser.
4. Stop monitoring the affected source in OBS if you do not need to hear it through OBS. Go to **Advanced Audio Properties** and set **Audio Monitoring** to **Monitor Off** for the noisy source.
5. If OBS logs show max audio buffering, fully restart OBS after the segment or during a break. In many cases the source does not recover cleanly by itself.
6. If the audio path goes through Wave Link, Voicemeeter, a capture card utility, or another audio mixer, restart that app too.

None of these are a permanent fix. They mostly help confirm that the problem lives in your local OBS or audio routing chain, not in a remote guest's microphone.

## First, figure out where the crackle starts

Before you change a bunch of settings, pin down where the audio first goes bad. The right fix depends heavily on where the problem originates.

### The VDO.Ninja room sounds clean

If everyone sounds normal inside VDO.Ninja but the OBS stream or recording sounds bad, the culprit is on your machine — OBS, Windows, Wave Link, a virtual audio cable, or one of your capture sources.

Remote guests are very unlikely to be the root cause here. A guest on Wi-Fi or a flaky Bluetooth headset might sound rough in the call, but that won't make *every* guest sound bad only on the outbound OBS stream.

### OBS monitoring sounds clean, but the stream is bad

If the audio sounds fine in your headphones but the audience hears crackling, check:

* OBS recording or stream output
* audio filters on the source
* Application Audio Capture
* capture-card audio
* Wave Link Stream Mix
* OBS log messages about audio buffering

A quick test: make a short local OBS recording while the issue is happening. If that recording also sounds bad, the problem is happening *before* the stream leaves OBS — not on the network.

### OBS monitoring is also bad

If the audio sounds bad even in your own headphones through OBS monitoring, check:

* OBS monitoring device
* "Control audio via OBS"
* Wave Link monitor mix
* virtual cable buffer size
* sample-rate mismatch
* audio enhancements or surround sound

## Check the OBS log

The OBS log is usually the fastest way to see what's actually happening. After a bad session, open OBS and go to **Help** → **Log Files** → **Upload Current Log File**. You can paste the resulting URL into the OBS log analyzer for a quick readout:

[https://obsproject.com/tools/analyzer](https://obsproject.com/tools/analyzer)

Look for lines like:

```text
Max audio buffering reached!
Source <name> audio is lagging ... at max audio buffering. Restarting source audio.
adding ... milliseconds of audio buffering
```

If you see these, OBS is struggling to keep that audio source in time. Common causes: CPU/GPU pressure, a flaky device driver, a misbehaving capture source, an overloaded browser source, a sample-rate mismatch, a slow filter, or a source that stopped delivering audio evenly.

While you're in the log, also check for:

* mismatched sample rates — for example, a device at 44100 Hz while OBS runs at 48000 Hz
* sources listed more than once — for example, Desktop Audio captured globally *and* as a scene source
* old or incompatible plugins
* repeated device disconnects
* audio filters reporting errors

## Fix sample rates first

Sample-rate mismatches are one of the easiest mistakes to make and one of the hardest to notice until they're causing real problems. When a device feeds audio at one rate into something that expects another, the system has to resample on the fly — and that's a common source of crackle, pitch drift, and robotic audio.

Aim for 48000 Hz everywhere:

* OBS: **Settings** → **Audio** → **Sample Rate** → `48 kHz`
* Windows playback device: **Sound Settings** → device → **Format** → `48000 Hz`
* Windows recording device: same as above
* Wave Link: use `48 kHz`, not `96 kHz`, unless you're certain every plugin and device in the chain supports it
* virtual audio cable: set it to `48000 Hz`
* audio interfaces and capture cards: `48000 Hz`

Stick to 16-bit or 24-bit audio. Avoid 32-bit, 96 kHz, 192 kHz, and 384 kHz for a live OBS setup unless you have a specific reason.

Also turn off:

* audio enhancements
* spatial audio
* 5.1 or 7.1 surround modes
* headset "gaming surround" or DTS modes
* AI noise cleanup inside device driver software, unless you've tested it for a full show

OBS, Chromium, WebRTC, Wave Link, and most virtual devices are happiest at a plain 48 kHz stereo.

## Browser Source and "Control audio via OBS"

For VDO.Ninja browser sources, you'll usually want **Control audio via OBS** enabled so OBS can treat the source as its own mixer item. It's a handy setting, but it also adds another audio path inside OBS that can misbehave on some systems.

Here's a quick test to see if OBS monitoring is the problem:

1. Open the OBS browser source properties.
2. Confirm whether **Control audio via OBS** is enabled.
3. Open **Advanced Audio Properties**.
4. For that browser source, set **Audio Monitoring** to **Monitor Off**.
5. Do a short local recording test.

If the recording comes out clean with monitoring off, your issue is likely OBS monitoring, not VDO.Ninja itself.

If you still need to hear the guests, don't monitor the same browser source through OBS if that path is unreliable. Instead, listen through one of:

* the VDO.Ninja director page in a regular browser
* [Electron Capture](https://electroncapture.app/)
* Wave Link
* a [virtual audio cable](https://vb-audio.com/Cable/)
* a separate browser routed to your headphones or mixer

### Avoid double-capturing audio

Never capture the same audio twice.

For example, don't send the VDO.Ninja browser source into Desktop Audio *and* capture it through **Control audio via OBS** at the same time. That produces echo, phasing, comb-filtering, or a weird digital crackle that's easy to mistake for a network problem.

Quick check: watch the OBS mixer. If the same guest is making more than one meter move, you're probably capturing them twice.

## OBS monitoring device

In OBS, head to **Settings** → **Audio** → **Advanced** → **Monitoring Device**.

Don't leave this set to **Default** for production. Windows quietly changes what "Default" means whenever USB devices, headsets, monitors, or audio interfaces connect or disconnect — which can swap your monitor output mid-show. Pick the exact device you want, such as:

* your audio interface
* your headphones
* Wave Link Aux
* VB-CABLE Input
* a dedicated virtual audio cable

And be careful: if OBS monitoring is routed to a device that OBS is also capturing, you'll create feedback or doubled audio. Keep the monitor output and your captured stream input separate, unless you're intentionally building a mix-minus.

## Application Audio Capture can fail over time

OBS Application Audio Capture is convenient, but on some Windows systems it slowly degrades over the course of a long session. Typical symptoms:

* audio is clean at the start
* after 30 to 90 minutes, one app becomes crackly or robotic
* your local headphones may still sound fine
* resetting or re-adding the capture source temporarily fixes it

If your setup relies on Application Audio Capture, run at least one full-length test without it.

Some more reliable alternatives:

* route the app into Wave Link
* route the app into [VB-CABLE](https://vb-audio.com/Cable/) or another virtual audio cable
* use [Electron Capture](https://electroncapture.app/) and capture the Electron audio separately
* use a regular Audio Input Capture pointed at a virtual device
* use a separate hardware mixer or audio interface loopback

Window Audio Capture is another useful option, but treat it the same way — it's just another OBS capture path, so test it at full show length before you rely on it.

## Electron Capture workaround

When OBS Browser Source audio is the problem, [Electron Capture](https://electroncapture.app/) is often the cleanest way around it.

Instead of loading the VDO.Ninja view link directly in an OBS Browser Source, you open the view link inside Electron Capture — a standalone app — and then bring its window and audio into OBS. That way, you sidestep the Browser Source audio path entirely.

Basic setup:

1. Install [Electron Capture](https://electroncapture.app/).
2. Open the VDO.Ninja view link in Electron Capture.
3. In OBS, add the Electron window as a **Window Capture** source for video.
4. Route Electron's audio into OBS using one of the options below.

### Option A: virtual audio cable

Use this when you want a stable, microphone-like audio input in OBS.

1. Install a virtual audio cable — [VB-CABLE](https://vb-audio.com/Cable/) on Windows, or BlackHole/Loopback on macOS.
2. In Electron Capture, set the audio output device to the virtual cable input.
3. In OBS, add **Audio Input Capture**.
4. Select the virtual cable output.
5. Keep OBS monitoring off for that input unless you need it.

This bypasses the OBS Browser Source audio path entirely.

One thing that trips people up: the naming. With VB-CABLE, apps play audio *into* **CABLE Input**, and OBS captures *from* **CABLE Output**. It feels backwards but it's correct.

### Option B: Wave Link

Use this if you already run audio through Elgato Wave Link.

1. Create or choose a Wave Link channel, such as Aux 1.
2. Send Electron Capture's audio to that Wave Link channel.
3. Add **Wave Link Stream** or the chosen Wave Link mix into OBS.
4. Control guest volume in Wave Link rather than through the OBS browser source.

If Wave Link itself starts crackling, bump the input/output buffer size one step and restart Wave Link.

### Option C: OBS Window Audio Capture

On supported Windows systems, you can sometimes capture Electron Capture directly with OBS Window Audio Capture or Application Audio Capture.

It's the easiest option, but it still routes through OBS's Windows app-capture path. If your long-show problem comes from Application Audio Capture getting noisy over time, a virtual cable or Wave Link route will be more reliable.

### Multiple guests

For separate guest tracks, use one Electron Capture window per guest.

To keep each guest's audio isolated, you can use:

* one virtual cable per guest
* a separate Wave Link Aux channel per guest
* a multichannel audio interface or mixer
* one mixed Electron route for monitoring plus separate VDO.Ninja/OBS browser sources as a backup

Keep it as simple as you can. Every extra audio route is another place for a sample-rate mismatch or a duplicate source to sneak in.

{% content-ref url="../steves-helper-apps/electron-capture.md" %}
[electron-capture.md](../steves-helper-apps/electron-capture.md)
{% endcontent-ref %}

{% content-ref url="../guides/capturing-without-browser-sources.md" %}
[capturing-without-browser-sources.md](../guides/capturing-without-browser-sources.md)
{% endcontent-ref %}

## Elgato Wave Link checks

If you're running Wave:3, Wave XLR, or Wave Link:

1. Set Wave Link and OBS both to `48 kHz`.
2. Bump the Wave Link **input** buffer up one step if inputs are crackling.
3. Bump the Wave Link **output** buffer up one step if your monitor mix is crackling.
4. Restart Wave Link after changing buffer size — it doesn't always take effect cleanly otherwise.
5. Double-check that any VST plugins you use support your selected sample rate.
6. Temporarily disable VST plugins — especially noise removal, voice cleanup, limiters, and complex effect chains — to rule them out.
7. Keep the OBS level for Wave Link Stream at `0.0 dB` and do your mixing in Wave Link.

If audio is clean through Wave Link but bad when captured from the OBS browser source, that's a strong signal that OBS Browser Source audio or OBS monitoring is the real culprit.

## CPU, GPU, and Windows scheduling

Audio crackling can still happen even when OBS shows low CPU usage. The CPU number OBS reports isn't the whole story — it doesn't account for everything else running on your system.

During a full test, watch Windows Task Manager for:

* total CPU
* GPU 3D usage
* GPU video encode usage
* memory pressure
* disk activity
* browser or OBS helper processes

Common fixes:

* run OBS as Administrator
* reduce scene complexity
* reduce browser source count
* reduce source resolution or frame rate
* disable unused audio devices in Windows
* remove unused OBS global audio devices
* disable old plugins you don't actually need
* toggle off Hardware-Accelerated GPU Scheduling in Windows as a troubleshooting step
* try Windows Game Mode — but test it before relying on it for a real show
* close RGB, overlay, screen recorder, audio enhancement, and motherboard utility software while streaming

Scene transitions can cause short CPU/GPU spikes too. If your crackling lines up with transitions, simplify stingers, media sources, and any audio filters running at that moment.

## Browser throttling and hidden windows

If the problem only shows up after a long time — or after OBS, Chrome, or Electron has been hidden, minimized, or buried behind other windows — Windows or Chromium may be throttling the page to save resources.

Try these:

* don't minimize OBS
* don't minimize the VDO.Ninja window
* keep important windows visible, even if only partly
* disable Chrome's performance-saving features for the VDO.Ninja page
* in OBS browser sources, avoid **Shutdown source when not visible**
* in OBS browser sources, avoid **Refresh browser when scene becomes active** unless you specifically want that
* test OBS browser source hardware acceleration both on and off
* switch to [Electron Capture](https://electroncapture.app/) if the OBS Browser Source keeps failing

Electron Capture helps here because it runs as its own app and gives you a lot more control over capture, window size, output device, and visibility behavior than an embedded browser source does.

## Capture cards, NDI, and external devices

Crackling can also originate in capture cards, NDI streams, audio interfaces, or USB devices.

Things worth checking:

* capture card audio sample rate
* capture card buffering setting
* the USB port and the cable itself
* whether the device is sharing a USB hub with something demanding
* device firmware and driver version
* whether OBS sees the device as 44100 Hz while Windows says 48000 Hz (classic mismatch)
* whether the same device is being captured twice

If an Elgato, NDI, or USB source shows max audio buffering in the OBS log, isolate it. Pull it out of a test scene and see whether the problem disappears with it.

## Audio filters and plugins

OBS audio filters can themselves cause crackling — either because they're too heavy, misconfigured, or quietly failing.

Temporarily disable:

* VST plugins
* AI noise suppression
* NVIDIA noise removal
* compressors
* limiters
* noise gates
* expanders
* third-party audio monitor plugins

Then run a long test recording. If the crackle is gone, add filters back one at a time until you find the culprit.

A caution about filters on a full stream mix: they affect *everything* that passes through. For example, putting a noise gate or noise suppression filter on Wave Link Stream can damage guest voices, music, alerts, and game audio all at the same time.

## VDO.Ninja URL options that may help

If the real problem turns out to be network loss or WebRTC audio damage, a few VDO.Ninja URL parameters can help:

* `&audiocodec=red` on viewer-side links can improve audio resilience in some cases.
* `&relay&tcp` can help when UDP packet loss is the problem.
* `&buffer=300` (or higher) on the viewer link smooths out jitter at the cost of a bit of delay.
* `&noaudioprocessing` (or the shorthand `&noap`) bypasses some Web Audio processing, but it may also disable related audio features — read up on what's affected before using it.
* `&samplerate=48000` and `&micsamplerate=48000` help keep WebRTC and device sample rates aligned.

These are less likely to help when the VDO.Ninja room already sounds clean and only the OBS output is bad. They're most useful when the audio is already broken *before* it reaches OBS, or when packet loss is visible in VDO.Ninja's stats.

## A recommended stable OBS audio path

For a production show with remote guests, a reliable setup usually looks like this:

1. The VDO.Ninja guest view link opens in [Electron Capture](https://electroncapture.app/) or an OBS Browser Source.
2. Audio is routed into OBS exactly once — never twice.
3. OBS monitoring is off unless you actually need to hear it.
4. If you do need monitoring, it goes to a dedicated device that OBS is *not* also capturing.
5. All audio devices are set to `48 kHz`.
6. OBS runs as Administrator on Windows.
7. Unused OBS global audio devices are disabled.
8. A local test recording is made before every show.

For maximum reliability, combine [Electron Capture](https://electroncapture.app/) with a [virtual audio cable](https://vb-audio.com/Cable/) or a dedicated Wave Link channel. That keeps you off the OBS Browser Source audio path — the place where long-running crackling most often starts.

## What to ask if someone else is debugging this

If you're helping someone else troubleshoot, these questions will save a lot of time:

* Does it sound bad inside the VDO.Ninja room, or only on the live stream?
* Does a local OBS recording also sound bad?
* Does the OBS log show `Max audio buffering reached`?
* Are they using **Control audio via OBS**?
* Are any sources set to **Monitor and Output**?
* What is their OBS monitoring device set to?
* Are they using Application Audio Capture, Window Audio Capture, Wave Link, Voicemeeter, NDI, or a capture card?
* Are OBS, Windows, Wave Link, and all virtual cables set to `48 kHz`?
* Does restarting just the browser source fix it, or does OBS need a full restart?
* Does Electron Capture + a virtual audio cable stay clean for a full-length test?

## The short version

If VDO.Ninja sounds clean but the outbound OBS stream crackles, treat it as an OBS audio routing problem first — not a VDO.Ninja problem.

The fixes that help most often:

* set everything to `48 kHz`
* turn off OBS monitoring for browser sources
* never capture the same audio twice
* avoid Application Audio Capture for long shows if it tends to degrade
* increase Wave Link or virtual cable buffers
* check OBS logs for `Max audio buffering reached`
* use [Electron Capture](https://electroncapture.app/) with a [virtual audio cable](https://vb-audio.com/Cable/) or Wave Link channel instead of relying on OBS Browser Source audio

{% content-ref url="audio-clicking-popping-distortion.md" %}
[audio-clicking-popping-distortion.md](audio-clicking-popping-distortion.md)
{% endcontent-ref %}
