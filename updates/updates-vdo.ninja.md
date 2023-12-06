# Updates - VDO.Ninja

#### December 6 <a href="#august-31" id="august-31"></a>

* If using `&ptt` alone, without a value, it will prompt the user for a hotkey on load\
  ![](<../.gitbook/assets/image (220).png>)
  * on alpha at - `https://vdo.ninja/alpha/?ptt`\


#### December 4 <a href="#august-31" id="august-31"></a>

* Added Server-Side-Events support to the VDO.Ninja API
  * You can listen for push-notifications essentially, without needing to use Websockets.
  * It's listen-only, but its easy to use, versus Websockets, which already can do all of this, but with more code.
  * Background: VDO.Ninja clients send some basic events out when using the [`&api`](../general-settings/api.md) option, including connection and stream ID details, allowing a developer to write their own application layers to know when someone has joined a link, etc.
  * More info: [https://github.com/steveseguin/Companion-Ninja/tree/main#server-side-events](https://github.com/steveseguin/Companion-Ninja/tree/main#server-side-events)

#### December 3 <a href="#august-31" id="august-31"></a>

* `&ptt=ctrl+alt+m` added as an option to set the push-to-talk hotkey.
  * The ctrl/meta/alt keys need to be specified first, then a normal key.
  * The default is `CTRL + ALT + M` if just `&ptt` is set, but no value passed.
* `api.vdo.ninja/xxxx/tallylight/1` set the tally light; 0,1,2, or 3 , depending on off, live, standby, and active.
  * Uses the same style for the tally light as the OBS state tally light system.
  * Until initially triggered, the existing tally light will use the OBS state for the tally; [`&obsoff`](../advanced-settings/design-parameters/and-obsoff.md) I think can disable that tho.

\*\* changes on alpha

#### December 2 <a href="#august-31" id="august-31"></a>

* Made some improvements for iOS video recording in **VDO.Ninja** - shouldn't crash after 15-minutes anymore, assuming on iOS +16.\
  \*\* on alpha (more improvements coming for it tho)
* Updated the self-hosted VDO.Ninja handshakeserver code for VDO.Ninja with some minor optimizations
* Completed a couple nights of dev ops systems maintenance work

#### November 20 <a href="#august-31" id="august-31"></a>

* Added `&forcecontrols` as a URL option to VDO.Ninja.
  * It's experimental, but it will try to keep the video controls visible, even if your mouse isn't hovering over the video.
  * The VDO.Ninja tab/window still needs to be 'active' however, for this to work; changing focus to another tab will stop it.
  * Only works really for chrome/chromium on desktop; not Firefox, etc.
  * On [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### November 9 <a href="#august-31" id="august-31"></a>

* The [director](../viewers-settings/director.md), when setup as a guest, now has the audio/video buttons available to them in the same place it would be for guests. It opens up the side pane though, but hopefully this makes things more intuitive when using.\
  ![](<../.gitbook/assets/image (213).png>)\
  \*\* on alpha

#### November 8 <a href="#august-31" id="august-31"></a>

*   Loading up the camera should be faster in most cases now, especially on mobile browsers when selecting the non-default camera.

    * For example, loading the rear camera on an Android device should be under 1-second now, rather than 1 to 5-seconds.
    * Things will still be slow if needing to request camera or mic permissions, or if using an older browser.
    * Browsers have matured in the last three years since I previously wrote this logic, so I'm presuming issues of the past aren't present anymore.
    * Please test it though and report any issues to me of course - I think everything should be _more_ stable now, but you never know.

    \*\* changes on vdo.ninja/alpha/, as well, all the recent code updates (v24.2 beta) are on Github too.
* Fixed an issue where if you were recording a [`&chunked`](../newly-added-parameters/and-chunked.md) stream remotely, and then refreshed the page accidentally, the video file often wouldn't close in time and the file would be lost. The new code now will do a faster emergency file close on a page reload, avoiding this issue; the non-chunked recording option already did this e-stop option.
* The chunked file recording now supports AV1 video codec; before it was limited to VP9. (AV1 is the new default chunked mode atm)
* The audio-level meter now works when at the preview-screen, even if [`&audiogain=0`](../advanced-settings/audio-parameters/and-audiogain.md) has the microphone muted. (I essentially just apply the custom gain only after the user hits "start" now, rather than immediately)\
  ![](<../.gitbook/assets/image (212).png>)

\*\* changes on alpha

#### November 5 <a href="#august-31" id="august-31"></a>

*   `ALT + A` as a hotkey will toggle the speaker-output audio mute on/off.

    * This is only usable when the browser tab is in focus
    * If you have conflicts with this option, please let me know and I'll change it up

    <div align="left">

    <figure><img src="../.gitbook/assets/image (211).png" alt=""><figcaption></figcaption></figure>

    </div>

    \*\* on alpha for test; [vdo.ninja/alpha/](https://vdo.ninja/alpha/)
*   I put together a code example of how to use the IFrame API of VDO.Ninja to remotely control OBS; so you don't need to use the built-in controller menu, but you can make your own and integrate it into your own web apps.

    * [https://vdo.ninja/alpha/examples/obsremote](https://vdo.ninja/alpha/examples/obsremote)
    * I have an older OBS remote example, using WebSockets, but that's a bit depreciated at the moment.
    * The page gives you a link to put into OBS, and assuming you did it right, you'll see your OBS scenes appear as buttons.
    * This sample uses a newly added IFrame API end point in VDO.Ninja, designed for controlling OBS; it's on only alpha currently, so this sample only works on alpha atm. You could technically make your own OBS controller however instead, and just use VDO.Ninja to relay generic messages; that's how social stream does it, for example.

    <figure><img src="../.gitbook/assets/image (209).png" alt=""><figcaption></figcaption></figure>

#### November 4 <a href="#august-31" id="august-31"></a>

*   When using the [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) option as a [director](../viewers-settings/director.md), the room settings will include a new slider to let you dynamically change that value.

    * This lets the director set a maximum total bandwidth outbound from them to the guests; useful if you set the total room bitrate to something high. Combined, you can ensure the guests as high quality as possible from you, without causing your OBS RTMP output or whatever to get smashed.
    * When using the [Mixer App](../steves-helper-apps/mixer-app.md) (vdo.ninja/alpha/mixer), the [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) value was set to 350-kbps before, but now I have it set to 1500-kbps. Guests in the Mixer App should as a result now see the director's broadcast output in 3x higher quality now, for better or worse.
    * I may adjust the default value in the mixer based on user issue reports.
    * The slider doesn't appear if not using the [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) value in the URL (or if not using the Mixer App). It's just too confusing to explain to include it by default.

    <div align="left">

    <figure><img src="../.gitbook/assets/image (9).png" alt="" width="375"><figcaption></figcaption></figure>

    </div>

    \*\* change on alpha
*   Fixed [`&webp`](../advanced-settings/view-parameters/webp.md) + [`&codec=webp`](../advanced-settings/view-parameters/codec.md#webp) + `&alpha` so it properly supports alpha channels. Still a hacky mess, but if your needs are modest it can offer transparent streaming video when using [`&fileshare`](../source-settings/and-fileshare.md) /w a transparent WebM video source (or a virtual background /w a transparent png)\
    ![](<../.gitbook/assets/image (7).png>)\


    Update -- well, it does work with virtual transparent backgrounds\
    ![](<../.gitbook/assets/image (8).png>)\
    \
    \*\* the alpha patch is on alpha

#### November 3 <a href="#august-31" id="august-31"></a>

* Improved [`&chunked`](../newly-added-parameters/and-chunked.md) mode when used with the [file-sharing](../source-settings/and-fileshare.md) method.
  * I have AV1 used by default now (instead of vp9) if I detect it available
  * 44.1-kHz audio and 1:1 resolution (TikTok/Twitter) videos now should work
  * [https://vdo.ninja/alpha/?chunked\&fileshare](https://vdo.ninja/alpha/?chunked\&fileshare)

#### November 1 <a href="#august-31" id="august-31"></a>

* Dropbox support improved on vdo.ninja/alpha/, so that it works properly now, and will recover from a crashed browser once the guest re-opens their browser. Still no UI for this feature, so it's a WIP still.
* Added an API hotkey option to toggle a remote guest's camera on/off.
* Fixed a bug where if the director used the remote-record option on a guest's screen-share, it would instead record the guest's camera; not the screen share.
* Improved the messaging of the two record options (local/remote); should be easier to understand what each does and the advantages.
* Added some URL parameters to VDO.Ninja that let you manually pre-set some basic camera settings:\
  \- `&whitebalance` (`&wb`)\
  \- `&exposure`\
  \- `&saturation`\
  \- `&sharpness`\
  \- `&contrast`\
  \- `&brightness`\
  \
  \-- `&whitebalance` is in Kelvin I think, so `5000` or `6500` are typical values it will take.\
  \-- The rest normally will take an integer value in the range of `1` to `255`, at least for a Logitech webcam.\
  \-- I already currently auto-save camera settings for android devices that support video settings, but for desktop browsers, I am not. Using these new values though you can manually set things to auto-configure as you want.\
  \-- These settings will apply to ALL video devices though, not just a specific one.\
  \-- If a setting isn't supported by your camera or browser, it will just fail quietly, and not apply. You'll see an error in the console log though.\
  \-- You can check the video settings menu as to whether a device supports a certain feature or what value; you can also check out [https://vdo.ninja/supports](https://vdo.ninja/supports).

Feedback and bug reports welcomed \*\* Available for testing on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### October 30 <a href="#august-31" id="august-31"></a>

*   There's a new stat for helping tell if you or a remote guest is blocking p2p WebRTC traffic.

    * If blocking p2p, it will still work, but via the relay server. This is far from ideal in most cases.
    * Just changing the browser can often fix this issue if detected

    ![](<../.gitbook/assets/image (4) (1).png>)![](<../.gitbook/assets/image (3) (1) (1).png>)

\*\* on alpha

#### October 25 <a href="#august-31" id="august-31"></a>

* Added support for something called "end to end encryption" using "insertable streams" to VDO.Ninja. To use, add `&e2ee` to both the viewer and sender side links. Can be used in conjunction with [`&password`](../general-settings/password.md) to specify a cipher.\
  \
  More technical details about it:\
  \-- VDO.Ninja is already end to end encrypted by default (in peer to peer mode), so this isn't anything of much value to most users.\
  \-- In p2p mode, this will double up the encryption on the video/audio stream, which might be useful if your system was compromised by a state actor.\
  \-- Uses the browser's built-in AES algo, but there is dedicated js file for the encryption logic, so you can custom-code to use your own encryption I guess\
  \-- Does NOT work with [Meshcast](../newly-added-parameters/and-meshcast.md), as I don't have insertable streams working server-side there yet, so there is no E2EE with Meshcast still\
  \-- It can be used with compatible WHIP/WHEP services, but most WHIP/WHEP services won't support insertable streams. Still, some do, and that's probably the main reason why I bothered to add this all in.\
  \-- The default crypto key used will be hard coded, public, and not secure, but if you provide a [`&password`](../general-settings/password.md) it will use that as the secure cipher phrase instead.\
  \-- The encoder and decoder algo will fail-safely, rather than fail-securely; I can change this if needed, but it allows for broader peer compatibility and user friendliness. I have more work to do on visually indicating the state of this all, and to allow for more customization, but I'll wait on that until there is more feedback I guess.\
  \-- Not all browsers support this, so in those cases, it may fail safely, if possible; otherwise it will just fail completely.

\*\* on alpha for testing at vdo.ninja/alpha/

#### October 23 <a href="#august-31" id="august-31"></a>

* I've made the [`&css`](../advanced-settings/design-parameters/css.md) parameter within VDO.Ninja more tolerant to invalid forms of input, so if you don't know what URL or Base64 encoding is, you might be able to get away without using any now.\
  [`https://vdo.ninja/alpha/?css=body{background-color:blue!important}`](https://vdo.ninja/alpha/?css=body{background-color:blue!important})

#### October 22 <a href="#august-31" id="august-31"></a>

* Re-wrote much of the the `Browser-to-RTMP` docker project, so it uses Chromium instead of Firefox now.
  * Seems to fix audio/video sync issues.
  * Tested support on Ubuntu x64 (cloud server) and Ubuntu Arm64 (orange pi).
  * useful if you want a headless or cloud-hosted way of streaming VDO.Ninja to YouTube/Kick/Mp4, without needing OBS Studio.

[https://github.com/steveseguin/browser-to-rtmp-docker](https://github.com/steveseguin/browser-to-rtmp-docker)

#### October 21 <a href="#august-31" id="august-31"></a>

* Added a work around for a chrome bug impacting some Androids where their video preview would sometimes freeze on initial camera loading, requiring a refresh.
  * If curious, the fix just better detects that a player error occurred, and then just retries loading it again a second later, fixing itself.
  * Pushed the change to production ([https://vdo.ninja/](https://vdo.ninja/)) as a hot patch, but the change is also on alpha and GitHub now.

#### October 20 <a href="#august-31" id="august-31"></a>

* 7.1 surround sound audio is being supported now, in a technical sense, although really only if the source is a server stream. To use, add [`&stereo=8`](../general-settings/stereo.md) on the viewer end. (5.1 multi channel was around supported with [`&stereo=4`](../general-settings/stereo.md) I think)
* Fixed an issue with stereo sound not working on the WHEP viewer.
* Fixed an issue with the WHEP player stats not showing correctly.
* Fixed an issue where [`&buffer`](../advanced-settings/view-parameters/buffer.md) wasn't working with the WHEP player.
* Made it a bit easier to setup the WHEP player as a basic viewer page; hiding menus that probably aren't commonly needed.
* `&svc` is a new option, which is useful for publishing to WHIP broadcast servers that support scalable video modes. -- Takes an SVC value, with `L1T3` being the most universal option, but other options exist. You'll get an error when publishing if you use an invalid one.\
  ![](<../.gitbook/assets/image (194).png>)
* Improved the [`vdo.ninja/alpha/whip`](https://vdo.ninja/alpha/whip) page and added SVC scalable options to the WHIP output option there, making it easy to select a compatible SVC mode if desired.

#### October 19 <a href="#august-31" id="august-31"></a>

* Added `&recordmotion` as an option, which takes a video snapshot and saves it to disk as a PNG file whenever there is motion detected in a video.\
  \-- Auto saves (to download folder) one photo per second, max.\
  \-- It can take values, such as `&recordmotion=15`, which will control the sensitivity of the motion capture\
  \-- It's primarily designed for the sender-side, but I think it should work if a viewer also\
  \-- I don't think this will work within OBS, so Chrome/Chromium is recommended instead\
  \-- I guess the point of this is to allow for basic security camera operation, but also as a source of inspiration for other ideas\
  \-- File name of the saved file contains the timestamp\
  \
  \*\* on alpha at [https://vdo.ninja/alpha/?recordmotion\&webcam](https://vdo.ninja/alpha/?recordmotion\&webcam)

#### October 16 <a href="#august-31" id="august-31"></a>

* Added a new experimental option called `&retransmit`; it will relay the incoming '[chunked](../newly-added-parameters/and-chunked.md)' media stream to others connected to you, without transcoding. In a way, this enables a form of peer to peer to peer broadcasting.\
  \
  \-- It only works with incoming [`&chunked`](../newly-added-parameters/and-chunked.md) data streams, however trying to forward more than one chunked stream will break things currently.\
  \-- It will disable your own mic/camera from being streamed; when `&retransmit` is used it configures itself as a viewer in a sense.\
  \-- Chunked mode has a default play out buffer delay of about 1-second still, but that buffer time does not get passed down to the relayed viewer. There is still some transmission delay that gets introduced though, but it can be very low latency on a series of good computers/network. example p2p2p setup:

```
https://vdo.ninja/alpha/?chunked&push=PUBLISHER123   // this is the source. Notice they are publishing in chunked mode
https://vdo.ninja/alpha/?view=PUBLISHER123&retransmit&push=RESTREAMER123   // this person is both viewing the video, but also relaying
https://vdo.ninja/alpha/?view=RESTREAMER123   // this person is viewing the stream from the relayed chunked stream; p2p2p. They don't know they are getting a relayed stream.
```

This feature is just for fun at the moment. It's does not do automatic p2p2p broadcasting, as you still need to manually customize who sees what, and chunked mode isn't compatible with all browsers/devices yet. It's on alpha at the time being (vdo.ninja/alpha/).

* Completed some needed server maintenance/upgrades @ \~2:20am est

#### October 15 <a href="#august-31" id="august-31"></a>

* I actually think I might have figured out a software solution to the previously mentioned issue, re: high sample rates, and so I just pushed a patch into production. If you notice any brand new issues with audio though, such as extremely clicking, let me know of course. Thanks!

#### October 14 <a href="#august-31" id="august-31"></a>

*   I now include a trouble solving tip for users with extremely high audio sample rates set, which is the cause for some microphones not to work.

    <div align="left">

    <figure><img src="../.gitbook/assets/image (188).png" alt="" width="331"><figcaption></figcaption></figure>

    </div>
* Added `&nodirectorvideo` and `&nodirectoraudio` to VDO.Ninja; these are just like [`&novideo`](../advanced-settings/video-parameters/novideo-1.md) and [`&noaudio`](../advanced-settings/view-parameters/noaudio.md), except they only apply to incoming connections from room directors. So, if your are using the [Mixer App](../steves-helper-apps/mixer-app.md) with OBS, but you want to exclude the audio of yourself from the OBS, this potentially could be an easy way to do that.

\*\* on alpha at vdo.ninja/alpha/

#### October 13 <a href="#august-31" id="august-31"></a>

* I re-wrote the canvas drawing logic (the digital effects code) to make it more performant when a tab is not visible. Some browsers will throttle hidden tabs, and it was causing low frame rates when doing green screen or digital zoom while multitasking. I'd love some testing of it from others, to ensure no bugs slipped in, and also to let me know if it actually helped.
* added some logic to the green screen / virtual background code that tries to lower quality of the effect a bit when low frames are detected, to try to allow slow devices or mobile devices to maintain a better frame rate. If its an issue on mobile, [`&flagship`](../advanced-settings/upcoming-parameters/and-flagship.md) can disable that code.

\*\* change on alpha ([https://vdo.ninja/alpha/](https://vdo.ninja/alpha/))

#### October 12 <a href="#august-31" id="august-31"></a>

* [`&effectvalue=1.2`](../newly-added-parameters/and-effectvalue.md) will now work with `&zoom` ([`&effects=7`](../source-settings/effects.md#options)), so you can trigger the camera to digitally zoom in on load.
* Fixed a bug where [`&border`](../advanced-settings/design-parameters/and-border.md) was off by about 5%, causing some blank areas to sometimes show.
* The sender's sub-gain audio sliders, while working, didn't update text label value fields correctly when making adjustments; that's fixed now.
* Fixed an issue where some icons were white in dark mode, when they should have been black.

\*\* updates on alpha at vdo.ninja/alpha/

#### October 9 <a href="#august-31" id="august-31"></a>

If you want the VDO.Ninja self-preview to not be mini-sized in broadcast mode, which might be the case on mobile, you can try using [`&minipreview=0`](../source-settings/and-minipreview.md) or `&largepreview`. These flags will disable the mini-preview functionality, keeping the preview the same size as other videos.

\*\* on production (hot patch) and alpha

#### October 7 <a href="#august-31" id="august-31"></a>

* `&nocclabels` added to VDO.Ninja. This disables showing the names when using the [`&closedcaptions`](../advanced-settings/settings-parameters/and-closedcaptions.md) feature, as you might want to only show labels on the video themselves, and not in the transcription text.\
  \*\*available for testing at vdo.ninja/alpha/

#### October 6 <a href="#august-31" id="august-31"></a>

* Pushed a hotfix for VDO.Ninja related to [`&deafen`](../general-settings/deafen.md) not working with [`&meshcast`](../newly-added-parameters/and-meshcast.md) or WHEP-in incoming audio sources.\
  \*\* change on production as a hotfix and on alpha.

#### September 27 <a href="#august-31" id="august-31"></a>

* [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) can now take two values; the second of which gets used if the device is a 'mobile' device, while the first gets used otherwise. ie: `&totalroombitrate=1000,500`\
  \-- useful if you don't know if the guest is going to join via Desktop or via Smartphone, and you wish to avoid overloading a mobile device.\
  \*\*on alpha and GitHub
* [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) also now has the option for two bitrates; desktop,mobile, just like with [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md).
*   The "queue" mode, when applied only to the guest-link, has been extended with new options. These modes do not apply when you have [`&queue`](../general-settings/queue.md) also on the director's link, however, rather just when added to the guest-invite link only.

    \
    These options might be appealing for screening guests when either you don't want to use a transfer room or don't expect too many guests to be in queue.\
    \-- I changed [`&queue`](../general-settings/queue.md) to not allow the guest to see the director's video, until the director activates the guest with their pink activate-guest button. Otherwise, it's the same as before.\
    \-- [`&screen`](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md) now replaces the way [`&queue`](../general-settings/queue.md) worked before, where the guest can see/hear the director, but not other guests, until activated.\
    \-- [`&screen`](../advanced-settings/guest-queuing-parameters/and-screen-alpha.md) is given the alias `&queue2`, intending to imply you can use this mode to screen incoming guests by talking to them, before approving them.\
    \-- [`&hold`](../advanced-settings/guest-queuing-parameters/and-hold-alpha.md) added, with the alias `&queue3`, which is like [`&queue`](../general-settings/queue.md), except the guest gets a message telling them they need to wait until approved by the director. They don't see the director until activated, and the director doesn't see the guest's video/audio either - just their control box with any label. Once activated, the director will see the guest's video/audio, and vice versa.\
    \-- [`&holdwithvideo`](../advanced-settings/guest-queuing-parameters/and-holdwithvideo-alpha.md) added, with the alias `&queue4`, which is just like [`&hold`](../advanced-settings/guest-queuing-parameters/and-hold-alpha.md), except the director does see the guest's video and audio before the guest is activated. The guest can't see the director until activated, but does get a message telling them they are waiting to be activated.\
    \-- In any of the cases mentioned above, transferring the guest to another room will also automatically activate the guest. You don't need to press the pink 'activate' button if you just intend to transfer them and don't want to talk to the guest you are screening.

\*\* on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### September 25 <a href="#august-31" id="august-31"></a>

* Updated [`&structure`](../advanced-settings/design-parameters/and-structure.md) to work with [`&cover`](../advanced-settings/view-parameters/cover.md), allowing for some more flexibility with controlling fixed aspect-ratios from the viewer/scene side.\
  ie: `https://vdo.ninja/alpha/?room=XXXXX&scene&cover&structure&square&fakeguests=10`\
  ![](<../.gitbook/assets/image (3) (1) (1) (1).png>)![](<../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)
* Fixed a couple bugs, such as the local screen share preview not re-appearing after full-windowing another guest's video while screen sharing.

\*\* on alpha

#### September 20 <a href="#august-31" id="august-31"></a>

* Added [`&forceviewerlandscape`](../advanced-settings/mixer-scene-parameters/and-forceviewerlandscape-alpha.md) to VDO.Ninja, which keeps all **incoming** videos oriented (rotated) so that the aspect ratio is always above 1, so effectively, forces landscape mode.\
  \-- ie: [https://vdo.ninja/alpha/?forceviewerlandscape\&view=xxx](https://vdo.ninja/alpha/?forceviewerlandscape\&view=xxx)\
  \-- This normally shouldn't be needed, as the sender side should control the orientation, but the native app seems to auto rotate back to portrait when the phone is locked. Until that is fixed, this can work around the issue I think, by rotating the video when it detects its been rotated.\
  \-- The parameter can take a value, the default is `270`, which is how much the video is rotated. You might want to also use `90`, or in the case you want it to be locked upside down, you can technically pass `180` I guess?\
  \
  \*\* This is on alpha for testing

#### September 15 <a href="#august-31" id="august-31"></a>

* Until I figure out a better way of doing this, I've enabled a way to have a display name be on multiple-lines in VDO.Ninja.

`&label=DisplaNameHere\nSubtitleHere` Note the use of as a line break ie:

```
https://vdo.ninja/alpha/?label=Steve_Seguin\n(he/him)\nhttps://twitch.tv/vdoninja&push=JaAiVEH
https://vdo.ninja/alpha/?view=JaAiVEH&showlabel
```

So it's not super obvious how to do this currently, so I think the next goal will be to add the option to let a guest enter their own sub-title, etc, when joining, using dedicated input fields. But until then, I hope this still helps. You can stylize the sub-label within OBS's CSS section, targeting the following CSS, but please note I'll probably be tweaking the CSS/HTML as well in the future:

```
.video-label>span:nth-child(2) {
    font-size: 50%;
    display: block;
    text-align: center;
}
```

![](<../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1).png>)

\*\* this change is on alpha at [https://vdo.ninja/alpha](https://vdo.ninja/alpha/)

#### September 14 <a href="#august-31" id="august-31"></a>

* A Safari mobile bug related to incoming screen-shares not always loading has been addressed.\
  \-- This Safari bug isn't present in Safari 17, just older versions it seems.\
  \
  \*\* fix is on vdo.ninja/alpha/

#### September 8 <a href="#august-31" id="august-31"></a>

* Version 23 of VDO.Ninja (currently what's on production), has been archived to [https://vdo.ninja/v23/](https://vdo.ninja/v23/), as a fixed version. Version 24 of VDO.Ninja (what's on alpha) will go live at some point soon, so if concerned about bugs, you can lock into v23 now.
* [`&rotatewindow=90`](../advanced-settings/design-parameters/and-rotatewindow.md) (`&rotatepage`) will rotate the contents of the VDO.Ninja window. It doesn't target any specific video, and can be used on the viewer-side, not just the sender.\
  \-- This will be overridden by [`&forcelandscape`](../advanced-settings/mobile-parameters/and-forcelandscape.md) mode, if that is used also.\
  \-- You can pass `90`, `180`, or `270` as a value to the parameter, to rotate accordingly. The default is `90` though, if used without any value.\
  \-- You might still want to use OBS to rotate instead, but if not using OBS and find the teleprompter app too cumbersome, this is a good option.

\*\* this specific change is on production and alpha.\
![](<../.gitbook/assets/image (182).png>)

* Added [`&motiondetection=15`](../advanced-settings/mixer-scene-parameters/and-motiondetection-alpha.md), which does a few things when it detects motion in a video (viewer-side).\
  \-- It will feature highlight the specific video where movement is detected, if more than one video is included in the mix. Using a custom [`&layout`](../advanced-settings/mixer-scene-parameters/and-layout.md) will disable this feature though, and use the layout instead.\
  \-- It will also trigger an IFrame API event, which might be useful if you want to use VDO.Ninja as a security camera; you could script things to auto-record the video or log data events.\
  \-- It will also switch to itself in OBS as a scene, which might be how this will be mainly used. (you need to have the OBS browser source's page permission set to high to allow this to actually work)\
  \-- You can adjust the sensitivity of the motion detection trigger as a value; the default I think is 15, but it can be between 1 and 64 I think.

\*\* on alpha at vdo.ninja/alpha/\
\*\* GitHub also updated with the newest code

#### September 5 <a href="#august-31" id="august-31"></a>

Fixed a few bugs and pushed to alpha (vdo.ninja/alpha). Thank you for reporting the issues.

* The [Mixer App](../steves-helper-apps/mixer-app.md) wouldn't respond to the change-layout API after a director reloaded.
* When the director was in 'scene preview mode', sometimes a muted camera or screen share would not show video.
* the [vdo.ninja/twitch](https://vdo.ninja/twitch) app failed to show the 'add camera' menu if using a custom VDO.Ninja link.

#### September 2 <a href="#august-31" id="august-31"></a>

* The director / co-director will be visible in their own solo-link, even if [`&showdirector`](../viewers-settings/and-showdirector.md) isn't added. They still won't appear in normal [`&scene`](../advanced-settings/view-parameters/scene.md) links, but rather just [`&solo`](../advanced-settings/mixer-scene-parameters/and-solo.md) scene links. This is being done to just simplify the experience.
* Unless using [`&remote`](../general-settings/remote.md) on the OBS browser source link now (with the right browser source permissions), the remote guest/director won't see the "remote control OBS" menu option appear. Before it would appear, but it would fail if you tried to actually do anything beyond just observe the current state, and that's probably not worth confusing users.\
  \-- I should note, OBS Studio v30 beta seems is a bit buggy with the remote control options, but the current OBS v29 works fine.
* If you create a co-director link, via the room settings menu, I'm including the room password in the URL now, along with the co-director password. This just avoids the confusion between what password the co-director needs to enter, which was turning out to be a common point of confusion. Hopefully this avoids that confusion. If you wish to remove the passwords from the URL for a boost to security, you can still do that of course; users will then be prompted to enter the corresponding required password on joining.

\*\* changes on alpha

#### September 1 <a href="#august-31" id="august-31"></a>

* I've tried to make the accessibility (for the vision impaired) a bit easier on the main landing and menu pages, as it was a bit too verbose.\
  \-- Essentially, I disabled a lot of the non-important stuff, including non-visible elements, as seen by accessibility readers. Also added more titles, and improved the ordering of some buttons.
* Played around with some CSS elements here and there; if you get a chance to test alpha, let me know if there are any rendering issues.

\*\* changes on alpha

#### August 28 <a href="#august-31" id="august-31"></a>

* When a user changes an advanced audio or video option (white balance, frame rate, main gain, etc), it will now announce that over the IFrame API.\
  ![](<../.gitbook/assets/image (5) (1) (1) (1).png>)![](<../.gitbook/assets/image (6) (1) (1).png>)
* [vdo.ninja/alpha/](https://vdo.ninja/alpha/) updated with this change, and _**Github**_ has also had all recent changes pushed to it.

#### August 27 <a href="#august-31" id="august-31"></a>

* [`&clock24`](../advanced-settings/settings-parameters/and-clock24-alpha.md) added to VDO.Ninja; this is the same as the existing [`&clock`](../advanced-settings/settings-parameters/and-clock.md) option, (which shows a clock) except it uses 24-hour time for the display (vs am/pm).\
  \-- if the director uses [`&clock24`](../advanced-settings/settings-parameters/and-clock24-alpha.md) on their URL, and then enables the room clock, it will be 24-hour time for all guests, matching the director's settings.\
  ![](<../.gitbook/assets/image (3) (1) (1) (1) (1) (1) (1).png>)

\*\* at [vdo.ninja/alpha/?clock24](https://vdo.ninja/alpha/?clock24)

#### August 26 <a href="#august-31" id="august-31"></a>

* I've updated [vdo.ninja/alpha/](https://vdo.ninja/alpha/) to version "24.0b", to signify a large change to the code base.
* I've merged the Meshcast and WHIP/WHEP features in VDO.Ninja to share about 95% of the same logic, including the URL options. If you want to use Meshcast, you still need to use [`&meshcast`](../newly-added-parameters/and-meshcast.md) instead of [`&whipout`](../advanced-settings/whip-parameters/and-whipout.md), but since Meshcast is essentially a WHIP/WHEP server, I just have Meshcast using the generic WHIP logic now.\
  \-- Below shows what whip-output options now are fully interchangeable with Meshcast options, since they share the same code. (alias of each other)

```
mcscale == woscale, whipoutscale
meshcastbitrate == whipoutvideobitrate, wovb
mcscreensharebitrate == whipoutscreensharebitrate, wossbitrate
mcscreensharecodec == whipoutscreensharecodec, wosscodec
mcaudiobitrate == whipoutaudiobitrate, woab
meshcastcodec == whipoutcodec, woc
```

* A goal for a while has been to allow anyone to drop-in their own Meshcast replacement, using a third-party WHIP/WHEP server/service. That is, publish to a whip-service, and have viewers of the stream get the WHEP-view link, so they can view via WHEP instead of p2p. I've achieved this finally; close enough at least.
* There's a few requirements to make it work though, so either an API wrapper is needed or a set of rules needs to be followed:\
  \-- If your WHIP server returns an exposed "WHEP" field in the POST response header, with the URL to the WHEP view link, it will use that WHEP link. You just need to then specify the [`&whipout`](../advanced-settings/whip-parameters/and-whipout.md) URL on the sender side then.\
  \-- This should let you make your own Meshcast service with minimal work; the open-source WHIP API code I released the other day further makes it pretty easy.
* If using a cloudflare.com WHIP URL on the sender side, I'll guess at the WHEP link - seems to be working so far. (built this logic into VDO.Ninja directly and works automatically). This of course still implies a unique whip URL per guest.

![](<../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

* To make using Cloudflare easier though, I've also created the WHIP end point `cloudflare.vdo.ninja`, which takes a Cloudflare API token, instead of a stream token.\
  \-- This special end point will auto-create a unique WHEP URL. The official cloudflare.com whip endpoint can only be used by one sender at a time, but this API special endpoint and token approach can be used by many senders at a time. It automatically generates unique WHIP/WHEP when used, in the same way Meshcast does, so no need for unique invite urls per guest.\
  \-- I've created a page to generate the required special api token; the page also provides further information on this all: [https://vdo.ninja/alpha/cloudflare](https://vdo.ninja/alpha/cloudflare)\
  \-- [`&cftoken`](../advanced-settings/whip-parameters/and-cftoken-alpha.md) (`&cft`) is also now added to vdo.ninja/alpha/; this parameter accepts the special token without needing to specify the cloudflare.vdo.ninja part if using [`&whipout`](../advanced-settings/whip-parameters/and-whipout.md) instead.

\*\* on vdo.ninja/alpha/

* I focused mainly on adding Cloudflare support first, as it has good pricing for its WHIP/WHEP service, it doesn't require deploying anything, and it has a lot of features (RTMP, SRT, recording, API). It's not 100% cooked yet though, so it's just on alpha currently for testing.

#### August 23 <a href="#august-31" id="august-31"></a>

* I've open-sourced the VDO.Ninja whip API server code and put it on GitHub:\
  [https://github.com/steveseguin/whip](https://github.com/steveseguin/whip)\
  It's kinda basic right now, but it will probably grow over time into something more broadly useful.

#### August 17 <a href="#august-31" id="august-31"></a>

* Add a new remote API query option to VDO.Ninja; called getGuestList. eg: `https://api.vdo.ninja/APIKEYHERE123/getGuestList`\
  \-- It returns an object with guest slot values as its keys, along with the associated stream ID and label for each of those guests.\
  ![](<../.gitbook/assets/image (5) (1) (1) (1) (1).png>)
* I've been trying to fix a recent [`&buffer`](../advanced-settings/view-parameters/buffer.md) issue where audio/video fell out of sync with a buffer greater than 3-seconds. The new code isn't yet perfected, but the sync is closer -- I'll continue to work on it. Might be best to keep the buffer under 3 seconds though in the interm.

\*\* on alpha

#### August 13 <a href="#august-31" id="august-31"></a>

* [`&humb64`](../advanced-settings/setup-parameters/and-humb64-alpha.md) and [`&welcomeb64`](../advanced-settings/setup-parameters/and-welcomeb64-alpha.md) added. These are the same as [`&hangupmessage`](../advanced-settings/setup-parameters/and-hangupmessage-alpha.md) and [`&welcome`](../newly-added-parameters/and-welcome.md), which already exist, except these new options take an input as a base64 encoded string. VDO.Ninja will decode the base64 on load.\
  \-- Base64 values are less likely to get parsed by apps like Slack incorrectly, so safer to share. If feeling lazy, you can also just use [invite.cam](https://invite.cam/), and encode the entire link itself; has a similar effect.
* When using [`&cutscene`](../advanced-settings/settings-parameters/and-cutscene.md) or [`&bitratecutoff`](../advanced-settings/parameters-only-on-beta/and-bitratecutoff.md) on a room scene, it won't trigger due to a director being in the room with no video, unless they are using [`&showdirector`](../viewers-settings/and-showdirector.md).\
  \-- [`&cutscene`](../advanced-settings/settings-parameters/and-cutscene.md) wasn't intended really for a group scene; just a solo link or view link, but this fix makes it at more usable with a group scene.

\*\* on alpha

#### August 11 <a href="#august-31" id="august-31"></a>

Option for a custom hang-up message added to VDO.Ninja.\
\-- [`&hangupmessage`](../advanced-settings/setup-parameters/and-hangupmessage-alpha.md) (or `&hum`) , which take a URL encoded string. So it can be just "bye", or it can be some HTML, as shown in the link\
\-- eg: [https://vdo.ninja/alpha/?hum=bye%3Cimg%20src%3D%22.%2Fmedia%2Flogo\_cropped.png%22%3E\&push=ZimFGxM](https://vdo.ninja/alpha/?hum=bye%3Cimg%20src%3D%22.%2Fmedia%2Flogo\_cropped.png%22%3E\&push=ZimFGxM)\
![](<../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)\
\
\* on alpha

#### August 10 <a href="#august-31" id="august-31"></a>

* Fixed an issue where using [`&cover`](../advanced-settings/view-parameters/cover.md) and [`&showlabels`](../advanced-settings/design-parameters/showlabels.md), a newly added video to a scene might have had a larger label size than the other labels.
* Fixed an issue where deleting a label for a guest as a director didn't remove the label from guests/scene.
* I think I improved the local recording option, specifically for directors, where record-all didn't always work correctly.
* If a local recording fails, due to no media tracks being present, it will not turn the record button red now.
* Some minor text and labels fixed here and there, mainly impacting self-hosting.

\*\* on alpha at vdo.ninja/alpha/

#### August 9 <a href="#august-31" id="august-31"></a>

* Added [`&nomirror`](../advanced-settings/design-parameters/and-nomirror-alpha.md) to VDO.Ninja, which unlike [`&mirror=0`](../advanced-settings/design-parameters/and-mirror.md), disables the default mirror state of the video preview for a guest. Previews are often mirrored by default... [`&mirror`](../advanced-settings/design-parameters/and-mirror.md) can be applied on top of that state, to mirror things back for everyone if needed.\
  On alpha at [`https://vdo.ninja/alpha/?nomirror`](https://vdo.ninja/alpha/?nomirror)

#### August 6 <a href="#august-31" id="august-31"></a>

* [`&pipme`](../advanced-settings/design-parameters/and-pipme-alpha.md) (aka `&mypip` or `&pip3`) will cause your self-video preview window to pop out into its own picture in picture (floating/draggable) on load.\
  \-- this is not compatible with [`&autostart`](../source-settings/and-autostart.md)\
  \-- works with director or guest; not tested on mobile.
* `CTRL + ALT + P` will also toggle the picture in picture, without needing any URL parameters. (`cmd + ALT + P` on Mac)
* Added experimental support for a built-in browser background blur effect; uses 4x less CPU in theory I guess, but it only works with Chrome on Windows and only with some systems/cameras. I don't actually know if it works or not, as its not compatible with my system, but \*if & you see it in the effects list as a second blur option, let me know how it goes.

\*\* on alpha at vdo.ninja/alpha/

#### August 5 <a href="#august-31" id="august-31"></a>

* A few minor fixes:\
  \-- Rainbow puke button in [darkmode](../advanced-settings/design-parameters/darkmode.md) is correct now\
  \-- New [`&pipall`](../advanced-settings/design-parameters/and-pipall-alpha.md) feature doesn't break the site if browser does not supported\
  \-- Added a new experimental background blur effect; [`&effects=13`](../source-settings/effects.md) I think, but it's not supported by most browsers/systems and its in origin trial, but it it works for you, let me know\
  \-- The startRoomTimer remote API command now works with specific guests (as well as for everyone still)\
  \*\* changes on alpha

#### August 3 <a href="#august-31" id="august-31"></a>

* Added a new floating picture in picture mode, so you can pop out the entire video mix as a pinned window overlay\
  \-- [`&pipall`](../advanced-settings/design-parameters/and-pipall-alpha.md) (aka `&pip2`) will add a dedicated button for this mode\
  ![](<../.gitbook/assets/image (7) (1) (1) (1).png>)\
  \-- Or just right-click any video and select "Picture in picture all" from the context menu. This is available without any URL option\
  \-- This requires Chrome v115 right now; it might vanish in v116 due to it being in a `chrome field trial`, and so you might need to enable it via `chrome:flags` if it stops working.\
  \
  \*\* on alpha

#### July 31 <a href="#august-31" id="august-31"></a>

* Added a flag called [`&notios`](../advanced-settings/mobile-parameters/and-notios.md), as in "not iOS". It just tells the system that it's not an iOS device, or iPad, even if it is. This might change the behavior of the phone in certain ways, mainly for the purposes of debugging.
* Updated the rotation logic so it supports legacy and now also future-API standards.
* Rotating on Firefox should trigger the rotation event about 200ms faster now (found a faster event API).

\*\* everything is updated on production and alpha

#### July 28 <a href="#august-31" id="august-31"></a>

* Updated the logic for [`&noremb`](../other-parameters.md), [`&nopli`](../other-parameters.md), and [`&nonack`](../other-parameters.md) advanced viewer-side flags; there were some scenarios where they didn't kick in if used. I tried to fix that a bit.\
  \
  These flags in theory I think should help try to force a bitrate or resolution, regardless of network conditions, but in practice they still seem to just smash your frame rate. I haven't really been able to find a good use for them yet, but let me know.
* Fixed an issue where when you hung up on an iPhone, it would still stay the camera/mic was in use at the goodbye/reload page.
* Added the "test" audio output button to the in-call settings menu (as seen in image).\
  ![](<../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)
* Fixed an issue with Firefox mobile's camera rotation being wrong in the local preview. (let me know tho if the issues continues tho)
* Firefox mobile should not go to sleep any more when idle.

\*\* all above changes pushed to alpha for testing at vdo.ninja/alpha/

#### July 25 <a href="#august-31" id="august-31"></a>

* Released VDO.Ninja v23.8 into production, so GitHub, alpha, beta, and production are all now in sync with all current features/fixes.\
  \-- Production was last updated a few weeks ago (v23.7), so the main reason for this minor update has been to activate the native app's new web-view mode custom UI.

#### July 24 <a href="#august-31" id="august-31"></a>

* Created a new parameter called [`&locked`](../advanced-settings/mixer-scene-parameters/and-locked.md) for **VDO.Ninja**, which will force a the VDO.Ninja's mixer output keep the mixed render contained to a specific aspect-ratio, regardless of the browser's window size. (as seen in photo)\
  ![](<../.gitbook/assets/image (189).png>)![](<../.gitbook/assets/image (190).png>)\
  \-- You'll get black bars (or whatever the background color is) as padding on the sides to force the inner video elements into the desired aspect ratio\
  \-- When using [`&locked`](../advanced-settings/mixer-scene-parameters/and-locked.md), the default aspect ratio is 16:9, but you can pass a floating point value for different aspect ratios, or use landscape (instead of 1.77777) / portrait / square as presets if needed.\
  \-- Padding is centered, so the rendered video will be in the center of the screen. (tho using [`&widget`](../advanced-settings/settings-parameters/and-widget.md) mode might break things though).\
  \-- This [`&locked`](../advanced-settings/mixer-scene-parameters/and-locked.md) option is added to the Mixer App's WHIP/**Twitch publishing output option**, so regardless of window size, you'll get a 16:9 video render

#### July 23 <a href="#august-31" id="august-31"></a>

* Added options to start/stop/pause the group room timer as a director to the remote http/wss API.

```
https://api.vdo.ninja/test123456/startRoomTimer/null/600 - start 10min countdown timer
https://api.vdo.ninja/steve123456/pauseRoomTimer - pause timer
https://api.vdo.ninja/steve123456/stopRoomTimer - stop timer
https://api.vdo.ninja/steve123456/startRoomTimer/null/600 - start timer that counts up from 0
```

for eg: `https://vdo.ninja/alpha/?director=countrytownc&api=test123456` test director \*\* on alpha for testing

* Also added the room timer options to the companion.vdo.ninja sandbox page for testing\
  ![](<../.gitbook/assets/image (11) (4).png>)

#### July 20 <a href="#august-31" id="august-31"></a>

* Fixed an issue where adding a screen share to a group didn't work, along with some other director-related commands targetting a screen share.

\*on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### July 19 <a href="#august-31" id="august-31"></a>

* [`&app`](../advanced-settings/mobile-parameters/and-app.md) added as an option to VDO.Ninja; this loads the site into an "**app mode**" and allows you to load a new URL via the website itself.\
  \-- This parameter is enabled in the mobile native app's new website-mode option by default (the screen share option is also hidden).\
  \* it will go live inside the native Android app whenever I push VDO.Ninja's alpha version into production\
  ![](<../.gitbook/assets/image (10) (8).png>)
* Updated the translation files with site/text changes from past few months; should help improve some of the breaking button translations, etc.
* Updated the translation logic quite a bit; it should further help with some translation issues.
* Tweaked the director's room CSS a small bit; mainly to help fit languages with long words that don't fit in some buttons.
* Made some major changes to the way Firefox Mobile handles device rotation. Before, it didn't. Like, the camera didn't rotate when you rotated your device, nor did [`&forcelandscape`](../advanced-settings/mobile-parameters/and-forcelandscape.md) mode work. Well, that should should work now (to the extent possible with Firefox).
* Made the code more patient for both Firefox and Mobile device, particularly when it comes to changing cameras, loading the camera, or applying settings to a camera. Mobile devices, especially Firefox Mobile, seem to like being given a few seconds to process camera changes before accepting new changes. (else crashes or cameras freezes, etc).
* When switching cameras on Chrome desktop tho, I've made the switches a bit faster; nearly as fast as it will let me. Seems stable enough to let me.

\*\* on alpha

#### July 18 <a href="#august-31" id="august-31"></a>

* Improved the media file sharing option so that you can now change to a new media file while streaming, without having to reload the page to select a new file
* New button in the control to let you select a new media file to switch to sharing\
  ![](<../.gitbook/assets/image (8) (7).png>)
* Fixed an issue where going to the next video in a playlist of videos caused the stream to get stuck
* This media file option has long existed, but it's not really used as I suppose you can just screen-share a video instead. Access it by adding [`&fileshare`](../source-settings/and-fileshare.md) to the URL: ie `https://vdo.ninja/alpha/?fileshare`

\*\* on alpha

#### July 17 <a href="#august-31" id="august-31"></a>

* If the director uses [`&password=false`](../general-settings/password.md) in the URL or creates a room with password set to `false` or `0`, that will be reflected now on the invite/scene links.
* Fixed an issue where Firefox Mobile on Android would sometimes have the camera crash if changing changes.

\*changes on alpha at vdo.ninja/alpha/

#### July 15 <a href="#august-31" id="august-31"></a>

* Using `&room&director` together now gets handled better
* Minor fix to solo talk with the remote API
* Alt solo talk support added to the remote API

#### July 13 <a href="#august-31" id="august-31"></a>

* [`&batterymeter`](../advanced-settings/settings-parameters/and-batterymeter.md) added, curtesy of @Yong.\
  \-- you can read their notes here: [https://github.com/steveseguin/vdo.ninja/pull/1078#issuecomment-1627799535](https://github.com/steveseguin/vdo.ninja/pull/1078#issuecomment-1627799535)\
  \-- It's the same concept of [`&signalmeter`](../newly-added-parameters/and-signalmeter.md), except shows the battery meter for guests that are on devices with a battery that's draining/charging.\
  \-- Shows blinking warning if under 25% battery life.\
  \-- The battery meter was already available by default as the director, but now it can be enabled as a guest, etc.\
  \-- Also supports disabling the meter with `&batterymeter=0`.\
  \
  \*\* on alpha and GitHub

#### July 10 <a href="#august-31" id="august-31"></a>

* Added connection stats to the WHIP out functionality\
  ![](<../.gitbook/assets/image (3) (6).png>)
* Fixed an issue where changing video/audio sources/settings broke the WHIP out stream.
* [`&stereo`](../general-settings/stereo.md) should work now with the WHIP-Input mode (`?whip=xx&stereo`), assuming the source supports it (VDO.Ninja whip-out does)

I'll keep improving the support for WHIP/WHEP. Lots to do. Suggestions welcomed also.\
\
\*\* on alpha pending a bit more testing

#### July 9 <a href="#august-31" id="august-31"></a>

* Added some audio options to the WHIP-publishing sandbox page at [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip)\
  ![](<../.gitbook/assets/image (1) (2) (8).png>)

#### July 7 <a href="#august-31" id="august-31"></a>

* Fixed an issue with some private turn servers hosted by others and niche compatibility issues when used with the speedtest.
* Fixed an issue where the control bar would appear for guests that have joined without video and were added to a manual group scene.
* Fixed an issue where the avatar image didn't appear always (was triggered I think with scene=1 or using group I think).
* [`&stereo=6`](../general-settings/stereo.md) is added. Unlike `&stereo=1`, it doesn't change the default [bitrate](../advanced-settings/view-parameters/audiobitrate.md)/[aec](../source-settings/aec.md)/[denoise](../source-settings/and-denoise.md)/[autogain](../source-settings/autogain.md) settings; solely just enables stereo for both in/out.
* If you put a PUSH link into OBS, you'll get a little notice asking if you made a mistake, with a solution on how to fix it.\
  ![](<../.gitbook/assets/image (1) (4).png>)

\*\* changes on GitHub and on alpha

#### July 4 <a href="#august-31" id="august-31"></a>

*   Added [`&meterstyle=5`](../advanced-settings/design-parameters/meterstyle.md), which has the audio-only background image pulse larger in size when that specific guest is speaking. This is just another new way to tell when someone is speaking; there's several ways now.

    \--- It can be used in conjunction with [`&bgimage`](../advanced-settings/design-parameters/and-bgimage.md) to specific a custom background image for the video, which will pulse in size. ie: `&meterstyle=5&bgimage=./media/avatar1.png`
* When using [`&meterstyle=4`](../advanced-settings/design-parameters/meterstyle.md), or greater, the background of an audio-only element is transparent now; not black. I also specifically hide the video-control bar when using `&meterstyle=4`, but you can use [`&videocontrols`](../advanced-settings/newly-added-parameters/and-videocontrols.md) to add them back in if needed.
*   When using any [`&meterstyle`](../advanced-settings/design-parameters/meterstyle.md) effect, I now I include a data attribute called `data-speaking` to the video element. It will be either 0, 1, or 2. 0 is quiet, 1 is whispering, and 2 is loud. `&meterstyle=4` includes a fine-grain option already for loudness as an attribute, but for basic CSS needs, this option might be more approachable.

    \-- You can use this attribute to use CSS to customize your own effects when someone speaks. You can further target what is CSS used based on a specific guest by using each video's stream ID data attribute as well.
* [`&bgimage2`](../advanced-settings/design-parameters/and-bgimage.md#and-bgimage2-and-and-bgimage3) and [`&bgimage3`](../advanced-settings/design-parameters/and-bgimage.md#and-bgimage2-and-and-bgimage3) were added, and work in conjunction with the existing [`&bgimage`](../advanced-settings/design-parameters/and-bgimage.md) parameter. You pass an URL-encoded image URL to each, and when a guest speaks, it will switch their background image between the 3 possible images, based on their loudness.

\-- eg:

```
vdo.ninja/alpha/?view=stream2,stream2&avatarimg=./media/avatar1.png&avatarimg2=./media/avatar2.png&avatarimg3=./media/avatar3.png
```

\-- I've included some hand-drawn avatar sample images to test with; they are the default values for `&bgimage`, `&bgimage2`, and `&bgimage3`. (ugly, but mean to be just placeholders)\
\-- The images will only show when there is no active video and is essentially the same as using `&meterstyle=4` with some custom CSS to specify the behaviour, but it is not stream ID specific however.

![](<../.gitbook/assets/image (24) (3).png>)

\*\* on vdo.ninja/alpha/

#### July 1 <a href="#august-31" id="august-31"></a>

* Added [`&whipoutcodec=av1,h264,vp8`](../advanced-settings/whip-parameters/and-whipoutcodec.md) (`&woc`), which lets you specify the WHIP video output codec. It can take multiple values; if not used, the default at the moment is open264
* Added [`&whipoutaudiobitrate`](../advanced-settings/whip-parameters/and-whipoutaudiobitrate.md) (`&woab`) and [`&whipoutvideobitrate`](../advanced-settings/whip-parameters/and-whipoutvideobitrate.md) (`&wovb`), which lets you specified the WHIP audio and video bitrate (kbps).
* [`&stereo`](../general-settings/stereo.md) now works with the WHIP output, so if enabled, you'll publish stereo 2.0 with a default audio bitrate of around 80 to 100-kbps; otherwise the default is mono at around 60kbps. These defaults bitrates might be changed own the road.
* The WHIP sandbox test page is now configured with two drop down menus to let you select bitrate and codec for when publishing to a WHIP output.
* The Twitch WHIP output example now has a default bitrate of 6000-kbps if used. The video codec for whip out by default is openh264, and the twitch output option uses that by default. (The Twitch defaults need to be changed via URL manually.)
* Just a reminder you can test the WHIP out by publishing to the VDO.Ninja whip-in URL (`https://whip.vdo.ninja/STREAMID` and for playback, `https://vdo.ninja/?whip=STREAMID`).

![](<../.gitbook/assets/image (9) (6).png>)

\*\* all changes are on alpha, with the updated whip sandbox here: [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip)

#### June 28 <a href="#august-31" id="august-31"></a>

* Added [`&slot=N`](../advanced-settings/settings-parameters/and-slot.md), which is a guest side property (sender side). It just tells the director ([Mixer App](../steves-helper-apps/mixer-app.md) / [`&slotmode`](../advanced-settings/director-parameters/and-slotmode.md)) which slot the guest should prefer to be in, if slots are being auto-assigned. If the desired slot is already taken, then that guest will then not be assign a slot. If the guest was assigned a slot by the director, refreshing will keep the assign slot, and the URL-specified slot preference will be ignored.
* Fixed an issue where custom scene names in the director's room were incorrectly being capitalized.
* Users with old iOS (iOS 15 and older) versions will be greeted with a message, recommending they update their system's OS. iOS 16 and newer has many important bug fixes, so its strongly recommended. It should trigger when using Safari; not sure about all other browsers on iOS yet though.\
  ![](<../.gitbook/assets/image (5) (2) (1).png>)
*   I updated [`&orderby`](../newly-added-parameters/and-orderby.md) to work with non-director view links, such as with scenes or guests.

    \-- Previously `&orderby` only worked with the director's view to sort the positioning of control boxes, based on the _stream ID_, but now it can apply to the auto-mixer.\
    \-- The _mix order_, or [`&order=N`](../source-settings/order.md), of each guest takes priority over the name when sorting. By default all guests have a mix order of 0, mind you. You can change it dynamically as a guest, via the mix-order option in each guest's control box, or pre-assign it via URL with `&order=N` on the guest invite.
*   I also added `&orderby=label` as an option, which will sort based on the display name (`&label`) of each video, if the label is set, instead of by stream ID.

    \-- This option doesn't apply to the director's view at the moment, but it does work when used with respect to the auto-mixer (guests/scenes).\
    \-- The label sort ignores letter casing, while the default stream ID includes letter casing in the sorting logic.

\*\*\* on alpha for now

#### June 27 <a href="#august-31" id="august-31"></a>

* [`&sticky`](../general-settings/sticky.md) and the "save room" button won't work for links loaded in OBS Studio anymore - there isn't a usecase for this really, and using `&sticky` there just complicates things for some users.
* Modified the initial p2p connection logic in VDO.Ninja to be a bit more aggressively in dealing with signaling distruptions caused by extreme packet loss and lag. So if a browser can't finalize the connection after X seconds, I just force restart it now, without waiting for it to error. I think this will reduce how often two guests in a large room can't see/hear each other. Let me know if you experience new issues tho as a result.
* Improved some communication logic related to transfer rooms, where a director transferring a guest into another room with broadcast mode or queue mode being enabled didn't always work as intended if the guest had a high ping (>500ms). Transfers will take a bit longer to kick in now, upwards of a few seconds in some cases, but that transfer issue should be fixed.
*   Updated the [`&hidecodirectors`](../advanced-settings/director-parameters/and-hidecodirectors.md) viewer-option with the aliases `&hidedirector` and `&hd`, but also changed the logic so it stops the video/audio/IFrame/widget data from any director loading.

    \--- This is a bit like the opposite of [`&showdirector`](../viewers-settings/and-showdirector.md), but only viewer side.\
    \--- Another change is that it works with more than just one codirector hiding another codirector, but can be used with scenes, view links, or guests.\
    \--- Lastly, this is not like [`&exclude`](../advanced-settings/view-parameters/and-exclude.md), as it still allows the data-connection to happen between the two peers, allowing chat and two codirectors to sync their dashboards/commands. Keeping data connections active is important for directors, who rely on them to issue commands, so exclude is a bit to harsh in some cases.

\*\* all changes pushed to production

#### June 26 <a href="#august-31" id="august-31"></a>

* Added [`&poster`](../advanced-settings/mixer-scene-parameters/and-poster.md) as a URL option; lets you specify a poster image for videos that have not yet started playing. (using the built-in HTML poster attribute) - This flag takes an encoded URL, pointing to a CORS-accessible image file.
* Added [`&hideplaybutton`](../advanced-settings/mixer-scene-parameters/and-hideplaybutton.md), (`&hpb`), which will hide the default big play button that overlays a video when auto play is not allowed. This option is useful when you want to perhaps include your own playbutton as part of the poster image.

Example of the commands:

```
https://vdo.ninja/alpha/?view=YbFmisR&poster=./media/bg_sample.webp&hideplaybutton
```

\*\* on alpha for testing

#### June 19 <a href="#august-31" id="august-31"></a>

* Created [`&queuetransfer`](../advanced-settings/settings-parameters/and-queuetransfer.md) (`&qt`), which will transfer a guest from one room into another, but one transferred, the guest will be in Queue mode. So they won't share their video with anyone by the director.
*   Added an 'activate guest' button to the director's controls, so that when a guest connects in queue mode, (yet the director isn't also in queue mode, as is typical for a queue mode setup), the director can take any select user out of queue mode.

    \--- This has the result of guests joining a room in queue mode, and only being able to see the main director by default.\
    \--- In this mode, the director can at any point allow the guest to see and talk to everyone in the room by taking them out of queue mode by activating them with the button.\
    \--- You could of achieved a similar function to this 'activate button' as just transferring the guest back to the same room, but this has some polish and is less confusing.
* Some more CSS fixes when in dark-mode, plus the create room buttons are now green.

\*\* on alpha and now also on production

#### June 14 <a href="#august-31" id="august-31"></a>

* Few CSS fixes, including a larger thumb-button for the input value sliders, making it easier to use on mobile devices, and the START button on darkmode had a text-color fix.
* I've added [`&broadcasttransfer`](../advanced-settings/director-parameters/and-broadcasttransfer.md) (aka `&bct`) as a URL option, which will let you specify the default for whether to transfer a guest from room to room in broadcast mode or not. Mainly useful for when using [`&rooms`](../director-settings/rooms.md), since there isn't a transfer menu option when using it, since its more of a hotkey option.
* I made some fixes to the UI as well, related to [`&queue`](../general-settings/queue.md) and [`&rooms`](../director-settings/rooms.md) and the upload button (which is now part of the chat pop up).
* When a guest has a network disconnection with the handshake server while in a transfer room, I do a better job properly closing all existing peer to peer connections, and putting the guest back into the main lobby room. The improved logic also works with [`&include`](../advanced-settings/mixer-scene-parameters/and-include.md), so if you specify a stream via [`&include`](../advanced-settings/mixer-scene-parameters/and-include.md) that isn't in a room, it won't be disconnected like other non-excepted stream IDs.

\*\* changes on alpha

#### June 8 <a href="#august-31" id="august-31"></a>

* Updated production with some fixes, such as director's view has the guest mute state working again, stats work with screen sharing in [`screensharetype=3`](../newly-added-parameters/and-screensharetype.md) mode, green screen updates, and a few UI glitches.

#### June 7 <a href="#august-31" id="august-31"></a>

* A recent change in Chrome I think broke the digital green screen effect in VDO.Ninja. I pushed a fix to alpha for testing:\
  [https://vdo.ninja/alpha/?effects=4\&webcam](https://vdo.ninja/alpha/?effects=4\&webcam)
* Updated the background removal effect logic; trying out a few methods of trying to clean up the edges\
  \*\* on alpha for testing: [https://vdo.ninja/alpha/?effects=4\&webcam](https://vdo.ninja/alpha/?effects=4\&webcam)\
  ![](<../.gitbook/assets/image (10) (6).png>)

#### June 6 <a href="#august-31" id="august-31"></a>

*   Bug fix: Firefox forgot to make this [new 'active' feature](updates-vdo.ninja.md#august-31-7) of theirs work with audio tracks, which caused a recent issue here with solo-talk + Firefox users.

    \
    I think I've fixed the issue for now though, by having audio-tracks still use the old method of muting Firefox streams, while allowing video tracks to still use the new method.\
    \
    I've pushed this fix to alpha for the time being; testing welcomed. I've also submitted a bug report to the Firefox devs.

#### June 4 <a href="#august-31" id="august-31"></a>

* Fixed a recent Meshcast issue where the director wasn't able to select the Meshcast server manually before going live.
* Fixed an issue where if you joined as a guest via iOS, if you didn't select video when joining, you couldn't enable your camera later via settings.
* Fixed an issue (i hope) where joining as a guest via iOS without selecting your camera caused a black video to play full screen until closed. (seems like it was caused by a recent UX/security decision on apple's part? so this may end up being just a temporary hack if apple keeps poking at this new concept).

\*on alpha

#### June 2 <a href="#august-31" id="august-31"></a>

*   Fixed a recent issue where the director's screen share would appear in the OBS scene (not their webcam though), without having [`&showdirector`](../viewers-settings/and-showdirector.md) added.

    \-- If the director wants their screen share to show in the scene, but not their webcam, they can use [`&showdirector=3`](../viewers-settings/and-showdirector.md) now instead.\
    \-- The screen share still shows for the director, in its own control box, but add-to-scene options are hidden and some text clarifying the performer state of the screen share is provided.\
    ![](<../.gitbook/assets/image (4) (4).png>)

\*\* update is currently on alpha, just pending a bit more testing. [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### May 30 <a href="#august-31" id="august-31"></a>

* The VDO.Ninja getDetails API request returns some added details for slots-position & active-speaker.
* When using the JSON Layout blob ([`&layout=jsonblobhere`](../advanced-settings/mixer-scene-parameters/and-layout.md)) obtained from the [Mixer App](../steves-helper-apps/mixer-app.md), the director in [`&slotsmode`](../advanced-settings/director-parameters/and-slotmode.md) will now be able to change who is in which slot without the Mixer App open.
* The Twitch WHIP ingest endpoint now works directly via VDO.Ninja (rather than via a proxy server I had hosted).
* Played a bit with the audio loudness metering styling. More feedback welcomed.

\*\* changes on alpha

* New larger web server for VDO.Ninja going to go live tonight - same website, but different server. Should be a smooth transition, but fyi.

#### May 28 <a href="#august-31" id="august-31"></a>

* Added `&playchannel` as an option to VDO.Ninja, which will play either the left or right audio stream-only for an incoming stereo stream.\
  \
  \-- It will play back the selected channel as mono audio, dropping other channels from the playback.\
  \-- `&playchannel=1` is left channel; `2` is right; and if multi channel works for you, then you can target 6 different channels.\
  \-- This is useful if you wanted to capture the left and right audio channels of a remote guest in OBS in different browser sources, without having to do any fancy audio routing on the studio side.\
  \-- Both left and right audio channels are still sent; it's just during local playback that the non-selected channels are dropped, so it's not as efficient as local routing, nor will both channel be in exact sync anymore either.\
  \-- This will not currently work in conjunction with [`&panning`](../advanced-settings/view-parameters/and-panning.md) of [`&channeloffset`](../advanced-settings/view-parameters/and-channeloffset.md); and will override those options.\
  \
  Example usage: [https://vdo.ninja/alpha/?view=XXXXXXXX\&stereo\&playchannel=1](https://vdo.ninja/alpha/?view=XXXXXXXX\&stereo\&playchannel=1)

\*\* on alpha for testing

#### May 26 <a href="#august-31" id="august-31"></a>

* Pushed a bug fix to VDO.Ninja production and GitHub, where a temporary loss of Internet could cause a waiting viewer to not notice a publisher has started streaming. This only happened in a niche situation of settings, and would self-fix itself after a while already, but this fix should have it resolve instantly now. The backup check option, in case everything fails still, also now checks 4x more often, just for added assurance.
* Fixed some minor CSS font/coloring issues in VDO.Ninja, specific to [darkmode](../advanced-settings/design-parameters/darkmode.md). Also some changes to the VU meters, but more changes to come there.

#### May 24 <a href="#august-31" id="august-31"></a>

* When the director share screens now, their screen share will count as a second-video stream, so they can share both camera and screen share with guests by default. No need for [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md). The exception to this rule is if using [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) as the director, which will have the screen share mode be [`screensharetype=1`](../newly-added-parameters/and-screensharetype.md) (one shared stream for webcam+screen sharing). This is just due to the nature of broadcast mode.

\*\* on production

#### May 23 <a href="#august-31" id="august-31"></a>

*   Firefox now supports the option to fully-pause the encoding of a video stream to a guest. As a result, I've now updated the code to distinguish between new and old Firefox versions that support this ability.

    \-- The director can now "fully stop' the preview for an incoming Firefox-based v110+ guest stream, rather than just limit it to \~ 30-kbps @ 1-fps or so.\
    \-- When a Firefox v110+ guest full-windows their own preview, it won't pause the video stream for other guests like it did with older versions.

\*\* updated on production and alpha

#### May 17 <a href="#august-31" id="august-31"></a>

*   Added `&meshcastcode` (`&mccode`) as an option, which lets you specify the Meshcast server to use. This was already possible with just [`&meshcast`](../newly-added-parameters/and-meshcast.md), but if you wanted to specify audio/video-only modes as well as the server, this new option will let you specify the server another way, allowing both options to work.

    ie: `https://vdo.ninja/?meshcastcode=cae1&meshcast=video`
* Couple minor bugs fixed; one related to [`&cover`](../advanced-settings/view-parameters/cover.md) and dynamic resolutions
* The mobile settings slide in menu in darkmode is now made transparent
* Added a spacing between the hang-up button and the other buttons on mobile; avoids misclicking
* Few other CSS changes to the settings menu

\*\* all recent changes now available on production, beta, and alpha.

#### May 14 <a href="#august-31" id="august-31"></a>

* Added an option for the director to mirror a guest's video\
  \-- This applies globally, so within scenes, other guests, and for the actual guest\
  \-- If a guest's video preview is mirrored already, such as if using [`&mirror`](../advanced-settings/design-parameters/and-mirror.md), this function will mirror their local mirror effect; so it doesn't override it, but applies on top of it for them.\
  \-- If a guest mirrors someone else's video via the right-click context menu manually, if the director changes the mirror for that video, it will override what the guest has set. They can always re-mirror it manually, but the director in this case takes precedent.\
  ![](<../.gitbook/assets/image (6) (1) (1) (2).png>)

\*\* this new mirror feature is on alpha for now at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/). Feel free to test and let me know how you fair.

#### May 10 <a href="#august-31" id="august-31"></a>

* Highlighting a guest as a director won't apply the solo highlighting to viewers/scenes who have [`&layout`](../advanced-settings/mixer-scene-parameters/and-layout.md) applied to their own links. The layout is assumed to take priority. (let me know if you have feedback though)
* Fixed a couple reported bugs in the [new release](updates-vdo.ninja.md#august-31-2). Please keep any bug / issue reports coming ⁠⁠[🐞│bug-report discord channel](https://discord.gg/qWDshMsTar)&#x20;

#### May 9 <a href="#august-31" id="august-31"></a>

* Added [`&nomeshcast`](../advanced-settings/meshcast-parameters/and-nomeshcast.md) as an option in VDO.Ninja. This is a viewer-side option that tells a sender to provide a p2p stream, rather than a Meshcast stream, if they have [`&meshcast`](../newly-added-parameters/and-meshcast.md) active. A bit of a niche option, but might be useful if bandwidth or latency is a consideration for a specific viewer, like the [director](../viewers-settings/director.md).\
  \
  \*\* this change is on alpha, [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## [Version 23 Release](../releases/v23.md) <a href="#august-31" id="august-31"></a>

#### May 8 <a href="#august-31" id="august-31"></a>

* _New version of VDO.Ninja released_ into Production at [https://vdo.ninja/](https://vdo.ninja/). v23 now live.\
  \
  If having problems,\
  \- Please do a hard browser cache clear and refresh, especially in your OBS browser sources and if on mobile.\
  \- If still having problems, the previous version of VDO.Ninja can be found here: [https://vdo.ninja/v22/](https://vdo.ninja/v22/)\
  \- Report any issues you have with the new version in the ⁠[🐞│bug-report discord channel](https://discord.gg/qWDshMsTar) \
  \
  [Release notes](../releases/v23.md) will be coming over the next few days probably, but some quick highlights are:\
  \- the [Mixer App](../steves-helper-apps/mixer-app.md) has been improved, including with the option to sync OBS scenes to Mixer layouts\
  \- connection stats has new features and important fixes to the candidate type stat\
  \- a refresh to the UI, with a large contribution from Lindenkron there\
  \- chunked mode improvements and options to dynamically change the buffer have been added - Initial [WHIP/WHEP](../advanced-settings/whip-parameters/and-whip.md) support added, including a test page at [https://vdo.ninja/whip](https://vdo.ninja/whip)

#### May 5 <a href="#august-31" id="august-31"></a>

* Fixed an issue with mobile publishers, where if you rotated the phone from initially portrait mode, switching to landscape mode, the resolution after might have been still limited to the portrait resolution (but with just a rotated orientation). I'm now double checking that the outbound encoded video resolution per stream is maximized every time the sending device's orientation changes.
* Added some more debugging stats into the VDO.Ninja sender's side stats menu.\
  \-- three new video bitrate stats, useful for debugging. You can see what the initial bitrate was set to, the current bitrate target, and any max-bitrate target.\
  \-- these stats won't appear if they aren't set.
* Also added a bitrate slider for the sender-side to the stats menu, so you can adjust the video bitrate that you are sending for that particular viewer.\
  \-- you can't set it higher than the initial connection bitrate, if it was set, or the max defined bitrate.\
  \-- the default max of the slider will be either the initial/max bitrate of the connection; or otherwise 6-mbps.\
  \-- it updates on release of the slider and will take upwards of 3 seconds to take effect, if it can.\
  \-- also, importantly, this is not available to any user within a group-room. This is purely available for simple push/view setups.\
  \
  If you find this new data / tool useful, particularly if it helped fix quality issues, please let me know how it helped so I can invest more time into it.\
  ![](<../.gitbook/assets/image (5) (6).png>)
* If an `iPhone 12 (and up)` user is detected, who is using `iOS +16`, with the `REAR camera selected`, and who has [`&quality=0`](../advanced-settings/video-parameters/and-quality.md) (high performance) mode active, then `1080p at 60-fps` will be enabled. So yes, iPhones actually work at 1080p60 now..\
  \
  related to this update, the stats menu has more data:\
  \-- The viewer stats menu show the iOS version now by the browser stats: ie: Safari 16. (I'd recommend updating to iOS 16.2 if you do have an iPhone.)\
  \-- The stats menu now shows whether it _thinks_ the remote iPhone is an iPhone 12 and up (SE versions excluded)\
  \-- "iPhone 12 and up" will be true or false.\
  ![](<../.gitbook/assets/image (2) (17).png>)![](<../.gitbook/assets/image (1) (1) (10).png>)\
  \
  \*\* on alpha at vdo.ninja/alpha/

#### May 4 <a href="#august-31" id="august-31"></a>

* Added [`&minipreviewoffset`](../advanced-settings/video-parameters/and-minipreview-1.md) (`&mpo`), to alpha. This accepts an interer value, `-20` to `120`, which is used to position where the [mini preview](../source-settings/and-minipreview.md) is located by default on screen. `&mpo=40` would imply center of screen, as the mini preview is about 20% of the screen size. `&mpo=0` (or just `&mpo`) is the left-most side of the screen.

#### May 3 <a href="#august-31" id="august-31"></a>

* Fixed an issue where if the main director reloads their page, they will have the current director state updated on load, provided by any existing co-directors in the room. Before, only director -> codirector and codirector -> codirector state syncing worked, resulting in the room's state being cleared whenever the main director reloaded.
* Made the option to select an [avatar](../advanced-settings/video-parameters/and-avatar.md) / effect default-on when joining as a director.\
  ![](<../.gitbook/assets/image (7) (1) (1) (2).png>)
*   Fixed an issue where the mute-video track button didn't always appear when a director with an active video track.

    \
    changes to VDO.Ninja on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### May 1 <a href="#august-31" id="august-31"></a>

* Added a report bug feature back into VDO.Ninja; it might show up in some cases in the lower-right hand of screen, where clicking on the bug icon will let you submit the app logs to me for analysis. It will appear more often on alpha than on production, to avoid being a nuisance.\
  ![](<../.gitbook/assets/image (8) (3).png>)
* Added [`&suppresslocalaudio`](../advanced-settings/screen-share-parameters/and-suppresslocalaudio.md) as a new URL option. This will disable local audio playback of a Chrome tab while screen-sharing it. This can be used with the new WHIP output of VDO.Ninja to publish a VDO.Ninja scene directly to Twitch, without having to deal with any audio feedback issues while having that scene tab open.
* [`&prefercurrenttab`](../advanced-settings/screen-share-parameters/and-prefercurrenttab.md) (have the current tab as the default screen-share source)
* [`&selfbrowsersurface`](../advanced-settings/screen-share-parameters/and-selfbrowsersurface.md), which excludes the current tab as an screen share source option. (you can pass `include` or `exclude` as a value to control this though)
* [`&systemaudio`](../advanced-settings/screen-share-parameters/and-systemaudio.md), which excludes the system-audio as an audio source when display sharing. Tab audio is still available though. (can help prevent accidental audio feedback loops)
* [`&displaysurface`](../advanced-settings/screen-share-parameters/and-displaysurface.md) will pre-select "display-share", rather than tab-share, when screen sharing. You can pass `monitor`, `browser`, or `window` as options to customize this though.\
  ![](<../.gitbook/assets/image (7) (1) (1) (1) (1).png>)\
  \
  For more details on these new features see here: [https://developer.chrome.com/docs/web-platform/screen-sharing-controls/](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/) (Chrome/chromium-browsers only)\
  \
  \* on alpha

#### April 27 <a href="#august-31" id="august-31"></a>

* Continuing to tweak and improving the styling of VDO.Ninja.

#### April 25 <a href="#august-31" id="august-31"></a>

* Videos should auto-play within VDO.Ninja if using [`&noaudio`](../advanced-settings/view-parameters/noaudio.md). This was already the case if using [`&mutespeaker`](../source-settings/and-mutespeaker.md).
* I changed the logic for dynamic resolutions (optimizing to fit window). If the requested resolution is 1920x100 now, instead of requesting \~170x100, the auto mixer will now request 1920x1080. This should account for cases such as using [`&cover`](../advanced-settings/view-parameters/cover.md), improving video quality, despite not being super efficient.
* Added more IFrame API events and deprecated some older events (for those using the IFrame API).\
  \
  \* changes on alpha at vdo.ninja/alpha/

#### April 19 <a href="#august-31" id="august-31"></a>

* Added [`&structure`](../advanced-settings/design-parameters/and-structure.md) as an option, which will have the video holding div element be structured to 16:9 (or whatever [`&aspectratio`](../advanced-settings/video-parameters/and-aspectratio.md) is set to), making it easier to apply custom CSS backgrounds to videos.\
  \-- It will have the label/border/margins align relative to the 16:9 holder element, rather than video itself.\
  \-- Also related, you can also specify the background color independent of the border color with [`&color`](../advanced-settings/design-parameters/and-color.md) (new). If using [`&border`](../advanced-settings/design-parameters/and-border.md), it will not set the background color, so you may need to use both `&border` and `&color`.\
  \-- May not yet work with [`&forcedlandscape`](../advanced-settings/mobile-parameters/and-forcelandscape.md) or [`&rotate`](../advanced-settings/design-parameters/and-rotate.md).\
  ![](<../.gitbook/assets/image (14) (2).png>)
* Added [`&blur`](../advanced-settings/design-parameters/and-blur.md), which will try to add a blurred background to the video so it fits the structured video container\
  \-- Using `&blur` auto enables [`&structure`](../advanced-settings/design-parameters/and-structure.md).\
  \-- Code in the auto mixer, so you won't see the effect in a simple preview or some self-preview types.\
  \-- `&blur` doesn't work with [`&color`](../advanced-settings/design-parameters/and-color.md), etc.\
  \-- You can change the blurring intensity with `&blur=25` or whatever; `10` is default\
  \-- `&blur=0` works as well\
  \-- may be buggy if using it with [`&forcedlandscape`](../advanced-settings/mobile-parameters/and-forcelandscape.md) or [`&rotate`](../advanced-settings/design-parameters/and-rotate.md)\
  ![](<../.gitbook/assets/image (8) (1) (3).png>)
* Added new accessibility options, include button states using the `aria-pressed` attribute.\
  \
  \*\* changes on alpha. ie:\
  [`https://vdo.ninja/alpha/?scene&room=ROOMNAME&blur&margin&border&structure`](https://vdo.ninja/alpha/?scene\&room=ROOMNAME\&blur\&margin\&border\&structure)

#### April 18 <a href="#august-31" id="august-31"></a>

* In VDO.Ninja, when switching between the scene-preview and the director view modes (used in the [Mixer App](../steves-helper-apps/mixer-app.md)), the app will ramp up the bitrate in the scene mode to 500-kbps now (instead of staying at 35-kbps), and then switch back to the preview-targets when switching back in the director mode. This makes things work a bit closer to what is expected by the user, while also increasing the scene-preview's quality significantly (without still being a huge stress on the guests).\
  \*\* change on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### April 17 <a href="#august-31" id="august-31"></a>

* [`&mute`](../source-settings/and-mute.md) works with the director now, so the mic starts muted when you enable your microphone or when using [`&autostart`](../source-settings/and-autostart.md)
* Fixed an issue where if you used [`&style=N`](../advanced-settings/design-parameters/style.md) on a guest, the director isn't able to "hide" them from the auto mix.

#### April 16 <a href="#august-31" id="august-31"></a>

* You can now publish from VDO.Ninja directly to Twitch.\
  \-- Go here, [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip), enter your Twitch stream token in the correct field, GO, and then select your camera in VDO.Ninja as normal.\
  \-- There's also a new development version of OBS Studio that has improved support for direct publishing of OBS -> VDO.Ninja (via whip) here:\
  [https://github.com/obsproject/obs-studio/actions/runs/4711358202?pr=7926](https://github.com/obsproject/obs-studio/actions/runs/4711358202?pr=7926)\
  ![](<../.gitbook/assets/image (9) (1) (3).png>)![](<../.gitbook/assets/image (16).png>)

#### April 14 <a href="#august-31" id="august-31"></a>

* Added [`&effects=8`](../source-settings/effects.md), which might be useful if using a Camlink or simple HDMI capture device and [`&record`](../advanced-settings/recording-parameters/and-record.md) mode. The current `&record` mode doesn't seem to always scale down the video before recording (browser issue it seems), so local file recordings might be 4K in size, despite the target resolution being set much lower. `&effects=8` will use a canvas to first resize the video though, and then recordings will be based on that, making smaller recording sizes possible. (You could also use `&effects=7`, which then provides digital zooming controls and is otherwise the same thing).\
  \
  This `&effects=8` mode might also be helpful in solving issues with cameras disconnecting or having their frame rate change while recording, causing issues with the recording. The canvas acts as a reliable middle man between the camera and output video stream, so if the camera's input stream fails, the recording stream will not be impacted, other than perhaps skipping some frames. The canvas is sensitive to CPU load or browser throttling though, so frame rates may fluctuate more often when using it, so I can't suggest using it unless the guest/user is known to have a problematic camera.\
  \*\* on alpha
* Added a new IFRAME code example that prompts a guest who is joining a room with a message if the director is not there yet. The message clears when the director joins the room. This sample can be used like a normal vdo.ninja/?room=xxx link (as seen below). The code is extremely easy to customize or embedded into your own websites. The code is just provided as an example. [https://vdo.ninja/examples/waitingroom?room=TESTROOM123](https://vdo.ninja/examples/waitingroom?room=TESTROOM123)\
  ![](<../.gitbook/assets/image (15) (3) (1).png>)

#### April 13 <a href="#august-31" id="august-31"></a>

* Control bar styling for VDO.Ninja has been overhauled to look a lot nicer, curtesy of @Lindenkron. This style update is available on vdo.ninja/alpha/ and on GitHub.\
  ![](<../.gitbook/assets/image (13) (4).png>)
* Added the number of CPU threads (logical cores) to the stats in VDO.Ninja, as well as the check/results testing page.. (update on alpha & GitHub)\
  ![](<../.gitbook/assets/image (13) (5).png>)

#### April 12 <a href="#august-31" id="august-31"></a>

* Fixed an issue with [`&forcelandscape`](../advanced-settings/mobile-parameters/and-forcelandscape.md), with the patch on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/); the viewer side should have the video rotate now also; not just on the guest side. This is still a bit iffy, but feedback welcomed.

#### April 11 <a href="#august-31" id="august-31"></a>

* The VDO.Ninja's director's interface and control bar UI style has been further updated on alpha. (design improvements by Lindenkron)\
  ![](<../.gitbook/assets/image (10) (3).png>)
* The Social Stream and VDO.Ninja HTTP/WSS remote API server went thru some changes; let me know if you have any sudden new issues
* If having issues with [Meshcast](../steves-helper-apps/meshcast.io.md) and iPhone/iPad users (video being black), I pushed a patch to vdo.ninja/alpha/ and meshcast.io (either will work). I've partially updated [`&meshcast`](../newly-added-parameters/and-meshcast.md) on production with a fix also, but I won't be able to fully fix it on production probably until late tonight.

#### April 9 <a href="#august-31" id="august-31"></a>

* Added a "restart connection" button to the sender's side stats menu. I'll tinker with this a bit more, but the notion is if you are having problems with perhaps audio or video quality gets "stuck" low, you can try to restart the connection without refreshing the page.\
  \-- if this works well for users, I'll see about adding something into the code to automate pressing it when problems are detected (if possible).\
  \-- button only shows on compatible devices/ browsers\
  \-- not all devices support reconnection in this way.\
  ![](<../.gitbook/assets/image (12) (6).png>)\
  \
  \*\* on alpha at vdo.ninja/alpha/ and on GitHub.

#### April 7 <a href="#august-31" id="august-31"></a>

* Based on user feedback, I'm testing the concept of a "join with mic-only" button.\
  \-- You can enable it with [`&miconlyoption`](../advanced-settings/setup-parameters/and-miconlyoption-alpha.md) (or `&moo`).\
  \-- It's exactly the same as join with video, except the video device is not selected by default.\
  \-- When used, a mic only button shows if a guest joining a room, and if [`&audiodevice=0`](../source-settings/audiodevice.md) is not present.\
  \-- Hoping this will give more users courage to click the join button, but if it causes issues, I may revert.\
  ![](<../.gitbook/assets/image (1) (2) (7) (1).png>)\
  \
  \*\* on alpha for testing at [https://vdo.ninja/alpha/?room=someetestroomhere\&moo](https://vdo.ninja/alpha/?room=someetestroomhere\&moo)

#### April 6 <a href="#august-31" id="august-31"></a>

* Our very own @Lindenkron on Discord further improved the styling of the director's control boxes on alpha.\
  ![](<../.gitbook/assets/image (178).png>)
* VDO.Ninja updated on GitHub and alpha with all recent changes.

#### April 5 <a href="#august-31" id="august-31"></a>

* If a VDO.Ninja guest has [`&chunked`](../newly-added-parameters/and-chunked.md) added, the viewer or another guest can now use [`&nochunked`](../advanced-settings/settings-parameters/and-nochunked.md) to ignore the chunked version, and use the low-latency version. In this way, guests in a room can still use the low latency streams to chat, but publish chunked video to OBS for (delayed) high quality video.
* [`&noaudio`](../advanced-settings/view-parameters/noaudio.md) and [`&novideo`](../advanced-settings/video-parameters/novideo-1.md) works with [`&chunked`](../newly-added-parameters/and-chunked.md) mode sources now also, so you can have audio or video only chunked mode if needed.\
  \*\* on alpha
* [invite.cam](https://invite.cam/) updated to support the recent [`&headertitle`](../advanced-settings/design-parameters/and-headertitle.md) and [`&favicon`](../advanced-settings/design-parameters/and-favicon-alpha.md) feature. (use via the encoded input URL, such as VDO.Ninja; not the invite.cam URL)

#### April 3 <a href="#august-31" id="august-31"></a>

* Adding [`&headertitle`](../advanced-settings/design-parameters/and-headertitle.md) and [`&favicon`](../advanced-settings/design-parameters/and-favicon-alpha.md) as options. These will change the browser's page title and favicon image, respectively.\
  \-- Passed values should be URL encoded (Google URL encoding if needed).\
  \-- Since this is Javascript based, the values only update once the page loads. Meta-page-previews will likely not reflect the values.\
  \
  \*\* on alpha Sample link: [`https://vdo.ninja/alpha/?headertitle=LINDENKRON4TW&favicon=https%3A%2F%2Fmeshcast.io%2Ffavicon.ico`](https://vdo.ninja/alpha/?headertitle=LINDENKRON4TW\&favicon=https%3A%2F%2Fmeshcast.io%2Ffavicon.ico)\
  ![](<../.gitbook/assets/image (181).png>)

#### March 31 <a href="#august-31" id="august-31"></a>

* Added a `disable video` button as a new director's remote control option. This will remotely disable the guest's video in the same way that the guest themselves can disable it.\
  \-- The guest can't override it (unless they reload the page I guess).\
  \-- This disables the video preview for even the director, as its disabled as the source, so there isn't for even a solo "view" link to override it. This then is a bit more of a sure-fire way to disable a video from a guest.\
  \-- The previous "hide guest" button still works, but has a new icon. This differs from the new "disable video" in that the director can still see a preview of the guests video and it also hides any avatar/style-place-holder. When "disabling video", audio-only styles and avatar placeholders may still work.\
  \-- The guest gets a little note in their header bar that the director muted them when enabled. Also, the guest is unable to see their own video preview when enabled, hence the need for a message.\
  ![](<../.gitbook/assets/image (179).png>)![](<../.gitbook/assets/image (3) (1) (1) (4).png>)\
  \
  \*\* on alpha [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/), by user request. Please report any issues/feedback regarding it.

#### March 24 <a href="#august-31" id="august-31"></a>

* Right click a video and click `Snapshot to Clipboard` to save the current video frame to the clipboard as a PNG image. This can be pasted into most applications, such as Photoshop, for quick use in a production\
  ![](<../.gitbook/assets/image (6) (1) (1) (2) (1).png>)\
  \
  \-- Also the option to save to disk\
  ![](<../.gitbook/assets/image (4) (1) (4) (1).png>)\
  \
  \*\* on alpha @ vdo.ninja/alpha/

#### March 23 <a href="#august-31" id="august-31"></a>

* If using [`&permaid=streamidhere`](../advanced-settings/setup-parameters/and-permaid.md) to specify the stream ID, rather than just [`&push`](../source-settings/push.md), will save that stream ID to local storage and reuse it every time [`&permaid`](../advanced-settings/setup-parameters/and-permaid.md) is used without a stream ID\
  \-- You could also just use [`&permaid`](../advanced-settings/setup-parameters/and-permaid.md) on its own initially, which will auto assign a unique stream ID and save that generated one to local storage, which makes it easier to use one invite for many users, but have VDO.Ninja manage the stream ID assignments.\
  \-- If not using [`&permaid`](../advanced-settings/setup-parameters/and-permaid.md), it will just default to using `&push` with a random ID. (this avoids 'stream already in use' mishaps)\
  \* on alpha

#### March 20 <a href="#august-31" id="august-31"></a>

* Pushed a fix for [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) not always updating the layout; specifically when **VDO.Ninja** is used in an IFrame. Update on alpha and also all code has been pushed to github.

#### March 18 <a href="#august-31" id="august-31"></a>

* [`&codecs`](../advanced-settings/view-parameters/codec.md) and [`&videocodec`](../advanced-settings/view-parameters/codec.md) were added; these are an alias of [`&codec`](../advanced-settings/view-parameters/codec.md). Additionally, [`&codec`](../advanced-settings/view-parameters/codec.md) (and these new aliases) can now accept comma separated values that define the order of preferred video codecs if the primary one fails. You might want this it you want AV1 to be the main codec, falling back to H264 rather than VP8 if not supported. ie: `&codecs=av1,h264`
* Added an option to count-up from 0, rather than count down. You can set the time to 0 to count up, or use the checkbox to enable it.\
  ![](<../.gitbook/assets/image (1) (1) (6).png>)\
  \
  \*\* changes on vdo.ninja/alpha/

#### March 17 <a href="#august-31" id="august-31"></a>

* Fixed an issue with [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) where a screen share when stopped would continue to be listed as an "unknown user" in the hidden user list.
* When a guest is using [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md), the screen share holder control box that the director sees dims when that screen share stops. It does not disappear though.
* When recording iPhone/iPad videos in portrait mode with Chrome as a remote VDO.Ninja viewer, the videos should be saved correctly (both via p2p and with Meshcast), rather than in a chopped-in-half corrupted version.
* Added [`&postapi`](../advanced-settings/api-and-midi-parameters/and-postapi.md) (aka `&posturl`), which lets you specify a custom POST URL to send events within VDO.Ninja to.\
  \-- data JSON encoded, post URL requires HTTPS+CORS, and the passed URL parameter value needs to be encodedURLComponent. ie: `&postapi=https%3A%2F%2Fwebhook.site%2Fb190f5bf-e4f8-454a-bd51-78b5807df9c1` -- If you don't want to listen for events with the websocket server API I host, you can use this with your own API https server instead and get key events pushed to you that way\
  ![](<../.gitbook/assets/image (21).png>)![](<../.gitbook/assets/image (3) (1) (1) (3).png>)
* The hidden user-list can be closed when using [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) mode now
* Bug fixed with the [vdo.ninja/twitch](https://vdo.ninja/twitch) page, via a community code contribution
* _Development Progress update: WHIP and VDO.Ninja_\
  \
  I've been slowly improving the WHIP/WHEP interface for VDO.Ninja. It's a bit mentally exhausting, but there is some progress up on alpha:\
  \- WHEP in now added (test with cloudflare whep out),\
  \- WHIP out now added (tested with cloudflare whip in),\
  \- WHIP in improved a bit (tested with a private build of OBS and Larix, but isn't 100% stable yet) \
  \
  Still working on WHEP out and all the polish/integration that goes with this all. Hacking support in is one thing, but having it all work well with the rest of VDO.Ninja is tricky.\
  \
  One challenge is the interface and configuration for these WebRTC options. To help make it easier to play with things, I've created a little config page to test the very basics with.\
  \
  Many WHIP/WHEP apps are just as buggy/limited with their support as VDO.Ninja is, so incompatibilities and unstable behavior is unavoidable in the near term. Happy to work with others in the community to improve cross-app support.\
  ![](<../.gitbook/assets/image (4) (2).png>)\
  \
  \*\* changes available for testing at vdo.ninja/alpha/

#### March 13 <a href="#august-31" id="august-31"></a>

* If you hover over a name in the Not Visible user list, it will show the stream ID as a tool tip. (useful if it says "unknown user").
* If you `CTRL + Click` on the user name in the list, it will open that user stats menu, showing all details: system deets, stream ID, settings, etc.
* Applied a fix for recording iPhone video that's portrait mode; might be properly oriented now when saved?\
  \
  \*\* on alpha

#### March 6 <a href="#august-31" id="august-31"></a>

* The default for iOS 16-devices and newer will now have 720p60 selected by default, rather than 720p30. 60-fps still isn't working at 1080p on iOS, but baby steps I guess.\
  ![](<../.gitbook/assets/image (13) (2).png>)\
  \
  \*\* on alpha at vdo.ninja/alpha/

#### March 4 <a href="#august-31" id="august-31"></a>

* Pushed some audio-related fixes for iPhones onto alpha. The audio-meter was active even when muted, and I think I fixed that now.
* Added a volume control to the list of hidden users. As well, when you close the hidden user list, you can open it again via a little icon that appears in the lower-right corner (an icon with two masks).\
  ![](<../.gitbook/assets/image (6) (3).png>)\
  \
  \*\* on alpha at vdo.ninja/alpha/

#### March 2 <a href="#august-31" id="august-31"></a>

* Some translations updated (via Lindenkron)
* Tycho and Lindenkron fixed a few random typos/errors in the code base
* The UI/CSS for the director's room control-boxes has been updated/improved. The majority of this effort was done by Andrewww, which is also his first repo commit.\
  \-- you can see we adopted some color coding (actual colors might get changed over time), which was inspired by Lindenkron.\
  \-- the CSS / HTML is slightly less rigid, so should be easier to customize with custom css by users.\
  \-- rainbow puke button removed, (but is still available as the sender if you `CTRL + click` on the video preview)
* I added in a little "minimize" button to the control box, which lets you minimize it. It's not all that robust, but it might come in handy for hiding a couple annoying windows (like a co-director) that is taking up space.\
  ![](<../.gitbook/assets/image (3) (7).png>)![](<../.gitbook/assets/image (7) (3).png>)\
  \
  \*\* changes on alpha at vdo.ninja/alpha/

#### February 27 <a href="#august-31" id="august-31"></a>

* Added the option to "pin" the room-settings to the side of the director's room. This way you'll have access to certain global/room settings quickly, if needed. (expect some tinkering over the following weeks though)
* Added buttons to the room settings to start/stop _all_ recordings; both remote/local.\
  ![](<../.gitbook/assets/image (1) (1) (8).png>)\
  \
  \*\* these updates are available on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/) for testing/feedback\


#### February 26 <a href="#august-31" id="august-31"></a>

* If you hold CTRL when clicking highlight, the target guest becomes 75% of the screen (not 100% as normal), leaving room for other guests along the side.\
  ![](<../.gitbook/assets/image (21) (3).png>)
* Fixed an issue where when using [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md), stopping the screen share as a guest didn't clear it from the screen (a frozen image remained). That should be fixed now.
*   That "are you sure you want to quit" pop up now appears when joining VDO.Ninja by either of these links; before it only appeared in the later

    ```
    https://vdo.ninja/alpha/?room=roomID
    https://vdo.ninja/alpha/?room=roomID&push=XdTX2qX
    ```

\*\* on vdo.ninja/alpha/

#### February 24 <a href="#august-31" id="august-31"></a>

* Improved the guide on 1080p60 streaming via VDO.Ninja, along with some other sections in the documentation:\
  [how-to-screen-share-in-1080p.md](../guides/how-to-screen-share-in-1080p.md "mention")\
  [cant-select-a-camera-lens-on-mobile.md](../common-errors-and-known-issues/cant-select-a-camera-lens-on-mobile.md "mention")\
  [virtual-camera-not-working-on-mac.md](../common-errors-and-known-issues/virtual-camera-not-working-on-mac.md "mention")\
  Added a link to it to the screen-sharing setup page as well in VDO.Ninja, so its easier to find.
* I've set the default \&sstype for screen sharing to 3 when in a room now, versus 2. This change is on alpha and beta. If using `xxxxx_s` with \&ssid before, you'll need to switch to `xxxxx:s` instead I think, but otherwise it should be all the same? (feedback welcomed)
* Updated vdo.ninja/beta/ with the current vdo.ninja/alpha/ version. A bit overdue, but I am looking to have the current v23 released tested some more.

#### February 22 <a href="#august-31" id="august-31"></a>

* Fixed an issue with the audio-meters not always showing in the director's guest-control boxes (hot patched)
* Added a small on-hover over buttons effect to buttons (nod to @Lindenkron)

#### February 19 <a href="#august-31" id="august-31"></a>

* I've refined the [WHIP service](../advanced-settings/whip-parameters/and-whip.md) on `vdo.ninja/alpha/?whip=xxx`, making it as robust as I can I think, so if some third-party WHIP client/app doesn't work with it, it may not an issue with VDO.Ninja. In those cases it will be up to the client to ensure full support of the WHIP specification, else it may not work with VDO.Ninja.
* Added [`&allowedscenes`](../advanced-settings/settings-parameters/and-allowedscenes.md) as an option to filter which OBS scenes a remote guest has access to controlling when using [`&controlobs`](../advanced-settings/settings-parameters/and-controlobs.md). Uses CSV to split up the scenes (avoid special characters in your scene names if there are issues)\
  example: `vdo.ninja/alpha/?view=xxx&remote&allowedscenes=Scene1,Scene2`\
  \
  \*\* on alpha

#### February 16 <a href="#august-31" id="august-31"></a>

* [`&timer=N`](../advanced-settings/settings-parameters/and-timer.md) can be used to position where the countdown timer is positioned on a guest's window. Default is still center top, but a value of 1 to 9 can be be passed to change positions.
* Setting the time as a director, for the timers, now can accept minute/seconds, rather than just seconds.\
  ![](<../.gitbook/assets/image (9) (4).png>)
* The [`&datamode`](../newly-added-parameters/and-datamode.md) option was tweaked to work a bit better now when using it to both connect via push and view modes. Data-only mode is an advanced option; it's a bit like doing `&ad=0&vd=0&webcam&autostart&hidemenu`, but a bit cleaner and disables a few other common functions that might be considered bloat. Useful perhaps if you want to use only the data-channels of VDO.Ninja, for remote control only operations or sending files.\
  \
  \*\* changes on alpha at vdo.ninja/alpha/

#### February 15 <a href="#august-31" id="august-31"></a>

* Digital zoom fixed to support a change in orientation.

#### February 10 <a href="#august-31" id="august-31"></a>

* You can set the [totalroombitrate](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) via manual value input now (rather than slider) in the room settings menu. (on vdo.ninja production)\
  ![](<../.gitbook/assets/image (5) (2) (2) (2).png>)

#### February 9 <a href="#august-31" id="august-31"></a>

* Welcome message in vdo.ninja will not auto-clear now, rather there is a close button to clear it
* Fixed an issue with darkmode + [`&avatar`](../advanced-settings/video-parameters/and-avatar.md) (fix via Lindenkron)
* Adding [`&tally`](../advanced-settings/design-parameters/tallyoff.md) will make the tally sign larger and colorize the background of the page, for added emphasis
* The 'loudness' IFrame request will work with the local mic's audio as well; not just remote audio
* [`&chunked`](../newly-added-parameters/and-chunked.md) mode on alpha will work now even if there's no audio included\
  \
  \*\* on vdo.ninja/alpha/

#### February 1 <a href="#august-31" id="august-31"></a>

* Added options for the [`&clock`](../advanced-settings/settings-parameters/and-clock.md) parameter. `&clock=N`, where `N` can be `1` to `9`; each option specifies where the clock will appear on the screen. \*\* on alpha at [`vdo.ninja/alpha/?webcam&autostart&clock=5`](https://vdo.ninja/alpha/?webcam\&autostart\&clock=5)\
  ![](<../.gitbook/assets/image (3) (7) (1).png>)

#### January 31 <a href="#august-31" id="august-31"></a>

* Added [`&record=false`](../advanced-settings/recording-parameters/and-record.md) or `&record=off` (or `session.record=false;` in code) will disable the user from being able to record a video. Buttons for recording are hidden/deleted and the recording function is disabled when used; so the [director](../viewers-settings/director.md) won't even be able to trigger it remotely. (won't stop OBS from recording of course)
* Added [`&distort`](../advanced-settings/audio-parameters/and-distort.md) as a URL parameter for the sender's side, which will try to "distort" your microphone's output audio, making your voice a bit anonymous.
* Added [`&meterstyle=4`](../advanced-settings/design-parameters/meterstyle.md), which should work on any VDO.Ninja link, and it adds `data-loudness=N` as an attribute to the videos. You can use as a CSS target, to apply your own custom CSS on/off/effects for those speaking.
* Our very own @Lindenkron on Discord made their first code contribution to the GitHub; they were able to fix a bug on alpha related to the director's control-box UI.\
  \*\* on alpha/GitHub.

#### January 25 <a href="#august-31" id="august-31"></a>

* Updated the http [API](../general-settings/api.md) getDetails request to include info about video visibility; makes it a bit more usable if querying a scene link\
  ![](<../.gitbook/assets/image (3) (2) (3).png>)

#### January 23 <a href="#august-31" id="august-31"></a>

* Updated GitHub with the current alpha-version of VDO.Ninja (v23-alpha I guess). Also updated GitHub with a formal 'stable' release of the existing v22.9, which is what's been running on production for the last couple months.
* There's new logic added to support secret-auth-tokens for private turn server deployments; this was mainly a contribution by `Jumper` on GitHub.

#### January 21 <a href="#august-31" id="august-31"></a>

* Added a little "pin" icon to the end of the copy/view link when sharing your camera. Pressing it is the same as using [`&sticky`](../general-settings/sticky.md) on your URL, as next time you visit VDO.Ninja it will ask you if you wish to reload your [`&push`](../source-settings/push.md) link. \*\* on alpha\
  ![](<../.gitbook/assets/image (1) (1) (8) (2).png>)

#### January 20 <a href="#august-31" id="august-31"></a>

* Streamlabs mobile support improved, but there are still some users who are not able to see video. I can confirm though, it's working with my Google Pixel 4a now at least.
* If you adjust the resolution on mobile, the frame rate shouldn't change now. I also have the aspect ratio tweaked a bit on android, so if in portrait mode, the aspect ratio is correctly adapted. (I can't say the same for the resolution though, which has a mind of its own still)
* You can change the Buffer of a video on alpha via right-clicking the menu; this has been further improved to its own window with a numerical-input option as well as a slider.
*   I've added a new IRL-related command called [`&cutscene`](../advanced-settings/settings-parameters/and-cutscene.md) (aka, `&lowbitratescene`), which you can use to specify an OBS cut scene to switch to when the bitrate drops below a threshold and return to the original scene when the bitrate recovers. (assuming the cut scene is active; it won't switch back from a scene that isn't the cut away scene)\
    \
    The default bitrate threshold is 300-kbps, but you can use the existing [`&bitratecutoff=N`](../advanced-settings/parameters-only-on-beta/and-bitratecutoff.md) option to specify a custom one. Using [`&cutscene`](../advanced-settings/settings-parameters/and-cutscene.md) with [`&bitratecutoff`](../advanced-settings/parameters-only-on-beta/and-bitratecutoff.md) will override the behaviour of `&bitratecutoff`'s other features. It won't start triggering until the bitrate has hit at least the threshold once. to use:

    ```
    https://vdo.ninja/alpha/?push=XXX
    https://vdo.ninja/alpha/?view=XXX&controlobs&bitcut=300&cutscene=FML&remote
    ```

    You can of course use this with [`&controlobs`](../advanced-settings/settings-parameters/and-controlobs.md)[`&remote`](../general-settings/remote.md), to have the publisher change the scenes dynamically, and see what the current OBS scene is (if still connected).\
    \
    \*\* Note that the OBS Browser source needs the permissions to be set to high, to give VDO.Ninja permissions to change scenes. (on alpha for testing)
* Added a new experimental parameter called [`&maindirectorpassword`](../advanced-settings/director-parameters/and-maindirectorpassword.md), which lets you set a pseudo 'master room password' as a director. It helps avoid getting locked out as the director, if someone else tries to claim the director-role first. ie:\
  `https://vdo.ninja/alpha/?director=ROOMNAME&maindirectorpassword=MASTERPASS` \
  \
  This will add a [`&token`](../advanced-settings/settings-parameters/and-token.md) value to the invite/scene links. This token is used by the guests to check a remote database server to see who currently 'owns' the token; it persists though, even if the director is not connected. When using [`&maindirectorpassword`](../advanced-settings/director-parameters/and-maindirectorpassword.md) as a director, it tells this database that you are the owner, and it will persist even if you aren't connected to VDO.Ninja. The [`&token`](../advanced-settings/settings-parameters/and-token.md) tells the guest to ignore other logic about who the director is, instead using the info provided by the token-lookup to determine whose the director.\
  \
  I may change or revoke this feature, depending on how testing goes this week, as it's rather experimental.\
  \
  \*\* on alpha for feedback

#### January 19 <a href="#august-31" id="august-31"></a>

* [`&autorecord`](../advanced-settings/recording-parameters/and-autorecord.md) can now accept a bitrate as a value, as it wasn't doing so before (on alpha)

#### January 16 <a href="#august-31" id="august-31"></a>

* New [turn server](../general-settings/turn.md) added to Washington DC area.
* [`&website`](../source-settings/and-website.md) as a director now works again (auto shares a website to all guests)
* If multiple mic inputs are selected, they will be auto-selected on page load (rather than just one mic only).\
  \
  \*\* changes on alpha

#### January 12 <a href="#august-31" id="august-31"></a>

* Improved publishing stats when using [`&meshcast`](../newly-added-parameters/and-meshcast.md); server region + external watchURL are available now there.\
  ![](<../.gitbook/assets/image (1) (1) (8) (1).png>)
* [`&screensharevideoonly`](../newly-added-parameters/and-screensharevideoonly.md) will hide the audio selection menu when screen sharing; it will also hide that warning message about no audio selected when screen sharing.
* Fixed some issues with [`&viewwidth`](../advanced-settings/video-parameters/and-viewwidth.md) and [`&viewheight`](../advanced-settings/video-parameters/and-viewheight.md) (works like [`&scale`](../advanced-settings/view-parameters/scale.md), but tries to target certain resolutions instead (also from the viewer's side tho).\
  \
  \*\* pushed to alpha

#### January 11 <a href="#august-31" id="august-31"></a>

* More fixes on alpha; [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) related fixes

#### January 9 <a href="#august-31" id="august-31"></a>

* Re-worked the animation logic for VDO.Ninja; should be much smoother and accurate now.
* When screen-sharing with [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md), you'll now see your screen share preview, in the same way the normal screen share mode works. This allows it to work with custom layouts, as before it was hidden there, too.
* The UI for the director's guest control boxes have been reworked; hoping this makes it easier for external CSS customization.
* Added some added connection stats; initial capture resolution/frame of the remote publisher, along with aspect ratio iframe api updates. This should make it easier for iframe wrappers of VDO.Ninja to have accurate placeholders for incoming video feeds during loading.
* The remote http API sample page was updated to include some recent additional button options, specifically relating to joining/leaving groups.
* Added an option called [`&widget`](../advanced-settings/settings-parameters/and-widget.md), which lets you pass a URIComponent-encoded URL value. It will load a side-bar with that page as an IFRAME embed, with support for YouTube/Twitch specifically added.\
  \-- The director of a room also has the option to enable/disable the widget function for everyone in the room via the room settings menu.\
  ![](<../.gitbook/assets/image (2) (1) (1) (3).png>)\
  \-- This was designed for Twitch / YouTube / Social Stream chat, but could in theory work with any CORS-friendly site, such as a third-party web tool.\
  \-- If the director uses [`&widget`](../advanced-settings/settings-parameters/and-widget.md), it will auto sync that with all guests as they connect. I'll try to find ways to make it easier to resize/minimize in the future.\
  ![](<../.gitbook/assets/image (6) (1) (1) (1) (1) (1).png>)\
  \
  \*\*changes on alpha at vdo.ninja/alpha/

#### January 4 <a href="#august-31" id="august-31"></a>

* Added support for remote PowerPoint slide control. (previous/next slide)\
  \-- Documented things quite a bit here: [https://github.com/steveseguin/powerpoint\_remote](https://github.com/steveseguin/powerpoint\_remote)\
  \-- I've only tested with Windows + PowerPoint so far, but it can be tweaked to work with more than PPT without much trouble.\
  \-- Uses AutoHotKey + VDO.Ninja + MIDI to achieve the result; quite a few different ways implement it, with samples provided\
  \-- built-in basic controller added, via [`&powerpoint`](../advanced-settings/settings-parameters/and-powerpoint.md) (aliases: `&slides`, `&ppt`, `&pptcontrols`)\
  \-- IFRAME sample app provided with larger buttons and sample code to add more custom buttons/actions if needed. (start/stop/etc): [https://vdo.ninja/examples/powerpoint](https://vdo.ninja/examples/powerpoint)\
  \-- HTTP / WSS remote control also added; `https://api.vdo.ninja/YOURAPIKEY/nextSlide` and `prevSlide`\
  \-- Local Streamdeck support also working, via MIDI.\
  \-- YouTube Tutorial: [https://youtu.be/ORH8betTt8Y](https://youtu.be/ORH8betTt8Y)\
  ![](<../.gitbook/assets/image (5) (1) (1) (4).png>)![](<../.gitbook/assets/image (19) (3).png>)\
  \
  \* on alpha at vdo.ninja/alpha/

### 2022

#### **December 30** <a href="#august-31" id="august-31"></a>

* Added [`&groupview`](../advanced-settings/setup-parameters/and-groupview.md), which is the same as [`&group`](../general-settings/and-group.md), except it lets you see those groups without actually needing to join them with your mic/camera. (There's no button in the directors/guest view for this, since there isn't a need yet for that.)
* You can change the view-only groups via the API (HTTP / IFrame) or using the [Comms app](../steves-helper-apps/comms.md), which has been updated with buttons for this option. the HTTP documentation: [https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#api-commands](https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#api-commands)
* You can now use the HTTP/WSS API to both join and leave a group; not just toggle said state. Both the view-group function and regular group function.

#### **December 27** <a href="#august-31" id="august-31"></a>

* Added [`&mididelay=1000`](../advanced-settings/api-and-midi-parameters/and-mididelay.md), which lets you precisely delay the MIDI play-out from VDO.Ninja to your MIDI device when using [`&midiin`](../midi-settings/midiin.md), irrespective of network latency. Use case: If you have a remote drum machine, you can have it play out the beat exactly 4-bars ahead, allowing for music jamming types with even high ping delays between locations.
* Added the option to right click a remote video and add/adjust the [`&buffer`](../advanced-settings/view-parameters/buffer.md) delay for that specific video dynamically.\
  ![](<../.gitbook/assets/image (175).png>)
* Added [`&buffer2=500`](../advanced-settings/video-parameters/and-buffer2.md), which is the same as [`&buffer`](../advanced-settings/view-parameters/buffer.md), but instead also tells the system to include the round-trip-time in the buffer delay calculation. This way 500-ms of buffer on a connection that has a 200ms ping time will result in a smaller 300-ms buffer, leading to an end-to-end playout delay of \~500ms.\
  \-- won't work that well with Meshcast.\
  \-- not super precise, but on a stable connection maybe within 20-ms of flux?\
  \
  \*\* changes on alpha at vdo.ninja/alpha/

#### **December 21** <a href="#august-31" id="august-31"></a>

* Added experimental "[WHIP](../advanced-settings/whip-parameters/and-whip.md)" support to VDO.Ninja, which means in the near future you'll be able to publish directly from OBS to VDO.Ninja without a virtual camera. There's some big caveats to it all, so I don't recommend it over the normal method to most users, but we'll see how it evolves. ([https://vdo.ninja/alpha/?whip=xxx](https://vdo.ninja/alpha/?whip=xxx) + [https://whip.vdo.ninja/](https://whip.vdo.ninja/) + xxx)\
  \
  YouTube tutorial: [https://youtu.be/ynSOE2d4Z9Y](https://youtu.be/ynSOE2d4Z9Y)

#### **December 19** <a href="#august-31" id="august-31"></a>

* [`&fullscreenbutton`](../advanced-settings/settings-parameters/and-fullscreenbutton.md) is improved, so that even when there is a single video on the page, it will show. It also shows more reliably, without needing to move the mouse around a bit to re-show the button after going full screen. Lastly, when used, it now hides the native full-screen button, so users have to use it.\
  \
  Unlike the native full screen button, this full screen mode alternative keeps the chat and control bar overlays visible (like press F11). Since this is probably the preferred way most users will want to full screen to work, I may make it the default mode at some point, after some more testing/feedback. (not supported on iOS/iPhone tho)\
  \
  Changes on alpha for testing at [`https://vdo.ninja/alpha/?fsb`](https://vdo.ninja/alpha/?fsb) (join a room as a guest to trigger)

#### **December 18** <a href="#august-31" id="august-31"></a>

* Fixed a stats (relay vs host vs srflx) issue, where sometimes the incorrect stat appeared.\
  fix on alpha at [vdo.ninja/alpha/](https://vdo.ninja/alpha/)
* Added a small mouse-over tooltip to the candidate type value in the stats menu, to hint at what it means again if needed.
* GitHub updated with the newest code (currently in sync with alpha).
* Made it so mobile won't go to sleep while streaming out audio-only content.

#### **December 11** <a href="#august-31" id="august-31"></a>

* I created a guide + script for offline / local-only deployment of VDO.Ninja, so using it without Internet, connected to a router-only or something.\
  \-- I've tested it on a raspberry pi, and have included the resulting RPI image as well, if you want to quick deploy it, but the guide is pretty simple as well.\
  [https://github.com/steveseguin/offline\_deployment](https://github.com/steveseguin/offline\_deployment)\
  \-- please note: there is already code / instructions for self-deploying VDO.Ninja; this new repo is specifically to help non-techies use VDO.Ninja offline.
* Also fixed a minor issue where specifying a custom handshake server via index.html was adding a needless URL param to all links; pushed that fix to GitHub already.

#### **December 10** <a href="#august-31" id="august-31"></a>

*   Pushed a couple hot fixes for recently found bugs introduced in VDO.Ninja [v22](../releases/v22.md).

    \-- One bug caused mobile phones to push lower than available bandwidth.\
    \-- The second bug had [`&optimize=0`](../advanced-settings/video-bitrate-parameters/optimize.md) sometimes causing video scenes to not correctly load all guests when toggling scenes in OBS.

    \
    These fixes have been pushed everywhere; production, beta, alpha, and github. Thank you for reporting the issues; please report any others you find.

#### **December 9** <a href="#august-31" id="august-31"></a>

* Add [`&clearstorage`](../advanced-settings/settings-parameters/and-clearstorage.md) (aka, `&clear`). This will clear all the saved user preferences for all sessions, including [`&sticky`](../general-settings/sticky.md)'d data, director settings, any camera and microphone settings, and probably a couple other small things. This also includes the "default" saved stated of camera settings before adjusted.\
  I also added a button to manually do this via the User menu settings.\
  ![](<../.gitbook/assets/image (13) (1).png>)\
  \*\* on alpha

#### **December 8** <a href="#august-31" id="august-31"></a>

* Added "change URL" permissions to the [`&consent`](../source-settings/consent.md) flag. That is, when using `&consent` on the guest URL, the director can remotely change the guest's URL without additional permission -- it will just change. (`&consent` already gave the director controls to remotely change mic / camera) \* added to alpha
* Added [`&fakeguests=N`](../advanced-settings/mixer-scene-parameters/and-fakeguests.md) (or `&fakefeeds`) as a parameter. It creates simulated guest videos, based on the value passed to the parameter, using real-guests where possible. The default value is 4.\
  \-- You can use this feature to help position and visualize what [`&cover`](../advanced-settings/view-parameters/cover.md), [`&portrait`](../advanced-settings/view-parameters/and-portrait.md), etc. looks like.\
  \-- This doesn't yet support labels or layouts really, but I welcome feedback.\
  \-- Currently I just threw up a video of me, 16:9, of 500-kbps.\
  \-- You don't actually need to create a room / scene to play with it.\
  ![](<../.gitbook/assets/image (3) (5) (2).png>)\
  \
  \*\* on alpha. try it at: [https://vdo.ninja/alpha/?room=xxxxtestxxxx\&scene\&cover\&square\&fakeguests=7](https://vdo.ninja/alpha/?room=xxxxtestxxxx\&scene\&cover\&square\&fakeguests=7)
* Fixed an issue where the director's last-used saved audio output destination wasn't applying, even though the settings menu should it was selected.
* Made it so the right-click pause video feature works with [`&meshcast`](../newly-added-parameters/and-meshcast.md) streams. Doesn't actually stop the incoming data stream, but it does pause its playback.
* Just pushed beta into production (v22.9) after a week of testing; this had a fix for Meshcast screen sharing and some translation mistakes. Alpha currently is running v22.10.
* [`&smallshare`](../advanced-settings/screen-share-parameters/and-smallshare.md) will work on the scene-side now also, which disables the automixer's larger screen share layout, and instead just uses an equal-sized video layout for all videos. \* on alpha
* Fixed a bug with the 'deafen guest' function in the director's room. \* updated on prod, beta, alpha

#### **December 5** <a href="#august-31" id="august-31"></a>

* Added [`&automute`](../advanced-settings/audio-parameters/and-automute.md), which will auto mute the microphone of a guest when not loaded in an active OBS scene.\
  \-- Useful for perhaps limiting the discussion in a group chat to those on air.\
  \-- `&automute=2` will mute it everywhere, while the default will still allow the director to speak to the guest, even if not in a scene.\
  \-- This is a guest-side URL parameter; you may want to apply it to all guests.\
  \-- Required quite a bit of code reworking; error reporting is on in the console, so please report issues. Feedback also welcomed.
* Fixed the Tally light system. (broke in [v22](../releases/v22.md) I guess)
* The group buttons for the director will appear under their control-box when using active and using [`&showdirector`](../viewers-settings/and-showdirector.md) now, rather than isolating them to the lower control bar.
* Some minor CSS / code tweaks
* Cleaned up some HTML code on director's page to make it a bit easier to modify with custom CSS, by a user's request.
* Improved Firefox support for the director's solo talk and for the new [`&automute`](../advanced-settings/audio-parameters/and-automute.md) function; will need some further testing though.\
  \
  \*\* changes on alpha for testing at [https://vdo.ninja/alpha](https://vdo.ninja/alpha)

#### **December 4** <a href="#august-31" id="august-31"></a>

* Updated the [`&audiodevice`](../source-settings/audiodevice.md) (`&ad`) parameter so it can accept multiple audio devices. `&audiodevice=cam,cable` for example, will select the camlink and virtual audio cable devices as an audio source when joining.
* [`&audiodevice={device name}`](../source-settings/audiodevice.md) will now also now show the selected audio devices before joining, while `&audiodevice=1` or `&audiodevice=0` will still hide the option to change or see audio devices.\
  \
  \*\* pushed to alpha and Beta

#### **December 2** <a href="#august-31" id="august-31"></a>

* [`&noaudioprocessing`](../general-settings/noaudioprocessing.md) is even more aggressive in disabling audio processing effects now, useful for debugging, but breaks a lot of functionality.
* The parameter [`&codec=hardware`](../advanced-settings/view-parameters/codec.md) is added; it's Android-specific and is the same as doing `&codec=h264`[`&h264profile`](../newly-added-parameters/and-h264profile.md), but perhaps easier to remember. Worth trying if your android phone is struggling to publish video at a high enough quality into OBS. I may expand on this feature to be smarter.\
  \
  \*\* changes pushed to alpha for user-testing and feedback. Thank you.

#### **December 1** <a href="#august-31" id="august-31"></a>

* Added `&fullscreenbutton`, aka `&fsb`, adds a full-screen button to the control bar. It essentially just mimics F11, with added support for detecting the Escape button to exit full screen.\
  \-- also while using `&fullscreenbutton`, the previous little 'full window' button in the top-right of videos (if in a group room) will also auto-F11 and isolate that video, rather than just isolate the video.\
  \-- you can still right-click and select "full-window" on any video to isolate it without going full screen, if you need that. -- you can test by opening two such guest links: [https://vdo.ninja/alpha/?fsb\&room=test123123123\&webcam\&autostart](https://vdo.ninja/alpha/?fsb\&room=test123123123\&webcam\&autostart)\
  \-- ultimately I'd like to override the native video full screen button with this behaviour, when `&fullscreenbutton` is used, but I'm still working on that aspect.\
  ![](<../.gitbook/assets/image (7) (1) (1) (1) (1) (1).png>)
* Fixed a bug where the guest screen share, while in broadcast mode, was misplaced on the screen.
* Fixed a bug where [`&language`](../advanced-settings/settings-parameters/and-language.md) didn't work in translating a couple elements, like "join with camera".
* Re-enabled [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) for non-guests, as it was causing me some problems before with versus.cam. It might still be causing issues, so more testing is needed.
* Fixed an issue where changing a system-level audio device duplicated the audio output options during camera/mic setup.
* Fixed an issue where screen sharing as a guest, while someone is sharing a website with you, causes the website to refresh. (In the case of [meshcast.io](https://meshcast.io/), this caused a reconnection loop)\
  \
  \*\* changes on alpha at the moment at, pending more testing.

#### **November 29** <a href="#august-31" id="august-31"></a>

* Patched an issue with VDO.Ninja where the 'page loaded' event didn't always trigger, causing the browser to display an incorrect 'waiting to load' state. This might cause odd behaviors' to the how the page loads now, but should fix issues where OBS custom CSS styles didn't always apply. Please let me know if there are problems, and remember, the previous version of VDO.Ninja at [vdo.ninja/v21/](https://vdo.ninja/v21/) is still available if so.

#### **November 24** <a href="#august-31" id="august-31"></a>

* The recently added [`&audiocodec=pcm`](../advanced-settings/audio-parameters/minptime-1.md) option no longer needs `&insertablestreams` to be used on the sender's side; works with just a viewer-side flag now and works with video.
* [`&audiocodec=pcm`](../advanced-settings/audio-parameters/minptime-1.md) now will support 48khz and 44.1khz mono playback (48khz default), and if [`&stereo`](../general-settings/stereo.md) is used, it changes to two-channel stereo 32khz.
* The existing [`&samplerate=44100`](../advanced-settings/view-parameters/and-samplerate.md) option can lower the sample rate of this pcm mode (down to 8khz even), and hence the resulting audio bitrate. Since pcm is raw, [`&audiobitrate`](../advanced-settings/view-parameters/audiobitrate.md) won't work, so expect 550 to 1200-kbps in just audio bitrates per viewer.
* Fixed a bug with the video-settings sliders in the director room, where changing a setting didn't visually always update the correct feedback input field - fixed a bug where using [`&view=xxx`](../advanced-settings/view-parameters/view.md)[`&novideo`](../advanced-settings/video-parameters/novideo-1.md) didn't display a press-to-play button in the browser.
* Fixed a bug where the self-preview video didn't have the right height when using [`&layouts`](../advanced-settings/director-parameters/and-layouts.md).
* Fixed a bug where if a guest muted their video, and unmuted, it didn't always resize correctly afterwards.
* Fixed a bug where if a guest muted their video, the audio-only spacer box that remained would resize smaller, rather than just staying the same size.\
  \
  \*\* changes have been pushed to production (and beta/alpha)\
  Please report any other bugs.

#### **November 23** <a href="#august-31" id="august-31"></a>

* Added a couple exact presets for the [aspect ratio](../advanced-settings/video-parameters/and-aspectratio.md) setting; should make it easier to precisely crop an incoming guest who doesn't have their smartphone oriented right, or just in case you want to reset the aspect ratio to 16:9, etc.\
  ![](<../.gitbook/assets/image (3) (4) (2).png>)\
  \*\* on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### **November 22** <a href="#august-31" id="august-31"></a>

* Made the [`&clock`](../advanced-settings/settings-parameters/and-clock.md) and timer overlay be something you can 'pop out' and overlay as a native picture-in-picture element; just right-click it and select pop-out from the context menu.\
  ![](<../.gitbook/assets/image (1) (1) (1) (1) (2).png>)![](<../.gitbook/assets/image (2) (8).png>)
* Fixed an issue where the right-click -> edit URL feature in [v22](../releases/v22.md) broke
* Viewer-side [`&audiocodec=pcm`](../advanced-settings/audio-parameters/minptime-1.md) is now available as an audio codec option; this is 32khz, 16bit, mono, and uncompressed, so \~512-kbps bitrate. You'll need the sender to have `&insertablestreams` applied to their URL for this to work currently, as it requires the sender to enable a special mode that allows for custom codecs. This is very experimental at the moment, so its still a WIP.
* `&micsamplerate` (`&msr`) added, which lets you specify the capture audio sample rate. Also added purely for experimental reasons; I don't recommend touching.\
  \
  \*\* All these changes are on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/), which I'll push into production pending user testing.

#### **November 19** <a href="#august-31" id="august-31"></a>

* Some advanced audio-related VDO.Ninja updates:\
  \-- I show the audio codec now used in the stats, along with whether audio forward error correction (FEC) is on or not (on by default)\
  ![](<../.gitbook/assets/image (6) (2) (2).png>)\
  \-- [`&nofec`](../advanced-settings/audio-parameters/minptime-3.md) on the viewer side can disable FEC.\
  \-- [`&audiocodec`](../advanced-settings/audio-parameters/minptime-1.md) on the viewer side can let you specify the audio codec; `opus` (default), `pcmu`, `pcma`, `isac`, `g722` and `red`\
  \-- [`&audiocodec`](../advanced-settings/audio-parameters/minptime-1.md)`=red` is pretty much sending two opus streams, with one as a backup in case of packet loss; support in Chromium 97 and up, but the only way I can so far tell that it is working is to check if the audio bitrate has doubled\
  \-- [`&dtx`](../advanced-settings/audio-parameters/minptime-2.md) (aka, `&usedtx`), is also now functional (viewer side). Using this flag will turn off the audio encoder automatically when no little to no sound is detected. The VDO.Ninja default uses a dynamic audio bitrate mode ([`&vbr`](../advanced-settings/view-parameters/vbr.md)), but using [`&dtx`](../advanced-settings/audio-parameters/minptime-2.md) takes things to the next level. It might be useful as a very mild noise-gate I suppose?\
  \-- Also fixed a couple minor bugs, such as no play button appearing when using [`&view=StreamID`](../advanced-settings/view-parameters/view.md)[`&novideo`](../advanced-settings/video-parameters/novideo-1.md)\
  \
  \*\* changes on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## [Version 22 Release](../releases/v22.md) <a href="#august-31" id="august-31"></a>

#### **November 18** <a href="#august-31" id="august-31"></a>

* ![](<../.gitbook/assets/image (3) (1) (5).png>)\
  For better or worse, I updated Production (VDO.Ninja) to version v22.6 ... up from v21.4.\
  IF HAVING PROBLEMS suddenly, please do a hard-browser refresh. This includes in your browser and the OBS browser source, if using that. The previous [v21](../older-releases/v21.md) release can still be found at [https://vdo.ninja/v21/](https://vdo.ninja/v21/), if you want to go back. [Release notes](../releases/v22.md) coming soon.
* I separated [`&sync`](../advanced-settings/view-parameters/sync.md) and [`&buffer`](../advanced-settings/view-parameters/buffer.md), so audio-sync isn't auto-enabled when `&buffer` is specified in the URL. I was finding `&sync` was causing some audio clicking issues, as adjusting audio playback speed isn't easy; you have a choice now. Use `&buffer` and `&sync` together or standalone items.
* Fixed an issue with iPhones where changing the camera caused your own preview video to go small.
* [`&screensharebitrate`](../newly-added-parameters/and-screensharebitrate.md) now works outside of group rooms, even with basic push/view links.

#### **November 16** <a href="#august-31" id="august-31"></a>

* Added the "[mic delay](../source-settings/and-micdelay.md)" option as a slider to the director's control; it's available by default, with up to 500-ms of delay ready. If you make use of it, it will "enable" the [`&micdelay`](../source-settings/and-micdelay.md) web audio node remotely if not yet on, which might cause a clicking sound. Hoping that this though can help with problematic guests who might be out of sync. This is not the same as [`&buffer`](../advanced-settings/view-parameters/buffer.md) or [`&sync`](../advanced-settings/view-parameters/sync.md) delay, which are a view-side parameters.

![](<../.gitbook/assets/image (3) (1) (4).png>)

* [`&micdelay`](../source-settings/and-micdelay.md), if used on a basic push link, will show the mic delay as a slider now also. So you can adjust it as needed. I don't show the slider by default unless using the URL parameter, as I don't think its a commonly used feature.\
  ![](<../.gitbook/assets/image (4) (2) (1).png>)
* I think I fixed an issue with Firefox where not all the audio-output devices were available to choose from, at least on desktop, and so I've added the custom logic Firefox requires to get it working. On Firefox, you'll now need to select "Show more options" in the audio drop down menu, where Firefox will prompt you to select the audio output device with its own prompt.\
  ![](<../.gitbook/assets/image (9) (3).png>)
* Added an option called [`&hidehome`](../advanced-settings/settings-parameters/and-hidehome.md), which hides the VDO.Ninja homepage and many links that lead to it. You can also enable at a code level with `session.hidehome=true;`, which is useful if doing a self-deployment, where you don't want anyone to stumble onto the site and start using it. You'll still be able to join push links and create rooms via URL parameters, but that's about it.\
  \
  \*\* updated alpha (vdo.ninja/alpha) and GitHub with all changes.

#### **November 15** <a href="#august-31" id="august-31"></a>

* Added the [`&clock`](../advanced-settings/settings-parameters/and-clock.md) parameter, which shows the current time in the lower right; this can be applied to pretty much all link types.\
  ![](<../.gitbook/assets/image (1) (8).png>)\
  \-- The director has a button that lets them enable the clock for everyone in the room (via the director's room settings button).\
  \-- [`&clock=false`](../advanced-settings/settings-parameters/and-clock.md) or [`&cleanoutput`](../advanced-settings/design-parameters/cleanoutput.md) will force-disable the clock from being remotely triggerable.\
  \-- The director has a button that lets them also enable a global count-down timer. Holding CTRL + click will let the director pause the timer. If someone joins the room or reloads, the timer will also be reloaded, in sync. Button also in the room settings menu.\
  ![](<../.gitbook/assets/image (3) (3) (1).png>)\
  \-- This count down timer is the same concept as the per-guest timer the director already has, and will actually conflict with it if both are used, since it uses the same state/variable to keep track of time remaining.\
  \-- The director will see the global count down timer also; it will just be a bit smaller on screen.\
  ![](<../.gitbook/assets/image (1) (1) (1) (3).png>)
* For VDO.Ninja, right-clicking a video and selecting "audio output destination" should work again. I had to disable that feature for a bit, as some users were reporting audio issues with it enabled. It might have some compatibilities issues, but it won't activate now unless used.
* When using the special [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) screen share mode (screen share with better echo cancellation), support for recording that local screen share, at the same time as as the main video, has been added. You'll need to use the [`&autorecord`](../advanced-settings/recording-parameters/and-autorecord.md) feature to trigger the recording, and when it does start recording, a button will appear specific to stopping that screen recording if needed.\
  ![](<../.gitbook/assets/image (14) (1).png>)
* I improve the [`&buffer`](../advanced-settings/view-parameters/buffer.md) and [`&sync`](../advanced-settings/view-parameters/sync.md) feature a bit -- it will activate and sync up faster now, which might be helpful on unstable connections.
* I haven't been able to validate it works, but I think I added support for H265 (HEVC) to VDO.Ninja; the catch is it might only work between two iPhones running the experimental H265 WebRTC support currently; maybe [Raspberry Ninja](../steves-helper-apps/raspberry.ninja/) in the future. I haven't managed to make it work yet though, so its just hypothetical support.\
  \
  \*\* This is all on alpha, at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/). I'm definitely feeling its time to push this code into production soon, so if you get a chance to do any tests on alpha (maybe mobile / load testing?), it will help speed up the release. Thank you.
* Applied a small hotfix to production related to iPhones, specifically in response to iPhone 14 issues. If anyone encounters problems with using iPhones on production, including issues with muting, let me know.

#### **November 11** <a href="#august-31" id="august-31"></a>

*   Added a new URL parameter. [`&directoronly`](../advanced-settings/video-parameters/and-directoronly.md) (`&do`). This is just the same as doing [`&view=DirectorStreamID`](../advanced-settings/view-parameters/view.md), but without having to know the stream ID for the director.

    \-- It will actually connect to any director, including co-directors, not just the main one.

    \-- [`&view`](../advanced-settings/view-parameters/view.md), [`&include`](../advanced-settings/mixer-scene-parameters/and-include.md), [`&exclude`](../advanced-settings/view-parameters/and-exclude.md) have a lower priority to `&directoronly`. So if there are two directors, you can do `&directoronly&exclude=coDirector123`, so that the [codirector](../director-settings/codirector.md) doesn't connect.

    \-- I changed the toggle in the director's room for "Guests hear others" from [`&view=`](../advanced-settings/view-parameters/view.md) to [`&directoronly`](../advanced-settings/video-parameters/and-directoronly.md). The point of this change is that the director can now still talk to those in the room.

    \-- Purpose of change: I had a user who wanted [`&broadcast`](../advanced-settings/view-parameters/broadcast.md), but also not have the guests hear each other. It's a bit of a hassle to do [`&view=DirectorStreamID`](../advanced-settings/view-parameters/view.md), and the toggle is labelled to be misleading by saying "guests", not "everyone".

    \-- You can use `&directoronly` to replace [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) if you don't want the guests hearing each other.\
    ![](<../.gitbook/assets/image (8) (6).png>)\
    \
    \*\* change is on alpha for testing and feedback. [https://vdo.ninja/alpha/?directoronly](https://vdo.ninja/alpha/?directoronly)

#### **November 8** <a href="#august-31" id="august-31"></a>

* Added a 'cycle visual styles' button to the "users" settings menu in VDO.Ninja (and [Comms app](../steves-helper-apps/comms.md)) \
  \
  This lets you toggle the [`&style=N`](../advanced-settings/design-parameters/style.md) options, between 1,2,4,5,6 I think?\
  \
  So if you find it distracting, the waveform in the [Comms app](../steves-helper-apps/comms.md) or such, you can toggle as a guest.\
  ![](<../.gitbook/assets/image (1) (2) (1) (2).png>)\
  \
  \*\* Change is on alpha at [vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### **November 7** <a href="#august-31" id="august-31"></a>

* Fixed some issues with the 'last used' audio output device saving feature, as it was not always triggering fully on page reload. The selected output device didn't always match the actual output device, in some cases, after a page reload.\
  \-- note: I don't load the last-used 'saved' output device if loading a scene/view link, unless its set in URL param, as I just found it was too confusing as there was no obvious way to check what the default audio output device was in that case.
* When using [`&vd=videoDevice`](../source-settings/videodevice.md), the name matching order now sorts based on NameStartsWith, then ExactDeviceID, and then finally NameIncludes. This should avoid the Streamlabs OBS Virtual Cam being selected when you actually want the OBS Virtual Camera being selected, as the two devices both contain `obs virtual camera` in their name. It was causing me grief at least.
* Couple minor bugs, like the right-click "show control bar" option not toggling the menu option in the UI properly when the control bar is visible.\
  \
  \*\*\* changes on alpha for testing and feedback. Thank you

#### **November 5** <a href="#august-31" id="august-31"></a>

* Fixed an issue where the transfer-function for co-directors wasn't a bit broken; transfers were only partially completed. The fix for this should be on alpha now at [https://vdo.ninja/alpha](https://vdo.ninja/alpha)

#### **November 4** <a href="#august-31" id="august-31"></a>

* Pushed a workaround for a nasty iOS bug that is impacting iPhone 14 Pros.\
  Fix is on production and alpha; [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)\
  Please report any issues it might cause.

#### **November 3** <a href="#august-31" id="august-31"></a>

* Fixed a bunch of co-director sync logic, which was a bit buggy before, but I think I got the issues out.
* Updated the video stats code with the newest spec; Chrome was deprecating the API I was using.
* Added stats support for Firefox, including support for it in the speed-test, the guest check app, and stats pop-up.
* `CTRL + click` support to access the stats pop-up added to Firefox (before you had to right click and select "show stats" from the menu).\
  \
  \*\* changes applied to alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### **November 1** <a href="#august-31" id="august-31"></a>

* [`&controlbarspace`](../advanced-settings/settings-parameters/and-controlbarspace.md) forces the bottom control bar to be in its own dedicated space, regardless of screen size.
* [`&volumecontrol`](../advanced-settings/audio-parameters/and-volumecontrol.md) (alias, `&vc`) shows a dedicated local audio-volume control bar for canvas or image elements. Video elements already have a control-bar with volume, so I don't show it there currently. I'll likely tweak this more over time.\
  ![](<../.gitbook/assets/image (8) (2).png>)
* Fixed an issue with [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) crashing the browser when specifying an audio track to share.\
  \
  \*\* changes are at vdo.ninja/alpha/\
  The [Comms app](../steves-helper-apps/comms.md) is a good demonstrator of the features @[vdo.ninja/alpha/comms](https://vdo.ninja/alpha/comms)

#### **October 30** <a href="#august-31" id="august-31"></a>

* Deployed a turn server to Seoul, SK. on beta & alpha

#### **October 28** <a href="#august-31" id="august-31"></a>

* Added more 'visually impaired' meta data to help with assisted readers\
  \*\* on vdo.ninja/alpha/

#### **October 26** <a href="#august-31" id="august-31"></a>

* Added [`&labelsuggestion=defaultnamehere`](../advanced-settings/setup-parameters/and-labelsuggestion.md) (aka, `&ls`)\
  \
  This is the same as [`&label`](../general-settings/label.md), except it asks the user still for a user name. If they leave it blank or cancel the prompt asking for a name, it will use the default label.\
  [https://vdo.ninja/alpha/?ls=guest\&webcam](https://vdo.ninja/alpha/?ls=guest\&webcam)\
  \
  Once the user enters their label, `&label=username` is added to the URL, so if they reload, they won't be asked again for the label. `&label` takes priority over `&labelsuggestion`.\
  \
  This is on vdo.ninja/alpha for testing/feedback
* Fixed an issue where [`&activespeaker`](../advanced-settings/view-parameters/activespeaker.md) and [`&showlist`](../source-settings/showlist.md) and [`&style=6`](../advanced-settings/design-parameters/style.md) wasn't working together as expected
* Updated vdo.ninja/beta/ , so it's now in sync with alpha

#### **October 24** <a href="#august-31" id="august-31"></a>

* Added [`&groupmode`](../advanced-settings/setup-parameters/and-groupmode.md) to VDO.Ninja, which changes the way groups work when not in a group. \
  \
  With `&groupmode` added to your URL, when not assigned to a group, you don't hear or see anything. This also goes for remote participants who are not in a group - you will not see or hear them if they are not in a group, even if you also are not in a group.\
  \
  The default normally with VDO.Ninja is that if not in a group, you see and hear everyone. This remains true if not using `&groupmode`, even if others in the room are. Others may not be able to see or hear you though, if they have `&groupmode` enabled, and you haven't picked a group. So, `&groupmode` only impacts the local user, and will not impact remote connections.\
  \
  \*\* changes are on alpha. Please report bugs.

#### **October 10** <a href="#august-31" id="august-31"></a>

* Added [`&layouts=[[{xxxxxx}]]`](../advanced-settings/director-parameters/and-layouts.md) as a URL parameter option, where you can pass a set of different layouts (as a URL-encoded ordered array) to VDO.Ninja. (\*\* on alpha)\
  \
  This is akin to using the [vdo.ninja/beta/mixer](https://vdo.ninja/beta/mixer), to visually set layouts, but instead you are just manually setting all the available layouts directly, bypassing the mixer app.\
  \
  Once you have set the layouts, the "layout" API feature becomes a bit more useful, as you can remotely activate any of those layouts with a simple API command.\
  \
  I documented the 'layout' API option a bit here, but the tl;dr; is that you can either use this API call to set a layout from within the array of layouts that are set, or you can pass a full-fledge layout-object, for on-the-fly custom layouts.\
  \
  ie: `{action:'layout',value':5}` or `{action:'layout',value':[{xxxx.layout-stuff-here.xxxx]]}`\
  \
  fyi, the layout and the API in general work with the [vdo.ninja/beta/mixer](https://vdo.ninja/beta/mixer) page, so you can use it to create the layouts, and then manually switch between them via the API. The API is streamdeck-friendly.\
  \
  [https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#custom-layout-switching-](https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#custom-layout-switching-)
* [`&meshcastbitrate`](../meshcast-settings/and-meshcastbitrate.md) works again; some recent chrome updates I think broke it a bit, but it's fixed now. This lets you set the Meshcast bitrate higher than 2500-kbps via VDO.Ninja. (Please set sparingly, with targets limited to just what's needed)
* The director's "request" microphone/output change button has a "refresh" option now, which doesn't require a user's permission to use. It will "refresh" the currently active microphone/speaker output, which might solve issues with unexplained sudden audio loss. (the 'refresh' will reconnect the audio pipeline for that device, so if it crashes, this can potentially fix it\
  \-- fyi, this already was an option for the video device.\
  \-- if using the [`&consent`](../source-settings/consent.md), then the buttons will now say "apply", instead of "request", as you don't need to request a change in that case.
* Fixed some niche audio issues where if loading canvas-only view links (no video, just audio) are loaded in Chrome/Firefox, with [`&style=2`](../advanced-settings/design-parameters/style.md) set, the audio didn't play due to auto-play problems. With this fix it will now play the audio, although you'll still need to click the screen first. Before it got a bit stuck, even if clicking the screen.\
  \
  \*\* changes on alpha at vdo.ninja/alpha/

#### **October 8** <a href="#august-31" id="august-31"></a>

* Custom groups used by remote guests now show in the director's view, just like custom scenes do.\
  \-- If you use [`&groups=group,test,vdo`](../general-settings/and-group.md), new group buttons will appear\
  \-- By default, groups 1 to 6 are there\
  \-- If you use `&groups=1,2,3` , you'll auto-join groups 1, 2 and 3\
  ![](<../.gitbook/assets/image (171).png>)

#### **October 2** <a href="#august-31" id="august-31"></a>

* Fixed a couple minor bugs with VDO.Ninja, such as the [`&consent`](../source-settings/consent.md) message on dark-mode not being easily read.
* Improved the API for remote controlling mute/add2scene/etc for guests. True/false and 'toggle' work as values now; before just toggle worked for guest-specific calls.\
  (changes on alpha)

#### **September 27** <a href="#august-31" id="august-31"></a>

* Updated the 'create reusable link' page a bit; added the option for "generate host link also", which sets things up for a simple two-way interview format.\
  ![](<../.gitbook/assets/image (1) (9).png>)
* [`&welcomeimage`](../advanced-settings/setup-parameters/and-welcomeimage.md) added; this lets you specify a welcome image (URL) that appears for a few seconds before fading away once a guest joins.\
  ie: `https://vdo.ninja/alpha/?welcomeimage=https://vdo.ninja/alpha/media/old_logo.png&webcam`\
  \
  \*\* on alpha

#### **September 26** <a href="#august-31" id="august-31"></a>

* Updated the screen-share layouts to have a larger screen, relative to the other videos: It now targets an average of around 80% screen real-estate for the main screen share.
*   Up to 20-videos on screen now are supported in the screen-share view; before after around 12-videos they started to be hidden

    ![](<../.gitbook/assets/image (3) (1) (3).png>)![](<../.gitbook/assets/image (5) (2) (2) (1).png>)\
    ![](<../.gitbook/assets/image (2) (2) (3) (2).png>)![](<../.gitbook/assets/image (4) (1) (1) (2) (1).png>)\
    \
    \*\*changes on alpha (vdo.ninja/alpha/) and github

#### **September 23** <a href="#august-31" id="august-31"></a>

* Firefox won't playback stereo audio as stereo by default now; it will require the [`&stereo`](../general-settings/stereo.md)/[`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) flag to enable stereo playback. [`&mono`](../advanced-settings/view-parameters/mono.md) also works with Firefox now, allowing you to use `&proaudio&mono` with Firefox. (this was just a quirk of Firefox's default settings vs Chrome that I long needed to address)
*   **M**ade the little upload arrow in the top-right color coded in response to the detected 'average' upload connection quality; won't be supported by all browsers, but most.\
    ![](<../.gitbook/assets/image (5) (1) (3) (1).png>)

    \
    \*\* updated both alpha and beta.

#### **September 21** <a href="#august-31" id="august-31"></a>

* When using [`&waitimage`](../advanced-settings/newly-added-parameters/and-waitimage.md), the specified 'waiting to connect' image will appear after all connections end. This is a bit different than the default behaviour of the spinner, which doesn't re-appear, but I assume if you're advanced enough to use the `&waitimage` option, you're okay with this.
*   Added the option to "draw on the screen", which might be a useful tool for niche use cases where you might need to take notes, etc. It doesn't affix to videos themselves, but rather it's just a full-window transparent canvas overlay, You can start/stop/clear and select a couple style-types with this feature, via the settings -> User menu. You can also do `CTRL + ALT + D` to toggle this as needed.\
    ![](<../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)\


    \*\* on alpha at vdo.ninja/alpha

#### **September 19** <a href="#august-31" id="august-31"></a>

* With VDO.Ninja, if using [`&stereo`](../general-settings/stereo.md), `&s` , `stereo=5`, or [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md), I'm now showing a little check-box that the guests themselves can check to set their mic input to MONO mode.\
  \
  While there's a few different ways to set a mic to mono mode, they aren't always obvious to people I'm finding, especially when using `&proaudio`/`&stereo` mode. For example, some guests will appear in the left or right-audio channel, due to their mic/interface setup. It's not always obvious on how to fix this when about to go live, so I'm hoping this helps avoids those situations.\
  \
  \-- It won't interfere with the screen share modes, so they will be stereo still\
  \-- It won't show if using `&stereo=1`, as that is explicitly stereo since a value is passed.\
  \-- The guest can toggle it on and off in the settings, without needing to go into any advanced audio settings\
  \-- The remote director can still use the existing "channel count' in the advanced audio settings to override this button, unless the guest toggles it back on\
  \-- There's several other ways to set mono mode of course, including [`&monomic`](../advanced-settings/audio-parameters/and-monomic.md), [`&inputchannels=1`](../advanced-settings/audio-parameters/and-inputchannels.md), [`&stereo=3`](../general-settings/stereo.md), channelCount, [`&mono`](../advanced-settings/view-parameters/mono.md) (playback), [`&ec&dn&ag`](../guides/audio-filters.md), and within OBS/Windows itself.\
  ![](<../.gitbook/assets/image (3) (1) (1) (2) (1).png>)![](<../.gitbook/assets/image (1) (1) (1) (3) (1).png>)\
  \
  \*\* updated on to alpha at vdo.ninja/alpha/

#### **September 17** <a href="#august-31" id="august-31"></a>

* [`&waitimage`](../advanced-settings/newly-added-parameters/and-waitimage.md) now has its wait image 'fit' to the screen, and [`&cover`](../advanced-settings/view-parameters/cover.md) will have it 'cover' the screen.
* [`&waitimage`](../advanced-settings/newly-added-parameters/and-waitimage.md) now works with scene links; not just basic view links.\
  (\*\* on alpha)

#### **September 16** <a href="#august-31" id="august-31"></a>

* Simplified the connection type wording in the stat's menu , plus made the publisher's connection type available to the viewer's side so you can more clearly see now if a guest has ignored your request to use Ethernet.\
  ![](<../.gitbook/assets/image (16) (2).png>)\
  \*\*\* Changes on alpha at vdo.ninja/alpha/

#### **September 12** <a href="#august-31" id="august-31"></a>

* Added [`&effects=7`](../source-settings/effects.md) (or `&effects=zoom`), which will provide a manual zoom option in the effects menu. (you can also select the zoom mode via the effects menu, if available)\
  ![](<../.gitbook/assets/image (2) (4) (1).png>)
* Added [`&getfaces`](../advanced-settings/settings-parameters/and-getfaces.md) on the viewer link (or `{getFaces:true}` via the IFrame API), which will request a continuous stream of face bounding boxes, for all inbound videos and all faces contained within. The data is transmitted to the parent IFRAME, and this data can be used for moving the IFrame window around, if you wish to make your own custom face-tracker or whatever else.\
  ![](<../.gitbook/assets/image (11) (1) (2) (1) (1).png>)
* [`&effects=1`](../source-settings/effects.md) on the sender side (or `&effects=facetracking`) will auto-center the user's face in the center of their video, zooming in as needed. It takes a moment to initiate, but it offers a gentle PTZ-like effect.\
  \-- note: I previously had `&effects=1`, but it wasn't that good, so this is a more polished attempt. It's also available from the effects drop down menu now as a selectable option, as before I was hiding it.\
  ![](<../.gitbook/assets/image (3) (1) (1) (2) (3).png>)\
  \-- important note: Both `&getfaces` and `&effects=1` requires the use of the Chromium experimental face detection API, as I'm using the built-in browser face-tracking model for this. You can enable the API flag here: `chrome://flags/#enable-experimental-web-platform-features` My hope is that this feature will eventually be enabled by default within Chromium, as loading a large ML model to do face detection otherwise is a bit heavy; you may need to enable this within the OBS CLI if wishing to use it there?\
  \*\*\* Changes on alpha at vdo.ninja/alpha/

#### **September 9** <a href="#august-31" id="august-31"></a>

* Added mobile touch support to the tap-to-focus (only mouse support previously).
* Minor issue with drag-to-zoom fixed.
* Fixed issue with not being able to reset video settings to default after changing them.
* [`&autohide`](../parameters-only-on-beta/and-autohide.md) works better now; also on mobile, the `&autohide` makes the control bar transparent on timeout, to avoid conflicts with tap-to-zoom/focus logic.
* It's easy to adjust video settings on mobile, as there is a large space to scroll without accidentally clicking a setting slider. Also more bottom padding, making it easier to click close in landscape mode.
* Made the [`&sticky`](../general-settings/sticky.md) redirect confirmation prompt less ugly, and I now don't ask if the URL already matches the saved session's URL.
* Made some changes/fixes to the recently new switchMode ([`&previewmode`](../advanced-settings/director-parameters/and-previewmode.md)) function of the director room (hopefully no bugs?).\
  \*\* changes on alpha @ vdo.ninja/alpha/

#### **September 7** <a href="#august-31" id="august-31"></a>

* Added some notice icons to the PTZ controls, which show a tooltip on hover that explains remote PTZ only works if the remote window is visible.\
  ![](<../.gitbook/assets/image (1) (1) (3) (1).png>)
* made the audio / video director control settings scrollable (max height \~500px), so you can more easily see the video while making changes to it.\
  ![](<../.gitbook/assets/image (8) (2) (1).png>)
* Increased the size of Canadian and German turn relay servers (4x larger), and completed other backend maintenance.

#### **September 6** <a href="#august-31" id="august-31"></a>

* [`&showconnections`](../advanced-settings/settings-parameters/and-showconnections.md) will display the total number of p2p connections of a remote stream. Works with the director's room and the automixer. Might help give comfort over privacy/security during a stream.
* Total number of p2p remote connections (viewers) of a stream source will also appear in the stats menu, even without [`&showconnections`](../advanced-settings/settings-parameters/and-showconnections.md). Could be useful for debugging CPU/bandwidth issues.
* Connections may represent video/audio streams, or just a data-connection. Meshcast-hosted streams might not be accounted for, depending on how the viewer is connecting.\
  ![](<../.gitbook/assets/image (10) (1) (2) (1).png>)
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

* Added a button in the director's room. It lets you toggle between a Preview layout and the normal Director layout; the Preview layout will mirror what a basic [`&scene=0`](../advanced-settings/view-parameters/scene.md) link would look like. Useful if you want to switch to a guest-like mode as a director, and then switch back as needed to the director's room to make adjustments. - to enter this mode by default, [`&previewmode`](../advanced-settings/director-parameters/and-previewmode.md) can be used by the director \*\* on alpha at vdo.ninja/alpha/\
  ![](<../.gitbook/assets/image (1) (2) (4).png>)
* [`&noisegatesettings`](../advanced-settings/audio-parameters/and-noisegatesettings.md) has been added to vdo.ninja/alpha/, which is used in conjunction with [`&noisegate`](../source-settings/noisegate.md). This feature lets you tweak the noise-gate's variables, making it more or less aggressive as needed. example:\
  `https://vdo.ninja/alpha/?noisegate&noisegatesettings=10,25,3000`\
  It takes a comma separated list:\
  \-- First value is target gain (0 to 100), although 0 to 40 is probably the recommended range here\
  \-- second value is the threshold value where the gate is triggered if below it. \~ 100 is loudly speaking, \~ 20 is light background noise levels, and under 5 is quiet background levels.\
  \-- third value is how 'sticky' the gate-open position is, in milliseconds. Having this set to a few seconds should prevent someone from being cut off while speaking or if taking a short pause.

#### August 25

* Added new sender-side parameters that can customize how you want VDO.Ninja to balance resolution vs frame rate, specifically when bitrate or CPU is insufficient to offer both at the same time.\
  \-- for video, [`&contenthint=detail`](../advanced-settings/video-parameters/and-contenthint.md)\
  \-- for screen-shares, [`&screensharecontenthint=motion`](../advanced-settings/screen-share-parameters/and-screensharecontenthint.md), which will override [`&contenthint`](../advanced-settings/video-parameters/and-contenthint.md) for just screen-shares if set also.\
  The two options for video are `detail` or `motion`. Screen shares generally tends towards `detail` by default, and camera sources are tend towards `motion` by default. `detail` will try to prioritize resolution over frame rate, so the frame rate may drop a lot used. `motion` will try to maximize frame rate, but may drop the resolution a lot. There's no way to force both on as there's no magic bullet if your CPU or network cannot keep up. note: If using [`&codec=vp9`](../advanced-settings/view-parameters/codec.md) on the viewer side, the frame rate may drop as low as even 5-fps.\
  \-- Also for audio, I've added [`&audiocontenthint=music`](../advanced-settings/audio-parameters/and-audiocontenthint.md) The two options are `speech` and `music`. No idea what it does exactly, but when using `music` there seems to be a fixed bitrate of 32-kbps sent out by default, where as with `speech` it is variable, using less bandwidth when not speaking.\
  These parameters have been tested on Chrome, but other browsers may vary in behavior. Safari seems to just ignore things, for example. \*\* changes on alpha

#### August 23

* Updated the translation files on GitHub and on vdo.ninja/alpha/, so recently added UI elements can have alternative translations added
* Custom scenes will now be sorted based on alphanumerical value. (rather than order of connection). \*\* on alpha\
  ![](<../.gitbook/assets/image (1) (2) (5).png>)

#### August 22

* When you toggle the customize-scene-link function as a director, some of those items will now be applied to the guests' solo link also. (just the ones I think are relevant)
* [`&sharper`](../advanced-settings/video-parameters/and-sharper.md) and `&sharpen` are now aliases of [`&dpi=2`](../advanced-settings/view-parameters/dpi.md), which should 'up to' double the amount of playback video resolution, if the dynamic resolution optimization is enabled at least, in certain cases. This is a lot like [`&scale=100`](../advanced-settings/view-parameters/scale.md), but perhaps _slightly_ more efficient in some cases. This is mainly for when you intend to have a large screen-shares in a scene, where you don't want the tiny guest videos to be a 100% scale, but 50% scale is fine (up from 25% scale). `&dpi` already exists on production, but by adding these aliases, I hope it's more discoverable.
* As an alternative to `&sharper`, I've also added [`&sharperscreen`](../advanced-settings/screen-share-parameters/and-sharperscreen.md), which sets `&scale=100`, but _only_ for screen-shares. (virtual cameras not included). This is probably even more efficient than `&scale=100` or `&sharper`, and it's designed for when screen-sharing a lot of text. Text looks a bit soft when streaming video at 1:1 pixel resolution.\
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
  \*\* on alpha.\
  ![](<../.gitbook/assets/image (7) (1) (1) (2) (1).png>)
* Added [`proxy.vdo.ninja/alpha/`](https://proxy.vdo.ninja/alpha/) as an alternative to `vdo.ninja/?proxy`. If's a more user-friendly version of [`&proxy`](../newly-added-parameters/and-proxy.md). \*\* Just on alpha for now

#### August 16

* [`&activespeaker=3`](../advanced-settings/view-parameters/activespeaker.md) and `4` added; which are the same as `1` and `2`, except it will not switch to show audio-only sources (just video only). As a recap, active speaker mode shows the person(s) who are actively speaking, and hides those who aren't.
* Fixed a bug/race condition in Chrome where the web-audio audio effects pipeline and having to 'click-to-play' didn't always unmute all the audio. (`&activespeaker` mode when viewed as a scene, in chrome, for example. Wasn't an issue in OBS)
* Changed chunked mode a small bit, so the video stream uses the same frame rate and resolution of the original video source, rather than a fixed resolution/frame rate.
* Chunked mode should work with audio-only or video-only tracks now
* Solo links are setup to use [`&solo`](../advanced-settings/mixer-scene-parameters/and-solo.md) instead of `&scene` now; it's the same outcome, except `&solo` tells the system not to apply custom 'layouts' to them. Links updates in the director's room and the mixer app.\
  \*\* changes on the alpha version of VDO.Ninja at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)
* Added details on how to fix camera permissions denied, improving the messaging with an image and doc link. \* on alpha\
  ![](<../.gitbook/assets/image (1) (7).png>)

#### August 11

* Right clicking the screen-share icon will give you an option to open the screen share in a new tab, all pre-configuerd. Useful if you want to share multiple windows while in a group room, or don't want to see your own screen share while talking to others.\
  ![](<../.gitbook/assets/image (3) (3) (1) (1) (1).png>)
* Bugs with [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) have been resolved, I think. (this mode supports desktop-audio capture without echo issues)

#### August 9

* [`&aspectratio`](../advanced-settings/video-parameters/and-aspectratio.md) now works with screen shares, so you can force crop an incoming screen share to be a certain aspect ratio. If [`&screenshareaspectratio`](../advanced-settings/screen-share-parameters/and-screenshareaspectratio.md) is used, (`&ssar`), it will apply to just screen shares. If `&ssar` does not have a value passed, it's assumed to be set as "default", which overrides `&aspectratio` option, if used also. \*\* on alpha, ie: vdo.ninja/alpha/?ar=2.0

#### August 6

* The API / IFRAME sandbox page for developer using VDO.Ninja got a style update and facelift by @Sam MacKinnon Ty,\
  \* it's on alpha at [https://vdo.ninja/alpha/iframe](https://vdo.ninja/alpha/iframe) and GitHub.\
  ![](<../.gitbook/assets/image (6) (4).png>)

#### August 5

* When the director talks to you in solo-talk mode, the other guests in the room now drop to 25% volume. This way the guest the director is talking to can hear the director more clearly. (by request) \* on alpha, [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### August 3

* [`&hidecodirectors`](../advanced-settings/director-parameters/and-hidecodirectors.md) will hide the co-directors from appearing in the director's room. You might have a few co-directors join you, but they might be taking up space, so this is a way to prevent that. It simply hides the boxes; they are still there at a code level.
* Added [https://updates.vdo.ninja/](https://updates.vdo.ninja/), which will mirror the updates from this discord 📑│updates channel, which should be helpful for those not using Discord to see development progress. (basic, but will undergo more updates). The Discord in general has been undergoing improvements; the mods here have been working hard to keep the discord and documentation functional, so thank you to them.
* Added [`&mobile`](../advanced-settings/upcoming-parameters/and-mobile.md) and [`&notmobile`](../advanced-settings/upcoming-parameters/and-notmobile.md) as a couple options to vdo.ninja/alpha/ I already have [`&flagship`](../advanced-settings/upcoming-parameters/and-flagship.md), [`&noscale`](../newly-added-parameters/and-noscale.md), and [`&forceios`](../advanced-settings/mobile-parameters/and-forceios.md) as a few options to configure mobile devices, but mobile/notmobile are more generic options that will optimize a guest/push link based on whether VDO.Ninja thinks they are a smartphone or not. `&mobile` might help reduce CPU issues, and `&notmobile` might be able to improve video quality (in case you want to override the automatic defaults, which already detects if a device is mobile or not).

#### August 1

* Chat messages that contain URLs will now have those URLs be clickable (opens into a new window)\
  ![](<../.gitbook/assets/image (1) (1) (2) (1) (1).png>)
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
  \-- The menu button can also be added manually, for even guests, using [`&controlobs`](../advanced-settings/settings-parameters/and-controlobs.md)\
  \-- [`&obsoff`](../advanced-settings/design-parameters/and-obsoff.md) can be used to set permissions to fully off (also disables tally light and scene optimizations tho) when added to the OBS browser source link.\
  \-- The OBS instance still needs [`&remote={optional-passcode-here}`](../general-settings/remote.md) added to the URL for remote commands to work. If \&remote is left blank, it gives anyone permissions to control it. If a value is passed to `&remote`, the sender needs to have a matching \&remote value or manually enter they need to manually enter passcode in the pop up control menu.\
  \-- If the OBS browser source has its permissions set to something other than full (lower than level 5), the control menu will still show what info it has -- current scene, recording/streaming state, etc; depending on level. The lower the level, the less info is available to show; can't remotely change anything though.\
  \-- It supports multiple OBS instances and will label them according to the [`&label=xxx`](../general-settings/label.md) value set on the scene/view link, or whatever the unique connection ID is.\
  \
  All this is on alpha, at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)\
  ![](<../.gitbook/assets/image (2) (1) (4) (1).png>)![](<../.gitbook/assets/image (3) (5) (1).png>)

#### July 23

* The [`&webp`](../advanced-settings/view-parameters/webp.md) mode has been modified a bit. Main change is that you now enable it by add `&webp` to the sender's URL, and [`&codec=webp`](../advanced-settings/view-parameters/codec.md) to the viewer's URL (otherwise, it falls back to normal video mode). No need for \&broadcast anymore. (as a reminder, this mode sends the video as a series of low-quality images, rather than a more efficient video stream).
* I've removed the toggle in the director's room for this `&webp` feature, as [`&chunked`](../newly-added-parameters/and-chunked.md) mode is replacing its purpose there, but you might still want to use this mode when the viewer-side does not support video playback or hardware acceleration. Specifically, this option lets you bring motion images (aka, crude video) into the Streamlabs mobile app, as a browser source, where other forms of video decoding is not supported.
* I've also created a new viewer-side option called [`&slideshow`](../advanced-settings/video-parameters/and-slideshow.md) . This option decodes incoming video (first video to load), but plays them back as series of full-window images. That is, a single image element, that gets updated 24 times a second, instead of playing the video back within an efficient video element. I have no idea why you might want this option, as it pretty crude up and uses up a lot of CPU, but you can right-click to save a single frame from the video to disk, as a PNG file. This might be useful if you need to take a lot of snap shots of some video and don't want to have to hassle with cropping a window-grab. Quality of the images is pretty high; near lossless.\
  \*\* on alpha\
  ![](<../.gitbook/assets/image (5) (1) (2).png>)

#### July 21

* The [`&grid`](../advanced-settings/design-parameters/grid.md) overlay option now works in non-room mode
* Added the toggles for `&grid` and [`&avatar`](../advanced-settings/video-parameters/and-avatar.md) to the director's link customization section.
* Added [`&smallshare`](../advanced-settings/screen-share-parameters/and-smallshare.md) as a new option, which makes the screen share behave like a webcam share. ie: not larger in size vs other windows, for the publisher or the viewers. This is a push-side parameter. This is useful if a VR guests screen sharing an app of themselves, versus using a virtual camera. It can also be useful for gaming, where a larger screen share might bog down the system of the sender more than needed.\
  \*\*\* on alpha at vdo.ninja/alpha/

#### July 20

* Updated the local audio controls to have a NOISE GATE option.\
  \-- This is a new noise gate, that lowers your mic volume to 10% of its current value based on volume-level activity. If you haven't made a significant sound in few seconds, the noise gate kicks in, and will re-enable when a significant noise is detected. It will take about 300-ms for the volume to recover once the noise triggers it back on, which can be a small bit harsh/distracting at times.\
  \-- [`&noisegate`](../source-settings/noisegate.md) or `&noisegate=1` (`&gating`/`&ng`) will enable it by default (if using it in a room, currently); and `&noisegate=0` will hide the option from the menu.\
  \-- The older existing `&noisegate=1` option I moved to `&noisegate=4`, as this new version is replacing it. I'm keeping the older version around as an option though.\
  ![](<../.gitbook/assets/image (7) (1) (1) (3) (1) (1).png>)
* Fixed some of the labels for the local audio labels; camel-case is replaced with words, and true/false replaced with on/off.
*   Fixed an issue where iPhones's video output would freeze when the director would feature-highlight any other participant.

    \*\* on alpha at vdo.ninja/alpha

#### July 19

* Added the ability to "tap to focus" when a camera supports focusing. You'll want to switch the camera over to manual focus (via settings->video->focusMode) before it will be active, but then you can just touch on the screen to have it auto-focus on that spot. Note: It's a bit slow and not 100% accurate and may conflict with the zoom, if used. **on alpha at vdo.ninja/alpha**
* Improved the advanced video settings; focus, exposure, white-balance. The auto and manual modes are now a checkbox, and I worked out a few of the odd behaviour issues that Chrome + Logitech webcams were having when try to set modes/values. \*\*\* on alpha at vdo.ninja/alpha\
  ![](<../.gitbook/assets/image (2) (1) (5).png>)

#### July 16

*   Added an option to post a snapshot of your local camera to a HTTPS/POST URL (blob/jpeg)\


    ```
    https://vdo.ninja/alpha/?postimage=URL_TO_POST_IMAGE_TO_AS_BLOCK&postinterval=INTERVAL_IN_SEC
    ```

    \
    so, for example, [`https://vdo.ninja/alpha/?postimage=https%3A%2F%2Ftemp.vdo.ninja%2F&postinterval=30`](https://vdo.ninja/alpha/?postimage=https%3A%2F%2Ftemp.vdo.ninja%2F\&postinterval=30) posts to a sample test server I have up. The URL is URL encoded, but not always necessary.\
    \
    If posting to my test server, the image can be accessed at `https://temp.vdo.ninja/images/STREAMID.jpg`. There's caching enabled mind you, so you'll want to post-fix the current timestamp to the URL to disable that per request.\
    \
    For example, `https://temp.vdo.ninja/images/yiMkpMg.jpg?t=3412341234`\
    \
    This feature could be useful to checking out a stream before actually connecting to it, as that's my intent with it, but it is also something you can use with Octoprint, where you need an IP camera jpeg source as input.\
    \
    \*\* on alpha, at [`https://vdo.ninja/alpha/`](https://vdo.ninja/alpha/)

#### July 14

* The [`&website`](../source-settings/and-website.md) function now lets you start/stop and change website sources; no longer is it just one site and that's it. (only the director previously could change websites constantly). I suppose you could use this to remotely change inputs in an OBS browser source via a remote website, as I think the YouTube implementation supports synced playback/scrubbing.
* There's toggle in the director's room now to add [`&scale=100`](../advanced-settings/view-parameters/scale.md) to the scene links. Might improve sharpness a bit, at the cost of increased CPU/network load.
* Fixed an issue where if a guest was viewing the director in full-window mode, and the director changed the total room bitrate value, the new [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) value would be ignored by that guest until they exited the full-window mode.
* Also fixed an issue where if setting a custom total room bitrate value higher than 4000 via the URL ([`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md)), the slider to adjust the TRB value will be extended so the max range is that of the URL value if higher than 4000.\
  \
  \*\* on vdo.ninja/alpha/ for testing.

#### July 10

* Tweaked the mic meter on vdo.ninja/alpha (3x more intense) and added a visual meter to the settings menu; should help judging if you're mic is active easier. (by request)
* In case curious, I've been working on quite a few core-components and larger new features for VDO.Ninja this week. ie: chunked video improvements, IFrame API enhancements, refactoring code for future ui dev efforts, and some invite management features. I'll probably update more on those things once they are further along or complete.

#### July 3

* Unless manually specified ([`&screensharequality`](../source-settings/screensharequality.md) or [`&screenshare`](../source-settings/screenshare.md)), I have the screen share resolution matching the webcam resolution now. This avoids a sudden CPU spike when screen sharing; still room for improvement tho.
* For the time being, I have [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) only applying to guests, rather than all viewers. I need to revisit this at some point soon.\
  \
  \*\* changes on alpha

#### July 1

* The WSS API (wss://api.vdo.ninja) has been expanded to include hang up events for publishers, along with viewer-side events for incoming connections/streams. These efforts will lead to a richer StreamDeck integration.
* Add [`&background`](../advanced-settings/design-parameters/and-background.md), which accepts a URL-encoded image URL to make as the app's default background. For example, [`https://vdo.ninja/alpha/?appbg=./media/logo_cropped.png`](https://vdo.ninja/alpha/?appbg=./media/logo\_cropped.png) . The image will scale in size to cover the VDO.Ninja app's background. [`&chroma`](../advanced-settings/design-parameters/chroma.md) can still be used to set the background color, if using transparencies. There already exists [`&bgimage`](../advanced-settings/design-parameters/and-bgimage.md), which will set the default background image for videos; this however will set a background image for the entire page.\
  ![](<../.gitbook/assets/image (2) (5) (1) (1).png>)\
  \
  \*\* These changes are on alpha

#### June 30

* Fixed a bug with [`&statsinterval=100`](../advanced-settings/parameters-only-on-beta/and-statsinterval.md) not updating on sender side (only viewer side before). This updates how frequent the stats updates.
* Added the ability to dynamically change the scale of a video to the IFRAME API. accepts scale, plus optionally uuid or a stream ID as a a target.
* Added [`&base64js`](../advanced-settings/design-parameters/and-base64js.md), which lets a user add raw java script to the URL to run on page load. `https://vdo.ninja/alpha/?jsb64=YWxlcnQoJ2hpJyk=` to test.\
  \
  \*\* changes on alpha

#### June 28

* Added support for [`&buffer`](../advanced-settings/view-parameters/buffer.md) and [`&sync`](../advanced-settings/view-parameters/sync.md) to the viewer when using [`&chunked`](../newly-added-parameters/and-chunked.md) mode on the sender. If on an unstable connection, setting the buffer to a few seconds can help avoid pauses in the video playback, as there will be some buffer to use. (a bit experimental still -- so it might be more a WIP still ).
* Added a new url param called [`&include`](../advanced-settings/mixer-scene-parameters/and-include.md), which is like [`&view`](../advanced-settings/view-parameters/view.md), except it's for including streams that do not exist in the room you are in, assuming those streams are not in another room and have matching passwords. So, useful for adding basic push-streams that you might want to be in multiple rooms at the same time, but not actually be locked to any room. (`&view`, conversely, is pretty exclusive; that or nothing.)
* Been playing around a new flag called [`&flagship`](../advanced-settings/upcoming-parameters/and-flagship.md), which will optimize the mobile experience for more capable smartphones; essentially, streaming higher quality video to other guests versus the normal mobile-performance mode.
* I've also modified the non-flagship mode, for low-end mobile devices, to use the [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) flag by default (500-kbps). [`&limittotalbitrate`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) hasn't been that heavily tested yet, but it's part of v22 and might be better than [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md); currently I'll increasingly use them together I think though. They are both the same concept, except one is viewer-side controlled, and the other is sender-side controlled; both limit the bitrate that guests in the room see based on the number of guests in the room.\
  \
  \*\* changes to alpha, at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

#### June 25

* The api.vdo.ninja remote control API is expanded to send push event notifications to web-socket listeners when the local mic/speaker/camera is muted. This was added on request for making the bitfocus companion app smarter about keeping track of mute states. (on alpha)

#### June 16

* Option to randomly generate a room name has been added to the room-creation page - minor fixes to the mixer have been applied; (lots more to do)
* [`&aspectratio`](../advanced-settings/video-parameters/and-aspectratio.md) + [`&crop`](../other-parameters.md) (sender side options) has been updated to work with more camera/sources. If you do `vdo.ninja/alpha/?webcam&aspectratio=0.5625` for example, you'll get portrait mode. Not compatible with Safari though.
* Video/audio stats for Firefox have been improved; resolution, framerate, codec, bitrate.
* [`&meshcastcodec=h264`](../meshcast-settings/and-meshcastcodec.md) won't fail when using Firefox and Meshcast
* [`&chunked`](../newly-added-parameters/and-chunked.md) recording in the director's room works correctly\
  \
  \*\* These changes are on beta @ vdo.ninja/beta

#### June 9

* Viewers of [`&meshcast`](../newly-added-parameters/and-meshcast.md) streams can use [`&buffer=500`](../advanced-settings/view-parameters/buffer.md) now; on alpha

#### June 8

*   When screen sharing, if the resolution that's requested by the viewer is roughly 100% full scale, (a value based on their window viewing size), the system will now snap the resolution up to 100% (like [`&scale=100`](../advanced-settings/view-parameters/scale.md)). This should help with video sharpness (text, etc), when the added burden of slightly more CPU load is worth it. Won't snap if the different is great though.

    \
    For example, if a viewer is on a 720p display, watching 1080p content from a director, that's not close enough to make it worthwhile for the director to send 1080p. But if the viewer's window was 1050p, then sending the full 1080p video is worthwhile. This is mainly because scaling seems look nicer when done on the viewer's end, instead of the sender's side.

    \
    Only applies to screen shares, as text-scaling is kind of ugly, and it seems to be commonly desired to make fonts less ugly when screen-sharing. Scaling will still occur, but it won't be as ugly when done by the viewer. Sending 100% all the time works too, via `&scale=100`, but is pretty inefficient and needlessly heavy on the CPU in most cases.
* Fixed on issue where is screen sharing as a director, before turning on your camera, didn't show the screen for guests always.
* If the director isn't a performer, I've added the option to still add a director to/from groups. The group buttons show up in the control bar; where you can add them either via \&groups=1,2 or via the api.vdo.ninja / companion service.\
  \--- Toggling the director in/out of a group via the API is new. (NULL targets director).\
  \--- If [`&showdirector`](../viewers-settings/and-showdirector.md) is used, it will not use the control-bar for group buttons 1 to 8\
  \--- It technically is possible to use groups via the API or URL other than 1 to 8, but I only offer buttons to add guests to groups 1 to 8.\
  ![](<../.gitbook/assets/image (84).png>)
* Using the [`&api`](../general-settings/api.md) remote API option, you now can get STATE values as the reply to a GET/POST/WSS request.\
  So if you do `https://api.vdo.ninja/c6sWHN9zzX/group/null/1`, with `&api=c6sWHN9zzX` added to the director's URL, you will toggle the director in and out of GROUP 1.\
  The response of the HTTP GET request though will be `true` or `false` or `timeout`, based on whether the director was added to the group, removed from the group, or whether it failed. This new feature can be used with a Streamdeck (or other controller) to have the button's color of the Streamdeck match the state of the action.\
  [https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#callbacks--state-responses](https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#callbacks--state-responses)\
  ![](<../.gitbook/assets/image (15) (2).png>)\
  \
  \*\*\* This is only supported on vdo.ninja/alpha/ currently

#### June 7

* When holding `CTRL` and selecting multiple videos to record as a director (in control room), it won't ask for the video bitrates multiple times now; just once for all the selected videos. (this hot fix has been applied to production and beta). This feature is useful for recording multiple videos in sync.

#### June 6

* Fixed an issue where if you did `right-click -> record` of a inbound-video, and then hung up without stopping the recording, the recording wouldn't stop and finalize. (on alpha)

#### June 4

*   Added the ability to have multiple unique audio output destinations per VDO.Ninja instance.

    \
    To use at the moment, right-click a VDO.Ninja video in chrome/edge/electroncapture, (on the alpha-version of VDO.Ninja), and you'll see a menu option to change the audio output destination. This selected output destination overrides the default audio output destination set in the VDO settings menu, and it's specific to just the video that you right-clicked.

    \
    This option allows you to have one audio stream output to a virtual cable, and another output to your headset, for example.

    \
    Over the next few days I will probably change up how the menu works, as its pretty crude right now,. This feature also doesn't work in Safari/Mobile or if audio processing is disabled, so that UX aspect needs work. Hoping it's a good start for now though; testing welcomed.\
    ![](<../.gitbook/assets/image (57).png>)\
    \*\* on vdo.ninja/alpha/

#### June 2

* [`&sensor`](../source-settings/sensor.md) now also includes speed and altitude data (on production)
* Added a demo/sample on how to overlay speed + acceleration on top of video playback (compatible with a mobile phone sender) `vdo.ninja/examples/sensoroverlay?view=STREAMID`
* Added a new option to explicitly list what sensor data you want to capture and transmit, when using `&sensor` [`&sensorfilter=gyro,lin,acc,mag,pos,ori`](../advanced-settings/settings-parameters/and-sensorfilter.md) For the above demo, you can use [`&sensorfilter=pos,lin`](../advanced-settings/settings-parameters/and-sensorfilter.md) to just send the data you need, reducing the load on the phone/network. (on alpha)
* Right-clicking a link in VDO.Ninja will now offer the option to show the link as a QR Code. This makes it easy to copy any link over to a your mobile phone or to create a shareable QR code with guests. (on alpha)\
  ![](<../.gitbook/assets/image (2) (6) (1).png>)![](<../.gitbook/assets/image (1) (9) (1).png>)
* Implemented a workaround for a novel Chrome bug where specifying a custom audio channel in the director's room (C1, C2, etc) would break the custom audio output device support. \* Fix pushed to alpha.

#### June 1

* Added the [`&meshcastscale`](../advanced-settings/upcoming-parameters/and-meshcastscale.md) (`&mcscale`) parameter; this will scale down the Meshcast video output via the URL, post camera capture setup. Because of how Meshcast works, this is a sender-side parameter. You may wish to use this to lower the resolution if your camera has a fixed capture resolution. (Alternatively, if you need to dynamically adjust the resolution, that option already exists via camera settings via width/height slider adjustments) `https://vdo.ninja/alpha/?meshcast&mcscale=50`
* Fixed a conflict when using [`&director`](../viewers-settings/director.md) parameter + [`&webcam`](../source-settings/and-webcam.md)/[`&website`](../source-settings/and-website.md)/[`&screenshare`](../source-settings/screenshare.md) parameters at the same time (the later parameters get disabled now, avoiding conflicts)
* If using a view-push link combo, just to be safe, I have the viewer re-request unloaded streams automatically at a interval now. For unattended viewing sessions.
* Pausing a video while it is in 'full window' mode, will actually pause it now.
* Added a "channelCount" option to the audio controls, which will let the director/sender toggle between Stereo and Mono audio channels, _IF_ [`&stereo`](../general-settings/stereo.md)/[`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) is added to the sender's URL and the sender supports +2-channels. So, if you're using `&stereo` on your guests, and you can only hear one of your guests on the left or right channel, you can use this to down-mix their microphone to a mono channel only.\
  \
  Due to some tricky technical challenges, this feature involves down mixing with web-audio nodes, and stereo can't be enabled if `&stereo` isn't in the URL. It might also make all audio from that guest mono at the moment. (adding [`&mono`](../advanced-settings/view-parameters/mono.md) to the view URL also works, but that will make all sources in the view link mono)\
  ![](<../.gitbook/assets/image (2) (5) (1).png>)\
  \
  \*\* all updates on alpha at [`https://vdo.ninja/alpha`](https://vdo.ninja/alpha)

#### May 27

* Improved logic for determining best turn server to use, if needed. (on alpha)

#### May 23

* Deployed a new turn server in Poland; it's only yet available on alpha. `https://vdo.ninja/alpha/speedtest`\
  ![](<../.gitbook/assets/image (159).png>)
* Two large broadcast servers enabled on production, in France and Canada.\
  ![](<../.gitbook/assets/image (163) (1).png>)

#### May 21

* Added new viewer-side parameters that can be used in place of `&scale`; [`&viewheight`](../advanced-settings/video-parameters/and-viewheight.md)=180[`&viewwidth`](../advanced-settings/video-parameters/and-viewwidth.md)=320, (aka `&vw`/`&vh`) which effectively does the same thing as `&scale`, but instead you pass a resolution.\
  \-- It's important to note, that due to flexibility to request width/heights that are not aspect-ratio compatible, and due to bitrate/quality resolution limitations, these values are just 'max' target resolution values; the actual resolution you get could be still less. They also do not impact the actual capture resolution of the remote sender's camera, so its purely for requesting a specific downscaled resolution. This command applies to all video elements in a view port, and it disables the auto-scaler functionality.\
  \-- Similarly, also added the option to the IFRAME API to request different down-scaled resolutions dynamically, per connection, if you want greater programmatic control vs static URL options.\
  This is on alpha at vdo.ninja/alpha/?vw=300

#### May 20

* Added options to host your own default background images for the virtual background effect;\
  \-- [`&imagelist=xxxx`](../advanced-settings/video-parameters/and-imagelist.md) can be used to pass a list of images via the URL. Code to generate the list properly can be found here: [https://jsfiddle.net/steveseguin/w7z28kgb/](https://jsfiddle.net/steveseguin/w7z28kgb/) (images must be cross origin enabled)\
  \-- At the base of index.html, if self-hosting VDO.Ninja, you can hard-code the list of images as well.\
  \-- Related: when selecting a background image, you'll get a gentle glow around the selected image now. There's also a horizontal scroll bar, if the number of images listed are too much to fit.\
  \*\* changes on alpha at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)\
  ![](<../.gitbook/assets/image (161).png>)

#### May 19

* Made a new bitrate option called [`&maxbandwidth`](../advanced-settings/video-bitrate-parameters/and-maxbandwidth.md), which differs from other commands as it leverages a chromium (chrome/edge/brave/electron) feature to judge the available bandwidth of a sender's connection. Passing a value to it as the sender (a percentage; 1 to 100 ideally), you can try to ensure the connection never uses more than that amount of the available reported bandwidth. (on alpha) So the notion is, if you want to set the invite link bitrate to 50-mbps, but one guest only has only a 20-mbps connection, `&maxbandwidth=80` will try to limit the bitrate to around 16-mbps. I sometimes will tell people to set the bit rate to about 80% of what their connection can allow, as higher than that can result in some frame stutter when there is packet loss, since the connection lacks headroom to recover. This command will try to do it automatically, for all the viewers of a stream. My goal here is to use it with the mixer or stats app, so eSports users can crank out high bitrates with less tinkering per guest. I have no idea how well it will work in practice so far.
* Fixed an issue where the director's mic audio could cut out after stopping the screen share, depending on how the screen-share was cancelled. - added [`&showall`](../advanced-settings/design-parameters/and-showall.md) (or [`&style=7`](../advanced-settings/design-parameters/style.md)), which will include non-media-based push connections as video elements in a group room. This can include guests that joined without audio/video, directors, or a data-only connection, like maybe MIDI-output source. - to help avoid some types of connections showing up when using `&showall`, I've also added a [`&nopush`](../advanced-settings/settings-parameters/and-nopush.md) mode, which blocks outbound publishing connections. This acts a bit like a `&scene=1` link, so unless `&showall` is added, you'll need to use the IFRAME API to show/hide videos in it. (also just on alpha atm)

#### May 16

*   Stats for Meshcast will now appear in the director's scene stats section and the new stats page; by request

    (unlike normal stats, these Meshcast stats are just for the meshcast ingest, and not for the re-broadcast to the viewers. it also means you will see the meshcast stats even if no viewer/scene is yet connected.)\
    ![](<../.gitbook/assets/image (168).png>)
* You can now also close the scene-options section, but have the stats stay visible (if active), as a director now also. (freeing up some space)\
  ![](<../.gitbook/assets/image (170).png>)

#### May 15

* Beta updated with all recent updates and new mixer updates. Find it at: vdo.ninja/beta/

#### May 14

* I now try to alert the user when they have disabled webRTC; some privacy extensions or nanny-guard software might do it in a way that I can detect.\
  ![](<../.gitbook/assets/image (164).png>)

#### May 11

* [`&remote`](../general-settings/remote.md), if used on a push link without a password added, it will now allow the remote viewer limited control (hangup, focus, zoom, detailed stats), even if they don't have `&remote` added to their URL also.
* When using [`&remote`](../general-settings/remote.md), the option to "reload" the remote browser is now available, so you can potentially reload a remote unattended session that contains [`&autostart`](../source-settings/and-autostart.md)[`&webcam`](../source-settings/and-webcam.md)\
  ![](<../.gitbook/assets/image (2) (7).png>)\
  \
  \*\* all changes on alpha @ vdo.ninja/alpha/

#### May 8

*   Had a request to add mirror + flipping of video itself, rather than just via CSS. (as full-screen support was needed). I already had [`&effects=2`](../source-settings/effects.md) for mirroring the actual video itself, so I've added two more modes that can flip and flip+mirror. Might be useful for teleprompter work.

    ```
    https://vdo.ninja/beta/?effects=-1 flips
    https://vdo.ninja/beta/?effects=-2 flips + mirrors
    https://vdo.ninja/beta/?effects=2 mirrors
    ```
* I've added experimental support for local Media Recordings to iPhone/iPad devices. ([`&record`](../advanced-settings/recording-parameters/and-record.md) may work now, etc)
* The iPad/IPhone needs to have "MediaRecorder" enabled in its "experimental webkit features" Safari settings section
* The user will have to click "download" once the recording has finished to actual save the file -- The resulting file is still a webM file, which the iPhone itself won't be able to play, but will play fine elsewhere.\
  ![](<../.gitbook/assets/image (156).png>)
*   I've included numerous pop-up warning messages to ensure the 'experimental' part is communicated\


    \*\* on vdo.ninja/beta/ (all current code is up to date on beta)
* [`&bgimage=`](../advanced-settings/design-parameters/and-bgimage.md) can be used to set the default image avatar, when using [`&style=0`](../advanced-settings/design-parameters/style.md) or `&style=6`. This only impacts what the person with the parameter added sees and must be either a URL or a base64 data image/SVG. URL-encoded values. on alpha ie: [https://vdo.ninja/alpha/?view=aSmexM6\&style=0\&nocontrols\&bgimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Fold\_icon.png](https://vdo.ninja/alpha/?view=aSmexM6\&style=0\&nocontrols\&bgimage=https%3A%2F%2Fvdo.ninja%2Fmedia%2Fold\_icon.png)\
  ![](<../.gitbook/assets/image (157).png>)
* [`&controls=0`](../advanced-settings/newly-added-parameters/and-videocontrols.md) \[`off`/`false`] or [`&nocontrols`](../advanced-settings/settings-parameters/and-nocontrols.md), will force hide the video control bar. (on local dev atm)
* Added the option to set a dedicated hold-to-talk key to VDO.Ninja; `CTRL+M` can work in place of this still by default, but this lets you set a custom combo/key that doesn't act as a mute toggle at all (if just tapped accidentally) \*\* This is on alpha\
  ![](<../.gitbook/assets/image (169).png>)

#### May 5

* When using the [`&remote`](../general-settings/remote.md) control option, the viewer can now remotely hang-up the sender via the right-click menu. The sender needs to remote control enabled for this to work of course. \*\* on local dev, coming to beta soon.\
  ![](<../.gitbook/assets/image (2) (1) (1) (2) (2).png>)

#### May 4

* When you "full screen" a video using the native browser-full screen button, it will now behave the same way as the full-window solo button now. (increases the resolution of the target video, and lowers the bitrate of the others, now hidden, videos.). \* on beta/dev branches

#### May 3

* Made [`&totalbitrate`](../advanced-settings/video-bitrate-parameters/and-totalbitrate.md) (`&tb`) set both [`&totalscenebitrate`](../advanced-settings/video-bitrate-parameters/and-totalscenebitrate.md) and [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) flags. Not quite sure how well it will work, but since a scene and a guest are exclusive possibilities, it's a bit of a flexible way to just learn one flag to do it all, as I realize all the options can get confusing.\
  \
  `&trb` and `&tsb` limit the total incoming bitrate, dividing up the bandwidth available to each video being played back. There are nuances in differences, with the main one being `&trb` is for a guest link and `&tsb` is for a scene/view link.\
  (on local dev for now, pending more testing)
* Added another security option, for those concerned about random spying of their streams. Add [`&prompt`](../advanced-settings/settings-parameters/and-prompt.md) to the push link to enable. (or `&approve`/`&validate`)\
  \
  What it is: After a new peer viewer connection is established, but before the video/audio streams start getting sent to that new viewer, a prompt will appear asking the publisher if they wish to send their stream to that viewer. If they say no, the remote viewer is disconnected and no video/audio is sent to them. If they have `&label=xxx` added to their view link, that label will appear as the display name. Otherwise, if no label is available, a random ID representing that connection is shown.\
  \
  There's nothing stopping a disconnected viewer from re-joining and re-asking, causing some grief, and spoofing an identify isn't too hard, but it gives you some control and warning to block unexpected viewers.\
  \
  In the future, I can add this control to the director, rather than just the senders, and add additional ways to check identities. For now though, it's a start.\
  ![](<../.gitbook/assets/image (166).png>)\
  \
  \*\* on vdo.ninja/alpha/ for testing

#### May 2

* Added graphs to the director room; one graph for each scene a guest is connected to. If video isn't active/visible, the bitrate should be zero, implying VDO.Ninja has it paused/disabled, but on standby. You can see the graphs via the "scene stats" button. Toggling the button will enable and disable the stats.\
  ![](<../.gitbook/assets/image (165).png>)
* The graph is color coded; red/yellow implies packet loss, but otherwise green. Currently the graph is capped to like 4-mbps; higher than that isn't display atm.\
  ![](<../.gitbook/assets/image (1) (1) (6) (1).png>)\
  \
  \*\* alpha updated. Test it out at [https://vdo.ninja/alpha](https://vdo.ninja/alpha)
* Fixed a more recent bug in VDO.Ninja where the special [`&sstype=3`](../newly-added-parameters/and-screensharetype.md) screen share mode did not work as solo links; stats for it were not always cleaned up either, so that's fixed too. (on dev)
* Added manual-input fields for the camera/audio setting sliders. Both for director + push links. You can enter by hand values, rather than using the sliders. Also made "aspect ratio" and "frame rate" available options. \*\* on vdo.ninja/alpha\
  ![](<../.gitbook/assets/image (158).png>)![](<../.gitbook/assets/image (162).png>)

#### April 26

* \*\* Beta updated will all recent changes, including mixer. (vdo.ninja/beta) I'm considering this upcoming release as version 22.

#### April 25

* [`&midi`](../midi-settings/midi.md) offers the option to mute the local speaker output now (deafen yourself). Change is on production as a hot patch. Specifics here: [https://docs.vdo.ninja/advanced-settings/api-and-midi-parameters/midi#and-midi-1](https://docs.vdo.ninja/advanced-settings/api-and-midi-parameters/midi#and-midi-1)

#### April 23

* Added [`&disablehotkeys`](../advanced-settings/settings-parameters/and-disablehotkeys.md) to VDO.Ninja (hot patched), to allow for hotkeys (like `CTRL + M`) to be disabled.
* [`&notify`](../source-settings/and-notify.md) works with basic view/push link combos; before it only beeped when a guest joined a room. (on alpha)
* [`&nohangupbutton`](../advanced-settings/settings-parameters/and-nohangupbutton.md) (aka, `&nohub`), has been added to VDO.Ninja (hot patched). This option hides the hang-up button, so it can't be accidentally clicked.

#### April 19

* Selected audio and video devices are remembered automatically on reload/refresh, without needing a URL parameter. On alpha for now. [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)
* Added the ability to select an image, instead of a video device. The image will trigger when the video is muted or no video device is selected. A default avatar image is provided, but you can select your own from disk. [`&avatar`](../advanced-settings/video-parameters/and-avatar.md) is the flag that enables this option. - `&avatar=default` will pre-select the default avatar, rather than leaving it un-selected [https://vdo.ninja/alpha/?avatar](https://vdo.ninja/alpha/?avatar) (on alpha for now)\
  ![](<../.gitbook/assets/image (3) (3) (1) (1).png>)
* [`&js`](../advanced-settings/design-parameters/and-js.md) is a new parameter for VDO.Ninja that lets you pass a third party hosted Javascript file URL (URL-encoded), allowing for custom code injection without self-hosting, IFrames or chrome extensions. On VDO.Ninja, by user request.

#### April 18

* Deployed a TURN server to Mumbai, India.

#### April 17

* [`&minipreview`](../source-settings/and-minipreview.md) and [`&grid`](../advanced-settings/design-parameters/grid.md) (rule of thirds) parameters work together now (local dev of VDO.Ninja)

#### April 12

* [`&mcsscodec=h264`](../meshcast-settings/and-mcscreensharecodec.md) should now work correctly independently of [`&meshcastcodec`](../meshcast-settings/and-meshcastcodec.md). (These features let you select the codec / profile ID of the encoder that gets used when publishing video to Meshcast via VDO.Ninja.) \*\* code updated on beta (vdo.ninja/beta)
* Added [`&autorecordlocal`](../advanced-settings/recording-parameters/and-autorecordlocal.md) and [`&autorecordremote`](../advanced-settings/recording-parameters/and-autorecordremote.md), which will record just the local video or the remote videos, respectively, automatically on their initial load. Using just [`&autorecord`](../advanced-settings/recording-parameters/and-autorecord.md) will do both. This all applies to the director, guest, scenes, and whatever really.\
  \-- You can stop/restart recordings as needed via the right-click menu per each video for now, until I can design a nicer UI for managing multi-recording state at least.\
  \-- You can pass the default recording bitrate as a value to the parameter, like you might if using [`&record`](../advanced-settings/recording-parameters/and-record.md). (\*\*on beta)

#### April 10

* Setting [`&h264profile=0`](../newly-added-parameters/and-h264profile.md) (or `false`/`off`/`default`), will now have the h264 profile be left as the default browser default when the sender is an android. (currently I rewrite the h264 profile for android devices when h264 is used, but advanced users might want the default)
* I rewrote a large part of the auto-mixer to support borders around videos ([`&border=10`](../advanced-settings/design-parameters/and-border.md)), as well as fixed the [`&rounded=10`](../advanced-settings/design-parameters/rounded.md) parameter to crop videos better. Also, I added [`&bordercolor=FFFFFF`](../advanced-settings/design-parameters/and-bordercolor.md) (hex or color name), to allow for changing the color of the border.\
  ![](<../.gitbook/assets/image (11) (1) (3).png>)\
  \
  \*changes on alpha, [https://vdo.ninja/alpha](https://vdo.ninja/alpha) (on alpha, since it was a large code rewrite and so needs a bit more testing, but it has been lightly tested)

#### April 7

* Added chrome notification popups when guests join the room (when using [`&notify`](../source-settings/and-notify.md)). This requires both Windows + Chrome notification permissions to be allowed (Chrome will ask, but Windows will not, if already disabled). \*on alpha (vdo.ninja/alpha) as a code preview and committed to a branch on GitHub (by request)

#### April 6

* The [`&screensharequality`](../source-settings/screensharequality.md) parameter applies to all three types of screen sharing types, not just secondary-share. Before [`&quality`](../advanced-settings/video-parameters/and-quality.md) was needed for primary screen share quality setting.
* When the user selects the screen share quality via the gear icon (primary share), it will remember that setting in case a secondary screen share is started later in that session.
* Added a "show stats" option to the right-click menu (so you don't need to hold CTRL to get it, making it more discoverable for new users I guess)\
  ![](<../.gitbook/assets/image (9) (5).png>)\
  \*changes on beta (vdo.ninja/beta/)

#### April 5

* Added messaging for mac users who try to screen share and get denied; MacOS instructions are added on how to setup permissions.\
  ![](<../.gitbook/assets/image (10) (5).png>)
* Added messaging for those with surround gaming headsets or using VMs on how to handle no-audio-capture errors when screen sharing.\
  ![](<../.gitbook/assets/image (3) (2) (2).png>)
* Tweaked [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md) a bit; [`&aec`](../source-settings/aec.md) and such will impact it now.
*   Fixed an issue where the screen share's audio didn't get correctly stopped in cases where it should have been.

    \
    (changes on vdo.ninja/beta)

#### April 4

* Screen share in a group room won't crop to fit the assigned window space anymore, even if [`&cover`](../advanced-settings/view-parameters/cover.md) is used. \*on beta at vdo.ninja/beta
* Fixed an issue on beta where if you changed the audio device, the audio would stop.
* Spanish language file updated (via community contribution; thank you)
* An issue where iOS 15.4 devices get stuck at low bitrates has been patched; available on vdo.ninja/beta.

#### April 1

* Fixed an issue with passwords in some places not allowing for longer than 30-characters
* Fixed a password issue with the vdo.ninja/mixer (passwords can be set via the URL now)
* Published v21.3 of VDO.Ninja to the GitHub main branch (currently what has been on vdo.ninja/beta for a couple weeks now)

#### March 15

* Fixed an issue with [`&showlabels=STYLENAME`](../advanced-settings/design-parameters/showlabels.md)

#### March 9

* Updated the co-director feature of VDO.Ninja to SYNC the state between the directors. Syncs on refresh and on button change; this includes scenes, volume, mute, groups, etc. The only catch at the moment is the main director won't sync with a co-director; just co-directors sync with the main director. \*On beta at vdo.ninja/beta

#### March 4

* Improved [`&forcelandscape`](../advanced-settings/mobile-parameters/and-forcelandscape.md) (`&fl`) on beta.

#### March 3

* Fixed an issue where [`&maxvideobitrate`](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md) would sometimes increase the default bitrate as well. (was impacting the speedtest a bit. on local dev atm)

#### February 26

* An issue with [`&fileshare`](../source-settings/and-fileshare.md) has been fixed and pushed to beta.
* Added support for [`&fileshare`](../source-settings/and-fileshare.md) support to Firefox and added browser-specific help notices.

February 23

* Posted the code for self hosting the companion hotkey API: [https://github.com/steveseguin/Companion-Ninja/tree/main/server](https://github.com/steveseguin/Companion-Ninja/tree/main/server)
* Added `session.apiserver=` as a way to easily specify your own companion server address via index.html (on just my local dev at the moment)

#### February 22

* [`&slots=N`](../newly-added-parameters/and-slots.md) and mix-ordering/[`&order`](../source-settings/order.md) now can work together; on alpha

#### February 21

* Added "Hold to talk" to the mute button. Hold the mic toggle button with the mouse for more than 300-milliseconds to have it become Hold to talk. You can also do `CTRL (cmd) + M` for more than 300-ms to also enter the hold-to-talk mode.\
  \
  I'm not calling this push-to-talk because if you just push for less than 300-ms or click the button, it will instead just toggle the mute state as it is now.\
  \
  This is on ALPHA, [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/), since there are a few video styling issues with the current code I need to fix still.
* Applied a hotfix to production to further improve the [`&record`](../advanced-settings/recording-parameters/and-record.md) situation that a few users still were having.

#### February 20

* Applied some fixes for the director + Meshcast support; the changes are on alpha for now, pending more testing [https://vdo.ninja/alpha](https://vdo.ninja/alpha)

#### February 15

* OBS 27.2 has been officially released; this fixes some issues experienced by some VDO.Ninja users, such as rainbow puke.

#### February 14

* Pushed v21.0 to GitHub: [https://github.com/steveseguin/vdo.ninja/tree/v21-dev](https://github.com/steveseguin/vdo.ninja/tree/v21-dev)
* v21 pushed into production. Cached cleared. v20.4 is still available at [https://vdo.ninja/v20/](https://vdo.ninja/v20/) if you prefer that.
* Added a 'clear' button to the download links in the chat.\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/942652225455534090/unknown.png?width=400\&height=205)

## [Version 21 Release](../older-releases/v21.md)

#### February 13

* I'm going to consider v20.8 as v21.0 going forward, which is currently on beta ([https://vdo.ninja/beta/](https://vdo.ninja/beta/))
* I've archived v20.4 of VDO.Ninja to [https://vdo.ninja/v20/](https://vdo.ninja/v20/), so if you've had continued problems this last week with production, which aren't now resolved on beta, you can give that a go instead of [v19](../release-notes/v19.md). v21 will include changes from v20.5 and onwards (the last couple weeks of code changes).
* Please note: I am intending to push v21 to production tonight, around midnight EST, which should not cause disruptions; it's small changes compared to what's on production now. The goal of pushing it is to allow for v20.4 to be archived, creating a clear division in versions to be made. v21 has been mainly bug fixes and tweaks, but i'll work on its release notes still.
* Any testing of beta today though would be VERY welcomed. If you are able to demonstrate an issue that exists in beta (v21) that does not exist in v20.4, please provide me the details of how you are able to replicate it. Android/iOS has had their group-room performance/quality allowances tweaked, and Android has had its h264 encoder profile tweaked to avoid it failing on some devices. I've had a few users mention higher CPU loads and audio sync issues since v20.4, but I am unable to reproduce any higher CPU load myself.

## **Previous updates**

{% embed url="https://docs.vdo.ninja/releases" %}
