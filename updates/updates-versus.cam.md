# Updates - Versus.cam

* [versus.cam.md](../steves-helper-apps/versus.cam.md "mention")

#### August 3

* I think I finally got [https://versus.cam/](https://versus.cam/) done as a first-version, which is the upcoming and standalone replacement for the vdo.ninja/monitor page.\
  Versus.cam has some interesting features that are specific to the upcoming version of VDO.Ninja, so at the moment it only works in conjunction with vdo.ninja/alpha/
* It contains a larger and dedicated graph per scene/view link than what the vdo.ninja/beta/'s director room has under scene-stats. Both color code to indicate packet loss, where red is bad, and green is good.
* It is setup to use a group room by default, with a very simple interface to login and get started without visiting vdo.ninja itself.
* Despite having a group room by default, it works with standalone push/view links as well, via the "Add a stream manually" button, which lets you include normal view links that exist outside rooms.
* All the scene links and invite links are preconfigured for E-Sports , where video is set to pull around 20-mbps for smooth 1080p60 game play. The idea is, if you choose to use this page for creating links, it's all already setup to be used for ingestion.
* The room is configured so that guests cannot see or talk to each other. All guests can do is text-chat with the versus host.\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/1004209653623832576/unknown.png?width=400\&height=209)
* Versus.cam is compatible with a director and the director room, so you can use a director room AND the versus.cam room at the same time, without conflict.
* A new feature that Versus has, that will also soon be coming to the normal vdo.ninja directors' room, is the ability to **dynamically change the resolution and bitrate of remote scenes**. This works by means of the `&remote` control feature, which is preconfigured in the links already, so no director is needed when using versus. This will then also work with non-room links, so long as \&remote is included in their URL.
* I don't intend to add many advanced features to this site. It's designed to be very simple, elegant, and hyper focused on a single use case and user type -- esports and one-way ingestion of very high quality video. I'll likely be making more scenario-specific interfaces in the future like this, to make VDO.Ninja easier and less cluttered for common use cases.
* Versus.cam is built using the VDO.Ninja IFRAME API, which I hope demonstrates the flexibility of it.
* Versus.cam is only supported by Chrome/Chromium-based browsers; it isn't yet compatible with Firefox/Safari (they lack the features needed for it to operate)
* Please report bugs. It's a first release, using the alpha version of VDO.Ninja, so.. bugs are kind of expected.

#### May 15

* I've got the initial version of the stats page completed: [https://vdo.ninja/alpha/stats](https://vdo.ninja/alpha/stats)\
  I'm intending this to be the successor to the vdo.ninja/monitor page, with a focus on ease of use and high-bitrate / e-sports streams.
* Regardless of whether you use group rooms or not, you'll need to use a group room for this. That said, you can still pull in basic direct push/pull streams from outside of your room (that are not in any room).
* `&view=xxx,yyy` can be used to specify streams you want to pull, regardless of whether they are in your room or not. You can also click 'add stream manually', at the top
* `&room` and `&password` work. The password needs to be the same for both in-room streams and those streams outside your room. I don't yet support unique passwords per stream, but that will happen I think eventually.
* Only solo links are provided; one per stream. You can still however use whatever scene you want, but that's outside the scope of this tool. These solo links are pre-configured for 12-mbps and h264.
* Your session is saved automatically to local storage. When you reload, you can start a new session or reload the last session.
* An invite link is available. It will ask the user for a display name. It will try to capture 1080p60 by default. It will allow the guest to use TEXT chat with those in the room, but they cannot see or hear others in the room.
* This stats page is compatible with the director's room, so you can use both at the same time. It will not prevent a main director from still claiming the director's room and having full-control if needed. This is purely for monitoring and basic feed management.
* I've yet to give this project a proper name, but this is just the start of it. I have some ideas on where to take it; I welcome other input as well.\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/975187594159734844/unknown.png?width=400\&height=227)![Bild](https://media.discordapp.net/attachments/701232125831151697/975187594449154099/unknown.png?width=400\&height=245)
