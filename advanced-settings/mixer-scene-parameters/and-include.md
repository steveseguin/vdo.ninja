---
description: Includes streams that do not exist in the room
---

# \&include

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

| Value       | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| (stream ID) | stream ID of a publisher outside of a room with a matching password |

## Details

`&include`, which is like [`&view`](../view-parameters/view.md), except it's for including streams that do not exist in the room you are in, assuming those streams are not in another room and have matching passwords. So, useful for adding basic push-streams that you might want to be in multiple rooms at the same time, but not actually be locked to any room. ([`&view`](../view-parameters/view.md), conversely, is pretty exclusive; that or nothing.)

## Related

{% content-ref url="../view-parameters/view.md" %}
[view.md](../view-parameters/view.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/and-exclude.md" %}
[and-exclude.md](../view-parameters/and-exclude.md)
{% endcontent-ref %}
