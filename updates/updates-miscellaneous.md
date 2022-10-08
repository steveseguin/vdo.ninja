# Updates - Miscellaneous

#### October 1

*   I'll be having to start white-listing domains that [invite.cam](https://invite.cam/) can use, due to abuse of the service by phishing scammers. This won't impact VDO.Ninja users, but it may impact users who have been using it for non-VDO.Ninja related things.

    \-- vdo.ninja, rtc.ninja, etc, will all still work as normal. I'll be happy to whitelist other domains for community members who reach out to me that need it.\
    \-- Untrusted domains will still work, but I will be prompting visitors to such links to proceed only if they trust the creator of the link. Nothing threatening, but I hope it's enough to discourage abuse.\
    \-- I've had to start a blacklist of sites due to reports of phishing abuse that I am accountable for blocking.\
    ![](<../.gitbook/assets/image (2).png>)

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
