---
description: All the updates for the Electron Capture App
---

# Electron Capture App Updates

* [electron-capture.md](../steves-helper-apps/electron-capture.md "mention")

#### July 21

* Update with a fix for video recordings that don't complete when you fail to stop the recording before the guest leaves or before you stop the recording manually first. Binary builds for mac and windows are up now, with some previous fixes included with this release as well: [https://github.com/steveseguin/electroncapture/releases/tag/2.16.1](https://github.com/steveseguin/electroncapture/releases/tag/2.16.1)

#### July 19

* You can auto-save a recorded video to a target folder now, without a popup. you can set with `--savefolder "c:\\users\\steve\\downloads\\"` . Otherwise, auto-triggers to use the default systems downloads folder location (if it exists) when \&autorecord is added to the URL. [https://github.com/steveseguin/electroncapture/releases/tag/2.16.0](https://github.com/steveseguin/electroncapture/releases/tag/2.16.0) (missing macOS build still; just win32 builds atm)

#### July 11

* It can support locally-hosted files now

#### June 28

* Update to fix a bug with `--title` and window names being wrong; windows binaries up on GitHub now.

#### June 18

* Added support for Chrome extensions.\
  [https://github.com/steveseguin/electroncapture/releases/tag/2.15.0](https://github.com/steveseguin/electroncapture/releases/tag/2.15.0)\
  \
  If you have Chrome installed, those extensions will be available via the right-click menu. (You may need to reload the window after selecting one, if required by the extension,) This works for BTTV, FFZ, 7TV ,etc.\
  \
  (I might eventually build SocialStream directly into it, but for now, that's not really something that works)

#### June 7

* Updated 14.0 to 14.1 to fix an issue with the window-name changing when reloading or editing the URL. Also added support for non-SSL domains. [https://github.com/steveseguin/electroncapture/releases/tag/2.14.1](https://github.com/steveseguin/electroncapture/releases/tag/2.14.1)\
  Currently this is still a test release of sorts, with window-only builds for now. I'll push a mac build also once I'm sure all the issues are worked out.

#### June 6

* Added the option to `right-click -> record` to the Electron Capture app's right-click menu. The goal moving forward is to consolidate the vdon + electron menu when appropriate (rather than needing to hold CTRL to switch menus).
* Changing the output audio device works in the Electron Capture app without needing elevated privileges.
* There is also the option to specify that the audio output device be for just a single video added to Electron Cap; whichever video is right-clicked. This feature is not limited to VDO.Ninja; it should work with many other sites.
* The `CTRL+M` global hotkey and user-define global hotkey feature support of the Electron Capture app works by default, now without needing to enable elevated privileges. (requires vdo.ninja/alpha also atm)
* Fewer issues with the reload/edit page not working in electron capture. (some bug with electron.js?; added a workaround)\
  A test build of the new Electron Capture app for Windows is available here:\
  [https://github.com/steveseguin/electroncapture/releases/tag/2.14.0](https://github.com/steveseguin/electroncapture/releases/tag/2.14.0)\
  ![](../.gitbook/assets/image.png)

#### June 1

* Made the top drag bar slightly more flexible; won't block as many input fields as before. (you can join a room via header without issue now)

#### May 29

* Portable version now can be launched multiple times (batch file/CLI).
* Less RAM usage and faster load when multiple instances run
* Top-drag bar should be available now even after privilege elevation or cli custom url [https://github.com/steveseguin/electroncapture/releases/tag/2.13.1](https://github.com/steveseguin/electroncapture/releases/tag/2.13.1) (Mac + PC)

#### May 19

* Fixed an issue with the recent Electron Capture builds, where screen sharing was failing with an error. You will need to re-download it to have it work, and you must use it with the most recent of VDO.Ninja branch for it to work. (the alpha version currently)
* The App will now let you specify an audio output device for non-VDO.Ninja sites, like YouTube. Each EC window can have its own output; works with Mac+PC. This was added by request. [https://github.com/steveseguin/electroncapture/releases/tag/2.12.0](https://github.com/steveseguin/electroncapture/releases/tag/2.12.0)

#### May 10

* Update to support "clean video output" for more websites; not just youtube and twitch. This lets you window-capture clean video from a site like Facebook, without UI/overlays. It will full-window the largest video on the page when the feature is activated via the context-menu [https://github.com/steveseguin/electroncapture/releases/tag/2.11.0](https://github.com/steveseguin/electroncapture/releases/tag/2.11.0) (window build added; mac build can be added on request)
