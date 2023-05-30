---
description: Will mute the microphone of a guest when not loaded in an active OBS scene
---

# \&automute

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&am`

## Options

Example: `&automute=2`

<table><thead><tr><th width="171">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>will auto mute the microphone of a guest when not loaded in an active OBS scene</td></tr><tr><td><code>2</code></td><td>will mute it everywhere, while the default will still allow the director to speak to the guest, even if not in a scene</td></tr></tbody></table>

## Details

[`&automute`](and-automute.md) will auto mute the microphone of a guest when not loaded in an active OBS scene. Useful for perhaps limiting the discussion in a group chat to those on air.

`&automute=2` will mute it everywhere, while the default will still allow the director to speak to the guest, even if not in a scene.

This is a guest-side URL parameter; you may want to apply it to all guests.

Required quite a bit of code reworking; error reporting is on in the console, so please report issues. Feedback also welcomed.

## Related

{% content-ref url="../../source-settings/and-mute.md" %}
[and-mute.md](../../source-settings/and-mute.md)
{% endcontent-ref %}

{% content-ref url="and-audiogain.md" %}
[and-audiogain.md](and-audiogain.md)
{% endcontent-ref %}
