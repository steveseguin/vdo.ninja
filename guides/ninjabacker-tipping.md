---
description: Set up Ninja Backer tips in VDO.Ninja, add OBS alerts, and connect third-party notifications.
---

# Ninja Backer Tipping

[Ninja Backer](https://ninjabacker.com) lets creators receive tips through Stripe using a public tip page or VDO.Ninja's built-in tip button. Viewers can enter a preset or custom amount, a name and message, and an optional receipt email.

## Set up your creator account

1. [Register with Ninja Backer](https://ninjabacker.com/register), choose a username, and connect Stripe.
2. Complete Stripe's requirements so your account can accept payments. Check the Ninja Backer dashboard for any account warnings.
3. Copy your **Tip ID** from the dashboard and add it to your VDO.Ninja publishing link.
4. Add `&showtips` to the viewing link so viewers can see the tip controls.

For an existing link that already contains `?`, append parameters with `&`. Replace the example stream ID and `YOUR_TIP_ID` with your own values.

Creator's publishing link:

```text
https://vdo.ninja/?push=mystream&tipsid=YOUR_TIP_ID
```

Viewer's link:

```text
https://vdo.ninja/?view=mystream&showtips
```

`&tip=YOUR_TIP_ID` and `&tipid=YOUR_TIP_ID` are aliases for `&tipsid=YOUR_TIP_ID`. Using `&tipsid` without a value opens the setup dialog.

{% hint style="info" %}
Tipping uses two-way opt-in: the creator enables it on their publishing link, and the viewer enables `&showtips`. The separate `&tips` parameter displays guest help; it does not enable payments.
{% endhint %}

Your public tip page is `https://ninjabacker.com/YOUR_USERNAME`. Share that page with supporters. Keep the dashboard Tip ID and token-bearing OBS/notification URLs private; they provide access to the notification feed. A creator's publishing link also contains their private stream information and should not be distributed as a viewing link.

## Rooms and OBS

For rooms, append `&tipsid=YOUR_TIP_ID` to the tipping creator's guest publishing link. Add `&showtips` to the receiving VDO.Ninja view or scene link where the tip UI is wanted. Each tipping creator uses their own Tip ID.

For OBS, you can use either or both of these options:

- **Tip controls and QR code on a VDO.Ninja view:** use the viewing link with `&showtips` as your browser source. Viewers watching a broadcast can scan the QR code to open the creator's tip page.
- **Separate tip alerts:** copy the OBS overlay URL from the Ninja Backer dashboard into an OBS browser source. This displays incoming tip notifications separately from the video. Keep this URL private.

A button inside a broadcast video is not clickable by the broadcast audience. Share your public tip-page link in your stream description or chat as well.

## URL parameters

| Parameter | Where to use it | Effect |
| --- | --- | --- |
| `&tipsid=ID` | Creator's publishing link | Enable tips using the dashboard Tip ID |
| `&tip=ID`, `&tipid=ID` | Creator's publishing link | Aliases for `&tipsid=ID` |
| `&showtips` | Receiving view or scene | Show tip controls for creators who enabled tipping |
| `&supporttips` | Receiving view or scene | Alias for `&showtips` |
| `&notipqr` | Receiving view or scene | Hide the tip QR overlay |
| `&tipqrsize=200` | Receiving view or scene | QR size in pixels; default 150, minimum 100 |
| `&tipamounts=1,5,10,25` | Receiving view or scene | Custom preset amounts, subject to the creator's currency and payment limits |
| `&tipcurrency=USD` | Receiving view or scene | Initial currency hint; the creator's verified currency takes precedence |

For advanced options, see the [&tip parameter reference](../general-settings/tip.md).

## Test before going live

1. Open the creator's publishing link and the viewer link together.
2. Confirm the viewer sees the tip controls and the correct creator and currency.
3. Open the OBS overlay if you use one.
4. Use **Send Test Tip** in the Ninja Backer dashboard to check notifications without making a payment.
5. If you connected a third-party receiver, check that it receives the test event and recognizes `isTest: true`.

A simulated tip verifies notification wiring; it does not verify a real charge, receipt email, or payout.

## Payments, receipts, and recovery

Amounts use the creator's currency. JPY uses whole yen; the other supported currencies use two decimal places. URL parameters cannot override the creator's verified charge currency. If it changes during checkout, review the new currency and amount before confirming again.

The optional receipt email goes to Stripe. Ninja Backer does not retain it in tip history or include it in stream alerts or webhook payloads. Leave it blank if you do not want an emailed receipt.

If Stripe completes payment but the notification confirmation fails, use **Retry Notification**. This retries confirmation without another charge. Ninja Backer also checks Stripe in the background to recover missed confirmations. Avoid starting a second payment just because an alert has not appeared.

The dashboard shows Stripe account requirements and payment/payout restrictions. Only the account owner should resolve these through their Stripe account. **Adjusted Tips** excludes refunded amounts and disputed funds before fees; it is not a bank payout balance. Recent tips show refund/dispute status.

Check Ninja Backer's current fee information and your Stripe account for applicable charges. Do not assume a single processing rate applies to every account or currency.

## Social Stream and other notification integrations

A third-party integration needs to implement Ninja Backer's notification contract. Enter its public HTTPS receiver URL in the dashboard's webhook settings and generate a signing secret. Configure that secret securely at the receiver. A local desktop address is not a valid webhook destination; desktop software needs a public receiver or the live SSE feed.

Receiver requirements:

- Verify the HMAC-SHA256 signature against the exact raw request body before parsing it. Validate the signature header's timestamp, not the original event timestamp.
- Deduplicate `X-NinjaBacker-Delivery` in durable storage. Retries keep the same delivery ID and payload, but receive a fresh signature.
- Return 2xx within five seconds after durably accepting the event; process notifications asynchronously. Failed deliveries retry for up to seven days.
- Webhook `amount` is in major currency units: `5 USD` means five dollars and `500 JPY` means five hundred yen. The sender name is `name`.
- Respect `anonymous`, render names/messages safely, and never grant paid rewards for `isTest: true`.
- Treat `callbackId` as caller-provided correlation, not identity or proof of payment.

The dashboard's webhook delivery history shows attempts and eligible retries. Manual retries preserve the delivery ID. Delivered events and events addressed to a previous destination cannot be replayed with this control.

For live-only alerts, SSE is available at `https://ninjabacker.com/v1/subscribe/TIP_ID`. It uses `fromLabel` for the sender name and reconnects without replaying missed events. Prefer webhooks when missed notifications must be recovered.

{% hint style="warning" %}
Outgoing `type: "tip"` events are not a refund/dispute event feed. An integration must not assume it will receive a reversal notification for an earlier tip. Design any paid-reward or accounting workflow accordingly.
{% endhint %}

See the [developer guide and signature verification example](https://ninjabacker.com/developers) and the [full integration contract](https://github.com/steveseguin/ninjabacker/blob/master/INTEGRATION.md) before implementing a receiver.

## Troubleshooting

| Problem | Check |
| --- | --- |
| No tip button | Creator link has the correct Tip ID; viewer link includes `&showtips` |
| Creator cannot accept payments | Ninja Backer dashboard shows Stripe requirements or restrictions |
| Payment succeeded but no alert | Use Retry Notification; inspect webhook history if a receiver is involved |
| Duplicate third-party alerts | Receiver deduplicates the stable delivery ID across retries and restarts |
| Alerts missed while disconnected | SSE has no replay; use durable webhooks for reliable processing |
| Delayed webhook rejected | Verify the fresh signature timestamp, not the older payload timestamp |
| Receipt missing during testing | Send Test Tip does not charge or send a payment receipt |

For help, use the [VDO.Ninja Discord community](https://discord.gg/vdoninja). Never post your webhook signing secret, private Tip ID, or overlay URL in a public support message.
