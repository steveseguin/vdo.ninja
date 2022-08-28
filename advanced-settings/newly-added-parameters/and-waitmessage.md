---
description: >-
  You can add a custom message which shows up while waiting for the &scene or
  &view link
---

# \&waitmessage

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&view`](../view-parameters/view.md))

## Options

| Value    | Description         |
| -------- | ------------------- |
| (string) | Specifies a message |

## Details

This is for when waiting for the [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) link to load. You can add a custom message which shows up while waiting for the [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) link.

Example:\
[`https://vdo.ninja/?view=streamid&waitmessage=hello&waittimeout=0&waitimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Flogo_cropped.png`](https://vdo.ninja/?view=streamid\&waitmessage=hello\&waittimeout=0\&waitimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Flogo\_cropped.png)``

It overrides [`&cleanoutput`](../design-parameters/cleanoutput.md).

## Related

{% content-ref url="and-waitimage.md" %}
[and-waitimage.md](and-waitimage.md)
{% endcontent-ref %}

{% content-ref url="and-waittimeout.md" %}
[and-waittimeout.md](and-waittimeout.md)
{% endcontent-ref %}
