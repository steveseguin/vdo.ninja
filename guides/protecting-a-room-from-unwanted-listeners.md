---
description: What transfers, passwords, director ownership, SSO, and app.invite.cam protect when a room link leaks.
---

# Protecting a room from unwanted listeners

There isn't a "one director only" setting that stops someone listening through other links in an unprotected room. Protecting the director role and protecting access to audio/video are separate problems.

In a normal room, the director URL is not an account-bound credential. Someone who knows the room name and its password, if used, can construct director or scene URLs. This does not automatically give them the active main director's controls, but keeping the director URL private alone does not prevent viewing.

## Your options

| Option | What it helps with | Important limit |
| --- | --- | --- |
| Transfer trusted guests into a new, random room | Move the show without asking guests to open new invitations | Both rooms must use the same password; hiding the destination from the address bar is not guaranteed secrecy |
| Start a new password-protected room | Exclude someone who does not receive the new credentials | Anyone receiving the room name and password can construct other room links |
| Use `&maindirectorpassword` | Establish which director token-linked guests should recognize | Does not make scene/view access private |
| Use SSO with an allowlist | Check accounts before supplying access to the protected room | Requiring sign-in alone permits any signed-in user; admitted browsers receive a shared room secret |
| Use app.invite.cam | Managed admission and server-enforced guest/director media permissions | Keep guest isolation enabled; shared viewer tokens grant room viewing; see the solo-link deployment caveat below |

If the unwanted person is an outsider, replacing leaked credentials or using an allowlist is useful. If that person must remain an admitted guest but must not access other feeds, do not assume these options provide that stronger guarantee.

## Transfer guests to a new room

Use the director's **Transfer** feature to move trusted guests into a new, hard-to-guess room. No new password is needed when both rooms have no user-set password.

1. Open the destination room as director in another tab, with a new random name and the same password configuration as the original room.
2. Keep the original director tab open while moving guests.
3. Use each trusted guest's Transfer control to send them to the destination. Leave the unwanted person behind.
4. Confirm the intended guests have arrived and are publishing.
5. Update OBS scene links for the destination and check the output before closing the old director tab.

Standard transfers do not replace the guest's visible invitation URL with the destination name. Guests can normally remain connected without opening new invitations. Refreshing the original invitation returns them to the original room, where they may need another transfer.

**Do not promise that nobody can discover the destination.** The browser must receive destination information to connect, and transfer information passes through signaling. The implementation includes a path that sends migration information to the room. Keeping the name out of the address bar helps a screening workflow, but is not an authentication boundary against someone inspecting their browser or monitoring the original session.

Moving rooms also does not inherently rotate every source's stream ID or credentials. Check previously shared solo/view links as well as scenes. If source credentials leaked, use fresh publishing sessions and credentials rather than relying only on a transfer.

The **Change URL** workflow can load a different room and password for a guest, but exposes those new details in the invitation URL. It is different from a standard Transfer.

See [How to transfer guests to other rooms](../getting-started/rooms/transfer-rooms.md).

## Start a new password-protected room

For a leaked open room, a fresh room and password provide a straightforward reset:

1. Create a new random room name and password.
2. Send new invitations only to intended participants.
3. Have everyone leave the old session and rejoin using the new links.
4. Replace OBS scene and solo/view links with links generated for the new session.
5. Confirm the old links no longer reach the active sources.

Example structure; replace the example values:

```text
Director: https://vdo.ninja/?director=NEW_RANDOM_ROOM&password=NEW_ROOM_PASSWORD
Guest:   https://vdo.ninja/?room=NEW_RANDOM_ROOM&password=NEW_ROOM_PASSWORD
Scene:   https://vdo.ninja/?scene&room=NEW_RANDOM_ROOM&password=NEW_ROOM_PASSWORD
```

Adding a password only to your own director URL does not protect guests who remain in the old session. Everyone must use the matching new room/password combination.

A room password is shared access, not a director-only permission. Anyone receiving the room name and password can construct director/scene links. It excludes the unwanted person only while they do not have those credentials. An invitation containing the password is itself sensitive.

See [`&password`](../advanced-settings/setup-parameters/and-password.md).

## Protect director ownership with `&maindirectorpassword`

Example structure:

```text
https://vdo.ninja/?director=YOUR_ROOM&maindirectorpassword=PRIVATE_DIRECTOR_SECRET
```

This establishes director identity through the token system. Generated guest and scene links include a corresponding `&token`, telling participating clients which director to recognize. Use those generated invitations; adding the parameter to one director tab does not rewrite invitations already in use.

