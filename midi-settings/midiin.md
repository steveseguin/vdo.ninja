---
description: Allows for receiving of remote MIDI
---

# \&midiin

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&midipull`
* `&mi`

## Options

Examples: `&midiin=2` or `&midiin=IAC%20Driver%20Bus%201`

<table><thead><tr><th width="225">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>0</code></td><td>all MIDI output devices</td></tr><tr><td>(integer value; for example, <code>1</code>)</td><td>MIDI output device index, starting at 1</td></tr><tr><td>(exact device name)</td><td>the MIDI output device with that name</td></tr></tbody></table>

## Details

Allows for receiving of remote MIDI. Device indices start at 1, while an index of 0 or no value means "all". Device names must match exactly and should be URL encoded. If no device matches the name, the name is ambiguous, or an index is out of range, no MIDI output is selected and a warning is written to the browser console.

{% hint style="danger" %}
If testing locally, beware of feedback loops, where the MIDI output is fed back into the MIDI input, causing high CPU usage and a lot of MIDI messages. If testing locally, use two MIDI devices and explicitly select the input and output MIDI devices to avoid these feedback loops.
{% endhint %}

## Related

{% content-ref url="midi.md" %}
[midi.md](midi.md)
{% endcontent-ref %}

{% content-ref url="midiout.md" %}
[midiout.md](midiout.md)
{% endcontent-ref %}
