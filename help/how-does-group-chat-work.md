---
description: Group Chat (aka, a room)
---

# How does Group Chat work?

The group chat feature creates a virtual room where multiple devices can connect to share audio and video. It offers echo-cancellation and text-chat support as well. A room's ‘director’ can manage the guests from the control room, easily accessing individual sources for integration into OBS.

* Guests have their own link to join the chat room. They will be able to see all of those in the chatroom, including themselves. Settings to restrict what sources each group member can see or hear are also available.&#x20;
* The "director" will be able to view the chat room, without joining it themselves, and they will have controls provided that will let them modify aspects of how the room shows up in their OBS. For example, they will be able to mute certain people so they can't be heard or seen in OBS.
* The director will be provided isolated direct links to each of those video streams in the group room, allowing for fine-grain mixing control in OBS.
* Text-chat is available to those in the group chat
* Passwords are available to keep rooms secure, but are optional. Passwords are not stored on any server; they are used for client-side end-to-end encryption.
* Guests present in the Group Chat room will see and hear all other present guests video/audio streams; by default anyways.
* The video quality of those in a group room will appear low to guests, but this is to ensure more bandwidth and CPU resources are made available for the OBS's access to the stream. You can increase the quality, but with potentially detrimental results.
* Group rooms are not restricted in size, although more than 10 guests can start to be challenging.

Using OBS Virtualcam (or the Mac equivalent), you can let your guests view the OBS live stream itself with sub-100ms of latency. In this case, each guest only needs to view one video stream, the main mixed OBS stream, freeing up group resources to allow for even larger group rooms. This is usually called \&broadcast mode.
