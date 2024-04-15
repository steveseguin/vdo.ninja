---
description: Several possible causes of audio not working in Windows are listed
---

# Audio over VDO.Ninja isn't working

### OBS isn't set to capture audio

If using OBS for audio playback, be sure that you select "Control Audio via OBS" in the browser source to capture the audio. You won't be able to hear the audio by default this way, but OBS should show the audio level meters moving, signifying the audio is being captured.

<figure><img src="../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

### OBS may be having a max buffer issue

Restarting the computer or OBS can sometimes resolve issues where OBS stops capturing audio via browser sources or sometimes other audio soures.

Some users report that the audio may sound distorted or out of sync as well, but often there may be no audio at all.\
\
Starting OBS in adminstirator mode, if using Windows, may help. Reducing the CPU load on your computer may also also help.

### Sample rates or invalid audio settings

If however you are testing VDO.Ninja and audio isn't working at all, from browser to browser, yet you see your mic-level loudness green indicator moving in VDO.Ninja as you speak, double check your Windows audio settings. In particular, high sample rates, like 384-khz sample rates, 32-bit depth audio playback, or other professional audio device settings in Windows may cause problems with audio playback.

<figure><img src="../.gitbook/assets/image (4) (9).png" alt=""><figcaption></figcaption></figure>

To avoid issues, set your audio playback devices (specifically to the audio playback device) to 24-bit or 16-bit audio, with an audio sample rate of 48,000-hz, or as close to it as possible. If you mic-source isn't working, also check to make sure your microphone is 16 or 24-bit capture mode, and isn't in ASIO mode.

Surround sound or multi-channel audio, for both the microphone and audio playback devices, can cause audio problems with the browser. Disable surround sound, limiting audio playback to stereo 2.0 channels, and try again.

If using a remote virtual desktop, such as a server-hosted version of Windows, be sure the Windows audio service is enabled; you might be able to turn this on via `services.msc` , accessible via the `Windows Key + R` run prompt.

Also check that the default audio device in Windows is as expected and that any select audio output device in VDO.Ninja is pointed to the right location. Bluetooth devices may sometimes be problematic, especially on mobile, so try to avoid Bluetooth if possible.

### Echo cancellation

Sometimes if there is background audio being captured, the system will remove that audio thinking it is an echo of feedback. If this background audio contains your microphone audio, your microphone audio may be removed. You can disable echo cancellation in this case, or resolve the core issue.

{% content-ref url="echo-or-feedback-issues.md" %}
[echo-or-feedback-issues.md](echo-or-feedback-issues.md)
{% endcontent-ref %}

### External USB / Lightning audio

If using an external audio device on mobile, like via USB, it's suggested to use a TRRS audio input adapter, with the your microphone connected to that.

[https://www.youtube.com/watch?v=BBus\_S8iJUE](https://www.youtube.com/watch?v=BBus\_S8iJUE\&feature=youtu.be)\
\
If on Android, using Firefox might work well without the need of TRRS however.

### If using the native mobile app

If using the native VDO.Ninja mobile app, please note that screen sharing might only contain microphone-sourced audio -- the system audio won't be detected at the moment. This will hopefully change soon, but there is no timeline as to when it will be working.

