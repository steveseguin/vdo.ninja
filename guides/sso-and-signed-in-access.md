---
description: Use SSO or a signed-in access layer before sending users to VDO.Ninja.
---

# SSO and signed-in access

SSO is its own access path. It is separate from VDO.Ninja's room-cap, approval, queue, and source-prompt parameters.

Use SSO when you need identity checked before a person reaches the VDO.Ninja room flow. In that setup, the SSO or invite system handles sign-in, allowlists, identity policy, and access decisions. Approved users are then sent to the intended VDO.Ninja link.

In VDO.Ninja URLs, the common signed-in flags are:

| Parameter | Meaning |
| --- | --- |
| `&auth` | Turns on the signed-in access layer for the room flow |
| `&requireauth` | Requires sign-in before the user can join the protected room flow |
| `&authtoken` | Temporary redirect token from the SSO service; normally saved then removed from the visible URL |
| `&universaltoken` | Viewer/scene/solo access token generated for browser-source style links, so OBS does not need to complete a human sign-in |

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

## Browser source links

OBS and other browser sources usually cannot complete a normal sign-in flow comfortably. For authenticated rooms, the director can generate scene, view, or solo links that include a `&universaltoken`. That token lets the browser source view the intended room/stream without showing the sign-in UI inside OBS.

This signed-in access layer is about identity and permission. For a browser source to keep following the same guest after refreshes, you still need a stable stream strategy, such as [`&push`](../source-settings/push.md), [`&permaid`](../advanced-settings/setup-parameters/and-permaid.md), scenes, or slots. See [Permanent links, reusable invites, and stream IDs](how-to-get-permanent-links.md).

## Larger lobby option

For larger lobbies, use [app.invite.cam](../steves-helper-apps/app-invite-cam.md). It is designed around authenticated room ownership, waiting lists, and owner-controlled grant/revoke access.

## Related

{% content-ref url="how-to-selectively-allow-access.md" %}
[how-to-selectively-allow-access.md](how-to-selectively-allow-access.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/app-invite-cam.md" %}
[app-invite-cam.md](../steves-helper-apps/app-invite-cam.md)
{% endcontent-ref %}

{% content-ref url="how-to-get-permanent-links.md" %}
[how-to-get-permanent-links.md](how-to-get-permanent-links.md)
{% endcontent-ref %}
