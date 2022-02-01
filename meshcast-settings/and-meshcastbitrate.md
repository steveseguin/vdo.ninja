---
description: Option to change outbound video bitrate of the &meshcast parameter
---

# \&meshcastbitrate

## Aliases

* `&mcbitrate`
* `&mcb`

## Options

| Value           | Description                               |
| --------------- | ----------------------------------------- |
| (integer value) | publishing meshcast video bitrate in kbps |

## Details

Adding `&meshcastbitrate` to the publisher's side together with [`&meshcast`](and-meshcast.md) gives the option to change the video bitrate for meshcast.

Example usage: `https://vdo.ninja/?meshcast&mccodec=vp9&meshcastbitrate=500`

Increased the default bitrate of [`&meshcast`](and-meshcast.md) from like 500-kbps to max of 3200-kbps; will probably change as the feature evolves and becomes more customizable.

## Related

{% content-ref url="and-meshcast.md" %}
[and-meshcast.md](and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="and-meshcastcodec.md" %}
[and-meshcastcodec.md](and-meshcastcodec.md)
{% endcontent-ref %}

{% content-ref url="and-meshcastab.md" %}
[and-meshcastab.md](and-meshcastab.md)
{% endcontent-ref %}
