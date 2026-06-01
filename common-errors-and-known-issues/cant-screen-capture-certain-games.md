---
description: Some games may need settings tweaked to be captured properly with the browser
---

# Can't screen capture certain games

If you're struggling to capture a game with VDO.Ninja using the browser, a list of options are below.

* On Windows, try the [Game Capture app](../steves-helper-apps/game-capture.md). It captures a selected game or app window and publishes it directly to VDO.Ninja, with window-specific audio capture and hardware-accelerated encoding.
* Disable Fullscreen Optimizations: Right-click the game's .exe file, go to Properties > Compatibility, and check "Disable fullscreen optimizations"
  * Sometimes you want to even uncheck "Disable fullscreen optimizations", so try both ways
  * Restart the game after applying changes.<br>
* Run as Administrator: Try running both the game and your capture software as administrator.<br>
* Compatibility Mode: Run the game in compatibility mode for an earlier version of Windows.<br>
* Run the game in windowed or borderless windowed mode<br>
* Consider using OBS Studio to capture the game with, and then output the captured video to VDO.Ninja using the OBS Virtual Camera.
  * Sound can be captured with a virtual audio device in conjunction with the the OBS audio monitoring output option.<br>
* If using hybrid graphics, such as two graphics cards, try to run the game on the same graphics card as the system / browser.<br>
* Try window capture or full-screen capture, or try with a different browser.
  * If using Window capture, you can capture the game's audio with the use of a virtual audio device, like Voicemeeter.
  * Display capture tends to offer better frame rates than window capture<br>
* Use an HDMI splitter and an HDMI to USB adapter to capture the output sent to your monitor.<br>
* Update your graphics card drivers<br>
* If using a browser such as Opera GX, it may throttle or disable VDO.Ninja when gaming.
  * The Electron Capture application, or a different browser, are better choices
