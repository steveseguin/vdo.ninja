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

`&audiocodec=red` is pretty much sending two opus streams, with one as a backup in case of packet loss; support in Chromium 97 and up, but the only way I can so far tell that it is working is to check if the audio bitrate has doubled.

#### pcm

`&audiocodec=pcm` now will support 48khz and 44.1khz mono playback (48khz default), and if [`&stereo`](../../general-settings/stereo.md) is used, it changes to two-channel stereo 32khz.

The existing [`&samplerate=44100`](../view-parameters/and-samplerate.md) option can lower the sample rate of this pcm mode (down to 8khz even), and hence the resulting audio bitrate. Since pcm is raw, [`&audiobitrate`](../view-parameters/audiobitrate.md) won't work, so expect 550 to 1200-kbps in just audio bitrates per viewer.

## Related

{% content-ref url="../view-parameters/codec.md" %}
[codec.md](../view-parameters/codec.md)
{% endcontent-ref %}

{% content-ref url="minptime-3.md" %}
[minptime-3.md](minptime-3.md)
{% endcontent-ref %}
