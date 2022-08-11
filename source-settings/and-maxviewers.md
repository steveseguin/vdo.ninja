---
description: Limits the number of viewers allowed
---

# \&maxviewers

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&mv`

## Options

| Value                    | Description         |
| ------------------------ | ------------------- |
| (positive integer value) | max allowed viewers |

## Details

Useful for iOS devices that might explode if more than 3 video viewers connect.

Useful to prevent publicly shared guest links from being crashed due to too many viewer requests.

## Related

{% content-ref url="../advanced-settings/view-parameters/and-maxpublishers.md" %}
[and-maxpublishers.md](../advanced-settings/view-parameters/and-maxpublishers.md)
{% endcontent-ref %}

{% content-ref url="and-maxconnections.md" %}
[and-maxconnections.md](and-maxconnections.md)
{% endcontent-ref %}
