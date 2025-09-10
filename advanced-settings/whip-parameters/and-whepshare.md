---
description: Share an external WHEP source to viewers
---

# \&whepshare

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&whepsrc`

## Options

Example:

`&whepshare=https%3A%2F%2Fwhep.example.com%2Fpath`  or prompt without a value

| Value | Description                     |
| ----- | ------------------------------- |
| URL   | WHEP source endpoint to share   |

## Details

- Instead of sending your local camera/mic, instructs viewers to fetch and play the specified WHEP endpoint as your published media.
- Use with [`&whepsharetoken`](and-whepsharetoken.md) if the WHEP source requires a bearer token.
- If no value is provided, you’ll be prompted to enter the WHEP URL on join.

## Related

{% content-ref url="and-whepsharetoken.md" %}
[and-whepsharetoken.md](and-whepsharetoken.md)
{% endcontent-ref %}

