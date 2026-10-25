---
description: What transfers, passwords, &maindirectorpassword, SSO and app.invite.cam protect, and what they don't, when a room link leaks.
---

# Protecting a room from unwanted listeners

No "one director only" setting stops someone listening through other links. Protecting the director role and protecting the audio and video are separate problems.

A normal room's director URL isn't tied to an account. Anyone who knows the room name, and its password if set, can build director or scene links. They don't get the active main director's controls, but they can view.

| Option | Helps with | Important limit |
| --- | --- | --- |
| Transfer trusted guests to a new, random room | Moving the show without new invitations | Both rooms need the same password; the destination isn't truly secret |
| New room and password | Excluding anyone who doesn't get the new credentials | Anyone who gets them can build any room link |
| `&maindirectorpassword` | Which director guests recognize | Doesn't make scene or view access private |
| SSO with an allowlist | Checking accounts before handing out access | Admitted browsers get a shared room secret |
| app.invite.cam | Managed admission, server-enforced guest/director media permissions | Keep guest isolation on; a shared viewer token grants room viewing |

![Decision chart: for an outsider, use new credentials or an SSO allowlist; for an admitted guest who must not see other feeds, use app.invite.cam with guest isolation on; to protect only the director seat, use maindirectorpassword, which does not stop viewers.](../.gitbook/assets/room-protect-decision.svg)

## Move trusted guests with Transfer

1. In another tab, open a new randomly named room as director, with the same password setup as the original.
2. Keep the original director tab open and **Transfer** each trusted guest. Leave the unwanted person behind.
3. Check the guests arrived and are publishing.
4. Update OBS scene links for the new room and check the output before closing the old director tab.

A standard transfer keeps the destination out of the guest's address bar. If a guest refreshes, they return to the original room.

* **Don't promise the destination is secret.** The guest's browser must receive it, it passes through signaling, and one code path sends the transfer message to the whole room. It's not protection against someone inspecting their browser or watching the original session.
* A transfer doesn't change stream IDs or credentials. Check old solo/view links and scenes. If source credentials leaked, start fresh publishing sessions.
* **Change URL**, and the Transfer dialog's **Allow the guest to rejoin the transfer room on their own** option, put the new room in the guest's URL. Change URL can also load a new password, which the guest then sees.

See [How to transfer guests to other rooms](../getting-started/rooms/transfer-rooms.md).

## Start over with a new room and password

Create a new random room name and password, invite only the people you want, have everyone rejoin with the new links, and replace OBS scene and solo/view links. Then confirm the old links no longer reach the active sources.

```text
Director: https://vdo.ninja/?director=NEW_RANDOM_ROOM&password=NEW_ROOM_PASSWORD
Guest:   https://vdo.ninja/?room=NEW_RANDOM_ROOM&password=NEW_ROOM_PASSWORD
Scene:   https://vdo.ninja/?scene&room=NEW_RANDOM_ROOM&password=NEW_ROOM_PASSWORD
```

Adding a password only to your own director link doesn't protect guests left in the old session.

A room password is shared access, not a director-only permission. It keeps someone out only while they don't have it, so treat any invitation that contains it as sensitive. See [`&password`](../advanced-settings/setup-parameters/and-password.md).

## Protect director ownership with `&maindirectorpassword`

```text
https://vdo.ninja/?director=YOUR_ROOM&maindirectorpassword=PRIVATE_DIRECTOR_SECRET
```

This sets director identity through tokens (alias `&maindirpass`). Guest and scene links generated afterwards include a matching `&token`, so clients know which director to recognize. Links already sent aren't updated.

* Keep it separate from the room password.
* It stops someone taking ownership by arriving first, including while you're disconnected.
* It does **not** keep viewers out. Anyone with working scene or view credentials can still listen.

[`&codirector`](../director-settings/codirector.md) (also `&directorpassword`) authorizes co-director controls. It doesn't protect media either. See [`&maindirectorpassword`](../advanced-settings/director-parameters/and-maindirectorpassword.md).

## SSO: `auth`, `requireauth`, `authtoken` and `universaltoken`

VDO.Ninja's sign-in integration ties room ownership to an account and checks guest admission before handing out a managed room secret. It works only on vdo.ninja and its subdomains.

| Parameter | Meaning |
| --- | --- |
| `&auth` | Turns on SSO; the room's saved policy decides who gets in |
| `&requireauth` | Turns on SSO and requires sign-in; doesn't select an allowlist |
| `&authtoken` | Bearer login credential added by the sign-in redirect. Don't invent or share one |
| `&universaltoken` | Bearer access in generated OBS scene/view links, so they skip sign-in |

