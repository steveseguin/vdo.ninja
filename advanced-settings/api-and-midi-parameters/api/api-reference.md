---
description: This is a snapshot of the VDO.Ninja API documentation as of Aug 16th, 2023
---

# API reference

For the most up to date copy of this API endpoint documentation, please go to [https://github.com/steveseguin/Companion-Ninja/#readme](https://github.com/steveseguin/Companion-Ninja/#readme)

For a test sandbox, to easily try out a few of the basic API options via a web dashboard, please go to: [https://companion.vdo.ninja/](https://companion.vdo.ninja/)

You can use this API on its own directly, or can use it indirectly via the Bitfocus Companion app /w the VDO.Ninja module.  The Companion app can be found here: [https://bitfocus.io/companion](https://bitfocus.io/companion)\
\
While not maintained or controlled by VDO.NInja, you can find the third-party Bitfocus Companion module for VDO.NInja here: [https://github.com/bitfocus/companion-module-vdo-ninja](https://github.com/bitfocus/companion-module-vdo-ninja)\


## Companion Ninja _(aka, the VDO.Ninja remote HTTP/WSS API)_

Remote control VDO.Ninja using an HTTP or Websocket interface; now Companion compatible.

#### Direct integration into VDO.Ninja

Support for Companion.Ninja is now built into VDO.Ninja (v19), with a set of hard-coded commands. The available API commands and their related options are listed further down. The index.html file contains sample code with an interactive layer, where you can press buttons to send commands to VDO.Ninja. HTTP and Websocket methods of sending commands are provided as examples. Details of those two methods are also below.

To use the integrated command set and API, just add \&api=XXXXXX to the VDO.Ninja link you wish to remotely control, like you would any other parameter. ie: https://vdo.ninja?api=XXXXXX The API value needs to match the value used by Companion Ninja and should be kept private. Then just send commands however you may wish.

Note: This API should also work with the vdo.ninja/beta/mixer?api=XXXXX page.

#### Companion Plugin

A fantastic user in the community also has made a BitFocus-Companion module for this VDO.Ninja API. If you wish to avoid doing custom API calls, definitely give the module a go.

https://github.com/bitfocus/companion-module-vdo-ninja

#### Customized IFRAME API Integration

You can also use the Companion Ninja service with your own custom set of commands if desired. You would wrap VDO.Ninja into an IFRAME, and use the parent-window to relay commands to VDO.Ninja and Companion Ninja. You can speak to VDO.Ninja via the IFRAME API in that case, to have access to the more exhaustive set of remote control options.

An example of this approach can be found here:

https://github.com/steveseguin/Companion-Ninja/blob/main/iframe\_api\_customizable\_example.html

Also note, the IFRAME API used by VDO.Ninja (v19.1) is also largely backwards compatible with the Companion Ninja API. You can find the IFRAME developer sandbox here: https://vdo.ninja/beta/iframe to get a sense of what is available.

#### Technical Details of the API

The API is likely to change over time, as this is still early days and user feedback with direct how things evolve. More commands added on request.

**HTTP/GET API (/w SSL)**

The HTTP API uses GET-requests (not POST/PUT), and is structured in a way to be compatible with existing hotkey control software.

`https://api.vdo.ninja/{apiID}/{action}/{target}/{value}`

or

`https://api.vdo.ninja/{apiID}/{action}/{value}`

or

`https://api.vdo.ninja/{apiID}/{action}`

Any field can be replaced with "null", if no value is being passed to it. Double slashes will cause issues though, so avoid those.

**Websocket API**

If using the Websocket API, this accepts JSON-based commands

connect to: `wss://api.vdo.ninja:443`

On connection, send: `{"join": $apiID }`, where `$apiID` is your api ID.

* be sure to stringify objects as JSON before sending over the websocket connection. ie: `JSON.stringify(object)`

Once joined, you can then issue commands at will, such as this object

```
{
  "action":"reload",
  "value": "true",
  "target" "null"
}
```

Be sure to implement reconnection logic with the websocket connection, as it will timeout every minute or so by default otherwise. You will need to rejoin after a timeout.

**API Commands**

The API and its commands are currently in a DRAFT form, and as such, may/will undergo change.

| Action            | Target | Value                             | Details                                                                                                                                                       |
| ----------------- | ------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| speaker           | null   | true                              | Unmute the Local Speaker                                                                                                                                      |
| speaker           | null   | false                             | Mute the Local Speaker                                                                                                                                        |
| speaker           | null   | toggle                            | Toggle the state of the local Speaker                                                                                                                         |
| mic               | null   | true                              | Unmute the local Microphone                                                                                                                                   |
| mic               | null   | false                             | Mute the local Microphone                                                                                                                                     |
| mic               | null   | toggle                            | Toggle the state of the local Microphone                                                                                                                      |
| camera            | null   | true                              | Unmute local Camera                                                                                                                                           |
| camera            | null   | false                             | Mute local Camera                                                                                                                                             |
| camera            | null   | toggle                            | Toggle the state of the local Camera                                                                                                                          |
| volume            | null   | true                              | Mutes all local audio tracks by setting the volume to 0%                                                                                                      |
| volume            | null   | false                             | Sets the playback volume of all audio tracks to 100%                                                                                                          |
| volume            | null   | {integer value between 0 and 100} | Sets the playback volume of all local playback audio                                                                                                          |
| sendChat          | null   | {some chat message}               | Sends a chat message to everyone connected. Better suited for the websocket API over the HTTP one.                                                            |
| record            | null   | true                              | Start recording the local video stream to disk; will probably create a popup currently                                                                        |
| record            | null   | false                             | Stops recording the local video stream                                                                                                                        |
| reload            | null   | null                              | Reload the current page                                                                                                                                       |
| hangup            | null   | null                              | Hang up the current connection. For the director, this just stops the mic and camera mainly.                                                                  |
| bitrate           | null   | true                              | Unlock/reset bitrate of all currently incoming video                                                                                                          |
| bitrate           | null   | false                             | Pause all currently incoming video streams (bitrate to 0)                                                                                                     |
| bitrate           | null   | {some integer}                    | Set video bitrate of all incoming video streams to target bitrate in kilobits per second.                                                                     |
| panning           | null   | true                              | Centers the pan                                                                                                                                               |
| panning           | null   | false                             | Centers the pan                                                                                                                                               |
| panning           | null   | {an integer between 0 and 180}    | Sets the stereo panning of all incoming audio streams; left to right, with 90 being center.                                                                   |
| togglehand        | null   | null                              | Toggles whether your hand is raised or not                                                                                                                    |
| togglescreenshare | null   | null                              | Toggles screen sharing on or off; will still ask you to select the screen though.                                                                             |
| forceKeyframe     | null   | null                              | Forces the publisher of a stream to issue keyframes to all viewers; "rainbow puke fix"                                                                        |
| group             | null   | {an integer between 1 and 8}      | Toggle the director of a room in/out of a specified group room (vdo.ninja +v22). Useful for Comms app, etc                                                    |
| joinGroup         | null   | {an integer between 1 and 8}      | Have the director of a room join a specified group room (vdo.ninja +v22.12)                                                                                   |
| leaveGroup        | null   | {an integer between 1 and 8}      | Have the director of a room leave a specified group room (vdo.ninja +v22.12)                                                                                  |
| viewGroup         | null   | {an integer between 1 and 8}      | Toggle the director of a room's preview of a specific group (vdo.ninja +v22). Useful for Comms app, etc                                                       |
| joinViewGroup     | null   | {an integer between 1 and 8}      | Have the director of a room preview a specific group (vdo.ninja +v22.12)                                                                                      |
| leaveViewGroup    | null   | {an integer between 1 and 8}      | Have the director of a room un-preview a specific group (vdo.ninja +v22.12)                                                                                   |
| getDetails        | null   | null                              | Will return a JSON object containing detailed state of everything. If a director, this will contain guest-state as seen by the director.                      |
| nextSlide         | null   | null                              | Next PowerPoint slide. See https://github.com/steveseguin/powerpoint\_remote for setup (vdo.ninja +v22.12)                                                    |
| prevSlide         | null   | null                              | Previous PowerPoint slide. See https://github.com/steveseguin/powerpoint\_remote for setup (vdo.ninja +v22.12)                                                |
| soloVideo         | null   | toggle                            | Toggle the Highlight of video for all guests (if a director) (vdo.ninja +v23)                                                                                 |
| soloVideo         | null   | true                              | Highlight your video for all guests (if a director) (vdo.ninja +v23)                                                                                          |
| soloVideo         | null   | false                             | Un-highlight your video for all guests (if a director) (vdo.ninja +v23)                                                                                       |
| stopRoomTimer     | null   | null                              | Stop the timer for everyone in the room (if a director) (vdo.ninja +v23.9)                                                                                    |
| startRoomTimer    | null   | Integer to count down from        | Value to count down from is in seconds in the room; applies to everyone in a room (if a director) (vdo.ninja +v23.9)                                          |
| PauseRoomTimer    | null   | null                              | Pause the timer for all everyone in the room (if a director) (vdo.ninja +v23.9)                                                                               |
| getGuestList      | null   | null                              | Returns an object containing the guest slots positional values, so "1", "2", etc. Each is a key that contains the stream ID and label for that guest as well. |

layout | null | {\*\* see below}

**Custom layout switching \*\***

You can create an array of layouts, set them via the URL parameters in VDO.Ninja, and then switch between them remotely using the API.

The value passed to the API can either be a number, representing the position in the array of the layout you want to activate, or it can be a single layout object.

`{action: "layout", value:3}` or `{action: "layout", value:[{"x":0,"y":0,"w":100,"h":100,"slot":0}]}`

```
layout 0 is the auto mixer
layout 1 is the first custom layout
layout 2 is the second custom layout
etc
```

If using the mixer app, the layout objects are controlled via the mixer app itself, so you don't need to pass an object in that case to the URL.

`?layouts=[[{"x":0,"y":0,"w":100,"h":100,"slot":0}],[{"x":0,"y":0,"w":100,"h":100,"slot":1}],[{"x":0,"y":0,"w":100,"h":100,"slot":2}],[{"x":0,"y":0,"w":100,"h":100,"slot":3}],[{"x":0,"y":0,"w":50,"h":100,"c":false,"slot":0},{"x":50,"y":0,"w":50,"h":100,"c":false,"slot":1}],[{"x":0,"y":0,"w":100,"h":100,"z":0,"c":false,"slot":1},{"x":70,"y":70,"w":30,"h":30,"z":1,"c":true,"slot":0}],[{"x":0,"y":0,"w":50,"h":50,"c":true,"slot":0},{"x":50,"y":0,"w":50,"h":50,"c":true,"slot":1},{"x":0,"y":50,"w":50,"h":50,"c":true,"slot":2},{"x":50,"y":50,"w":50,"h":50,"c":true,"slot":3}],[{"x":0,"y":16.667,"w":66.667,"h":66.667,"c":true,"slot":0},{"x":66.667,"y":0,"w":33.333,"h":33.333,"c":true,"slot":1},{"x":66.667,"y":33.333,"w":33.333,"h":33.333,"c":true,"slot":2},{"x":66.667,"y":66.667,"w":33.333,"h":33.333,"c":true,"slot":3}]]`

Some of these layout features are only available with Version 22 of VDO.Ninja; specifically the \&layouts= parameter is available on v22.5 or newer only.

See https://docs.vdo.ninja/advanced-settings/director-parameters/and-layouts for details and better documentation on this layout function.

**Commands that target remote guests as a director (available on vdo.ninja v19)**

The guest slot (1 to 99) or the guests's stream ID can be used as a target.

Currently toggling is primarily available for options; on/off absolute value options will be coming soon.

| Action                | Target                    | Value                                              | Details                                                                          |
| --------------------- | ------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| forward               | {guest slot or stream ID} | {destination room}                                 | Transfer guest to specified room                                                 |
| addScene              | {guest slot or stream ID} | {scene ID; 0 to 8, or an active custom scene name} | Toggle guest in/out of specified scene                                           |
| muteScene             | {guest slot or stream ID} | {scene ID; 0 to 8, or an active custom scene name} | Toggle guest's mic audio in scenes                                               |
| group                 | {guest slot or stream ID} | {group ID; 1 to 8}                                 | Toggle guest in/out of specified group; default group 1                          |
| mic                   | {guest slot or stream ID} | null                                               | Toggle the mic of a specific guest                                               |
| hangup                | {guest slot or stream ID} | null                                               | Hangup a specific guest                                                          |
| soloChat              | {guest slot or stream ID} | null                                               | Toggle solo chat with a specific guest                                           |
| soloChatBidirectional | {guest slot or stream ID} | null                                               | Toggle two-way solo chat with a specific guest                                   |
| speaker               | {guest slot or stream ID} | null                                               | Toggle speaker with a specific guest                                             |
| display               | {guest slot or stream ID} | null                                               | Toggle whether a specific guest can see any video or not                         |
| sendDirectorChat      | {guest slot or stream ID} | {some chat message}                                | Sents a chat message to a guest and overlays it on their screen                  |
| forceKeyframe         | {guest slot or stream ID} | null                                               | Trigger a keyframe for active scenes, wrt to a guest; helps resolve rainbow puke |
| soloVideo             | {guest slot or stream ID} | null                                               | Toggle whether a video is highlighted everywhere                                 |
| volume                | {guest slot or stream ID} | {0 to 100}                                         | Set the microphone volume of a specific remote guest                             |
| stopRoomTimer         | {guest slot or stream ID} | null                                               | Stop the timer for the specific guest (+v23.9)                                   |
| startRoomTimer        | {guest slot or stream ID} | Integer to count down from                         | Value to count down from is in seconds (+v23.9)                                  |
| PauseRoomTimer        | {guest slot or stream ID} | null                                               | Pause the timer for the specific guest (+v23.9)                                  |

#### Callbacks / State Responses

Start with Version 22 of VDO.Ninja, the API requestes will have a response reflecting the state of the request.

For example, if toggling a mic of a guest, the response of the HTTP API request will be `true` or `false`, based on whether the mic is now muted or not. If the request is an object, such as when using `getDetails`, you'll get a JSON response instead of basic text. There's also `getGuestList`, which can be useful for getting a set of possible guest slot positional values, along with its corresponding stream ID and label.

Basic text/word responses are such things as `true`, `false`, `null`, `fail`, {`somevalue`}, or `timeout`. Timeout occurs if there's no listener or no response to a request; the system will stop the callback and fail to a timeout after 1-second.

![image](https://user-images.githubusercontent.com/2575698/172721874-ac13f5c7-330d-4b9d-a605-40a20f63a57d.png)

![image](https://user-images.githubusercontent.com/2575698/172721854-0a8fe712-aaf9-4128-bbb7-0f3de7ca0d3e.png)

If the request was made via Websockets, instead of the HTTP request, you'll get a JSON object back that contains the same data, along with the original request, including custom data fields. These custom data fields, such as `data.cid = 3124`, can be used to link requests with the callback, if precision with the requests is needed.

There is no time-out when using Websockets; the callback can happen seconds or minutes later even, although normally a response should be expected in under a second as well.

![image](https://user-images.githubusercontent.com/2575698/172722028-860dd0b9-b73c-4ef9-8d22-b909bd79c88b.png)
