---
description: Only shows any stream ID that is listed
---

# \&showonly

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* ``[`&novideo`](novideo-1.md)``
* `&nv`
* `&hidevideo`

## Options

Example: `&showonly=streamID1,streamID2`

| Value          | Description                                           |
| -------------- | ----------------------------------------------------- |
| (string value) | the stream IDs to view; can be a comma separated list |

## Details

`&showonly` only shows any stream IDs that are listed. Useful for reducing the CPU and network load on other connect peers if voice-chat is sufficient.

* Useful for a large group room where you want everyone in the room to see only the OBS Virtualcam output.
* Consider using [`&broadcast`](../view-parameters/broadcast.md) option instead of this flag as it is better suited for presenting a single feed to a group than using `&showonly` alone.

This is actually just an alias of [`&novideo`](novideo-1.md).

## Related

{% content-ref url="../view-parameters/broadcast.md" %}
[broadcast.md](../view-parameters/broadcast.md)
{% endcontent-ref %}

{% content-ref url="novideo-1.md" %}
[novideo-1.md](novideo-1.md)
{% endcontent-ref %}
