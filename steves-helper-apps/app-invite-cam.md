---
description: A larger lobby and invite workflow for controlling access before users join VDO.Ninja.
---

# app.invite.cam

[https://app.invite.cam](https://app.invite.cam) is a lobby and invite workflow that can sit in front of VDO.Ninja.

Use it when you expect many people to request access, or when you want authenticated room ownership, waiting lists, and owner-controlled grant/revoke decisions before sending people into the actual VDO.Ninja room.

## What it is for

`app.invite.cam` is useful for:

* larger public lobbies
* events where many people may request access
* owner-managed waiting lists
* signed-in or authenticated access workflows
* separating the public invite/lobby from the final VDO.Ninja room link

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

## Related

{% content-ref url="../guides/how-to-selectively-allow-access.md" %}
[how-to-selectively-allow-access.md](../guides/how-to-selectively-allow-access.md)
{% endcontent-ref %}

{% content-ref url="../guides/sso-and-signed-in-access.md" %}
[sso-and-signed-in-access.md](../guides/sso-and-signed-in-access.md)
{% endcontent-ref %}

{% content-ref url="invite-link-generators.md" %}
[invite-link-generators.md](invite-link-generators.md)
{% endcontent-ref %}
