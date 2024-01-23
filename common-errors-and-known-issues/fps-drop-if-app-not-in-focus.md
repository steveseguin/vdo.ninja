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

### Chromium background tab throttling

Disabling throttling for Chrome can be done in different ways; the methods to control throttling seem to change every couple years however.

Some flags you can try disable in Chrome are the following:

`chrome://flags/#calculate-native-win-occlusion`

`chrome://flags/#enable-throttle-display-none-and-visibility-hidden-cross-origin-iframes`

You can also go into your browser's settings and search for "performance" or go to `chrome://settings/system` , and at the bottom, you might see performance setting options.

Disable the efficiency mode, or customize as desired, and that might help with performance of VDO.Ninja when gaming with the tab in the background.

<figure><img src="../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

### Electron Capture

If you can't get things to improve, you can try the [Electron Capture app](../steves-helper-apps/electron-capture.md) for screen sharing or for VDO.Ninja. It's optimized to not throttle in most cases, and it can be pinned on top of other applications if occlusion is a cause of throttling.

{% embed url="https://github.com/steveseguin/electroncapture" %}
Get Electron Capture here. Enable elevated privs if screen sharing with it
{% endembed %}

### OBS Virtual Camera

If screen sharing is getting low frame rates still, you can try using OBS to screen capture your game or application, and use it's virtual camera output as the source for VDO.Ninja.

OBS with its Virtual Camera can maintain a higher steady frame rate than most browsers can when screen sharing. You can use a virtual audio cable to capture the games/application audio, if needed.

{% embed url="https://docs.vdo.ninja/guides/publish-from-obs-into-vdo.ninja" %}
