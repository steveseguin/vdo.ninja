---
description: The order priority of a source video when added to the video mixer
---

# \&order

Viewer-Side Option! ([`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&room`](../general-settings/room.md))

## Options

| Value                    | Description                         |
| ------------------------ | ----------------------------------- |
| (positive integer value) | Higher order, drawn first on screen |

## Details

The director can change this value remotely, changing the order of a video in a mixed scene of videos.\
![](<../.gitbook/assets/image (4) (1).png>)

If two videos have the same order value, the mixer will decide on its own which is drawn first of the two.

Order is Left to Right; Top to Bottom.

## Related

{% content-ref url="../newly-added-parameters/and-orderby.md" %}
[and-orderby.md](../newly-added-parameters/and-orderby.md)
{% endcontent-ref %}
