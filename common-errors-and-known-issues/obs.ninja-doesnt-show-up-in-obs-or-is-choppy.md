---
description: Some options and information for those not seeing video show up in OBS Studio
---

# Nothing shows up in OBS or it is choppy

![](<../.gitbook/assets/image (1).png>)

## macOS

Please be aware that OBS v24 to v26.0 does not natively support VDO.Ninja, but version 26.1.2 and newer does.\
\
StreamLabs OBS for macOS also does not support VDO.Ninja as of yet, but it should in the future after it updates.\
\
Use the Electron Capture app if you are using a non-compatible version of OBS. > [Get it here](https://github.com/steveseguin/electroncapture) <

## Windows

Ensure that the “Enable Browser Source Hardware Acceleration” checkbox is checked in the advanced settings. If you still get just black video when it’s checked, then you can try:

* Uncheck the Hardware Acceleration checkbox -- does it work now? If so, it may be choppy, but perhaps still usable.
* If using an Android mobile smartphone as a camera source, try using Firefox Mobile or a few different browsers. If that fails, try the [native Android app version](../platform-specific-issues/android.md), if your needs are simple.
* Updating your graphics card drivers.
* Run OBS as an Administrator.
* Go to the windows setting for “Graphics Settings”. You may see OBS or SLOBS under programs listed for “graphics performance preference”. Make sure OBS or SLOBS is set to “high performance”. Turn on hardware accelerated GPU scheduling.
* Update OBS Studio to the newest version. When doing so, fully uninstall the old version before installing the new version. If you are up to date, try the beta release or just re-install.
* If using OBS 64-bit, try installing the 32-bit version instead of OBS.
* Switch the GPU used by OBS if using an NVidia GPU; settings in the Nvidia control center. If you can, perhaps try disabling the integrated graphics card in the BIOS and using only the discrete graphics solution.
* If using a laptop, check out this article: [https://obsproject.com/wiki/Laptop-Troubleshooting#for-nvidia-based-laptops](https://obsproject.com/wiki/Laptop-Troubleshooting#for-nvidia-based-laptops). Also consider disabling power-saving mode and plugging the power into the wall directly.
* Enable Compatibility Mode for OBS; this setting is available via right-clicking the OBS icon and clicking properties.
* Try a different video codec; perhaps [`&codec=h264`](../advanced-settings/view-parameters/codec.md) or `&codec=vp9`, which can be added to the view links. Android phones in particular might have problems.
* In the OBS Settings -> Advanced menu, disable Browser source hardware acceleration, and then restart. If it works then, the above GPU-related options should work. Otherwise, it might be a firewall, VPN, or privacy software.
* Check to make sure you are not behind a corporate firewall or on a VPN (see Network issues below). Sometimes using a Firewall can actually help, such as if the guest is in mainland China, where a VPN service (like ExpressVPN) has been able to bypass the Great Firewall of China.
* Disable any anti-virus or other security software. If using PFSense firewall, ensure you are whitelisting the IP address of the remote camera source or allowing webRTC-related UDP traffic.
* You can also download the Electron Capture app, and use that instead of OBS browser source: [https://github.com/steveseguin/electroncapture](https://www.google.com/url?q=https://github.com/steveseguin/electroncapture\&sa=D\&source=editors\&ust=1619943104618000\&usg=AOvVaw2vbHW2zTdxaCofB42QQ\_fT)
* Make sure you have not disabled webRTC with your browser; you can confirm you have webRTC disabled with your browser(s) here: [https://browserleaks.com/webrtc](https://browserleaks.com/webrtc)
* As a final resort, consider using a Cloud-hosted version of OBS instead, such as on Paperspace or AWS /w Parsec installed.

If the hardware-acceleration checkbox is not checked, check it and restart. Does it work now?

## Network issues

We provide a speed test to see if the connection works at all,[ https://obs.ninja/speedtest ](https://obs.ninja/speedtest) You should be able to see your video streamed back at you. If not, there might be a network problem.\
\
You can visit [https://test.webrtc.org](https://test.webrtc.org) or [https://networktest.twilio.com/](https://networktest.twilio.com) for tools to help debug issues that might be impacting your network, such as Firewalls or incompatible browsers.
