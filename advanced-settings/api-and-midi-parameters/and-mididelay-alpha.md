---
description: Lets you precisely delay the MIDI play-out
---

# \&mididelay (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/) and [vdo.ninja/beta](https://vdo.ninja/beta/)

## Options

Example: `&mididelay=1000`

| Value           | Description |
| --------------- | ----------- |
| (numeric value) | delay in ms |

## Details

`&mididelay=1000` lets you precisely delay the MIDI play-out from VDO.Ninja to your MIDI device when using [`&midiin`](../../midi-settings/midiin.md), irrespective of network latency.

Use case: If you have a remote drum machine, you can have it play out the beat exactly 4-bars ahead, allowing for music jamming types with even high ping delays between locations.

## Related

{% content-ref url="../../midi-settings/midi.md" %}
[midi.md](../../midi-settings/midi.md)
{% endcontent-ref %}

{% content-ref url="../../midi-settings/midiin.md" %}
[midiin.md](../../midi-settings/midiin.md)
{% endcontent-ref %}
