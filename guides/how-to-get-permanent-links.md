---
description: >-
  Make VDO.Ninja guest invites, OBS browser sources, stream IDs, scenes, slots,
  SSO links, and invite links reusable so they keep working after refreshes or
  reconnects.
---

# Permanent links, reusable invites, and stream IDs

If your OBS browser source stops showing the right guest after they refresh, you usually need a **stable stream ID**.

Think of it like a phone number for a camera feed:

* the guest link says, "publish as this ID" with [`&push=ALICE`](../source-settings/push.md)
* the OBS/browser-source link says, "watch that ID" with [`&view=ALICE`](../advanced-settings/view-parameters/view.md)
* if the same guest comes back with the same ID, your OBS link keeps working

## Quick answer for OBS

Give each regular guest their own `&push` value:

```
https://vdo.ninja/?room=MyShow&push=AliceCamera&label=Alice
```

Then use the matching `&view` link in OBS:

```
https://vdo.ninja/?view=AliceCamera&solo&room=MyShow
```

Use a different `&push` value for every guest or camera. Two people cannot publish with the same stream ID at the same time.

{% hint style="info" %}
Use a friendly label for the person, but a hard-to-guess stream ID for the URL. For example, `&push=A7kP9vAliceCam` and `&label=Alice`.
{% endhint %}

## Pick the right method

| Goal | Use this |
| --- | --- |
| One regular guest should always feed the same OBS source | Set [`&push=STREAMID`](../source-settings/push.md) on their guest link and use `&view=STREAMID` in OBS |
| You want VDO.Ninja to remember a generated ID for that browser | Use [`&permaid`](../advanced-settings/setup-parameters/and-permaid.md) on the guest link |
| You want one OBS source per position, not per person | Use [`&slotmode`](../advanced-settings/director-parameters/and-slotmode.md), [`&slot=N`](../advanced-settings/settings-parameters/and-slot.md), and [`&viewslot=N`](../advanced-settings/mixer-scene-parameters/and-viewslot.md) |
| You manually add guests to scenes and want that to recover after reconnects | Add [`&scenerestore`](../advanced-settings/mixer-scene-parameters/and-scenerestore.md) to the director link |
| You sent an invite already and want to change where it points | Use a managed short link, such as [invite.cam](../steves-helper-apps/invite-link-generators.md) or another URL shortener |
| You want a lobby, sign-in, waiting list, and reusable host room | Use [app.invite.cam](../steves-helper-apps/app-invite-cam.md) |
| You need sign-in before a VDO.Ninja room is used | Use [SSO and signed-in access](sso-and-signed-in-access.md), such as `&auth` or `&requireauth` |

## How stream IDs work

Every published camera, microphone, screen share, or media source needs a stream ID. When you use:

```
https://vdo.ninja/?push=AliceCamera
```

the guest is publishing as `AliceCamera`. A viewer or OBS source can watch it with:

```
https://vdo.ninja/?view=AliceCamera
```

Stream IDs are not permanent accounts. They exist while someone is actively using them. What makes a link "permanent" is reusing the same ID later.

Rules to remember:

* stream IDs are case sensitive
* keep them under 64 characters
* unsupported characters may be changed to `_`
* a stream ID cannot be used by two active publishers at once
* use [`&label`](../general-settings/label.md) for the human name shown in the interface

## Refreshing vs rejoining

If a guest joins a room without a `&push` value, VDO.Ninja normally generates one once they start publishing. Their address bar may update with that new `&push` value.

That means:

* refreshing the same tab often keeps the same stream ID
* reopening the original invite link may create a new stream ID
* copying a guest's address bar after they joined can accidentally share their private stream ID with someone else

For planned shows, give each regular guest a prepared invite link with a unique `&push` value.

## Use `&permaid` when you do not want to pre-name everyone

[`&permaid`](../advanced-settings/setup-parameters/and-permaid.md) saves a stream ID in that browser's local storage.

Example:

```
https://vdo.ninja/?room=MyShow&permaid&label=Guest
```

The first time the guest opens it, VDO.Ninja creates a stream ID and saves it in that browser. The next time the same person opens a link with `&permaid`, that saved ID is reused.

This is useful when you want a reusable guest link, but you do not want to make up a `&push` ID in advance.

Important limits:

* it depends on the same browser and browser profile
* it can break if the guest clears site data, changes devices, or uses private/incognito mode
* it is not a cloud account or a reserved name

You can also set the first ID yourself:

```
https://vdo.ninja/?room=MyShow&permaid=AliceCamera
```

After that, `&permaid` without a value can reuse the saved value in that browser.

## Use scenes when OBS should not care who the guest is

Sometimes you do not want an OBS source for "Alice"; you want an OBS source for "the person currently in Scene 1".

Use a scene link in OBS:

```
https://vdo.ninja/?scene=1&room=MyShow
```

Then the director manually adds the current guest to Scene 1. The OBS source stays the same even when the person changes.

## Use slots when OBS should follow positions

Slots are good when your show has fixed positions, such as Host, Guest 1, Guest 2, or Piano.

