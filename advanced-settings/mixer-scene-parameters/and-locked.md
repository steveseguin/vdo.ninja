---
description: >-
  Will force a the VDO.Ninja's mixer output keep the mixed render contained to a
  specific aspect-ratio, regardless of the browser's window size
---

# \&locked

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md))

## Options

Example: `&locked=portrait`

<table><thead><tr><th width="294">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>landscape</code> | (no value given)</td><td>16:9 aspect ratio</td></tr><tr><td><code>portrait</code></td><td>9:16 aspect ratio</td></tr><tr><td><code>square</code></td><td>1:1 aspect ratio</td></tr><tr><td><code>1.77777</code></td><td>aspect ratio</td></tr></tbody></table>

## Details

`&locked` will force a the VDO.Ninja's mixer output keep the mixed render contained to a specific aspect-ratio, regardless of the browser's window size. (as seen in photo)\
![](<../../.gitbook/assets/image (189).png>)![](<../../.gitbook/assets/image (190).png>)

You'll get black bars (or whatever the background color is) as padding on the sides to force the inner video elements into the desired aspect ratio

When using `&locked`, the default aspect ratio is 16:9, but you can pass a floating point value for different aspect ratios, or use `landscape` (instead of 1.77777) / `portrait` / `square` as presets if needed.

Padding is centered, so the rendered video will be in the center of the screen. (tho using [`&widget`](../settings-parameters/and-widget.md) mode might break things though).

This `&locked` option is added to the Mixer App's WHIP/**Twitch publishing output option**, so regardless of window size, you'll get a 16:9 video render.

## Related



{% content-ref url="../design-parameters/and-structure.md" %}
[and-structure.md](../design-parameters/and-structure.md)
{% endcontent-ref %}

{% content-ref url="../video-parameters/and-aspectratio.md" %}
[and-aspectratio.md](../video-parameters/and-aspectratio.md)
{% endcontent-ref %}
