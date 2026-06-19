---
description: Room-based green-room workflows, app.invite.cam lobbies, and supporting guest waiting controls.
---

# Green rooms and guest waiting options

A green room is a place for guests to wait before they enter the live room.

That matters because a guest usually needs to feel they are in the right place. If they only see a blocked join, a browser error, or a confusing blank page, they may refresh, leave, or message the host at the worst time.

For VDO.Ninja, the main room-based green-room workflow is a transfer room. For a larger hosted lobby, `app.invite.cam` can sit in front of VDO.Ninja. Other controls, such as `&requireapproval`, `&hold`, and `&roomcap`, can stop interruptions, but they are not the same as having a lobby or separate waiting room.

`&scene` is not a green room. Scenes control what appears in OBS or a scene view. They do not stop a guest from entering the room.

## The main options

| Need | Main option | What the guest experiences |
| --- | --- | --- |
| A real VDO.Ninja lobby room before the live room | [Transfer rooms](../getting-started/rooms/transfer-rooms.md) | Guest joins a lobby room, then the director moves them to another room |
| A larger lobby with waiting lists, signed-in ownership, and grant/revoke access | [app.invite.cam](../steves-helper-apps/app-invite-cam.md) | Guest waits in an invite/lobby flow before being sent to VDO.Ninja |
| A VDO.Ninja queue workflow without a separate room | [`&queue`](../general-settings/queue.md) and queue variants | Guest waits until the director activates them |
| A simple join approval gate | [`&requireapproval`](../advanced-settings/director-parameters/and-requireapproval.md) | Guest is pending until approved, but this is not a room |

## Option 1: VDO.Ninja transfer rooms

Transfer rooms are the current VDO.Ninja way to make a room-based green room.

The simple idea:

1. Guests join a lobby room.
2. The live show or interview happens in another room.
3. The director checks the lobby.
4. The director transfers the guest into the live room when ready.

Example guest link:

```text
https://vdo.ninja/?room=LobbyRoom
```

Example lobby director link:

```text
https://vdo.ninja/?director=LobbyRoom&rooms=LiveRoom
```

Example live-room director link:

```text
https://vdo.ninja/?director=LiveRoom
```

The `&rooms=LiveRoom` part adds a quick transfer destination to the lobby director page. The director can pick `LiveRoom`, then transfer the waiting guest there.

### Why this feels like a green room

The guest is in a real room first. They are not simply blocked from joining. The host can keep the live room separate from the waiting area, so the next guest does not walk into the current conversation.

This also gives the host a clear mental model:

* `LobbyRoom` is where guests arrive.
* `LiveRoom` is where the active conversation happens.
* Transfer is the moment the guest moves from waiting to live.

### Transfer-room details that matter

Only the main director can transfer guests. Room director ownership is first come, first served, so keep the director tab open for any room you need to control.

When a guest is transferred, the destination room's director becomes the owner of that guest.

Transferred guests do not see the destination room name during a normal transfer. That keeps private rooms private.

If a transferred guest refreshes or disconnects, they return to the original landing room. This is intentional privacy behavior. If the guest must stay in the destination room after refresh, the director can use **Change URL** instead of normal transfer, but then the guest can see the new room and password.

Transfers require matching passwords for both rooms.

If the destination room has `&requireapproval`, the transferred guest waits for approval in that destination room. If the destination room has `&roomcap` and is full, the transfer is rejected.

## Option 2: app.invite.cam

