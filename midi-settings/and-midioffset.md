---
description: >-
  Allows you to set a series of buttons on a MIDI controller to be mute controls
  for those guests
---

# \&midioffset

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Options

| Value                    | Description                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| (positive integer value) | (postitive integer value) is the control change command you want to use to mute guest 1. N+1 will mute guest 2, etc. |

## Details

You can subsequently pass `&midioffset=N`, where N is the control change command you want to use to mute guest 1. N+1 will mute guest 2, etc (up to a max. of 9 guests). This allows you to set a series of buttons on a MIDI controller to be mute controls for those guests. It ignores the MIDI CC values.

``[`https://vdo.ninja/?director&midi=5&midioffset=23`](https://vdo.ninja/?director\&midi=5\&midioffset=23) for example

## Related

{% content-ref url="midi.md" %}
[midi.md](midi.md)
{% endcontent-ref %}
