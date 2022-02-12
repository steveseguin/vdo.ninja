# Newly Added Parameters

**Newly Added Parameters**, which have been recently added to the Docs or to VDO.Ninja.

| Parameter                                                                               | Explanation                                                                                                           |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ``[`&webcam2`](../../newly-added-parameters/and-webcam2.md)``                           | Will show the "Share your Camera" button before asking the user to select camera options                              |
| ``[`&screenshare2`](../../newly-added-parameters/and-screenshare2.md)``                 | Will show the "Share your Screen" button before asking the user to select screenshare options                         |
| ``[`&safemode`](../../newly-added-parameters/and-safemode.md)``                         | Tries to load the camera/audio with as little possible complexity as possible                                         |
| ``[`&hiddenscenebitrate`](../../newly-added-parameters/and-hiddenscenebitrate.md)``     | Can be used to force videos not added yet to a scene to run at the specified bitrate                                  |
| ``[`&preloadbitrate`](../../newly-added-parameters/and-preloadbitrate.md)``             | Can be used to change the pre-load target bitrate for scenes                                                          |
| ``[`&zoomedbitrate`](../../newly-added-parameters/and-zoomedbitrate.md)``               | Lets you set the target bitrate for a guest when they 'zoom in' (fullscreen) on a video                               |
| ``[`&signalmeter`](../../newly-added-parameters/and-signalmeter.md)``                   | Visualizes the packet loss of a guest                                                                                 |
| ``[`&welcome`](../../newly-added-parameters/and-welcome.md)``                           | Adds a message the guest will see when joining the room                                                               |
| ``[`&recordcodec`](../../newly-added-parameters/and-recordcodec.md)``                   | Lets you set the video recording vodec                                                                                |
| ``[`&43`](../../newly-added-parameters/and-43.md)``                                     | Optimize the video mixer for 4:3 aspect ratio videos                                                                  |
| ``[`&autoadd`](../../newly-added-parameters/and-autoadd.md)``                           | Auto-adds the specified stream IDs to the scene                                                                       |
| ``[`&slots`](../../newly-added-parameters/and-slots.md)``                               | Will force the auto-mixer to have that number of slots, even if there are more or less videos available to fill them  |
| ``[`&chunked`](../../newly-added-parameters/and-chunked.md)``                           | Does not use webRTC's video streaming protocols; rather it uses a custom-made protocol                                |
| ``[`&h264profile`](../../newly-added-parameters/and-h264profile.md)``                   | OpenH264 software encoding will be used                                                                               |
| ``[`&forcelandscape`](../../newly-added-parameters/and-forcelandscape.md)``             | Forces the video output to landscape mode, regardless of how the phone is rotated                                     |
| ``[`&forceportrait`](../../newly-added-parameters/and-forceportrait.md)``               | Forces the video output to portrait mode, regardless of how the phone is rotated                                      |
| ``[`&facing`](../../newly-added-parameters/and-facing.md)``                             | Lets you specify either the front or rear facing camera as the default camera                                         |
| ``[`&maxtotalscenebitrate`](../../newly-added-parameters/and-maxtotalscenebitrate.md)`` | Max. video bitrate a scene uses                                                                                       |
| ``[`&effectvalue`](../../newly-added-parameters/and-effectvalue.md)``                   | Sets the amount of blur or effect applied                                                                             |
| ``[`&noscale`](../../newly-added-parameters/and-noscale.md)``                           | Disables the publishing resolution from being capped                                                                  |
| ``[`&datamode`](../../newly-added-parameters/and-datamode.md)``                         | Combines a bunch of flags together; no video, no audio, GUI, etc.                                                     |
| ``[`&vdo`](../../newly-added-parameters/and-vdo.md)``                                   | Like \&videodevice for selecting a default video device, but you can still choose to change the camera                |
| ``[`&rampuptime`](../../newly-added-parameters/and-rampuptime.md)``                     | When a guest connects, this tries to load video from that guest for a few seconds, even if not yet added to a scene   |
| ``[`&hideguest`](../../newly-added-parameters/and-hideguest.md)``                       | Has a guest join a group not visible to others                                                                        |
| ``[`&host`](../../newly-added-parameters/and-host.md)``                                 | Shows a pop up to invite more guests to the room                                                                      |
| ``[`&waitimage`](and-waitimage.md)``                                                    | You can add a custom image which shows up while waiting for the `&view` link                                          |
| ``[`&waitmessage`](and-waitmessage.md)``                                                | You can add a custom message which shows up while waiting for the `&view` link                                        |
| ``[`&waittimeout`](and-waittimeout.md)``                                                | Specifies a delay for `&waitimage` and `&waitmessage` while waiting for the `&view` link                              |
| ``[`&autohide`](../../parameters-only-on-beta/and-autohide.md)``                        | Auto-hides the control bar after a few moments of the mouse being idle                                                |
| ``[`&bitratecutoff`](../parameters-only-on-beta/and-bitratecutoff.md)``                 | If the total bitrate drops below the specified bitrate, the viewer will auto-hide the audio and video for that stream |
| ``[`&statsinterval`](../parameters-only-on-beta/and-statsinterval.md)``                 | Lets you change the default stats update interval from 3-seconds to something else                                    |
| ``[`&videocontrols`](and-videocontrols.md)``                                            | Shows the video control bar                                                                                           |
