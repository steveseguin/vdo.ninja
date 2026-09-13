---
description: Share a screen with someone who only wants to watch, using a solo view link, reusable screen-share links, or a room scene.
---

# View-only screen sharing on an iPad or computer

If the receiving device asks whether to join with a camera or audio only, you have opened a **guest invite**. To just watch, open a **view link** or a **scene link**. Viewers do not need to publish a camera or microphone, and OBS is not required.

## Already sharing in a room? Copy the solo view link

1. Return to the room's director/control page.
2. Find the control box for the screen share you want people to watch. If you also have a webcam feed, choose the screen-share feed.
3. Click **copy solo view link** beneath that feed.
4. Send that copied link to the viewer and open it in the iPad's or computer's browser.

Keep the full copied link, including any password or access parameters. The room's guest invitation and the director page address serve different purposes; neither is the screen's viewing link.

Solo links work in ordinary browsers even though the interface and documentation also describe using them in OBS. See [Rooms and solo links](../getting-started/rooms/README.md).

## Simplest reusable setup: two links, no room

For a single screen that others only need to watch, you can skip creating a room.

Choose your own hard-to-guess stream ID and replace `YOURSCREENID` in both examples with exactly the same value.

**Open this on the computer sharing its screen:**

```text
https://vdo.ninja/?push=YOURSCREENID&screenshare
```

Choose the screen, window, or browser tab to share and approve the browser's sharing prompt.

**Send this to the people watching:**

```text
https://vdo.ninja/?view=YOURSCREENID
```

Bookmark both links. Each time, open the publishing link on the sharing computer and start screen sharing again. Viewers reuse the viewing link. Only one device should publish with that ID at a time.

The viewer link can receive shared audio too, if the sender includes it. On an iPad or another browser, you may need to tap the page's play/unmute prompt to hear it. That playback action does not require joining with a microphone.

A reusable link does not keep the screen broadcasting after you close the publishing page or stop sharing. The browser still requires you to approve screen capture when starting a new session.

## Reusable viewing links within a room

For a dedicated screen publisher in a room, use matching room and stream IDs:

**Sharing computer:**

```text
https://vdo.ninja/?room=YOURROOM&push=YOURSCREENID&screenshare
```

**Viewer:**

```text
https://vdo.ninja/?room=YOURROOM&view=YOURSCREENID&solo
```

If the room uses a password, retain the same password/access settings in these links. A separate screen share added alongside a webcam can have a different stream ID; copy its actual solo view link rather than guessing from the webcam's ID.

Alternatively, give viewers a scene link:

```text
https://vdo.ninja/?room=YOURROOM&scene=1
```

In the director page, add the screen share to **Scene 1**. This lets you keep the same viewer URL while choosing which feed appears. Check scene membership when starting a new session. `&scene=0` automatically includes the room's video feeds, so use a selected scene or solo link when viewers should see only the screen.

## Quick troubleshooting

| What you see | What to check |
| --- | --- |
| Camera / audio-only join choices | Open the viewer link, not the guest invite or publishing link. |
| A blank or waiting viewer | Confirm the sender is actively sharing and both links use the same stream ID, room, and password where applicable. |
| An empty Scene 1 | Add the screen-share feed to Scene 1 in the director page. |
| Webcam appears instead of the screen | Copy the screen share's own solo view link. |
| Video works but no sound | Tap play/unmute if prompted; check that the sender included audio in the browser's sharing dialog where supported. |

## Related guides

* [Permanent links, reusable invites, and stream IDs](how-to-get-permanent-links.md)
* [Screen-sharing options](../source-settings/screenshare.md)
* [View links](../advanced-settings/view-parameters/view.md)
* [Room scenes](../advanced-settings/view-parameters/scene.md)
