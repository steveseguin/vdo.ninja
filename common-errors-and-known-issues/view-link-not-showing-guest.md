---
description: Why a ?view link shows nothing or the wrong thing
---

# View link not showing a guest

Common causes and quick fixes when `?view=` shows nothing or the wrong feed.

- Incorrect ID: `?view=` expects one or more stream IDs, not slot numbers. Example: `?view=ABC123` not `?view=0`.
- Get IDs: In Director, copy the guest’s stream ID from the guest tile menu; then use it in `?view=`.
- In rooms, use `?scene&room=MyRoom` to render the scene, or `?scene&room=MyRoom&view=ID1,ID2` to pull specific streams in a room
- Push vs view: Don’t paste a `?push=` link into OBS. Replace `?push=` with `?view=` when capturing in OBS.
- Empty view: `?view` with no value disables playback. Provide at least one valid ID.

Related

- `guides/how-to-send-the-audio-video-output-of-one-obs-to-another-obs-using-vdo.ninja.md`
- `advanced-settings/view-parameters/view.md`
- `advanced-settings/view-parameters/scene.md`
- `common-errors-and-known-issues/no-video-in-obs-just-an-add-camera-button.md`

