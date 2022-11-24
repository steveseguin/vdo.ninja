---
description: Lets you specify the audio codec
---

# \&audiocodec (alpha)

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&solo`](../mixer-scene-parameters/and-solo.md))\
\*only available on [vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

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

This is 32khz, 16bit, mono, and uncompressed, so \~512-kbps bitrate. You'll need the sender to have `&insertablestreams` applied to their URL for this to work currently, as it requires the sender to enable a special mode that allows for custom codecs. This is very experimental at the moment, so its still a WIP.

## Related

{% content-ref url="../view-parameters/codec.md" %}
[codec.md](../view-parameters/codec.md)
{% endcontent-ref %}

{% content-ref url="minptime-3.md" %}
[minptime-3.md](minptime-3.md)
{% endcontent-ref %}
