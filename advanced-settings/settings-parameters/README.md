---
description: >-
  Language, save cookies, show/hide buttons, control bar, remote access, record,
  chunked mode, raise hands, notify, transcription (CC)
---

# Settings Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General Options

You can use them for publisher, viewer and director URLs.

| Parameter                                    | Explanation                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| ``[`&ln`](and-ln.md)``                       | Sets the interface language                                                                |
| ``[`&remote`](remote.md)``                   | Allows remote operation of the zoom and focus, and access to statistics                    |
| ``[`&stats`](and-stats.md)``                 | Shows the connection/media stats window by default                                         |
| ``[`&sticky`](sticky.md)``                   | Allows a user to save and then later restore their streaming session settings              |
| ``[`&pusheffectsdata`](pusheffectsdata.md)`` | Makes the data for the active digital effect available to the IFRAME API or a remote guest |

## Source Side Options

**Source Settings**, which are settings specific to publishing, so these are things related to customizing the camera and microphone. The parameters can be added to a publishing link, like for example a guest, a director or just a basic push link.

| Parameter                                        | Explanation                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| ``[`&nosettings`](and-nosettings.md)``           | Disables the local settings button                                                                                  |
| ``[`&nomicbutton`](nomicbutton.md)``             | Disables the mic button; guests can't mute audio                                                                    |
| ``[`&nospeakerbutton`](and-nospeakerbutton.md)`` | Hides the speaker button                                                                                            |
| ``[`&novideobutton`](and-novideobutton.md)``     | Disables the video button; guests can't mute video                                                                  |
| ``[`&nofileshare`](nofileshare.md)``             | Hides the ability for a guest to upload a file                                                                      |
| ``[`&ssb`](ssb.md)``                             | Forces the screen-share button to appear for guests                                                                 |
| ``[`&chatbutton`](chatbutton.md)``               | Shows or hides the chat button                                                                                      |
| ``[`&bigbutton`](and-bigbutton.md)``             | Makes the microphone mute button a lot bigger                                                                       |
| ``[`&autohide`](and-autohide.md)``               | Auto-hides the control bar after a few moments of the mouse being idle                                              |
| ``[`&videocontrols`](and-videocontrols.md)``     | Shows the video control bar                                                                                         |
| ``[`&transcribe`](transcribe.md)``               | Enables transcription and closed captioning                                                                         |
| ``[`&nowebsite`](nowebsite.md)``                 | Disables IFRAMEs from loading, such as remotely shared websites by another guest or director                        |
| ``[`&showlist`](showlist.md)``                   | Toggles list of hidden guests                                                                                       |
| ``[`&signalmeter`](and-signalmeter.md)``         | Visualizes the packet loss of a guest                                                                               |
| ``[`&consent`](consent.md)``                     | Will ask the user for content to remote change their camera or microphone                                           |
| ``[`&hands`](and-hands.md)``                     | Enables a "Raise Hand" button for guests                                                                            |
| ``[`&notify`](and-notify.md)``                   | Audio alerts for raised hands, chat messages and if somebody joins the room                                         |
| ``[`&r2d2`](r2d2.md)``                           | Easter egg `&notify` sound                                                                                          |
| ``[`&directorchat`](directorchat.md)``           | Message ONLY the director                                                                                           |
| ``[`&maxconnections`](and-maxconnections.md)``   | Limits total of view and push connections                                                                           |
| ``[`&maxviewers`](and-maxviewers.md)``           | Limits the number of viewers allowed                                                                                |
| ``[`&record`](and-record.md)``                   | Record functionality for guests                                                                                     |
| ``[`&recordcodec`](and-recordcodec.md)``         | Lets you set the video recording vodec                                                                              |
| ``[`&pcm`](and-pcm.md)``                         | PCM audio recordings                                                                                                |
| ``[`&chunked`](and-chunked.md)``                 | Does not use webRTC's video streaming protocols; rather it uses a custom-made protocol                              |
| ``[`&rampuptime`](and-rampuptime.md)``           | When a guest connects, this tries to load video from that guest for a few seconds, even if not yet added to a scene |
| ``[`&forceios`](and-forceios.md)``               | Forces iOS devices to publish video to this room guest                                                              |
| ``[`&sensor`](sensor.md)``                       | Access device sensor data at given rate                                                                             |

## Viewer Side Options

**Viewer's Settings**, which are aspects that are controllable by the viewer's side, which includes bitrate, codec, and layouts. These parameters are mostly added to [`&view`](../view-parameters/view.md) and [`&scene`](../view-parameters/scene.md) links. But some of them can also be added to guests and to the director.

| Parameter                                    | Explanation                                                                                                           |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ``[`&cc`](cc.md)``                           | Enables displaying of closed captioning text                                                                          |
| ``[`&enhance`](enhance.md)``                 | Tells the remote source that you would like them to prioritize the audio stream over other streams                    |
| ``[`&bitratecutoff`](and-bitratecutoff.md)`` | If the total bitrate drops below the specified bitrate, the viewer will auto-hide the audio and video for that stream |
| ``[`&statsinterval`](and-statsinterval.md)`` | Lets you change the default stats update interval from 3-seconds to something else                                    |
| ``[`&keyframerate`](keyframerate.md)``       | This tells the remote publishers to send keyframes at a specified rate                                                |
| ``[`&maxpublishers`](and-maxpublishers.md)`` | Limits the number of remote peer connections that are publishers                                                      |
| ``[`&obsfix`](and-obsfix.md)``               | Disables or adjusts the sensitivity of the VP8/VP9 Codec packet loss 'fix' for OBS                                    |
| ``[`&streamlabs`](streamlabs.md)``           | Tells VDO.Ninja to not block VDO.Ninja from attempting to run when using Streamlabs for macOS                         |
