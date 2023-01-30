---
description: Same as &buffer, but instead includes the round-trip-time
---

# \&buffer2 (alpha)

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

Example: `&buffer2=500`

| Value           | Description |
| --------------- | ----------- |
| (numeric value) | delay in ms |

## Details

`&buffer2=500` is the same as [`&buffer`](../view-parameters/buffer.md), but instead also tells the system to include the round-trip-time in the buffer delay calculation. This way 500-ms of buffer on a connection that has a 200ms ping time will result in a smaller 300-ms buffer, leading to an end-to-end playout delay of \~500ms.

It won't work that well with [Meshcast](../../newly-added-parameters/and-meshcast.md).

It's not super precise, but on a stable connection maybe within 20-ms of flux?

## Related

{% content-ref url="../view-parameters/buffer.md" %}
[buffer.md](../view-parameters/buffer.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/sync.md" %}
[sync.md](../view-parameters/sync.md)
{% endcontent-ref %}
