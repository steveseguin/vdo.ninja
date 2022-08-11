---
description: Option to change outbound video bitrate of the &meshcast parameter
---

# \&meshcastbitrate

Meshcast Option / Sender-Side Option! ([`&meshcast`](../newly-added-parameters/and-meshcast.md), [`&push`](../source-settings/push.md))

## Aliases

* `&mcbitrate`
* `&mcb`

## Options

| Value           | Description                               |
| --------------- | ----------------------------------------- |
| (integer value) | publishing meshcast video bitrate in kbps |

## Details

Adding `&meshcastbitrate` to the publisher's side together with [`&meshcast`](../newly-added-parameters/and-meshcast.md) gives the option to change the video bitrate for meshcast.

Example usage: `https://vdo.ninja/?meshcast&meshcastbitrate=2000`

Increased the default bitrate of [`&meshcast`](../newly-added-parameters/and-meshcast.md) from like 500-kbps to max of 3200-kbps; will probably change as the feature evolves and becomes more customizable.

## Related

{% content-ref url="../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="and-meshcastcodec.md" %}
[and-meshcastcodec.md](and-meshcastcodec.md)
{% endcontent-ref %}

{% content-ref url="and-meshcastab.md" %}
[and-meshcastab.md](and-meshcastab.md)
{% endcontent-ref %}
