# Updates - VDO.Ninja

{% hint style="danger" %}
A general notice to users, on beta and alpha, the echo cancellation isn't working at the moment. It is working on the main production version however.\
If using vdo.ninja/beta/ or vdo.ninja/alpha/, switch to just vdo.ninja/ if having echo problems or wear headphones at low volume.\
I'm working on a fix, but I don't have an ETA. Will update when fixed.

_\*\*_ UPDATE: I hot-patched beta and alpha with a fix. This fix disables the option to select custom audio output destinations, but resolves the echo issue. If using a self-deployed instance, you can instead add [`&noap`](../general-settings/noaudioprocessing.md) to the URLs to fix it as well; you can also enable `chrome://flags/#chrome-wide-echo-cancellation`, patch the code, or just use headphones.
{% endhint %}

#### **September 17** <a href="#august-31" id="august-31"></a>

* [`&waitimage`](../advanced-settings/newly-added-parameters/and-waitimage.md) now has its wait image 'fit' to the screen, and [`&cover`](../advanced-settings/view-parameters/cover.md) will have it 'cover' the screen.
* [`&waitimage`](../advanced-settings/newly-added-parameters/and-waitimage.md) now works with scene links; not just basic view links.\
  (\*\* on alpha)

#### **September 16** <a href="#august-31" id="august-31"></a>

**S**implified the connection type wording in the stat's menu , plus made the publisher's connection type available to the viewer's side so you can more clearly see now if a guest has ignored your request to use Ethernet.\
![](<../.gitbook/assets/image (16).png>)\
\*\*\* Changes on alpha at vdo.ninja/alpha/

#### **September 12** <a href="#august-31" id="august-31"></a>

* Added [`&effects=7`](../source-settings/effects.md) (or `&effects=zoom`), which will provide a manual zoom option in the effects menu. (you can also select the zoom mode via the effects menu, if available)\
  ![](<../.gitbook/assets/image (2).png>)
* Added [`&getfaces`](../advanced-settings/upcoming-parameters/and-getfaces.md) on the viewer link (or `{getFaces:true}` via the IFrame API), which will request a continuous stream of face bounding boxes, for all inbound videos and all faces contained within. The data is transmitted to the parent IFRAME, and this data can be used for moving the IFrame window around, if you wish to make your own custom face-tracker or whatever else.\
  ![](<../.gitbook/assets/image (11) (1).png>)
* ``[`&effects=1`](../source-settings/effects.md) on the sender side (or `&effects=facetracking`) will auto-center the user's face in the center of their video, zooming in as needed. It takes a moment to initiate, but it offers a gentle PTZ-like effect.\
  \-- note: I previously had `&effects=1`, but it wasn't that good, so this is a more polished attempt. It's also available from the effects drop down menu now as a selectable option, as before I was hiding it.\
  ![](<../.gitbook/assets/image (3) (1).png>)\
  \-- important note: Both `&getfaces` and `&effects=1` requires the use of the Chromium experimental face detection API, as I'm using the built-in browser face-tracking model for this. You can enable the API flag here: `chrome://flags/#enable-experimental-web-platform-features` My hope is that this feature will eventually be enabled by default within Chromium, as loading a large ML model to do face detection otherwise is a bit heavy; you may need to enable this within the OBS CLI if wishing to use it there?\
  \*\*\* Changes on alpha at vdo.ninja/alpha/

#### **September 9** <a href="#august-31" id="august-31"></a>

* Added mobile touch support to the tap-to-focus (only mouse support previously).
* Minor issue with drag-to-zoom fixed.
* Fixed issue with not being able to reset video settings to default after changing them.
* [`&autohide`](../parameters-only-on-beta/and-autohide.md) works better now; also on mobile, the `&autohide` makes the control bar transparent on timeout, to avoid conflicts with tap-to-zoom/focus logic.
* It's easy to adjust video settings on mobile, as there is a large space to scroll without accidentally clicking a setting slider. Also more bottom padding, making it easier to click close in landscape mode.
* Made the [`&sticky`](../general-settings/sticky.md) redirect confirmation prompt less ugly, and I now don't ask if the URL already matches the saved session's URL.
* Made some changes/fixes to the recently new switchMode ([`&previewmode`](../advanced-settings/upcoming-parameters/and-previewmode.md)) function of the director room (hopefully no bugs?).\
  \*\* changes on alpha @ vdo.ninja/alpha/

