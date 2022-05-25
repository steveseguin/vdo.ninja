# FAQ

## Project Information and Support Links

**Web service URL**: [https://vdo.ninja/](https://vdo.ninja/)\
**Project development URL**: [https://github.com/steveseguin/vdo.ninja](https://github.com/steveseguin/vdo.ninja)\
**Developer/maintainer**: [steve@seguin.email](mailto:steve@seguin.email)\
**Donations**: [via GitHub Sponsors](https://github.com/steveseguin/obsninja/wiki/Sponsor-%E2%9D%A4)

### Community Support

**Discord**: [https://discord.vdo.ninja](https://discord.vdo.ninja)\
**Reddit**: [https://www.reddit.com/r/vdoninja](https://www.reddit.com/r/vdoninja)

## Where can I get support?

The preferred support mechanism is via [Reddit](https://www.reddit.com/r/obsninja) or [Discord](https://discord.gg/6RqafB), which offer community-assisted support. Development issues, feature requests, and bugs are tracked on [Github](https://github.com/steveseguin/obsninja). For mission critical support issues, or business-related inquiries, you can contact Steve directly.

## Where can I report a bug?

It is most helpful to report bugs via the official [Github](https://github.com/steveseguin/obsninja). We also monitor the [Reddit](https://www.reddit.com/r/obsninja) and [Discord](https://discord.gg/6RqafB) channels, though it is easier to miss reports that occur there.

## Group Chat (aka, a room)

The group chat feature creates a virtual room where multiple devices can connect to share audio and video. It offers echo-cancellation and text-chat support as well. A room's ‘director’ can manage the guests from the control room, easily accessing individual sources for integration into OBS.

### How does Group Chat work?

* Guests have their own link to join the chat room. They will be able to see all of those in the chatroom, including themselves. Settings to restrict what sources each group member can see or hear are also available.&#x20;
* The 'director' will be able to view the chat room, without joining it themselves, and they will have controls provided that will let them modify aspects of how the room shows up in their OBS. For example, they will be able to mute certain people so they can't be heard or seen in OBS.
* The director will be provided isolated direct links to each of those video streams in the group room, allowing for fine-grain mixing control in OBS.
* Text-chat is available to those in the group chat.
* Passwords are available to keep rooms secure, but are optional. Passwords are not stored on any server; they are used for client-side end-to-end encryption.
* Guests present in the Group Chat room will see and hear all other present guests video/audio streams; by default anyways.
* The video quality of those in a group room will appear low to guests, but this is to ensure more bandwidth and CPU resources are made available for the OBS's access to the stream. You can increase the quality, but with potentially detrimental results.
* Group rooms are not restricted in size, although more than 10 guests can start to be challenging.

Using OBS Virtualcam (or the Mac equivalent), you can let your guests view the OBS live stream itself with sub-100ms of latency. In this case, each guest only needs to view one video stream, the main mixed OBS stream, freeing up group resources to allow for even larger group rooms. This is usually called [`&broadcast`](advanced-settings/view-parameters/broadcast.md) mode.
