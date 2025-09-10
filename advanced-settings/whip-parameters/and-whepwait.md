---
description: Control WHEP ICE candidate collection wait time (ms)
---

# \&whepwait

WH(E)P Option! ([`&whep`](../whip-parameters/and-whip.md))

## Aliases

* `&whepicewait`

## Options

Example: `&whepwait=2000`

| Value        | Description                                      |
| ------------ | ------------------------------------------------ |
| Integer (ms) | How long to wait to gather ICE candidates        |

## Details

- Sets the WHEP ICE gather wait duration before proceeding. `0` means proceed immediately.
- Useful for fine-tuning connectivity in constrained networks.

## Related

{% content-ref url="and-whipwait.md" %}
[and-whipwait.md](and-whipwait.md)
{% endcontent-ref %}