Access modes: **Public** (anyone), **Require SSO / Authenticated** (any signed-in account), **Allowlist** (approved accounts or identity rules, plus the owner and service administrators). If the unwanted person can sign in, only **Allowlist** keeps them out.

1. Create a fresh room and turn on **Use SSO for this room**.
2. Sign in as the owner before inviting anyone.
3. Choose **Allowlist only** and add the intended users. The director's **Room Access Control** panel also shows the mode, allowed users and pending requests.
4. Send generated guest invitations; guests sign in with their approved accounts.

```text
https://vdo.ninja/?director=NEW_SSO_ROOM&auth&requireauth
https://vdo.ninja/?room=NEW_SSO_ROOM&requireauth
```

The URL flags don't save an allowlist. A room created automatically when a signed-in director first opens it defaults to **Authenticated**, not Allowlist.

### What SSO enforces, and what it doesn't

* Only the owner or a service administrator passes the director access check.
* The client checks admission before joining signaling, then uses the managed room secret as the room password. Removing `&requireauth` from the URL doesn't get an outsider that secret or into the same session.
* **Every admitted browser receives the shared room secret**, and normal signaling join/play messages carry no separately enforced SSO role. This is account-based admission plus ownership checks in normal clients, not director or stream isolation against an admitted user with a modified client or extracted credentials.
* Removing someone from the allowlist affects later checks only. It doesn't close existing media connections, clear copied room secrets or invalidate OBS tokens. After a confirmed leak, end the session and use fresh room and source credentials.

### Login tokens and OBS tokens

* `authtoken` is a login credential, not a guest invitation. The client saves it in local storage and removes it from the address bar, which doesn't invalidate it. Login tokens last seven days. Never put your owner token in a guest or OBS link.
* `universaltoken` is scoped to the whole room, not one scene or source, and allowlist changes don't revoke it. It can't pass the director access check, but holders can get the room secret, so treat any link carrying it as room access.

See [SSO and signed-in access](sso-and-signed-in-access.md).

## app.invite.cam: a managed lobby

[app.invite.cam](https://app.invite.cam) puts a public lobby, invitations and authorized helpers in front of VDO.Ninja, so you never hand out the raw room link. Guests can join anonymously or by invitation; hosts and persistent helpers sign in with Discord. Anonymous names can change, so use named Discord invitations when identity matters.

1. Sign in as host and share the lobby link.
2. Leave **Testing mode: send new guests straight into the room** off.
3. Keep **Keep activated guests from seeing each other** on. Turning it off deliberately allows a group conversation.
4. Admit guests and add helpers explicitly.
5. Keep generated VDO.Ninja/OBS scene links and tokens private.

What its signaling server enforces:

* The VDO.Ninja iframe uses authenticated signaling plus app-level ownership checks. The public lobby URL alone supplies no credentials.
* Isolated guests can't claim the director seat, mint viewing tokens, or view another isolated guest through a constructed scene or solo URL. They publish only through their active invite session.
* Scene tokens can join and view, but can't claim the director seat or publish.
* Guests aren't shown scene/solo controls or the viewer token. A viewer link you share is a bearer credential for the whole room: its holder can change scene or source parameters to see other sources.
* Solo links copied before September 5, 2026 can contain account credentials and aren't invalidated automatically. Refresh the director page and replace saved copies.

Known limits: moving a guest back to the lobby closes their peer connections, but if a publisher loses signaling while its media continues, revocation waits until it reconnects. First-visitor ownership of unclaimed room names is unresolved, so create the room and confirm ownership before sharing it. Changing the invitation page doesn't secure an already exposed raw VDO.Ninja session; retire it.

See [app.invite.cam documentation](../steves-helper-apps/app-invite-cam.md) and the [host and guest guide](https://app.invite.cam/guide).

## Test before you rely on it

With accounts and sources you control:

1. An intended guest can join, and the director and OBS receive their media.
2. A signed-out browser profile can't reach the session with guest, director or scene links.
3. A signed-in account outside the allowlist is denied, not just asked to sign in.
4. An approved ordinary guest is denied director access.
5. Old scene and solo links after a move: unchanged source credentials may still work.
6. Removal during a connection and after reconnecting: check the media, not just the guest list.
7. Generated OBS tokens, separately: they skip sign-in on purpose.
