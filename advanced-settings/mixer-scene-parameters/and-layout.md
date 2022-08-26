---
description: >-
  Takes a JSON string representing how the video mixer should arrange video
  elements
---

# \&layout

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

| Value            | Description                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| (no value given) | Shows the guest the return feed (current layout) of the [Video Mixer](../../steves-helper-apps/video-mixer.md) |
| (JSON string)    | Defines the layout of a scene                                                                                  |

## Details

Adding `&layout` to a guest link shows the guest a return feed of the current mixer layout when using [vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer).

Takes a JSON string representing how the video mixer should arrange video elements. The string needed is based on the [vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) app's layout structure. Mainly used for development testing.

You can use [vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) to create JSON strings.

![](<../../.gitbook/assets/image (101) (1) (1) (1).png>)

## Related

{% embed url="https://vdo.ninja/alpha/mixer" %}
vdo.ninja/alpha/mixer
{% endembed %}
