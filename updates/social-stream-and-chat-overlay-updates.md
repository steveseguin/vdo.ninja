---
description: All the updates for Social Stream & Chat Overlay
---

# Social Stream & Chat Overlay Updates

* [social-stream.md](../steves-helper-apps/social-stream.md "mention")
* [chat-overlay.md](../steves-helper-apps/chat-overlay.md "mention")

#### **August 31**

* New MIDI control feature for Social Stream: - the option to select a file containing text-strings for use with the MIDI-command option is available - sample file is included in the extension folder; edit it and select it from the extension menu (JSON format) - you shouldn't have to reload the file each time you open the browser; just when you reload the extension or when you want to update the commands with a newer file.\
  ![](<../.gitbook/assets/image (10).png>)
* Social Stream has had it's pop-out menu UI updated, courtesy of the one and only @jcalado (there's dark-mode support now, also) #pretty\
  ![](<../.gitbook/assets/image (1) (1).png>)
* Added workplace.com support to Social Stream
* The queue-order of messages now is visible with little numbers on the left-side of the message. Changes to the queue are synced across docks when using `&sync`
* slido.com support added to chat.overlay.ninja

#### August 26

* New features for SocialStream.ninja, by requests - option to sync multiple docks has been added. Add `&sync` to the docks that you want to share state between, and if enabled, when one dock selects a message, the other dock then treats that message locally as if it was already pressed, so they know what the other dock selected. (syncing queues I'll try to add later on)
* Added option to strip HTML from the dock as a URL parameter (rather than at the point of capture in the extension). Applies to donations, messages, and usernames.
* Option to save the last message received to a specified file added. It will over-write on each new message. It can be used either from the dock or without any dock (from the extension directly) You can use this to with apps that monitor files for changes, creating your own custom overlays. Stores the data as JSON, but I welcome feedback as to a better option.![Bild](https://media.discordapp.net/attachments/701232125831151697/1012796514315288616/unknown.png?width=380\&height=300)

#### August 23

* Added the option to send featured-chat messages from SocialStream's dock to the overlay page via a websocket server, in case the viewing destination doesn't support webrtc. (by request)
* You can push from server-side chat sources or via web-sockets to the dock page now, too. I created a sample source script to reference if you want to give it a go `sample_wss_source.html` \
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/1011750125674184735/unknown.png?width=400\&height=273)

#### August 22

* Updated socialstream.ninja to support `&password`. You need to set the password via the extension settings page, which is a bit hidden.

#### August 17

* Added theta.tv support to socialstream.ninja (via its pop out chat).
* Added support for LinkedIn "live" to socialstream.ninja (already had support for linkedin events).

#### August 9

* Minnit and livepush are social chat sources that have been added to socialstream.ninja (by request).
* chat.overlay has had an issue with messages auto-clearing after a minute fixed.

#### July 27

* Fixed some style issues with socialstream; mainly related to donos from twitch.
* Added a new option called `&autoshowdonos`, which when used with `&autoshow`, will auto feature highly donation messages.
* Added a new "send test message" to socialstream's extension menu (at the bottom) -- it lets you emulate an inbound social message for quick testing/setup.

#### July 25

* Added an option to align messages near center. `&split` (socialstream feature)
* Added some polish to the Facebook integration and dock layout as well; tweaking issues here and there
* Added support for FFZ twitch extension to socialstream![Bild](https://media.discordapp.net/attachments/701232125831151697/1001221042624266441/unknown.png?width=400\&height=291)

#### July 22

* Added google cloud premium text to speech support to socialstream.ninja. You need to bring your own API key though; I'm not including that part. details on GitHub: [https://github.com/steveseguin/social\_stream#premium-tts-voice-options](https://github.com/steveseguin/social\_stream#premium-tts-voice-options)

#### July 19

* More polish for socialstream.ninja, including more ruggedness added for Telegram (webK and webZ) and Discord.

#### July 15

* Fixed some issues with discord integration on socialstream
* Improved mac support for text-to-speech feature in socialstream
* Added `&chroma=0f0` as a URL option for socialstream; lets you set the background colors for the pages. Defaults to green for chroma keying

#### July 10

* vimm.tv and odysee support added to socialstream.ninja, plus some other minor tweaks

#### July 3

* socialstream.ninja was updated to support horizontal scrolling for the dock page (`&horizontal`) and extra-large emojis (`&emoji`)\
  ![](<../.gitbook/assets/image (9).png>)
