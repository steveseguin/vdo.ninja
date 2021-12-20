# v14

* [Guest labels](v14-release-notes.md#guest-labels)
* [Improved video aspect ratio change handling](v14-release-notes.md#improved-video-aspect-ratio-change-detection-algorithm)
* [Remote mute guests](v14-release-notes.md#remote-volume-control)
* [Reworked audio pipeline](v14-release-notes.md#reworked-audio-pipeline)
* [Improved reconnection logic](v14-release-notes.md#improved-reconnection-logic)
* [More TURN servers](v14-release-notes.md#new-turn-servers)
* [Raise hand feature](v14-release-notes.md#more-parameters)
* [Audio activity indicator](v14-release-notes.md#more-parameters)
* [Improved director room](v14-release-notes.md#improved-director-room)
* [And so much more...](v14-release-notes.md#more-parameters)

[Demo of new features in Video format here](https://youtu.be/3D7R94bBcAw?t=144)

## Guest labels

Display name labels have been added as a video overlay option. Thank to Jcalado for helping out here and for creating a set of styles.\
You can configure a publisher with a label by using `&label=some_name` or by just leaving it blank; `&label`. If blank, it will prompt for the user’s input.

`&showlabels` or `&showlabel` will turn on this feature

* Font-size of labels will adjust slightly based on the window size
*   Underscores "\_" used in label values will be replaced by spaces, allowing for word separation.

    ![](https://i.imgur.com/Bk6mreW.png)
* CSS of the styles can be set via the OBS browser source stylesheet window. The CSS class name you can customize is called "video-label"
*   There are some "preset" styles you can use by passing  **skype**, **ninjablue**, **toprounded**, **fire**, **teams**, OR **zoom** as a value. For example: `&showlabel=fire`

    ![](https://i.imgur.com/rr7IDxX.png)

## Improved Video aspect ratio change detection algorithm

Along with this change, some improvements to the auto-mixer were made, including detection and mix update of detected video aspect ratio changes.

## Remote volume control

You can now remotely mute a guest from the director’s room; there are options to mute in just the scene, but also have the guest muted Everywhere.\
The volume control in the director’s room for a guest now applies to that guest’s volume Everywhere.

## Reworked audio pipeline

New audio pipelines for streams have been added for both inbound and outbound audio streams.\
You can disable it mostly by using `&noaudioprocessing` or just `&noap` as a URL parameter.\
Added a compressor, limiter, and equalizer for the guests to tinker with.

* `&compressor`  (preset as a basic compressor)
* `&limiter` (preset as a basic limiter)
* `&equalizer` or just `&eq` (options to manually adjust are in the settings window, if enabled). Currently must be adjusted by the guest themselves, but will eventually be an option for the director to remotely control.

## Change audio processing live

You can change settings like Audio echo cancellation, noise suppression, and auto-gain dynamically during a live stream now. This will cause the video to flicker with some browsers and will only show if the browser supports it.

![](https://i.imgur.com/mv11FED.png)

## New TURN Servers

New TURN servers added to LA, Chicago, and I think New York? Anyways, these are all UDP-based TURN servers, while the previous set were TCP-based. You can check what TURN server you are connected to via the stats debug menu. (Ctrl + Left-click on PC; Command+LeftClick on macOS). UDP vs TLS is listed, along with the IP address, which opens up to show the hosted location of the TURN server. Check it out with [https://obs.ninja/beta/speedtest](https://obs.ninja/beta/speedtest)

![](https://i.imgur.com/BGtsj6g.png)

## UI/UX Tweaks

* Scroll bar in the stats menu doesn’t keep trying to scroll back up with each refresh &#x20;
* Listed Labels and Stats in the stats debug window are less buggy when there are more than one stream active &#x20;
* There’s a drop down button on the main page that reveals a few new buttons. File share, Share Website, Speed Test, and a link to OBS.Ninja documentation. &#x20;
* Added a Bug Submission button in the bottom right. It shows up when an error occurs in the code; clicking it lets you submit that error information to an OBS.Ninja error reporting server. Only the console log errors and user-agent info is submitted. &#x20;
* I changed the "Glasses" icon that appears in the top-right of videos to a HQ and LQ icon instead. This button makes the video fill the window and increases the video bitrate to at least 1200-kbps. Useful for seeing detail in a screen-share while in a group room.
* If entering the room "test", you’ll get a notice now alerting you to the fact it’s not a secure room to be joining. Many users seem surprised to see the room is rarely empty, so I hope this helps that out. &#x20;
* Added a notice to the Transfer room popup, alerting users that rooms being transferred to need to share the same password as the originating room. &#x20;
*   Added a button that lets a user reload the video camera device without selecting another device first.

    ![](https://i.imgur.com/4ORA8Du.png)
* An incorrect password (with `&hash` used) returns a more stylized error message now. &#x20;
* If you hold CTRL (or command) when muting/unmuting the speaker output, it will force the audio output destinations to be reconnected.  Should be useful for me to debug audio issues in the future, such as when your sound suddenly stops working. &#x20;
*   The microphone icon in the bottom control bar now glows green on local mic activity. May change later.

    ![](https://i.imgur.com/4kqDXZO.png)
*   Added a Reset button to the URL link invite generator.

    ![](https://i.imgur.com/soMda0S.png)
*   Added a AUDIO ACTIVITY indicator in the top-right of the inbound videos. You can now see who is talking. You can force this on in the SCENE links by using `&style=3` as well, as it doesn’t show up there by default otherwise.  Disabling audio processing will hide this all, as well. (`&noap`)

    ![](https://i.imgur.com/JI0YBQd.png)
* Removed the header from iOS when invited as a guest.  Just trying to free up more space where needed. &#x20;
*   Improved the play button. Opaque and easier to see now.

    ![](https://i.imgur.com/rcQAzds.png)

## Tools

* Jcalado has revamped the Speed Test to be pretty dapper and stylish. Graphs and more.
* The Speed Test contains more accurate packet-loss values and a "quality limitation reason" output now for publishers. This Quality LImitation value defines why a stream you are outputting isn't performing well; CPU or Network issues are options, if there are issues.

![](https://i.imgur.com/IyCl0iJ.png)

* Jcalado again rescues us with an updated [https://obs.ninja/devices](https://obs.ninja/devices) page that lists available devices, but also it can be used to find the audio-device ID for a given audio output destination. An alternative to using the Electron Capture app. And you just need to click to copy to the clipboard.

## Improved reconnection logic

A significant amount of work has gone into adding reconnection logic for audio and video devices. If unplugging a device or adding a new device to the computer, or if a device is temporarily disconnected, the new logic will try to handle it. This will hopefully solve problems with Bluetooth headphones disconnecting during live streams and not reconnecting.

## Improved file sharing

The `&fileshare` sharing function has been improved; more stable and less freezing for remote viewers.

## New website sharing

The Share Website feature is experimental; it allows you to share third-party websites as an IFRAME. Some Youtube videos can be shared as "embedded" links, for example, with this option.

## Chat window pop out

The chat window can now Pop Out, allowing you to type and read messages from another window. This cannot be shared cross-browsers, as it uses in-browser messaging. ![](https://i.imgur.com/0qTu1wU.png)

## Translations

* The Language translator has been improved. It now supports placeholder text and tool-tip text. Please feel free to update translation files on github if not fully translated.
* Portugese language updated (thank you again, Jcalado)

## More parameters

* The `&enhance` flag was added; this causes the Viewer of a stream to request its publishers to prioritize encoding and network sending of the audio stream. If you are facing clicking sounds as a viewer, such as with an OBS view link, this might help reduce audio clicking.
* The parameter `&iframe` (aka `&website`) is added; this allows you to share a website with viewers. Please be aware this is still an experimental feature.
* There are toggles for Advanced Video and Audio in the settings menu now. You can disable access to the settings menu by adding `&nosettings`. ![](https://i.imgur.com/yEff0q9.png)
* Added a RAISE YOUR HAND feature, via an icon in the guest’s control bar. It causes a yellow button to appear on the director’s page when pressed. You can enable this with the `&hands` feature, added to the guests' URL link.\
  ![](https://i.imgur.com/uI9wXMx.png)
*
  *   A new screen-share button was added.  You can FORCE it on with \&ssb, or hide it with \&nosettings. The UX for screen sharing is not quite perfect yet, but I’m interested to hear feedback regarding it.  If you toggle the button off, it will open the settings menu currently, letting you change to a different video device --- It does not STOP the screen sharing when pressed. Not yet at least. (maybe in v15)

      ![](https://i.imgur.com/KKIYfTf.png)
* `&nopreview` now works when doing screensharing.
* Added `&exclude=xxx,yyy,zzz` as a new parameter, which is like `&view`, but in reverse. Any stream ID added to the list of values will NOT be allowed to load. So, you can eliminate specific publishers in a room from loading in your group video layout.(no audio or chat either)
* `&audiooutput` is now an alias of `&outputdevice` / `&od`.
* You can use the URL parameter `&controlroombitrate` or `&crb` to allow a guest to control their total allow room video bitrate. When added, a slider appears in the guest’s settings menu. For guests that have limited CPU or Network bandwidth, lowering this slider will reduce the video bitrate of incoming video streams.
* Added `&ptime` as an advanced audio URL parameter, Setting ptime or minptime to be like 60 might reduce audio clicking in some cases, although the browser defaults are set by default. Ptime represents the packet size in milliseconds of audio streams.
* Useinbandfec is now enabled if `&stereo` or custom audio bitrates are used; overriding browser defaults. I’m hoping this reduces audio clicking if on bad WiFi.
* `&latency=NN` is a new URL parameter, which can be applied to the publisher of an audio stream. The browser default tends to be 10 milliseconds, but 20 or 30 might be a useful option to help reduce audio clicking caused by buffer underruns. The latency value sets the LatencyHint value of the WebAudio audioContext function.
* Added `&pass` and `&pw` as aliases for `&password`
* Added a `&cleandirector` URL parameter which hides the invite links and help information in the director’s room. This allows for a nice clean window.
* When using the `&optimize` command, you can now pass bitrates to it. The default bitrate is 600 kbps. Using this command will allow you to disable video streams in OBS from streaming if they are not visible. Setting this value to 0 will have the streams turn off entirely while not actively visible in OBS. This command is not on by default.

## New scenes

* `&scene=2` has been added as an option for OBS scene links. With this, when a video is added to a scene manually, it replaces any previous video that was added to the scene. This causes some state issues with buttons in the director’s room, but for now manually toggling the add to scene button can resolve this issue.

## Improved director room

* If you leave `&director` as a URL parameter blank, it will create a random room name for you.&#x20;
* There’s a checkmark option for setting up a group room with the `&broadcast` URL flag already added. This has it so any guest joining the room with the generated links will only be able to see the director's video. The other guests in the room can be heard, but not seen. This allows for larger group sizes.
*   Added an option to set the Default Video codec in the Director’s room during room setup. (appends the codec request to the SCENE links only)

    ![](https://i.imgur.com/uFM1BD8.png)
* The Invite and Scene links in the Director’s room can now be toggled as hidden or not. This frees up room in the Director’s room.
*   Volume activity levels are also seen in the Director’s room &#x20;

    ![](https://i.imgur.com/MGPBh2c.png)
* When you publish your mic or camera as a Director now, I update the URL to show your stream ID.  You can also manually set  your own stream ID when joining the director’s room by adding `&push=STREAMIDVALUE`
*   I moved the Push to Talk button in the Director’s room to the bottom and renamed it.

    ![](https://i.imgur.com/OyBRq3w.png)

## Other

* www.vdo.ninja now redirects to vdo.ninja; this avoids potential mismatched domain problems.

## Support / Guides

Numerous more guides have been written this month. [https://guides.vdo.ninja](https://guides.vdo.ninja) is slowly being populated with some more polished guides; on-going project there. A guide on how to Stream from VDO.Ninja into Zoom without OBS. (trying to minimize repeating myself with support emails) [https://docs.google.com/document/d/e/2PACX-1vR\_5D2BSi\_SJ8\_g-GGnC\_DtoX7HYEhzPvGlLExMasWh3UBpRv-x8Bj0tbdYIXjfgzImVHd-oNJbOTYb/pub](https://docs.google.com/document/d/e/2PACX-1vR\_5D2BSi\_SJ8\_g-GGnC\_DtoX7HYEhzPvGlLExMasWh3UBpRv-x8Bj0tbdYIXjfgzImVHd-oNJbOTYb/pub)

## Bug fixes

* Numerous fixes to support iOS devices better were added.
* Fixed a bug on Google PIXEL smartphones where if lower resolutions were used the video would go all corrupted.
* You can access the stats screen now even when using the `&style=2` waveform effect.
* Fixed a bug with the OBS Tally nights not working for the group
* iOS devices can now see the loudness meter during camera setup
* Fixed an issue with the lip sync code; specifically the `&sync` command
* Fixed a bug where the audio selector in the settings pane required a double-click to work.
* Fixed a bug in `&maxpublishers` and added the new `&maxconnections` paramter, which limits the total of both view and push connections. Maybe useful for like a call-in show style thing, where you don't want to get flooded.
* Fixed an odd bug where if changing cameras too quickly during the camera selection window, you could end up with a dead video track being added to a waiting viewer instead of an active video track. (race condition)
* Changed the transfer room so that if you get disconnected from a room you were transferred to, you also get force disconnected from any video streams from that room.   This is going to have to be good-enough for the next month or so, until I can get a better solution in place.
* Handshake connection isn’t made until after camera selection page now (for publishers)
* Camera-selection page had numerous changes and tweaks in an attempt to avoid camera-permission errors. There will be ongoing improvements here.

## IFRAME API

*   Added an IFRAME API to let a user remotely control the tally light for a guest via the IFRAME API.  sceneState=true | false.  See [https://vdo.ninja/iframe ](https://vdo.ninja/iframe)for a dev sandbox.

    ![](https://i.imgur.com/glRIssi.png)
