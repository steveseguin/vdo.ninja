---
description: Browsers may prevent videos from auto-playing on initial page load
---

# Autoplay doesn't work in Chrome or vMix v77

Since 2017, Browsers have required users "interact" with a website in some way before videos will be allowed to auto-play. You can modify Chrome to allow for auto-play, but it's not super easy to do.

In OBS and the Electron Capture app, auto-play is allowed.

vMix v77 does not support auto-play, which must be an oversight on their behalf... right?? haha. A complaint has been filed regardless; voice your own request for the feature here: [https://forums.vmix.com/posts/t22181-CEF-V77-browser-setting](https://forums.vmix.com/posts/t22181-CEF-V77-browser-setting).

A full-screen-sized play button will show up to help accommodate the need for user gestures before auto playing videos.\
\
**TL;DR;** you have a few options:

* use the Electron Capture app or OBS Studio to play videos; these apps have gesture-requirements disabled
* in Chrome, go to: `chrome://settings/content/sound?search=sound` and add vdo.ninja to the list of "allowed to play sound" list
* add `&noaudio` to your VDO.Ninja view link, so no audio track loads -- without audio, the video should auto-play.&#x20;
* try adding `--autoplay-policy=no-user-gesture-required` to the Chrome/Chromium command line to have the auto-play policy changed on load (this may not work with recent versions of Chrome though)
* make sure there are no Adblockers installed or other extensions install; sometimes these may interfere with auto-playing

