---
description: Automatically end the session after a duration (ms)
---

# \&autoend

General Option! ([`&push`](../../source-settings/push.md))

## Options

Examples:

- `&autoend` (defaults to 10 minutes)
- `&autoend=300000` (5 minutes)

| Value         | Description                                     |
| ------------- | ----------------------------------------------- |
| Integer (ms)  | Milliseconds after which to auto-hangup         |

## Details

- Ends the publishing session automatically after the specified time (default 600000ms when present with no value).
- Often used for timeboxed publishing devices or unattended kiosks.
- Can be combined with [`&endpage`](and-endpage.md) for post-session redirect.

## Related

{% content-ref url="and-endpage.md" %}
[and-endpage.md](and-endpage.md)
{% endcontent-ref %}

