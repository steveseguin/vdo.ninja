---
description: >-
  Resolution, FPS, effects, bitrate, self preview, mute video, PTZ, codec,
  buffer, broadcast, scale
---

# Video Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General options

You can add them to both, source ([`&push`](../../source-settings/push.md)) and viewer ([`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)) sides.

| Parameter                                       | Explanation                |
| ----------------------------------------------- | -------------------------- |
| ``[`&blind`](../../general-settings/blind.md)`` | Video playback is disabled |

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

| Parameter                                                                        | Explanation                                                                                                                                         |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ``[`&quality`](../../source-settings/quality.md)``                               | Presets the quality setting for a guest                                                                                                             |
| ``[`&width`](../../source-settings/and-width.md)``                               | Sets the maximum width of the video allowed in pixels                                                                                               |
| ``[`&height`](../../source-settings/and-height.md)``                             | Sets the maximum height of the video allowed in pixels                                                                                              |
| ``[`&mediasettings`](../../newly-added-parameters/and-mediasettings.md)``        | Adds the option to change the video quality (resolution) dynamically via the settings menu                                                          |
| ``[`&noscale`](../../newly-added-parameters/and-noscale.md)``                    | Disables the publishing resolution from being capped                                                                                                |
| ``[`&framerate`](../../source-settings/and-framerate.md)``                       | Sets the maximum frame rate of the video in frames per second                                                                                       |
| ``[`&maxframerate`](../../source-settings/and-maxframerate.md)``                 | Like [`&framerate`](../../source-settings/and-framerate.md), except it will allow for lower frame rates if the specific frame rate requested failed |
| ``[`&effects`](../../source-settings/effects.md)``                               | Applies effects to the video/audio feeds                                                                                                            |
| ``[`&effectvalue`](../../newly-added-parameters/and-effectvalue.md)``            | Sets the amount of blur or effect applied                                                                                                           |
| ``[`&outboundvideobitrate`](../../source-settings/and-outboundvideobitrate.md)`` | Target video bitrate and max bitrate for outgoing video streams                                                                                     |
| ``[`&maxvideobitrate`](../../source-settings/maxbitrate.md)``                    | Limits the max video bitrate out for this publisher, per stream out                                                                                 |
| ``[`&limittotalbitrate`](../../source-settings/limittotalbitrate.md)``           | Limits the total outbound bitrate                                                                                                                   |
| ``[`&controlroombitrate`](../view-parameters/and-controlroombitrate.md)``        | Allows a guest to control their total room video bitrate dynamically from the settings panel (under video settings)                                 |
| ``[`&roombitrate`](../../source-settings/roombitrate.md)``                       | Limits any guest viewer in the group chat room from pulling the video stream at more than the specified bitrate value                               |
| ``[`&fullscreen`](../../source-settings/fullscreen.md)``                         | The preview video will be fullscreen                                                                                                                |
| ``[`&showpreview`](../../source-settings/and-preview.md)``                       | Forces the guest to have a self-preview                                                                                                             |
| ``[`&minipreview`](../../source-settings/and-minipreview.md)``                   | Mini self-preview at the top right corner                                                                                                           |
| ``[`&nopreview`](../../source-settings/and-nopreview.md)``                       | Disables the local self-preview                                                                                                                     |
| ``[`&hideguest`](../../newly-added-parameters/and-hideguest.md)``                | Has a guest join a room not visible to others                                                                                                       |
| ``[`&videomute`](../../source-settings/and-videomute.md)``                       | Auto mutes guest's video                                                                                                                            |
| ``[`&ptz`](../../source-settings/ptz.md)``                                       | Enables pan/tilt control of the device, if compatible                                                                                               |
| ``[`&webp`](../view-parameters/webp.md)``                                        | Custom video codec for broadcasts                                                                                                                   |
| ``[`&webpquality`](../view-parameters/webpquality.md)``                          | Quality setting for the [`&webp`](../view-parameters/webp.md) option                                                                                |

## **Viewer side options**

You have to add them to the viewer side ([`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)).

| Parameter                                                                            | Explanation                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ``[`&videobitrate`](../view-parameters/bitrate.md)``                                 | Sets the "desired target" bitrate in kbps                                                                                                                                                              |
| ``[`&totalscenebitrate`](../../newly-added-parameters/and-maxtotalscenebitrate.md)`` | Max. video bitrate a scene uses                                                                                                                                                                        |
| ``[`&totalroombitrate`](../view-parameters/totalroombitrate.md)``                    | The total bitrate a guest in a room can view video streams with                                                                                                                                        |
| ``[`&zoomedbitrate`](../../newly-added-parameters/and-zoomedbitrate.md)``            | Lets you set the target bitrate for a guest when they 'zoom in' (fullscreen) on a video                                                                                                                |
| ``[`&optimize`](../view-parameters/optimize.md)``                                    | Video bitrate reduced when the video is not visible in OBS (not active in a scene)                                                                                                                     |
| ``[`&scale`](../view-parameters/scale.md)``                                          | Scales the video resolution of the inbound video by the given percent                                                                                                                                  |
| ``[`&dpi`](../view-parameters/dpi.md)``                                              | Overrides the automatically selected Device Pixel Ratio                                                                                                                                                |
| ``[`&codec`](../view-parameters/codec.md)``                                          | Sets the codec to encode the video                                                                                                                                                                     |
| ``[`&h264profile`](../../newly-added-parameters/and-h264profile.md)``                | OpenH264 software encoding will be used                                                                                                                                                                |
| ``[`&buffer`](../view-parameters/buffer.md)``                                        | Sets the video buffer                                                                                                                                                                                  |
| ``[`&fadein`](../view-parameters/fadein.md)``                                        | Has videos fade in smoothly                                                                                                                                                                            |
| ``[`&broadcast`](../view-parameters/broadcast.md)``                                  | A useful flag to allow the director to present their own video to the group, often used in conjunction with a virtual webcam or Meshcast. It allows for larger groups rooms by reducing load on guests |
| ``[`&novideo`](../view-parameters/novideo.md)``                                      | Disables all video playback on the local computer, except for any stream ID that is listed                                                                                                             |
