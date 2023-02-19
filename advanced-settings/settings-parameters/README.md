---
description: >-
  Language, save cookies, remote access, chat widget, chunked mode, raise hands,
  notify, transcription, closed captions
---

# Settings Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General Options

You can use them for publisher, viewer and director URLs.

| Parameter                                              | Explanation                                                                                  |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| ``[`&language`](and-language.md)``                     | Sets the interface language                                                                  |
| ``[`&remote`](../../general-settings/remote.md)``      | Allows remote operation of the zoom and focus, and access to statistics                      |
| ``[`&controlobs`](and-controlobs.md)\*                 | The ability for VDO.Ninja to Remotely Control OBS Studio while streaming/directing           |
| ``[`&stats`](../../general-settings/and-stats.md)``    | Shows the connection/media stats window by default                                           |
| ``[`&sticky`](../../general-settings/sticky.md)``      | Allows a user to save and then later restore their streaming session settings                |
| ``[`&clearstorage`](and-clearstorage-alpha.md) (alpha) | Will clear all the saved user preferences for all sessions                                   |
| ``[`&disablehotkeys`](and-disablehotkeys.md)``         | Disables hotkeys (like `CRTL + M`)                                                           |
| ``[`&showlist`](../../source-settings/showlist.md)``   | Shows list of hidden guests                                                                  |
| ``[`&nopush`](and-nopush.md)\*                         | Blocks outbound publishing connections                                                       |
| ``[`&hidehome`](and-hidehome.md)\*                     | Hides the VDO.Ninja homepage and many links that lead to it                                  |
| ``[`&hidetranslate`](and-hidetranslate.md)\*           | Hides the option to translate VDO.Ninja                                                      |
| ``[`&clock`](and-clock.md)\*                           | Shows the current time                                                                       |
| ``[`&timer`](and-timer-alpha.md) (alpha)               | Positions the countdown timer                                                                |
| ``[`&powerpoint`](and-powerpoint-alpha.md) (alpha)     | Adds a built-in basic controller to control PowerPoint                                       |
| ``[`&widget`](and-widget-alpha.md) (alpha)             | Will load a side-bar with an IFrame embed, with support for YouTube / Twitch / Social Stream |
| ``[`&token`](and-token-alpha.md) (alpha)               | A token for invite/scene links to determine whose the director of a room                     |

\*NEW IN VERSION 22

## Source Side Options

**Source Settings**, which are settings specific to publishing. The parameters can be added to a publishing link, like for example a guest, a director or just a basic push link.

| Parameter                                                             | Explanation                                                                                                          |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ``[`&transcribe`](../../source-settings/transcribe.md)``              | Enables transcription and closed captioning                                                                          |
| ``[`&signalmeter`](../../newly-added-parameters/and-signalmeter.md)`` | Visualizes the packet loss of a guest                                                                                |
| ``[`&consent`](../../source-settings/consent.md)``                    | Will ask the user for content to remote change their camera or microphone                                            |
| ``[`&prompt`](and-prompt.md)\*                                        | Another security option, for those concerned about random spying of their streams                                    |
| ``[`&hands`](../../source-settings/and-hands.md)``                    | Enables a "Raise Hand" button for guests                                                                             |
| ``[`&notify`](../../source-settings/and-notify.md)``                  | Audio alerts for raised hands, chat messages and if somebody joins the room                                          |
| ``[`&r2d2`](../../source-settings/r2d2.md)``                          | Easter egg [`&notify`](../../source-settings/and-notify.md) sound                                                    |
| ``[`&directorchat`](../../source-settings/directorchat.md)``          | Message ONLY the director                                                                                            |
| ``[`&maxconnections`](../../source-settings/and-maxconnections.md)``  | Limits total of view and push connections                                                                            |
| ``[`&maxviewers`](../../source-settings/and-maxviewers.md)``          | Limits the number of viewers allowed                                                                                 |
| ``[`&chunked`](../../newly-added-parameters/and-chunked.md)``         | Does not use webRTC's video streaming protocols; rather it uses a custom-made protocol                               |
| ``[`&rampuptime`](../../newly-added-parameters/and-rampuptime.md)``   | When a guest connects, this tries to load video from that guest for a few seconds, even if not yet added to a scene  |
| ``[`&sensor`](../../source-settings/sensor.md)``                      | Access device sensor data at given rate                                                                              |
| ``[`&sensorfilter`](and-sensorfilter.md)\*                            | An option to explicitly list what [`&sensor`](../../source-settings/sensor.md) data you want to capture and transmit |
| ``[`&postimage`](and-postimage.md)\*                                  | Post a snapshot of your local camera to a HTTPS/POST URL                                                             |
| ``[`&postinterval`](and-postinterval.md)\*                            | Time interval in seconds for [`&postimage`](and-postimage.md)``                                                      |

\*NEW IN VERSION 22

## Viewer Side Options

**Viewer's Settings**, which are aspects that are controllable by the viewer's side. These parameters are mostly added to [`&room`](../../general-settings/room.md) (viewing other guests), [`&view`](../view-parameters/view.md) and [`&scene`](../view-parameters/scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md) links, but some of them can also be added to the director's URL.

| Parameter                                                               | Explanation                                                                                                           |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ``[`&closedcaptions`](and-closedcaptions.md)                            | Enables displaying of closed captioning text                                                                          |
| ``[`&enhance`](../view-parameters/enhance.md)``                         | Tells the remote source that you would like them to prioritize the audio stream over other streams                    |
| ``[`&bitratecutoff`](../parameters-only-on-beta/and-bitratecutoff.md)`` | If the total bitrate drops below the specified bitrate, the viewer will auto-hide the audio and video for that stream |
| ``[`&cutscene`](and-cutscene-alpha.md) (alpha)                          | Specifies an OBS cut scene to switch to when the bitrate drops below a threshold                                      |
| ``[`&statsinterval`](../parameters-only-on-beta/and-statsinterval.md)`` | Lets you change the default stats update interval from 3-seconds to something else                                    |
| ``[`&keyframerate`](../view-parameters/keyframerate.md)``               | This tells the remote publishers to send keyframes at a specified rate                                                |
| ``[`&maxpublishers`](../view-parameters/and-maxpublishers.md)``         | Limits the number of remote peer connections that are publishers                                                      |
| ``[`&showconnections`](and-showconnections.md)\*                        | Displays the total number of p2p connections of a remote stream                                                       |
| ``[`&obsfix`](../view-parameters/and-obsfix.md)``                       | Disables or adjusts the sensitivity of the VP8/VP9 Codec packet loss 'fix' for OBS                                    |
| ``[`&streamlabs`](../view-parameters/streamlabs.md)``                   | Tells VDO.Ninja to not block VDO.Ninja from attempting to run when using Streamlabs for MacOS                         |
| ``[`&getfaces`](and-getfaces.md)\*                                      | Will request a continuous stream of face bounding boxes                                                               |

\*NEW IN VERSION 22
