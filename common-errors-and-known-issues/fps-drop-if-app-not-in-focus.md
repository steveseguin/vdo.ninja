---
description: >-
  If screen sharing, you may see a frame rate drop once VDO.Ninja loses focus.
  This background app-throttling can normally be disabled
---

# FPS drop if app not in focus

Chrome and Chromium-based browsers will sometimes throttle or limit the resources available to browser tabs that are not visible or in the background. This can result in a frame rate loss, often when using digital effects (green screen), when screen sharing, or using VDO.Ninja while gaming.

### Windows process throttling (efficiency mode)

If the issue is with Windows itself throttling the tab or application, you can open the Task Process manager (`Ctrl + Shift + Esc`), expand the processes for the browser application, and click on the VDO.Ninja tab process.

You can right-click it and disable efficiency mode if it is on.

<figure><img src="../.gitbook/assets/image (5) (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

### GPU Driver Settings

* **NVIDIA Control Panel:**
  1. Navigate to `Manage 3D Settings` -> `Program Settings`.
  2. Add or select the browser executable (e.g., `chrome.exe`).
  3. Set `Power management mode` to `Prefer maximum performance`.
  4. Ensure `Background Application Max Frame Rate` is `Off` or set to a high value.
* **AMD Radeon Software:**
  1. Navigate to `Gaming` -> `Games`.
  2. Add or select the browser executable.
  3. Review performance settings: disable `Radeon Chill`, `Enhanced Sync`, or other features that might limit background app performance. Check for specific power-saving options for background applications.

### **Windows System Settings**

* **Graphics Settings:**
  1. Go to `Settings` -> `System` -> `Display` -> `Graphics settings`.
  2. Under "Choose an app to set preference", select `Desktop app`.
  3. Browse to and add the browser executable.
  4. Click the browser in the list, select `Options`, and set to `High performance`.
* **Game Mode:**
  1. Go to `Settings` -> `Gaming` -> `Game Mode`.
  2. Try toggling Game Mode `Off`. It might be deprioritizing the browser too aggressively.
* **Power Plan:**
  1. Open `Control Panel` -> `Hardware and Sound` -> `Power Options`.
  2. Select `High performance` or `Ultimate Performance`.
  3. Click `Change plan settings` -> `Change advanced power settings`.
     * Check `PCI Express` -> `Link State Power Management` and set to `Off`.
     * Review `Processor power management` settings to ensure no aggressive throttling.

### **Game-Specific Settings**

* **Display Mode:**
  1. In the game's video/display settings, try using `Borderless Windowed` or `Windowed Fullscreen` mode instead of `Exclusive Fullscreen`.
* **In-Game FPS Limiters/V-Sync:**
  1. Experiment with disabling in-game FPS limiters or V-Sync to see if they interact negatively with background capture when the game itself is not the application in focus.



### Chromium background tab throttling

Disabling throttling for Chrome can be done in different ways; the methods to control throttling seem to change every couple years however.

Some flags you can try disable in Chrome are the following:

`chrome://flags/#calculate-native-win-occlusion`

`chrome://flags/#enable-throttle-display-none-and-visibility-hidden-cross-origin-iframes`

You can also go into your browser's settings and search for "performance" or go to `chrome://settings/system` , and at the bottom, you might see performance setting options. You might also find something at`chrome://settings/performance,` with options related to performance throttling or background tabs, such as "ThrottleJavaScriptt timers in background".\
\
To prevent browser auto-suspension and tab discarding, go to `chrome://discards/` and toggle off "Auto Discardable" on VDO.Ninja pages.

<figure><img src="../.gitbook/assets/image (266).png" alt=""><figcaption></figcaption></figure>

Disable the efficiency mode, or customize as desired, and that might help with performance of VDO.Ninja when gaming with the tab in the background.

<figure><img src="../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

These visibility strategies help prevent the browser from throttling inactive tabs after periods of inactivity.

### Electron Capture

If you can't get things to improve, you can try the [Electron Capture app](../steves-helper-apps/electron-capture.md) for screen sharing or for VDO.Ninja. It's optimized to not throttle in most cases, and it can be pinned on top of other applications if occlusion is a cause of throttling.

{% embed url="https://github.com/steveseguin/electroncapture" %}
Get Electron Capture here. Enable elevated privs if screen sharing with it
{% endembed %}

### OBS Virtual Camera

If screen sharing is getting low frame rates still, you can try using OBS to screen capture your game or application, and use it's virtual camera output as the source for VDO.Ninja.

OBS with its Virtual Camera can maintain a higher steady frame rate than most browsers can when screen sharing. You can use a virtual audio cable to capture the games/application audio, if needed.

{% embed url="https://docs.vdo.ninja/guides/publish-from-obs-into-vdo.ninja" %}

### Using WHIP from within OBS

An alternative to using the Virtual Camera and browser though is to use a feature in OBS to publish directly to VDO.Ninja.

This is an newer feature it may require a special version of OBS at the moment to work, but WHIP support is now included in OBS v30, but it may be another version or two before OBS supports WHIP properly. \
\
If having issues with using OBS WHIP with VDO.Ninja over the Internet, I do have a custom version of OBS that has proper WHIP support [available for Win64 here.](https://backup.vdo.ninja/OBS_VDO_Ninja.zip) \[[fork](https://github.com/steveseguin/obs-studio)]  This version should let you publish WHIP via VDO.Ninja across the Internet, regardless of Firewall. This OBS binary was last built November 2024, but hopefully future releases of OBS make this custom version redundant. :)<br>

Check out a demo YouTube video of how to accomplish publishing WHIP into VDO.Ninja:\
[Publishing from OBS directly to VDO.Ninja](https://www.youtube.com/watch?v=ynSOE2d4Z9Y)

This mode should give OBS Studio control over frame rate and bitrate, so with a good connection it should be possible to lock in a solid 60-fps.
