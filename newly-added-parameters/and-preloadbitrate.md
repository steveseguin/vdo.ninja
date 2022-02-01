---
description: Can be used to change the pre-load target bitrate for scenes
---

# \&preloadbitrate

## Options

| Value           | Description                                    |
| --------------- | ---------------------------------------------- |
| (integer value) | specified video bitrate in kbps                |
| 0               | disables preloading the scene                  |
| -1              | allows for unlocked bitrates during preloading |

## Details

The `&preloadbitrate` flag can be used to change the pre-load target bitrate for scenes. You can set this higher or lower, or set to 0 to disable pre-loading all together. I'd strongly _avoid_ setting this to 0, as it can cause the video to stall out all together.

Videos not yet added to scene 1 will have the audio bitrate drop to 16-kbps. Scene 1 has always been special, as the video preloads there, so the quality ramps up immediately and guests appear immediately. Other scenes (>1) or custom scenes will need to ramp up from 0 bitrate, which can take some time to load and ramp up, but this is needed -- can't have every scene pre-loaded else things get overloaded.

You can override all this logic I'm using for pre-loading bitrates of videos in scenes now with `&preloadbitrate=500` or whatever, where the value is in kbps.\
`0` disables preloading the scene.\
`-1` allows for unlocked bitrates during preloading.

## Related

{% content-ref url="../advanced-settings/view-parameters/scene.md" %}
[scene.md](../advanced-settings/view-parameters/scene.md)
{% endcontent-ref %}

{% content-ref url="and-hiddenscenebitrate.md" %}
[and-hiddenscenebitrate.md](and-hiddenscenebitrate.md)
{% endcontent-ref %}
