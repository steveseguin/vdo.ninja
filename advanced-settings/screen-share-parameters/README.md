# Screen-share Parameters

**Screen-share Settings**, which are specific to screen-sharing features. They are separated in source side (push) options and viewer side (view) options.

## Source side options

| Parameter                                                               | Explanation                                                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ``[`&screenshare`](../../source-settings/screenshare.md)``              | Disables camera-sharing as an option                                                                        |
| ``[`&screenshare2`](../../newly-added-parameters/and-screenshare2.md)`` | Will show the "Share your Screen" button before asking the user to select screenshare options               |
| ``[`&screenshareaec`](and-screenshareaec.md)``                          | Turns automatic echo-cancellation filter for screen-shares ON or OFF                                        |
| ``[`&screenshareautogain`](and-screenshareautogain.md)``                | Turns audio auto-normalization filter for screen-shares ON or OFF                                           |
| ``[`&screensharecursor`](cursor.md)``                                   | Attempts to show the mouse cursor on screen shares                                                          |
| ``[`&screensharedenoise`](and-screensharedenoise.md)``                  | Turns audio noise reduction filter for screen-shares ON or OFF                                              |
| ``[`&screensharefps`](screensharefps.md)``                              | Set a target FPS for your screenshare (secondary stream)                                                    |
| ``[`&screensharehide`](and-screensharehide.md)``                        | Hides the local screen-share sub-window that appears when screen sharing in a room                          |
| ``[`&screenshareid`](screenshareid.md)``                                | Pre-sets the screenshare stream id for a screen share if its a secondary stream                             |
| ``[`&screensharelabel`](and-screensharelabel.md)``                      | The screen-share of the guest will have the same label as the guest                                         |
| ``[`&screensharequality`](screensharequality.md)``                      | Set a custom screenshare quality (secondary stream)                                                         |
| ``[`&screensharestereo`](and-screensharestereo.md)``                    | Sets the audio mode for screen-shares to stereo and changes default audio settings to improve audio quality |
| ``[`&screensharetype`](and-screensharetype.md)``                        | Defines how webcam and screenshare of a guest in a room interacts which each other                          |
| ``[`&screensharevideoonly`](and-screensharevideoonly.md)``              | Lets you disable the option to select audio when screen sharing                                             |
| ``[`&ssb`](../../source-settings/ssb.md)``                              | Forces the screen-share button to appear for guests                                                         |

## **Viewer side options**

| Parameter                                              | Explanation                                               |
| ------------------------------------------------------ | --------------------------------------------------------- |
| ``[`&screensharebitrate`](and-screensharebitrate.md)`` | Lets you manually set the video bitrate for screen-shares |
| ``[`&sspaused`](and-sspaused.md)``                     | Starts any screen-share paused                            |
