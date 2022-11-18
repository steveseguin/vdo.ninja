---
description: >-
  Upcoming parameters which are currently on vdo.ninja/alpha and/or
  vdo.ninja/beta
---

# Upcoming Parameters

You can use/test these parameters on [vdo.ninja/alpha](https://vdo.ninja/alpha/) and/or [vdo.ninja/beta](https://vdo.ninja/beta/)

| Parameter                                                        | Explanation                                                                                                                  |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ``[`&nocontrols`](and-nocontrols.md)\*\*                         | Will force hide the video control bar                                                                                        |
| ``[`&maxbandwidth`](and-maxbandwidth.md)\*\*                     | Judges the available bandwidth of a sender's connection                                                                      |
| ``[`&showall`](and-showall.md)\*\*                               | Includes non-media-based push connections as video elements in a group room                                                  |
| ``[`&nopush`](and-nopush.md)\*\*                                 | Blocks outbound publishing connections                                                                                       |
| ``[`&imagelist`](and-imagelist.md)\*\*                           | Can be used to pass a list of background images via the URL                                                                  |
| ``[`&viewheight`](and-viewheight.md)\*\*                         | Does the same thing as [`&scale`](../view-parameters/scale.md) but you pass the height in pixels                             |
| ``[`&viewwidth`](and-viewwidth.md)\*\*                           | Does the same thing as [`&scale`](../view-parameters/scale.md) but you pass the width in pixels                              |
| ``[`&sensorfilter`](and-sensorfilter.md)\*\*                     | An option to explicitly list what [`&sensor` ](../../source-settings/sensor.md)data you want to capture and transmit         |
| ``[`&aspectratio`](and-aspectratio.md)\*\*                       | Changes the aspect ratio on the publisher side                                                                               |
| ``[`&include`](and-include.md)\*\*                               | Includes streams that do not exist in the room                                                                               |
| ``[`&base64js`](and-base64js.md)\*\*                             | Lets a user add raw javascript to the URL to run on page load                                                                |
| ``[`&background`](and-background.md)\*\*                         | Accepts a URL-encoded image URL to make as the app's default background                                                      |
| ``[`&postimage`](and-postimage.md)\*\*                           | Post a snapshot of your local camera to a HTTPS/POST URL                                                                     |
| ``[`&postinterval`](and-postinterval.md)\*\*                     | Time interval in seconds for [`&postimage`](and-postimage.md)``                                                              |
| ``[`&smallshare`](and-smallshare.md)\*\*                         | Makes the screen share behave like a webcam share                                                                            |
| ``[`&slideshow`](and-slideshow.md)\*\*                           | Plays video back as a series of full-window images                                                                           |
| ``[`&controlobs`](and-obs.md)\*\*                                | The ability for VDO.Ninja to Remotely Control OBS Studio while streaming/directing                                           |
| ``[`&volume`](and-volume.md)\*\*                                 | Sets the 'default' playback volume for all video elements                                                                    |
| ``[`&hidecodirectors`](and-hidecodirectors.md)\*\*               | Hides the co-directors from appearing in the director's room                                                                 |
| ``[`&monomic`](and-monomic.md)\*\*                               | Sets a guest's audio input to mono (1-channel)                                                                               |
| ``[`&screenshareaspectratio`](and-screenshareaspectratio.md)\*\* | Sets the aspect ratio for screen-shares on the publisher side                                                                |
| ``[`&solo`](and-solo.md)\*\*                                     | Similar to [`&scene`](../view-parameters/scene.md), but tells the system to be a solo-link                                   |
| ``[`&sharper`](and-sharper.md)\*\*                               | Should 'up to' double the amount of playback video resolution                                                                |
| ``[`&sharperscreen`](and-sharperscreen.md)\*\*                   | Sets [`&scale=100`](../view-parameters/scale.md), but only for screen-shares                                                 |
| ``[`&contenthint`](and-contenthint.md)\*\*                       | `=motion` prioritizes resolution; `=detail` prioritizes frame rate                                                           |
| ``[`&screensharecontenthint`](and-screensharecontenthint.md)\*\* | `=motion` prioritizes screen-share resolution; `=detail` prioritizes screen-share frame rate                                 |
| ``[`&audiocontenthint`](and-audiocontenthint.md)\*\*             | `=music` fixed bitrate; `=speech` bitrate is variable                                                                        |
| ``[`&slotmode`](and-slotmode.md)\*\*                             | Gives you the possibility to assign slots to the connected guests                                                            |
| ``[`&hidetranslate`](and-hidetranslate.md)\*\*                   | Hides the option to translate VDO.Ninja                                                                                      |
| ``[`&noisegatesettings`](and-noisegatesettings.md)\*\*           | Lets you tweak the [`&noisegate`](../../source-settings/noisegate.md) variables, making it more or less aggressive as needed |
| ``[`&previewmode`](and-previewmode.md)\*\*                       | Activates the Preview layout for the director's room by default                                                              |
| ``[`&showconnections`](and-showconnections.md)\*\*               | Displays the total number of p2p connections of a remote stream                                                              |
| ``[`&getfaces`](and-getfaces.md)\*\*                             | Will request a continuous stream of face bounding boxes                                                                      |
| ``[`&novice`](and-novice.md)\*\*                                 | Hides some advanced guest options in the director's control center                                                           |
| ``[`&welcomeimage`](and-welcomeimage.md)\*                       | Lets you specify an image that appears for a few seconds once a guest joins                                                  |
| ``[`&layout`](and-layout.md)\*\*                                 | Shows the guest a return feed of the current mixer layout when using the Mixer App                                           |
| ``[`&layouts`](and-layouts.md)\*\*                               | An ordered array of layouts, which can be used to switch between using the API                                               |
| ``[`&groupmode`](and-groupmode.md)\*\*                           | Added to the URL, when not assigned to a group, you don't hear or see anything                                               |
| ``[`&labelsuggestion`](and-labelsuggestion.md)\*\*               | The same as [`&label`](../../general-settings/label.md), except it asks the user still for a user name                       |
| ``[`&controlbarspace`](and-controlbarspace.md)\*\*               | Forces the bottom control bar to be in its own dedicated space                                                               |
| ``[`&volumecontrol`](and-volumecontrol.md)\*\*                   | Shows a dedicated local audio-volume control bar for canvas or image elements                                                |
| ``[`&directoronly`](and-directoronly.md)\*\*                     | Will show the audio and the video of the director but not of the guests                                                      |
| ``[`&clock`](and-clock.md)\*\*                                   | Shows the current time in the lower right                                                                                    |
| ``[`&hidehome`](and-hidehome.md)\*\*                             | Hides the VDO.Ninja homepage and many links that lead to it                                                                  |

\*only on [vdo.ninja/alpha](https://vdo.ninja/alpha/)\
\*\*on [vdo.ninja/beta](https://vdo.ninja/beta/) and [vdo.ninja/alpha](https://vdo.ninja/alpha/)