Keep the main director secret separate from any shared room password. It helps prevent someone taking ownership by arriving first, including while the director is disconnected.

It does **not** require every viewer to know the director secret. Someone with working scene/view credentials may still listen without becoming the recognized director.

[`&codirector`](../director-settings/codirector.md), also named `&directorpassword`, separately authorizes co-director controls. It is not a replacement for protecting media access either.

See [`&maindirectorpassword`](../advanced-settings/director-parameters/and-maindirectorpassword.md).

## SSO: `auth`, `requireauth`, and `authtoken`

VDO.Ninja includes a sign-in integration with its SSO service. It associates room ownership with an account and checks guest admission before supplying a managed room secret.

| Parameter | Meaning |
| --- | --- |
| `&auth` | Enables the SSO flow; the room's saved policy still determines guest admission |
| `&requireauth` | Enables SSO and requires sign-in in the client flow; does not select an allowlist |
| `&authtoken=ISSUED_TOKEN` | Supplies a bearer login credential issued by SSO, normally during the sign-in redirect; do not invent a value or share your own token |
| `&universaltoken=GENERATED_TOKEN` | Supplies bearer access used by generated OBS scene/view links, avoiding interactive sign-in |

The spelling is `requireauth`, not `requeireauth`. There is no leading dot in `authtoken`.

### Choose Allowlist, not just Require SSO

* **Public:** guests can access the room without signing in.
* **Authenticated / Require SSO:** any valid signed-in account can be admitted.
* **Allowlist:** admission requires an approved account or matching identity rule; the owner and service administrators retain access.

For an unwanted signed-in person, choose **Allowlist**. Otherwise, that person can simply sign in too.

In a build exposing the SSO controls:

1. Create a fresh room and enable **Use SSO for this room**.
2. Sign in as the intended owner before inviting guests.
3. Select **Allowlist** and add the intended users. The director's **Room Access Control** settings also expose access mode, allowed users, and pending requests.
4. Send generated guest invitations and ask guests to use their approved accounts.
5. Keep generated OBS/view tokens private and test with an unapproved account.

Example director and guest URL structures:

```text
https://vdo.ninja/?director=NEW_SSO_ROOM&auth&requireauth
https://vdo.ninja/?room=NEW_SSO_ROOM&requireauth
```

The URL flags do not save an allowlist. Select and verify the policy through the SSO controls. A room automatically created through the checked access route defaults to **Authenticated**, not **Allowlist**.

### What the current implementation enforces

The SSO access endpoint rejects a normal director request from someone who is neither owner nor service administrator. The client checks admission before joining the signaling room, then obtains a managed room secret and uses it in the existing password/room handshake.

An outsider removing `&requireauth` from the public alias URL does not automatically obtain that secret or enter the same protected session.

However, an admitted browser receives the shared room secret. The inspected standard signaling join/play messages do not carry an independently enforced SSO role credential. **Do not describe this as complete director/stream isolation against an admitted user with a modified client or extracted credentials.** It provides account-based admission and normal-client ownership checks, not a verified permission boundary for every media request.

Removing an allowlisted user changes subsequent authorization decisions. Do not assume it instantly closes established media connections, clears copied room secrets, or invalidates existing OBS tokens. For a confirmed leak, end the affected session and use fresh room/source credentials.

### Login tokens and OBS tokens are different

`authtoken` is not a one-time guest invitation. The client saves it in local storage and removes it from the visible URL. That cleanup does not invalidate it. The checked provider callbacks issue seven-day login tokens; the actual issued expiry remains authoritative.

Never paste your owner login token into a guest invitation or OBS link. Each guest should complete their own sign-in.

`universaltoken` allows automated viewers such as OBS to connect without sign-in. The checked token records are room-scoped, not tied to one scene number or source. Treat a link carrying one as a room-access credential, not a narrowly restricted public preview. Changing an allowlist alone does not invalidate that access.

The normal access endpoint refuses director access using only a universal token. This is not proof of complete role enforcement across all token/client combinations: the client also has a validated universal-token join shortcut, and token holders can obtain the room secret.

See [SSO and signed-in access](sso-and-signed-in-access.md) for additional configuration details.

## app.invite.cam: a managed lobby

