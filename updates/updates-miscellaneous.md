# Updates - Miscellaneous

#### March 30

* created the example page: [https://vdo.ninja/examples/rotated.html](https://vdo.ninja/examples/rotated.html), which lets you rotate a specific website 90, 270, or 180 degrees. `&rotate` and URL encoded `&link` parameters accepted. Works with any website that supports IFrame embedding I think; **VDO.Ninja** or other. \
  ie:\
  [https://vdo.ninja/examples/rotated.html?rotate=270\&link=https%3A%2F%2Fvdo.ninja%2Falpha%2Fmixer](https://vdo.ninja/examples/rotated.html?rotate=270\&link=https%3A%2F%2Fvdo.ninja%2Falpha%2Fmixer)\
  ![](<../.gitbook/assets/image (1) (13).png>)

#### March 7

* I updated Vingester to support VDO.Ninja v22 (production and newer)\
  \-- It doesn't seem like Vingester is being actively updated anymore, and there were some breaking changes in [v22](../releases/v22.md) that prevented audio from being captured. I tried, but couldn't reasonably fix the issue from VDO.Ninja's side, so I've forked the Vingester repo and will maintain it as best I can in the meanwhile.\
  \-- You can get the windows-build, with security patches applied and the audio-bug fixed, from here: [https://github.com/steveseguin/vingester/releases/tag/2.8.1](https://github.com/steveseguin/vingester/releases/tag/2.8.1)

#### March 6

* I still have [rtc.ninja](https://rtc.ninja/) up, which is a brand-free version of VDO.Ninja. Based on a user request, I additional just hid some additional buttons on the landing page, such as the "show more" and "create reusable" links, leaving just the basics now.\
  ![](<../.gitbook/assets/image (22).png>)

### 2022

#### December 2

* Updated the support for [vingester.app's](https://vingester.app/) audio destination selector to v22 of VDO.Ninja; it was no longer working with v22.

#### November 12

* Create a sample of how to apply a custom full-page overlay on top of VDO.Ninja: [https://vdo.ninja/alpha/examples/overlay](https://vdo.ninja/alpha/examples/overlay)\
  \
  For example, the default (leave field blank option) shows how to apply a logo on top of a guest invite. It isn't clickable, so it won't interfere with the app itself (other than make it harder to see things).\
  ![](<../.gitbook/assets/image (12) (1).png>)

#### October 1

*   I'll be having to start white-listing domains that [invite.cam](https://invite.cam/) can use, due to abuse of the service by phishing scammers. This won't impact VDO.Ninja users, but it may impact users who have been using it for non-VDO.Ninja related things.

    \-- vdo.ninja, rtc.ninja, etc, will all still work as normal. I'll be happy to whitelist other domains for community members who reach out to me that need it.\
    \-- Untrusted domains will still work, but I will be prompting visitors to such links to proceed only if they trust the creator of the link. Nothing threatening, but I hope it's enough to discourage abuse.\
    \-- I've had to start a blacklist of sites due to reports of phishing abuse that I am accountable for blocking.\
    ![](<../.gitbook/assets/image (2) (6) (2).png>)

#### September 9

* Fixed an issue with with passwords containing special characters being used at invite.vdo.ninja

#### August 6

* The Discord bot on our [VDO.Ninja server](https://discord.gg/Hk9aKgtUHc) is a custom-made one, with the goal being to have a single bot running everything here. [@leb](https://github.com/lebaston100) made a large update to the bot this week, which includes Reddit support, added support for !commands within our new Threading system. (the old third-party reddit bot broke, so it's just an extra reason to remove it and do it ourselves)\
  There's other improvements, such as smarter spam detection, images/avatars added to the new [updates.vdo.ninja](https://updates.vdo.ninja/) feature, responses are now embedded replies, and dynamic command updates are supported.\
  The code is open source here: [https://github.com/steveseguin/discordbot](https://github.com/steveseguin/discordbot)\
  Thanks [@leb](https://github.com/lebaston100)

#### July 27

* Improved the messaging at [vdo.ninja/convert](https://isolated.vdo.ninja/convert); warns if file is too large and offers ffmpeg/handbreak alternatives in those cases. (also more input file formats supported)

#### July 11

* Updated [https://vdo.ninja/twitch](https://vdo.ninja/twitch) so that it saves the last entered Twitch ID and VDO.Ninja URL/ID, so you don't need to re-enter each time on load. (fyi, this page is an option for IRL streamers to see post video to VDO.Ninja while also viewing twitch chat)

#### May 12

* Created a virtual MIDI remote controller app, designed to demonstrate how to use the MIDI transport function of VDO.Ninja via its IFrame API.\
  \
  The notion is, it lets a user create buttons or input sliders on a web page that represent MIDI inputs. You can save/export/import the inputs you create. Pressing a button or moving a slider will broadcast out those values via VDO.Ninja. Of course then, there's also a 'playout link', which if opened will send the inbound MIDI values to your MIDI devices; virtual or real.\
  \
  Using this, you could in theory allow for the remote control of software on your computer that supports MIDI input or remotely control the volume of a Raspberry Pi. Sharing the button layouts with others is as simple as sharing a text file and link. Only the data receiver needs a MIDI device; the sender (remote controller) just needs access to the web-interface.\
  \
  Chat and file transfer support is included, while audio and video is disabled. This is using data only mode.\
  \
  Buttons can currently be set using MIDI byte values or with an input learning function; there's lots of room for improvement of course, so I am considering this a prototype for now.\
  It's on alpha at [https://vdo.ninja/alpha/remotemidi](https://vdo.ninja/alpha/remotemidi)\
  ![](<../.gitbook/assets/image (167).png>)

#### April 19

*   Coded up a quick demo of how to combine multiple rooms into one, as a director using the IFRAME API:

    ```
    https://vdo.ninja/examples/multi?rooms=room1,room2,room3
    ```

#### February 15

* Did a YT video demoing the web3.vdo.ninja concept; rambled about it for a while\
  [https://youtu.be/HXTC458sllM](https://youtu.be/HXTC458sllM)

#### February 14

* [https://invite.cam/](https://invite.cam/) was updated to fully embrace the VDO.Ninja over the older one; old links will still work tho. The GitHub for the site was updated also.

#### February 13

* Experimented a bit with the notion of making VDO.Ninja even more 'web 3.0', so in this case decentralizing the handshake server. I think I finally have a proof of concept of VDO.Ninja working over the IOTA crypto blockchain.\
  \
  It's not serverless, as you still need a blockchain server to talk to, but it's decentralized, meaning every guest can connect via a different server end points. This allows for abstracted communication of each peer with each other by a common public ledger. Once the handshake is complete, it's all peer to peer, and the blockchain connection can be removed.\
  \
  To try it out, just open this site in two tabs, enter the same room name when prompted, and wait a minute or two: [https://vdo.ninja/beta/iota/](https://vdo.ninja/beta/iota/) If it doesn't work, refresh and wait a couple minutes. You can also use [`&room=ROOMNAME`](../general-settings/room.md) as a URL parameter to affix the room name to the link.\
  \
  I've identified numerous issues and concerns with using the blockchain as an API, but the most blatant one users will notice is how much slower it takes to connect. Solutions abound though, so I'll keep chipping at the problems over the coming months.
