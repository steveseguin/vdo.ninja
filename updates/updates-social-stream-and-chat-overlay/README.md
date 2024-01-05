# Updates - Social Stream & Chat Overlay

[social-stream.md](../../steves-helper-apps/social-stream.md "mention")\
[chat-overlay.md](../../steves-helper-apps/chat-overlay.md "mention")

#### **January 5**

* The emotes wall in Social Stream supports flag emojis correctly now\
  ![](../../.gitbook/assets/image.png)
* Twitter post support fixed in Social Stream

#### **January 3**

* `&onlyfrom` added as an option to the Social Stream dock.
  * You can pass a source type, which will the only show messages in the dock from those sources.
  * There is already `&onlytwitch`, but this allows for something like `&onlyfrom=facebook` or custom options.

### **2023**

#### **December 29**

* Updated Social Stream so it supports Vimm's WebSockets mode

#### **December 18**

*   Fixed the threads.net support on Social Stream. (the star button manually adds the post to the dock)

    * Also added an insta-hide and -block button to threads; cause why not.
    * Canadian users aren't blocked from linking out.

    <div align="left">

    <figure><img src="../../.gitbook/assets/image (226).png" alt=""><figcaption></figcaption></figure>

    </div>

#### **December 17**

* In Social Stream, you can now disable the ability for someone with a dock link to respond to chat.
  * This toggle option is in the general-mechanics section.

#### **December 10**

*   Added a "Clear All" button, which will clear the dock of all messages (excluding pinned), stop TTS, clear any queue, and clear the current featured chat.

    * Useful if you need an emergency clear button, in case someone spams the chat with something offensive or you are going live and want to clear your test messages
    * A sample on how to use this clear via an API is provided in the sampleapi.html page; ie: `https://api.overlay.ninja/SESSIONIDHERE/clear`

    <figure><img src="../../.gitbook/assets/image (222).png" alt=""><figcaption></figcaption></figure>
* `&excludefiltered` can be added to the dock.html page in Social Stream to prevent filtered messages from auto-featuring, when auto feature is on.

#### **December 9**

* Fixed an issue with the emoji wall and not all icons being the same size.
* Twitch chat pop out will not forward to the new chat site on stream end; it will stay on the original chat site despite a raid.
* Some trival Twitch events can be optionally highlighted in the dock; twitch events like a viewers first time speaking in chat.
* I've added code that tries to disable messages from being picked up still after the pop up has been forwarded to a new chat stream during a raid. You'll need to refresh the chat in this case to get it working again. This should help prevent chat messages from someone else's channel accidentally being picked up.
* Fixed an issue with discord avatars not working anymore in social stream; plus an issue re: name/message blocking not working with Discord.
* Improved support for YouNow.

#### **December 4**

* shareplay.tv added to Social Stream

#### **December 2**

* Live.space fix out for Social Stream, along with an opt-in channel feature, to avoid picking up chat from other channels
* Fixed some CSS issues, such as bubble-mode not including the name in the bubble when there was no message content\
  ![](<../../.gitbook/assets/image (1) (1).png>)

#### **November 28**

* Updated the Social Stream code with some more error handling to the `&server` mode logic
* Dialect support in Social Stream's Text to speech fixed; i.e: en-UK vs en-US, should be working now
* Added the TTS menu to
* Padding improvements and "member for N months" added to featured chat badge
* jaco.live added to Social Stream
* Google font options added to the hypemeter, wait list, etc, as well now; plus fixes

#### **November 23**

* The Extension version of Social Stream also has had some bug fixes pushed; an error related to user blocking caused some bot action to fail.

#### **November 21**

