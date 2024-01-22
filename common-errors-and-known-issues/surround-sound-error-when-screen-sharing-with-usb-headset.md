---
description: >-
  Some surround sound headphones can cause VDO.Ninja to have audio problems,
  including failed screen sharing
---

# Surround sound error when screen sharing with USB headset

Surround sound or multi-channel audio, for either the microphone and audio playback device, can cause audio problems with the browser. For example, screen sharing may trigger an unreadable error, mentioning surround sound as a likely cause.

Unplugging or using a different USB headset in this case can often solve the issue.

Another option is to disabling surround sound in the Windows, or typically, the Logitech/Corsair settings. By limiting audio playback to stereo 2.0 channels, you can avoid complications encountered with surround sound playback or capture not properly being converted to something the browser understands. How to do this might depend on your audio device or the driver it uses.

In one past Reddit post, someone mentioned going to [**chrome://flags/**](chrome://flags/) and turning off **Override software rendering list** fixed their issue. I've not been able to test or confirm this though, since I do not have surround sound headphones.

For Logitech surround headphones specifically, the following old Reddit post mentions a fix for problematic surround sound and Chrome, along with a fix. I think this might have worked for one VDO.Ninja user in the past, but it's been a couple years now. Perhaps also update your drivers.

{% embed url="https://www.reddit.com/r/LogitechG/comments/f04vuz/logitech_g_pro_x_dts_surround_sound_is_horrible/" %}

Another possible fault is that the audio quality in Windows is too high; 384-khz or 32-bit audio may cause issues, for example. You might also have issues with ASIO-based drivers, DSD systems, and multi-channel audio systems. In these cases, set the audio output and microphone input in Windows to at most 24-bit at 48-khz stereo; VDO.Ninja doesn't typically offer better audio quality than this anyways.

<figure><img src="../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1).png" alt="" width="391"><figcaption></figcaption></figure>

Looking at the code, this error message is triggered when "NotReadableError" is reported by the browser, I think when screen sharing with audio. So, I suppose you can also screen-share without audio maybe, and then perhaps select a virtual audio device for the audio after the fact instead if you still need a window's audio. However, this is cumbersome to do.

Google or such might offer a solution as well, since this probably isn't a VDO.Ninja-specific issue. That said, you can try adding [`&inputchannels=2`](../advanced-settings/audio-parameters/and-inputchannels.md) to the guest/push links, to see if that helps at all. But beyond that, I'm not sure this can be addressed via VDO.Ninja's code itself.
