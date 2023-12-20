---
description: Option to change codec of the WHIP while screen-sharing
---

# \&whipoutscreensharecodec

[WHIP Option](../../steves-helper-apps/whip-and-whep-tooling.md) / Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&wosscodec`

## Options

Example: `&whipoutscreensharecodec=h264`

<table><thead><tr><th width="234">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>h264</code></td><td>h264 codec</td></tr><tr><td><code>vp8</code></td><td>vp8 codec</td></tr><tr><td><code>vp9</code></td><td>vp9 codec</td></tr><tr><td><code>42e01f</code></td><td>open h264 codec</td></tr><tr><td>(xxxxxx)</td><td>h264 profile IDs</td></tr></tbody></table>

## Details

Adding `&whipoutscreensharecodec` to the publisher's side gives the option to change the publishing codec while screen-sharing via WHIP.

There's 4 codec options currently, including the default option:

* The unspecified default, which is software h264.&#x20;
* There's also `h264`, which is what the browser then sets. This could include hardware encoding, but that will not work with Firefox or Safari viewers then.&#x20;
* `vp8` is pretty compatible, so if the default codec doesn't work, you can try that.&#x20;
* `vp9` is also available, which has better compression/quality, but not fully compatible with all devices.&#x20;
* av1 and SVC are not yet supported, but that is planned at some point.

## Related

{% content-ref url="../../steves-helper-apps/whip-and-whep-tooling.md" %}
[whip-and-whep-tooling.md](../../steves-helper-apps/whip-and-whep-tooling.md)
{% endcontent-ref %}

{% content-ref url="and-whip.md" %}
[and-whip.md](and-whip.md)
{% endcontent-ref %}

{% content-ref url="and-whipoutcodec.md" %}
[and-whipoutcodec.md](and-whipoutcodec.md)
{% endcontent-ref %}
