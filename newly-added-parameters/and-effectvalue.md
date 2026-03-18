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

When a user manually adjusts the effect amount via the slider, the value is automatically saved to localStorage per room and streamID. On the next visit to the same room or stream, the saved value is restored as the default. Setting `&effectvalue` explicitly in the URL will override any saved preference.

![](<../.gitbook/assets/image (9) (2) (1).png>)

{% hint style="warning" %}
It's best to keep the value under 10 and using this flag disables the option to use the slider.
{% endhint %}

`&effectvalue=1.2` will now work with `&zoom` ([`&effects=7`](../source-settings/effects.md#options)), so you can trigger the camera to digitally zoom in on load.

## Related

{% content-ref url="../source-settings/effects.md" %}
[effects.md](../source-settings/effects.md)
{% endcontent-ref %}
