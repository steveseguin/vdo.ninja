# Updates - VDO.Ninja

* [upcoming-parameters](../advanced-settings/upcoming-parameters/ "mention")

{% hint style="danger" %}
A general notice to users, on beta and alpha, the echo cancellation isn't working at the moment. It is working on the main production version however.\
If using vdo.ninja/beta/ or vdo.ninja/alpha/, switch to just vdo.ninja/ if having echo problems or wear headphones at low volume.\
I'm working on a fix, but I don't have an ETA. Will update when fixed.
{% endhint %}

#### **September 6** <a href="#august-31" id="august-31"></a>

* `&showconnections` will display the total number of p2p connections of a remote stream. Works with the director's room and the automixer. Might help give comfort over privacy/security during a stream.
* Total number of p2p remote connections (viewers) of a stream source will also appear in the stats menu, even without `&showconnections`. Could be useful for debugging CPU/bandwidth issues.
* Connections may represent video/audio streams, or just a data-connection. Meshcast-hosted streams might not be accounted for, depending on how the viewer is connecting.\
  ![](../.gitbook/assets/image.png)
* Added `showChat` and `showDirectorChat` as HTTP/WSS API options for sending messages to guest(s). Useful if you want to hotkey a streamdeck command with some welcome message for guests.
* Added events notifications relating to the director's guest-mute, guest-video-mute, and guest-position-change actions, along with any remote-video-mute updates to the HTTP/WSS API (by request for the bitfocus companion app)\
  \*\* on alpha

#### **September 2** <a href="#august-31" id="august-31"></a>

* [Noise gate](../source-settings/noisegate.md) remote control has been tweaked a bit; the correct state is loaded now on a director's page refresh
* Added an option to control the [compressor](../source-settings/and-compressor.md) remotely (3 states for the compressor; Off/On/Limiter)\
  ![](<../.gitbook/assets/image (3) (1).png>)
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
  ![](<../.gitbook/assets/image (7).png>)
* Added [`proxy.vdo.ninja/alpha/`](https://proxy.vdo.ninja/alpha/) as an alternative to `vdo.ninja/?proxy`. If's a more user-friendly version of [`&proxy`](../newly-added-parameters/and-proxy.md). \*\* Just on alpha for now

#### August 16

* ``[`&activespeaker=3`](../advanced-settings/view-parameters/activespeaker.md) and `4` added; which are the same as `1` and `2`, except it will not switch to show audio-only sources (just video only). As a recap, active speaker mode shows the person(s) who are actively speaking, and hides those who aren't.
* Fixed a bug/race condition in Chrome where the web-audio audio effects pipeline and having to 'click-to-play' didn't always unmute all the audio. (`&activespeaker` mode when viewed as a scene, in chrome, for example. Wasn't an issue in OBS)
* Changed chunked mode a small bit, so the video stream uses the same frame rate and resolution of the original video source, rather than a fixed resolution/frame rate.
* Chunked mode should work with audio-only or video-only tracks now
* Solo links are setup to use [`&solo`](../advanced-settings/upcoming-parameters/and-solo.md) instead of `&scene` now; it's the same outcome, except `&solo` tells the system not to apply custom 'layouts' to them. Links updates in the director's room and the mixer app.\
  \*\* changes on the alpha version of VDO.Ninja at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)
* Added details on how to fix camera permissions denied, improving the messaging with an image and doc link. \* on alpha\
  ![](<../.gitbook/assets/image (1).png>)

#### August 11

* Right clicking the screen-share icon will give you an option to open the screen share in a new tab, all pre-configuerd. Useful if you want to share multiple windows while in a group room, or don't want to see your own screen share while talking to others.\
  ![](<../.gitbook/assets/image (3).png>)
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
  ![](<../.gitbook/assets/image (1) (1).png>)
* The pop-out chat feature has had a bug fixed and minor polish applied
* When using the IFrame API to control bitrates, I have added an optional called "lock" that lets you affix the bitrate you set so the rest of VDO.Ninja doesn't try to constantly override it. `{bitrate: 2500, lock:true}` for example. I also assume `lock=true` by default, so no changes are needed really to start benefiting from this. (previously you had to disable the auto-mixer to lock a bitrate).
* Also added `{manualBitrate: xxx}` to the IFrame API , which is a bit like `bitrate`, but keeps track of what the current target bitrate should be. When you set `manualBitrate=false`, it will apply the expected target value. Also, it won't work when used in conjunction with custom audio bitrates, whereas bitrate will.
* There's a third new bitrate option, which is `targetBitrate`, which lets the automixer keep doing its thing, but it sets a new max target bitrate. The target bitrate will still be applied when set, but the automixer may lower it if needed when it decides to, but it's the new target for 'unlocked' max speed. Some browser will ignore it though, if it's set higher than the bitrate that was manually set the via URL, so it's probably something you don't want to use along with `&bitrate`.
