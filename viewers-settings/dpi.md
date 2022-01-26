---
description: Override the automatically selected Device Pixel Ratio
---

# \&dpi

## Aliases

* `&dpr`

## Options

| Value             | Description                 |
| ----------------- | --------------------------- |
| 1                 | Set Device Pixel Ratio to 1 |
| 2                 | Set Device Pixel Ratio to 2 |
| 3                 | Set Device Pixel Ratio to 3 |
| (integer value X) | Set Device Pixel Ratio to X |

## Details

This allows a user to override the automatically selected Device Pixel Ratio value. It is often either 1 or 2 by default, depending on your display's DPI setting.

An accurate DPI value is important for calculating the correct requested resolution of a video. For high density displays, you'll want to have a higher resolution of video, especially in the case of the Electron Capture app, where the reported resolution isn't the same as the displayed resolution.\
\
Changing this value can provide for higher quality or lower quality video on playback, a bit like changing the [`&scale`](scale.md) value, but dynamic to the current window-size of the video being played back.

## Related

{% content-ref url="scale.md" %}
[scale.md](scale.md)
{% endcontent-ref %}
