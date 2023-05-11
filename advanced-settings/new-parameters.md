---
description: Recently added to VDO.Ninja
---

# New Parameters in Version 23

These parameters are all on production in [v23](../releases/v23.md) of VDO.Ninja

| Parameter                                                                  | Explanation                                                                                                                                              |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`&automute`](audio-parameters/and-automute.md)                            | Will mute the microphone of a guest when not loaded in an active OBS scene                                                                               |
| [`&fakeguests`](mixer-scene-parameters/and-fakeguests.md)                  | Creates simulated guest videos                                                                                                                           |
| [`&clearstorage`](settings-parameters/and-clearstorage.md)                 | Will clear all the saved user preferences for all sessions                                                                                               |
| [`&whip`](mixer-scene-parameters/and-whip.md)                              | Publish directly from OBS to VDO.Ninja without a virtual camera                                                                                          |
| [`&mididelay`](api-and-midi-parameters/and-mididelay.md)                   | Lets you precisely delay the MIDI play-out                                                                                                               |
| [`&buffer2`](video-parameters/and-buffer2.md)                              | Same as [`&buffer`](view-parameters/buffer.md), but instead includes the round-trip-time                                                                 |
| [`&groupview`](setup-parameters/and-groupview.md)                          | The same as [`&group`](../general-settings/and-group.md), except it lets you see those groups without actually needing to join them with your mic/camera |
| [`&powerpoint`](settings-parameters/and-powerpoint.md)                     | Adds a built-in basic controller to control PowerPoint                                                                                                   |
| [`&widget`](settings-parameters/and-widget.md)                             | Will load a side-bar with an IFrame embed, with support for YouTube / Twitch / Social Stream                                                             |
| [`&maindirectorpassword`](director-parameters/and-maindirectorpassword.md) | Lets you set a pseudo 'master room password' as a director                                                                                               |
| [`&token`](settings-parameters/and-token.md)                               | A token for invite/scene links to determine whose the director of a room                                                                                 |
| [`&cutscene`](settings-parameters/and-cutscene.md)                         | Specifies an OBS cut scene to switch to when the bitrate drops below a threshold                                                                         |
| [`&distort`](audio-parameters/and-distort.md)                              | Will try to "distort" your microphone's output audio, making your voice a bit anonymous                                                                  |
| [`&tally`](design-parameters/tallyoff.md)                                  | Will make the tally sign larger and colorize the background of the page                                                                                  |
| [`&timer`](settings-parameters/and-timer.md)                               | Positions the countdown timer                                                                                                                            |
| [`&allowedscenes`](settings-parameters/and-allowedscenes.md)               | Option to filter which OBS scenes a remote guest has access to controlling when using [`&controlobs`](settings-parameters/and-controlobs.md)             |
| [`&postapi`](api-and-midi-parameters/and-postapi.md)                       | Lets you specify a custom POST URL to send events within VDO.Ninja to                                                                                    |
| [`&permaid`](setup-parameters/and-permaid.md)                              | Will save that stream ID to local storage and reuse it every time `&permaid` is used without a stream ID                                                 |
| [`&favicon`](design-parameters/and-favicon-alpha.md)                       | Will change the browser's page favicon image                                                                                                             |
| [`&headertitle`](design-parameters/and-headertitle.md)                     | Will change the browser's page title                                                                                                                     |
| [`&nochunked`](settings-parameters/and-nochunked.md)                       | Will ignore the chunked version and use the low-latency version                                                                                          |
| [`&miconlyoption`](setup-parameters/and-miconlyoption-alpha.md)            | A mic only button shows if a guest joining a room                                                                                                        |
| [`&structure`](design-parameters/and-structure.md)                         | Will have the video holding div element be structured to the aspect ratio                                                                                |
| [`&color`](design-parameters/and-color.md)                                 | You can specify the background color independent of the border color                                                                                     |
| [`&blur`](design-parameters/and-blur.md)                                   | Will try to add a blurred background to the video so it fits the structured video container                                                              |
| [`&suppresslocalaudio`](screen-share-parameters/and-suppresslocalaudio.md) | Will disable local audio playback of a Chrome tab while screen-sharing it                                                                                |
| [`&prefercurrenttab`](screen-share-parameters/and-prefercurrenttab.md)     | Will have the current tab as the default screen-share source                                                                                             |
| [`&selfbrowsersurface`](screen-share-parameters/and-selfbrowsersurface.md) | Excludes the current tab as a screen-share source option                                                                                                 |
| [`&systemaudio`](screen-share-parameters/and-systemaudio.md)               | Excludes the system-audio as an audio source when display sharing                                                                                        |
| [`&displaysurface`](screen-share-parameters/and-displaysurface.md)         | Will pre-select display-share, rather than tab-share, when screen-sharing                                                                                |
| [`&minipreviewoffset`](video-parameters/and-minipreviewoffset.md)          | Used to position where the mini preview is located by default on screen                                                                                  |
