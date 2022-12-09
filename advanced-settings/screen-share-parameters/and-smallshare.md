---
description: Makes the screen share behave like a webcam share
---

# \&smallshare

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&solo`](../mixer-scene-parameters/and-solo.md)) \*on alpha

## Details

`&smallshare` makes the screen share behave like a webcam share. ie: not larger in size vs other windows, for the publisher or the viewers. This is a push-side parameter. This is useful if a VR guests screen sharing an app of themselves, versus using a virtual camera. It can also be useful for gaming, where a larger screen share might bog down the system of the sender more than needed.

Layout if using `&smallshare`:\
![](<../../.gitbook/assets/image (100).png>)

Layout if NOT using `&smallshare`:\
![](<../../.gitbook/assets/image (121) (1).png>)

### On alpha

`&smallshare` will work on the scene-side now also, which disables the automixer's larger screen share layout, and instead just uses an equal-sized video layout for all videos.

## Related

{% content-ref url="../../source-settings/screenshare.md" %}
[screenshare.md](../../source-settings/screenshare.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-screensharetype.md" %}
[and-screensharetype.md](../../newly-added-parameters/and-screensharetype.md)
{% endcontent-ref %}
