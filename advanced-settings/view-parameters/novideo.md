---
description: >-
  Disables all video playback on the local computer, except for any stream ID
  that is listed
---

# \&novideo

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&nv`
* `&showonly`
* `&hidevideo`

## Options

| Value          | Description                                             |
| -------------- | ------------------------------------------------------- |
| (string value) | the stream ids to accept; can be a comma separated list |

## Details

Useful for reducing the CPU and network load on other connect peers if voice-chat is sufficient.

* Join a group-room as audio-only, to limit load on the guests.
* Useful for a large group room where you want everyone in the room to see only the OBS Virtualcam output.
* Consider using `&broadcast` option instead of this flag as it is better suited for presenting a single feed to a group than using `&novideo` alone.

When used together with [`&noaudio`](noaudio.md) (`&novideo&noaudio`), prevents guest room member from seeing or hearing other member's audio or video feeds.

* Useful for directors who may wish to only issue commands or text chat, but not need to see video or audio.

## Related

{% content-ref url="noaudio.md" %}
[noaudio.md](noaudio.md)
{% endcontent-ref %}
