---
description: Creates simulated guest videos
---

# \&fakeguests

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&fakefeeds`

## Options

Example: `&fakeguests=7`

| Value            | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| (integer number) | creates simulated guest videos, based on the value passed to the parameter |
| (no value given) | 4 fake guests added                                                        |

## Details

`&fakeguests=N` creates simulated guest videos, based on the value passed to the parameter, using real-guests where possible. The default value is 4.&#x20;

You can use this feature to help position and visualize what [`&cover`](../view-parameters/cover.md), [`&portrait`](../view-parameters/and-portrait.md), etc. looks like.

This doesn't yet support labels or layouts really, but I welcome feedback. Currently I just threw up a video of me, 16:9, of 500-kbps.

You don't actually need to create a room / scene to play with it.

Try it at: [https://vdo.ninja/?room=xxxxtestxxxx\&scene\&cover\&square\&fakeguests=7](https://vdo.ninja/?room=xxxxtestxxxx\&scene\&cover\&square\&fakeguests=7)

<figure><img src="../../.gitbook/assets/image (16) (1).png" alt=""><figcaption></figcaption></figure>

## Related

{% content-ref url="../view-parameters/cover.md" %}
[cover.md](../view-parameters/cover.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/scene.md" %}
[scene.md](../view-parameters/scene.md)
{% endcontent-ref %}
