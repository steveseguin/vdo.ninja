---
description: >-
  Resolution, FPS, effects, self preview, mute video, PTZ, codec, buffer,
  broadcast, scale
---

# Video Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

If you want to change the bitrate:\
[video-bitrate-parameters](../video-bitrate-parameters/ "mention")

## General options

You can add them to both, source ([`&push`](../../source-settings/push.md)) and viewer ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md)) sides.

| Parameter                | Explanation                |
| ------------------------ | -------------------------- |
| [`&blind`](and-blind.md) | Video playback is disabled |

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

| Parameter                                                             | Explanation                                                                                                       |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [`&quality`](and-quality.md)                                          | Presets the quality setting for a guest                                                                           |
| [`&width`](../../source-settings/and-width.md)                        | Sets the maximum width of the video allowed in pixels                                                             |
| [`&height`](../../source-settings/and-height.md)                      | Sets the maximum height of the video allowed in pixels                                                            |
| [`&aspectratio`](and-aspectratio.md)                                  | Changes the aspect ratio on the publisher side                                                                    |
| [`&contenthint`](and-contenthint.md)                                  | <p><code>=motion</code> prioritizes resolution;<br><code>=detail</code> prioritizes frame rate</p>                |
| [`&mediasettings`](../../newly-added-parameters/and-mediasettings.md) | Adds the option to change the video and audio settings dynamically via the settings menu                          |
| [`&noscale`](../../newly-added-parameters/and-noscale.md)             | Disables the publishing resolution from being capped                                                              |
| [`&fps`](and-fps.md)                                                  | Sets the maximum frame rate of the video in frames per second                                                     |
| [`&maxframerate`](../../source-settings/and-maxframerate.md)          | Like [`&fps`](and-fps.md), except it will allow for lower frame rates if the specific frame rate requested failed |
| [`&effects`](../../source-settings/effects.md)                        | Applies effects to the video/audio feeds                                                                          |
| [`&effectvalue`](../../newly-added-parameters/and-effectvalue.md)     | Sets the amount of blur or effect applied                                                                         |
| [`&imagelist`](and-imagelist.md)                                      | Can be used to pass a list of background images via the URL                                                       |
| [`&avatar`](and-avatar.md)                                            | Adds the ability to select an image, instead of a video device                                                    |
| [`&fullscreen`](../../source-settings/fullscreen.md)                  | The preview video will be fullscreen                                                                              |
| [`&showpreview`](../../source-settings/and-preview.md)                | Forces the guest to have a self-preview                                                                           |
| [`&minipreview`](../../source-settings/and-minipreview.md)            | Mini self-preview at the top right corner                                                                         |
| [`&minipreviewoffset`](and-minipreview-1.md)\*                        | Used to position where the mini preview is located by default on screen                                           |
| [`&nopreview`](../../source-settings/and-nopreview.md)                | Disables the local self-preview                                                                                   |
| [`&hideguest`](../../newly-added-parameters/and-hideguest.md)         | Has a guest join a room not visible to others                                                                     |
| [`&videomute`](../../source-settings/and-videomute.md)                | Auto mutes guest's video                                                                                          |
| [`&ptz`](../../source-settings/ptz.md)                                | Enables pan/tilt control of the device, if compatible                                                             |
| [`&webp`](../view-parameters/webp.md)                                 | Custom video codec for broadcasts                                                                                 |
| [`&webpquality`](../view-parameters/webpquality.md)                   | Quality setting for the [`&webp`](../view-parameters/webp.md) option                                              |

\*NEW IN [VERSION 23](../../releases/v23.md)

## **Viewer side options**

You have to add them to the viewer side ([`&room`](../../general-settings/room.md) or [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md)or [`&solo`](../mixer-scene-parameters/and-solo.md)).

| Parameter                                                         | Explanation                                                                                                                                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`&scale`](../view-parameters/scale.md)                           | Scales the video resolution of the inbound video by the given percent                                                                                                                                  |
| [`&dpi`](../view-parameters/dpi.md)                               | Overrides the automatically selected Device Pixel Ratio                                                                                                                                                |
| [`&sharper`](and-sharper.md)                                      | Should 'up to' double the amount of playback video resolution                                                                                                                                          |
| [`&viewwidth`](and-viewwidth.md)                                  | Does the same thing as [`&scale`](../view-parameters/scale.md) but you pass the width in pixels                                                                                                        |
| [`&viewheight`](and-viewheight.md)                                | Does the same thing as [`&scale`](../view-parameters/scale.md) but you pass the height in pixels                                                                                                       |
| [`&codec`](../view-parameters/codec.md)                           | Sets the codec to encode the video                                                                                                                                                                     |
| [`&h264profile`](../../newly-added-parameters/and-h264profile.md) | OpenH264 software encoding will be used                                                                                                                                                                |
| [`&buffer`](../view-parameters/buffer.md)                         | Sets the video buffer                                                                                                                                                                                  |
| [`&buffer2`](and-buffer2.md)\*                                    | Same as [`&buffer`](../view-parameters/buffer.md), but instead includes the round-trip-time                                                                                                            |
| [`&fadein`](../view-parameters/fadein.md)                         | Has videos fade in smoothly                                                                                                                                                                            |
| [`&broadcast`](../view-parameters/broadcast.md)                   | A useful flag to allow the director to present their own video to the group, often used in conjunction with a virtual webcam or Meshcast. It allows for larger groups rooms by reducing load on guests |
| [`&directoronly`](and-directoronly.md)                            | A useful flag to allow the director to present their own video to the group, often used in conjunction with a virtual webcam or Meshcast. It allows for larger groups rooms by reducing load on guests |
| [`&showonly`](novideo.md)                                         | Only shows any stream ID that is listed                                                                                                                                                                |
| [`&novideo`](novideo-1.md)                                        | Disables all video playback on the local computer                                                                                                                                                      |
| [`&slideshow`](and-slideshow.md)                                  | Plays video back as a series of full-window images                                                                                                                                                     |

\*NEW IN [VERSION 23](../../releases/v23.md)

## Related

{% content-ref url="../video-bitrate-parameters/" %}
[video-bitrate-parameters](../video-bitrate-parameters/)
{% endcontent-ref %}
