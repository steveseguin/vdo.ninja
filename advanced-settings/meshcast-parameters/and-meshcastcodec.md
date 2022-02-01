---
description: Option to change codec of the &meshcast parameter
---

# \&meshcastcodec

## Aliases

* `&mccodec`

## Options

| Value      | Description      |
| ---------- | ---------------- |
| h264       | h264 codec       |
| vp8        | vp8 codec        |
| vp9        | vp9 codec        |
| 42e01f\*   | open h264 codec  |
| (xxxxxx)\* | h264 profile IDs |

\*on beta

## Details

Adding `&meshcastcodec` to the publisher's side together with [`&meshcast`](and-meshcast.md) gives the option to change the publishing codec for meshcast.

Example usage: `https://vdo.ninja/?meshcast&meshcastcodec=vp9&mcbitrate=500`

There's 4 codec options currently, including the default option:

* The unspecified default, which is software h264.&#x20;
* There's also `h264`, which is what the browser then sets. This could include hardware encoding, but that will not work with Firefox or Safari viewers then.&#x20;
* `vp8` is pretty compatible, so if the default codec doesn't work, you can try that.&#x20;
* `vp9` is also available, which has better compression/quality, but not fully compatible with all devices.&#x20;
* av1 and svc are not yet supported, but that is planned at some point.

## Related

{% content-ref url="and-meshcast.md" %}
[and-meshcast.md](and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="and-mcscreensharecodec.md" %}
[and-mcscreensharecodec.md](and-mcscreensharecodec.md)
{% endcontent-ref %}

{% content-ref url="../viewer-parameters/codec.md" %}
[codec.md](../viewer-parameters/codec.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-h264profile.md" %}
[and-h264profile.md](../newly-added-parameters/and-h264profile.md)
{% endcontent-ref %}
