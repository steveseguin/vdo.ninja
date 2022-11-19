---
description: The same as &label, except it asks the user still for a user name
---

# \&labelsuggestion

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Aliases

* `&defaultlabel`
* `&ls`

## Options

| Value            | Description                                        |
| ---------------- | -------------------------------------------------- |
| (string)         | Sets the label if the user leaves the prompt blank |
| (no value given) | Asks the guest for a label                         |

## Details

`&labelsuggestion` is the same as [`&label`](../../general-settings/label.md), except it asks the user still for a user name. If they leave it blank or cancel the prompt asking for a name, it will use the default label.\
[https://vdo.ninja/?labelsuggestion=guest\&webcam](https://vdo.ninja/?labelsuggestion=guest\&webcam)

Once the user enters their label, `&label=username` is added to the URL, so if they reload, they won't be asked again for the label. `&label` takes priority over `&labelsuggestion`.

## Related

{% content-ref url="../../general-settings/label.md" %}
[label.md](../../general-settings/label.md)
{% endcontent-ref %}

{% content-ref url="../design-parameters/showlabels.md" %}
[showlabels.md](../design-parameters/showlabels.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-screensharelabel.md" %}
[and-screensharelabel.md](../../newly-added-parameters/and-screensharelabel.md)
{% endcontent-ref %}
