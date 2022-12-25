---
description: Defines the stream(s) you are receiving, by their stream IDs
---

# \&view

Viewer-Side Option! ([`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&streamid`
* `&pull`
* `&v`

## Options

| Value            | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| (string value)   | streamid to view; can be a comma-separated list of ids           |
| (no value given) | in a room, you don't see any other guests including the director |

## Details

`&view` defines the stream or streams you are receiving, by their stream IDs.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)

Optional if you are publishing a stream using [`&push`](../../source-settings/push.md).\
If the `&view` parameter is not added, the default behaviour will occur.\
If the `&view` parameter is provided, it will try to play any stream listed.\
If the `&view` parameter is provided, but no values are provided, no streams will play; only publishing will be allowed.

This is useful is you wish to publish a video into a group chat room, but only view video from specific known participants.\
This is also useful if you wish to create ad-hoc group chat sessions without using a group room.\
Videos will auto-load when they are available if not already.

You can use `&view` in a room combined with [`&scene`](scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md) to watch one or more specified video feeds of the room:\
`https://vdo.ninja/?room=roomname&scene&view=streamid1,streamid2`

## Related

{% content-ref url="../../getting-started/two-person-chat.md" %}
[two-person-chat.md](../../getting-started/two-person-chat.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/push.md" %}
[push.md](../../source-settings/push.md)
{% endcontent-ref %}

{% content-ref url="scene.md" %}
[scene.md](scene.md)
{% endcontent-ref %}

{% content-ref url="../mixer-scene-parameters/and-include.md" %}
[and-include.md](../mixer-scene-parameters/and-include.md)
{% endcontent-ref %}
