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
- `&tipcurrency=USD`: set currency for the tip modal
- `&tipserver=https://ninjabacker.com`: override the tip server (advanced)
- `&receivetips` or `&tipping`: show setup modal without an ID (legacy)

## Guide

{% content-ref url="../guides/ninjabacker-tipping.md" %}
[ninjabacker-tipping.md](../guides/ninjabacker-tipping.md)
{% endcontent-ref %}
