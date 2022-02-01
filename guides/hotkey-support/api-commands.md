# API commands

The HTTP API uses GET-requests (not POST/PUT), and is structured in a way to be compatible with existing hotkey control software.

`https://api.vdo.ninja/{apiID}/{action}/{target}/{value}`

or

`https://api.vdo.ninja/{apiID}/{action}/{value}`

or

`https://api.vdo.ninja/{apiID}/{action}`

Any field can be replaced with "null", if no value is being passed to it. Double slashes will cause issues though, so avoid those.

## API commands

The API and its commands are currently in a DRAFT form, and as such, may/will undergo change.

| Action            | Target | Value                             | Details                                                                                            |
| ----------------- | ------ | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| speaker           | null   | true                              | Unmute the Local Speaker                                                                           |
| speaker           | null   | false                             | Mute the Local Speaker                                                                             |
| speaker           | null   | toggle                            | Toggle the state of the local Speaker                                                              |
| mic               | null   | true                              | Unmute the local Microphone                                                                        |
| mic               | null   | false                             | Mute the local Microphone                                                                          |
| mic               | null   | toggle                            | Toggle the state of the local Microphone                                                           |
| camera            | null   | true                              | Unmute local Camera                                                                                |
| camera            | null   | false                             | Mute local Camera                                                                                  |
| camera            | null   | toggle                            | Toggle the state of the local Camera                                                               |
| volume            | null   | true                              | Mutes all local audio tracks by setting the volume to 0%                                           |
| volume            | null   | false                             | Sets the playback volume of all audio tracks to 100%                                               |
| volume            | null   | {integer value between 0 and 100} | Sets the playback volume of all local playback audio                                               |
| sendChat          | null   | {some chat message}               | Sends a chat message to everyone connected. Better suited for the websocket API over the HTTP one. |
| record            | null   | true                              | Start recording the local video stream to disk; will probably create a popup currently             |
| record            | null   | false                             | Stops recording the local video stream                                                             |
| reload            | null   | null                              | Reload the current page                                                                            |
| hangup            | null   | null                              | Hang up the current connection. For the director, this just stops the mic and camera mainly.       |
| bitrate           | null   | true                              | Unlock/reset bitrate of all currently incoming video                                               |
| bitrate           | null   | false                             | Pause all currently incoming video streams (bitrate to 0)                                          |
| bitrate           | null   | {some integer}                    | Set video bitrate of all incoming video streams to target bitrate in kilobits per second.          |
| panning           | null   | true                              | Centers the pan                                                                                    |
| panning           | null   | false                             | Centers the pan                                                                                    |
| panning           | null   | {an integer between 0 and 180}    | Sets the stereo panning of all incoming audio streams; left to right, with 90 being center.        |
| togglehand        | null   | null                              | Toggles whether your hand is raised or not                                                         |
| togglescreenshare | null   | null                              | Toggles screen sharing on or off; will still ask you to select the screen though.                  |
| forceKeyframe     | null   | null                              | Forces the publisher of a stream to issue keyframes to all viewers; "rainbow puke fix"             |

**Commands that target remote guests as a director (available on vdo.ninja v19)**

The guest slot (1 to 99) or the guests's stream ID can be used as a target.

Currently toggling is primarily available for options; on/off absolute value options will be coming soon.

| Action        | Target                    | Value                                              | Details                                                                          |
| ------------- | ------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| forward       | {guest slot or stream ID} | {destination room}                                 | Transfer guest to specified room                                                 |
| addScene      | {guest slot or stream ID} | {scene ID; 0 to 8, or an active custom scene name} | Toggle guest in/out of specified scene                                           |
| muteScene     | {guest slot or stream ID} | {scene ID; 0 to 8, or an active custom scene name} | Toggle guest's mic audio in scenes                                               |
| group         | {guest slot or stream ID} | {group ID; 1 to 8}                                 | Toggle guest in/out of specified group; default group 1                          |
| mic           | {guest slot or stream ID} | null                                               | Toggle the mic of a specific guest                                               |
| hangup        | {guest slot or stream ID} | null                                               | Hangup a specific guest                                                          |
| soloChat      | {guest slot or stream ID} | null                                               | Toggle solo chat with a specific guest                                           |
| speaker       | {guest slot or stream ID} | null                                               | Toggle speaker with a specific guest                                             |
| display       | {guest slot or stream ID} | null                                               | Toggle whether a specific guest can see any video or not                         |
| forceKeyframe | {guest slot or stream ID} | null                                               | Trigger a keyframe for active scenes, wrt to a guest; helps resolve rainbow puke |
| soloVideo     | {guest slot or stream ID} | null                                               | Toggle whether a video is highlighted everywhere                                 |
| volume        | {guest slot or stream ID} | {0 to 100}                                         | Set the microphone volume of a specific remote guest                             |

All the information is from Github:\
[https://github.com/steveseguin/Companion-Ninja](https://github.com/steveseguin/Companion-Ninja)

## Related

{% content-ref url="../../api-and-midi-settings/api.md" %}
[api.md](../../api-and-midi-settings/api.md)
{% endcontent-ref %}

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}

{% content-ref url="how-to-control-vdo.ninja-with-touch-portal.md" %}
[how-to-control-vdo.ninja-with-touch-portal.md](how-to-control-vdo.ninja-with-touch-portal.md)
{% endcontent-ref %}
