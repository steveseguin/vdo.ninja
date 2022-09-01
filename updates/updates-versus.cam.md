# Updates - Versus.cam

* [versus.cam.md](../steves-helper-apps/versus.cam.md "mention")

#### August 9

* Y

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
