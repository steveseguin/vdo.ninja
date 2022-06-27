# Mic's volume keeps changing

Some microphones, like the Blue Yeti or Samsun Q2U, may have issues with Chrome (Chromium) and the mic's gain auto-changing to be too loud.

You can see this thread, [https://support.google.com/chrome/thread/7542181?hl=en\&msgid=79691143](https://support.google.com/chrome/thread/7542181?hl=en\&msgid=79691143), for solutions. One option seems to be installing a browser extension.\
\
You can also add [`&autogain=0`](../source-settings/autogain.md) to the guest/push link in VDO.Ninja. This disables auto-gain functionality in VDO.Ninja, but it will be up to you then to manually set the gain accordingly. VDO.Ninja does offer a manual gain option that the director or publisher can control, and this gain-option does not interfere with the mic's own gain setting.\
\
If a guest has already joined a room, and this is an issue, the director can remotely disable the guest's auto gain via the advanced options -> audio settings -> auto gain control.&#x20;
