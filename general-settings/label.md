---
description: Sets a display name label
---

# \&label

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&l`

## Options

Example: `&label=Steve`

| Value            | Description                                        |
| ---------------- | -------------------------------------------------- |
| (no value given) | It will prompt the user for a Display Name on load |
| (string)         | Sets the label for the guest/browser tab           |

## Details

`&label` sets a display name label to the stream ID.

* Uses the label in OBS Studio if dragging the link into OBS Studio.
* Will change the name of the Browser tab to the Label specified.\
  ![](<../.gitbook/assets/image (141).png>)
* Shows up in the connection debug Stats window.\
  ![](<../.gitbook/assets/image (114) (2).png>)
* If left blank, it will prompt the user for a Display Name on load.\
  ![](<../.gitbook/assets/image (75) (1).png>)
* You can use [`&showlabels`](../advanced-settings/design-parameters/showlabels.md) to show the labels in the video sources.

## Related

{% content-ref url="../advanced-settings/design-parameters/showlabels.md" %}
[showlabels.md](../advanced-settings/design-parameters/showlabels.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-screensharelabel.md" %}
[and-screensharelabel.md](../newly-added-parameters/and-screensharelabel.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/setup-parameters/and-labelsuggestion.md" %}
[and-labelsuggestion.md](../advanced-settings/setup-parameters/and-labelsuggestion.md)
{% endcontent-ref %}
