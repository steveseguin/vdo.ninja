# Updates - WHIP/WHEP

#### [whip-and-whep-tooling.md](../steves-helper-apps/whip-and-whep-tooling.md "mention") <a href="#august-31" id="august-31"></a>

#### November 3 <a href="#august-31" id="august-31"></a>

* Finished my first working version of the VDO.Ninja video -> WHEP video output option
  * the WHEP playback URL is: [https://whep.vdo.ninja/whepIDhere](https://whep.vdo.ninja/whepIDhere), but you'll first need to have a VDO.Ninja push link open and ready with `&whepout=whepIDhere` added to its URL. (You need to include the `&whepout` on the URL if you wish to make it WHEP-output enabled).
  * If no whepID is provided via the URL, it will auto use your stream ID as the whepID instead.
  * In the future you'll be able to use this option to pull VDO.Ninja feeds into VLC, FFmpeg, OBS, or whatever, without needing a browser source; pretty exciting. It will just take time for this to be adopted by the community and for it all to mature.
* `&whep` is now an alias of `&whepinput`
*   If you open a VDO.Ninja WHEP URL in the browser, it will assume you want to play it, and give you the correct WHEP URL for playback.

    ie: `https://whep.vdo.ninja/XXXXX` -> `https://vdo.ninja/alpha/?whep=XXXXX`\
    ![](<../.gitbook/assets/image (6).png>)\
    \*\* changes on alpha

#### November 1 <a href="#august-31" id="august-31"></a>

* Improved the vdo.ninja/alpha/whip page some more, based on user feedback; just mainly tweaks/fixes.

#### October 23 <a href="#august-31" id="august-31"></a>

* The WHEP player setup page has an option to control how long the system waits for ice candidates; 2-seconds default.\
  ![](<../.gitbook/assets/image (202).png>)
* The WHIP publishing client will default to AV1 video encoding, if its detect, rather than Openh264.

#### October 21 <a href="#august-31" id="august-31"></a>

* Added a menu option to choose a buffer delay on the WHEP player tooling can help reduce video playback stutter, for some sources. (@ [vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip))\
  ![](<../.gitbook/assets/image (200).png>)

#### October 20 <a href="#august-31" id="august-31"></a>

* Fixed an issue with stereo sound not working on the WHEP viewer.
* Fixed an issue with the WHEP player stats not showing correctly.
* Fixed an issue where [`&buffer`](../advanced-settings/view-parameters/buffer.md) wasn't working with the WHEP player.
* Made it a bit easier to setup the WHEP player as a basic viewer page; hiding menus that probably aren't commonly needed.
* `&svc` is a new option, which is useful for publishing to WHIP broadcast servers that support scalable video modes. -- Takes an SVC value, with `L1T3` being the most universal option, but other options exist. You'll get an error when publishing if you use an invalid one.\
  ![](<../.gitbook/assets/image (194).png>)
* Improved the [`vdo.ninja/alpha/whip`](https://vdo.ninja/alpha/whip) page and added SVC scalable options to the WHIP output option there, making it easy to select a compatible SVC mode if desired.

#### October 6 <a href="#august-31" id="august-31"></a>

* Pushed a hotfix for VDO.Ninja related to [`&deafen`](../general-settings/deafen.md) not working with [`&meshcast`](../newly-added-parameters/and-meshcast.md) or WHEP-in incoming audio sources.

#### August 26 <a href="#august-31" id="august-31"></a>

*   I've merged the Meshcast and WHIP/WHEP features in VDO.Ninja to share about 95% of the same logic, including the URL options. If you want to use Meshcast, you still need to use [`&meshcast`](../newly-added-parameters/and-meshcast.md) instead of `&whipout`, but since Meshcast is essentially a WHIP/WHEP server, I just have Meshcast using the generic WHIP logic now.\
    \-- Below shows what whip-output options now are fully interchangeable with Meshcast options, since they share the same code. (alias of each other)

    ```
    mcscale == woscale, whipoutscale
    meshcastbitrate == whipoutvideobitrate, wovb
    mcscreensharebitrate == whipoutscreensharebitrate, wossbitrate
    mcscreensharecodec == whipoutscreensharecodec, wosscodec
    mcaudiobitrate == whipoutaudiobitrate, woab
    meshcastcodec == whipoutcodec, woc
    ```

    * A goal for a while has been to allow anyone to drop-in their own Meshcast replacement, using a third-party WHIP/WHEP server/service. That is, publish to a whip-service, and have viewers of the stream get the whep-view link, so they can view via whep instead of p2p. I've achieved this finally; close enough at least.
    * There's a few requirements to make it work though, so either an API wrapper is needed or a set of rules needs to be followed:\
      \-- If your WHIP server returns an exposed "WHEP" field in the POST response header, with the URL to the WHEP view link, it will use that WHEP link. You just need to then specify the `&whipout` URL on the sender side then.\
      \-- This should let you make your own Meshcast service with minimal work; the open-source WHIP API code I released the other day further makes it pretty easy.
    * If using a cloudflare.com WHIP URL on the sender side, I'll guess at the WHEP link - seems to be working so far. (built this logic into VDO.Ninja directly and works automatically). This of course still implies a unique whip URL per guest.

    ![](<../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

    * To make using Cloudflare easier though, I've also created the WHIP end point `cloudflare.vdo.ninja`, which takes a Cloudflare API token, instead of a stream token.\
      \-- This special end point will auto-create a unique WHEP URL. The official cloudflare.com whip endpoint can only be used by one sender at a time, but this API special endpoint and token approach can be used by many senders at a time. It automatically generates unique WHIP/WHEP when used, in the same way Meshcast does, so no need for unique invite urls per guest.\
      \-- I've created a page to generate the required special api token; the page also provides further information on this all: [https://vdo.ninja/alpha/cloudflare](https://vdo.ninja/alpha/cloudflare)\
      \-- `&cftoken` (`&cft`) is also now added to vdo.ninja/alpha/; this parameter accepts the special token without needing to specify the cloudflare.vdo.ninja part if using `&whipout` instead.
    * I focused mainly on adding Cloudflare support first, as it has good pricing for its WHIP/WHEP service, it doesn't require deploying anything, and it has a lot of features (RTMP, SRT, recording, API). It's not 100% cooked yet though, so it's just on alpha currently for testing.
    *

#### August 23 <a href="#august-31" id="august-31"></a>

* I've open-sourced the VDO.Ninja whip API server code and put it on GitHub:\
  [https://github.com/steveseguin/whip](https://github.com/steveseguin/whip)\
  It's kinda basic right now, but it will probably grow over time into something more broadly useful.

#### July 24

* This [`&locked`](../advanced-settings/mixer-scene-parameters/and-locked.md) option is added to the Mixer App's WHIP/**Twitch publishing output option**, so regardless of window size, you'll get a 16:9 video render.

#### July 10

* Added connection stats to the WHIP out functionality\
  ![](<../.gitbook/assets/image (3) (6).png>)
* Fixed an issue where changing video/audio sources/settings broke the WHIP out stream.
* [`&stereo`](../general-settings/stereo.md) should work now with the WHIP-Input mode (`?whip=xx&stereo`), assuming the source supports it (VDO.Ninja whip-out does)

I'll keep improving the support for WHIP/WHEP. Lots to do. Suggestions welcomed also.

#### July 9 <a href="#august-31" id="august-31"></a>

* Added some audio options to the WHIP-publishing sandbox page at [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip)\
  ![](<../.gitbook/assets/image (1) (2) (8).png>)

#### July 1 <a href="#august-31" id="august-31"></a>

* Added [`&whipoutcodec=av1,h264,vp8`](../advanced-settings/whip-parameters/and-whipoutcodec.md) (`&woc`), which lets you specify the WHIP video output codec. It can take multiple values; if not used, the default at the moment is open264
* Added [`&whipoutaudiobitrate`](../advanced-settings/whip-parameters/and-whipoutaudiobitrate.md) (`&woab`) and [`&whipoutvideobitrate`](../advanced-settings/whip-parameters/and-whipoutvideobitrate.md) (`&wovb`), which lets you specified the WHIP audio and video bitrate (kbps).
* [`&stereo`](../general-settings/stereo.md) now works with the WHIP output, so if enabled, you'll publish stereo 2.0 with a default audio bitrate of around 80 to 100-kbps; otherwise the default is mono at around 60kbps. These defaults bitrates might be changed own the road.
* The WHIP sandbox test page is now configured with two drop down menus to let you select bitrate and codec for when publishing to a WHIP output.
* The Twitch WHIP output example now has a default bitrate of 6000-kbps if used. The video codec for whip out by default is openh264, and the twitch output option uses that by default. (The Twitch defaults need to be changed via URL manually.)
* Just a reminder you can test the WHIP out by publishing to the VDO.Ninja whip-in URL (`https://whip.vdo.ninja/STREAMID` and for playback, `https://vdo.ninja/?whip=STREAMID`).

![](<../.gitbook/assets/image (9) (6).png>)

\*\* all changes are on alpha, with the updated whip sandbox here: [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip)

#### May 30 <a href="#august-31" id="august-31"></a>

* The Twitch WHIP ingest endpoint now works directly via VDO.Ninja (rather than via a proxy server I had hosted).

#### May 1 <a href="#august-31" id="august-31"></a>

* [`&suppresslocalaudio`](../advanced-settings/screen-share-parameters/and-suppresslocalaudio.md) will disable local audio playback of a Chrome tab while screen-sharing it. This can be used with the new WHIP output of VDO.Ninja to publish a VDO.Ninja scene directly to Twitch, without having to deal with any audio feedback issues while having that scene tab open.

#### April 16 <a href="#august-31" id="august-31"></a>

* You can now publish from VDO.Ninja directly to Twitch.\
  \-- Go here, [https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip), enter your Twitch stream token in the correct field, GO, and then select your camera in VDO.Ninja as normal.\
  \-- There's also a new development version of OBS Studio that has improved support for direct publishing of OBS -> VDO.Ninja (via whip) here:\
  [https://github.com/obsproject/obs-studio/actions/runs/4711358202?pr=7926](https://github.com/obsproject/obs-studio/actions/runs/4711358202?pr=7926)\
  ![](<../.gitbook/assets/image (9) (1) (3).png>)![](<../.gitbook/assets/image (16).png>)

#### March 17

* I've been slowly improving the WHIP/WHEP interface for VDO.Ninja. It's a bit mentally exhausting, but there is some progress up on alpha:\
  \- WHEP in now added (test with cloudflare whep out),\
  \- WHIP out now added (tested with cloudflare whip in),\
  \- WHIP in improved a bit (tested with a private build of OBS and Larix, but isn't 100% stable yet) \
  \
  Still working on WHEP out and all the polish/integration that goes with this all. Hacking support in is one thing, but having it all work well with the rest of VDO.Ninja is tricky.\
  \
  One challenge is the interface and configuration for these WebRTC options. To help make it easier to play with things, I've created a little config page to test the very basics with.\
  \
  Many WHIP/WHEP apps are just as buggy/limited with their support as VDO.Ninja is, so incompatibilities and unstable behavior is unavoidable in the near term. Happy to work with others in the community to improve cross-app support.\
  ![](<../.gitbook/assets/image (4) (2).png>)

#### February 19

* I've refined the WHIP service on `vdo.ninja/alpha/?whip=xxx`, making it as robust as I can I think, so if some third-party WHIP client/app doesn't work with it, it may not an issue with VDO.Ninja. In those cases it will be up to the client to ensure full support of the WHIP specification, else it may not work with VDO.Ninja.

### 2022

#### December 21

* Added experimental "WHIP" support to VDO.Ninja, which means in the near future you'll be able to publish directly from OBS to VDO.Ninja without a virtual camera. There's some big caveats to it all, so I don't recommend it over the normal method to most users, but we'll see how it evolves. ([https://vdo.ninja/alpha/?whip=xxx](https://vdo.ninja/alpha/?whip=xxx))\
  \
  YouTube tutorial: [https://youtu.be/ynSOE2d4Z9Y](https://youtu.be/ynSOE2d4Z9Y)
