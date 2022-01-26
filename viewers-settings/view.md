---
description: Defines the stream or streams you are receiving, by their stream IDs
---

# \&view

## Aliases

* `&streamid`
* `&v`
* `&pull`

## Options

| Value          | Description                                            |
| -------------- | ------------------------------------------------------ |
| (string value) | streamid to view; can be a comma-separated list of ids |

## Details

Optional if you are publishing a stream using [`&push`](../source-settings/push.md).\
If the `&view` parameter is not added, the default behaviour will occur.\
If the `&view` parameter is provided, it will try to play any stream listed.\
If the `&view` parameter is provided, but no values are provided, no streams will play; only publishing will be allowed.

This is useful is you wish to publish a video into a group chat room, but only view video from specific known participants.\
This is also useful if you wish to create ad-hoc group chat sessions without using a group room.\
Videos will auto-load when they are available if not already.

## Related

{% content-ref url="../source-settings/push.md" %}
[push.md](../source-settings/push.md)
{% endcontent-ref %}
