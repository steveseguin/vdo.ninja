---
description: If your microphone drops out after a few seconds
---

# Mic audio dropping out

### One possible solution:

One user had an issue where their microphone audio would drop out now and then; not just in VDO.Ninja, but in all browser-based web apps.\
\
They resolved the issue by **disabling**  certain webRTC audio processing options in the browser \
\
In Chrome, \
\
From `chrome://flags` we disable:\
``\
&#x20; `#enable-webrtc-allow-input-volume-adjustment`

&#x20; `#chrome-wide-echo-cancellation`\


_ℹ️ This also might be a useful option if using a USB mic that has the audio volume controls changing against your will, such as with a Blue Yeti._

\
In Firefox, we disable:

`media.getusermedia.aec_enabled`

`media.getusermedia.agc_enabled`

`media.getusermedia.noise_enabled`

`media.getusermedia.hpf_enabled`\
``

### iPhone issues

iPhone 14 phones in paritcular have been pretty buggy with Audio, along with older versions of iOS across all iOS devices.

Make sure to update your iOS device if possible, use the newest version of VDO.Ninja (perhaps even the alpha version at https://vdo.ninja/alpha/), and disable any audio processing in VDO.Ninja by adding `&noap` to the URL.



### Bluetooth or microphones connected to a USB hub

It is not recommended to use Bluetooth audio devices with VDO.Ninja.  In the past, there were drop outs when using AirPods on a battery-powered Macbook, for example.  Constant bluetooth range / connectivity issues can also cause VDO.Ninja to potentially lose the connection to the microphone.

USB Hubs are not all created equal, and some may cause USB devices to drop in and out. For this reason, connect your microphone and cameras directly to computer, bypassing USB hubs if possible.



### Inbound mobile calls or background notifications

Audio captured from a microphone may be paused or stopped if there is an inbound phone calls or system notifications. I suppose this is a mobile security consideration, but after a notification alert, the microphone may sometimes not be re-activivated, either due to a system-bug or other.\
\
For this reason, disable notifications, inbound calls, etc, while streaming on mobile with VDO.Ninja.\


### Packet loss or an over-stressed computer

Computers that are running at near 100% CPU load can fail to encode audio streams, audio drop outs may occur during a call as a result.  Please consider reducing the CPU load on your system to avoid this issue.\
\
Heavy network packet loss, such as a bad WiFi connection can also cause audio drop outs.  Completely connection losses are possible also, particularly if behind a corporate firewall or VPN service that is throttling or restricting webRTC services.



