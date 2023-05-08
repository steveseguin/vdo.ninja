---
description: >-
  Upcoming parameters which are currently on vdo.ninja/alpha and/or
  vdo.ninja/beta
---

# Upcoming Parameters

You can use/test these parameters on [vdo.ninja/alpha](https://vdo.ninja/alpha/) and/or [vdo.ninja/beta](https://vdo.ninja/beta/)

| Parameter                                                                            | Explanation                                                                                                                                              |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`&automute`](audio-parameters/and-automute-alpha.md)\*\*                            | Will mute the microphone of a guest when not loaded in an active OBS scene                                                                               |
| [`&fakeguests`](mixer-scene-parameters/and-fakeguests-alpha.md)\*\*                  | Creates simulated guest videos                                                                                                                           |
| [`&clearstorage`](settings-parameters/and-clearstorage-alpha.md)\*\*                 | Will clear all the saved user preferences for all sessions                                                                                               |
| [`&whip`](mixer-scene-parameters/and-whip-alpha.md)\*\*                              | Publish directly from OBS to VDO.Ninja without a virtual camera                                                                                          |
| [`&mididelay`](api-and-midi-parameters/and-mididelay-alpha.md)\*\*                   | Lets you precisely delay the MIDI play-out                                                                                                               |
| [`&buffer2`](video-parameters/and-buffer2-alpha.md)\*\*                              | Same as [`&buffer`](view-parameters/buffer.md), but instead includes the round-trip-time                                                                 |
| [`&groupview`](setup-parameters/and-groupview-alpha.md)\*\*                          | The same as [`&group`](../general-settings/and-group.md), except it lets you see those groups without actually needing to join them with your mic/camera |
| [`&powerpoint`](settings-parameters/and-powerpoint-alpha.md)\*\*                     | Adds a built-in basic controller to control PowerPoint                                                                                                   |
| [`&widget`](settings-parameters/and-widget-alpha.md)\*\*                             | Will load a side-bar with an IFrame embed, with support for YouTube / Twitch / Social Stream                                                             |
| [`&maindirectorpassword`](director-parameters/and-maindirectorpassword-alpha.md)\*\* | Lets you set a pseudo 'master room password' as a director                                                                                               |
| [`&token`](settings-parameters/and-token-alpha.md)\*\*                               | A token for invite/scene links to determine whose the director of a room                                                                                 |
| [`&cutscene`](settings-parameters/and-cutscene-alpha.md)\*\*                         | Specifies an OBS cut scene to switch to when the bitrate drops below a threshold                                                                         |
| [`&distort`](audio-parameters/and-distort-alpha.md)\*\*                              | Will try to "distort" your microphone's output audio, making your voice a bit anonymous                                                                  |
| [`&tally`](design-parameters/tallyoff.md)\*\*                                        | Will make the tally sign larger and colorize the background of the page                                                                                  |
| [`&timer`](settings-parameters/and-timer-alpha.md)\*\*                               | Positions the countdown timer                                                                                                                            |
| [`&allowedscenes`](settings-parameters/and-allowedscenes-alpha.md)\*\*               | Option to filter which OBS scenes a remote guest has access to controlling when using [`&controlobs`](settings-parameters/and-controlobs.md)             |
| [`&postapi`](api-and-midi-parameters/and-postapi-alpha.md)\*                         | Lets you specify a custom POST URL to send events within VDO.Ninja to                                                                                    |
| [`&permaid`](setup-parameters/and-permaid-alpha.md)\*                                | Will save that stream ID to local storage and reuse it every time `&permaid` is used without a stream ID                                                 |
| [`&favicon`](design-parameters/and-favicon-alpha.md)\*                               | Will change the browser's page favicon image                                                                                                             |
| [`&headertitle`](design-parameters/and-headertitle-alpha.md)\*                       | Will change the browser's page title                                                                                                                     |
| [`&nochunked`](settings-parameters/and-nochunked-alpha.md)\*                         | Will ignore the chunked version and use the low-latency version                                                                                          |
| [`&miconlyoption`](setup-parameters/and-miconlyoption-alpha.md)\*                    | A mic only button shows if a guest joining a room                                                                                                        |
| [`&structure`](design-parameters/and-structure-alpha.md)\*                           | Will have the video holding div element be structured to the aspect ratio                                                                                |
| [`&color`](design-parameters/and-color-alpha.md)\*                                   | You can specify the background color independent of the border color                                                                                     |
| [`&blur`](design-parameters/and-blur-alpha.md)\*                                     | Will try to add a blurred background to the video so it fits the structured video container                                                              |
|                                                                                      |                                                                                                                                                          |
|                                                                                      |                                                                                                                                                          |
|                                                                                      |                                                                                                                                                          |
|                                                                                      |                                                                                                                                                          |
|                                                                                      | Will pre-select display-share, rather than tab-share, when screen-sharing                                                                                |

\*only on [vdo.ninja/alpha](https://vdo.ninja/alpha/)\
\*\*on [vdo.ninja/beta](https://vdo.ninja/beta/) and [vdo.ninja/alpha](https://vdo.ninja/alpha/)
