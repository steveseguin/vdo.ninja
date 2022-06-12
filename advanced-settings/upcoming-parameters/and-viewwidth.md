---
description: Does the same thing as &scale but you pass the height in pixels
---

# \&viewwidth

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&vw`

## Options

| Value           | Description           |
| --------------- | --------------------- |
| (value integer) | video width in pixels |

## Details

Added new viewer-side parameters that can be used in place of [`&scale`](../view-parameters/scale.md): [`&viewheight=180`](and-viewheight.md) and `&viewwidth=320`, which effectively does the same thing as [`&scale`](../view-parameters/scale.md), but instead you pass a resolution.&#x20;

It's important to note, that due to flexibility to request width/heights that are not aspect-ratio compatible, and due to bitrate/quality resolution limitations, these values are just 'max' target resolution values; the actual resolution you get could be still less. They also do not impact the actual capture resolution of the remote sender's camera, so its purely for requesting a specific downscaled resolution. This command applies to all video elements in a view port, and it disables the auto-scaler functionality.

Similarly, also added the option to the IFRAME API to request different down-scaled resolutions dynamically, per connection, if you want greater programmatic control vs static URL options.

![](<../../.gitbook/assets/image (105).png>)

![](<../../.gitbook/assets/image (104).png>)

## Related

{% content-ref url="and-viewheight.md" %}
[and-viewheight.md](and-viewheight.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/scale.md" %}
[scale.md](../view-parameters/scale.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-noscale.md" %}
[and-noscale.md](../../newly-added-parameters/and-noscale.md)
{% endcontent-ref %}
