---
description: Layout and design for the mixer in rooms/scenes, preload/hidden scene bitrate
---

# Mixer/Scene Parameters

Mixer/Scene Parameters are [viewer side](./#viewer-side-options) (view) options. You can add them to guest's URLs in rooms and scene URLs.

## **Room and Scene options**

You have to add them to [`&scene`](scene.md) or [`&room`](../../general-settings/room.md) Parameters.

| Parameter                                | Explanation                                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ``[`&view`](view.md)``                   | Defines the stream or streams you are receiving, by their stream IDs                                                 |
| ``[`&exclude`](and-exclude.md)``         | Same concept as [`&view`](view.md), except does the opposite                                                         |
| ``[`&activespeaker`](activespeaker.md)`` | Auto-hides remote guests videos when added, if those guests are not speaking actively                                |
| ``[`&slots`](and-slots.md)``             | Will force the auto-mixer to have that number of slots, even if there are more or less videos available to fill them |
| ``[`&randomize`](randomize.md)``         | Random video loading order                                                                                           |
| ``[`&cover`](cover.md)``                 | Has the videos fully "cover" their assigned areas, even if it means cropping the video                               |
| ``[`&43`](and-43.md)``                   | Optimizes the video mixer for 4:3 aspect ratio                                                                       |
| ``[`&portrait`](and-portrait.md)``       | Optimizes the video mixer for 9:16 aspect ratio                                                                      |
| ``[`&square`](and-square.md)``           | Optimizes the video mixer for 1:1 aspect ratio videos                                                                |

## **Only Scene options**

You have to add them to [`&scene`](scene.md) Parameters.

| Parameter                                              | Explanation                                                                                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| ``[`&scene`](scene.md)``                               | Defines the link to be treated like a scene                                                                                                     |
| ``[`&scenetype`](scenetype.md)``                       | Shows only the last added video to a scene                                                                                                      |
| ``[`&autoadd`](and-autoadd.md)``                       | Auto-adds the specified stream IDs to the scene                                                                                                 |
| ``[`&hiddenscenebitrate`](and-hiddenscenebitrate.md)`` | Can be used to force videos not added yet to a scene to run at the specified bitrate                                                            |
| ``[`&preloadbitrate`](and-preloadbitrate.md)``         | Can be used to change the pre-load target bitrate for scenes                                                                                    |
| ``[`&waitimage`](and-waitimage.md)``                   | You can add a custom image which shows up while waiting for the [`&scene`](scene.md) link                                                       |
| ``[`&waitmessage`](and-waitmessage.md)``               | You can add a custom message which shows up while waiting for the [`&scene`](scene.md) link                                                     |
| ``[`&waittimeout`](and-waittimeout.md)``               | Specifies a delay for [`&waitimage`](and-waitimage.md) and [`&waitmessage`](and-waitmessage.md) while waiting for the [`&scene`](scene.md) link |
