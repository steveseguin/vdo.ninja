---
description: Shows only the last added video to a scene
---

# \&scenetype

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md))

## Aliases

* `&type`

## Options

Example: `&scenetype=2`

<table><thead><tr><th width="200">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code></td><td>just shows the last guest that was added in the scene, but doesn't mute the previous guests</td></tr><tr><td><code>2</code></td><td>just shows the last guest that was added in the scene</td></tr><tr><td><code>3</code></td><td>the general idea is it will only show the video that is in a particular ordered position (default, position = 1), rather than all the videos in the scene</td></tr></tbody></table>

## Details

You can change the behaviour of scenes a bit with this parameter.

`&scenetype` can be set to `1` or `2`, which overrides the default scene state.

Scene state of 1 and 2 will only show the last video added to a group scene. `&scenetype=2` will mute the other videos, while `&scenetype=1` will not mute previously added videos.

`&scenetype=3` - Usage is like this: `&scene&room=roomname&scenetype=3&order=1` , where [`&order=N`](../../source-settings/order.md) is optional. This feature isn't set in stone yet, but the general idea is it will only show the video that is in a particular ordered position (default, position = 1), rather than all the videos in the scene. When someone leaves, the spots are recalculated. The order that the positions are based on is calculated via alphanumeric sorting of connection IDs, though I wish to improve this to be probably sync with the director's order. Anyways, this feature was a result of a user request.

This URL parameter option is a bit of a hack currently and may be replaced in the future.

This parameter is added to scene view links.

## Related

{% content-ref url="../view-parameters/scene.md" %}
[scene.md](../view-parameters/scene.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/order.md" %}
[order.md](../../source-settings/order.md)
{% endcontent-ref %}
