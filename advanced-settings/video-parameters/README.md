---
description: >-
  Resolution, FPS, effects, bitrate, self preview, mute video, PTZ, codec,
  buffer, scale
---

# Video Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General options

You can add them to both, source ([`&push`](../../source-settings/push.md)) and viewer ([`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)) sides.

| Parameter                | Explanation                |
| ------------------------ | -------------------------- |
| ``[`&blind`](blind.md)`` | Video playback is disabled |

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

| Parameter                                                  | Explanation                                                                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ``[`&quality`](quality.md)``                               | Presets the quality setting for a guest                                                                                       |
| ``[`&width`](and-width.md)``                               | Sets the maximum width of the video allowed in pixels                                                                         |
| ``[`&height`](and-height.md)``                             | Sets the maximum height of the video allowed in pixels                                                                        |
| ``[`&mediasettings`](and-mediasettings.md)``               | Adds the option to change the video quality (resolution) dynamically via the settings menu                                    |
| ``[`&noscale`](and-noscale.md)``                           | Disables the publishing resolution from being capped                                                                          |
| ``[`&framerate`](and-framerate.md)``                       | Sets the maximum frame rate of the video in frames per second                                                                 |
| ``[`&maxframerate`](and-maxframerate.md)``                 | Like [`&framerate`](and-framerate.md), except it will allow for lower frame rates if the specific frame rate requested failed |
| ``[`&effects`](effects.md)``                               | Applies effects to the video/audio feeds                                                                                      |
| ``[`&effectvalue`](and-effectvalue.md)``                   | Sets the amount of blur or effect applied                                                                                     |
| ``[`&outboundvideobitrate`](and-outboundvideobitrate.md)`` | Target video bitrate and max bitrate for outgoing video streams                                                               |
| ``[`&controlroombitrate`](and-controlroombitrate.md)``     | Allows a guest to control their total room video bitrate dynamically from the settings panel (under video settings)           |
| ``[`&limittotalbitrate`](limittotalbitrate.md)``           | Limits the total outbound bitrate                                                                                             |
| ``[`&maxbitrate`](maxbitrate.md)``                         | Limits the max video bitrate out for this publisher, per stream out                                                           |
| ``[`&roombitrate`](roombitrate.md)``                       | Limits any guest viewer in the group chat room from pulling the video stream at more than the specified bitrate value         |
| ``[`&fullscreen`](fullscreen.md)``                         | The preview video will be fullscreen                                                                                          |
| ``[`&preview`](and-preview.md)``                           | Forces the guest to have a self-preview, overriding [`&broadcast`](../view-parameters/broadcast.md)``                         |
| ``[`&minipreview`](and-minipreview.md)``                   | Mini self preview at the top right corner                                                                                     |
| ``[`&nopreview`](and-nopreview.md)``                       | Disables the local self video preview                                                                                         |
| ``[`&hideguest`](and-hideguest.md)``                       | Has a guest join a group not visible to others                                                                                |
| ``[`&videomute`](and-videomute.md)``                       | Auto mutes guest's video                                                                                                      |
| ``[`&ptz`](ptz.md)``                                       | Enables pan/tilt control of the device, if compatible                                                                         |
| ``[`&forcelandscape`](and-forcelandscape.md)``             | Forces the video output to landscape mode, regardless of how the phone is rotated                                             |
| ``[`&forceportrait`](and-forceportrait.md)``               | Forces the video output to portrait mode, regardless of how the phone is rotated                                              |

## **Viewer side options**

You have to add them to the viewer side ([`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)).

| Parameter                                                  | Explanation                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| ``[`&videobitrate`](bitrate.md)``                          | Sets the "desired target" bitrate in kbps                                                  |
| ``[`&totalroombitrate`](totalroombitrate.md)``             | The total bitrate a guest in a room can view video streams with                            |
| ``[`&maxtotalscenebitrate`](and-maxtotalscenebitrate.md)`` | Max. video bitrate a scene uses                                                            |
| ``[`&zoomedbitrate`](and-zoomedbitrate.md)``               | Lets you set the target bitrate for a guest when they 'zoom in' (fullscreen) on a video    |
| ``[`&optimize`](optimize.md)``                             | Video bitrate reduced when the video is not visible in OBS (not active in a scene)         |
| ``[`&scale`](scale.md)``                                   | Scales the video resolution of the inbound video by the given percent                      |
| ``[`&codec`](codec.md)``                                   | Sets the codec to encode the video                                                         |
| ``[`&h264profile`](and-h264profile.md)``                   | OpenH264 software encoding will be used                                                    |
| ``[`&buffer`](buffer.md)``                                 | Sets the video buffer                                                                      |
| ``[`&fadein`](fadein.md)``                                 | Has videos fade in smoothly                                                                |
| ``[`&novideo`](novideo.md)``                               | Disables all video playback on the local computer, except for any stream ID that is listed |
| ``[`&webp`](webp.md)``                                     | Custom video codec for broadcasts                                                          |
| ``[`&webpquality`](webpquality.md)``                       | Quality setting for the [`&webp`](webp.md) option                                          |
| ``[`&dpi`](dpi.md)``                                       | Override the automatically selected Device Pixel Ratio                                     |
