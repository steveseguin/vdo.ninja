---
description: Disables all webaudio audio-processing pipelines
---

# \&noaudioprocessing

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&noap`

## Details

`&noaudioprocessing` disables the web-audio audio processing pipelines of both inbound and outbound audio. This is not the same as disabling echo-cancellation, denoise, or auto-gain; those are not web-audio-based.

Disabling the web-audio processing pipeline can help reduce audio distortion, clicking, and some echo-cancellation issues, especially if your CPU is overloaded.

The web-audio pipeline is like a chain of audio-plugins, loaded into Javascript, which does custom audio processing. This includes the low-cut filters, limiting, compression, audio-visualizers, active-speaker, director-side gain and mute control, and more.

This audio pipeline can start to have problems though if the CPU is overloaded. This can result in odd issues, including clicking. This pipeline is disabled by default in scenes, but it's usually enabled by default for most guest types.

{% hint style="warning" %}
Disabling audio processing will disable many features, such as audio-visualizers, gain control, and loudness-monitoring API functions.

The ability to remotely mute a guest as a director (along with [`&audiogain=0`](../advanced-settings/audio-parameters/and-audiogain.md)) will not work if audio processing is disabled.
{% endhint %}