#### **September 7** <a href="#august-31" id="august-31"></a>

* Added some notice icons to the PTZ controls, which show a tooltip on hover that explains remote PTZ only works if the remote window is visible.\
  ![](<../.gitbook/assets/image (1) (1) (3).png>)
* made the audio / video director control settings scrollable (max height \~500px), so you can more easily see the video while making changes to it.\
  ![](<../.gitbook/assets/image (8) (2).png>)
* Increased the size of Canadian and German turn relay servers (4x larger), and completed other backend maintenance.

#### **September 6** <a href="#august-31" id="august-31"></a>

* ``[`&showconnections`](../advanced-settings/upcoming-parameters/and-showconnections.md) will display the total number of p2p connections of a remote stream. Works with the director's room and the automixer. Might help give comfort over privacy/security during a stream.
* Total number of p2p remote connections (viewers) of a stream source will also appear in the stats menu, even without [`&showconnections`](../advanced-settings/upcoming-parameters/and-showconnections.md). Could be useful for debugging CPU/bandwidth issues.
* Connections may represent video/audio streams, or just a data-connection. Meshcast-hosted streams might not be accounted for, depending on how the viewer is connecting.\
  ![](<../.gitbook/assets/image (10).png>)
* Added `showChat` and `showDirectorChat` as HTTP/WSS API options for sending messages to guest(s). Useful if you want to hotkey a streamdeck command with some welcome message for guests.
* Added events notifications relating to the director's guest-mute, guest-video-mute, and guest-position-change actions, along with any remote-video-mute updates to the HTTP/WSS API (by request for the bitfocus companion app)

\*\* on alpha

#### **September 2** <a href="#august-31" id="august-31"></a>

* [Noise gate](../source-settings/noisegate.md) remote control has been tweaked a bit; the correct state is loaded now on a director's page refresh
* Added an option to control the [compressor](../source-settings/and-compressor.md) remotely (3 states for the compressor; Off/On/Limiter)\
  ![](<../.gitbook/assets/image (3) (1) (2).png>)
* Fixed issues on alpha, including now where the [labels](../general-settings/label.md) for guests were not always positioning correct if audio-only
* \*\* changes on alpha @ vdo.ninja/alpha/

#### **August 31** <a href="#august-31" id="august-31"></a>

* Added a button in the director's room. It lets you toggle between a Preview layout and the normal Director layout; the Preview layout will mirror what a basic [`&scene=0`](../advanced-settings/view-parameters/scene.md) link would look like. Useful if you want to switch to a guest-like mode as a director, and then switch back as needed to the director's room to make adjustments. - to enter this mode by default, [`&previewmode`](../advanced-settings/upcoming-parameters/and-previewmode.md) can be used by the director \*\* on alpha at vdo.ninja/alpha/\
  ![](<../.gitbook/assets/image (1) (2) (4).png>)
* ``[`&noisegatesettings`](../advanced-settings/upcoming-parameters/and-noisegatesettings.md) has been added to vdo.ninja/alpha/, which is used in conjunction with [`&noisegate`](../source-settings/noisegate.md). This feature lets you tweak the noise-gate's variables, making it more or less aggressive as needed. example:\
  `https://vdo.ninja/alpha/?noisegate&noisegatesettings=10,25,3000`\
  ``It takes a comma separated list:\
  \-- First value is target gain (0 to 100), although 0 to 40 is probably the recommended range here\
  \-- second value is the threshold value where the gate is triggered if below it. \~ 100 is loudly speaking, \~ 20 is light background noise levels, and under 5 is quiet background levels.\
  \-- third value is how 'sticky' the gate-open position is, in milliseconds. Having this set to a few seconds should prevent someone from being cut off while speaking or if taking a short pause.

