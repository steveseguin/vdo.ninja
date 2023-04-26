---
description: Sets the background for the website to a particular hex color
---

# \&chroma

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Options

Example: `&chroma=F0F`

| Value            | Description             |
| ---------------- | ----------------------- |
| (no value given) | green background        |
| `F0F`            | any RGB format color    |
| `DEDEDE`         | any RRGGBB format color |

{% hint style="info" %}
Use it to chroma-key out the background on the Electron Capture app.
{% endhint %}

{% hint style="danger" %}
Do not include the # character with the hex value.
{% endhint %}

Can be 3 or 6 characters in length, 0 to F, in RGB or RRGGBB format.

[https://vdo.ninja/?scene\&room=roomname\&chroma](https://vdo.ninja/?scene\&room=roomname\&chroma)\
![](<../../.gitbook/assets/image (3) (1) (1) (2) (2).png>)

See [`&color`](and-color-alpha.md) if you want to set the background color of one single video feed.

## Related

{% content-ref url="and-color-alpha.md" %}
[and-color-alpha.md](and-color-alpha.md)
{% endcontent-ref %}

{% content-ref url="and-transparent.md" %}
[and-transparent.md](and-transparent.md)
{% endcontent-ref %}

{% content-ref url="and-background.md" %}
[and-background.md](and-background.md)
{% endcontent-ref %}
