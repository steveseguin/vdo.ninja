---
description: Pans the outgoing audio left or right, allowing for spatial audio group chats
---

# \&panning

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&pan`

## Options

| Value                  | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| (no value given) \| 90 | has the audio centered, but published as a mono-stereo stream |
| (0-89)                 | pans the audio left                                           |
| (91-180)               | pans the audio right                                          |
| -1                     | panning will be randomized                                    |

## Details

The default, if no value is passed, is to have the audio centered, but published as a mono-stereo stream.&#x20;

To pan the audio left, pass a value of 0 to 89.&#x20;

To center, pass 90 or leave blank.

To pan the audio right, pass a value of 91 to 180.

0 is the most left, while 180 is the most right.

If negative 1 is passed `&panning=-1`, then the panning will be randomized; center weighted a bit. This allows for a group-room experience where everyone in the room to have a different spatial position, making it easier to have larger group discussions where guests may sound similar to each other.

You may need to use [`&stereo`](../../general-settings/stereo.md) as a flag, or variants of it on the publisher and/or viewer's side, to ensure the audio is transmitted as stereo as well.

Please also note, the volume is gained up or down digitally to compensate for the value changes of mixing and panning; it attempts to retain the same loudness and avoid clipping. Please report issues or provide feedback if you encounter problems with it.

Also note, the audio can be dynamically panned left or right thereafter by the IFRAME API. For VR-applications, this could provide for some interesting user experiences.

## Related

{% content-ref url="../../general-settings/stereo.md" %}
[stereo.md](../../general-settings/stereo.md)
{% endcontent-ref %}
