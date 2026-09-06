---
description: Accept tips with NinjaBacker.com inside VDO.Ninja
---

# Ninja Backer Tipping

## Overview

NinjaBacker.com is integrated into VDO.Ninja so performers can receive tips directly from viewers and room guests during streams.

It works with:
- Private P2P streams using a built-in tip button and modal
- Larger streams to YouTube/Twitch using the QR code overlay in OBS or scene/view links

Each performer also gets a standalone donation page, for example:
`https://ninjabacker.com/steveseguin`

## What viewers see

- "Send a Tip" button on the video (when `&showtips` is used)
- Tip modal with preset amounts and custom amount entry
- In-stream tip banner and chat notification when a tip lands
- Optional QR overlay for OBS/scene/view links

## How to use

### Performers

1. Register at `https://ninjabacker.com/register`
2. Create a username and connect your Stripe account
3. Copy your Tip ID from the dashboard
4. Add `&tip=YOUR_TIP_ID` to your push link

Example:
`https://vdo.ninja/?push=mystream&tip=YOUR_TIP_ID`

### Viewers

Viewers must opt in with `&showtips` to see the tip UI:
`https://vdo.ninja/?view=mystream&showtips`

## URL parameters

| Parameter | Side | Description |
| --- | --- | --- |
| `&tip=ID` | Sender | Enable tipping with your Tip ID or overlay token |
| `&tipsid=ID` | Sender | Same as `&tip` (recommended for overlay token) |
| `&showtips` | Viewer | Show tip UI (two-way opt-in) |
| `&supporttips` | Viewer | Alias for `&showtips` |
| `&notipqr` | Viewer | Hide the QR code overlay |
| `&tipqrsize=200` | Viewer | QR size in pixels (default 150, min 100) |
| `&tipamounts=1,5,10,25` | Viewer | Custom preset amounts |
| `&tipcurrency=USD` | Viewer | Initial currency hint; the performer's verified currency wins |

{% hint style="info" %}
Use `&tip` or `&tipsid` for tipping. The `&tips` parameter is a guest help-screen and is not the tipping feature.
{% endhint %}

## Account setup and testing

- Tip page: `https://ninjabacker.com/<username>`
- Dashboard: `https://ninjabacker.com` (sign in)
- Test tips: use "Send Test Tip" in the dashboard to trigger a fake tip notification without a real payment

## Profile avatars

Your tip page avatar uses Gravatar based on your Stripe email. Set one up at `https://gravatar.com` if you want a profile image.

## Developer features

Full developer docs are available at:
`https://ninjabacker.com/developers`

This includes webhook details, live tip notification pages, OBS overlay pages, and other integrations.

## Payment notes

- Tipping uses the sender's opt-in and the viewer's `&showtips` opt-in.
- Payment amounts and minimums use the performer's currency. JPY uses whole yen; other supported currencies use two decimals. The payment form enforces the server's limits.
- Commission is 0% (Stripe fees only)
- Commission may change in the future as NinjaBacker is a separate service
- Questions or feedback: reach out on Discord

## Third-party automation

Use the [developer guide](https://ninjabacker.com/developers) for signed webhooks, delivery retries, and SSE. Keep your Tip ID and OBS URL private. SSE is a live feed with no replay; use webhooks for durable automation. Accept a webhook only after signature verification and durable storage, deduplicate using `X-NinjaBacker-Delivery`, and ignore `isTest: true` for paid rewards.

If payment succeeds but confirmation fails, use **Retry Notification**; it does not charge again.

## Receipts and payment status

The checkout offers an optional receipt email address. Stripe receives this address to send the receipt; NinjaBacker does not retain it in tip history or send it to creator webhooks. Leaving it blank keeps the usual checkout flow.

The dashboard warns when Stripe needs account information or has disabled payments or payouts. Follow the Stripe Dashboard link to resolve those requirements. Adjusted tip totals exclude refunded amounts and disputed funds, before Stripe fees; recent tips show their refund and dispute status.

NinjaBacker periodically checks Stripe to recover missed payment confirmations and refresh refund/dispute status. It does not create another charge during recovery.

In the webhook settings, refresh delivery history to inspect recent attempts. Eligible failed or pending deliveries can be retried using the same delivery ID, so integrations must continue deduplicating that ID. Delivered events and events for an old destination cannot be replayed with this control.
