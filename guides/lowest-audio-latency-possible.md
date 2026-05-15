---
description: Two-way low-latency audio-only transmissions
---

# How to get lowest audio latency possible

If you are a musician looking to jam out with a friend, you should be able to achieve under 40ms of latency using [VDO.Ninja](https://vdo.ninja) if both you and them have a good Internet connections. This implies being directly connected via wired Ethernet with low packet loss, rather than via Wi-Fi or cellular.&#x20;

## Quick start with \&lowlatency

The easiest way to achieve low latency is using the [`&lowlatency`](../newly-added-parameters/and-lowlatency.md) parameter (aliases: `&ll`, `&ultralow`), which configures multiple optimizations automatically:

```
https://vdo.ninja/?push=MystreamID123&view=TheirStreamID123&lowlatency&novideo
```

This single parameter disables audio processing (echo cancellation, auto-gain, noise suppression), sets optimal packet timing (10ms ptime), minimizes buffers, uses constant bitrate, and bypasses the WebAudio pipeline.

## Manual configuration

For fine-grained control, here's a manual example of settings optimized for low-latency audio-only two-way communications. I find most of the latency with a setup like this is outside the scope of VDO.Ninja; so the sound card settings, the capture device, how far away I am from the mic / speakers, etc.

```
https://vdo.ninja/?push=MystreamID123&view=TheirStreamID123&aec=0&agc=0&denoise=0&ab=16&enhance&ptime=10&maxptime=10&novideo&noap
```

Looking at the link, let's explore:

[`&aec=0`](../source-settings/aec.md) disables the echo cancellation; this implies we will need to use headphones

[`&agc=0`](../source-settings/autogain.md) will disable auto-gain, which is preferable if streaming music

[`&denoise=0`](../source-settings/and-denoise.md) will disable the noise filter, which is ideal with music applications.

[`&ab=16`](../advanced-settings/view-parameters/audiobitrate.md) gives us a constant audio bitrate of 16-kbps. Consistency will ensure more reliable latencies, and 16-kbps is so light-weight it shouldn't be boggled down on bad connections. You can increase this value depending on the audio fidelity that you want, but higher could introduce more latency.

[`&enhance`](../advanced-settings/view-parameters/enhance.md), [`&ptime=10`](../advanced-settings/view-parameters/and-ptime.md), and [`&maxptime=10`](../advanced-settings/view-parameters/and-maxptime.md) are advanced settings, that tell the system to prioritize audio packets and limit their size to 10ms. This is the lowest we can set them using a browser, but it might be possible to go lower if using something like the Raspberry\_Ninja hardware project that VDO.Ninja has available for advanced users.

[`&novideo`](../advanced-settings/video-parameters/and-novideo.md) disables video, which can make a big impact on latency, as not streaming video will free up a lot of bandwidth, but also not force the audio to stay in sync with the video. You can send the video in a second tab/session if needed, and that way, it won't try to stay in sync.

[`&noap`](../general-settings/noaudioprocessing.md) just disables any of the advanced web-audio processing, such as compression, gain, level-meters, and panning. This will free up some milliseconds of latency in some cases,

Without much effort, you should be able to achieve 40-milliseconds of latency, or less, with this setup. Achieving between 20- to 30-ms is feasible in cases, but expectations of under 20-ms will require significantly more investment.

{% hint style="info" %}
For playback on Windows, consider using the [Electron Capture](../steves-helper-apps/electron-capture.md) app which now supports ASIO audio devices, providing even lower audio output latency compared to standard Windows audio.
{% endhint %}

## Remote lip-sync and in-ear cue performances

For a remote lip-sync performance, the goal is usually not to make the Internet delay disappear. The more reliable approach is to make the audience-facing audio/video chain match the performer's delayed cue.

For example, if the music is played from the venue laptop, split that same music feed:

* Send one copy to the performer's wired in-ear monitors using a low-latency VDO.Ninja audio-only link.
* Send the other copy to the venue PA, but delay it enough to match the projected video of the remote performer.

This keeps the performer lip-syncing to the same source the audience hears, while giving the venue operator a single place to correct the timing.

### Suggested cue links

Venue cue sender:

```
https://vdo.ninja/?push=show-cue&miconly&lowlatency&autostart
```

Performer cue receiver:

```
https://vdo.ninja/?view=show-cue&lowlatency&novideo&ab=32
```

Feed the venue music source into the cue sender with an audio interface, mixer aux send, or virtual audio cable. Use wired earphones or wired IEMs on the performer side; Bluetooth headphones add too much unpredictable delay for this use case.

Start with a low audio bitrate, such as `&ab=16` or `&ab=32`, when timing and stability matter more than full music quality. Raise it only if the cue quality is not good enough.

### Performer video back to the venue

Use a separate VDO.Ninja video link for the performer's camera. If the venue does not need the performer's microphone, disable the sent audio so only the clean venue music reaches the PA.

Performer camera sender:

```
https://vdo.ninja/?push=show-cam&ad=0
```

Venue/OBS view link:

```
https://vdo.ninja/?view=show-cam&noaudio&cleanoutput
```

If mobile-data jitter makes the video unstable, add a small video buffer on the venue view link, such as `&buffer=100` or `&buffer=200`, and then add the same extra delay to the PA timing. Lower latency is useful, but stable latency is usually more important for a convincing audience lip-sync.

### How to set the PA delay

Do a rehearsal with a clear click, clap, or count-in. Watch the projected performer and adjust the venue PA delay until the mouth movement and beat look correct in the room.

As a starting point:

```
PA delay = cue delay to performer + performer video return/display delay
```

In practice, measure it rather than guessing. Mobile networks can change delay during a walk, especially on 4G/5G or when the phone changes towers. If the timing drifts, increase the video buffer slightly and match the PA delay to that more stable path.

### Transitioning into the venue

If the performer physically enters the room at the end, plan that transition. During the remote section, the PA may be delayed to match the projected video. Once the performer is in the room, that camera/video path delay no longer applies.

Common solutions are to keep the performer on wired in-ears until the ending, switch the PA delay back to normal during a musical break, or hide the timing change during a blackout, applause moment, or doorway reveal.

## Related

{% content-ref url="../newly-added-parameters/and-lowlatency.md" %}
[and-lowlatency.md](../newly-added-parameters/and-lowlatency.md)
{% endcontent-ref %}
