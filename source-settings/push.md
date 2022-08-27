---
description: The stream ID that you are publishing with will be the defined value
---

# \&push

Sender-Side Option! ([`&room`](../general-settings/room.md))

## Aliases

* `&permaid`
* `&id`

## Options

| Value            | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| (no value given) | creates a randomly generated stream ID                            |
| (string)         | 1 to 49-characters long: aLphaNumEric-characters; case sensitive. |

## Details

`&push` is the parameter that tells VDO.Ninja to be a publisher.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)

If the parameter is not provided, a randomly generated stream ID will be used instead.\
[https://vdo.ninja/?push](https://vdo.ninja/?push)

This is a useful parameter if you wish to reuse an invite link or if you refresh the page often.\
The value needs to be 1 to 24-characters long: `aLphaNumEric-characters`; case sensitive.\
If left empty, the stream ID will default to a random one.

{% hint style="info" %}
If the stream ID is already in active use, an error will be shown and the stream will not publish.
{% endhint %}

If using a [`&room`](../general-settings/room.md) URL and not using [`&scene`](../advanced-settings/view-parameters/scene.md) or [`&solo`](../advanced-settings/upcoming-parameters/and-solo.md), VDO.Ninja will automatically generate a `&push` ID.

## Related

{% content-ref url="../advanced-settings/view-parameters/view.md" %}
[view.md](../advanced-settings/view-parameters/view.md)
{% endcontent-ref %}
