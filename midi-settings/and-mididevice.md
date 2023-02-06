---
description: Allows to specify which midi device (1 and up) selected
---

# \&mididevice

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Options

Example: `&mididevice=5`

| Value                    | Description               |
| ------------------------ | ------------------------- |
| (positive integer value) | Specifies the midi device |

## Details

Works in conjunction with [`&midi`](midi.md) to allow for specifying which midi device (1 and up) selected. If you don't specify anything, it listens to all midi devices.

## Related

{% content-ref url="midi.md" %}
[midi.md](midi.md)
{% endcontent-ref %}

{% content-ref url="and-midichannel.md" %}
[and-midichannel.md](and-midichannel.md)
{% endcontent-ref %}