Director link:

```
https://vdo.ninja/?director=MyShow&slotmode
```

Guest link for a preferred slot:

```
https://vdo.ninja/?room=MyShow&push=AliceCamera&slot=1
```

OBS source for that slot:

```
https://vdo.ninja/?scene&room=MyShow&viewslot=1
```

The OBS source follows whatever the director has assigned to slot 1. If the guest changes, the OBS link does not need to change.

## Use `&scenerestore` for reconnects

[`&scenerestore`](../advanced-settings/mixer-scene-parameters/and-scenerestore.md) is a director option:

```
https://vdo.ninja/?director=MyShow&scenerestore
```

It helps when you manually add a guest to a scene and that guest disconnects briefly. If the guest reconnects soon enough with the matching restore identity, the director can restore their previous scene selection.

This is not a permanent cloud scene store. It uses a temporary local restore lease, currently around 15 minutes after the last relevant scene action. It also does not bypass room security, queue, approval, or SSO.

{% hint style="info" %}
If you are searching for `scenestore`, `scene store`, or "store scene", the current VDO.Ninja option is named `&scenerestore`.
{% endhint %}

## Managed invite links and short links

VDO.Ninja links can get long. They also sometimes need to change after you already sent them.

Options:

* [invite.cam](https://invite.cam/) can encode or shorten VDO.Ninja invite links. Where enabled, its signed-in dashboard can manage reusable short links.
* [app.invite.cam](../steves-helper-apps/app-invite-cam.md) gives hosts a reusable signed-in room, lobby, helper controls, and owner-managed invite links.
* Third-party URL managers, such as Short.io, can point a friendly URL at a VDO.Ninja invite and let you update the target later.

Use a short-link manager when you want to change an invite after sending it. Use `&push` or `&permaid` when you want the same guest to keep the same stream ID.

## Signed-in rooms, SSO, and browser-source links

The newer signed-in access flow uses [`&auth`](sso-and-signed-in-access.md) and [`&requireauth`](sso-and-signed-in-access.md).

In plain language:

* `&auth` turns on the signed-in VDO.Ninja access layer
* `&requireauth` makes sign-in required
* the authenticated director can generate scene, view, and solo links with a `&universaltoken` so OBS/browser sources can view without a person signing in inside OBS
* `&authtoken` is used during sign-in redirects and is normally saved then removed from the visible URL

SSO is about identity and access. It does not replace `&push`, `&permaid`, scenes, or slots when your goal is a stable OBS source.

## Which link should I give guests?

For a simple recurring guest:

```
https://vdo.ninja/?room=MyShow&push=AliceCamera&label=Alice
```

For a guest whose browser should remember its own generated ID:

```
https://vdo.ninja/?room=MyShow&permaid&label=Guest
```

For a signed-in room where the access layer is enabled:

```
https://vdo.ninja/?room=MyShow&auth
```

For a room where sign-in is required:

```
https://vdo.ninja/?room=MyShow&requireauth
```

For a larger lobby or event workflow:

```
https://app.invite.cam/
```

## Common mistakes

* Do not give two people the same `&push` value.
* Do not paste a guest's already-joined address-bar URL into a public chat.
* Do not expect `&permaid` to follow a person across devices.
* Do not use a person's real name as the only stream ID if the link is public.
* Do not confuse `&view=STREAMID` with a slot number. To view a slot, use [`&viewslot`](../advanced-settings/mixer-scene-parameters/and-viewslot.md).
* Do not rely on `&scenerestore` as a permanent database. It is a reconnect helper.

## Related pages

{% content-ref url="../getting-started/stream-ids.md" %}
[stream-ids.md](../getting-started/stream-ids.md)
{% endcontent-ref %}

{% content-ref url="../source-settings/push.md" %}
[push.md](../source-settings/push.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/setup-parameters/and-permaid.md" %}
[and-permaid.md](../advanced-settings/setup-parameters/and-permaid.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/mixer-scene-parameters/and-scenerestore.md" %}
[and-scenerestore.md](../advanced-settings/mixer-scene-parameters/and-scenerestore.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/mixer-scene-parameters/and-viewslot.md" %}
[and-viewslot.md](../advanced-settings/mixer-scene-parameters/and-viewslot.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/app-invite-cam.md" %}
[app-invite-cam.md](../steves-helper-apps/app-invite-cam.md)
{% endcontent-ref %}

{% content-ref url="sso-and-signed-in-access.md" %}
[sso-and-signed-in-access.md](sso-and-signed-in-access.md)
{% endcontent-ref %}

## Search words

People may search for this as: permanent link, persistent link, persistant link, reusable link, re-usable link, reusable guest invite, persistent browser source, OBS source refresh, same browser source, same stream ID, streamid, stream id, permaid, perma id, permanent ID, permaID, scene store, scenestore, scene restore, scenerestore, short link, shortener, URL shortner, URL shortener, invite manager, link management, app invite cam, invite.cam, SSO invite, signed-in room, authenticated invite.
