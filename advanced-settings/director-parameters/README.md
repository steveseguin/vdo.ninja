---
description: Options for &director URLs
---

# Director Parameters

Parameters specified for the director's control panel; have to be used together with the [`&director`](../../viewers-settings/director.md) parameter.

| Parameter                                                                  | Explanation                                                                                   |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| ``[`&director`](../../viewers-settings/director.md)``                      | Enters a room as the director, instead of a guest and have full control                       |
| ``[`&codirector`](../../director-settings/codirector.md)``                 | Allows assistant directors to have access to the director's room, with a subset of control    |
| ``[`&totalroombitrate`](../video-bitrate-parameters/totalroombitrate.md)`` | The total bitrate a guest in a room can view video streams with                               |
| ``[`&blindall`](../../newly-added-parameters/and-blindall.md)``            | It allows the director 'blinding' all the guests at a time with a new button                  |
| ``[`&cleandirector`](../../director-settings/cleandirector.md)``           | Hides the invite URL options in the Director's room                                           |
| ``[`&hidesolo`](../../newly-added-parameters/and-hidesolo.md)``            | Lets you hide the solo links from showing                                                     |
| ``[`&hidecodirectors`](and-hidecodirectors.md)\*                           | Hides the co-directors from appearing in the director's room                                  |
| ``[`&minidirector`](../../newly-added-parameters/and-minidirector.md)``    | Default mini director stylesheet                                                              |
| ``[`&orderby`](../../newly-added-parameters/and-orderby.md)``              | Orders guest's by their stream ID in the director's room                                      |
| ``[`&queue`](../../general-settings/queue.md)``                            | A basic guest queuing system                                                                  |
| ``[`&rooms`](../../director-settings/rooms.md)``                           | Quick director access to a list of rooms for transfering guests                               |
| ``[`&showdirector`](../../viewers-settings/and-showdirector.md)``          | Lets the director perform alongside guests, showing up in scene-view links                    |
| ``[`&notify`](../../source-settings/and-notify.md)``                       | Audio alerts for raised hands, chat messages and if somebody joins the room                   |
| ``[`&mutespeaker=0`](../../source-settings/and-mutespeaker.md)``           | Can be used to have the director join unmuted                                                 |
| ``[`&slotmode`](and-slotmode.md)\*                                         | Gives you the possibility to assign slots to the connected guests                             |
| ``[`&previewmode`](and-previewmode.md)\*                                   | Activates the Preview layout for the director's room by default                               |
| ``[`&showconnections`](../settings-parameters/and-showconnections.md)\*    | Displays the total number of p2p connections of a remote stream                               |
| ``[`&novice`](and-novice.md)\*                                             | Hides some advanced guest options in the director's control center                            |
| ``[`&layouts`](and-layouts.md)\*                                           | An ordered array of layouts, which can be used to switch between using the API layouts action |
| ``[`&widget`](../settings-parameters/sticky-3.md) (alpha)                  | Will load a side-bar with an IFrame embed, with support for YouTube / Twitch / Social Stream  |

\*NEW IN VERSION 22
