---
description: Two-way low-latency audio-only transmissions
---

# Lowest audio latency possible

If you are a musician looking to jam out with a friend, you should be able to achieve under 40ms of latency using VDO.Ninja if both you and them have a good Internet connections. This implies being directly connected via wired Ethernet with low packet loss, rather than via Wi-Fi or cellular.&#x20;

The following link is an example of settings optimized for low-latency audio-only two-way communications. I find most of the latency with a setup like this is outside the scope of VDO.Ninja; so the sound card settings, the capture device, how far away I am from the mic / speakers, etc.

```
https://vdo.ninja/?push=MystreamID123&view=TheirStreamID123&aec=0&agc=0&denoise=0&ab=16&enhance&ptime=10&maxptime=10&novideo&noap
```

Looking at the link, let's explore:

\&aec=0 disables the echo cancellation; this implies we will need to use headphones

\&agc=0 will disable auto-gain, which is preferable if streaming music

\&denoise=0 will disable the noise filter, which is ideal with music applications.

\&ab=16 gives us a constant audio bitrate of 16-kbps. Consistency will ensure more reliable latencies, and 16-kbps is so light-weight it shouldn't be boggled down on bad connections. You can increase this value depending on the audio fidelity that you want, but higher could introduce more latency.

\&enhance, \&ptime=10, and \&maxptime=10 are advanced settings, that tell the system to prioritize audio packets and limit their size to 10ms. This is the lowest we can set them using a browser, but it might be possible to go lower if using something like the Raspberry\_Ninja hardware project that VDO.Ninja has available for advanced users.

\&novideo disables video, which can make a big impact on latency, as not streaming video will free up a lot of bandwidth, but also not force the audio to stay in sync with the video. You can send the video in a second tab/session if needed, and that way, it won't try to stay in sync.

\&noap just disables any of the advanced web-audio processing, such as compression, gain, level-meters, and panning. This will free up some milliseconds of latency in some cases,

Without much effort, you should be able to achieve 40-milliseconds of latency, or less, with this setup. Achieving between 20- to 30-ms is feasible in cases, but expectations of under 20-ms will require significantly more investment.

