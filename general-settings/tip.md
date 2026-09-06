---
description: Enables Ninja Backer tipping for a stream
---

# &tip

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Aliases

* `&tipsid`
* `&tipid`

## Options

Example: `&tip=YOUR_TIP_ID`

| Value    | Description                                 |
| -------- | ------------------------------------------- |
| (string) | Tip ID / overlay token from NinjaBacker     |

## Details

Enables Ninja Backer tipping for the sender. Viewers must opt in with `&showtips` to see the tip button (two-way opt-in). If `&tip`/`&tipsid` is present without a value, the setup modal appears.

{% hint style="warning" %}
`&tips` is reserved for the guest help-screen. For tipping, use `&tip` or `&tipsid`.
{% endhint %}

## Related parameters

- `&showtips` or `&supporttips` (viewer-side): show tip UI
- `&notipqr`: hide the QR overlay
- `&tipqrsize=200`: set QR size (default 150, min 100)
- `&tipamounts=1,5,10,25`: custom preset amounts
- `&tipcurrency=USD`: initial currency hint; the performer's verified currency wins
- `&tipserver=https://ninjabacker.com`: override the tip server (advanced)
- `&receivetips` or `&tipping`: show setup modal without an ID (legacy)

## Example links

Creator (keep this publishing link private):

```text
https://vdo.ninja/?push=mystream&tip=YOUR_TIP_ID
```

Viewer:

```text
https://vdo.ninja/?view=mystream&showtips
```

Replace both placeholders with your own stream ID and dashboard Tip ID. Share `https://ninjabacker.com/YOUR_USERNAME` as the public tip page, rather than sharing a private notification token.

Use **Send Test Tip** in the dashboard to test alerts without a charge. If a real payment succeeds but confirmation fails, **Retry Notification** retries confirmation without charging again.

## Guide

{% content-ref url="../guides/ninjabacker-tipping.md" %}
[ninjabacker-tipping.md](../guides/ninjabacker-tipping.md)
{% endcontent-ref %}
