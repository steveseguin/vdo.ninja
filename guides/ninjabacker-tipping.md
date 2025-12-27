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

Example (alpha):
`https://vdo.ninja/alpha/?push=mystream&tip=YOUR_TIP_ID`

### Viewers

Viewers must opt in with `&showtips` to see the tip UI:
`https://vdo.ninja/alpha/?view=mystream&showtips`

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
| `&tipcurrency=USD` | Viewer | Currency for the tip modal |

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

## Alpha notes

- Tipping is currently on `https://vdo.ninja/alpha` for testing
- Minimum tip amount is $1 (will likely increase after alpha)
- Commission is 0% (Stripe fees only)
- Commission may change in the future as NinjaBacker is a separate service
- Questions or feedback: reach out on Discord
