# \&midiin

## Aliases

* `&midipull`
* `&mi`

## Options

| Value                  | Description                |
| ---------------------- | -------------------------- |
| 0                      | all midi output devices    |
| (integer value. eg: 1) | midi output device index 1 |

## Details

Allows for receiving of remote MIDI. Device indices starts at 1, where an index of 0 implies "all".\


### Warning:

If testing locally, beware of feedback loops, where the MIDI output is fed back into the MIDI input, causing high CPU usage and a lot of MIDI messages. If testing locally, use two MIDI devices and explicitly select the input and output MIDI devices to avoid these feedback loops&#x20;

