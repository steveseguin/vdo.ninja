---
description: Bearer token for sharing an external WHEP source
---

# \&whepsharetoken

Sender-Side Option! ([`&whepshare`](and-whepshare.md))

## Aliases

* `&whepsrctoken`

## Options

Example: `&whepsharetoken=YOUR_BEARER_TOKEN`

| Value   | Description                         |
| ------- | ----------------------------------- |
| String  | WHEP source bearer auth token       |

## Details

- Supplies an auth token to accompany the WHEP URL specified by [`&whepshare`](and-whepshare.md).
- If omitted, you can be prompted to enter a token when joining, if needed.
- Token values are passed as `Authorization: Bearer ...` metadata for viewers that consume the advertised WHEP endpoint.

## Related

{% content-ref url="and-whepshare.md" %}
[and-whepshare.md](and-whepshare.md)
{% endcontent-ref %}
