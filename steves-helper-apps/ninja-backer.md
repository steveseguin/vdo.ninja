---
description: Tipping and supporter platform used with VDO.Ninja tip links and creator workflows.
---

# Ninja Backer

Ninja Backer is the tipping and supporter platform used by VDO.Ninja's `&tip` and `&showtips` workflows.

## Link

* [https://ninjabacker.com](https://ninjabacker.com)

## Notes

* Share a public creator tip page, or enable built-in tips with `&tipsid=YOUR_TIP_ID` on the publishing link and `&showtips` on the viewing link.
* Copy an OBS alert overlay from the dashboard, and use **Send Test Tip** to check notifications without charging money.
* Connect third-party alerts through signed, retryable webhooks. A private SSE feed is available for live-only notifications without replay.
* Optional receipts, Stripe account warnings, refund/dispute status, and webhook delivery history are available in the checkout/dashboard workflows.

For API receivers, see the [developer guide](https://ninjabacker.com/developers). Keep Tip IDs, overlay URLs, and signing secrets private.

## Related

{% content-ref url="../guides/ninjabacker-tipping.md" %}
[ninjabacker-tipping.md](../guides/ninjabacker-tipping.md)
{% endcontent-ref %}