* Added dozens of new advanced transition in/out effects for the dock.html page.
  * [Video](https://discord.com/channels/698324796546482177/701232125831151697/1176622368853086268) of the transitions effects mentioned above
  * Added a "none" option to the transition options\
    ![](<../../.gitbook/assets/image (218).png>)
*   You can specify a Google font in Social Stream now; works for the dock or the featured chat page.

    * [https://fonts.google.com/](https://fonts.google.com/) fonts for reference are here; you just need to enter the name

    <figure><img src="../../.gitbook/assets/image (217).png" alt=""><figcaption></figcaption></figure>
* `&padding=5` added as an option to the dock page now; you can also enable it via the menu. this adds vertical spacing to the lines.
  * In this case , it's padding=5, but that's 5px x 2 = 10px pixels total. 5 is the default for `&padding`, but you can specify your own amount
  * I also modified the default vertical padding, even if not using \&padding; there's now a small bit of extra padding to make things a bit more readable
* Fixed an issues where the session IDs still were not saving in some cases. Hopefully that's fixed now, after updating the extension.

#### **November 20**

*   For those so inclined to make their own overlays for **Social Stream** from scratch, I've created a basic and bare HTML template for reference.

    * [https://socialstream.ninja/sampleoverlay](https://socialstream.ninja/sampleoverlay)
    * No functions like TTS or customization via URL parameters; it's just a simple fixed overlay with minimal code.
    * It can be used as a featured overlay or as a dock-alternative, with all messages. see the code for reference.

    <div align="left">

    <figure><img src="../../.gitbook/assets/image (216).png" alt="" width="213"><figcaption></figcaption></figure>

    </div>

#### **November 17**

* Pushed an update for Firefox and the Social Stream extension; it brings back basic Firefox support to the extension.
  * You'll need to installed it via the `about:debugging#/runtime/this-firefox` page as a temporary extension I guess? Or self-sign it.

#### **November 12**

* The hide/only Twitch option for Social Stream added to the index.html page also now.
* Twitch subs work again as 'stream events' that you can capture.
* More Easter eggs added to the Twitter integration.

#### **November 10**

**Social Stream updates**

*   Added an option to hide or limit to just Twitch chat.

    * Works for just the dock.html page currently; if you need it for other things, let me know.
    * This could be helpful if you wanted two dock pages open; one for an OBS with Twitch output and one OBS with an output for everything else.
    * You can also use the "filter messages" text bar in the dock menu to do th same, using `source:youtube` if you wanted to just show youtube, or `source:!youtube` if you wanted anything but YouTube chat.
    * tl;dr; Twitch officially allows simulcasting now, but not consolidated chat, so this I hope might help with that.

    <div align="left">

    <figure><img src="../../.gitbook/assets/image (3).png" alt=""><figcaption></figcaption></figure>

    </div>
* For Tiktok, I added 'subscriber', 'moderator', and 'rank' colors to user names. I welcome feedback.\
  ![](<../../.gitbook/assets/image (4).png>)
* Also updated the Social Stream standalone app; [https://github.com/steveseguin/social\_stream/releases/tag/0.1.4](https://github.com/steveseguin/social\_stream/releases/tag/0.1.4) (mac/win64)
  * It's still very much in 'just a preview test" mode, though I've trying to work thru all the issues. Please bare with me if you have issues with it.
* Also added an option to have emotes from members-only show up on the emotes wall.\
  ![](<../../.gitbook/assets/image (5).png>)

#### **November 9**

* Twitter live video chat supported by Social Stream now. No avatar support, but that's coming eventually.\
  ![](<../../.gitbook/assets/image (1) (1) (1) (1).png>)![](<../../.gitbook/assets/image (2).png>)

#### **November 5**

* I updated the sample `custom.js` file for Social Stream with the option to allow your public chat to control your OBS scenes with chat `!commands`.
  * In the provided sample code, when a guest types `!cycle` into chat, it will tell your OBS to switch to the next available scene, cycling between them all. Timeout of 10-seconds between uses.
  * More details and the code, check out here: [https://github.com/steveseguin/social\_stream/issues/148#issuecomment-1793594605](https://github.com/steveseguin/social\_stream/issues/148#issuecomment-1793594605)

#### **October 30**

*   Added a 'goodwords.txt' option to Social Stream

    * If the file is present in your extension's folder, messages will be filtered out (\*\*) if they are not included in the provided good words list.

    <div align="left">

    <figure><img src="../../.gitbook/assets/image (5) (1).png" alt="" width="375"><figcaption></figcaption></figure>

    </div>

#### **October 29**

* Added flag support to Social Stream\
  ![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **October 28**

* Added an option to hide messages based on custom start words; takes comma separated values\
  ![](<../../.gitbook/assets/image (206).png>)

#### **October 27**

* Added support for Ko-Fi's donations to Social Stream; works via WebHook\
  Details here: [https://github.com/steveseguin/social\_stream/blob/main/README.md#ko-fi-webhook-donation-support](https://github.com/steveseguin/social\_stream/blob/main/README.md#ko-fi-webhook-donation-support)\
  ![](<../../.gitbook/assets/image (205).png>)

#### **October 26**

* MacOS support added to the Standalone version of Social Stream
* Several bugs fixed in the standalone version\
  [https://github.com/steveseguin/social\_stream/releases/tag/0.1.1](https://github.com/steveseguin/social\_stream/releases/tag/0.1.1)

#### **October 25**

* Fixed an issue with TikTok events not working

#### **October 24**

**Social Stream updates**

* I warn the user in the dock when their messages are longer than 200-characters now (YouTube's chat limit length).\
  ![](<../../.gitbook/assets/image (203).png>)
* I have an option to trim messages down in length that are sent to third party sites to be shorter when longer than a specified length.\
  ![](<../../.gitbook/assets/image (204).png>)
* Fixed an issue with duplicate messages and cozy.tv.

#### **October 22**

* I'm putting out a "still-in-development preview" version of the **Social Stream Standalone app**\
  \
  **--** I've been poking at this project for the past year, and due to frequent requests for it I'm making it available as a preview-build.\
  \-- I'd say 90% of the features available in the extension work in this standalone version, with the interface about 50% done.\
  \-- Available as an installer for Windows x64 only at this point, but a Mac build is probably not far off.

[https://github.com/steveseguin/social\_stream/releases/tag/0.0.1](https://github.com/steveseguin/social\_stream/releases/tag/0.0.1)

<div align="left">

<figure><img src="../../.gitbook/assets/image (201).png" alt=""><figcaption></figcaption></figure>

</div>

#### **October 12**

* Improved `&floatup`; supports \&showtime now, to control speed, plus OBS fixes.
* caffeine.tv support added to Social Stream.
* Font-resizing for long messages is no longer enabled by default on the featured chat page; you'll need to now use `&fontfit` to enable it. (it's available as a toggle under featured->style)

#### **October 9**

* The emotes-wall in Social Stream now has an option to have the emotes float up, rather than just bounce around.\
  ![](<../../.gitbook/assets/image (187).png>)
* YouTube chat from channel members can have all their chat be considered as "membership chat" now, rather than just their monthly highlighted messages. This can be enabled via the general mechanics option.

#### **October 8**

* The wait list overlay option in Social Stream now has a "random user draw" option added, which lets you select a random user who entered. A few buttons and options were added to the extension to customize the behavior and to select winners and clear/reset the entries as needed.\
  ![](<../../.gitbook/assets/image (186).png>)

#### **October 7**

* `&showonlymembers` and `&showonlydonos` added to the Social Stream's dock.html page, as URL options.

#### **October 3**

* sesssions.us added to Social Stream

#### **September 28**

* whatnot.com added to Social Stream. (no pop out, so just open the watch page and pause the video I guess)
* `highlightwaitlist` and `removefromwaitlist` are API actions added to Social Stream to control the wait list overlay.\
  \
  **removefromwaitlist** will remove a user from the waitlist (default is the first user)\
  \
  **highlightwaitlist** will highlight the select user in the waitlist (default is the first user; seen in first screen shot)\
  \
  \-- With either command, an optinonal passed value can be specified as well, which reflects which user to target (as an integer value reflecting order), or pass 0 \*default) to target the next available user in the list. 1 is the first user in the list, 2 second, or 0 the first unselected user.\
  \-- The sampleapi.html page has some test buttons to trigger (as shown in second screen shot)\
  \-- You'll need to enable the remote http/wss API in the general extension settings to enable this remote API\
  \-- The API can be triggered via HTTP, so you can use it with a streamdeck; ie: `https://api.vdo.ninja/SESSIONIDHERE/highlightwaitlist/0`\
  ![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)![](<../../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1).png>)

#### **September 26**

* steamcommunity.com live chat added to Social Stream. ie: `https://steamcommunity.com/broadcast/chatonly/XXXXXXX`
* MS Teams now is opt-in for Social Stream\
  ![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **September 25**

* younow.com support added to Social Stream (since there's no pop out chat; just use the main view page)

#### **September 18**

* cozy.tv support added to Social Stream

#### **September 16**

* Align messages to the right-side of the screen added to **Social Stream**; for both the dock and featured chat pages
* Right-to-left read language forced support added to message text; it's set to automatic detection by default however.
* The featured chat messages can "stack" on top of each other now, although this is a work in progress.

![](<../../.gitbook/assets/image (3) (1) (1) (1) (1).png>)![](<../../.gitbook/assets/image (4) (1) (1).png>)

#### **September 12**

* [https://boltplus.tv/](https://boltplus.tv/) support added to Social Stream.
* Facebook sticker support added to Social Stream
* Added an option to filter for 'members' to the dock's menu

![](<../../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1).png>)

#### **September 8**

* Updated Social Stream, attempting to fix some issues with relayed messages sometimes duplicating, etc. This includes also a change to avoid publishing to the same chat window if open in two different tabs; URL matching based, so not 100% ideal.

#### **September 5**

* A few minor fixes and additions to **Social Stream** the last couple days, like the option to opt-in to showing "user joined" messages from TikTok.

#### **August 29**

* Since a popular Twitch auto-collect channel-points extension became adware earlier today, I've now added my own twitch automatic points-collection feature to Social Stream.\
  ![](<../../.gitbook/assets/image (7) (1).png>)
* With Twitter being renamed X, I've updated the twitter icon used by Social Stream. I however added an option to re-twitter the branding, using the twitter icon in Social Stream if desired instead.\
  ![](<../../.gitbook/assets/image (8) (1).png>)\
  \-- Just for some added fun, I update the branding on the Twitter website itself, back to to Twitter, when this option is enabled.\
  ![](<../../.gitbook/assets/image (9) (1).png>)

#### **August 28**

* I've expanded the number of translation text fragments for Social Stream to over 330, so if you're bored, feel free to contribute your language.\
  \-- A page is up on how to contribute translations (simple enough): [https://github.com/steveseguin/social\_stream/tree/main/translations](https://github.com/steveseguin/social\_stream/tree/main/translations)\
  \-- We've already had a few sentences in German contributed by our resident Paddy Lu.\
  ![](<../../.gitbook/assets/image (4) (1) (1) (1).png>)

#### **August 25**

* Added initial support for language localizations to Social Stream.\
  \-- So far some pop-up menu text and a few Twitch/YouTube donation labels are supported\
  \-- I've added a "test" translation file, with a couple translations added, to try it out\
  \-- Actual translations for other languages still need to be actually added. (difficulty level: 3/10)\
  \-- (German was added\*)

![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **August 24**

* Added the option to use a !custom command for the waitlist trigger
* Added the option to use a custom title message for he wait list page
* Clarified the language/style to make it a bit clearer that you have to enable the page for it to work

![](<../../.gitbook/assets/image (3) (1) (1) (1) (1) (1).png>)

#### **August 20**

On Social Stream now:

* If you delete a message as a mod/host on Twitch, it will now propagate to the Dock, deleting all messages from that user in the dock. (other chat sites will be added eventually). Future messages from that user will not be blocked though.
* If you right click on a message, you'll have an option to block a user now. It will propagate to other open docks automatically, however, these blocks will reset after a page reload unless you have the `Hide and block specified users` toggle enabled. Users blocked via right-clicking will be added to that block list, but you'll need to toggle it on for it to persist on each page load.
* Adding a user to the `Hide and block specified users` will have it retroactively delete all messages from that user from all open docks.

![](<../../.gitbook/assets/image (9) (1) (1).png>)

#### **August 18**

* There's a new stream event option added, where events can be set to 'fade up and away', to avoid competing with the actual chat messages.\
  \-- This idea is based on what TikTok is doing with events, although I like to think my version of it is nicer.\
  ![](<../../.gitbook/assets/image (6) (1) (1) (1).png>)![](<../../.gitbook/assets/image (7) (1) (1).png>)![](<../../.gitbook/assets/image (8) (1) (1).png>)
* MS Teams "enterprise" chat now working; not just the personal version. -- update Social Stream to access

#### **August 17**

* Added a wait-list feature to Social Stream; it is a standalone overlay page (waitlist.html)\
  \-- The idea is users in chat can type `!queue`, and when they do they will be added to a list of users.\
  \-- Ordered based on the time line of the user entering the !queue command; duplicate entries ignored.\
  \-- The list can be reset or turned off/on via the extension menu.\
  \-- This feature was by request, I suppose to allow users to raise their hand to join in some event. It will evolve based on feedback.\
  ![](<../../.gitbook/assets/image (3) (1) (1) (1) (1) (1) (1) (1).png>)![](<../../.gitbook/assets/image (4) (1) (1) (1) (1).png>)

#### **August 16**

* Due to many users having their docks set as narrow overlays, I've modified the default style to collapse into multi-lines when the width is less than 660px in OBS (or 330px in Chrome). You can get something similar with `&compact`, but some users were having trouble discovering that flag.\
  \-- Hopefully this makes it easier to use, without breaking any existing user setups. let me know though if having problems.\
  ![](<../../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **August 15**

* `&24hr` added to Social Stream, which shows the timestamp in military time rather than 12hr time.
* The option al set up automated broadcast messages at specified time intervals also added to Social Stream; option to set added to the settings menu.
* estrim support added to Social Stream.
* Migrated away from sync-save to local-save data for some of the save settings in Social Stream; lets me save more data.

#### **August 14**

* livestorm.io chat added to Social Stream; open the "external sidebar" version of the event chat to use.

#### **August 13**

* Added a 'hype meter' to Social Stream to offer insight into total actively engaged viewers; an alternative to 'viewer counts'.\
  \-- keeps track of unique names seen per chat source in the last 5 minutes.\
  \-- the more engaged your viewers are with the chat, the higher the score. Might encourage more chatting.\
  \-- this is a new dedicated overlay page\
  \-- basic styling options included, such as align left/right, disabling outlining, scale, etc\
  ![](<../../.gitbook/assets/image (11).png>)![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **August 12**

* `&pinnedonly` added to Social Stream; hides all but pinned messages. This is useful for a synced second dock, perhaps on air talent, to see which messages you want them to see.

#### **August 10**

* In Social Stream, added the option to have de-selected messages become unhighlighted again, rather than stay green. (`&unhighlight`)\
  ![](<../../.gitbook/assets/image (10) (1) (1).png>)

#### **August 7**

* Added an option to change the font-family type in social stream via a drop down setting, and also via `&font=xxxx`\
  ![](<../../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)
* made the "test message" button more accessible in the extension (pinned at the top now)\
  ![](<../../.gitbook/assets/image (28).png>)
* `&compact` mode as a toggle is more accessible and clearly defined as to what it does in the menu list
* Updated the HTML/XSS input sanitizing logic for all the social chat integrations

#### **August 2**

* The dock in Social Stream can now be configured to send its commands (fake chat or open chat pop out windows) via server instead of p2p.\
  \-- The dock could be configured already to accept messages via WebSockets, but now you can have it also reply to messages.\
  \-- This is mainly in the case you can't get WebRTC working\
  ![](<../../.gitbook/assets/image (3) (1) (1) (1) (1) (1) (1) (1) (1).png>)
*   Added support for Stripe payments to Social Stream, so you can have successful payments made using Stripe show up as messages in Social Stream.

    \-- Name, Message, and donation amount are support currently\
    \-- Use a Stripe payment link (as a donation page if needed), point it to the SocialStream webhook API , and make a few setting changes\
    \-- And you're good to go\
    \-- Details/Guide: [https://github.com/steveseguin/social\_stream/blob/main/README.md#stripe-webhook-donation-support](https://github.com/steveseguin/social\_stream/blob/main/README.md#stripe-webhook-donation-support)\
    ![](<../../.gitbook/assets/image (4) (1) (1) (1) (1) (1).png>)

#### **July 31**

* Option to hide specific events in socialstream added. Takes comma,separated,values, and if any of those match a word in the event message, it will be blocked.
* `&filterevents` can be used on the dock page, or there is a toggle and text-input in the extension that will apply globally.\
  ![](<../../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **July 30**

* Support for `vstream.com` and `live.space` added to Social Stream\
  ![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **July 25**

* OpenAI's chat page added as a supported site to Social Stream, which opens up some interesting bot actions I guess.\
  [`https://chat.openai.com/chat`](https://chat.openai.com/chat)\
  ![](<../../.gitbook/assets/image (14).png>)
* Added 6 more custom chat auto-start options to Social Stream; up from 3. This was by request. Hopefully that's enough?\
  ![](<../../.gitbook/assets/image (15).png>)
* Updated Social Stream with new relay options:
  * Added the option to **relay all incoming messages** from one chat site to all other active chats on other sites\
    \-- I try to ignore duplicates, and I've added a 1 second timeout, to avoid too much spamming.\
    \-- image-based emojis and images won't be relayed; just text and maybe some normal text-emojis supported.\
    ![](<../../.gitbook/assets/image (5) (3).png>)
  * Added the option to relay just donations from sites to all other sites; stated as a thank you.
  * Fixed an issue where the auto-hi option was saying hit to all sites, not just the site that the hi came from.\
    ![](<../../.gitbook/assets/image (1) (2).png>)![](<../../.gitbook/assets/image (2) (1) (2).png>)

#### **July 19**

* The emotes-wall with Social Stream has two new adjustable options\
  \-- `&limit=10`, so you can limit the max emotes allowed at a time\
  \-- `&speed=2`, this will double the speed of the emotes; can take decimal values as well\
  Use now manually, or update and enable via new toggle switches in the emotes section.

#### **July 15**

* floatplane.com added to Social Stream
* Few minor fixes to Social Stream, mainly to TikTok\
  ![](<../../.gitbook/assets/image (4) (1) (4).png>)

#### **July 10**

* Added ElevenLabs.io Text to Speech support to Social Stream ; [https://github.com/steveseguin/social\_stream/blob/main/README.md#eleven-labs-tts](https://github.com/steveseguin/social\_stream/blob/main/README.md#eleven-labs-tts)\
  this service seems to allow you to train your own custom high quality speech models? anyways, it's available now.
* Google premium TTS and elevenlabs TTS added have support now in the dock.html page (not just in the index.html). TTS messages will queue automatically and will be cleared with the TTS is stopped/paused.
* Added Threads.net support to Social Stream (little button appears under each post to let you select).\
  ![](<../../.gitbook/assets/image (2) (1) (8).png>)

#### **July 9**

* arena.tv added to Social Stream
* bandlab.com added to Social Stream
* `&largecontent` added as a toggle to Social Stream; this will make the content-images (like giphy images, twitter/IG posts, larger in the dock)
* The giphy support has an option for #somekeyword now. related images from giphy will be used. You can concat hashtags for mulitword search. eg:`#Hello#kitty`\
  ![](<../../.gitbook/assets/image (4) (10).png>)

#### **July 6**

**Social Stream updates**

* roll20.net had some updates
* Owncast support fixed
* General other patches/fixes

#### **July 4**

*   Added a `!giphy` chat command to Social Stream. You'll need to add you own Giphy API key in the extension settings to use this feature, but once enabled, chat messages containing `!giphy` will have an animated GIF get included with the message.

    \-- The GIF image selected will be based on the words in the chat message; top closest match.\
    \-- I'll probably change this feature as time goes on, to improve it, but let me know what you think.\
    \-- How can it be better?\
    ![](<../../.gitbook/assets/image (25).png>)![](<../../.gitbook/assets/image (15) (3).png>)

#### **June 29**

* vkplay.live support added to Social Stream

#### **June 23**

* Added stream events (non chat messages, like subs) to Twitch via Social Stream
* Added support for "Hype Chat" (aka, super chat but on Twitch) to Social Stream

#### **June 21**

*   Added YouTube static comment support to Social Stream.

    \
    You need to activate it in the top-right corner of YouTube to have the buttons appear next to each comment you wish to push to Social Stream. To activate, press the small SS button when SocialStream is enabled to have the "Send to Social Stream" buttons appear.\
    ![](<../../.gitbook/assets/image (4) (3).png>)
*   You can now make a file called `badwords.txt` in Social Stream, with a line by line list of bad words to filter out from chat.

    \-- There's already a default blacklist of common bad words to filter out, but making your own badwords.txt will override that default list.\
    \-- You still need to enable the badwords toggle in the menu for this to use your list.\
    \-- The extension or browser needs to be reloaded if you change the badwords.txt file for it to update.

#### **June 20**

* 7tv support with kick.com added to Social Stream
* Xeenon.xyz support added to Social Stream also

#### **June 4**

* Fixed some Social Stream issues where `&random` caused messages to appear off screen at times in OBS.

#### **May 30**

* TikTok stream events fixed for Socialstream, along with some odysee and a few other fixes pushed.

#### **May 26**

* Fixed an issue in Socialstream's random name color option, which now works with the background name color config option.

#### **May 10**

* afreecatv.com support added to Social Stream. Update the extension and pop out chat to use.\
  ![](<../../.gitbook/assets/image (6) (6).png>)![](<../../.gitbook/assets/image (5) (2) (2).png>)

#### **May 9**

* Social Stream's filter mode can be customized via the menu to name only on name, rather than name and message.
* The text-to-speech option will not trigger on messages that are filtered.
* Fixed an issue where large avatars + branding icons weren't working well together.

#### **May 6**

* buzzit.ca chat support added to **Social Stream** (added via community member: _Skintillion_)

#### **May 3**

* **Added more options on how to colorize names in** Social Stream\*\*\
  \-- This was added to allow a host to put people into their own team by setting the name to a limited set of colors.\
  \-- You can have color options (teams) ranging from 1 to several thousand.\
  \-- You can also change the randomization seed so you can put people into different teams on the fly.\
  ![](<../../.gitbook/assets/image (4) (9) (1) (1).png>)

#### **April 18**

* Added the option to filter Social Stream messages by the source destination. You'll need to enable the alt filter mode in the filter search bar, and then use `source:SOURCENAME`, so ie: `source:twitch` or `source:youtube`.\
  ![](<../../.gitbook/assets/image (4) (1) (5).png>)

#### **April 17**

* [https://kiwiirc.com/](https://kiwiirc.com/) support added to Social Stream + fix for quakenet irc.

#### **April 12**

* Added a bad word black list option to Social Stream. This option replaces matched words with \*\*\*. Currently the bad word list is hard-coded in, but it can be changed/expanded based on feedback.\
  ![](<../../.gitbook/assets/image (11) (3).png>)
* Added a URL option called `&passttl` to the dock page of Social Stream. When enabled, when someone types in `!pass` into chat, it cancels the current text to speech queue.\

* Added an option to save a list of all unique names seen in chat to disk, as a simple text list. (Social Stream)\
  \-- You will need to select a file location before it starts saving.\
  \-- It only saves each name once, without timestamp or additional meta data.\
  \-- You can open the file while its still recording, to see the current sate of number of unique chatters, etc.\
  \-- Start/stop support works, which will also start a new list once started again.\
  ![](<../../.gitbook/assets/image (1) (2) (7).png>)

#### **April 11**

* The Social Stream and VDO.Ninja HTTP/WSS remote API server went thru some changes; let me know if you have any sudden new issues
* Numerous small fixes applied to Social Stream. bttv, kick, etc.

#### **April 8**

* loco.gg, rooter.gg, and joystick.tv support added to Social Stream. (donations/badges not supported yet tho)
* Support for international "display names" on Twitch added to Social Stream (via **ZiLin** on GitHub, thank you)
* When using Social Stream, and it's remote API interface, you can now target specific docks with your API requests by assigning a target name to each dock.html page using `&label` For example:\
  Dock with the name "NAMEHERE": `https://socialstream.ninja/dock.html?session=XXXXXXXXXXXXX&server&sync&label=NAMEHERE` Can be targeted with the API format like this: `https://api.vdo.ninja/XXXXXXXXXXXXX/nextInQueue/NAMEHERE/null` \
  \
  This was needed because if you had multiple docks connected to the API interface, you'd trigger multiple messages to be featured at a time (one per dock), when you'd want only one.

#### **April 5**

* Fixed an issue with pinning + sync logic with Social Stream
* Fixed an issue where badges on Twitch didn't show when using 7TV

#### **April 2**

* tradingview.com support added to Social Stream

#### **March 30**

* Added `&opacity=0.3` to **Social Stream**; lets you make the text/dock partially transparent.

#### **March 23**

Social stream updates:

* Fixed an issue with 7TV v3 and usernames not being coloured
* Fixed an issue where Pinned messages in YouTube chat would be duplicated in the dock; attempted to fix some other duplication issues.
*   Updated [**Electron Capture**](../../steves-helper-apps/electron-capture.md) so that you can toggle the "click thru and pin on top" with a global keyboard shortcut. (`CTRL + SHIFT + X`)\
    \-- This Electron Capture update relates to Social Stream because you can use it to overlay the dock chat on your display (such as while gaming?) without it getting in the way of what you're doing. (see photo for example)\


    ```
    https://socialstream.ninja/dock.html?session=XXXXXXX&transparent  <= example of what you can use in the EC app; &transparent is recommended.
    ```

    \
    [https://github.com/steveseguin/electroncapture/releases/tag/2.17.1.1](https://github.com/steveseguin/electroncapture/releases/tag/2.17.1.1) <= Test version of Electron Capture with this new feature; windows build\
    ![](<../../.gitbook/assets/image (3) (2) (4).png>)

#### **March 22**

* Updated Social Stream to support the recently pushed 7TV v3.0 extension (which broke the old version of Social Stream).
* Also improved the scrolling function; should be less jerky now (rewrote the logic; I hope its bug free. please let me know if not).
* Added some TTS options, such as only read out every 3rd message, and optionally tell the TTS to not say "xxxx says yyyy"; just the name + message.

#### **March 19**

* `&reload` added to Social Stream; this will try to reload the last 40 to 50 messages in the dock after a page refresh, so you don't lose all your messages if something needs a refresh or things crash.
* IRC support added to Social Stream via [https://webchat.quakenet.org/](https://webchat.quakenet.org/).
* tellonym.me support added to Social Stream.
* Initial guest avatar image support added to kick.com on Social Stream.\
  ![](<../../.gitbook/assets/image (2) (16).png>)

#### **March 17**

Social Stream update:

* `&helpermode` added to Social Stream, which lets a synced dock user set pins/queues, but not control the featured chat requests. Helpful if you need someone to manage your messages for you while live.
* Twitter "start overlay" button when using Social Stream won't show if the extension is disabled
* Added the option to send messages from extension -> dock via the websocket server, rather than p2p\
  ![](<../../.gitbook/assets/image (177).png>)

#### **March 13**

Social Stream update:

* Expanded the number of Social Stream !commands to 20.
* Now removing text-based alt names for emojis when filtering images/emojis.

#### **March 9**

Social Stream update:

* Opt out of YouTube / Twitch capture added, along with the ability to specify a single Twitch channel to only capture from.\
  ![](<../../.gitbook/assets/image (18).png>)

#### **March 8**

* `&viewonly` is an added parameter to Social Stream; if added to the dock.html page, it will disable any sort of message selection / message sending actions. Useful if you want to share a link with someone, but whom you don't want to actually interfere with the overlay/broadcast/chat. (limited security of course, since they can remove the parameter if they wanted to)
* Also added `&questionsonly`, `&hidequestions`, `&stripemoji`
* Support for castr.io overlay and wix.com chat added to Social Stream

#### **March 4**

* Fixed a bugs with the remote http API feature in the extension now always turning on/off as expected
* Added the option to send messages to a specific social site via the API. ie: `https://api.vdo.ninja/XXXXXX/sendEncodedChat/twitch/!socials`. (note that the target is not null in this case, but 'Twitch') You can use this to perhaps trigger a command that's Twitch specific or send custom messages based on the site.
* I updated the sample API page `https://socialstream.ninja/sampleapi.html` with the option to customize the input values of faked messages.\
  ![](<../../.gitbook/assets/image (4) (8).png>)

#### **March 3**

* Zoom's Q\&A should now work with Social Stream. Questions from the Q\&A will be pushed to the dock automatically, and colored blue.\
  ![](<../../.gitbook/assets/image (2) (15).png>)

#### **February 28**

* Twitter post support added to Social Stream; you will need to manually select the tweet you want to push to the dock though. (I'll play with this a bit more based on feedback.)\
  ![](<../../.gitbook/assets/image (2) (3).png>):

#### **February 25**

Social Stream updates for today:

* When turning off autoshow, the auto-show queue will stop and clear.
* You can control whether to show firstname / names in the featured chat page now; not just the dock. The dock's settings will take priority over the overlay's page if enabled though.
* The open-chat functionality opens a window or tab based on the destination, to offer best performance. (added by River)

#### **February 24**

* Social Stream has had the "open chat automatically" functionality improved a lot the last couple days. @River played a large part in that.
* Added to Social Stream the option to map a chat command to some webhook API. Just an easy way to get started with making bot-actions, such as turning on a light. Happy to evolve this based on feedback.\
  ![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **February 22**

* Fixed/improved the Slack integration; emojis, etc, should work now
* Added some options to add custom URLs to the auto-open chat feature; doesn't need to be a chat window
* Fixed an issue with the darkmode toggle state not saving/loading correctly

#### **February 21**

* Social Stream had some fixes: locals.com fix, hide-emoji/beep function fix
* Added a section to specify and auto-open the chat-windows with a single click via the extension. This was developed in part with @River&#x20;
* `&openchat` can be added to the dock to auto open all the saved chat locations on dock load/refresh\
  ![](<../../.gitbook/assets/image (10) (1) (3).png>)

#### **February 19**

* With Social Stream, you can use `&fixed` on the dock page now, which places messages in the same place (overlapping the last one). When combined with `&limit=1`, you can get a neat one-message bar auto-featured chat effect.\
  ie: `https://socialstream.ninja/dock.html?bubble&color&hidemenu&hideshadow&largeavatar&nobadges&nooutline&notime&limit=1&fadeout&fixed&alignbottom&session=XXXXXXXX`\
  ![](<../../.gitbook/assets/image (1) (3).png>)
* `&chartime=60` added as a dock option; this will specify the time per character that a message will show on screen when using the auto-show feature. 60ms is the default; longer messages will show for longer.

#### **February 15**

* `&largeavatar` and `&bubble` added to Social Stream styling options; when combined, you can see what they look like in the attached images.\
  ![](<../../.gitbook/assets/image (1) (2) (1).png>)![](<../../.gitbook/assets/image (2) (13).png>)
* sli.do support added to Social Stream; works with the Q\&A section via the participant link

#### **February 10**

* Added an **emotes-wall** function to Social Stream (emojis from chat will bounce around the window).\
  ![](<../../.gitbook/assets/image (4) (1) (2).png>)\
  \-- This was added by a user's request; it works with all sites Social Stream supports; not just Twitch. BTTV and animated emojis are supported as well.\
  \-- Please report any issues with freezing/CPU issues. I've designed it to be low on CPU, but who knows.\
  \-- To use, `https://socialstream.ninja/emotes.html?session=XXXXXXXXXX&showtime=5000` or update the extension.\
  ![](<../../.gitbook/assets/image (10) (1) (2).png>)

#### **February 9**

* Added rokfin.com to Social Stream
* Menu on Social Stream tweaked to be a bit easier to see, based on user feedback

#### **February 5**

* Further tweaked the menu in Social Stream; thank you `River` for that.

#### **February 4**

* Added instafeed.me support to Social Stream

#### **January 31**

* Social Stream has a new menu-bar design; our Discord member @💎╲⎝⧹River⧸⎠╱💎 helped with the new icons, updated much of the UI, compressed the images files down, and improved many aspects of the menu's UX. A fantastic job really; thank you. (I should also mention @Sunadmiral on Discord, as she contributed some menu bar / icon concepts and designs as well, which influenced the redesign).\
  ![](<../../.gitbook/assets/image (2) (12).png>)
* Some of the new tweaks made to the UX includes the option to immediately "stop" voice-to-speak, if you accidentally enable it. You can also right-click a message to enable TTS on it, and none others. If you need the old version of the dock.html page still, it's available at `socialstream.ninja/dock2.html`
* Telegram.com/z/ for Social Stream also patched a bit; now if you specify a host-name in the menu, it will use that as your telegram name (rather than not know it)
* Submitted an application to gain access to the YouTube chat API; wrote some code into VDO.Ninja / Social Stream to support it. I'm trying to see if I can offer a secondary way to access YouTube/Twitch chat data streams without an extra window open.
* Added a parameter called `&twolines` to the dock.html page, which puts the name/avatar of the guest on its own line
* Fixed Twitch support on chat.overlay.ninja (the older / alternative Social Stream extension)

#### **January 25**

* Fixed a few dock.html issues on Social Stream, such as queuing sync and message scaling not working as expected in edge cases
* Toggle added to Social Stream to disable the green name that YouTube-members get (Social Stream)
* Fixed support for kick.com and nimo live
* Added `&lang=xxxx` (`&language`/`&ln`), which you can use instead of `&speech=xxx`. When using `&lang`, it will not enable it by default. (Social Stream)
* Option added to right-click and trigger text to speech on a message (Social Stream dock)\
  ![](<../../.gitbook/assets/image (1) (2) (1) (1).png>)

#### **January 19**

* Higher resolution YouTube avatar images are used in Social Stream and its third party outputs now
* Social Stream can now filter out messages starting with `!` ; it's a toggle option that's useful to filtering out bot commands on Twitch/FB chat,etc.
* There's an HTTP API option to toggle the auto-show mode now

#### **January 11**

* Social Stream has documentation, sample code, and better support for server-side message sourcing -- so if you want to issue messages from a server (instead of web scraping) to the service, that works now. ([https://socialstream.ninja/sampleapi.html](https://socialstream.ninja/sampleapi.html))

#### **January 9**

* Added a toggle to hide !commands from chat in Social Stream

#### **January 6**

* Google Meet support added to Social Stream. (you'll need to toggle it on explicitly to use, for privacy reasons)\
  ![](<../../.gitbook/assets/image (17) (1).png>)

### 2022

#### **December 30**

* You can choose to include or block non-chat events from the social stream feed now, like "John joined the stream". It only works on a few sites currently, but more can be added in time. (tiktok, for example, included)
* When using `&autoshow`, there's a small queue now, so if there's a sudden spike of messages, up to around 30-seconds of messages will be queued before being skipped.

#### **December 24**

* Right clicking a message in socialstream will show a menu now, where you can pin/queue or even now Delete a message. Delete will auto-delete from all docks, even if `&sync` isn't used, this way its more intuitive when trying to delete a message from an OBS dock overlay.

#### **December 22**

* Added an option to randomize the color of names in Social Stream if no name color is already provided.\
  ![](<../../.gitbook/assets/image (3) (2) (1) (1).png>)![](<../../.gitbook/assets/image (174).png>)

#### **December 21**

* Social Stream's dock page now shows the Twitch avatars in the chat stream; it's not just limited to the featured-chat overlay.\
  ![](<../../.gitbook/assets/image (2) (9).png>)

#### **December 18**

* Details on how to publish messages from Social Stream to third-party overlay systems is up: [https://github.com/steveseguin/social\_stream/blob/main/README.md#remote-server-api-support-publish-messages-to-third-parties](https://github.com/steveseguin/social\_stream/blob/main/README.md#remote-server-api-support-publish-messages-to-third-parties)\
  \
  So far support for singular, h2r, and generic post requests is available.

#### **December 15**

* kick.com added to Social Stream.

#### **December 9**

* Export / import of settings added to Social Stream. Might need to testing to confirm working with all settings tho.\
  ![](<../../.gitbook/assets/image (2) (4).png>)
* chatroll.com added to Social Stream. I think it works on most websites given its an embedded IFrame, but let me know if there's a deployment its not working with.

#### **December 8**

* Added branded-channel icon support for rumble to Social Stream.

#### **December 7**

* Added support for NIMO.tv to Social Stream\
  ![](<../../.gitbook/assets/image (2) (3) (1) (2).png>)
* Fixed WhatsApp support for Social Stream
* Added Instagram post (non-live) comments to Social Stream. You will need to enable this via the menu, since this is a pretty non-obvious integration for Social Stream.\
  ![](<../../.gitbook/assets/image (4) (5).png>)![](<../../.gitbook/assets/image (5) (1) (3).png>)
* Support for locals.com added to Social Stream

#### **December 5**

* Social Stream has been updated so that clicking the currently active selected message in the dock will clear the message, rather than re-post it.

#### **December 4**

* A one [@ojacques](https://github.com/ojacques) on GitHub contributed Amazon Chime support to Social Stream; thank you.

#### **November 29**

* Added host-avatar support to MS Teams for Social Stream

#### **November 28**

* Social Stream updated:\
  \-- pushed a fix for MS teams\
  \-- improved user avatar support for Amazon live\
  \-- for Twitch and Amazon, added a hacky fix to keep a chat streaming even when the source tab is hidden

#### **November 13**

* Added the `&js` command to Socialstream by request, so you can inject custom javascript into the dock or overlay pages. Just make sure its URL encoded. Example use: [https://socialstream.ninja/index.html?session=test123\&js=https%3A%2F%2Fvdo.ninja%2Fexamples%2Ftestjs.js](https://socialstream.ninja/index.html?session=test123\&js=https%3A%2F%2Fvdo.ninja%2Fexamples%2Ftestjs.js)\
  More details here: [https://github.com/steveseguin/social\_stream/blob/main/README.md#custom-javascript](https://github.com/steveseguin/social\_stream/blob/main/README.md#custom-javascript)

#### **November 8**

* bilibili.tv support added to Socialstream

#### **October 28**

* Added `&nooutline` to Socialstream.ninja's dock, which disables the text-outlining of fonts

#### **October 26**

* clouthub added to Socialstream

#### **October 22**

* piczel.tv support added to Socialstream

#### **October 15**

* Refined Socialstream's dock style a bit, along with fixed some issues with the remote wss/http API
* omlet.gg added to Socialstream

#### **October 2**

* Updated Socialstream to support custom themes/templates. I've provided an example theme that you can use or base your own themes on. see: [https://github.com/steveseguin/social\_stream/tree/main/themes](https://github.com/steveseguin/social\_stream/tree/main/themes) for more.\
  ![](<../../.gitbook/assets/image (7) (1) (2).png>)
* Added more animated style options for how messages appear into the chat stream, such as slide in, fade in, and drop in.\
  ![](<../../.gitbook/assets/image (8) (1) (1) (3).png>)

#### **October 1**

* **F**ixed an issue re: settings not saving in socialstream
* Added `&hidebots` as a toggle option to Socialstream, which hides messages from bots, hosts, or specified names from appearing in the chat stream.

#### **September 30**

* Glimesh.tv support added to Socialstream

#### **September 18**

* The WSS/HTTPS APi for Socialstream has have had a few new commands added: next-in-queue, clear-featured-overlay, and an event that alerts the user to the size of the queue.\
  ![](<../../.gitbook/assets/image (3) (6) (1).png>)
* Added an option to save incoming chat messages to an excel-file within SocialStream's menu (by request)\
  ![](<../../.gitbook/assets/image (1) (1) (5).png>)

#### **September 17**

* Added the option to show "only" the queued messages in the dock\
  ![](<../../.gitbook/assets/image (1) (8) (1).png>)
* Fixed an issue where queued messages would become hidden once it hit the visual limit
* Fixed a discord not-working issue
* Fixed a twitch doubling up message issue
* Fixed an issue with pinned messages when lastpass extension is installed

#### **September 15**

* `&random` added to SocialStream; it can be used with the dock to randomize where messages appear on screen.\
  ![](<../../.gitbook/assets/image (13) (2) (1).png>)

#### **September 10**

* Using `&beep` or the bell icon will trigger audio 'beeps' when new messages appear in the Socialstream dock. Requires user-interaction with the page in chrome for the audio to work.\
  ![](<../../.gitbook/assets/image (8) (1) (1) (2).png>)
* Support for @mention added to Mixcloud for Socialstream+touch, by means of providing the username that scripts can respond to (by user request).
* `&alignbottom` added to the Socialstream dock; this aligns the message stream to the bottom by default, rather than top.
* Added `&transparent` (versus the new `&hideshadow`), which can be useful for loading Socialstream into non-OBS studios.

#### **September 2**

* Socialstream bug fixes, along with donation support added to Mixcloud.

#### **August 31**

* New MIDI control feature for Social Stream: - the option to select a file containing text-strings for use with the MIDI-command option is available - sample file is included in the extension folder; edit it and select it from the extension menu (JSON format) - you shouldn't have to reload the file each time you open the browser; just when you reload the extension or when you want to update the commands with a newer file.\
  ![](<../../.gitbook/assets/image (10) (1) (2) (1) (1).png>)
* Social Stream has had it's pop-out menu UI updated, courtesy of the one and only [@jcalado](https://github.com/jcalado) (there's dark-mode support now, also) #pretty\
  ![](<../../.gitbook/assets/image (1) (1) (1) (2).png>)
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
  ![](<../../.gitbook/assets/image (9) (4) (1).png>)

#### June 28

* Socialstream and chat.overlay have been updated to support YouTube gift sponsorships

#### June 25

* Added support for dlive.tv, mobcrush, and picarto.tv live chat to the socialstream.ninja extension
* Fixed support for Facebook with socialstream.ninja; also optimized the code to reduce CPU load a bit

#### June 16

* Socialstream.Ninja was updated to support more languages when using text-to-speech. As in, it no longer says "says" when reading out messages in anything but English, since 'says' wasn't being translated correctly. This patch should auto-update.

#### May 22

* Added badge support to Social Stream (so far Twitch, YouTube, Facebook supported)
* Added per-user colorized names (opt-in option; Twitch/YouTube supported)![Bild](https://media.discordapp.net/attachments/701232125831151697/977844111900020736/unknown.png?width=400\&height=289)

#### May 9

* Added the option to show only first-names with social stream's dock; creates more room for messages. Use via menu toggle or use `&firstnames`\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/973329479801921576/unknown.png?width=400\&height=195)

#### May 5

* Accurate YouTube + Twitch channels icons can show now with socialstream.ninja. Add `&branded` to the the dock/index page to trigger.\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/971609987073855529/unknown.png)
* Introduced another performance optimizations to the way YouTube avatars are handled, which I hope will reduce the load caused by heavy YouTube chat streams.
* Toggle for Text to Speech added to the dock. Turning it off cancels any current read-out.![Bild](https://media.discordapp.net/attachments/701232125831151697/971611838133465128/unknown.png)

#### May 4

* Fixed an issue with doubling of some messages when using socialstream.ninja on Facebook.

#### May 2

* socialstream.ninja supports text-to-speech with the docking page also now; this auto reads out-loud most inbound messages automatically, including donations. This feature is useful when you can't read the chat, such as when playing a VR game, but still want to follow what's going on. Not advised to actually have the speech output to the stream, since trolls are gonna troll.
* You can also specify names in the socialstream settings, which prevent messages from those accounts from being read out loud. You can include your own name or/and a bot name, for example.

#### April 28

* Text-to-speech added to social stream, ie: `index.html?session=XXXXXX&speech=en-US`; it has a couple limitations, mainly being the audio can only play out via the default system speakers, so you'll need a virtual audio cable if you wish to integrate it into OBS. Still, its functional if you need it.

#### April 27

* trovo support added to socialstream.ninja (pop out trovo chat window to use)

#### April 21

* Twitch avatar logic updated for socialstream.ninja and chat.overlay.ninja.
* `&noavatar` added as an option for both the dock page and the featured chat page; this hides avatar images. (socialstream)
* Added a toggle to socialstream's pop up menu that prevents YouTube avatars from loading, reducing CPU usage.

#### April 17

* rumble.com support added to socialstream.ninja and several fixes for tiktok/vimeo.
* `&rounded=10` can be added to index.html of socialstream to round the edges.
* `&noavatar` can be added also, to hide avatar images from appear in message overlays. (on GitHub)

#### April 4

* Facebook producer-page support fixed on socialstream.ninja

#### April 1

* Stylized the dock a bit on socialstream a bit; more contrast to background color

#### March 29

* Hold `CTRL` when selecting a message in the dock to add it to a queue. You can then press the "next queued" button in the dock to highlight messages from the queue. (socialstream)
* Hold `ALT` when selecting message in the dock to "Pin" it to the top of the dock. You can hold `ALT` and click it to unpin and remove the message. (socialstream)
* Slack chat support added via @olivier jacques's code contribution; thank you very kindly and very well done. (socialstream)

#### March 25

* Appending `&save` to dock.html with socialstream.ninja will auto-save incoming chat messages to disk.
* You can now customize the colors of the socialstream.ninja featured chat overlay via the menu (applies to new messages).\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/956818555821760522/unknown.png?width=400\&height=279)
* Made the background of the control bar opaque; easier to see now, I hope.![Bild](https://media.discordapp.net/attachments/701232125831151697/956818771484495882/unknown.png?width=400\&height=55)

#### March 16

* Added a "bad karma" filter to socialstream.ninja. It uses machine learning to filter out messages that are considered "negative". Lets say \~80% accurate.![Bild](https://media.discordapp.net/attachments/701232125831151697/953431014431145994/unknown.png)
* Chrome web store version of chat.overlay.ninja updated to newest; should auto update if you installed that version.

#### March 10

* Fixed TikTok support on socialstream. (broke)

#### March 9

* Updated socialstream.ninja to pass-thru the donation/membership colors to the overlay, to act as the message background, instead of the default grey.![Bild](https://media.discordapp.net/attachments/701232125831151697/951179985564098560/unknown.png?width=400\&height=104)

#### March 4

* Added amazon.com/live chat support to socialstream.ninja

#### February 26

* Added restream.io support to socialstream.ninja

#### February 25

* Added simple Telegram support to socialstream.ninja

#### February 15

* Added LinkedIn events comments and Cisco Webex live chat support to socialstream.ninja

#### February 14

*   Added support for VDO.Ninja's pop out chat to socialstream.ninja.

    ![Bild](https://media.discordapp.net/attachments/701232125831151697/942657349066301570/unknown.png?width=400\&height=86)

#### February 13

* Fixed an issue with chat.overlay.ninja and its twitter integration

#### February 9

* Added more Facebook support to the Socialstream extension, such pop-up chat support, producer-side auto commenting, and a bit of message anti-duplication code.
* Added `&fade` and `&swipe` as two new transition styles for the Social Stream featured chat overlay; messages can be configured to fade-in without moving or slide in from the left-side of the screen. (instead of popping up from the bottom)
* Added some CSS class names to make setting custom CSS easier and cleaned up some of the code; very much overdue.

#### February 7

* Added support for Instagram live to Socialstream
* Added support for TikTok live to Socialstream
* Updated Socialstream to auto-feature-select incoming messages. Button toggle or URL parameter to enabled it via the dock. Updates at a rate of 2 per 3 seconds max.

#### January 31

* By request, made a simple tool that lets you enter a VDO.Ninja group scene link and a featured chat overlay link; you'll get a single combined link in return. When using that combined link, when a featured chat is active, the group scene link is made smaller to make room for the chat message. When that message clears, the group chat returns to full screen. This can be found at: [socialstream.ninja/automix](https://socialstream.ninja/automix) or [chat.overlay.ninja/automix](https://chat.overlay.ninja/automix); feedback welcomed.
