---
description: >-
  Accepts the special token without needing to specify the cloudflare.vdo.ninja
  part if using &whipout instead
---

# \&cftoken (alpha)

[WHIP Option](../../steves-helper-apps/whip-and-whep-tooling.md) / Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\***ALPHA-ONLY** - Only available at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&cft`

## Options

Example: `&cftoken=token`

<table><thead><tr><th width="154">Value</th><th>Description</th></tr></thead><tbody><tr><td>(string value)</td><td>Accepts the special token without needing to specify the cloudflare.vdo.ninja part if using <a href="and-whipout.md"><code>&#x26;whipout</code></a> instead</td></tr></tbody></table>

## Details

If using a cloudflare.com WHIP URL on the sender side, I'll guess at the WHEP link - seems to be working so far. (built this logic into VDO.Ninja directly and works automatically). This of course still implies a unique whip URL per guest.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

To make using Cloudflare easier though, I've also created the WHIP end point `cloudflare.vdo.ninja`, which takes a Cloudflare API token, instead of a stream token.

This special end point will auto-create a unique WHEP URL. The official cloudflare.com whip endpoint can only be used by one sender at a time, but this API special endpoint and token approach can be used by many senders at a time. It automatically generates unique WHIP/WHEP when used, in the same way Meshcast does, so no need for unique invite urls per guest.

I've created a page to generate the required special api token; the page also provides further information on this all: [https://vdo.ninja/alpha/cloudflare](https://vdo.ninja/alpha/cloudflare)

`&cftoken` accepts the special token without needing to specify the cloudflare.vdo.ninja part if using [`&whipout`](and-whipout.md) instead.

I focused mainly on adding Cloudflare support first, as it has good pricing for its WHIP/WHEP service, it doesn't require deploying anything, and it has a lot of features (RTMP, SRT, recording, API). It's not 100% cooked yet though, so it's just on alpha currently for testing.

## Related

{% content-ref url="../../steves-helper-apps/whip-and-whep-tooling.md" %}
[whip-and-whep-tooling.md](../../steves-helper-apps/whip-and-whep-tooling.md)
{% endcontent-ref %}

{% content-ref url="and-whipout.md" %}
[and-whipout.md](and-whipout.md)
{% endcontent-ref %}
