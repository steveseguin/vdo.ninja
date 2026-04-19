---
description: Sets the video holder background color behind video tiles
---

# \&holdercolor

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Options

Example: `&holdercolor=00ff00` or `&holdercolor=green`

| Value                 | Description                                      |
| --------------------- | ------------------------------------------------ |
| (no value given)      | black video holder background                    |
| (HEX) \| (color name) | specifies the video holder background color      |
| `00ff00`              | green video holder background                    |

Aliases:

`&videobg`, `&videobgcolor`, `&videobackground`, `&videobackgroundcolor`, `&holderbg`, `&holderbgcolor`

{% hint style="danger" %}
Do not include the # character with the hex value.
{% endhint %}

## Details

`&holdercolor` sets the background color of the video holding element, using the CSS variable `--video-holder-color`.

This is the color behind or around video tiles, such as when a video is letterboxed, contained inside a structured layout, or otherwise does not fill its holder. It does not change the whole page background and it does not change pixels inside the camera/video stream.

For the page/chroma background, use [`&chroma`](chroma.md). For the video element's own background color, use [`&color`](and-color.md). For digital person segmentation over green, use `&greenscreen` or `&effects=4`.

## Related

{% content-ref url="and-color.md" %}
[and-color.md](and-color.md)
{% endcontent-ref %}

{% content-ref url="chroma.md" %}
[chroma.md](chroma.md)
{% endcontent-ref %}

{% content-ref url="and-structure.md" %}
[and-structure.md](and-structure.md)
{% endcontent-ref %}
