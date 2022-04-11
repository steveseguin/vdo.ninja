---
description: >-
  Specifies a delay for &waitimage and &waitmessage while waiting for the &scene
  link
---

# \&waittimeout

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Options

| Value           | Description |
| --------------- | ----------- |
| (integer value) | Delay in ms |

## Details

This is for when waiting for the [`&scene`](../view-parameters/scene.md) link to load. It specifies a delay for [`&waitimage`](and-waitimage.md) and [`&waitmessage`](and-waitmessage.md) while waiting for the [`&scene`](../view-parameters/scene.md) link.

Example:\
[`https://vdo.ninja/?waitmessage=hello&view=N2iLdiZ&waittimeout=0&waitimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Flogo_cropped.png`](https://vdo.ninja/?waitmessage=hello\&view=N2iLdiZ\&waittimeout=0\&waitimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Flogo\_cropped.png)``

It overrides [`&cleanoutput`](../design-parameters/cleanoutput.md).

## Related

{% content-ref url="and-waitimage.md" %}
[and-waitimage.md](and-waitimage.md)
{% endcontent-ref %}

{% content-ref url="and-waitmessage.md" %}
[and-waitmessage.md](and-waitmessage.md)
{% endcontent-ref %}
