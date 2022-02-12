---
description: Rounds the edges of videos
---

# \&rounded

## Options

| Value                    | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| (no value given)         | 50 px                                                |
| (positive integer value) | the higher the number, the more aggressive the curve |

## Details

This is a stylistic effect; it attempts to apply rounded edges to videos (crop-based).

The default value is 50-pixels. You can pass other integer values to customize the amount of curving; the higher the number, the more aggressive the curve.

This works great for solo-video streams where the video fits the window fully, but may not round the edges of videos that do not fit their container area. To compensate for this, using the [`&cover`](../mixer-scene-parameters/cover.md) command as well can force the video to fit the window, and hence, have the rounded edges applied correctly.\
\
An example of an aggressive rounded effect is with the following parameters: \
`https://vdo.ninja/?view=streamID123&cover&rounded=1000`

![](<../../.gitbook/assets/image (79).png>)

## Related

{% content-ref url="../mixer-scene-parameters/cover.md" %}
[cover.md](../mixer-scene-parameters/cover.md)
{% endcontent-ref %}
