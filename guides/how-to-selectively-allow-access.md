---
description: >-
  Choose between room caps, approval prompts, queue mode, transfer rooms, SSO,
  app.invite.cam, passwords, and source connection limits.
---

# How to selectively allow access

VDO.Ninja has several access-control tools. They are not interchangeable, so start by choosing the layer you want to control:

If a director/room link has leaked, read [Protecting a room from unwanted listeners](protecting-a-room-from-unwanted-listeners.md). Limiting director controls is not the same as preventing media access through scene/view links.

| Goal | Best option | Where it applies |
| --- | --- | --- |
| Limit how many people can be admitted to a room | [`&roomcap`](../advanced-settings/director-parameters/and-roomcap.md) | Claimed director rooms |
| Make the director approve or deny room joins | [`&requireapproval`](../advanced-settings/director-parameters/and-requireapproval.md) | Claimed director rooms |
| Show a modal popup for each pending room join | [`&approvepopup`](../advanced-settings/director-parameters/and-approvepopup.md) | Director UI, used with `&requireapproval` |
| Let trusted users bypass approval or a lower room cap | [`&roomkey`](../advanced-settings/director-parameters/and-roomkey.md) | Director and selected guest links |
| Ask a publisher before a viewer can see a single source | [`&prompt`](../advanced-settings/settings-parameters/and-prompt.md) | Push/source links |
| Hold guests until the director activates them | [`&queue`](../general-settings/queue.md), [`&screen`](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md), [`&hold`](../advanced-settings/guest-queuing-parameters/and-hold-alpha.md), [`&holdwithvideo`](../advanced-settings/guest-queuing-parameters/and-holdwithvideo-alpha.md) | Guest invite workflow |
| Move approved guests from a lobby to a private room | [Transfer rooms](../getting-started/rooms/transfer-rooms.md), [`&rooms`](../director-settings/rooms.md), [`&queuetransfer`](../advanced-settings/settings-parameters/and-queuetransfer.md) | Director workflow |
| Check identity before users reach the VDO.Ninja room flow | [SSO and signed-in access](sso-and-signed-in-access.md) | External/auth gateway path |
| Run a larger lobby with owner-controlled access | [app.invite.cam](../steves-helper-apps/app-invite-cam.md) | Lobby/invite app |
| Limit connections to a single source | [`&maxconnections`](../source-settings/and-maxconnections.md) | Push/source links |

## Limit room size

Use [`&roomcap`](../advanced-settings/director-parameters/and-roomcap.md) on the director link:

```text
https://vdo.ninja/?director=MyRoom&roomcap=10
```

On the official `vdo.ninja` service, the default cap is `80` and the hard maximum is `80`. A lower cap can be set per claimed room. Higher values are clamped.

Room caps are handshake-server admission controls attached to the live director claim. If the director is not present, that director's live cap is not present either.

## Approve guests before they enter

Use [`&requireapproval`](../advanced-settings/director-parameters/and-requireapproval.md) on the director link:

```text
https://vdo.ninja/?director=MyRoom&requireapproval
```

Guests attempting to join are put into a pending state until the director approves or denies them.

To also show a modal confirmation popup to the director, add [`&approvepopup`](../advanced-settings/director-parameters/and-approvepopup.md):

```text
https://vdo.ninja/?director=MyRoom&requireapproval&approvepopup
```

The guest invite can stay normal:

```text
https://vdo.ninja/?room=MyRoom
```

`&approvepopup` does not enable audio alerts or system notifications. Add [`&notify`](../source-settings/and-notify.md) or `&beep` for sound.

## Allow trusted bypasses

Use [`&roomkey`](../advanced-settings/director-parameters/and-roomkey.md) when selected guests should bypass approval or a custom room cap:

```text
https://vdo.ninja/?director=MyRoom&requireapproval&roomcap=10&roomkey=TRUSTEDKEY
```

Trusted guest:

