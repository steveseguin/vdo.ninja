---
description: Known issues or problems, bugs, and limitations
---

# Known issues

VDO.Ninja maintains several resources to help you identify and resolve issues as they arise. The most critical and up-to-date issues are typically listed directly on the VDO.Ninja main page for quick reference.\
\
For community-reported problems, check the #report-bugs channel [on our Discord](https://discord.vdo.ninja) where users actively share their experiences.&#x20;

### Finding Current Issues

* **Official Sources**: Check the main page of VDO.Ninja for critical and up-to-date issues
* **Discord**: Refer to the #report-bugs channel for recently reported issues
* **Alpha Version**: Try https://vdo.ninja/alpha for the latest bug fixes (updated daily)

### Third-Party Resources

Many WebRTC issues that affect VDO.Ninja are documented by related services and projects. The following resources often contain valuable troubleshooting information applicable to VDO.Ninja, sometimes identifying issues not yet reported in our documentation:\


* [Agora Web SDK Compatibility](https://docs.agora.io/en/All/web_sdk_compatibility?platform=Web)
* [Twilio Video.js Common Issues](https://github.com/twilio/twilio-video.js/blob/master/COMMON_ISSUES.md)
* [Twilio Voice JavaScript SDK Troubleshooting](https://support.twilio.com/hc/en-us/articles/223180908-Troubleshooting-Common-Problems-with-the-Twilio-Voice-JavaScript-SDK)
* [WebRTC Samples Issues](https://github.com/webrtc/samples/issues)
* [Chromium WebRTC Bug List](https://bugs.chromium.org/p/chromium/issues/list?q=webrtc%20type%3DBug\&can=2\&sort=-pri)

### Common Issues and Solutions

#### Video Issues

| Issue                                   | Solution                                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Grey video from guest in room           | Add `&scale=100`, remove bitrate limits, try different codecs (`&codec=vp9`), or ask guest to use `&quality=2` |
| Green/purple video from mobile          | Use `&scale=100` or `&scale=95` on viewer side, or change codec to `&codec=vp8`                                |
| Corrupted video in OBS with packet loss | Change codec to vp9/h264, use Electron Capture app, or issue keyframes with the rainbow button                 |
| Blank browser source in OBS             | Disable hardware acceleration or refer to the help guide                                                       |
| Video camera freeze on Android 11       | Push app to background then foreground when camera loads or changes                                            |
| Camera freezes in Chrome/Chromium v131  | Try alternative browser versions                                                                               |
| Camlink freezing when already in use    | Ensure device isn't being used elsewhere before selecting                                                      |
| USB 3.x video device issues             | Avoid USB hubs and use quality/short cables directly to computer                                               |
| PTZ controls ignored in background tabs | Keep the sender tab/window visible; Chrome blocks PTZ changes when hidden. See [PTZ remote control](../guides/ptz-remote-control.md) |

#### OBS Specific Issues

| Issue                                        | Solution                                                                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Black screen after refreshing browser source | Launch OBS with: `"C:\Program Files\obs-studio\bin\64bit\obs64.exe" --enable-media-stream --disable-gpu-process-crash-limit` |
| Audio delay/Max Buffer Limit                 | Use Electron Capture app for audio instead                                                                                   |
| Audio/video desync                           | Check GPU hardware acceleration settings in Windows Display settings                                                         |
| Performance issues                           | Launch OBS in Administrator mode                                                                                             |
| Overheating on laptops                       | Use a system with active cooling for productions over 30 minutes                                                             |

#### Platform Specific Issues

**iOS/iPhone/iPad**

* iOS 12+ required (older iPads may not work)
* Safari 13 may sometimes not send audio
* May need to close all other Safari tabs to access camera
* Chrome only works on iOS 14.3+
* Try "Capture for VDO.Ninja" app from App Store
* USB audio devices often don't work with iOS WebRTC

**Android**

* Firefox has bugs in larger group rooms
* Chrome may need background/foreground toggle for camera
* USB audio often doesn't work with Chrome (use Firefox or 3.5mm TRRS adapters)

**macOS**

* Bluetooth headphones may cause audio clicking, especially on battery power
* Safari has poor noise/echo cancellation (use Chromium-based browsers)
* Check for enabled Reactions/Presenter Overlay effects during videoconferencing

**Windows**

* Check Windows Sound Properties for Voice Focus settings (Windows 11)
* Hardware-accelerated GPU scheduling may cause audio sync issues
* Ensure OBS is launched in Administrator mode

#### Audio Issues

* Setting audio bitrate to 64kbps+ may cause video bitrate issues (set higher video bitrate to compensate)
* Check for misaligned or high audio sample rates in OBS
* Bluetooth headphones can cause audio clicking, especially on macOS
* USB audio devices have limited compatibility with mobile WebRTC

### Alternative Solutions

* **Electron Capture App**: Often solves issues with browser sources, audio buffer limits, and browser extension conflicts
* **Native iOS App**: "Capture for VDO.Ninja" available on App Store
* **Browser Selection**: Chromium-based browsers often have better performance than Safari or Firefox for certain use cases

### General Tips

* Click browser window before video will play (vMix, Firefox, Chrome) - not needed for OBS/Electron
* Browser extensions can cause WebRTC failures - try incognito mode
* Active cooling systems recommended for extended streaming sessions
