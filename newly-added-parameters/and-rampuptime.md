---
description: >-
  When a guest connects, this tries to load video from that guest for a few
  seconds, even if not yet added to a scene
---

# \&rampuptime

## Options

| Value           | Description        |
| --------------- | ------------------ |
| (integer value) | ramp up time in ms |

## Details

`&rampuptime=6000` is a sender-side parameter. Previously it was 4-seconds, but now it defaults to 6-seconds.

When a guest connects, this just tries to load video from that guest for a few seconds, even if not yet added to a scene. It helps the browser judge total bandwidth availability better, so bitrates can ramp up slightly faster later when actually added needed.

Related to this, the target bitrate for this ramp up period has been increased to 1500kbps, rather than 1000; this could already be changed with [`&preloadbitrate`](../advanced-settings/mixer-scene-parameters/and-preloadbitrate.md) (sender side), but based on feedback I'm nudging it up a bit.

## Related

{% content-ref url="../advanced-settings/mixer-scene-parameters/and-preloadbitrate.md" %}
[and-preloadbitrate.md](../advanced-settings/mixer-scene-parameters/and-preloadbitrate.md)
{% endcontent-ref %}
