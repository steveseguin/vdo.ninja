---
description: >-
  OBS Studio is just black in the browser source; potentially you hear audio,
  but nothing else.
---

# Nothing shows up in OBS or it is choppy

![Disabling or enabling the hardware acceleration in OBS can sometimes fix choppy or missing video.](<../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

## macOS

Please be aware that OBS v24 to v26.0 does not natively support VDO.Ninja, but version 26.1.2 and newer does.\
\
If using an Android smartphone, try using Firefox instead of Chrome, or a different browser in general.\
\
If you're in Iran or China, WebRTC may be blocked; try using a VPN.\
\
Use the Electron Capture app if you are using a non-compatible version of OBS. > [Get it here](https://github.com/steveseguin/electroncapture) <

## Windows

Ensure that the “Enable Browser Source Hardware Acceleration” checkbox is checked in the advanced settings. If you still get just black video when it’s checked, then you can try:

* Uncheck the Hardware Acceleration checkbox -- does it work now? If so, it may be choppy and will use more CPU, but perhaps still usable. If the problem is that it's choppy, ensure that hardware-acceleration is checked.&#x20;
* If using an Android mobile smartphone as a camera source, try using Firefox Mobile or a few different browsers. If that fails, try the [native Android app version](https://docs.vdo.ninja/platform-specific-issues/android), if your needs are simple. This is often the case with Samsung A-series smartphones, although the Galaxy A12 especially seems to have issues.
* If you're in Iran, China or another sanctioned/censored country, WebRTC may be blocked; try using a VPN.
* If on cellular, try switching to a different network.
* If behind a corporate firewall, try using cellular instead.
* If you're using PFSense or a PiHole for home network security, try bypassing it or using a different network; most users using PFSense have security set to overkill, blocking everything.
* Updating your graphics card drivers, especially after a fresh install, can sometimes help.
* Run OBS Studio as an Administrator.
* If your computer is running at 100% CPU / GPU load, try lowering the resolution of the browser source element to 1280x720 or lower; 640x360 should use little CPU, even if hardware-acceleration is disabled.  H264 as a codec will also use less CPU / GPU than other options, normally.
* Try specifying a custom frame rate of 30 in the browser source options in OBS
* Go to the windows setting for “Graphics Settings”. You may see OBS or SLOBS under programs listed for “graphics performance preference”. Make sure OBS or SLOBS is set to “high performance”. Turn on hardware accelerated GPU scheduling.
* Update OBS Studio to the newest version. When doing so, fully uninstall the old version before installing the new version. If you are up to date, try the beta release or just re-install.
* If using OBS 64-bit, try installing the 32-bit version instead of OBS.
* Switch the GPU used by OBS if using an NVidia GPU; settings in the Nvidia control center. If you can, perhaps try disabling the integrated graphics card in the BIOS and using only the discrete graphics solution.
* If using a laptop, check out this article: [https://obsproject.com/wiki/Laptop-Troubleshooting#for-nvidia-based-laptops](https://obsproject.com/wiki/Laptop-Troubleshooting#for-nvidia-based-laptops). Also consider disabling power-saving mode and plugging the power into the wall directly.
* Enable Compatibility Mode for OBS; this setting is available via right-clicking the OBS icon and clicking properties.
* Try a different video codec; perhaps [`&codec=h264`](../advanced-settings/view-parameters/codec.md) or `&codec=vp9`, which can be added to the view links. Android phones in particular might have problems.
* In the OBS Settings -> Advanced menu, disable Browser source hardware acceleration, and then restart. If it works then, the above GPU-related options should work. Otherwise, it might be a firewall, VPN, or privacy software.
* Check to make sure you are not behind a corporate firewall or on a VPN (see Network issues below). Sometimes using a Firewall can actually help, such as if the guest is in mainland China, where a VPN service (like ExpressVPN) has been able to bypass the Great Firewall of China.
* Disable any anti-virus or other security software. If using PFSense firewall, ensure you are whitelisting the IP address of the remote camera source or allowing webRTC-related UDP traffic. While use PFSense may still work, if you do not open the correct ports, frame loss may be significant if relying on the public TURN servers for high-bandwidth data transit.
* If the video is choppy, be sure there is no packet loss. Adding `&stats` to the VDO.Ninja URL link will display the stats in the OBS Browser source, on top of the video.  A high-packet loss, higher than 0.3%, can result in signifcant frame loss, while 3% packet loss is nearly unusable.
* You can also download the Electron Capture app, and use that instead of OBS browser source: [https://github.com/steveseguin/electroncapture](https://www.google.com/url?q=https://github.com/steveseguin/electroncapture\&sa=D\&source=editors\&ust=1619943104618000\&usg=AOvVaw2vbHW2zTdxaCofB42QQ\_fT)
* Make sure you have not disabled webRTC with your browser; you can confirm you have webRTC disabled with your browser(s) here: [https://browserleaks.com/webrtc](https://browserleaks.com/webrtc)
* As a final resort, consider using a Cloud-hosted version of OBS instead, such as on Paperspace or AWS /w Parsec installed.

If the hardware-acceleration checkbox is not checked, check it and restart. Does it work now?

## Network issues

We provide a speed test to see if the connection works at all,[ https://vdo.ninja/speedtest ](https://vdo.ninja/speedtest) You should be able to see your video streamed back at you. If not, there might be a network problem.\
\
You can visit [https://browserleaks.com/webrtc](https://browserleaks.com/webrtc) or [https://networktest.twilio.com/](https://networktest.twilio.com/) for tools to help debug issues that might be impacting your network, such as Firewalls or incompatible browsers.
