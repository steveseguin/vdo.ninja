---
description: Sets the amount of blur or effect applied
---

# \&effectvalue

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Aliases

* `&ev`

## Options

Example: `&effectvalue=8`

| Value           | Description                               |
| --------------- | ----------------------------------------- |
| (integer value) | Sets the amount of blur or effect applied |

## Details

Adding `&effectvalue` to a sender-side can take an integer. This can set the amount of blur (or effect) applied.

If not using `&effectvalue` you can change it dynamically via the settings menu.

![](<../.gitbook/assets/image (9) (2) (1).png>)

{% hint style="warning" %}
It's best to keep the value under 10 and using this flag disables the option to use the slider.
{% endhint %}

## Related

{% content-ref url="../source-settings/effects.md" %}
[effects.md](../source-settings/effects.md)
{% endcontent-ref %}
