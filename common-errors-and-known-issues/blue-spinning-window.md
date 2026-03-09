---
description: Troubleshooting guide for Blue spinning window in VDO.Ninja and OBS with likely causes and practical fixes.
---

# Blue spinning window

_**If you are experiencing this issue and you are using MacOS, please refer to the MacOS specific section**_

If this happens, there could be numerous reasons.

* Check that you have hardware-acceleration turned on, within OBS, and have updated your graphic drivers.
* Ensure that you are not behind a VPN or firewall. Symmetrical firewalls may block VDO.Ninja traffic.
* If on macOS, use the Electron Capture application instead of the Browser source used by OBS (Also ensure you are running OBS v26.1.2 or newer!).
* Try using a VPN, such as Speedify, to bypass any networking firewalls that your ISP may have enabled.
* Check [test.webrtc.org](https://test.webrtc.org/).

#### Are you using cellular?

* If you are on cellular, try connecting to Wi-Fi instead.
* Ensure your are using a compatible browser (Safari on iOS or Chrome on Android).
* Older iOS devices do not work.
* Check [test.webrtc.org](https://test.webrtc.org/).

#### Are you on IPv6?

Check to make sure your TURN server supports IPv6. The ones I provide _should_ support it though. Check [test.webrtc.org](https://test.webrtc.org/).

#### Are you using an iPhone?

There are numerous issues with iOS devices; see the [iOS help section](../platform-specific-issues/ios.md) for more info. Check [test.webrtc.org](https://test.webrtc.org/).

#### Are you within a condo building or corporate office?

Firewalls may be setup that block traffic of this type. Talk to your network administrator Other problems? Check [test.webrtc.org](https://test.webrtc.org/) and see if anything is marked as "RED". You can also try different networks and see if that helps.

If you suspect a service-side issue, you can also try the backup instance at [https://backup.vdo.ninja](https://backup.vdo.ninja). If you see fullscreen video that is just grey and spinning, it is often still a network or compatibility issue rather than a media-server outage.
