---
description: All the updates for Raspberry.Ninja
---

# Updates - Raspberry.Ninja

* [raspberry.ninja.md](../steves-helper-apps/raspberry.ninja.md "mention")

#### August 9

* You can wire up an LED to the Raspberry Ninja project now, on a RPi, to use as a connection-status indicator. see `https://raspberry.ninja/raspberry_pi/`![Bild](https://media.discordapp.net/attachments/701232125831151697/1006385249577598976/unknown.png?width=385\&height=300)

#### August 6

* New URL for the Raspberry\_ninja project: [https://raspberry.ninja/](https://raspberry.ninja/) (rather than having to scour GitHub to find it). And it's prettier than it used to be.\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/1005272561493491843/unknown.png?width=272\&height=300)
* Created a new uSD image for the Nvidia Jetson and the Raspberry Ninja project; might help with audio issues. Might also work with newer Jetson boards. Compatible with uSD cards of size 16-GB and greater now.

#### March 25

* Added the ability to save the outbound video stream to disk when using raspberry\_ninja. Just add `--save` as a CLI option and it will start saving the video + audio to disk. Viewers can connect as needed without disturbing the recording.
* improved the rotate function recently added to raspberry\_ninja; now does a native rotation when using the official raspberry pi camera
* Faster reconnecting when not using `--multiviewer` on the raspberry\_ninja; hangs up the old connection immediately when it intentionally disconnects (such as a browser refresh)

#### March 24

* Added the ability to rotate the camera (via command line ) on the raspberry\_ninja. Portrait mode or flipped video can be supported as a result.

#### March 17

* Added basic room support to raspberry\_ninja. Use: `--room ROOMNAME --multiviewer`
* Fixed a couple glitches with the raspberry\_ninja project when self hosting with multiple cameras and related fixes/improvements (like not needing to refresh the viewer page to trigger it to play). Updates on GitHub\