#### August 25

* Added new sender-side parameters that can customize how you want VDO.Ninja to balance resolution vs frame rate, specifically when bitrate or CPU is insufficient to offer both at the same time.\
  \-- for video, [`&contenthint=detail`](../advanced-settings/upcoming-parameters/and-contenthint.md)``\
  ``-- for screen-shares, [`&screensharecontenthint=motion`](../advanced-settings/upcoming-parameters/and-screensharecontenthint.md), which will override [`&contenthint`](../advanced-settings/upcoming-parameters/and-contenthint.md) for just screen-shares if set also.\
  The two options for video are `detail` or `motion`. Screen shares generally tends towards `detail` by default, and camera sources are tend towards `motion` by default. `detail` will try to prioritize resolution over frame rate, so the frame rate may drop a lot used. `motion` will try to maximize frame rate, but may drop the resolution a lot. There's no way to force both on as there's no magic bullet if your CPU or network cannot keep up. note: If using [`&codec=vp9`](../advanced-settings/view-parameters/codec.md) on the viewer side, the frame rate may drop as low as even 5-fps.\
  \-- Also for audio, I've added [`&audiocontenthint=music`](../advanced-settings/upcoming-parameters/and-audiocontenthint.md) The two options are `speech` and `music`. No idea what it does exactly, but when using `music` there seems to be a fixed bitrate of 32-kbps sent out by default, where as with `speech` it is variable, using less bandwidth when not speaking.\
  These parameters have been tested on Chrome, but other browsers may vary in behavior. Safari seems to just ignore things, for example. \*\* changes on alpha

#### August 23

* Updated the translation files on GitHub and on vdo.ninja/alpha/, so recently added UI elements can have alternative translations added
* Custom scenes will now be sorted based on alphanumerical value. (rather than order of connection). \*\* on alpha\
  ![](<../.gitbook/assets/image (1) (2).png>)

#### August 22

* When you toggle the customize-scene-link function as a director, some of those items will now be applied to the guests' solo link also. (just the ones I think are relevant)
* [`&sharper`](../advanced-settings/upcoming-parameters/and-sharper.md) and `&sharpen` are now aliases of [`&dpi=2`](../advanced-settings/view-parameters/dpi.md), which should 'up to' double the amount of playback video resolution, if the dynamic resolution optimization is enabled at least, in certain cases. This is a lot like [`&scale=100`](../advanced-settings/view-parameters/scale.md), but perhaps _slightly_ more efficient in some cases. This is mainly for when you intend to have a large screen-shares in a scene, where you don't want the tiny guest videos to be a 100% scale, but 50% scale is fine (up from 25% scale). `&dpi` already exists on production, but by adding these aliases, I hope it's more discoverable.
* As an alternative to `&sharper`, I've also added [`&sharperscreen`](../advanced-settings/upcoming-parameters/and-sharperscreen.md), which sets `&scale=100`, but _only_ for screen-shares. (virtual cameras not included). This is probably even more efficient than `&scale=100` or `&sharper`, and it's designed for when screen-sharing a lot of text. Text looks a bit soft when streaming video at 1:1 pixel resolution.\
  It's recommended to only use these parameters within the context of a scene link, and not on guest links, due to the higher CPU / bandwidth it may use.
