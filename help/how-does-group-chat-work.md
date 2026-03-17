---
description: General information about group rooms and how they work.
---

# Common questions re: Rooms

For a more in-depth guide on how to setup a group chat room, [please see this getting started guide.](https://docs.vdo.ninja/getting-started/rooms)\
\
The group chat feature in VDO.Ninja creates a virtual room where multiple devices can connect to share audio and video. It offers echo-cancellation and text-chat support as well, along with an easy to use screen share function.

Each room has a main director, whom can manage the guests from the control room, easily accessing individual sources for integration into OBS.  Only one main director can exist in a room at a time, however that main director can invite co-directors.

* Guests have their own link to join the chat room. They will be able to see all of those in the chatroom, including themselves. Settings to restrict what sources each group member can see or hear are also available.&#x20;
* Guests by default will be assigned a random stream ID each time they re-join a room with the invite link provided to them. This stream ID can be made permanent though if the invite link given to the guest specifies the stream ID in the URL using the `&push` parameter.  For more information on this, see [https://docs.vdo.ninja/guides/how-to-get-permanent-links](https://docs.vdo.ninja/guides/how-to-get-permanent-links).<br>
* The 'director' will be able to view the chat room, without joining it themselves, and they will have controls provided that will let them modify aspects of how the room shows up in their OBS.&#x20;
  * For example, directors will be able to mute certain people so they can't be heard or seen in OBS.
* The director will be provided isolated direct links to each of those video streams in the group room, allowing for fine-grain mixing control in OBS. These are called "solo links" in the director's room.<br>
* Text-chat is available to those in the group chat. You can upload files to other guests in the room, pop out the chat, and see certain events listed in the chat feed. The chat is peer to peer based, so it does not go through a server and is end-to-end encrypted by default.<br>
* Passwords are available to keep rooms secure, but are optional. Passwords are not stored on any server; they are used for client-side end-to-end encryption. Setting a password is strongly advised, as it both encrypts the peer to peer initial connection handshake, but it also scrambles the room name and stream IDs.
* Stream IDs are not unique to a room, but are global.  Using a password however "salts" the stream ID, and also the room name, so if you are intending to use a basic stream ID, such as "guest\_1", then adding a password to your room would make it highly unlikely that you'd ever have a collision with someone else using the same stream ID value.<br>
* Guests present in the Group Chat room will see and hear all other present guests video/audio streams; by default anyways. There are ways to change this, both via invite-link options, but also via having a guest be assigned to a group; an option the director has.<br>
* The video quality of those in a group room will appear low to guests, but this is to ensure more bandwidth and CPU resources are made available for the OBS's access to the stream. You can increase the quality, but with potentially detrimental results.
* Group rooms are not restricted in size, although more than 10 guests can start to be challenging.
  * For larger rooms, using `&broadcast` mode or `&meshcast` may be needed to avoid overloading the CPU or network of you and/or your guests
* Group rooms cease to exist when everyone leaves a room. Settings for a room are stored client-side, in your URL parameters or browser cache/storage, so when everyone closes their browser or leaves the room, the room ceases to exist.

Using OBS VirtualCam (or the Mac equivalent), you can let your guests view the OBS live stream itself with sub-100ms of latency. In this case, each guest only needs to view one video stream, the main mixed OBS stream, freeing up group resources to allow for even larger group rooms. This is usually called [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) mode.

{% embed url="https://www.youtube.com/watch?v=m1cIT1kdlEo" %}
