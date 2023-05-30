---
description: Applies a gain multiplier (as a percentage) to the local microphone
---

# \&audiogain

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&g`
* `&gain`

## Options

Example: `&audiogain=80`

<table><thead><tr><th width="196">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>0</code></td><td>mutes the microphone so that only the Director can unmute it; the guest cannot unmute.</td></tr><tr><td><code>100</code></td><td>full volume - default</td></tr><tr><td>(integer value)</td><td>value will be applied as a percentage.</td></tr></tbody></table>

## Details

Adding `&audiogain=50` to a source link sets the audio gain of the source to 50%.

* Can be used to have a guest muted by default when joining a room (`&audiogain=0`).
* Can be remotely controlled by the Director if in a room; the guest cannot unmute themselves.
* Only applies to the first audio-source selected by a guest, if there is more than one selected.
* If audio processing is on, then this should be available by default for the director to remotely control.
* The gain function will NOT work if web-audio node processing cannot be enabled.

In Version 22 you can control the audio gain in the Audio Settings. If you want the guests to be able to change it by themselves, you can add [`&mediasettings`](../../newly-added-parameters/and-mediasettings.md) to the guests' link.\
![](<../../.gitbook/assets/image (93).png>)

{% hint style="warning" %}
Enables the audio processing pipeline.
{% endhint %}

## Related

{% content-ref url="and-volume.md" %}
[and-volume.md](and-volume.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/autogain.md" %}
[autogain.md](../../source-settings/autogain.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-limiter.md" %}
[and-limiter.md](../../source-settings/and-limiter.md)
{% endcontent-ref %}