[app.invite.cam](https://app.invite.cam) provides a public lobby, account-owned hosting, invitations, and authorized helpers. Use it to decide who enters the show instead of distributing the raw production room link.

**Not every guest must sign in with Discord.** Anonymous guest sessions and shareable invitations are supported. Hosts and persistent helpers use Discord sign-in. Use invitations for specific Discord users when identity matters; anonymous display names are not reliable identities for permanent blocking.

Suggested setup:

1. Sign in as host and share the app's lobby link.
2. Leave **Testing mode: send new guests straight into the room** disabled.
3. Use named Discord invitations for participants whose identity matters.
4. Admit the intended guests and add helpers explicitly.
5. Keep generated VDO/OBS scene links and tokens private.

The app uses an authenticated signaling connection for its VDO iframe, alongside app-level ownership checks. Scene tokens can join and view, but are prevented from claiming the signaling director seat or publishing through the checked request paths. Knowing the public lobby URL alone does not supply those credentials.

The September 2026 app deployment enforces guest isolation at the signaling server. Guests cannot claim director ownership, mint viewing tokens, or use their own credentials to access another isolated guest through a constructed scene/solo URL. They can publish only through their active invite session. Owners and authorized helpers retain the normal director workflow. Keep **Keep activated guests from seeing each other** enabled; disabling isolation intentionally permits the configured group conversation.

The app does not show guests scene/solo controls or distribute the viewer token to them. A viewer link deliberately shared by the director is a bearer credential: its recipient can view the room, including by changing scene/source parameters. It is not restricted to the exact source shown in the original URL.

**Solo-link deployment caveat (September 5):** live testing found that generated solo links still copy director/helper signaling credentials in the deployed VDO.Ninja client. The local generator fix passes its regression test but is awaiting deployment. Do not share those solo links outside the trusted director team until the fix is verified live. Group scene links use the viewer token.

Connected media revocation was tested: moving a guest back to the lobby closes the affected peer connections. If a publisher loses signaling while its peer-to-peer media continues, immediate revocation is not guaranteed until reconnection. First-visitor ownership of previously unclaimed room names also remains unresolved; create and verify ownership before distributing a room link.

If an old raw VDO session is exposed, changing the invitation page alone does not secure it. Move production into the managed workflow and retire the old sessions and credentials.

See [app.invite.cam documentation](../steves-helper-apps/app-invite-cam.md) and the app's [host and guest guide](https://app.invite.cam/guide).

## Check before relying on the setup

Use accounts and sources you control:

1. Confirm an intended guest can join and director/OBS can receive media.
2. In a separate signed-out browser profile, try guest, director, and scene links without credentials. The private session should remain inaccessible.
3. Try a signed-in account outside the allowlist. It should be denied, not merely asked to sign in.
4. Try the director URL as an approved ordinary guest. Confirm the normal SSO flow denies director access.
5. Check old scene and solo links after migration; unchanged source credentials may preserve access.
6. Test removal during a connection and after reconnecting. Check media, not just the roster.
7. Test generated OBS tokens separately; they intentionally bypass interactive login.

Passing normal-browser checks verifies the intended workflow. It does not establish resistance to modified clients, which requires separate signaling and publisher-side authorization testing.

## Verification scope

Reviewed September 5, 2026 against local VDO.Ninja client/SSO service source, deployed app.invite.cam source, and the public app guide. The app's 107 local checks passed (69 app/roster checks and 38 full-handler access checks); the unclaimed-room ownership test is explicitly deferred. Production browser checks covered guest publishing, director reception, shared viewing, denial of unshared guest scene/solo access, and connected media revocation. A real Discord session also exercised helper activation and demotion. The additional solo-credential test identified the client deployment caveat above. These are not a complete adversarial security audit.

Fresh Discord OAuth returned to the existing owner room, and native OBS 32.2.2 received synthetic video/audio through scene and solo browser sources, including after reload. The solo-link credential limitation above still applies. Live signed-in VDO.Ninja SSO admission has not been tested; app.invite.cam uses a separate access system, and its successful tests do not establish SSO security. Verify the client and server versions used for your production.

Source paths checked for this review:

* VDO.Ninja: `auth-client.js` (`initAuth`, `checkRoomAccess`, `joinRoomWithAuth`, `createUniversalToken`), `index.html` (SSO settings), and source `webrtc.js` (`directMigrateIssue`, `joinRoom`, play signaling).
* SSO service: `vdo-auth-service/src/routes/room.ts` (access, secret, settings, universal tokens), `src/routes/auth.ts` (login expiry), and `src/utils/allowlist.ts`.
* app.invite.cam: `src/server.mjs` (`handleViewTokenRequest`, `validateVDONAuth`, `handleVDON`), `src/index.html` (`getInviteCamVdoUrl`), and `tests/run-tests.mjs`.
