---
description: Redirect to a page after hangup; optional delay
---

# \&endpage

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Also controls

* `&endpagetimer` — delay before redirecting (milliseconds)

## Options

Examples:

- `&endpage=https%3A%2F%2Fvdo.ninja%2Fthanks`
- `&endpage=/local/thankyou.html&endpagetimer=5000`

| Parameter        | Value     | Description                               |
| ---------------- | --------- | ----------------------------------------- |
| `&endpage`       | URL       | URL to redirect to after hangup           |
| `&endpagetimer`  | Integer ms| Delay before redirect (default 3000ms)    |

## Details

- When a session ends (hangup), VDO.Ninja shows a brief "hang-up complete" message, then redirects to the specified URL.
- `&endpagetimer` sets the delay; use `0` to redirect immediately.
- The URL can be absolute or relative and should be URL-encoded when containing special characters.

## Related

{% content-ref url="and-autoreload.md" %}
[and-autoreload.md](and-autoreload.md)
{% endcontent-ref %}

{% content-ref url="and-autoreload24.md" %}
[and-autoreload24.md](and-autoreload24.md)
{% endcontent-ref %}

