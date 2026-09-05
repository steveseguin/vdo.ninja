---
description: A larger lobby and invite workflow for controlling access before users join VDO.Ninja.
---

# app.invite.cam

[https://app.invite.cam](https://app.invite.cam) is a lobby and invite workflow that can sit in front of VDO.Ninja.

Use it when you expect many people to request access, or when you want authenticated room ownership, waiting lists, and owner-controlled grant/revoke decisions before sending people into the actual VDO.Ninja room.

Hosts and persistent helpers sign in with Discord, but the app also supports anonymous guests and shareable invitations. Use named Discord invitations when guest identity matters. Leave Testing mode disabled if visitors should wait for admission.

In **App helpers / co-directors**, enter exact Discord usernames, keeping periods and underscores. Use the Discord username rather than the app room URL name. An optional leading `@` or full `username#discriminator` is accepted. Punctuation-distinct names are different accounts and do not share helper access.

Custom guest destinations and lobby previews support HTTP(S) URLs and relative web paths. Executable URL schemes, including `javascript:` and `data:`, are blocked. Refresh already open app pages to load this protection for saved and newly entered destinations.

The host can also promote a connected anonymous guest to a temporary helper. That access belongs to the currently granted app sessions and ends when they disconnect, reload, or are demoted. It does not become a saved helper invitation. Guests using multiple tabs appear once in the roster and remain online until their last tab disconnects.

## Access-control limits

The app uses authenticated VDO signaling as well as app-level owner/helper controls. Scene tokens are prevented from claiming the signaling director seat or publishing through the checked request paths; keep those viewing credentials private.

The September 2026 deployment enforces media permissions in the app's signaling server. Ordinary guests cannot claim director ownership, create viewer tokens, or use their guest credentials to subscribe to another isolated guest. Guest access follows the session the host has actually activated. The guest interface does not expose scene/solo links or the room's viewer token.

Keep guest isolation enabled for a director-only guest experience. Disabling isolation intentionally allows the configured group conversation; this is not a per-source viewing allowlist. Owners and authorized helpers can receive guest media. Viewer tokens deliberately allow viewing across the room, so someone given a scene link can alter the scene/source selection. They are bearer credentials, not invitations restricted to one person or source.

**Solo-link fix verified live (September 5):** the VDO.Ninja alpha client now uses the existing viewer-only token for solo links, matching group scene links. OBS can receive them without sign-in, and that credential cannot claim director ownership. Refresh the director page before copying new links. Previously generated solo links containing director/helper login credentials are not automatically invalidated by this change; replace saved or shared copies with newly generated links.

Returning a guest to the lobby, blocking them, or revoking helper access updates signaling permissions and closes the affected connected media peers. If a publisher has lost its signaling connection while peer-to-peer media continues, immediate revocation cannot be guaranteed until it reconnects. Existing custom-room owners are preserved; first-visitor ownership of previously unclaimed room names remains a separate unresolved issue.

See [Protecting a room from unwanted listeners](../guides/protecting-a-room-from-unwanted-listeners.md) for the September 2026 source review, practical setup, and verification limits, and the [live host and guest guide](https://app.invite.cam/guide) for the app workflow.

## What it is for

`app.invite.cam` is useful for:

* larger public lobbies
* events where many people may request access
* owner-managed waiting lists
* signed-in or authenticated access workflows
* reusable host room links tied to a signed-in owner
* separating the public invite/lobby from the final VDO.Ninja room link

## Permanent room idea

The simple version: the host signs in, gets a room under their name, and shares that app.invite.cam room link. Guests can wait in the lobby, raise their hand, chat, or be moved into the live VDO.Ninja room when the host is ready.

This is different from a raw VDO.Ninja `&push` stream ID. `app.invite.cam` manages the lobby, identity, helpers, and invite rules before someone reaches the final VDO.Ninja room flow. If your only problem is "my OBS browser source changes when a guest refreshes," start with [Permanent links, reusable invites, and stream IDs](../guides/how-to-get-permanent-links.md).

## How it differs from VDO.Ninja URL parameters

`app.invite.cam` is not the same layer as VDO.Ninja room/source parameters.

* [`&requireapproval`](../advanced-settings/director-parameters/and-requireapproval.md) approves guests at the VDO.Ninja handshake-server room-admission layer.
* [`&roomcap`](../advanced-settings/director-parameters/and-roomcap.md) caps admission to a claimed VDO.Ninja room.
* [`&queue`](../general-settings/queue.md) controls the guest activation workflow inside VDO.Ninja.
* [`&prompt`](../advanced-settings/settings-parameters/and-prompt.md) asks a source publisher before sending media to a viewer.
* `app.invite.cam` handles the larger invite/lobby and owner grant/revoke workflow before the final VDO.Ninja room flow.

## Typical flow

1. A user opens the `app.invite.cam` lobby link.
2. The user signs in or joins the lobby flow.
3. The room owner sees the waiting user.
4. The owner grants or revokes access.
5. Approved users are sent to the intended VDO.Ninja link or room flow.

Bulk activation and return-to-lobby actions preserve each guest's saved mute, isolation, and other settings. Saving an individual guest's settings creates an override that survives reconnecting through a reusable invite; the invite cannot silently reactivate that guest. Other participants can continue using the invite normally.

Unchecking **Anyone with this link can use it** creates a single-use invite. The first guest account claims it and can reconnect; a different account cannot claim the same link. Anonymous guests must retain their original browser session to keep that identity. Blocking an active guest immediately clears their live route, and blocking a helper immediately removes their controls; existing signaling-outage limits still apply.

Discord sign-in preserves the intended room and reusable invite. Complete sign-in in the tab where you started it; missing or expired sign-in requests offer a link to start again.

## Related

{% content-ref url="../guides/how-to-selectively-allow-access.md" %}
[how-to-selectively-allow-access.md](../guides/how-to-selectively-allow-access.md)
{% endcontent-ref %}

{% content-ref url="../guides/sso-and-signed-in-access.md" %}
[sso-and-signed-in-access.md](../guides/sso-and-signed-in-access.md)
{% endcontent-ref %}

{% content-ref url="../guides/how-to-get-permanent-links.md" %}
[how-to-get-permanent-links.md](../guides/how-to-get-permanent-links.md)
{% endcontent-ref %}

{% content-ref url="invite-link-generators.md" %}
[invite-link-generators.md](invite-link-generators.md)
{% endcontent-ref %}
