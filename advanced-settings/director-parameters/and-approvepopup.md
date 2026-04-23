---
description: Show a director confirmation popup when a guest is waiting for approval.
---

# \&approvepopup

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&approvalpopup`

## Details

`&approvepopup` shows an opt-in confirmation popup when a guest or scene request is waiting for server-side room approval.

It is intended to be used with [`&requireapproval`](and-requireapproval.md):

```text
https://vdo.ninja/?director=MyRoom&requireapproval&approvepopup
```

Without `&approvepopup`, pending join requests are still shown in the director controls, but the director is not interrupted by a modal confirmation prompt.

## What the popup does

When a pending join request arrives, the director sees a confirmation dialog. Approving admits the guest. Denying rejects the pending join request.

If the request is for a scene/view role rather than a guest, the popup labels it as a scene request.

## What it does not do

`&approvepopup` does not create the approval queue by itself. Use [`&requireapproval`](and-requireapproval.md) for that.

`&approvepopup` does not enable audio alerts, notification sounds, or system toasts. Add [`&notify`](../../source-settings/and-notify.md) or `&beep` for sound.

## Related

{% content-ref url="and-requireapproval.md" %}
[and-requireapproval.md](and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="and-roomcap.md" %}
[and-roomcap.md](and-roomcap.md)
{% endcontent-ref %}
