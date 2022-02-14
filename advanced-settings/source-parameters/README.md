# Source Parameters

**Source Settings**, which are settings specific to publishing, so these are things related to customizing the camera and microphone. The parameters can be added to a publishing link, like for example a guest, a director or just a basic push link.

| Parameter                                                                        | Explanation                                                                                                           |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ``[`&push`](../../source-settings/push.md)``                                     | The stream ID that you are publishing with will be the defined value                                                  |
| ``[`&bigbutton`](../../newly-added-parameters/and-bigbutton.md)``                | Makes the microphone mute button a lot bigger                                                                         |
| ``[`&chatbutton`](../../general-settings/chatbutton.md)``                        | Shows or hides the chat button                                                                                        |
| ``[`&consent`](../../source-settings/consent.md)``                               | Will ask the user for content to remote change their camera or microphone                                             |
| ``[`&directorchat`](../../source-settings/directorchat.md)``                     | Message ONLY the director                                                                                             |
| ``[`&effects`](../../source-settings/effects.md)``                               | Applies effects to the video/audio feeds                                                                              |
| ``[`&forceios`](../../source-settings/and-forceios.md)``                         | Forces iOS devices to publish video to this room guest                                                                |
| ``[`&framerate`](../../source-settings/and-framerate.md)``                       | Sets the maximum frame rate of the video in frames per second                                                         |
| ``[`&fullscreen`](../../source-settings/fullscreen.md)``                         | The preview video will be fullscreen                                                                                  |
| ``[`&hands`](../../source-settings/and-hands.md)``                               | Enables a "Raise Hand" button for guests                                                                              |
| ``[`&height`](../../source-settings/and-height.md)``                             | Sets the maximum height of the video allowed in pixels                                                                |
| ``[`&limittotalbitrate`](../../source-settings/limittotalbitrate.md)``           | Limit the total outbound bitrate                                                                                      |
| ``[`&maxbitrate`](../../source-settings/maxbitrate.md)``                         | Limits the max video bitrate out for this publisher, per stream out                                                   |
| ``[`&maxconnections`](../../source-settings/and-maxconnections.md)``             | Limits total of view and push connections                                                                             |
| ``[`&maxframerate`](../../source-settings/and-maxframerate.md)``                 | Like `&framerate`, except it will allow for lower frame rates if the specific frame rate requested failed             |
| ``[`&maxviewers`](../../source-settings/and-maxviewers.md)``                     | Limits the number of viewers allowed                                                                                  |
| ``[`&mediasettings`](../../newly-added-parameters/and-mediasettings.md)``        | Adds the option to change the video quality (resolution) dynamically via the settings menu                            |
| ``[`&minipreview`](../../source-settings/and-minipreview.md)``                   | Mini self preview at the top right corner                                                                             |
| ``[`&nofileshare`](../../source-settings/nofileshare.md)``                       | Hides the ability for a guest to upload a file                                                                        |
| ``[`&nomicbutton`](../../viewers-settings/nomicbutton.md)``                      | Disables the mic button; guests can't mute audio                                                                      |
| ``[`&nopreview`](../../source-settings/and-nopreview.md)``                       | Disables the local self video preview                                                                                 |
| ``[`&nosettings`](../../source-settings/and-nosettings.md)``                     | Disables the local settings button                                                                                    |
| ``[`&nospeakerbutton`](../../source-settings/and-nospeakerbutton.md)``           | Hides the speaker button                                                                                              |
| ``[`&notify`](../../source-settings/and-notify.md)``                             | Audio alerts for raised hands, chat messages and if somebody joins the room                                           |
| ``[`&novideobutton`](../../viewers-settings/and-novideobutton.md)``              | Disables the video button; guests can't mute video                                                                    |
| ``[`&nowebsite`](../../source-settings/nowebsite.md)``                           | Disables IFRAMEs from loading, such as remotely shared websites by another guest or director                          |
| ``[`&order`](../../source-settings/order.md)``                                   | The order priority of a source video when added to the video mixer                                                    |
| ``[`&outboundvideobitrate`](../../source-settings/and-outboundvideobitrate.md)`` | Target video bitrate and max bitrate for outgoing video streams                                                       |
| ``[`&pcm`](../../source-settings/and-pcm.md)``                                   | PCM audio recordings                                                                                                  |
| ``[`&ptz`](../../source-settings/ptz.md)``                                       | Enables pan/tilt control of the device, if compatible                                                                 |
| ``[`&preview`](../../source-settings/and-preview.md)``                           | Forces the guest to have a self-preview, overriding `&broadcast`                                                      |
| ``[`&pusheffectsdata`](../../source-settings/pusheffectsdata.md)``               | Makes the data for the active digital effect available to the IFRAME API or a remote guest                            |
| ``[`&quality`](../../source-settings/quality.md)``                               | Presets the quality setting for a guest                                                                               |
| ``[`&r2d2`](../../source-settings/r2d2.md)``                                     | Easter egg `&notify` sound                                                                                            |
| ``[`&record`](../../source-settings/and-record.md)``                             | Record functionality for guests                                                                                       |
| ``[`&roombitrate`](../../source-settings/roombitrate.md)``                       | Limits any guest viewer in the group chat room from pulling the video stream at more than the specified bitrate value |
| ``[`&screenshare`](../setup-parameters/screenshare.md)``                         | Disables camera-sharing as an option                                                                                  |
| ``[`&sensor`](../../source-settings/sensor.md)``                                 | Access device sensor data at given rate                                                                               |
| ``[`&showlist`](../../source-settings/showlist.md)``                             | Toggles list of hidden guests                                                                                         |
| ``[`&ssb`](../../source-settings/ssb.md)``                                       | Forces the screen-share button to appear for guests                                                                   |
| ``[`&transcribe`](../../source-settings/transcribe.md)``                         | Enables transcription and closed captioning                                                                           |
| ``[`&videomute`](../../source-settings/and-videomute.md)``                       | Auto mutes guest's video                                                                                              |
| ``[`&width`](../../source-settings/and-width.md)``                               | Sets the maximum width of the video allowed in pixels                                                                 |