```text
https://vdo.ninja/?room=MyRoom&roomkey=TRUSTEDKEY
```

The room key cannot bypass the server hard cap. Treat it like a password and rotate it if it leaks.

## Confirm viewers for a single source

[`&prompt`](../advanced-settings/settings-parameters/and-prompt.md), also available as `&approve` or `&validate`, is sender-side confirmation. It asks the publisher before sending audio/video to a newly connected viewer:

```text
https://vdo.ninja/?push=Camera1&prompt
```

Use this for one-source push/view workflows. It is not a room admission system, and it does not stop a denied viewer from trying again.

## Queue, hold, and screening workflows

Use [`&queue`](../general-settings/queue.md) and the queue variants when you want a room workflow where guests wait until the director activates them.

Common modes:

* `&queue` on both director and guest links creates a screening-room workflow.
* `&queue` only on the guest invite creates a simple "Activate Guest" workflow.
* [`&screen`](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md) / `&queue2` lets the guest see and hear the director before activation.
* [`&hold`](../advanced-settings/guest-queuing-parameters/and-hold-alpha.md) / `&queue3` keeps the guest on a waiting message until activation.
* [`&holdwithvideo`](../advanced-settings/guest-queuing-parameters/and-holdwithvideo-alpha.md) / `&queue4` lets the director preview the guest while the guest waits.

Queue mode is a guest workflow. `&requireapproval` and `&roomcap` are handshake-server room admission controls. They can be combined, but they solve different problems.

## Transfer rooms

Use [transfer rooms](../getting-started/rooms/transfer-rooms.md) when you want a public lobby room and one or more private destination rooms.

A common setup:

1. Guests join a public lobby room.
2. The director screens them there.
3. The director transfers approved guests into a private room.

Use [`&rooms`](../director-settings/rooms.md) to add preset transfer buttons to the director UI. Use [`&queuetransfer`](../advanced-settings/settings-parameters/and-queuetransfer.md) / `&qt` when transferred guests should remain queued in the destination room.

If the destination room has `&requireapproval`, transferred guests enter that destination room pending approval. If the destination room has `&roomcap` and is full, the transfer is rejected.

## SSO and larger lobbies

[SSO and signed-in access](sso-and-signed-in-access.md) is its own access path. Use it when identity needs to be checked before a person reaches the VDO.Ninja room flow.

[app.invite.cam](../steves-helper-apps/app-invite-cam.md) is a larger lobby/invite path with authenticated room ownership, waiting lists, and owner-controlled grant/revoke access.

Do not treat SSO or app.invite.cam as the same thing as `&requireapproval`, `&roomcap`, `&approvepopup`, or `&prompt`. They sit in front of or alongside the VDO.Ninja room workflow.

## Other access tools

[`&password`](../advanced-settings/setup-parameters/and-password.md) can protect a room or source link. Change the password when rotating between groups.

[`&maxconnections`](../source-settings/and-maxconnections.md) limits the total push/view peer connections for a source. It can be useful for one-source workflows, but it is not a room-cap replacement.

Cloudflare Zero Trust or another identity gateway can protect a self-hosted VDO.Ninja deployment before users reach the VDO.Ninja page.

## Related

{% content-ref url="../advanced-settings/director-parameters/and-requireapproval.md" %}
[and-requireapproval.md](../advanced-settings/director-parameters/and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/director-parameters/and-roomcap.md" %}
[and-roomcap.md](../advanced-settings/director-parameters/and-roomcap.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/director-parameters/and-roomkey.md" %}
[and-roomkey.md](../advanced-settings/director-parameters/and-roomkey.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/director-parameters/and-approvepopup.md" %}
[and-approvepopup.md](../advanced-settings/director-parameters/and-approvepopup.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-prompt.md" %}
[and-prompt.md](../advanced-settings/settings-parameters/and-prompt.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/queue.md" %}
[queue.md](../general-settings/queue.md)
{% endcontent-ref %}
