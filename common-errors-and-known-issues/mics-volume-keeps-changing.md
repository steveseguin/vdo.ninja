---
description: The mic's gain won't stay still or the auto-gain won't turn off
---

# Mic's volume keeps changing

Some microphones, like the Blue Yeti, Samsun Q2U, or Scarlett Solo XLR interface, may have issues with Chrome (Chromium) and the mic's gain auto-changing to be too loud.

You can see this thread, [https://support.google.com/chrome/thread/7542181?hl=en\&msgid=79691143](https://support.google.com/chrome/thread/7542181?hl=en\&msgid=79691143), for solutions.&#x20;

One option seems to be installing a browser extension that with disable auto-gain automatically within Chrome. ([https://chrome.google.com/webstore/detail/disable-automatic-gain-co/clpapnmmlmecieknddelobgikompchkk](https://chrome.google.com/webstore/detail/disable-automatic-gain-co/clpapnmmlmecieknddelobgikompchkk))\
\
You can also add [`&autogain=0`](../source-settings/autogain.md) to the guest/push link in VDO.Ninja, or try to manually disable the auto-gain from the VDO.Ninja settings menu. This disables auto-gain functionality in VDO.Ninja, but it will be up to you then to manually set the gain accordingly.

VDO.Ninja does offer a manual gain option that the director or publisher can control, and this gain-option does not interfere with the mic's own gain setting.\
\
If a guest has already joined a room, and this is an issue, the director can remotely disable the guest's auto gain via the advanced options -> audio settings -> auto gain control.&#x20;

In some cases, drivers or other applications being used at the same time as VDO.NInja may take control of the gain level as well, enabling auto-gain or changing the gain system-wide. In these cases, perhaps use a single virtual audio cable for all your applications instead could work.  In this case, you'd send the mic audio to that virtual audio device, allowing  you to have a single point of control for gain. There's numerous virtual audio cables out there, including Voicemeeter and Virtual Audio Cable.

