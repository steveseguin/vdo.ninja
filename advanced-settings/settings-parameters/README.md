---
description: >-
  Language, save cookies, show/hide buttons, control bar, remote access, record,
  chunked mode, raise hands, notify, transcription, closed captions
---

# Settings Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General Options

You can use them for publisher, viewer and director URLs.

| Parameter                                           | Explanation                                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------- |
| ``[`&ln`](../../general-settings/and-ln.md)``       | Sets the interface language                                                   |
| ``[`&remote`](../../general-settings/remote.md)``   | Allows remote operation of the zoom and focus, and access to statistics       |
| ``[`&stats`](../../general-settings/and-stats.md)`` | Shows the connection/media stats window by default                            |
| ``[`&sticky`](../../general-settings/sticky.md)``   | Allows a user to save and then later restore their streaming session settings |
| ``[`&disablehotkeys`](and-disablehotkeys.md)``      | Disables hotkeys (like `CRTL + M`)                                            |

## Source Side Options

**Source Settings**, which are settings specific to publishing. The parameters can be added to a publishing link, like for example a guest, a director or just a basic push link.

| Parameter                                                              | Explanation                                                                                                         |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ``[`&nosettings`](../../source-settings/and-nosettings.md)``           | Disables the local settings button                                                                                  |
| ``[`&nomicbutton`](../../viewers-settings/nomicbutton.md)``            | Disables the mic button; guests can't mute audio                                                                    |
| ``[`&nospeakerbutton`](../../source-settings/and-nospeakerbutton.md)`` | Hides the speaker button                                                                                            |
| ``[`&novideobutton`](../../viewers-settings/and-novideobutton.md)``    | Disables the video button; guests can't mute video                                                                  |
| ``[`&nofileshare`](../../source-settings/nofileshare.md)``             | Hides the ability for a guest to upload a file                                                                      |
| ``[`&ssb`](../../source-settings/ssb.md)``                             | Forces the screen-share button to appear for guests                                                                 |
| ``[`&nohangupbutton`](and-nohangupbutton.md)``                         | Hides the hang-up button                                                                                            |
| ``[`&chatbutton`](../../general-settings/chatbutton.md)``              | Shows or hides the chat button                                                                                      |
| ``[`&bigbutton`](../../newly-added-parameters/and-bigbutton.md)``      | Makes the microphone mute button a lot bigger                                                                       |
| ``[`&autohide`](../../parameters-only-on-beta/and-autohide.md)``       | Auto-hides the control bar after a few moments of the mouse being idle                                              |
| ``[`&videocontrols`](../newly-added-parameters/and-videocontrols.md)`` | Shows the video control bar                                                                                         |
| ``[`&transcribe`](../../source-settings/transcribe.md)``               | Enables transcription and closed captioning                                                                         |
| ``[`&nowebsite`](../../source-settings/nowebsite.md)``                 | Disables IFRAMEs from loading, such as remotely shared websites by another guest or director                        |
| ``[`&showlist`](../../source-settings/showlist.md)``                   | Toggles list of hidden guests                                                                                       |
| ``[`&signalmeter`](../../newly-added-parameters/and-signalmeter.md)``  | Visualizes the packet loss of a guest                                                                               |
| ``[`&consent`](../../source-settings/consent.md)``                     | Will ask the user for content to remote change their camera or microphone                                           |
| ``[`&hands`](../../source-settings/and-hands.md)``                     | Enables a "Raise Hand" button for guests                                                                            |
| ``[`&notify`](../../source-settings/and-notify.md)``                   | Audio alerts for raised hands, chat messages and if somebody joins the room                                         |
| ``[`&r2d2`](../../source-settings/r2d2.md)``                           | Easter egg `&notify` sound                                                                                          |
| ``[`&directorchat`](../../source-settings/directorchat.md)``           | Message ONLY the director                                                                                           |
| ``[`&maxconnections`](../../source-settings/and-maxconnections.md)``   | Limits total of view and push connections                                                                           |
| ``[`&maxviewers`](../../source-settings/and-maxviewers.md)``           | Limits the number of viewers allowed                                                                                |
| ``[`&record`](../../source-settings/and-record.md)``                   | Record functionality for guests                                                                                     |
| ``[`&recordcodec`](../../newly-added-parameters/and-recordcodec.md)``  | Lets you set the video recording vodec                                                                              |
| ``[`&pcm`](../../source-settings/and-pcm.md)``                         | PCM audio recordings                                                                                                |
| ``[`&chunked`](../../newly-added-parameters/and-chunked.md)``          | Does not use webRTC's video streaming protocols; rather it uses a custom-made protocol                              |
| ``[`&rampuptime`](../../newly-added-parameters/and-rampuptime.md)``    | When a guest connects, this tries to load video from that guest for a few seconds, even if not yet added to a scene |
| ``[`&sensor`](../../source-settings/sensor.md)``                       | Access device sensor data at given rate                                                                             |

## Viewer Side Options

**Viewer's Settings**, which are aspects that are controllable by the viewer's side. These parameters are mostly added to [`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md) and [`&scene`](../view-parameters/scene.md) links, but some of them can also be added to the director's URL.

| Parameter                                                               | Explanation                                                                                                           |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ``[`&closedcaptions`](and-closedcaptions.md)                            | Enables displaying of closed captioning text                                                                          |
| ``[`&enhance`](../view-parameters/enhance.md)``                         | Tells the remote source that you would like them to prioritize the audio stream over other streams                    |
| ``[`&bitratecutoff`](../parameters-only-on-beta/and-bitratecutoff.md)`` | If the total bitrate drops below the specified bitrate, the viewer will auto-hide the audio and video for that stream |
| ``[`&statsinterval`](../parameters-only-on-beta/and-statsinterval.md)`` | Lets you change the default stats update interval from 3-seconds to something else                                    |
| ``[`&keyframerate`](../view-parameters/keyframerate.md)``               | This tells the remote publishers to send keyframes at a specified rate                                                |
| ``[`&maxpublishers`](../view-parameters/and-maxpublishers.md)``         | Limits the number of remote peer connections that are publishers                                                      |
| ``[`&obsfix`](../view-parameters/and-obsfix.md)``                       | Disables or adjusts the sensitivity of the VP8/VP9 Codec packet loss 'fix' for OBS                                    |
| ``[`&streamlabs`](../view-parameters/streamlabs.md)``                   | Tells VDO.Ninja to not block VDO.Ninja from attempting to run when using Streamlabs for macOS                         |