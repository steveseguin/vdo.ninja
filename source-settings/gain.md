---
description: Applies a gain multiplier (as a percentage) to the local microphone.
---

# \&audiogain

## Aliases

* `&g`
* `&gain`

## Options

| Value           | Description                                                                            |
| --------------- | -------------------------------------------------------------------------------------- |
| 0               | mutes the microphone so that only the Director can unmute it; the guest cannot unmute. |
| 100             | full volume - default                                                                  |
| (integer value) | value will be applied as a percentage.                                                 |

## Details

* Can be used to have a guest muted by default when joining a room.
* Can be remotely controlled by the Director if in a room; the guest cannot unmute themselves
* Only applies to the first audio-source selected by a guest, if there is more than one selected.
* If audio processing is on, then this should be available by default for the director to remotely control.
* The gain function will NOT work if web-audio node processing cannot be enabled

{% hint style="warning" %}
Enables the audio processing pipeline.
{% endhint %}

## Related

* `&limiter`
