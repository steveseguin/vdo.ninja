---
description: Simple ways to stop guests from joining a VDO.Ninja room before you are ready for them.
---

# Green room and guest approval options

If you are interviewing people back to back, you may not want the next guest to pop into the room while you are still talking to the current guest.

VDO.Ninja has several ways to handle this. The best choice depends on how simple or how strict you want the setup to be.

## Quick recommendation

For most small interviews, start with this:

**Director link**

```text
https://vdo.ninja/?director=ROOMNAME&requireapproval&approvepopup
```

**Guest link**

```text
https://vdo.ninja/?room=ROOMNAME
```

With this setup, guests wait until the director approves them. The director gets an approval popup, and the guest should see that they are waiting for approval.

Keep the director page open while using this. The approval rule belongs to the active director who has claimed the room.

This is usually the easiest answer when the problem is:

> "The next guest joined while I was still talking to the current guest."

## If you want the guest to feel they are in the right place

Guests can get nervous if they only see a blank or confusing page. A good waiting setup should tell them they are not lost.

These options are friendlier for guests:

| Option | What the guest experiences | Good for |
| --- | --- | --- |
| `&requireapproval` | The guest waits for approval before entering the room. | Simple approval before joining |
| `&hold` | The guest sees a waiting message until activated. | A quiet green room |
| `&holdwithvideo` | The guest sees a waiting message, while the director can preview them. | Checking that the guest is ready before bringing them in |
| `&screen` | The guest can see and hear the director before being activated. | A private pre-show check-in |

If the guest needs the most reassurance, `&screen` feels the most personal. If the director is still live with another guest, `&hold` or `&holdwithvideo` is usually less disruptive.

## Option 1: Approve guests before they enter the room

Use this when you want the director to say yes or no before a guest joins the room.

**Director link**

```text
https://vdo.ninja/?director=ROOMNAME&requireapproval&approvepopup
```

**Guest link**

```text
https://vdo.ninja/?room=ROOMNAME
```

What happens:

* The guest tries to join the room.
* The guest waits for approval.
* The director approves or denies the guest.
* Approved guests enter the room.

This is stronger than putting a queue option only on the guest link, because the approval rule comes from the director's claimed room.

Keep the director page open while using this. If there is no active director claiming the room, there is no director approval rule to enforce.

`&approvepopup` only shows the popup. It does not turn on sounds. Add `&beep` or `&notify` to the director link if you want an audio alert.

## Option 2: Put the guest on hold

Use this when you want the guest to wait on a simple waiting screen.

**Director link**

```text
https://vdo.ninja/?director=ROOMNAME&approvepopup
```

**Guest link**

```text
https://vdo.ninja/?room=ROOMNAME&hold
```

What happens:

* The guest sees a waiting message.
* The guest does not see or hear the director yet.
* The director sees the guest listed with an **Activate Guest** button.
* When the director clicks **Activate Guest**, the guest joins normally.

This is a good green-room style setup when you do not want the next guest watching or hearing anything before their turn.

`&approvepopup` helps the waiting guest get noticed. Add `&beep` or `&notify` to the director link if you also want a sound.

`&hold` is also called `&queue3`.

## Option 3: Put the guest on hold, but let the director preview them

Use this when the director wants to check that the guest's camera, microphone, name, or lighting is ready before bringing them in.

**Director link**

```text
https://vdo.ninja/?director=ROOMNAME&approvepopup
```

**Guest link**

```text
https://vdo.ninja/?room=ROOMNAME&holdwithvideo
```

What happens:

* The guest sees a waiting message.
* The guest does not see or hear the director yet.
* The director can see and hear the guest before activating them.
* The director clicks **Activate Guest** when ready.

This is often the nicest balance for a small show: the guest has a clear waiting state, and the director can quietly check whether they are ready.

`&approvepopup` helps the waiting guest get noticed. Add `&beep` or `&notify` to the director link if you also want a sound.

`&holdwithvideo` is also called `&queue4`.

## Option 4: Screen the guest privately before adding them to the room

Use this when the director wants to talk to the guest before adding them to the main room.

