---
description: Control WHIP ICE candidate collection wait time (ms)
---

# \&whipwait

WHIP Option! ([`&whipout`](and-whipout.md), [`&whipview`](and-whip.md))

## Aliases

* `&whipicewait`

## Options

Example: `&whipwait=2000`

| Value        | Description                                      |
| ------------ | ------------------------------------------------ |
| Integer (ms) | How long to wait to gather ICE candidates        |

## Details

- Sets the WHIP ICE gather wait duration before proceeding. `0` means proceed immediately.
- Used on both ingest and playback flows as applicable.

## Related

{% content-ref url="and-whepwait.md" %}
[and-whepwait.md](and-whepwait.md)
{% endcontent-ref %}

