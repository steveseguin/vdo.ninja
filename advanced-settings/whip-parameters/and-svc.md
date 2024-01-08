---
description: >-
  Useful for publishing to WHIP broadcast servers that support scalable video
  modes
---

# \&svc

[WHIP Option](../../steves-helper-apps/whip-and-whep-tooling.md) / Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&scalabilitymode`

## Options

Example: `&svc=L1T3`

<table><thead><tr><th width="167">Value</th><th>Description</th></tr></thead><tbody><tr><td>(SVC value)</td><td>Takes an SVC value, with <code>L1T3</code> being the most universal option, but other options exist</td></tr></tbody></table>

## Details

`&svc` is useful for publishing to WHIP broadcast servers that support scalable video modes. Takes an SVC value, with `L1T3` being the most universal option, but other options exist. You'll get an error when publishing if you use an invalid one.

<div align="left">

<figure><img src="../../.gitbook/assets/image.png" alt="" width="375"><figcaption></figcaption></figure>

</div>

There are SVC scalable options to the WHIP output option on [https://vdo.ninja/whip](https://vdo.ninja/whip), making it easy to select a compatible SVC mode if desired.

Experiment with this feature here:\
[https://webrtc.github.io/samples/src/content/extensions/svc/](https://webrtc.github.io/samples/src/content/extensions/svc/)

## Related

{% content-ref url="../../steves-helper-apps/whip-and-whep-tooling.md" %}
[whip-and-whep-tooling.md](../../steves-helper-apps/whip-and-whep-tooling.md)
{% endcontent-ref %}

{% embed url="https://vdo.ninja/whip" %}
