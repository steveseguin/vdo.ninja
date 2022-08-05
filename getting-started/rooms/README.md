---
description: >-
  A room allows for group chat and enables a director to control the room and
  access to each stream
---

# Rooms

The rooms feature creates a virtual room where multiple devices can connect to share audio and video. It offers echo-cancellation and text-chat support as well. A room's ‘director’ can manage the guests from the control room, easily accessing individual sources for integration into OBS.

♻️ If a room isn't already in use, you can use and reuse it forever.\
🔑 Adding a password will allow you to use your room, even if the same room name is already in use.\
🏷️ You can change the room name anytime; just modify the URL.\
✈️ If the director transfers a user to a new room, that's a temporary transfer; the user will be moved back to the original room if they reconnect/refresh.

## How does it work?

### How many people can a room support? 📈

* There is Chrome-imposed limit of about 128 peers while using video and chat connections.
* You will probably bump into limits sooner, as a function of video decoding processor power on the host computer and (to a lesser degree) network bandwidth.&#x20;

If you want a room that can handle, (lets say 30 people even), it can be done, but everyone in the group needs good internet, a fast computer, or the room needs video previews disabled for guests. The [`&broadcast`](../../advanced-settings/view-parameters/broadcast.md) feature can help accomplish this, for example.

For very large groups, >40, it is generally advised that you use regular server-based chatting service, like Google Meets, and send an VDO.Ninja invite links to each person individually. This way, you can record the individual streams of those in the Google Meet at a high resolution, but still have all the guests be able to see and hear each other.

If you use OBS VirtualCam, now included with OBS v26, you can broadcast from OBS directly into the Google Hangouts or other conferencing software. To avoid audio feedback/echo issues, having the guests wear headphones is suggested.

### Privacy 🔒

* Passwords are available to keep rooms secure, but are optional.
* A room name + password combination makes the room unique. IE: a `?room=roomname&password=GeNeRaTedPaSsWoRd` and a `?room=roomname&password=ThisIsAnotherPassword` are different rooms.

### For guests.... 🧍

Guests have their own link to join a room. They will be able to see all of the other guests in the room, including themselves. Settings to restrict what sources each group member can see or hear are also available.

Guest devices present in the Room will see and hear all other present device video/audio streams.

Text-chat is available to those in the room

The video quality of those in a group room will appear low to guests, but this is to ensure more bandwidth and CPU resources are made available for the OBS's access to the stream. This can be changed with parameters such as [`&totalroombitrate`](../../advanced-settings/view-parameters/totalroombitrate.md) which lets you increase the bitrate of a room.

### For the director... 🎬

The director will be able to view the room, without joining it themselves, and they will have controls provided that will let them modify aspects of how the room shows up in their OBS. For example, they will be able to mute certain people so they can't be heard or seen in OBS.

The director can also join the room if needed. Toggle the 'Director will also be a performer' option when creating a room. This can also be done by appending [`&showdirector`](../../viewers-settings/and-showdirector.md) to the director page URL.

The director will be provided isolated direct links to each of those video streams in the group room, allowing for fine-grain mixing control in OBS.

Using OBS Virtualcam (or the Mac equivalent), you can even let your guests view the OBS live stream with sub-100ms of latency. In this case, each guest only needs to view one video stream, the main mixed OBS stream, freeing up group resources to allow for even larger group rooms.

A director can also address a specific guest via full screen text messages, or via dedicated talkback audio.

Text Messages can be broadcast to the room from the director.

## Isolated Solo links for each Room Guest <a href="#h.208l8vmog36i" id="h.208l8vmog36i"></a>

When you create a room, the guest's feeds will show up in the director’s room. While multiple people can join the director’s room, only the first director to join has the ability to issue commands. Any one in the director room can access the Isolated solo streams for each guest though.

Appended to the bottom of the video control box for each guest video is a SOLO LINK button and a link. You can copy the link with either the button or the link, or you can just drag the link (on Windows) into OBS. This gives you an independent window of that guest’s stream, at high quality.\
\
The controls in the VDO.Ninja’s director room only will let you adjust the volume (and mute) that solo video. The ‘add to scene’ links do not apply to solo-links.\
\
You can create a solo link by hand by doing [https://vdo.ninja/?room=RID\&view=SID\&scene](https://vdo.ninja/?room=RID\&view=SID\&scene)

Scene is left blank, while the [`&view`](../../advanced-settings/view-parameters/view.md) value is specified.\
\
Every time you view a link, in OBS or elsewhere, you increase the load on the remote guests’s computer. Pulling more than one HD feed from a remote guest is not advisable, unless they have a capable computer and good internet connection. As a director, you can disable the preview video in the control box, freeing up a small bit more bandwidth for those connected on very weak connections. (three buttons; video off / video on / binoculars for a HD preview).

![](<../../.gitbook/assets/image (2).png>)