* Chunked mode on alpha lets you switch cameras/audio now, without them breaking; muting video still breaks things tho. (chunked mode remains a WIP) \*\* changes push to alpha
* Put up a YouTube video (second in a series so far) where I am investigating the performance of a cellular bonding device and its software, specifically as it relates to VDO.Ninja uses. If on a bad connection, doing remote streaming, or just want some added stream reliability, cellular-bonding seems worth considering. [https://www.youtube.com/watch?v=-BNpoWhzKHw](https://www.youtube.com/watch?v=-BNpoWhzKHw)

#### August 17

* Added the option to customize the [`&grid`](../advanced-settings/design-parameters/grid.md) (`&ruler`/`&thirds`) effect by passing an image link. (can help center guests)\
  \-- transparent PNG or an SVG file are the recommended options.\
  \-- it will stretch to cover the camera preview-area, so probably best to keep things 16:9 aspect if needed.\
  \-- URL can be URL-encoded, for more complex URLs. Simple URLs might work without.\
  \-- technically this can be used as an overlay for other things, but it only works with the self-preview.\
  \-- leave the passed value empty if you wish to have the white basic rule-of-thirds show as default.\
  example: `https://vdo.ninja/alpha/?thirds=./media/thirdshead.svg`\
  ``\*\* on alpha.\
  ![](<../.gitbook/assets/image (7) (1).png>)
* Added [`proxy.vdo.ninja/alpha/`](https://proxy.vdo.ninja/alpha/) as an alternative to `vdo.ninja/?proxy`. If's a more user-friendly version of [`&proxy`](../newly-added-parameters/and-proxy.md). \*\* Just on alpha for now

#### August 16

* ``[`&activespeaker=3`](../advanced-settings/view-parameters/activespeaker.md) and `4` added; which are the same as `1` and `2`, except it will not switch to show audio-only sources (just video only). As a recap, active speaker mode shows the person(s) who are actively speaking, and hides those who aren't.
* Fixed a bug/race condition in Chrome where the web-audio audio effects pipeline and having to 'click-to-play' didn't always unmute all the audio. (`&activespeaker` mode when viewed as a scene, in chrome, for example. Wasn't an issue in OBS)
* Changed chunked mode a small bit, so the video stream uses the same frame rate and resolution of the original video source, rather than a fixed resolution/frame rate.
* Chunked mode should work with audio-only or video-only tracks now
* Solo links are setup to use [`&solo`](../advanced-settings/upcoming-parameters/and-solo.md) instead of `&scene` now; it's the same outcome, except `&solo` tells the system not to apply custom 'layouts' to them. Links updates in the director's room and the mixer app.\
  \*\* changes on the alpha version of VDO.Ninja at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)
* Added details on how to fix camera permissions denied, improving the messaging with an image and doc link. \* on alpha\
  ![](<../.gitbook/assets/image (1) (7).png>)

#### August 11

* Right clicking the screen-share icon will give you an option to open the screen share in a new tab, all pre-configuerd. Useful if you want to share multiple windows while in a group room, or don't want to see your own screen share while talking to others.\
  ![](<../.gitbook/assets/image (3) (3).png>)
* Bugs with [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) have been resolved, I think. (this mode supports desktop-audio capture without echo issues)

#### August 9

* ``[`&aspectratio`](../advanced-settings/upcoming-parameters/and-aspectratio.md) now works with screen shares, so you can force crop an incoming screen share to be a certain aspect ratio. If [`&screenshareaspectratio`](../advanced-settings/upcoming-parameters/and-screenshareaspectratio.md) is used, (`&ssar`), it will apply to just screen shares. If `&ssar` does not have a value passed, it's assumed to be set as "default", which overrides `&aspectratio` option, if used also. \*\* on alpha, ie: vdo.ninja/alpha/?ar=2.0

#### August 6

* The API / IFRAME sandbox page for developer using VDO.Ninja got a style update and facelift by @Sam MacKinnon Ty,\
  \* it's on alpha at [https://vdo.ninja/alpha/iframe](https://vdo.ninja/alpha/iframe) and GitHub.\
  ![](<../.gitbook/assets/image (6).png>)

#### August 5

