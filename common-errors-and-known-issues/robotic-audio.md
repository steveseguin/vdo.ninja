---
description: Some causes and solutions for robotic audio issues
---

# Robotic audio

### There are a variety of possible reasons for robotic audio distortion, either in OBS Studio, the browser, or with the system itself. Below is a list of different causes and solutions.



One user reported that their _MyAsus_-software had an AI Noise-Cancelling Speaker set to ON for default audio output device (depicted in the attached image). Switching the setting to OFF resolved the issue.

<figure><img src="../.gitbook/assets/image (231).png" alt=""><figcaption></figcaption></figure>

Another user found that starting OBS in Administrator mode fixed the issue. They noticed the issue more often when the OBS browser source was put into the background or minimized, so some performance / system priority setting may have been the cause.&#x20;

\
OBS as well may have issues with the log file reporting "Max audio buffering reached!". Try to reduce your computer's CPU load, or perhaps consider upgrading to a newer computer. You can also try capturing the audio and video with the[ Electron Capture app](../steves-helper-apps/electron-capture.md) instead of the OBS Browser source, which may avoid some issues with OBS browser source audio capture.\


Checking the audio sample rate on your system can help as well. High sample rates, like 384-khz for either the microphone or default system device may cause the issue. As well, a 32-bit audio sample rate, versus 16-/24-bit, may cause it as well. VDO.Ninja works best at 48-khz and either 16- or 24-bit. Users with FiiO audio DACs may encounter this issue, for example.



Very high packet loss may cause distorted audio as well. Adding `&enhance&red` to the view/scene link may help, but chances are reducing the packet loss is your best bet instead. If using a VPN or behind a strict firewall that is forcing the relay servers to be used, address that if possible.



If using a virtual audio cable, or a pro-audio mixer, issues with audio buffers can cause clicking, but also perhaps audio distortion. Increasing the audio buffer with your virutal audio cable may help.



Surround sound headphones, like 5.1 / 7.1 Logitech/Corsair gaming headsets may cause disorted audio as well. Set the headphones and speakers to 2.0 stereo audio, disabing any surround sound effect, or perhaps change headsets.



Echo-cancellation can cause robotic audio effects, for example, having two tabs of VDO.Ninja open on the same computer can cause feedback loops that may be cancelling each other out.  As well, having a mobile phone or a second computer near by that is also streaming into a VDO.Ninja group may create a feedback loop that also can result in echo-cancellation issues.



Some versions of VDO.Ninja may be more prone to issues than others. https://vdo.ninja/v23/ is an older version for example that you may want to try, but there are a variety of others. If you notice the robotic audio issue is version-specific, please report the issue on Discord (https://discord.vdo.ninja).\
\
\
Adding `&noap` to the VDO.Ninja URL can disable web-audio processing in VDO.Ninja, and if a computer is heavily overloaded, disabling web-audio may help with robotic audio effects caused by audio buffer underruns.

