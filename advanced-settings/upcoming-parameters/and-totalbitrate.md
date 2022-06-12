---
description: Sets both &maxtotalscenebitrate and &totalroombitrate flags
---

# \&totalbitrate

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md))\
\* on [https://vdo.ninja/beta/](https://vdo.ninja/beta/)

## Aliases

* `&tb`

## Options

| Value           | Description                                  |
| --------------- | -------------------------------------------- |
| (integer value) | max. video bitrate in kbps a scene/room uses |

## Details

Optional if you are publishing a stream using [`&push`](../../source-settings/push.md).\
If the `&view` parameter is not added, the default behaviour will occur.\
If the `&view` parameter is provided, it will try to play any stream listed.\
If the `&view` parameter is provided, but no values are provided, no streams will play; only publishing will be allowed.

This is useful is you wish to publish a video into a group chat room, but only view video from specific known participants.\
This is also useful if you wish to create ad-hoc group chat sessions without using a group room.\
Videos will auto-load when they are available if not already.

## Related

{% content-ref url="../../newly-added-parameters/and-maxtotalscenebitrate.md" %}
[and-maxtotalscenebitrate.md](../../newly-added-parameters/and-maxtotalscenebitrate.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/totalroombitrate.md" %}
[totalroombitrate.md](../view-parameters/totalroombitrate.md)
{% endcontent-ref %}
