---
description: Use SSO or a signed-in access layer before sending users to VDO.Ninja.
---

# SSO and signed-in access

SSO is its own access path. It is separate from VDO.Ninja's room-cap, approval, queue, and source-prompt parameters.

Use SSO when you need identity checked before a person reaches the VDO.Ninja room flow. In that setup, the SSO or invite system handles sign-in, allowlists, identity policy, and access decisions. Approved users are then sent to the intended VDO.Ninja link.

## When to use it

SSO is the better fit when you need:

* sign-in before users reach the room
* allowlists based on accounts, email domains, groups, or other identity rules
* an access layer that is separate from VDO.Ninja room state
* a lobby or event flow where people request access before receiving the real invite

## What it is not

SSO is not the same as:

* [`&requireapproval`](../advanced-settings/director-parameters/and-requireapproval.md), which is VDO.Ninja room admission approval
* [`&roomcap`](../advanced-settings/director-parameters/and-roomcap.md), which caps admitted guests in a claimed VDO.Ninja room
* [`&approvepopup`](../advanced-settings/director-parameters/and-approvepopup.md), which shows the director a modal approval prompt
* [`&prompt`](../advanced-settings/settings-parameters/and-prompt.md), which asks a publisher before sending media to a viewer
* [`&queue`](../general-settings/queue.md), which controls guest activation after a guest reaches the room workflow

Those options can still be useful after SSO sends someone to a VDO.Ninja link, but they are different layers.

## Common patterns

One common pattern is:

1. User opens an event or invite page.
2. SSO or the invite system checks identity.
3. Approved users receive or are redirected to the VDO.Ninja room link.
4. VDO.Ninja room controls, such as `&requireapproval` or `&queue`, optionally handle final production workflow.

Another pattern is a self-hosted VDO.Ninja deployment behind an identity gateway, such as Cloudflare Zero Trust. In that case, users sign in before the VDO.Ninja page is served.

## Larger lobby option

For larger lobbies, use [app.invite.cam](../steves-helper-apps/app-invite-cam.md). It is designed around authenticated room ownership, waiting lists, and owner-controlled grant/revoke access.

## Related

{% content-ref url="how-to-selectively-allow-access.md" %}
[how-to-selectively-allow-access.md](how-to-selectively-allow-access.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/app-invite-cam.md" %}
[app-invite-cam.md](../steves-helper-apps/app-invite-cam.md)
{% endcontent-ref %}
