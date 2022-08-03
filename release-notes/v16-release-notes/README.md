# v16

* [New Queueing System](./#new-queueing-system-)
* [Global Hotkey Support via MIDI controllers](./#global-hotkey-support-via-midi-controllers-)
* [Screen Sharing Updates](./#screen-sharing-updates-)
* [UI/UX updates](./#uiux-)
* [Optimizations](./#optimizations-)
* [New features](./#new-features-)

## New Queueing System 🕟

Made a feature for Queuing up users in a green room. Makes the process easy and relatively more secure than how I see others currently doing it.

Activate it by adding `&queue` to the URL for both the director and the guests.

Such as, [https://vdo.ninja?director=xxxx\&queue](https://vdo.ninja/?director=xxxx\&queue) and [https://vdo.ninja/?room=xxxx\&queue](https://vdo.ninja/?room=xxxx\&queue)

There will be a new button added to the director's view, which when pressed, loads a guest into the director's room. The guest will be able to see the director and only the director then. The director can add more guests this way, kicking out those they don't want, and continue to cycle thru the queue of guests as they join the room. The director can then transfer the guest(s) to another room, and when transferred, the guests are no longer considered in 'a queue' and will be able to see everyone in that new room, and vice versa.

![](https://imgur.com/oTfrAbd.png)

## Global Hotkey Support via MIDI controllers 🎹

Added Global hotkey support via MIDI input. This is an experimental first draft of the hotkey specification and will see continued development and tweaking.

You can enable the MIDI hotkey support by adding `&midi` to the URL. For different key layouts, you can pass 1 or 2 or 3 (etc) as a value to the `&midi` parameter.

For reference at this time, available sets are:

### `&midi=1`

| MIDI message | Function                                     |
| ------------ | -------------------------------------------- |
| Note G3      | Toggle Chat                                  |
| Note A3      | Toggle Mute                                  |
| Note B3      | Toggle Video Output                          |
| Note C4      | Toggle Screen Share                          |
| Note D4      | Hang up                                      |
| Note E4      | Raise Hand Toggle                            |
| Note F4      | Record Local Video Toggle                    |
| Note G4      | Enable the Director’s audio \[director only] |
| Note A4      | Stop the Director’s Audio \[director only]   |

### `&midi=2`

| MIDI message | Function                                     |
| ------------ | -------------------------------------------- |
| Note G1      | Toggle Chat                                  |
| Note A1      | Toggle Mute                                  |
| Note B1      | Toggle Video Output                          |
| Note C2      | Toggle Screen Share                          |
| Note D2      | Hang up                                      |
| Note E2      | Raise Hand Toggle                            |
| Note F2      | Record Local Video Toggle                    |
| Note G2      | Enable the Director’s audio \[director only] |
| Note A2      | Stop the Director’s Audio \[director only]   |

### `&midi=3`

| MIDI message         | Function                                     |
| -------------------- | -------------------------------------------- |
| Note C1 + Velocity 0 | Toggle Chat                                  |
| Note C1 + Velocity 1 | Toggle Mute                                  |
| Note C1 + Velocity 2 | Toggle Video Output                          |
| Note C1 + Velocity 3 | Toggle Screen Share                          |
| Note C1 + Velocity 4 | Hang up                                      |
| Note C1 + Velocity 5 | Raise Hand Toggle                            |
| Note C1 + Velocity 6 | Record Local Video Toggle                    |
| Note C1 + Velocity 7 | Enable the Director’s audio \[director only] |
| Note C1 + Velocity 8 | Stop the Director’s Audio \[director only]   |

### `&midi=4`, control change-based

| MIDI message    | Function                                                   |
| --------------- | ---------------------------------------------------------- |
| Command = 110   | With values accepted from 0 to 8 for local toggle options. |
| Command = 110+N | Where N is the guest’s order in the control room.          |

In this case, for hotkeying remote guests as a director:

| MIDI message | Function                         |
| ------------ | -------------------------------- |
| Value 0      | Opens the Transfer Popup         |
| Value 1      | Add/remove from scene            |
| Value 2      | Mute guest in scene              |
| Value 3      | Mute guest everyone              |
| Value 4      | Hangup the guest                 |
| Value 5      | Toggle Solo Chat with this guest |

All the above hotkey mappings are purely experimental at this time and will change based on user feedback. These mappings should allow a user to use a StreamDeck with VDO.Ninja.

## Screen sharing updates 💻

When stopping screen share, it will now default back to the previous video device, if there was one.

When screen sharing as a guest in a group room, the screen share will now create a second stream for the screen share, keeping your webcam also. Stopping the screen share removes the video. The director will see the stream appear as a new source with a new stream ID.

Screen sharing reuses the first bit of the parent's stream ID, to help directors identify who they belong to.

You can use `&ssid=XXXXX` or `&screenshareid=XXXX` to specify a screen share stream ID ahead of time. (If you don't use it, one will be generated for you, as mentioned above)

The previous method of switching video sources to that of a screen share (rather than adding a new stream) is accessible still via the Settings menu under video sources. This will still be the default screen sharing behaviour if not in a group room.

## UI/UX ☑

* iOS devices will no longer auto-capitalize room and password fields.
* If I detect the site is within an IFRAME, I now hide the info-button, the report-error button, and I clear the chat's welcome message. This also applies to obfuscated links via [invite.cam](https://invite.cam/) and the [rtc.ninja](https://rtc.ninja) debranded website.
*   If a guest mutes, it shows a little mute icon to signify that; appears for both guests and the director.

    ![](https://imgur.com/mz8vhHW.png)
*   The method of joining a room via the top-left input field will now ask for a password (optional).

    ![](https://imgur.com/5gXCcqq.png)
* Asks for camera permissions now when you open the settings menu and no previous permissions were granted.
* TEST audio button works with [rtc.ninja](https://rtc.ninja) and with Firefox now.
*   Added some warning symbols to the more dangerous toggles ⚠

    ![](https://imgur.com/3MI1dDm.png)
* Updated language files to be more comprehensive. Removed the mention of macOS v23 from all language files and several language translations were improved by community contributions.
* Added a workaround for a bug with iOS devices where the video bitrate wouldn’t increase in some cases, when told to do so.
* Chrome on iOS 14.3 now works I think, and this option should be available without any error popup now.
* Improved the way I try to deal with a Google Pixel video glitch.
* I am hiding the mouse cursor when it's over the QR code now. The mouse cursor was sometimes in the way.
*   Improved the stats page UI; it is now a bit more explicit about details and issues.

    ![](https://imgur.com/fuCyD8L.png)
*   Users who do not have access to the control room will get an error message in the header; no longer just a popup.

    ![](https://imgur.com/iCALGcU.png)
*   When playing with sliders, I provide as an on-hover popup the initial setting’s value. I do not have access to the actual default values, but hopefully this helps a bit with undoing changes.

    ![](https://imgur.com/rFckN4C.png)
* Fixed a bug where 7 videos on screen sometimes broke the auto mixer
* Channel Count is now hidden as a dynamic GUI setting. It was just too confusing for most users.
* The recording function now adds your stream ID or label value as a prefix to the file recordings. It is still followed by the timestamp.&#x20;

## Optimizations 📈

* If using macOS with OBS, h264 is the default video codec used. You can still manually set a different one, but this should help improve performance for macOS users.
* The resolution of videos in a group room or scene layout will scale down dynamically to match their container sizes exactly. While something akin to this already took place for guests, this logic has been improved and extended to even the OSB scenes. This should reduce the CPU load on both OBS and users in large group rooms. It will not impact things greatly if using Solo view links within OBS though.
* You can disable this dynamic resolution control by setting `&scale=0` (no scripted scaling at all) or manually specifying another scale value.
*   `&portrait` ( or `&916` or `&vertical`) will optimize the auto-mixer to work with video streams that are in portrait mode (versus landscape). Until I can make the mixing logic smarter, hoping this helps.

    ![](https://imgur.com/ahqCruN.png)
* Added more DoS prevention logic and a bit of load balancing.
* `&dir` is an alias of `&director` now.
* The last traces of JQuery have been removed. 🎆 🥳 The webapp loads abouts 15-percent faster now.
* Increased the default 'starting' bitrate for inactive videos in manual scenes to 400-kbps (up from 200-kbps).
* Only the 3 closest TURN servers are accessed now (based on the user’s timezone). This logic is needed to help VDO.Ninja scale up to support more TURN servers and to ensure users use an appropriate TURN server if required.
* Modified the iOS guest logic a bit; the first couple guests in a room will get 2.5x higher bitrates from remote iOS devices. (3-fps vs. 1-fps). I don't suggest trying to make rooms larger than 7 or 8 people with an iPhone 11 in it, unless you disable their video output. Hopefully this logic improves the experience for 1:1 guest calls without breaking things too much for older iPhones.

## New features 🆕

* `&inputchannels=N` (or `&ac=N`) tells the audio capture device explicitly to select N-number of audio channels. This shouldn’t be needed often, but may help with debugging or advanced use canses. Setting `&stereo=0` will set `&inputchannels=1` by default.
* Added the `&speakermute`, (`&mutespeaker`, `&ms`, `&sm`) parameter. Sets the speaker to be muted by default for a guest.
* Added `&chatbutton`={ 1 | 0 | true | false }, aka `&chat` or `&cb`. Shows the chat button or hides the chat button. You can use this on view links I guess, if you happen to want chat with view-only links. Or if you want to hide chat for some reason, like with push only links.
* I have hosted a fully-isolated version of VDO.Ninja in Hong Kong (AWS); I'm trying to see if I can expand access into mainland china. We'll see if it works or not. It uses 'compromised' TLS encryption, so to reflect this, I named it: [https://insecure.cam/](https://insecure.cam/)
* Added the ability to send custom commands to the IFRAME; not just what has been pre-configured. This uses post-messaging + eval. Not sure I see a huge problem with this, but I'll revisit as needed. This gives IFRAME developers full control to do whatever they want, even if CORS blocks their creativity. Sample button of it working on beta: [https://vdo.ninja/iframe](https://vdo.ninja/iframe)
* Added 'beep' noises as an optional URL flag for raised-hand and chat messages. `&beep` or `&notify` or `&tone` or `&r2d2`.
* Added `&showdirector`, which lets scenes see a director's feed (add to the director's URL to enable for everyone).
*   Added the ability via a button for the Director to SOLO talk with a guest. The director must enable their microphone first before using.

    ![](https://imgur.com/9OeYGhy.png)
*   Made the option to be a performer+director as a checkbox

    ![](https://imgur.com/KNjjKnv.png)
*   Ability to blind and deafen guests 🙈 🙉&#x20;

    ![](https://imgur.com/YBfJdCR.png)
*   The gain can now be set to 0 to 200 (instead of 1 to 100). It also has a visual value indicator now, so setting it exactly is easier.

    ![](https://imgur.com/fKQfHyz.png)
*   Add a low-cut filter by adding `&lowcut=100`. The value passed is the cut off frequency and defaults to 100. This can help reduce background hum or fan noise.

    ![](https://imgur.com/vmmHoWE.png)
