---
description: Disables all video playback on the local computer
---

# \&novideo

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&nv`
* `&hidevideo`
* [`&showonly`](novideo.md)

## Details

`&novideo` disables all video playback on the local computer. Useful for reducing the CPU and network load on other connect peers if voice-chat is sufficient.

* Join a group-room as audio-only, to limit load on the guests.

When used together with [`&noaudio`](../view-parameters/noaudio.md) (`&novideo&noaudio`), prevents guest room member from seeing or hearing other member's audio or video feeds.

* Useful for directors who may wish to only issue commands or text chat, but not need to see video or audio.

Use [`&broadcast`](../view-parameters/broadcast.md) or [`&showonly`](novideo.md) if you want to disable all videos except any stream IDs listed.

## Related

{% content-ref url="../view-parameters/noaudio.md" %}
[noaudio.md](../view-parameters/noaudio.md)
{% endcontent-ref %}

{% content-ref url="novideo.md" %}
[novideo.md](novideo.md)
{% endcontent-ref %}
