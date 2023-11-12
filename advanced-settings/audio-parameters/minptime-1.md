---
description: Lets you specify the audio codec
---

# \&audiocodec

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

Example: `&audiocodec=opus`

| Value  | Description                       |
| ------ | --------------------------------- |
| `opus` | default; selects audio codec opus |
| `red`  | selects audio codec red\*         |
| `pcmu` | selects audio codec pcmu          |
| `pcma` | selects audio codec pcma          |
| `isac` | selects audio codec isac          |
| `g722` | selects audio codec g722          |
| `pcm`  | selects audio codec pcm\*         |

## Details

`&audiocodec` on the viewer side can let you specify the audio codec; `opus` (default), `pcmu`, `pcma`, `isac`, `g722`, `red` and `pcm`.

#### red

`&audiocodec=red` is pretty much like sending two opus streams, with one as a backup in case of packet loss; support in Chromium 97 and up, but the only way I can so far tell that it is working is to check if the audio bitrate has doubled.

When using [`&proaudio`](and-proaudio.md), [`&stereo`](../../general-settings/stereo.md), or higher than [`&audiobitrate=216`](../view-parameters/audiobitrate.md) with this, the resulting bitrate may not actually double. I don't quite understand what's going on here, if its still working or not, so to be safe when using [`&proaudio`](and-proaudio.md) or [`&stereo`](../../general-settings/stereo.md), along with `&audiocodec=red`, I set the bitrate to 216 by default, which will then result in a sending bitrate of around 440-kbps.

I've tried to enable RED-mode to work with PCM audio, but so far it will only work with OPUS audio.

#### pcm

`&audiocodec=pcm` now will support 48khz and 44.1khz mono playback (48khz default), and if [`&stereo`](../../general-settings/stereo.md) is used, it changes to two-channel stereo 32khz.

The existing [`&samplerate=44100`](../view-parameters/and-samplerate.md) option can lower the sample rate of this pcm mode (down to 8khz even), and hence the resulting audio bitrate. Since PCM is raw, [`&audiobitrate`](../view-parameters/audiobitrate.md) won't work, so expect 550 to 1200-kbps in just audio bitrates per viewer.

There may be clicking when using PCM mode (L16) if you are on a bad connection, as PCM doesn't have much in the way of error correction.  You'll need to address this yourself probably with post-processing if any issue.

#### Future options

In the near future you'll be able to send PCM audio via [`&chunked`](../../newly-added-parameters/and-chunked.md) mode, which will guarantees delivery of all packets sent, however there may be buffering issues if your connection can't keep up with bandwidth requirements.

Currently [`&chunked`](../../newly-added-parameters/and-chunked.md) mode does work with OPUS-audio though; please provide feedback and requests if you use it. Chunked mode does not support [WHIP/WHEP](../../steves-helper-apps/whip-and-whep-tooling.md) or [Meshcast](../../newly-added-parameters/and-meshcast.md).

## Related

{% content-ref url="../view-parameters/codec.md" %}
[codec.md](../view-parameters/codec.md)
{% endcontent-ref %}

{% content-ref url="minptime-3.md" %}
[minptime-3.md](minptime-3.md)
{% endcontent-ref %}
