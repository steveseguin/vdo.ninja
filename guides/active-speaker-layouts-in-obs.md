---
description: How to build OBS layouts with fixed guest boxes and a larger active speaker or screen-share window using VDO.Ninja.
---

# Active speaker layouts in OBS

This guide covers a common production layout: several guests shown as smaller boxes, with one larger video area for the current speaker, featured guest, or screen share.

There are a few ways to do this. The best option depends on whether you want VDO.Ninja to manage the layout, or whether you want to build the layout manually in OBS.

## Option 1: Let VDO.Ninja manage the main layout

Use a VDO.Ninja scene link as the main Browser Source in OBS:

```text
https://vdo.ninja/?room=ROOMNAME&scene=0
```

Replace `ROOMNAME` with your room name.

If your audio is coming from somewhere else, such as an online radio player, you can disable incoming VDO.Ninja audio on that source:

```text
https://vdo.ninja/?room=ROOMNAME&scene=0&noaudio
```

In the director room, use the Featured / Highlight control to choose which guest is emphasized in the scene output. Any guest video can be featured. Holding `CTRL` while clicking the feature option can apply a partial featured layout, around 80%, rather than fully replacing the view.

This is usually the simplest method if you want one OBS Browser Source for the composed VDO.Ninja layout.

## Option 2: Use solo links for fixed guest boxes

If you want three fixed guest boxes on the side of your OBS canvas, add each guest as a separate OBS Browser Source using their solo link:

```text
https://vdo.ninja/?view=GUESTID&room=ROOMNAME&solo
```

If you do not want audio from these sources:

```text
https://vdo.ninja/?view=GUESTID&room=ROOMNAME&solo&noaudio
```

Replace `GUESTID` with the guest's stream ID.

This gives OBS full control over position, crop, scaling, filters, and scene switching. The tradeoff is that switching the large active speaker view becomes something you manage in OBS with scenes, source visibility, hotkeys, or duplicated/cropped sources.

## Option 3: Use VDO.Ninja for the main window and OBS for the side boxes

A hybrid setup often works well:

* Main large Browser Source: a VDO.Ninja scene link, such as `&scene=0`, controlled by the director's Featured / Highlight button.
* Side guest boxes: individual `&solo` links, positioned manually in OBS.

Example main source:

```text
https://vdo.ninja/?room=ROOMNAME&scene=0&noaudio
```

Example side source:

```text
https://vdo.ninja/?view=GUESTID&room=ROOMNAME&solo&noaudio
```

This keeps the main speaker switching inside VDO.Ninja, while letting OBS handle the permanent guest boxes.

## Screen-share layouts

When someone screen shares, VDO.Ninja can automatically make the screen share large and place the guest videos beside it.

By default, the screen share is large and the guests are placed on the right. To put the guests on the left instead, add `&alignright` or `&rightalign` to the scene or view URL:

```text
https://vdo.ninja/?room=ROOMNAME&scene=0&alignright
```

or:

```text
https://vdo.ninja/?room=ROOMNAME&scene=0&rightalign
```

This option is for the screen-share auto-layout. It does not move arbitrary Featured / Highlight videos.

If you do not want screen shares to become larger than other videos, use `&smallshare`.

## Option 4: Use the Mixer App

The Mixer App provides a more visual layout control surface:

```text
https://vdo.ninja/mixer.html
```

This can be useful if you want to arrange guests and scenes from a dedicated mixer interface rather than building everything directly in OBS.

## Which method should I use?

| Goal | Suggested method |
| --- | --- |
| Fixed guest boxes on the side | Use separate `&solo` links in OBS |
| One large active speaker window | Use a VDO.Ninja `&scene` link and the Featured / Highlight controls |
| Guests on the left during screen sharing | Add `&alignright` or `&rightalign` to the scene/view link |
| Maximum layout control | Build custom OBS scenes with individual Browser Sources |
| Visual VDO.Ninja layout control | Use `https://vdo.ninja/mixer.html` |

If none of these approaches matches your production workflow, feel free to share the exact layout and switching behavior you want. Suggestions are welcome, and better layout options can be considered.
