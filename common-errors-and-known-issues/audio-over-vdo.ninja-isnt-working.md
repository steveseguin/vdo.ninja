---
description: Several possible causes of audio not working in Windows are listed
---

# Audio over VDO.Ninja isn't working

If using OBS for audio playback, be sure that you select "Control Audio via OBS" in the browser source to capture the audio. You won't be able to hear the audio by default this way, but OBS should show the audio level meters moving, signifying the audio is being captured.

If however you are testing VDO.Ninja and audio isn't working at all, from browser to browser, yet you see your mic-level loudness green indicator moving in VDO.Ninja as you speak, double check your Windows audio settings. In particular, high sample rates, like 384-khz sample rates, 32-bit depth audio playback, or other professional audio device settings in Windows may cause problems with audio playback.

<figure><img src="../.gitbook/assets/image (4).png" alt=""><figcaption></figcaption></figure>

To avoid issues, set your audio playback devices (specifically to the audio playback device) to 24-bit or 16-bit audio, with an audio sample rate of 48,000-hz, or as close to it as possible. If you mic-source isn't working, also check to make sure your microphone is 16 or 24-bit capture mode, and isn't in ASIO mode.

Surround sound or multi-channel audio, for both the microphone and audio playback devices, can cause audio problems with the browser. Disable surround sound, limiting audio playback to stereo 2.0 channels, and try again.

If using a remote virtual desktop, such as a server-hosted version of Windows, be sure the Windows audio service is enabled; you might be able to turn this on via `services.msc` , accessible via the `Windows Key + R` run prompt.

Also check that the default audio device in Windows is as expected and that any select audio output device in VDO.Ninja is pointed to the right location. Bluetooth devices may sometimes be problematic, especially on mobile, so try to avoid Bluetooth if possible.
