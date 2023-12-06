---
description: Will have the video holding div element be structured to the aspect ratio
---

# \&structure

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Details

`&structure` will have the video holding div element be structured to 16:9 (or whatever [`&aspectratio`](../video-parameters/and-aspectratio.md) is set to), making it easier to apply custom CSS backgrounds to videos.

It will have the label/border/margins align relative to the 16:9 holder element, rather than video itself.

Also related, you can also specify the background color independent of the border color with [`&color`](and-color.md). If using [`&border`](and-border.md), it will not set the background color, so you may need to use both `&border` and `&color`.

May not yet work with [`&forcedlandscape`](../mobile-parameters/and-forcelandscape.md) or [`&rotate`](and-rotate.md).

<figure><img src="../../.gitbook/assets/image (14) (2).png" alt=""><figcaption></figcaption></figure>

Updated `&structure` to work with [`&cover`](../view-parameters/cover.md), allowing for some more flexibility with controlling fixed aspect-ratios from the viewer/scene side.\
ie: `https://vdo.ninja/alpha/?room=XXXXX&scene&cover&structure&square&fakeguests=10`\
![](<../../.gitbook/assets/image (3) (1) (1) (1).png>)![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

## Related

{% content-ref url="../mixer-scene-parameters/and-locked.md" %}
[and-locked.md](../mixer-scene-parameters/and-locked.md)
{% endcontent-ref %}

{% content-ref url="and-color.md" %}
[and-color.md](and-color.md)
{% endcontent-ref %}

{% content-ref url="and-blur.md" %}
[and-blur.md](and-blur.md)
{% endcontent-ref %}

{% content-ref url="and-border.md" %}
[and-border.md](and-border.md)
{% endcontent-ref %}
