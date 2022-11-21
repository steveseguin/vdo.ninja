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
| `red`  | selects audio codec red           |
| `pcmu` | selects audio codec pcmu          |
| `pcma` | selects audio codec pcma          |
| `isac` | selects audio codec isac          |
| `g722` | selects audio codec g722          |

## Details

`&audiocodec` on the viewer side can let you specify the audio codec; `opus` (default), `pcmu`, `pcma`, `isac`, `g722` and `red`.

`&audiocodec=red` is pretty much sending two opus streams, with one as a backup in case of packet loss; support in Chromium 97 and up, but the only way I can so far tell that it is working is to check if the audio bitrate has doubled.

## Related

{% content-ref url="../view-parameters/codec.md" %}
[codec.md](../view-parameters/codec.md)
{% endcontent-ref %}

{% content-ref url="minptime-3.md" %}
[minptime-3.md](minptime-3.md)
{% endcontent-ref %}
