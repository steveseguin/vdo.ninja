---
description: The order priority of a source video when added to the video mixer
---

# \&order

Sender-Side Option! ([`&push`](push.md), [`&room`](../general-settings/room.md))

## Options

Example: `&order=3`

| Value                    | Description                         |
| ------------------------ | ----------------------------------- |
| (positive integer value) | Higher order, drawn first on screen |

## Details

Videos in the auto-mixer are normally sorted by default by their connection ID, but assigning a mix-order value to a video will order it based on that mix value instead.  If not set manually via the `&order` parameter, the mix order value will be zero.\
\
The director can change this value dynamically for each guest; they can change the order of a guest via the `Mix Order` option in the director's room. If wanting to pre-assign the mix-order value though, the `&order` option can be useful, such as when wanting to ensure the main host of a stream is always first in the video mix layout.\
\
The mixer order takes priority over `&orderby`, but the mix order has no effect if using a custom layout, such as when using a custom \&layout or via the mixer app.\
\
![](<../.gitbook/assets/image (4) (1) (3).png>)

If two videos have the same order value, the mixer will decide on its own which is drawn first of the two.

Order is Left to Right; Top to Bottom.\
\
The mix order value for a guest/video source is synced with all other guests/scenes/viewers, so changing it will impact how others see the mix order as well.

## Related

{% content-ref url="../newly-added-parameters/and-orderby.md" %}
[and-orderby.md](../newly-added-parameters/and-orderby.md)
{% endcontent-ref %}
