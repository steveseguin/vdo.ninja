---
description: The stream ID that you are publishing with will be the defined value
---

# \&push

Sender-Side Option!

## Aliases

* `&permaid`

## Options

| Value    | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| (string) | 1 to 49-characters long: aLphaNumEric-characters; case sensitive. |

## Details

If the parameter is not provided, a randomly generated stream ID will be used instead.\
This is a useful parameter if you wish to reuse an invite link or if you refresh the page often.\
The value needs to be 1 to 24-characters long: `aLphaNumEric-characters`; case sensitive.\
If left empty, the stream ID will default to a random one.

{% hint style="info" %}
If the stream ID is already in active use, an error will be shown and the stream will not publish.
{% endhint %}

## Related

{% content-ref url="../advanced-settings/view-parameters/view.md" %}
[view.md](../advanced-settings/view-parameters/view.md)
{% endcontent-ref %}
