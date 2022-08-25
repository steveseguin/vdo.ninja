---
description: Plays video back as a series of full-window images
---

# \&slideshow

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md),[`&solo`](and-solo.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Details

This option decodes incoming video (first video to load), but plays them back as series of full-window images. That is, a single image element, that gets updated 24 times a second, instead of playing the video back within an efficient video element. I have no idea why you might want this option, as it pretty crude up and uses up a lot of CPU, but you can right-click to save a single frame from the video to disk, as a PNG file. This might be useful if you need to take a lot of snap shots of some video and don't want to have to hassle with cropping a window-grab. Quality of the images is pretty high; near lossless.

![](<../../.gitbook/assets/image (120).png>)

## Related

{% content-ref url="and-postimage.md" %}
[and-postimage.md](and-postimage.md)
{% endcontent-ref %}