* When the director talks to you in solo-talk mode, the other guests in the room now drop to 25% volume. This way the guest the director is talking to can hear the director more clearly. (by request) \* on alpha, [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### August 3

* ``[`&hidecodirectors`](../advanced-settings/upcoming-parameters/and-hidecodirectors.md) will hide the co-directors from appearing in the director's room. You might have a few co-directors join you, but they might be taking up space, so this is a way to prevent that. It simply hides the boxes; they are still there at a code level.
* Added [https://updates.vdo.ninja/](https://updates.vdo.ninja/), which will mirror the updates from this discord 📑│updates channel, which should be helpful for those not using Discord to see development progress. (basic, but will undergo more updates). The Discord in general has been undergoing improvements; the mods here have been working hard to keep the discord and documentation functional, so thank you to them.
* Added [`&mobile`](../advanced-settings/upcoming-parameters/and-mobile.md) and [`&notmobile`](../advanced-settings/upcoming-parameters/and-notmobile.md) as a couple options to vdo.ninja/alpha/ I already have [`&flagship`](../advanced-settings/upcoming-parameters/and-flagship.md), [`&noscale`](../newly-added-parameters/and-noscale.md), and [`&forceios`](../advanced-settings/mobile-parameters/and-forceios.md) as a few options to configure mobile devices, but mobile/notmobile are more generic options that will optimize a guest/push link based on whether VDO.Ninja thinks they are a smartphone or not. `&mobile` might help reduce CPU issues, and `&notmobile` might be able to improve video quality (in case you want to override the automatic defaults, which already detects if a device is mobile or not).

#### August 1

* Chat messages that contain URLs will now have those URLs be clickable (opens into a new window)\
  ![](<../.gitbook/assets/image (1) (1) (2).png>)
* The pop-out chat feature has had a bug fixed and minor polish applied
* When using the IFrame API to control bitrates, I have added an optional called "lock" that lets you affix the bitrate you set so the rest of VDO.Ninja doesn't try to constantly override it. `{bitrate: 2500, lock:true}` for example. I also assume `lock=true` by default, so no changes are needed really to start benefiting from this. (previously you had to disable the auto-mixer to lock a bitrate).
* Also added `{manualBitrate: xxx}` to the IFrame API , which is a bit like `bitrate`, but keeps track of what the current target bitrate should be. When you set `manualBitrate=false`, it will apply the expected target value. Also, it won't work when used in conjunction with custom audio bitrates, whereas bitrate will.
* There's a third new bitrate option, which is `targetBitrate`, which lets the automixer keep doing its thing, but it sets a new max target bitrate. The target bitrate will still be applied when set, but the automixer may lower it if needed when it decides to, but it's the new target for 'unlocked' max speed. Some browser will ignore it though, if it's set higher than the bitrate that was manually set the via URL, so it's probably something you don't want to use along with `&bitrate`.

#### July 27

* Fixed the new OBS [`&remote=xx`](../general-settings/remote.md) not working correctly when a password was set (on alpha and GitHub)

#### July 24

* Fixed a bug where if the director is highlighted, newly loaded scenes would be blank.
* Added two-way solo talk as an option to the http/wss VDO.Ninja API.
* Also, - added the ability for VDO.Ninja to _**Remotely Control OBS Studio**_ while streaming/directing; useful for IRL maybe?\
  \-- The menu button to control OBS auto-shows in the director's view or push-mode, if OBS Studio is set to give VDO.Ninja "full" permissions.\
  \-- The menu button can also be added manually, for even guests, using [`&controlobs`](../advanced-settings/upcoming-parameters/and-obs.md)``\
  ``-- [`&obsoff`](../advanced-settings/design-parameters/and-obsoff.md) can be used to set permissions to fully off (also disables tally light and scene optimizations tho) when added to the OBS browser source link.\
  \-- The OBS instance still needs [`&remote={optional-passcode-here}`](../general-settings/remote.md) added to the URL for remote commands to work. If \&remote is left blank, it gives anyone permissions to control it. If a value is passed to `&remote`, the sender needs to have a matching \&remote value or manually enter they need to manually enter passcode in the pop up control menu.\
  \-- If the OBS browser source has its permissions set to something other than full (lower than level 5), the control menu will still show what info it has -- current scene, recording/streaming state, etc; depending on level. The lower the level, the less info is available to show; can't remotely change anything though.\
  \-- It supports multiple OBS instances and will label them according to the [`&label=xxx`](../general-settings/label.md) value set on the scene/view link, or whatever the unique connection ID is.\
  \
  All this is on alpha, at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)\
  ![](<../.gitbook/assets/image (2) (1) (4).png>)![](<../.gitbook/assets/image (3).png>)

#### July 23

* The [`&webp`](../advanced-settings/view-parameters/webp.md) mode has been modified a bit. Main change is that you now enable it by add `&webp` to the sender's URL, and [`&codec=webp`](../advanced-settings/view-parameters/codec.md) to the viewer's URL (otherwise, it falls back to normal video mode). No need for \&broadcast anymore. (as a reminder, this mode sends the video as a series of low-quality images, rather than a more efficient video stream).
* I've removed the toggle in the director's room for this `&webp` feature, as [`&chunked`](../newly-added-parameters/and-chunked.md) mode is replacing its purpose there, but you might still want to use this mode when the viewer-side does not support video playback or hardware acceleration. Specifically, this option lets you bring motion images (aka, crude video) into the Streamlabs mobile app, as a browser source, where other forms of video decoding is not supported.
* I've also created a new viewer-side option called [`&slideshow`](../advanced-settings/upcoming-parameters/and-slideshow.md) . This option decodes incoming video (first video to load), but plays them back as series of full-window images. That is, a single image element, that gets updated 24 times a second, instead of playing the video back within an efficient video element. I have no idea why you might want this option, as it pretty crude up and uses up a lot of CPU, but you can right-click to save a single frame from the video to disk, as a PNG file. This might be useful if you need to take a lot of snap shots of some video and don't want to have to hassle with cropping a window-grab. Quality of the images is pretty high; near lossless.\
  \*\* on alpha\
  ![](<../.gitbook/assets/image (5).png>)

#### July 21

* The [`&grid`](../advanced-settings/design-parameters/grid.md) overlay option now works in non-room mode
* Added the toggles for `&grid` and [`&avatar`](../advanced-settings/upcoming-parameters/and-avatar.md) to the director's link customization section.
* Added [`&smallshare`](../advanced-settings/upcoming-parameters/and-smallshare.md) as a new option, which makes the screen share behave like a webcam share. ie: not larger in size vs other windows, for the publisher or the viewers. This is a push-side parameter. This is useful if a VR guests screen sharing an app of themselves, versus using a virtual camera. It can also be useful for gaming, where a larger screen share might bog down the system of the sender more than needed.\
  \*\*\* on alpha at vdo.ninja/alpha/

#### July 20

* Updated the local audio controls to have a NOISE GATE option.\
  \-- This is a new noise gate, that lowers your mic volume to 10% of its current value based on volume-level activity. If you haven't made a significant sound in few seconds, the noise gate kicks in, and will re-enable when a significant noise is detected. It will take about 300-ms for the volume to recover once the noise triggers it back on, which can be a small bit harsh/distracting at times.\
  \-- [`&noisegate`](../source-settings/noisegate.md) or `&noisegate=1` (`&gating`/`&ng`) will enable it by default (if using it in a room, currently); and `&noisegate=0` will hide the option from the menu.\
  \-- The older existing `&noisegate=1` option I moved to `&noisegate=4`, as this new version is replacing it. I'm keeping the older version around as an option though.\
  ![](<../.gitbook/assets/image (7).png>)
* Fixed some of the labels for the local audio labels; camel-case is replaced with words, and true/false replaced with on/off.
*   Fixed an issue where iPhones's video output would freeze when the director would feature-highlight any other participant.

    \*\* on alpha at vdo.ninja/alpha

#### July 19

* Added the ability to "tap to focus" when a camera supports focusing. You'll want to switch the camera over to manual focus (via settings->video->focusMode) before it will be active, but then you can just touch on the screen to have it auto-focus on that spot. Note: It's a bit slow and not 100% accurate and may conflict with the zoom, if used. **on alpha at vdo.ninja/alpha**
* Improved the advanced video settings; focus, exposure, white-balance. The auto and manual modes are now a checkbox, and I worked out a few of the odd behaviour issues that Chrome + Logitech webcams were having when try to set modes/values. \*\*\* on alpha at vdo.ninja/alpha\
  ![](<../.gitbook/assets/image (2) (1).png>)
