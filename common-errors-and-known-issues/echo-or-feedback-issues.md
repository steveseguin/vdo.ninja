---
description: Guests are sometimes able to hear themselves
---

# Echo or feedback issues

Dealing with feedback is challenging, as the reasons are numerous, but not always obvious. Below are some common causes:

* Headphones are too loud.\

* Using Safari as it has poor AEC abilities; use Chrome instead.\

* ``[`&proaudio`](../advanced-settings/general-parameters/stereo.md) or [`&stereo`](../advanced-settings/general-parameters/stereo.md) mode is being used. This mode will disable echo-cancellation and so you must use headphones in this mode.\

* Screen-sharing the desktop /w audio capture on, especially in the case of a group room, will create nasty feedback for others.\

* Incorrect OBS configuration is common, especially if the echo is only heard in the RTMP broadcast or recording, and not by those using VDO.Ninja themselves\

* Having two browser tabs open (such as one with the Youtube output playing) will cause echo. Echo cancellation only works within the same tab that the audio is played back and captured, and only if the echo is not prolonged.\

* Having two devices connected to VDO.Ninja near each other, or sometimes even in the same house, can create echo. Phones have very sensitive microphones and can pick up the audio of others who might also be on the group call.\

* Playing an IFrame within VDO.Ninja (website share) may not have that IFrame's audio cancelled out by the echo-cancellation features.\

* If screen sharing with desktop audio, that will create a feedback issue for guests.\

* If only appearing in the OBS recording or stream, check to make sure you are not capturing the desktop's audio in OBS. This can happen if not using "Control audio via OBS" in the OBS Browser source, capturing a screen-share into OBS, or trying to record the director's room audio with OBS.

![](<../.gitbook/assets/image (121) (1).png>)

#### Troubleshooting

A good way to troubleshoot is to mute one person at a time in a room, seeing if muting any specific single person solves the issue for everyone else.&#x20;

Normally the person who isn't hearing any echo or feedback is the cause.

If you identify that person, triple check that they are using Chrome and not Safari, make sure they are wearing headphones and that the audio is correctly playing into them, and have them close all other browser tabs and applications.

If the issue is only within OBS, this is likely an issue with OBS and not VDO.Ninja. Try disabling all global audio devices, muting audio devices in OBS one at a time, and double checking the advanced audio mixing settings.
