---
description: Disables the publishing resolution from being capped
---

# \&noscale

## Aliases

* `&noscaling`

## Details

Adding `&noscale` to a publisher-side flag just disables the publishing resolution from being capped when the target bitrate is very low (600-kbps and under). This doesn't impact screen shares and a couple different basic modes, as they bypass this optimization logic already.

## Related

{% content-ref url="../viewer-parameters/scale.md" %}
[scale.md](../viewer-parameters/scale.md)
{% endcontent-ref %}
