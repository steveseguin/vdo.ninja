---
description: Layout and design for the mixer in rooms/scenes, preload/hidden scene bitrate
---

# Mixer/Scene Parameters

Mixer/Scene Parameters are viewer side options. You can add them to guest's URLs in rooms and scene URLs.

## **Room and Scene options**

You have to add them to [`&scene`](../view-parameters/scene.md) or [`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md) URLs to change the behaviour of the Video Mixer.

| Parameter                                                   | Explanation                                                                                                                 |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ``[`&solo`](and-solo.md)\*                                  | Similar to [`&scene`](../view-parameters/scene.md), but tells the system to be a solo-link                                  |
| ``[`&view`](../view-parameters/view.md)``                   | Defines the stream or streams you are receiving, by their stream IDs                                                        |
| ``[`&include`](and-include.md)\*                            | Includes streams that do not exist in the room                                                                              |
| ``[`&exclude`](../view-parameters/and-exclude.md)``         | Same concept as [`&view`](../view-parameters/view.md), except does the opposite                                             |
| ``[`&layout`](and-layout.md)\*                              | Shows the guest a return feed of the current mixer layout when using the [Mixer App](../../steves-helper-apps/mixer-app.md) |
| ``[`&activespeaker`](../view-parameters/activespeaker.md)`` | Auto-hides remote guests videos when added, if those guests are not speaking actively                                       |
| ``[`&order`](../../source-settings/order.md)``              | The order priority of a source video when added to the video mixer                                                          |
| ``[`&slots`](../../newly-added-parameters/and-slots.md)``   | Will force the auto-mixer to have that number of slots, even if there are more or less videos available to fill them        |
| ``[`&fakeguests`](scenetype.md) (alpha)                     | Creates simulated guest videos                                                                                              |
| ``[`&randomize`](../view-parameters/randomize.md)``         | Random video loading order                                                                                                  |
| ``[`&cover`](../view-parameters/cover.md)``                 | Has the videos fully "cover" their assigned areas, even if it means cropping the video                                      |
| ``[`&43`](../../newly-added-parameters/and-43.md)``         | Optimizes the video mixer for 4:3 videos                                                                                    |
| ``[`&portrait`](../view-parameters/and-portrait.md)``       | Optimizes the video mixer for 9:16 videos                                                                                   |
| ``[`&square`](../../newly-added-parameters/and-square.md)`` | Optimizes the video mixer for 1:1 videos                                                                                    |
| ``[`&animated`](../view-parameters/animated.md)``           | Videos in a group scene will slide around the screen when being re-arranged                                                 |
| ``[`&manual`](../view-parameters/manual.md)``               | Disables the auto-mixer, allowing for a custom mixer to be used                                                             |

\*NEW IN VERSION 22

## **Only Scene options**

You have to add them to [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) URLs.

| Parameter                                                                           | Explanation                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ``[`&scene`](../view-parameters/scene.md)``                                         | Defines the link to be treated like a scene                                                                                                                                                                                                                     |
| ``[`&scenetype`](scenetype-1.md)``                                                  | Shows only the last added video to a scene                                                                                                                                                                                                                      |
| ``[`&autoadd`](../../newly-added-parameters/and-autoadd.md)``                       | Auto-adds the specified stream IDs to the scene                                                                                                                                                                                                                 |
| ``[`&hiddenscenebitrate`](../../newly-added-parameters/and-hiddenscenebitrate.md)`` | Can be used to force videos not added yet to a scene to run at the specified bitrate                                                                                                                                                                            |
| ``[`&preloadbitrate`](../../newly-added-parameters/and-preloadbitrate.md)``         | Can be used to change the pre-load target bitrate for scenes                                                                                                                                                                                                    |
| ``[`&waitimage`](../newly-added-parameters/and-waitimage.md)``                      | You can add a custom image which shows up while waiting for the [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) link                                                                                                           |
| ``[`&waitmessage`](../newly-added-parameters/and-waitmessage.md)``                  | You can add a custom message which shows up while waiting for the [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) link                                                                                                         |
| ``[`&waittimeout`](../newly-added-parameters/and-waittimeout.md)``                  | Specifies a delay for [`&waitimage`](../newly-added-parameters/and-waitimage.md) and [`&waitmessage`](../newly-added-parameters/and-waitmessage.md) while waiting for the [`&scene`](../view-parameters/scene.md) or [`&view`](../view-parameters/view.md) link |
