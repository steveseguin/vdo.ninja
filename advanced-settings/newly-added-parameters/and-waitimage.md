---
description: >-
  You can add a custom image which shows up while waiting for the &scene or
  &view link
---

# \&waitimage

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&view`](../view-parameters/view.md))

## Options

| Value | Description              |
| ----- | ------------------------ |
| (URL) | Specifies a custom image |

## Details

This is for when waiting for the [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) link to load. You can add a custom image which shows up while waiting for the [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) link.

Example:\
[`https://vdo.ninja/?view=streamid&waitmessage=hello&waittimeout=0&waitimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Flogo_cropped.png`](https://vdo.ninja/?view=streamid\&waitmessage=hello\&waittimeout=0\&waitimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Flogo\_cropped.png)``

It fits to the screen, and [`&cover`](../view-parameters/cover.md) will have it 'cover' the screen.

It overrides [`&cleanoutput`](../design-parameters/cleanoutput.md).

## Related

{% content-ref url="and-waitmessage.md" %}
[and-waitmessage.md](and-waitmessage.md)
{% endcontent-ref %}

{% content-ref url="and-waittimeout.md" %}
[and-waittimeout.md](and-waittimeout.md)
{% endcontent-ref %}

{% content-ref url="../upcoming-parameters/and-bgimage.md" %}
[and-bgimage.md](../upcoming-parameters/and-bgimage.md)
{% endcontent-ref %}

{% content-ref url="../upcoming-parameters/and-background.md" %}
[and-background.md](../upcoming-parameters/and-background.md)
{% endcontent-ref %}
