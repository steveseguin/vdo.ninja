---
description: Some causes and solutions for robotic audio issues
---

# Robotic Audio Distortion

## Troubleshooting Robotic Audio Distortion in VDO.Ninja

### Overview

When experiencing robotic audio distortion in VDO.Ninja, the issue could stem from several sources - your system settings, OBS Studio, or even your browser. Below, we'll explore the various causes and their solutions.

### System Configuration Issues

One of the most common sources of audio distortion relates to your system's audio settings. Users with high sample rates (such as 384-khz) on their microphone or default system device often encounter problems. Similarly, 32-bit audio sampling can create issues. VDO.Ninja performs best with 48-khz sampling rate and either 16- or 24-bit depth. This is particularly relevant for users with FiiO audio DACs.

Some users have found that certain software features can interfere with audio quality. For instance, the _MyAsus_ software's AI Noise-Cancelling Speaker feature, when enabled for the default audio output device, has been known to cause distortion. Simply switching this setting to OFF has resolved the issue for many users.

Gaming peripherals can also be a source of trouble. Users with surround sound headphones, particularly 5.1/7.1 Logitech or Corsair gaming headsets, may experience distorted audio. To resolve this, try setting your headphones and speakers to 2.0 stereo audio and disable any surround sound / DTX effects.

If problems persis&#x74;**,&#x20;**<mark style="background-color:yellow;">**consider switching to a different non-gaming headset.**</mark>

### OBS Studio-Related Problems

When using OBS Studio, you might notice the issue becomes more pronounced when the browser source is minimized or running in the background. Some users have found success by simply <mark style="background-color:yellow;">**running OBS in Administrator mode**</mark>, suggesting the problem may be related to system priority settings.

If you see "Max audio buffering reached!" in your OBS log files, your computer might be struggling with CPU load. You have several options: reduce the demands on your CPU, upgrade your hardware, or try using the [Electron Capture app ](../steves-helper-apps/electron-capture.md)instead of the OBS Browser source for audio and video capture.\
\
DO NOT use OBS's CPU monitor to judge CPU usage — it's deceptive and never close to accurate. Instead, use the Windows Task Manager, or whatever system resource manager there is. It will offer a more accurate total system CPU usage value, and if its near or at 100%, then that can cause OBS to have delayed or robotic audio.\
\
Try not monitoring the audio of sources in OBS, especially browser sources; for some users, this has fixed the issue. You can monitor the audio of guests via VDO.Ninja instead directly, or by using the Electron Capture app instead.

### Audio Routing and Echo Issues

If you're using virtual audio cables or a professional audio mixer, audio buffer issues might manifest as clicking sounds or distortion. Increasing the audio buffer size in your virtual audio cable settings often resolves these problems.

Echo cancellation can create unexpected robotic effects, particularly in specific scenarios. Having multiple VDO.Ninja tabs open on the same computer can create feedback loops that trigger echo cancellation. Similarly, if you have a mobile phone or second computer nearby that's streaming into the same VDO.Ninja group, you might experience feedback loops resulting in echo cancellation issues.

Do not test audio with two devices side by side, or even in the room next door. Smartphones have sensitive microphones and echo-cancellation can cause issues even if the test device is somewhere else in the house.

### Network and Connection Problems

High packet loss can significantly impact audio quality. While adding `&enhance&red` to your view/scene link might help, addressing the underlying packet loss is usually more effective. If you're using a VPN or operating behind a strict firewall that forces the use of relay servers, try to resolve these network constraints first.

Avoid WiFi and bad network connections.\
\
Ensure that OBS is allowed through your system's firewall; sometimes a user might block OBS from accessing the Internet in full, and that can cause network issues.\
\
OBS also has an issue where it hides local IP addresses when making peer connections; this can in some cases force connections that should stay on a local network to be forced over the Internet. This can add network instability and packet loss, which at times may cause bad audio. If you're comfortable lowering the web security of your browser engine within OBS, you can do this by starting OBS with the following command line parameters:\
\
`obs64.exe --disable-web-security --allow-running-insecure-content --ignore-certificate-errors --use-fake-ui-for-media-stream`

### Version-Specific Considerations

Different versions of VDO.Ninja may handle audio processing differently. If you're experiencing persistent issues, you might want to try an older version, such as https://vdo.ninja/v23/. For systems under heavy load, adding `&noap` to your VDO.Ninja URL will disable web-audio processing, which can help with robotic audio effects caused by audio buffer underruns.

If you notice that the audio issues are specific to certain versions, please report them through the Discord community (https://discord.vdo.ninja). Your feedback helps improve the platform for everyone.\
\
Different versions of OBS Studio also can cause issues.  Try different versions of OBS if facing issues, especially new issues, and consider not using new versions of OBS for production purposes until doing tests. I like to skip versions if the current version is working well, only upgrading when needed.

### Electron Capture app

If Chrome or OBS is having an issue with audio, consider using the [Electron Capture app](../steves-helper-apps/electron-capture.md) instead. It's optimized for good performance and avoids browser extensions from interfering with VDO.Ninja.

### More resources and support

While you can drop by Discord (https://discord.vdo.ninja) for support, check out this related guide that has common issues for [audio clicking and audio distortion](audio-clicking-popping-distortion.md). It offers quite a few other possible causes of audio issues.

{% content-ref url="audio-clicking-popping-distortion.md" %}
[audio-clicking-popping-distortion.md](audio-clicking-popping-distortion.md)
{% endcontent-ref %}
