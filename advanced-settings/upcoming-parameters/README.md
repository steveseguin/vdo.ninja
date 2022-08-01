---
description: >-
  Upcoming parameters which are currently on vdo.ninja/alpha, vdo.ninja/beta or
  local dev
---

# Upcoming Parameters

You can use/test these parameters on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

|                                                      |                                                                                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ``[`&border`](and-border.md)\*\*                     | Adds a border around the videos                                                                                                                                       |
| ``[`&bordercolor`](and-bordercolor.md)\*\*           | Defines the color of [`&border`](and-border.md)``                                                                                                                     |
| ``[`&autorecord`](and-autorecord.md)\*\*             | Records the local video and the remote video(s) automatically on their initial load                                                                                   |
| ``[`&autorecordlocal`](and-autorecordlocal.md)\*\*   | Records just the local video automatically on their initial load                                                                                                      |
| ``[`&autorecordremote`](and-autorecordremote.md)\*\* | Records just the remote video(s) automatically on their initial load                                                                                                  |
| ``[`&avatar`](and-avatar.md)\*\*                     | Adds the ability to select an image, instead of a video device                                                                                                        |
| ``[`&prompt`](and-prompt.md)\*\*                     | Another security option, for those concerned about random spying of their streams                                                                                     |
| ``[`&totalbitrate`](and-totalbitrate.md)\*\*         | Sets both [`&maxtotalscenebitrate`](../../newly-added-parameters/and-maxtotalscenebitrate.md) and [`&totalroombitrate` ](../view-parameters/totalroombitrate.md)flags |
| ``[`&bgimage`](and-bgimage.md)\*\*                   | Can be used to set the default image avatar, when using [`&style=0` ](../design-parameters/style.md)or [`&style=6`](../design-parameters/style.md)``                  |
| ``[`&nocontrols`](and-nocontrols.md)\*\*             | Will force hide the video control bar                                                                                                                                 |
| ``[`&maxbandwidth`](and-maxbandwidth.md)\*           | Judges the available bandwidth of a sender's connection                                                                                                               |
| ``[`&showall`](and-showall.md)\*                     | Includes non-media-based push connections as video elements in a group room                                                                                           |
| ``[`&nopush`](and-nopush.md)\*                       | Blocks outbound publishing connections                                                                                                                                |
| ``[`&imagelist`](and-imagelist.md)\*                 | Can be used to pass a list of background images via the URL                                                                                                           |
| ``[`&viewheight`](and-viewheight.md)\*               | Does the same thing as [`&scale`](../view-parameters/scale.md) but you pass the height in pixels                                                                      |
| ``[`&viewwidth`](and-viewwidth.md)\*                 | Does the same thing as [`&scale`](../view-parameters/scale.md) but you pass the width in pixels                                                                       |
| ``[`&meshcastscale`](and-meshcastscale.md)\*         | Scales down the meshcast video output via the URL                                                                                                                     |
| ``[`&sensorfilter`](and-sensorfilter.md)\*           | An option to explicitly list what [`&sensor` ](../../source-settings/sensor.md)data you want to capture and transmit                                                  |
| ``[`&aspectratio`](and-aspectratio.md)\*             | Changes the aspect ratio on the publisher side                                                                                                                        |
| ``[`&include`](and-include.md)\*                     | Includes streams that do not exist in the room                                                                                                                        |
| ``[`&flagship`](and-flagship.md)\*                   | Will optimize the mobile experience for more capable smartphones                                                                                                      |
| ``[`&base64js`](and-base64js.md)\*                   | Lets a user add raw javascript to the URL to run on page load                                                                                                         |
| ``[`&background`](and-background.md)\*               | Accepts a URL-encoded image URL to make as the app's default background                                                                                               |
| ``[`&postimage`](and-postimage.md)\*                 | Post a snapshot of your local camera to a HTTPS/POST URL                                                                                                              |
| ``[`&postinterval`](and-postinterval.md)\*           | Time interval in seconds for [`&postimage`](and-postimage.md)``                                                                                                       |
| ``[`&smallshare`](and-smallshare.md)\*               | Makes the screen share behave like a webcam share                                                                                                                     |
| ``[`&slideshow`](and-slideshow.md)\*                 | Plays video back as a series of full-window images                                                                                                                    |
| ``[`&controlobs`](and-obs.md)\*                      | The ability for VDO.Ninja to Remotely Control OBS Studio while streaming/directing                                                                                    |

\*only on [vdo.ninja/alpha](https://vdo.ninja/alpha/)\
\*\*on [vdo.ninja/beta](https://vdo.ninja/beta/) and [vdo.ninja/alpha](https://vdo.ninja/alpha/)\
\*\*\*on local dev
