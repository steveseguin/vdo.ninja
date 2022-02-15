---
description: Broadcast MIDI commands to a remote computer's virtual MIDI device
---

# \&midiout

## Aliases

* `&midipush`
* `&mo`

## Options

Device indices starts at 1, where an index of 0 implies "all". You can refer to [`https://vdo.ninja/midi`](https://vdo.ninja/midi) for a drop-down list of available MIDI devices; the first MIDI device in the list would have a device index ID of 1.

| Value                  | Description                                   |
| ---------------------- | --------------------------------------------- |
| 0                      | using 0 will listen to all midi input devices |
| (integer value. eg: 1) | midi input device list index ID; 1 and up.    |

## Details

Allows for sending of MIDI signals to a remote computer.  Mirrors even the channel ID.

The remote device must use [`&midiin`](midiin.md) to accept the signal and a peer connection is needed for the signal to take place. &#x20;

You can disable the video and audio of VDO.Ninja, but still have a basic data-only peer-connection, but using `&vd=0&ad=0` or [`&novideo`](../advanced-settings/view-parameters/novideo.md)``[`&noaudio`](../advanced-settings/view-parameters/noaudio.md).

### Warning:

If testing locally, beware of feedback loops, where the MIDI output is fed back into the MIDI input, causing high CPU usage and a lot of MIDI messages. If testing locally, use two MIDI devices and explicitly select the input and output MIDI devices to avoid these feedback loops.

## Related

{% content-ref url="midi.md" %}
[midi.md](midi.md)
{% endcontent-ref %}

{% content-ref url="midiin.md" %}
[midiin.md](midiin.md)
{% endcontent-ref %}
