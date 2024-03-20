---
description: The mic's gain won't stay still or the auto-gain won't turn off
---

# Mic's volume keeps changing

Some microphones, like the Blue Yeti, Wave XLR, Samsun Q2U, or Scarlett Solo XLR interface, may have issues with Chrome (Chromium) and the mic's gain auto-changing on its own. This may cause clipping in certain cases or it may interfere with other applications that may also be using the microphone.\
\
You can also add [`&autogain=0`](../source-settings/autogain.md) to the VDO.NInja invite link to disable the auto-gain. You can also toggle the auto-gain from the VDO.Ninja settings menu, or if a guest, the room's director can remotely toggle the guest's auto-gain via: advanced options -> audio settings -> auto gain control. \
\
Disabling the auto-gain functionality in VDO.Ninja may cause the audio level to be rather low, so it will be up to you then to manually set the gain accordingly. VDO.Ninja offers manual gain if needed.\
\
An additional option to addressing this issue seems to be installing a browser extension that with disable auto-gain automatically within Chrome. ([https://chrome.google.com/webstore/detail/disable-automatic-gain-co/clpapnmmlmecieknddelobgikompchkk](https://chrome.google.com/webstore/detail/disable-automatic-gain-co/clpapnmmlmecieknddelobgikompchkk))&#x20;

If the above options do not work, another option perhaps is to use a single virtual audio cable for all your applications instead of access the microphone directly. In this case, you'd send the mic audio to that virtual audio device, which allows you to have a single point of control for gain. There's numerous virtual audio cables out there, including Voicemeeter and Virtual Audio Cable.

For more information on this topic, you can see discussions here, [https://support.google.com/chrome/thread/7542181?hl=en\&msgid=79691143](https://support.google.com/chrome/thread/7542181?hl=en\&msgid=79691143), and more recently here,  [https://support.google.com/chrome/thread/210106028/google-chrome-constantly-auto-adjusting-microphone-levels-solved](https://support.google.com/chrome/thread/210106028/google-chrome-constantly-auto-adjusting-microphone-levels-solved).
