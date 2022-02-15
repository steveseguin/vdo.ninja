---
description: Known issues or problems, bugs, and limitations
---

# Known issues

Known issues that are most critical and up-to-date are normally listed on the main page of [VDO.Ninja](https://vdo.ninja).\
\
You can also refer to the #report-bugs channel on discord, at https://discord.vdo.ninja, to see recently reported issues. I push bug fixes daily to beta, at https://vdo.ninja/beta, so give that a shot if you find a bug on the main release.

Below are some links to third parties, for a list of known issues that commonly will apply to VDO.Ninja as well. They might have some issues not yet reported here and are often up to date.

[https://docs.agora.io/en/All/web\_sdk\_compatibility?platform=Web](https://docs.agora.io/en/All/web\_sdk\_compatibility?platform=Web)\
\
[https://github.com/twilio/twilio-video.js/blob/master/COMMON\_ISSUES.md](https://github.com/twilio/twilio-video.js/blob/master/COMMON\_ISSUES.md)\
\
[https://support.twilio.com/hc/en-us/articles/223180908-Troubleshooting-Common-Problems-with-the-Twilio-Voice-JavaScript-SDK](https://support.twilio.com/hc/en-us/articles/223180908-Troubleshooting-Common-Problems-with-the-Twilio-Voice-JavaScript-SDK)\
\
[https://github.com/webrtc/samples/issues](https://github.com/webrtc/samples/issues)\
\
[https://bugs.chromium.org/p/chromium/issues/list?q=webrtc%20type%3DBug\&can=2\&sort=-pri](https://bugs.chromium.org/p/chromium/issues/list?q=webrtc%20type%3DBug\&can=2\&sort=-pri)

Time fixes all wounds, even with Apple products.\
\
Below are more possible/past issues, although the list is not often curated and can be assumed to be out of date.

* Grey video loaded from guest in room. Try adding [`&scale=100`](../advanced-settings/video-parameters/scale.md) and remove any bitrate limits set. If the issue persists, try a different video codec ([`&codec=vp9`](../advanced-settings/video-parameters/codec.md), for example) or ask the guest to connect with [`&q=2`](../advanced-settings/video-parameters/quality.md) (smooth and cool).
* All green or all purple video from a mobile device (Pixel, Samsung Galaxy) can sometimes happen with certain resolutions or orientations. Using `&scale=100` or `&scale=95` can sometimes help (viewer side), but also changing the video codec to `&codec=vp8` might help.
* OBS on PC can have video become corrupted if there is moderate or heavy packet loss. Changing the video codec to vp9 or h264 can fix it for moderate packet loss, but for heavy packet loss using the Electron Capture app is suggested. You can also issue keyframes with the rainbow puke button in the Director's room or refresh the viewing page, but it's a temporary fix. Ideally, fixing the packet loss itself is the ideal solution.
* Streamlabs (SLOBS) on macOS does not currently support VDO.Ninja directly; you'll need to use the Electron Capture app or the normal OBS version instead.
* OBS on PC can sometimes run into a Max Buffer Limit Reached error, which can cause the audio to become delayed by seconds or simply stop being captured at all. Using the Electron Capture app to capture audio can avoid this problem.
* Some browser-extensions will cause webRTC to fail. Try loading VDO.Ninja in incognito mode or try using the Electron Capture app instead.
* On most modern browsers, a user will need to click the browser window before the video will play. This goes for VMIX and for Firefox/Chrome. This is not the case for OBS or the Electron Capture app, however.
* Android 11 users using Chrome may need to push the app to the background, and then foreground it again, to unfreeze the video camera when it loads or changes camera sources.
* iOS (iPhone) users using Safari 13 may sometimes not send audio.
* iOS (iPhone) users sometimes cannot access their camera until they close all other Safari browser tabs. If it still does not work, using the native iOS app on the App Store may work; "Capture for VDO.Ninja".
* Chrome on iOS only works for iOS 14.3 and newer. It will not work with VDO.Ninja on older iOS versions.
* iOS 12 and newer is required for VDO.Ninja to work; older iPads may not work as a result.
* Firefox on Android has numerous bugs that may cause connections to not always work; more prone to happen in larger group rooms.
* Setting an audio bitrate to 64-kbps or higher can cause video to get stuck at near-zero bitrate. I've tried to account for this bug, but setting a higher video bitrate seems to help avoid the issue as well.
* Bluetooth headphones on macOS, especially when using battery power, can cause audio-clicking on outbound audio.
* Safari on macOS does not have the greatest noise or echo-cancellation, causing poor audio performance. Use a Chromium-based browser instead for the best audio quality.
