# Firefox

Firefox is not fully supported, although we try to maintain basic support for remote guest usage. It is recommend that you use:

* Chrome on PC
* Chrome on Android (maybe Opera if issues arise with Chrome)
* Chrome on MacOS
* Safari on iOS

Firefox can sometimes work when Chrome does not. With some video camera devices, Chrome may fail to load a camera device, while Firefox will work.

OBS uses Chromium (CEF v75 currently), so there should be fewest issues if you stick to using Chrome or another Chromium-based browser. Chromium v75 is quite dated, so OBS will not have support for things like video buffers (ie: [`&buffer=300`](../advanced-settings/view-parameters/buffer.md)), while if using Chrome for playback, you will. Firefox is much the same; it has support for some features, but many features that are offered in Chrome are not yet available in Firefox.

Firefox does not support desktop audio sharing when using screensharing. Chrome does support desktop and tab audio sharing.

Firefox may lack support for some features like remote zoom and detailed debug stats.

Firefox supports up to around 2.5-mbps for 720p video and up to around 6-mbps for 1080p. It offers little control over video bitrates.

Firefox does not treat Stereo audio in the same way that Chrome does. Results using [`&stereo`](../advanced-settings/audio-parameters/stereo.md) and Firefox may vary.
