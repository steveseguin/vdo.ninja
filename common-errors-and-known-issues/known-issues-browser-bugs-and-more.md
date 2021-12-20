# Known third-party caused issues

* Grey video loaded from guest in room. Try adding \&scale=100 and remove any bitrate limits set. If the issue persists, try a different video codec (\&codec=vp9, for example) or ask the guest to connect with \&q=2 (smooth and cool).
* All green or all purple video from a mobile device (Pixel, Samsung Galaxy) can sometimes happen with certain resolutions or orientations. Using \&scale=100 or \&scale=95 can sometimes help (viewer side), but also changing the video codec to \&codec=vp8 might help.
* OBS on PC can have video become corrupted if there is moderate or heavy packet loss. Changing the video codec to vp9 or h264 can fix it for moderate packet loss, but for heavy packet loss using the Electron Capture app is suggested. You can also issue keyframes with the rainbow puke button in the Director's room or refresh the viewing page, but it's a temporary fix. Ideally, fixing the packet loss itself is the ideal solution.
* OBS Streamlabs (SLOBS) on macOS does not currently support OBS.Ninja directly; you'll need to use the Electron Capture app or the normal OBS version instead.
* OBS on PC can sometimes run into a Max Buffer Limit Reached error, which can cause the audio to become delayed by seconds or simply stop being captured at all. Using the Electron Capture app to capture audio can avoid this problem.
* Some browser-extensions will cause webRTC to fail. Try loading OBS.Ninja in incognito mode or try using the Electron Capture app instead.
* On most modern browsers, a user will need to click the browser window before the video will play. This goes for VMIX and for Firefox/Chrome. This is not the case for OBS or the Electron Capture app, however.
* Android 11 users using Chrome may need to push the app to the background, and then foreground it again, to unfreeze the video camera when it loads or changes camera sources.
* iOS (iPhone) users using Safari 13 may sometimes not send audio.
* iOS (iPhone) users sometimes cannot access their camera until they close all other Safari browser tabs. If it still does not work, using the native iOS app on the App Store may work; "Capture for OBS.Ninja".
* Chrome on iOS only works for iOS 14.3 and newer. It will not work with OBS.Ninja on older iOS versions.
* iOS 12 and newer is required for OBS.Ninja to work; older iPads may not work as a result.
* Firefox on Android has numerous bugs that may cause connections to not always work; more prone to happen in larger group rooms.
* Setting an audio bitrate to 64-kbps or higher can cause video to get stuck at near-zero bitrate. I've tried to account for this bug, but setting a higher video bitrate seems to help avoid the issue as well.
* Bluetooth headphones on macOS, especially when using battery power, can cause audio-clicking on outbound audio.
* Safari on macOS does not have the greatest noise or echo-cancellation, causing poor audio performance. Use a Chromium-based browser instead for the best audio quailty.

For some other possible bugs/issues, Twilio maintains a pretty comprehensive list of known WebRTC related bugs in common browsers and hardware. [https://github.com/twilio/twilio-video.js/blob/master/COMMON\_ISSUES.md](https://github.com/twilio/twilio-video.js/blob/master/COMMON\_ISSUES.md)