[app.invite.cam](https://app.invite.cam) is a lobby and invite workflow that can sit in front of VDO.Ninja.

The simple idea:

1. The host signs in.
2. The host shares an `app.invite.cam` room or lobby link.
3. Guests wait in that lobby flow.
4. The host grants or revokes access.
5. Approved guests are sent to the intended VDO.Ninja room or invite flow.

This is not just a VDO.Ninja URL parameter. It is a separate lobby layer before the final VDO.Ninja room.

`app.invite.cam` is built for cases like:

* public lobby links
* larger events
* many people requesting access
* signed-in room ownership
* owner-managed waiting lists
* helper or access-management workflows
* keeping the public invite separate from the final VDO.Ninja room link

This can be easier for guests to understand because they are in a visible lobby flow rather than staring at a plain approval gate.

Do not confuse `app.invite.cam` with plain [invite.cam](../steves-helper-apps/invite-link-generators.md). Plain `invite.cam` is for hiding, encoding, shortening, or managing links. `app.invite.cam` is the larger lobby and access flow.

## Supporting transfer-room controls

These are still part of the room-based workflow, but they are helpers rather than the green room by themselves.

### `&rooms`

[`&rooms`](../director-settings/rooms.md) adds preset transfer destinations to the director control bar.

```text
https://vdo.ninja/?director=LobbyRoom&rooms=LiveRoom,GuestRoom,BackupRoom
```

Pressing a room name arms the transfer buttons beneath the guests, so the director can move people faster.

`&rooms` only adds shortcuts. The destination room's own rules still apply.

### `&queuetransfer`

[`&queuetransfer`](../advanced-settings/settings-parameters/and-queuetransfer.md), also called `&qt`, changes what happens after transfer.

Guest link:

```text
https://vdo.ninja/?room=LobbyRoom&queuetransfer
```

With this on the guest link, a transferred guest lands in the destination room's queue flow instead of going live immediately. The destination director can activate them when ready.

This is useful when one person manages the public lobby, but another director controls the final room.

### `&broadcasttransfer`

[`&broadcasttransfer`](../advanced-settings/director-parameters/and-broadcasttransfer.md), also called `&bct`, changes the default transfer behavior so transferred guests enter in broadcast mode.

This mostly matters when using `&rooms`, because `&rooms` acts more like a quick-transfer button and does not show the full transfer menu each time.

## Queue and hold options

These can be useful, but they are queue or activation workflows. They are not the same as a separate waiting room unless they are combined with a room-transfer setup.

### `&queue` on both director and guest links

[`&queue`](../general-settings/queue.md) on both sides creates a screening-room style workflow.

Director link:

```text
https://vdo.ninja/?director=LobbyRoom&queue
```

Guest link:

```text
https://vdo.ninja/?room=LobbyRoom&queue
```

Guests wait in a queue. The director pulls them in as needed and can transfer them to another room.

### `&queue` only on the guest link

Guest link:

```text
https://vdo.ninja/?room=RoomName&queue
```

The guest is held until the director presses **Activate Guest**. This is a simple activation flow, not a separate room.

### `&hold`, `&holdwithvideo`, and `&screen`

These are guest invite modes:

| Option | Also called | What happens |
| --- | --- | --- |
| [`&hold`](../advanced-settings/guest-queuing-parameters/and-hold-alpha.md) | `&queue3` | Guest sees a waiting message until activated |
| [`&holdwithvideo`](../advanced-settings/guest-queuing-parameters/and-holdwithvideo-alpha.md) | `&queue4` | Guest sees a waiting message while the director can preview them |
| [`&screen`](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md) | `&queue2` | Guest can see and hear the director before activation |

For these modes, transferring the guest to another room also counts as activation.

These can help stop the next guest from interrupting the current room, but they are not a room-based green room by themselves.

## Approval and access controls

These are useful controls for stopping unwanted joins or managing room access. They are lower-level access tools, not green rooms.

### `&requireapproval` and `&approvepopup`

[`&requireapproval`](../advanced-settings/director-parameters/and-requireapproval.md) makes the active director approve or deny room joins.

Director link:

```text
https://vdo.ninja/?director=RoomName&requireapproval&approvepopup
```

Guest link:

```text
https://vdo.ninja/?room=RoomName
```

`&approvepopup` shows a popup for pending joins. It does not enable sounds or system notifications. Add `&beep` or `&notify` only when those alerts are wanted.

This can stop someone from entering too early, but it is still an approval gate. It is not a separate room where guests wait.

### `&roomcap`

[`&roomcap=NUMBER`](../advanced-settings/director-parameters/and-roomcap.md) limits how many guests can be admitted to a claimed room.

```text
https://vdo.ninja/?director=RoomName&roomcap=1
```

This can prevent extra people from joining a room that is already full. It does not provide a guest lobby.

### `&roomkey`

[`&roomkey=KEY`](../advanced-settings/director-parameters/and-roomkey.md) lets selected guests bypass approval or a custom room cap.

Treat a room key like a password.

### Passwords and signed-in access

[`&password`](../advanced-settings/setup-parameters/and-password.md) can protect a room or source link.

[`&auth`](sso-and-signed-in-access.md), [`&requireauth`](sso-and-signed-in-access.md), SSO, or another identity gateway can check who someone is before they reach the VDO.Ninja room flow.

These are access layers. They can sit before or around a green-room workflow, but they do not replace the room/lobby experience.

## Related

{% content-ref url="../getting-started/rooms/transfer-rooms.md" %}
[transfer-rooms.md](../getting-started/rooms/transfer-rooms.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/app-invite-cam.md" %}
[app-invite-cam.md](../steves-helper-apps/app-invite-cam.md)
{% endcontent-ref %}

{% content-ref url="../director-settings/rooms.md" %}
[rooms.md](../director-settings/rooms.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-queuetransfer.md" %}
[and-queuetransfer.md](../advanced-settings/settings-parameters/and-queuetransfer.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/queue.md" %}
[queue.md](../general-settings/queue.md)
{% endcontent-ref %}

{% content-ref url="how-to-selectively-allow-access.md" %}
[how-to-selectively-allow-access.md](how-to-selectively-allow-access.md)
{% endcontent-ref %}
