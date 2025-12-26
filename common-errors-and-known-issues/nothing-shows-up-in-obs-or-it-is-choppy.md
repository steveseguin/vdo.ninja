---
description: >-
  OBS Studio is just black in the browser source; potentially you hear audio,
  but nothing else.
---

# Nothing shows up in OBS

### Common causes for no video showing up in OBS are the following:

* Check OBS hardware acceleration settings
  * Enable or disable "Browser Source Hardware Acceleration" in OBS advanced settings
* Run OBS as Administrator (for Windows users)
  * This can resolve permission-related issues affecting video capture
* Try a different network connection
  * Switch between WiFi and cellular, or use a VPN to bypass potential network restrictions, or disable any VPN in use
* Your stream ID changed, entered incorrectly, or other setting / parameter is incorrect
* Try using a different browser to publish with; try Firefox, Edge, Chrome, or even the [native app](../steves-helper-apps/native-mobile-app-versions.md).

### If suffering from choppy video,

* Switch to Ethernet or try to [improve your WiFI ](packet-loss.md)/ Internet connection
* Increase the [video bitrate](../advanced-settings/video-bitrate-parameters/bitrate.md), especially if[ streaming a game](../guides/how-to-screen-share-in-1080p.md)
* Ensure your computer is not overloaded, especially in [larger group rooms](nothing-shows-up-in-obs-or-it-is-choppy.md#performance-optimization)
* If issues only exist for guests in a room, consider using [\&meshcast](../steves-helper-apps/meshcast.io.md) or increase the [total room bitrate](../advanced-settings/video-bitrate-parameters/totalroombitrate.md)

{% content-ref url="packet-loss.md" %}
[packet-loss.md](packet-loss.md)
{% endcontent-ref %}

## VDO.Ninja Troubleshooting Guide

### Platform-Specific Issues

#### Windows

* Ensure that the "Enable Browser Source Hardware Acceleration" checkbox is checked in the advanced settings.
* If you get black video when it's checked:
  * Try unchecking the Hardware Acceleration checkbox (may be choppy and use more CPU)
  * Run OBS Studio as an Administrator
  * Update OBS Studio to the newest version (fully uninstall old version first)
  * If using OBS 64-bit, try the 32-bit version instead
  * Enable Compatibility Mode for OBS (right-click OBS icon → properties)
* Ensure you have started in Administrator mode

<figure><img src="../.gitbook/assets/image (254).png" alt=""><figcaption><p>Make sure that the custom frame rate is not set</p></figcaption></figure>

#### macOS

* Old versions of OBS, such as OBS v24 to v26.0 do not natively support VDO.Ninja, but version 26.1.2 and newer does.
  * Use the Electron Capture app if you are using a non-compatible version of OBS. > [Get it here](https://github.com/steveseguin/electroncapture) <

#### Mobile Devices

* For Android smartphones, try using Firefox instead of Chrome if having issues
* For Samsung A-series smartphones (especially Galaxy A12), try different browsers or the native Android app
* Restart your smartphone if it suddenly stops working properly
  * Commonly when this happens the video output might be just black

### Network and Connectivity Issues

#### General Network Troubleshooting

* Run the speed test at [https://vdo.ninja/speedtest](https://vdo.ninja/speedtest) or [https://vdo.ninja/check](https://vdo.ninja/check) to verify the connection works
* Use diagnostic tools at [https://vdo.ninja/browsercheck](https://vdo.ninja/browsercheck), https://browserleaks.com/webrtc, or https://networktest.twilio.com/ to ensure WebRTC is enabled
* Check the stats while using VDO.NInja by adding `&stats` to the VDO.Ninja URL&#x20;
* If video is choppy, ensure there is no packet loss and that your computer is not overloaded

#### Firewall and Security Issues

* If in Iran, China, Russia, or other sanctioned/restricted country, WebRTC may be blocked; try using a VPN or self-host VDO.Ninja instead.
* If behind a corporate firewall or corporate VPN, try switching to cellular network or talking to your IT department. You may just need to switch a personal device on a cellular network.
* If using PFSense or a PiHole:
  * Try bypassing it or using a different network
  * Whitelist the IP address of the remote camera source
  * Allow webRTC-related UDP traffic to prevent frame loss
* Disable any anti-virus or other security software temporarily for testing
* Make sure you have not disabled webRTC in your browser settings
* If using Brave or other privacy focused browser, ensure the VPN isn't turned on
* Try a different browser in general, or a different computer/network

#### Connection Types

* If on cellular, try switching to a different network
* If issues persist on one network type, try another (WiFi vs. cellular)
* Try with or without a VPN, such as speedify.com, to see if it helps.
  * Speedify does offer a 1GB free usage tier I believe that's suitable for testing

#### Certain Browsers

* Some browsers or browser extensions will block WebRTC
  * De-Googled Chromium has a `WebRTC IP Policy` that blocks VDO.Ninja, which you can change in the `chrome://flags` menu.
  * Brave browser with premium VPN service may block VDO.Ninja
  * Some other security or privacy focused browsers may block VDO.Ninja
* It's also possible that some browsers are configured to block UDP, IP leaking, or WebRTC in other ways, so trying OTHER browsers is suggested.

### Performance Optimization

#### Hardware Issues

* Update your graphics card drivers, especially after a fresh install
* Switch the GPU used by OBS if using an NVidia GPU (via Nvidia control center)
* For laptops:
  * Check this guide: https://obsproject.com/wiki/Laptop-Troubleshooting#for-nvidia-based-laptops
  * Disable power-saving mode
  * Connect power directly to wall outlet

#### Resource Usage

* If your computer is running at high CPU/GPU load:
  * Lower browser source resolution to 1280x720 or even 640x360
  * Try using H264 codec (add `&codec=h264` to the view links)
  * Specify custom frame rate of 30 in browser source options
  * Try adding \&meshcast to your push link to use the SFU service

#### Video Codec Options

* Try different video codecs by adding parameters:
  * `&codec=h264` (often best for performance)
  * `&codec=vp9` (may help with specific devices)

### OBS-Specific Solutions

#### Hardware Acceleration

* If hardware acceleration is unchecked, check it and restart
* If it's checked but not working, try unchecking it
*   In OBS Settings → Advanced menu, try toggling "Browser source hardware acceleration"\
    <br>

    ![Disabling or enabling the hardware acceleration in OBS can sometimes fix choppy or missing video.](<../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### Alternative Solutions

* Download Electron Capture app instead of using OBS browser source:[ http://electroncapture.app](http://electroncapture.app)
* Consider using Cloud-hosted version of OBS (Paperspace or AWS with Parsec)

#### OBS WHIP Issues

* WHIP protocol may have NAT traversal issues (not fully supported yet)
* Can't publish WHIP via OBS outside your LAN? [Download our patched OBS version](https://backup.vdo.ninja/OBS_VDO_Ninja.zip). [\[source\]](https://github.com/steveseguin/obs-studio/)
* Try alternative connection methods if WHIP fails to connect

### Additional Recommendations

* Restart all devices involved (computer, phone, router) before extended troubleshooting
* If a device was working before but suddenly isn't, try a simple restart first
* For persistent issues, consider trying an entirely different device or browser
* Consider network congestion during peak hours as a possible cause of intermittent issues
* If you're experiencing issues with PFSense, check its logs for blocked connections
* Make sure you haven't limited the frame rate in the OBS browser source to something like 30-fps
* Always update to the latest browser versions as WebRTC support improves with each update
* Try an older version of VDO.Ninja, such as [https://vdo.ninja/v27.4/](https://vdo.ninja/v27.4/)
