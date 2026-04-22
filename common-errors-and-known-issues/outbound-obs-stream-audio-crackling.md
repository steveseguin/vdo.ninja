---
description: Troubleshooting guide for crackling, robotic, distorted, or broken audio in the outbound OBS stream when VDO.Ninja sounds clean locally.
---

# Outbound OBS stream audio is crackling

This page is for cases where the VDO.Ninja call sounds fine to the people in the room, but the audience hears crackling, robotic voices, static, pitch changes, or broken audio in the OBS stream or recording.

If the call itself sounds bad inside VDO.Ninja, start with [Audio Clicking / Popping / Distortion](audio-clicking-popping-distortion.md) instead. If the call sounds clean but the live stream sounds bad, the problem is usually in the OBS audio path: browser source audio, audio monitoring, Windows audio capture, virtual audio routing, Wave Link, a capture card, or an OBS source that has started buffering badly.

## Quick live-show fixes

Try these first if the show is already live:

1. In OBS, right-click the affected browser source and select **Properties**, then click **Refresh cache of current page** or **Refresh**.
2. If only one source is bad, hide/show that source, or deactivate/reactivate it if it has a deactivate option.
3. If all guest audio is bad, switch to a backup audio route if you have one, such as [Electron Capture](https://electroncapture.app/), Wave Link, a [virtual audio cable](https://vb-audio.com/Cable/), or a second browser.
4. Stop monitoring the affected source in OBS if you do not need to hear it through OBS. Go to **Advanced Audio Properties** and set **Audio Monitoring** to **Monitor Off** for the noisy source.
5. If OBS logs show max audio buffering, fully restart OBS after the segment or during a break. In many cases the source does not recover cleanly by itself.
6. If the audio path goes through Wave Link, Voicemeeter, a capture card utility, or another audio mixer, restart that app too.

These steps are not a final fix. They just help confirm that the problem is in the local OBS/audio routing chain rather than in the remote guest's microphone.

## First confirm where the crackle is

Before changing many settings, identify where the audio first becomes bad.

### The VDO.Ninja room sounds clean

If everyone sounds normal in the VDO.Ninja room, but the OBS stream or recording sounds bad, look at OBS, Windows, Wave Link, virtual audio cables, or capture sources.

This usually means the remote guests are not the root cause. A guest on Wi-Fi or a Bluetooth headset can cause that guest to sound bad in the call, but it usually will not make every guest sound bad only on the outbound OBS stream.

### OBS monitor sounds clean, but the stream is bad

If you hear clean audio locally but the audience hears crackling, check:

* OBS recording or stream output
* audio filters on the source
* Application Audio Capture
* capture-card audio
* Wave Link Stream Mix
* OBS log messages about audio buffering

Make a short local OBS recording when the issue is happening. If the recording is also bad, the issue is before the stream leaves OBS.

### OBS monitor is also bad

If the audio sounds bad in your headphones through OBS monitoring, check:

* OBS monitoring device
* "Control audio via OBS"
* Wave Link monitor mix
* virtual cable buffer size
* sample-rate mismatch
* audio enhancements or surround sound

## Check the OBS log

After a bad session, open OBS and go to **Help** -> **Log Files** -> **Upload Current Log File**. You can also use the OBS log analyzer:

[https://obsproject.com/tools/analyzer](https://obsproject.com/tools/analyzer)

Look for lines like:

```text
Max audio buffering reached!
Source <name> audio is lagging ... at max audio buffering. Restarting source audio.
adding ... milliseconds of audio buffering
```

If you see these, OBS is struggling to keep that audio source in time. The cause can be CPU/GPU pressure, a device driver, a bad capture source, an overloaded browser source, a sample-rate mismatch, a slow filter, or a source that stopped delivering audio evenly.

Also check for:

* mismatched sample rates, such as one device at 44100 Hz and OBS at 48000 Hz
* sources listed more than once, such as Desktop Audio captured globally and also as a scene source
* old or incompatible plugins
* repeated device disconnects
* audio filters that report errors

## Fix sample rates first

Sample-rate mismatches are one of the easiest problems to create and one of the hardest to hear before they become serious.

Use 48000 Hz wherever possible:

* OBS: **Settings** -> **Audio** -> **Sample Rate** -> `48 kHz`
* Windows playback device: **Sound Settings** -> device -> **Format** -> `48000 Hz`
* Windows recording device: same as above
* Wave Link: use `48 kHz`, not `96 kHz`, unless you know every plugin and device in the chain supports it
* virtual audio cable: set it to `48000 Hz`
* audio interfaces and capture cards: set them to `48000 Hz`

Use 16-bit or 24-bit audio. Avoid 32-bit, 96 kHz, 192 kHz, or 384 kHz for a live OBS setup unless there is a specific reason.

Also disable:

* audio enhancements
* spatial audio
* 5.1 or 7.1 surround modes
* headset "gaming surround" or DTS modes
* AI noise cleanup in device driver software, unless you have tested it for a full show

OBS, Chromium, WebRTC, Wave Link, and many virtual devices are happiest at 48 kHz stereo.

## Browser Source and "Control audio via OBS"

For VDO.Ninja browser sources, OBS often needs **Control audio via OBS** enabled so OBS can capture the source as its own mixer item. That setting is useful, but it also creates another audio path inside OBS that can misbehave on some systems.

Try this test:

1. Open the OBS browser source properties.
2. Confirm whether **Control audio via OBS** is enabled.
3. Open **Advanced Audio Properties**.
4. For that browser source, set **Audio Monitoring** to **Monitor Off**.
5. Do a local recording test.

If the recording is clean with monitoring off, the problem may be OBS monitoring rather than VDO.Ninja.

If you need to hear the guests, do not monitor the same browser source through OBS if that monitoring path is unreliable. Instead, monitor through:

* the VDO.Ninja director page in a regular browser
* [Electron Capture](https://electroncapture.app/)
* Wave Link
* a [virtual audio cable](https://vb-audio.com/Cable/)
* a separate browser routed to your headphones or mixer

### Avoid double-capturing audio

Do not capture the same audio twice.

For example, avoid sending the VDO.Ninja browser source to Desktop Audio while also capturing it through **Control audio via OBS**. This can create echo, phasing, comb-filtering, or strange crackling that sounds like digital distortion.

In OBS, check the mixer. If the same guest is moving more than one meter, you may be capturing that guest twice.

## OBS monitoring device

In OBS, go to **Settings** -> **Audio** -> **Advanced** -> **Monitoring Device**.

Avoid leaving this set to **Default** for production. Windows can change what "Default" means when USB devices, headsets, monitors, or audio interfaces reconnect. Pick the exact device you want, such as:

* your audio interface
* your headphones
* Wave Link Aux
* VB-CABLE Input
* a dedicated virtual audio cable

If OBS monitoring is routed to a device that OBS also captures, you can create feedback or doubled audio. Keep the monitor output and captured stream input separate unless you are intentionally building a mix-minus.

## Application Audio Capture can fail over time

OBS Application Audio Capture is convenient, but on some Windows systems it can become noisy after a long time. The symptom is often:

* audio is clean at the start
* after 30 to 90 minutes, one app becomes crackly or robotic
* local headphones may still sound clean
* changing or resetting the capture source temporarily fixes it

If your setup depends on Application Audio Capture, test a show without it.

Better alternatives:

* route the app into Wave Link
* route the app into [VB-CABLE](https://vb-audio.com/Cable/) or another virtual audio cable
* use [Electron Capture](https://electroncapture.app/) and capture the Electron audio separately
* use a normal Audio Input Capture pointed at a virtual device
* use a separate hardware mixer or audio interface loopback

Window Audio Capture can also be useful, but treat it as another OBS capture path that should be tested for a full show length before relying on it.

## Electron Capture workaround

[Electron Capture](https://electroncapture.app/) is often the cleanest workaround when OBS Browser Source audio is the problem.

Instead of loading the VDO.Ninja view link directly inside an OBS Browser Source, you load the view link in Electron Capture, then bring the Electron window and audio into OBS.

Basic setup:

1. Install [Electron Capture](https://electroncapture.app/).
2. Open the VDO.Ninja view link in Electron Capture.
3. In OBS, add the Electron window as a **Window Capture** source for video.
4. Route Electron's audio into OBS using one of the audio methods below.

### Option A: virtual audio cable

Use this when you want a stable audio input that appears in OBS like a microphone.

1. Install a virtual audio cable, such as [VB-CABLE](https://vb-audio.com/Cable/) on Windows, or BlackHole/Loopback on macOS.
2. In Electron Capture, set the audio output device to the virtual cable input.
3. In OBS, add **Audio Input Capture**.
4. Select the virtual cable output.
5. Keep OBS monitoring off for that input unless you need it.

This bypasses OBS Browser Source audio entirely.

The naming can be confusing. With VB-CABLE, apps usually play audio into **CABLE Input**, while OBS usually captures from **CABLE Output**.

### Option B: Wave Link

Use this if you already manage audio through Elgato Wave Link.

1. Create or choose a Wave Link channel, such as Aux 1.
2. Send Electron Capture's audio to that Wave Link channel.
3. Add **Wave Link Stream** or the chosen Wave Link mix into OBS.
4. Control guest volume in Wave Link instead of through the OBS browser source.

If Wave Link itself crackles, increase Wave Link input/output buffer size and restart Wave Link.

### Option C: OBS Window Audio Capture

On supported Windows systems, you may be able to capture Electron Capture directly with OBS Window Audio Capture or Application Audio Capture.

This is easy, but it still uses OBS's Windows app-capture path. If your long-show issue is caused by Application Audio Capture becoming noisy over time, a virtual cable or Wave Link route may be safer.

### Multiple guests

For separate guest tracks, use one Electron Capture window per guest.

For isolated audio tracks, you can use:

* one virtual cable per guest
* separate Wave Link Aux channels
* a multichannel audio interface or mixer
* one mixed Electron route for monitoring and separate VDO.Ninja/OBS browser sources for backup

Keep it simple if possible. Every extra audio route is another place for a mismatch or doubled source.

{% content-ref url="../steves-helper-apps/electron-capture.md" %}
[electron-capture.md](../steves-helper-apps/electron-capture.md)
{% endcontent-ref %}

{% content-ref url="../guides/capturing-without-browser-sources.md" %}
[capturing-without-browser-sources.md](../guides/capturing-without-browser-sources.md)
{% endcontent-ref %}

## Elgato Wave Link checks

For Wave:3, Wave XLR, and Wave Link users:

1. Set Wave Link and OBS to `48 kHz`.
2. Increase Wave Link input buffer one step if inputs crackle.
3. Increase Wave Link output buffer one step if your monitor mix crackles.
4. Restart Wave Link after changing buffer size.
5. Check that VST plugins support your selected sample rate.
6. Temporarily disable VST plugins, especially noise removal, voice cleanup, limiters, and complicated effect chains.
7. Keep the OBS level for Wave Link Stream at `0.0 dB` and control the mix in Wave Link.

If audio is clean when routed through Wave Link but bad when captured from the OBS browser source, that strongly points to OBS Browser Source audio or OBS monitoring.

## CPU, GPU, and Windows scheduling

Audio crackling can happen even when OBS does not show high CPU usage. OBS's CPU number is not the whole system load.

Check Windows Task Manager during a full test:

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
* disable old plugins that are not needed
* disable Hardware-Accelerated GPU Scheduling in Windows as a troubleshooting step
* use Windows Game Mode, but test it before a production show
* close RGB, overlay, screen recorder, audio enhancement, and motherboard utility software during shows

Transitions can also cause short CPU/GPU spikes. If crackling starts during scene transitions, simplify stingers, media sources, and audio filters.

## Browser throttling and hidden windows

If the problem starts after a long time, or after OBS/Chrome/Electron has been hidden, minimized, or placed behind other windows, Windows or Chromium may be throttling the page.

Try:

* do not minimize OBS
* do not minimize the VDO.Ninja window
* keep important windows visible, even partly visible
* disable Chrome performance-saving features for the VDO.Ninja page
* in OBS browser sources, avoid **Shutdown source when not visible**
* in OBS browser sources, avoid **Refresh browser when scene becomes active** unless you intentionally want it
* test OBS browser source hardware acceleration both on and off
* use [Electron Capture](https://electroncapture.app/) instead of OBS Browser Source if the browser source keeps failing

Electron Capture is useful here because it runs as its own app and gives more control over capture, window size, output device, and visibility behavior.

## Capture cards, NDI, and external devices

Crackling can also come from capture cards, NDI, audio interfaces, or USB devices.

Check:

* capture card audio sample rate
* capture card buffering setting
* USB port and cable
* whether the device is on a shared USB hub
* device firmware and driver version
* whether OBS sees the device as 44100 Hz while Windows says 48000 Hz
* whether the same device is captured twice

If an Elgato, NDI, or USB source shows max audio buffering in the OBS log, isolate it. Remove that source from a test scene and see if the problem goes away.

## Audio filters and plugins

OBS audio filters can cause crackling if they are too heavy, misconfigured, or failing.

Temporarily disable:

* VST plugins
* AI noise suppression
* NVIDIA noise removal
* compressors
* limiters
* noise gates
* expanders
* third-party audio monitor plugins

Then run a long test recording. If the crackle disappears, add filters back one at a time.

Filters on a full stream mix affect everything. For example, putting a noise gate or noise suppression filter on Wave Link Stream can damage guest voices, music, alerts, and game audio all at once.

## VDO.Ninja URL options that may help

If the issue is truly network loss or WebRTC audio damage, VDO.Ninja URL options may help:

* `&audiocodec=red` on viewer-side links can improve audio resilience in some cases.
* `&relay&tcp` can help if UDP packet loss is the problem.
* `&buffer=300` or a higher value on the viewer link can help smooth jitter at the cost of delay.
* `&noaudioprocessing` or `&noap` can bypass some Web Audio processing, but it may disable related audio features.
* `&samplerate=48000` and `&micsamplerate=48000` can help keep WebRTC and device settings aligned.

These are less likely to fix a problem where the VDO.Ninja room sounds clean but OBS output is bad. Use them when the audio is bad before it reaches OBS, or when packet loss is visible in VDO.Ninja stats.

## Recommended stable OBS audio path

For a production show with remote guests, a stable path is usually:

1. VDO.Ninja guest view link opens in [Electron Capture](https://electroncapture.app/) or OBS Browser Source.
2. Audio is routed into OBS once, not twice.
3. OBS monitoring is off unless needed.
4. If monitoring is needed, route it to a dedicated device that OBS is not also capturing.
5. All audio devices are set to `48 kHz`.
6. OBS is run as Administrator on Windows.
7. Unused OBS global audio devices are disabled.
8. A local test recording is made before the show.

For higher reliability, use [Electron Capture](https://electroncapture.app/) plus a [virtual audio cable](https://vb-audio.com/Cable/) or Wave Link channel. This avoids the OBS Browser Source audio path, which is often where long-running crackling starts.

## What to ask the user for

When helping someone debug this, ask for:

* Does it sound bad inside the VDO.Ninja room, or only on the live stream?
* Does a local OBS recording also sound bad?
* Does the OBS log show `Max audio buffering reached`?
* Are they using **Control audio via OBS**?
* Are any sources set to **Monitor and Output**?
* What is the OBS monitoring device?
* Are they using Application Audio Capture, Window Audio Capture, Wave Link, Voicemeeter, NDI, or a capture card?
* Are OBS, Windows, Wave Link, and virtual cables all set to `48 kHz`?
* Does restarting only the browser source fix it, or does OBS need a full restart?
* Does Electron Capture plus a virtual audio cable stay clean for a full-length test?

## Short answer for most cases

If VDO.Ninja sounds clean but the outbound OBS stream crackles, treat it as an OBS audio routing problem first.

The most useful fixes are:

* set everything to `48 kHz`
* turn off OBS monitoring for browser sources
* avoid duplicate audio capture
* avoid Application Audio Capture for long shows if it becomes noisy
* increase Wave Link or virtual cable buffers
* check OBS logs for max audio buffering
* use [Electron Capture](https://electroncapture.app/) with a [virtual audio cable](https://vb-audio.com/Cable/) or Wave Link channel instead of relying on OBS Browser Source audio

{% content-ref url="audio-clicking-popping-distortion.md" %}
[audio-clicking-popping-distortion.md](audio-clicking-popping-distortion.md)
{% endcontent-ref %}
