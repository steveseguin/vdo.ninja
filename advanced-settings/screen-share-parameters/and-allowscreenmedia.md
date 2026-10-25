---
description: Allow or block incoming screen-share video and audio on a viewer link
---

# \&allowscreenvideo / \&allowscreenaudio

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

These two parameters override whether this viewer accepts screen-share video or screen-share audio. Camera video and microphone audio are not affected.

## Options

| Parameter | Value | Result |
| --- | --- | --- |
| `&allowscreenvideo` | no value, `1`, `true`, `yes`, `on` | Accept screen-share video |
|  | `0`, `false`, `no`, `off`, `none` | Block screen-share video |
| `&allowscreenaudio` | no value, `1`, `true`, `yes`, `on` | Accept screen-share audio |
|  | `0`, `false`, `no`, `off`, `none` | Block screen-share audio |

Unrecognized values count as "accept". Without these parameters, the normal rules apply.

## Details

* A `&view` link only loads a publisher's screen share when its stream ID ends in `:s`, such as `&view=STREAMID:s` (see [`&screensharetype`](../../newly-added-parameters/and-screensharetype.md)). `&allowscreenvideo` and `&allowscreenaudio` override that rule in either direction.
* [`&noscreenshare`](and-noscreenshare.md) takes priority. When it is present, screen shares stay blocked.
* [`&novideo`](../video-parameters/and-novideo.md), [`&noaudio`](../view-parameters/noaudio.md) and `&broadcast` can still block a track that these parameters accept.

## Examples

Load a guest's screen share without its audio:

`https://vdo.ninja/?view=STREAMID:s&allowscreenaudio=0`

Show screen shares in a group scene, but mute their audio:

`https://vdo.ninja/?scene=0&room=ROOMNAME&allowscreenaudio=0`

## Related

{% content-ref url="and-noscreenshare.md" %}
[and-noscreenshare.md](and-noscreenshare.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-screensharetype.md" %}
[and-screensharetype.md](../../newly-added-parameters/and-screensharetype.md)
{% endcontent-ref %}
