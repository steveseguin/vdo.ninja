---
description: Use SSO or a signed-in access layer before sending users to VDO.Ninja.
---

# SSO and signed-in access

SSO is its own access path. It is separate from VDO.Ninja's room-cap, approval, queue, and source-prompt parameters.

Use SSO when you need identity checked before a person reaches the VDO.Ninja room flow. VDO.Ninja's built-in integration checks admission and retrieves a managed room secret after authorization; it is more than a login page redirecting to an unchanged public room.

For a leaked director link or unwanted listener, see [Protecting a room from unwanted listeners](protecting-a-room-from-unwanted-listeners.md). Account admission, director ownership, and permission to receive each stream are separate guarantees.

In VDO.Ninja URLs, the common signed-in flags are:

| Parameter | Meaning |
| --- | --- |
| `&auth` | Turns on the signed-in access layer for the room flow |
| `&requireauth` | Requires sign-in before the user can join the protected room flow |
| `&authtoken=ISSUED_TOKEN` | Bearer login credential supplied by the SSO redirect; saved in local storage and removed from the visible URL, but not invalidated by that cleanup |
| `&universaltoken=GENERATED_TOKEN` | Room-scoped bearer access used in generated browser-source links so OBS does not need interactive sign-in |

The correct spelling is `requireauth`, not `requeireauth`; `authtoken` has no leading dot. Do not invent a login token or distribute your own token to guests.

## Configure a private group

1. Create a fresh room and enable **Use SSO for this room**.
2. Sign in as the intended owner before sharing invitations.
3. Choose **Allowlist** and add the approved identities. **Authenticated / Require SSO** permits any signed-in account; **Public** does not require guest sign-in.
4. Use the director's **Room Access Control** settings to manage access mode, allowed users, and pending requests.
5. Send generated guest invitations and have each guest complete their own sign-in.
6. Test with both a signed-out browser profile and a signed-in account outside the allowlist.

Example URL structures:

```text
Director: https://vdo.ninja/?director=YOUR_SSO_ROOM&auth&requireauth
Guest:   https://vdo.ninja/?room=YOUR_SSO_ROOM&requireauth
```

These flags enable the client flow; they do not save an allowlist. A room automatically created by the checked access route defaults to **Authenticated**, not **Allowlist**. Requiring login alone does not exclude an unwanted person who can also sign in.

The allowlist implementation supports account IDs, registered handles such as `@guestname`, and `email:` rules. Use specific identities when excluding a person; broad email/domain rules can admit additional people. Verify that each intended account matches using the identity data supplied by its provider.

The current client uses `https://sso.vdo.ninja` and supports this integration on `vdo.ninja` and its subdomains. Do not assume an arbitrary self-hosted copy supports it unchanged. UI availability depends on the deployed build.

## Enforcement and limits

The checked SSO access endpoint permits normal director access only for the room owner or a service administrator. Protected-room clients obtain a managed secret and use it in the existing room/password handshake. An outsider removing `&requireauth` from an alias URL does not automatically gain that secret.

An admitted client nevertheless receives the shared secret. The inspected standard signaling join/play path does not independently enforce an SSO role on every request. Do not promise complete director or stream isolation from an admitted guest using an altered client or extracted credentials.

Removing an allowlist entry affects subsequent authorization checks. It does not establish that existing media connections stop immediately, copied room secrets disappear, or previously issued universal tokens are revoked. For a confirmed leak, end the exposed publishing sessions and use fresh room/source credentials, then test the old links.

## Login token handling

`authtoken` is not a one-time invitation. The client saves it in local storage, loads the user's identity, and removes it from the visible query/fragment URL. Removing the token from the address bar is not revocation.

The checked Google, Discord, and Twitch callbacks issue seven-day login tokens. The actual issued expiry is authoritative. Never put the owner's login token in guest invitations or OBS links: a bearer credential grants access to whoever holds it.

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

Another pattern is a self-hosted VDO.Ninja deployment behind an identity gateway. Protecting the HTML page alone does not secure feeds accessible through another client; the media/signaling access path needs corresponding enforcement.

## Browser source links

OBS and other browser sources usually cannot complete a normal sign-in flow comfortably. Generated authenticated scene/view links can include `&universaltoken` to bypass interactive sign-in.

The checked tokens are room-scoped, not restricted to the scene number or source named in the rest of the URL. Their holders can obtain the room secret. Keep them private and do not describe them as narrowly restricted public preview links.

The normal access endpoint refuses director access using only a universal token. The client also has a validated universal-token join shortcut, so this endpoint check alone is not proof of complete role enforcement across every token/client combination.

The checked service stores universal tokens with a 90-day expiry. Changing the allowlist or deleting an OBS source does not revoke a token. For a leak, replace the exposed session and credentials; do not assume a newly generated link disables earlier links.

This signed-in access layer is about identity and permission. For a browser source to keep following the same guest after refreshes, you still need a stable stream strategy, such as [`&push`](../source-settings/push.md), [`&permaid`](../advanced-settings/setup-parameters/and-permaid.md), scenes, or slots. See [Permanent links, reusable invites, and stream IDs](how-to-get-permanent-links.md).

## Larger lobby option

For larger lobbies, use [app.invite.cam](../steves-helper-apps/app-invite-cam.md). It is designed around authenticated room ownership, waiting lists, and owner-controlled grant/revoke access.

It supports anonymous guests as well as Discord identities. Use named Discord invitations when identity matters; do not assume all guests are required to sign in. Its integration is separate from the VDO.Ninja `authtoken` flow.

## Verification scope

Updated September 5, 2026 from the client, room settings UI, and local SSO room/auth route implementations. Live OAuth, production deployment parity, and revocation of established media were not tested. See the [room protection guide](protecting-a-room-from-unwanted-listeners.md) for verification steps and limits.

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