**Director link**

```text
https://vdo.ninja/?director=ROOMNAME&approvepopup
```

**Guest link**

```text
https://vdo.ninja/?room=ROOMNAME&screen
```

What happens:

* The guest can see and hear the director.
* The guest does not see the other guests yet.
* The director can activate the guest when ready.

This is useful for a quick "Can you hear me?" check. It is less ideal if the director is still actively talking to another guest, because the waiting guest may be able to see or hear the director before their turn.

`&screen` is also called `&queue2`.

## Option 5: Use a full queue or screening room

Use this when many people may join, or when you do not want all waiting guests connected to the director at once.

**Director link**

```text
https://vdo.ninja/?director=LOBBYROOM&queue
```

**Guest link**

```text
https://vdo.ninja/?room=LOBBYROOM&queue
```

What happens:

* Guests wait in a queue.
* The director loads guests from the queue as needed.
* The director can transfer approved guests to another room.

This is better for larger events. It is more setup, but it protects the main room and reduces the load on the director's computer.

## Option 6: Use two rooms and transfer approved guests

Use this when you want a public lobby and a private live room.

Example:

* Guests join `LobbyRoom`.
* The real show happens in `LiveRoom`.
* The director screens people in the lobby.
* Approved guests are transferred into the live room.

The useful director helper is `&rooms`, which adds room transfer buttons.

```text
https://vdo.ninja/?director=LobbyRoom&rooms=LiveRoom
```

If a transferred guest should still wait for final approval in the destination room, add `&queuetransfer` to the guest link.

```text
https://vdo.ninja/?room=LobbyRoom&queuetransfer
```

This setup is more work, but it is one of the safer ways to keep the live room private.

## Option 7: Use app.invite.cam for a larger lobby

[app.invite.cam](https://app.invite.cam) is a separate lobby and invite workflow that can sit in front of VDO.Ninja.

Use it when you want:

* a public lobby link
* waiting lists
* signed-in room ownership
* owner-controlled approval before someone reaches the real VDO.Ninja room
* a cleaner experience for many guests

This is different from a normal VDO.Ninja room link. It manages the waiting and approval step before sending approved people into VDO.Ninja.

## Advanced access options

These can help in special cases, but they are not the first thing most people should use for a simple green room.

| Option | What it does |
| --- | --- |
| `&roomcap=1` | Limits how many guests can be admitted to the room. Useful if only one guest should be in the room at a time. |
| `&roomkey=KEY` | Lets trusted guests bypass approval or a custom room cap. Treat it like a password. |
| `&password=PASSWORD` | Makes the room or stream require a password. Useful if you rotate passwords between groups. |
| `&prompt` | Asks a single source before sending its video/audio to a viewer. This is not a room waiting room. |
| `&auth` / `&requireauth` | Uses a signed-in access layer before joining. Better for identity-based access, not quick guest screening. |
| Cloudflare Zero Trust | Can protect a self-hosted VDO.Ninja site before the page loads. Advanced setup. |

## Which one should I pick?

For a simple back-to-back interview, use `&requireapproval&approvepopup`.

For a green room where the guest sees a waiting message, use `&hold`.

For a green room where the director can quietly preview the guest first, use `&holdwithvideo`.

For many guests or public events, use a full `&queue` lobby, two rooms with transfers, or app.invite.cam.

`&scene` is not the right tool for this. Scenes control what appears in OBS or a scene view; they do not stop a guest from entering the room.

## Related

{% content-ref url="how-to-selectively-allow-access.md" %}
[how-to-selectively-allow-access.md](how-to-selectively-allow-access.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/queue.md" %}
[queue.md](../general-settings/queue.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/director-parameters/and-requireapproval.md" %}
[and-requireapproval.md](../advanced-settings/director-parameters/and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="../getting-started/rooms/transfer-rooms.md" %}
[transfer-rooms.md](../getting-started/rooms/transfer-rooms.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/app-invite-cam.md" %}
[app-invite-cam.md](../steves-helper-apps/app-invite-cam.md)
{% endcontent-ref %}
