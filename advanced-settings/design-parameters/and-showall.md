---
description: Includes non-media-based push connections as video elements in a group room
---

# \&showall

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Aliases

* `&style=7`

## Details

Added `&showall` (or [`&style=7`](style.md)), which will include non-media-based push connections as video elements in a group room. This can include guests that joined without audio/video, directors, or a data-only connection, like maybe MIDI-output source.

To help avoid some types of connections showing up when using `&showall`, I've also added a [`&nopush`](../settings-parameters/and-nopush.md) mode, which blocks outbound publishing connections. This acts a bit like a [`&scene=1`](../view-parameters/scene.md) link, so unless `&showall` is added, you'll need to use the IFRAME API to show/hide videos in it.

## Related

{% content-ref url="style.md" %}
[style.md](style.md)
{% endcontent-ref %}

{% content-ref url="../settings-parameters/and-nopush.md" %}
[and-nopush.md](../settings-parameters/and-nopush.md)
{% endcontent-ref %}
