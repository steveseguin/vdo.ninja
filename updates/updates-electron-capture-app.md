# Updates - Electron Capture App

[electron-capture.md](../steves-helper-apps/electron-capture.md "mention")

#### April 8

* Electron Capture has been updated for both Windows and Mac. [https://github.com/steveseguin/electroncapture/releases/tag/2.17.2](https://github.com/steveseguin/electroncapture/releases/tag/2.17.2)\
  \-- This update includes general updates/patches, but also a new command line parameter called `--color` (or `--chroma`), which lets you pass a HEX value (000, 0F0, FFFF, etc) to set the background color. Useful if you want to make a background transparent or opaque without needing to use CSS.

#### March 30

* **Electron capture** will save the Edit CSS custom user entry to local storage, so on next visit to a site, your last CSS entry will be remembered for easy reuse (source code updated; new builds will come later)

#### March 23

*   Updated **Electron Capture** so that you can toggle the "click thru and pin on top" with a global keyboard shortcut. (`CTRL + SHIFT + X`)\
    \-- This Electron Capture update relates to [Social Stream](../steves-helper-apps/social-stream.md) because you can use it to overlay the dock chat on your display (such as while gaming?) without it getting in the way of what you're doing. (see photo for example)\


    ```
    https://socialstream.ninja/dock.html?session=XXXXXXX&transparent  <= example of what you can use in the EC app; &transparent is recommended.
    ```

    \
    [https://github.com/steveseguin/electroncapture/releases/tag/2.17.1.1](https://github.com/steveseguin/electroncapture/releases/tag/2.17.1.1) <= Test version of Electron Capture with this new feature; windows build\
    ![](<../.gitbook/assets/image (1) (12).png>)\


### 2022

#### December 14

* Fixed a media recording error with electron capture in director-mode
* Added a new mode to electron capture where you can pin the window, but then after "disable mouse clicks", so the window acts as if its not there. Might be useful with monitoring chat or watching videos while in compatible video games/apps. Selecting the app from the task bar (bringing it into focus) re-enables the click capture.
* Fixed an issue with Social Stream where it wasn't always draggable with certain versions of electron capture (an electron.js bug)
* Added the CLI option `--css test.css` to elecap where you can pass a local CSS file, example test.css, and it will auto-insert that CSS into every new window created.
* Added a CLI option called `--minimized` to the Elecap that starts the app minimized. Pushed an updated release version of electron capture with above fixes here:\
  [https://github.com/steveseguin/electroncapture/releases/tag/2.17.0](https://github.com/steveseguin/electroncapture/releases/tag/2.17.0)\
  Windows and MacOS support added

#### September 18

* The Electron Capture app has had an issue fixed where on windows "keep on top" wasn't always working.\
  [https://github.com/steveseguin/electroncapture/releases/tag/2.16.2](https://github.com/steveseguin/electroncapture/releases/tag/2.16.2)\
  This is PC-release only, since issue is PC-specific.

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
  If you have Chrome installed, those extensions will be available via the right-click menu. (You may need to reload the window after selecting one, if required by the extension.) This works for BTTV, FFZ, 7TV, etc.\
  (I might eventually build SocialStream directly into it, but for now, that's not really something that works.)

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
  ![](<../.gitbook/assets/image (2) (2) (3) (1).png>)

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

#### May 8

* Added support to Hold-to-Talk to the Electron Capture app, so when used with elevated app privileges, the selected hotkey works system-wide, so you don't need the app-in focus for it to function. [https://github.com/steveseguin/electroncapture/releases/tag/2.10.0](https://github.com/steveseguin/electroncapture/releases/tag/2.10.0)

#### April 23

* Updated Electron Capture to v2.9.0, which includes a signed MacOS build and uses chromium v100. [https://github.com/steveseguin/electroncapture/releases/tag/2.9.0](https://github.com/steveseguin/electroncapture/releases/tag/2.9.0)

#### April 12

* Fixed a minor 'newer version available' error; on production. Also, the current electron app version is now listed on the landing page, at the very bottom-center of the page in dim small letters:\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/963417004876898375/unknown.png)

#### March 5

* If using the electron capture app, hold `CTRL` when right-clicking will show the VDO.Ninja menu rather than the Electron menu.

#### February 2

* Updated the Windows version of electron capture app to the newest electron/chromium version, hoping to resolve a user reported issue: [https://github.com/steveseguin/electroncapture/releases/tag/2.7.0](https://github.com/steveseguin/electroncapture/releases/tag/2.7.0)

#### January 28

* Pushed out a signed version of Electron Capture for MacOS. This hopefully will solve issues a couple users have had with no mic/cam access since upgrading their MacOS version. (This also means that I have bit the bullet and have bought a new apple dev account)

#### January 15

* Screen-share fix for MacOS compatibility
* Improved support for screen-sharing of Electron Capture on MacOS ; added a work around for a MacOS limitation.

#### January 5

* Updated to support a global hotkey page refresh (`CTRL + SHIFT + R`)  v2.6.2 I think
