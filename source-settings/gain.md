---
description: Applies a gain multiplier (as a percentage) to the local microphone
---

# \&audiogain

Sender-Side Option! ([`&push`](push.md))

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

Adding `&audiogain=50` to a source link sets the audio gain of the source to 50%.

* Can be used to have a guest muted by default when joining a room (`&audiogain=0`)
* Can be remotely controlled by the Director if in a room; the guest cannot unmute themselves.
* Only applies to the first audio-source selected by a guest, if there is more than one selected.
* If audio processing is on, then this should be available by default for the director to remotely control.
* The gain function will NOT work if web-audio node processing cannot be enabled

In Version 22 you can control the audio gain in the Audio Settings. If you want the guests to be able to change it by themselves, you can add [`&mediasettings`](../newly-added-parameters/and-mediasettings.md) to the guests' link.\
![](<../.gitbook/assets/image (93) (3).png>)

{% hint style="warning" %}
Enables the audio processing pipeline.
{% endhint %}

## Related

{% content-ref url="../advanced-settings/upcoming-parameters/and-volume.md" %}
[and-volume.md](../advanced-settings/upcoming-parameters/and-volume.md)
{% endcontent-ref %}

{% content-ref url="autogain.md" %}
[autogain.md](autogain.md)
{% endcontent-ref %}

{% content-ref url="and-limiter.md" %}
[and-limiter.md](and-limiter.md)
{% endcontent-ref %}
