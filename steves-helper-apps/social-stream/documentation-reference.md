---
description: This is a snapshot of the Social Stream documentation, taken Aug. 16, 2023
---

# Documentation reference

For the newest and most up-to-date copy of the Social Stream documentation, please visit: [https://github.com/steveseguin/social\_stream](https://github.com/steveseguin/social\_stream). This article won't be kept as up-to-date, but should cover the basics; it is provided here as a consolidated resource for our LMM AI support bot to learn from.

Chronologically Updates are here:

{% content-ref url="../../updates/updates-social-stream-and-chat-overlay.md" %}
[updates-social-stream-and-chat-overlay.md](../../updates/updates-social-stream-and-chat-overlay.md)
{% endcontent-ref %}

## Social Stream

Consolidate your live social messaging streams

[Jump to Download and Install instructions](https://github.com/steveseguin/social\_stream/blob/main/README.md#to-install)

* Supports live automated two-way chat messaging with Facebook, Youtube, Twitch, Zoom, and dozens more
* Includes a "featured chat" overlay, with messages selectable via the dockable dashboard; auto or manual selection.
* Supports bot-commands and automated chat responses, with custom logic supported via scriptable plugin file.
* Text-to-speech support, along with many other niche features supported.
* Multi-channel source-icon support, so you can differentiate between different streams and creators
* No user login, API key, or permission needed to capture the chat messages from most sites and services.
* Queuing of messages for later highlighting
* Free community support at [https://discord.socialstream.ninja](https://discord.socialstream.ninja)

Social Stream makes use of VDO.Ninja's data-transport API to stream data securely between browser windows with extremely low latency and all for free!

![image](https://user-images.githubusercontent.com/2575698/148505639-972eec38-7d8b-4bf3-9f15-2bd02182591e.png) ![image](https://user-images.githubusercontent.com/2575698/148505691-8a08e7b0-29e6-4eb5-9632-9dbcac50c204.png)

#### Supported sites:

* twitch.tv - pop out chat to trigger
* youtube live - pop out the chat to trigger (studio or guest view); or add \&socialstream to the YT link
* youtube static comments - click SS in the top right corner of Youtube, then select the message you wish to publish inside the YT comment section via the new buttons there.
* facebook live - guest view, publisher view, or the producer's pop-up chat on the web is supported.
* workplace.com - (same setup as Facebook)
* zoom.us (web version)
* owncast demo page (`watch.owncast.online`, or for a pop-out chat version, open `https://watch.owncast.online/embed/chat/readwrite/` )
* crowdcast.io
* livestream.com
* mixcloud.com (pop out chat)
* ms teams (experimental support)
* vimeo.com (pop out chat page; https://vimeo.com/live-chat/xxxxxxxxx/interaction/)
* instagram live (instagram.com/\*/live/), css note: `[data.type = "instagramlive"]`
* Instagram post non-live comments (REQUIRES the TOGGLE in menu to enable it), css note: `[data.type = "instagram"]`
* instafeed.me (no pop out; alternative instagram live support)
* tiktok live (tiktok.com/\*/live)
* webex live chat (not the pop out)
* linkedin events and live comments. (works with linkedin.com/videos/live/\* or linkedin.com/videos/events/\* or linkedin.com/events/\*)
* vdo.ninja (pop-out chat)
* Whatsapp.com (REQUIRES the TOGGLE in menu to enable it; use @ https://web.whatsapp.com ; fyi, no avatar support)
* discord.com (web version; requires toggle enabled via the settings as well)
* telegram (web.telegram.org in stream mode; requires toggle enabled)
* slack (https://app.slack.com/ ; required toggle enabled to use)
* Google Meet ; required toggle enabled to use
* ![Requires toggling to enable certain integrations](https://user-images.githubusercontent.com/2575698/178857380-24b3a0fc-bf86-4645-91ec-24893df19279.png) telegram, slack, whatsapp, discord require an extra step to enable. See this video for more help: https://www.youtube.com/watch?v=L3l0\_8V1t0Q
* restream.io chat supported (https://chat.restream.io/chat)
* amazon.com/live
* wix.com (https://manage.wix.com/dashboard/_/live-video/_)
* clouthub (no pop out; just the video page)
* rumble.com (pop out chat)
* trovo.live (open the chat pop-up page; ie: https://trovo.live/chat/CHANNEL\_NAME\_HERE)
* theta.tv (pop-out chat; https://www.theta.tv/chat/xxxxxxxxxxxxxxx)
* Dlive.tv (pop-out chat)
* Picarto.tv (pop-out chat; ie: https://picarto.tv/chatpopout/CHANNELNAMEHERE/public)
* Mobcrush (this page: https://studio.mobcrush.com/chatpopup.html)
* vimm.tv (https://www.vimm.tv/chat/xxxxxxxxx/)
* odysee.com (via the pop out chat I think)
* minnit.chat support (https://minnit.chat/xxxxxxxxxxx?mobile\&popout)
* livepush.io (chat overlay link provided; no input field support?)
* piczel.tv (pop out chat @ https://piczel.tv/chat/xxxxxxxxx)
* bilibili.tv added (just regular view page /w chat; no pop out)
* Amazon Chime (https://app.chime.aws/meetings/xxxxxxxxx)
* Locals.com (no pop out needed)
* Nimo.TV (pop out chat, ie: https://www.nimo.tv/popout/chat/xxxx)
* kick.com (pop out chat)
* quickchannel.com (https://play.quickchannel.com/\*)
* rokfin.com (https://www.rokfin.com/popout/chat/xxxxxx?stream=yyyyyy)
* sli.do (https://app.sli.do/event/XXXXXXXXXXXXXX/live/questions)
* cbox.ws (no pop out needed)
* castr.io (https://chat.castr.io/room/XXXXXXXX)
* tellonym.me
* peertube (triggers on: https://\*/plugins/livechat/_router/webchat/room/_)
* IRC (via https://webchat.quakenet.org/)
* Tradingview.com (just the normal viewer page; no pop out)
* rooter.gg (no pop out; just pause the video I guess)
* loco.gg (no pop out; just pause the video I guess)
* joystick.tv (+18, pop-out chat, ie: https://joystick.tv/u/USERNAMEHERE/chat)
* buzzit.ca (community member submitted integration)
* afreecatv.com (pop out the chat; you can't close the main window it seems tho?)
* nonolive.com (no pop out; partial support added so far only)
* xeenon.xyz
* stageTEN.tv
* vkplay.live (pop out chat)
* arena.tv (no pop out chat support, so just pause the video I guess)
* bandlab.com (no pop out, so just pause the video I guess while chat open)
* threads.net (a little funky star icon, right of the share icon, will select thread to push to dock)
* floatplane.com (pop out chat; gotta keep the main window still open though? annoying..)
* OpenAI chatGPT chat - (via https://chat.openai.com/chat). You must opt-in via the toggle for this though
* live.space (Just open the basic watch page, OR, open the pop up chat @ https://live.space/popout-chat/XXXXXXXXX)
* vstream.com (pop out chat)
* estrim - live video chat supported
* livestorm.io (open the 'external sidebar', which might be a plugin, and it should capture that)\
  \
  ... and likely many many more. Even more on request

**Chat graveyard 🪦🪦🪦**

Past supported sites that have ceased to exist.

* 🪦 omlet.gg (RIP June 2023)
*   🪦 glimesh (RIP July 2023)

    (it's the effort that counts, guys; may your code live on in our ai llm bots forever)

#### Adding sites yourself

I have a video walk-thru on how I added a simple social site to Social Stream:

{% embed url="https://youtu.be/5LquQ1xhmms?si=j6-FWJbe_GkvZhQ1" %}

You can also refer to some of my code commits, where you can see which changes I made to add support for any specific site.

ie: `https://github.com/steveseguin/social_stream/commit/942fce2697d5f9d51af6da61fc878824dee514b4`

For a simple site, a developer should need just 30 minutes to an hour to get a site supported. A more complicated and tricky site may take a few hours or longer, depending on the developer's skill.

#### Video walk-thru

An older guide covering the basics of setting up Social Stream:

{% embed url="https://youtu.be/X_11Np2JHNU?si=DeWtc36ZAvD4PK67" %}

For a more recent guide focusing on setup for Discord, slack, Whatsapp, and Telegram, see:

{% embed url="https://www.youtube.com/watch?v=L3l0_8V1t0Q" %}

#### To install

This extension should work with Chromium-based browser on systems that support webRTC. This includes Chrome, Edge, and Brave. [Firefox users see here](https://github.com/steveseguin/social\_stream#firefox-support).

Currently you must download, extract, and load the browser extension manually. It is not available yet in the browser's web store.

The link to download newest version is here: [https://github.com/steveseguin/social\_stream/archive/refs/heads/main.zip](https://github.com/steveseguin/social\_stream/archive/refs/heads/main.zip)

Once extracted into a folder, you can go here to load it: chrome://extensions/

![image](https://user-images.githubusercontent.com/2575698/142858940-62d88048-5254-4f27-be71-4d99ea5947ab.png)

Ensure you have Developer Mode enabled; then you can just load the extension via the load unpacked button and selecting the folder you extracted the fiels to.

![image](https://user-images.githubusercontent.com/2575698/142857907-80428c61-c192-4bff-a1dc-b1a674f9cc4a.png)

You're ready to start using it!

Please note also that you will need to manually update the extension to access newer versions; it currently does not auto-update aspects of the extension; just the dock and single overlay page auto-update as they are hosted online.

**Seeing an error message?**

If you see the browser say there is an "Error", specifically a manifest v2 warning or something, you can safely ignore it. It is not actually an error and will not impact the function of the extension.

Something of concern though is Google will be updating Chrome browsers on January 2023 to block many popular Chrome extensions, including many Adblockers and also Social Stream. I'm working to resolve this concern, but Social Stream may end up having diminished functionality if Google has their way. If necessary, Social Stream may evolve into a downloadable app instead to avoid these limiations, but I'm hoping to avoid that if possible.

**Updating**

To update, just download the extension, replace the old files with the new files, and then reload the extension or completely restart the browser. If just reloading the extension, you may then need to also reload any open chat sites that you wish to use Social Stream with.

You can download the newest version here:&#x20;

{% embed url="https://github.com/steveseguin/social_stream/archive/refs/heads/main.zip" %}
Link to the newest version of Social Stream
{% endembed %}

Please note: DO NOT Uninstall the extension if you want to update it. This will delete all your settings. Replace the files, and reload the extension or browser instead. If you MUST uninstall, you can export your settings to disk and reload them after you have reinstalled.

New app integrations do not auto-update; just the overlay and dock page will auto-update. It's suggeseted you update every now and then manually, or whenever you encounter a bug. I'll try to resolve this issue down the road, perhaps with a standalone desktop app eventually.

**Firefox support**

You have two ways to install the add-on for Firefox.

Please note, neither Firefox option supports two-way message responding, but the dock and featured chat overlay should work. If you want to use the bot commands with auto-responding, please consider using a Chromium-based browser instead.

**First way:**

Download+extract or clone the SocialStream code somewhere.

Go to `about:debugging#/runtime/this-firefox` in Firefox and select Load Temporary Add-on.

Select any file inside the SocialStream folder.

You're done. This is a temporary install and none of the settings made will be persist, including your session ID.

You will still need to manually redo these steps to update when needed, but you can use the newest version of the code.

**Second way:**

(This method hasn't been updated in a while and no longer works probably; you'll need to make your own XPI file to try it)

Go to the release section of this repo and find a release that includes a Firefox XPI file.

https://github.com/steveseguin/social\_stream/releases

Download the XPI file and drag it into an Open Firefox window.

Accept any install pop ups. Storage functions should work with this approach.

You are good to go, but you will need to manually update when needed by recompleting these steps.

Please note: XPI files are currently provided on request or with major updates; XPI file creation hasn't yet been automated. (TODO)

#### To use

Open Twitch or Youtube "Pop out" chat; or just go to your Facebook Live chat while connected to Ethernet or WiFi. You must not minimize or close these windows, but they can be left in the background or moved to the side.

Then, press the Social Stream chrome extension button and ENABLE streaming of chat data. (Red implies disabled. Green is enabled)

![image](https://user-images.githubusercontent.com/2575698/142856707-0a6bc4bd-51b4-4cd0-9fa3-ef5a1adfcbf7.png)

**Please note: If the Extension's icon is RED, then it means it is still off and wil not work. You have to click "Enable extension", and the icon must change to the color green.**

Next, using the provided two links, you can manage the social stream of chat messages and view selected chat messages as overlays.

![image](https://user-images.githubusercontent.com/2575698/142935393-4ca90418-a645-45e3-8e37-f4884e16457a.png)

You can hold ALT on the keyboard to resize elements in OBS, allowing you to crop the chat stream if you want to hide aspects like the time or source icon.

Clicking on a message will have it appear in the overlay link. You can press the clear button to hide it or use the `&showtime=20000` URL option added to the overlay page to auto-hide it after 20-seconds (20,000 ms).

![image](https://user-images.githubusercontent.com/2575698/142854951-fe1f34c9-0e24-495f-8bfe-a33ab69fa7cb.png)

There is a `&darkmode` option, but the default is white, for the dock.

![image](https://user-images.githubusercontent.com/2575698/142855585-45c11625-c01c-4cc0-bfe0-cde4aed5fc44.png)

A good resolution for the overlay is either 1280x600 or 1920x600; you can specify this in the OBS browser source. You can edit the style of the overlay using the OBS CSS style input text box. The chat overlay will appear 50-px from the bottom currently, but the height of the chat window can be quite tall; to avoid the name of the overlay being cropped, just make sure you give it enough room.

![image](https://user-images.githubusercontent.com/2575698/142855680-74f6055d-7b79-4e9a-ae7d-909c7f677a24.png)

If using the automated chat response options, like auto-hi, you must ensure the YouTube/Twitch/Facebook chat input options are enabled and that you are able to send a chat message. Manually entering a chat message into the pop-out window or into the Facebook live chat area first can help ensure things are working are intended, else automated message may not be sent.

**Note: If things do not work,**

* Toggle the extension on and off, and reload the pop-out chat window. Ideally the pop-out chat should be visible on screen, as even just a few pixels shown will allow the pop-out chat to work at full-power. Chrome otherwise may throttle performance.
* Open a new dock / overlay link if things still do not work, as the session ID may have changed.
* Ensure that VDO.Ninja works with your browser, as if not, webRTC may be disabled and so this social stream extension will not work also.
* If using Facebook live chat, please sure you are viewing the page as a "viewer", not as a publisher, and that you are connected to WiFi or Ethernet, and not mobile LTE/4G/5G.
* The auto-responder requires you to be signed in to the social endpoint and that you have access to chat; ensure you accept any disclaimer and try issuing a test message first.
* Try using the extension in Incognito mode or try disabling all other browser extensions, then reloading the browser, and trying again. Many extension types will conflict with Socialstream, causing certain functions to fail.

#### Customize

There are quite a few toggles available to customize functions and styles, but these toggles often just apply URL parameters. You can as a result, just manually apply the parameters yourself, opening up more fine-grain control. A list of some of the options are available below.

To customize the dock, you can use the following options:

* `&lightmode` (Enables the dark-mode for the chat stream)
* `&scale=2` (doubles size/resolution of all elements)
* `&notime` (hides the date in the chat stream)
* `&hidesource` (hides the youtube/twitch/fb icons from the stream)
* `&compact` (Removes the spacing between name and message)
* `&autoshow` (will auto-feature chat messages as they come into the dock at a rate of about 2 per 3 seconds)
* `&attachmentsonly` (will only show image attachments in the dock; the messages will be wiped)

To customize the featured chat overlay, the following URL parameters are available

* `&showtime=20000` (auto-hides selected messages after 20s)
* `&showsource` (shows the youtube/twitch/fb icons next to the name)
* `&fade` (will have featured messages fade in, rather than pop up)
* `&swipe` (will have featured messages swipe in from the left side)
* `&center` (center featured messages)

To customize the color, font-size and styling, you can edit the CSS, in either the OBS browser source style-sheet section, or by editing the and using the index.html file. See below:

**More advanced styling customizations**

To further customize the appearance of the overlay or dock, you can make CSS style changes via OBS browser source, without any coding.

![image](https://user-images.githubusercontent.com/2575698/153123085-4cf2923e-fce3-40bd-bd66-3ba14a6ab321.png)

```
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }

:root {
     
     --comment-color: #090;
     --comment-bg-color: #DDD;
     --comment-color: #FF0;
     --comment-border-radius: 10px;
     --comment-font-size: 30px;
     --author-border-radius: 10px;
     --author-bg-color: #FF0000;
     --author-avatar-border-color: #FF0000;
     --author-font-size: 32px;
     --author-color: blue;
      --font-family:  "opendyslexic", opendyslexic, serif;
}

@font-face {
  font-family: 'opendyslexic';
    src: url('https://vdo.ninja/examples/OpenDyslexic-Regular.otf');
    font-style: normal;
    font-weight: normal;
} 

.hl-name{
	padding: 2px 10px
}
```

Sample CSS of which you can use to customize some of the basic styles. There's not much that you can't do via CSS in this way, but you can edit things further at a code-level if needed. Mac/Linux users may face issues with OBS not liking self-hosted versions of the index/dock file, but it's not an issue for the PC version.

**Removing text-outlines**

Try:

```
body {
	text-shadow: 0 0 black;
}
```

#### Changing CSS without OBS

You can also pass custom CSS to the dock and index page via URL parameters using either `&css` or `&b64css`.

`&css=https://youdomain.com/style.css` or `&b64css=YOUR_CSS_CODE_HERE`

You can use this tool to encode the URL you want to link to: https://www.urlencoder.org/

For the base64 css option, you can create the base64 encoding using `btoa(encodeURIComponent(csshere))` via the browser's developer console. For example:

`window.btoa(encodeURIComponent("#mainmenu{background-color: pink; ❤" ));`

The above will return the base64 encoded string required. Special non-latin characters are supported with this approach; not just latin characters.

Example of what it might look like: [https://socialstream.ninja/?64css=JTIzbWFpbm1lbnUlN0JiYWNrZ3JvdW5kLWNvbG9yJTNBJTIwcGluayUzQiUyMCVFMiU5RCVBNA](https://socialstream.ninja/?64css=JTIzbWFpbm1lbnUlN0JiYWNrZ3JvdW5kLWNvbG9yJTNBJTIwcGluayUzQiUyMCVFMiU5RCVBNA)

#### Pre-styled templates / themes

You can try out some stylized chat overlays in the themes folder:

An example of one is available here: [https://socialstream.ninja/themes/pretty.html?session=SESSIONIDHERE](https://socialstream.ninja/themes/pretty.html?session=SESSIONIDHERE)

![image](https://user-images.githubusercontent.com/2575698/193437450-545f7f4c-d5fc-465b-9cfe-d42f82671c51.png)

For anyone who wants to create a custom theme/style/template for their chat stream, you can share them via adding them to this repository as a Pull Request.

**Custom Javascript**

You can inject a bit of javascript into the dock or index pages using `&js={URL ENCODED JAVASCRIPT}`

For example, [https://socialstream.ninja/index.html?session=test123\&js=https%3A%2F%2Fvdo.ninja%2Fexamples%2Ftestjs.js](https://socialstream.ninja/index.html?session=test123\&js=https%3A%2F%2Fvdo.ninja%2Fexamples%2Ftestjs.js)

**Auto responding / custom actions**

You can create your own custom auto-responding triggers or other actions by including a `custom.js` file. You don't need to host the index or dock file for this.

Included in the code is the `custom_sample.js` file, which you can rename to custom.js to get started. Included in it is the `&auto1` trigger, which auto responds "1" to any message that is also "1". You need to add `&auto1` to the dock's URL to activate it.

It's fairly easy to modify the `auto1` trigger to do whatever you want. You can also customize or removee the URL-parameter trigger needed to activate it.

#### Queuing messages

If you hold CTRL (or cmd on mac), you can select messages in the dock that get added to a queue. A button should appear in the top dock menu bar that will let you cycle through the queue, one at a time. When pressing the Next in Queue button, messages from the queue will appear as featured chat messages in the overlay page.

#### Pinning messages

Like queuing a message, you can also instead hold down the ALT key while clicking a message to pin it; it will stay at the top of the page, until unpinned in the same fashion.

#### Togglable Menu Commands

These are some generic auto-reply commands that can be toggled on/off via the extension's menu. They do not need a custom.js file to work

* !joke (tells a random geeky dad joke)
* hi (Welcomes anyone who says "hi" into chat)

#### Hotkey (MIDI / Streamlabs) support

There's a toggle to enable MIDI hotkey support. This allows a user to issue commands to the extension when active, such as issue predefined chat messages to all social destinations.

The hotkeys can be issued via MIDI, which can be applied to a Streamdeck also via a virtual MIDI device. The MIDI actions available currently include:

Using Control Change MIDI Commands, on channel 1:

* command 102, with value 1: Say "1" into all chats
* command 102, with value 2: Say "LUL" into all chats
* command 102, with value 3: Tell a random joke into all chats
* command 102, with value 4: Clear all featured chat overlays

![image](https://user-images.githubusercontent.com/2575698/144830051-20b11caa-ba63-4223-80e1-9315c479ebd6.png)

The StreamDeck MIDI plugin can be found in the Streamdeck store pretty easily.

Please note that you will also need a MIDI Loopback device installed if using the StreamDeck MIDI plugin. For Windows, you can find a virtual MIDI loopback device here: https://www.tobias-erichsen.de/software/loopmidi.html There are some for macOS as well.

![image](https://user-images.githubusercontent.com/2575698/186810050-c6b026f2-3642-4bed-a3b2-f954b1d5b507.png)

Lastly, please note that you will need to enable the MIDI option in the menu options for it to work, as it is not loaded by default.

![image](https://user-images.githubusercontent.com/2575698/186801053-6319d63e-fe92-42bc-b951-cad4d35753cc.png)

#### Server API support

You can send messages to Social Stream via the hosted server ingest API, and you can also send messages from Social Stream to remote third-parties.

So if you can a donation webhook, you can push those notifications to Social Stream. You can also use a third-party service to overlay messages captured by Social Stream. More below.

**Social Stream's server API (ingest and clear messages via remote request)**

If using the MIDI API isn't something you can use, you can also check out the hosted API service to send messages to SocialStream, which will be redirected to your social live chat sites. This API works with a Stream Deck or custom applications.

This API end point supports WSS, HTTPS GET, and HTTP POST (JSON). Support for this API must be toggled on in the menu settings (or by adding `&server` to the dock.html page).

**A couple common examples**

An overly simple example of how to use the GET API would be: https://api.vdo.ninja/XXXXXXXXXX/sendChat/null/Hello, which sends HELLO. Replace XXXXX with your Social Stream session ID. Other options, like `https://api.vdo.ninja/XXXXXXXXXX/clearOverlay` should work, too.

You can use this API to clear the featured-chat, poke the next-in-queue item, and more. It works with WSS or HTTP requests.

**Target specific docks**

You can also target specific docks with your API requests by assigning a target name to each dock.html page using `&label`.

For example, to set a dock with the target name of "NAMEHERE", we'd do: `https://socialstream.ninja/dock.html?session=XXXXXXXXXXXXX&server&sync&label=NAMEHERE`. From there, we can target it with the API format like this: `https://api.vdo.ninja/XXXXXXXXXXXXX/nextInQueue/NAMEHERE/null`. This all may be needed because if you have multiple docks connected to the API interface, you may not want to trigger the same command multiple times in all cases.

**More details**

For details of the commands, see the following link for sample functionality and refer to its source code for examples.

`https://socialstream.ninja/sampleapi.html?session=xxxxxxxxxx` (replacing xxxxxxxx with your Social Stream session ID to have it work)

More functionality can be added on request.

![image](https://user-images.githubusercontent.com/2575698/189367779-67969f47-a305-4347-9a37-053b33479602.png)

**Remote server API support (publish messages to third parties)**

Remote API support is available via dock page, configured by URL parameters. In the future, some support can be added to the extension itself directly, so no dock page needs to be open. You can currently auto-publish messages via the dock with the `&autoshow` parameter, but otherwise messages will be issues to the remote API only when a message is selected manually.

For some images provided in the outgoing data-structure, the assumed host location for certain files/images, if none provided, should be `https://socialstream.ninja/`.

More destinations available on request.

**Singular Live**

`&singular=XXXXXXX` will send selected messages to singular live for featured message overlay. The target address will be: `https://app.singular.live/apiv1/datanodes/XXXXXXX/data`

**H2R**

`&h2r=XXXXXXX` will send selected messages to local H2R server using its POST data structure. The target address will be: `"http://127.0.0.1:4001/data/XXXXXXX`

You can manually set a custom H2R URL though with `&h2rurl` though, which will override the default one.

**Generic POST / PUT**

A generic JSON-POST can be made using `&postserver`, with the address provided `&postserver=https://domain.com/input-source`

A generic JSON-PUT can be made using `&putserver`, with the address provided. There isn't much difference between POST and PUT, but some sites are picky. `&putserver=https://domain.com/input-source`

In these cases, the JSON being delivered is in the Social Stream data-structure.

**Stripe webhook donation support**

If you create a Stripe payment link (eg: https://donate.stripe.com/YYYYYYYYYYYY), you can have successful payments show up in Social Stream. This is a great way to collect donations from viewers of your stream without needing to use middleware for payment processing.

To get started, after creating a Stripe payment link, create a Stripe webhook that listens for the event `checkout.session.completed`. Have the webhook point to: `https://api.overlay.ninja/XXXXXX/stripe`, where XXXXXX is your Social Stream session ID. You don't need to worry about the verification signatures or API tokens in Stripe since we won't be verifying the payments. Of course, keep your session ID private as a result, else someone will be able to spoof fake donations to your end point.

If you wish to ask the payer for a name, include a custom field called "Display Name" or "Username" when creating your Stripe payment link. You can also include a field called "Message", which will allow the payer an opportunity to leave a custom message. The donation amount and current type should be dervived from the payment automatically, but some rare exotic currencies may not always show up with the right decimal place -- just keep that in mind.

Lastly, to allow these events to show up in the Social Stream dock, add \&server to the dock URL; this will have the dock start listening for incoming messages from the webhook/api server. You can always test that the workflow is working using Stripe's "Test mode"; just spam 424242.. etc for the credit card number, expiration, cvc, etc, when using the test mode, rather than a valid credit card.

![image](https://github.com/steveseguin/social\_stream/assets/2575698/29bab9b6-8fb7-482d-87d1-2b7f2bd74f9f)

![image](https://github.com/steveseguin/social\_stream/assets/2575698/3f31974c-6bbb-4ed0-bc7c-4d27f7c3103b)

#### Text to speech

Text messages can be converted to speech, assuming your system supports TTS. On my Windows machine running Chrome/OBS, it works. I have it set to English-US by default, but you can change the language to something else by editing the URL. ()

ie: `index.html?session=XXXXXX&speech=en-US` or `socialstream.ninja/?session=xxx&&speech=en-US`

You can get a list of support languages on your system by running `speechSynthesis.getVoices()` from the Chrome browser console on your system. You can install additional ones fairly easily, if on Windows. See: https://support.microsoft.com/en-us/windows/download-language-pack-for-speech-24d06ef3-ca09-ddcc-70a0-63606fd16394

![image](https://user-images.githubusercontent.com/2575698/165753730-374498e7-7885-49ef-83ba-7fe2acde26ee.png)

The audio will play out the default system audio output device. This might be a problem if using OBS for capture, as you'll need to use a virtual audio cable to capture the audio output of the system output and route it back into OBS for capture. Another user mentioned they were able to capture the TTS audio in OBS by selecting `explorer.exe` in the system application recorder. Using the Premium Google-based TTS option (mentioned below) might also be a solution to this issue. See the related issue here: https://github.com/w3c/mediacapture-output/issues/102

If loading the app in the Chrome/Edge/Firefox browser, you will need to "click" the web page first before audio will play. This isn't the case with OBS, but most browsers require the user interact with the website on some level before it will play audio. Please keep this in mind when testing things.

There is a toggle in the dock to turn off and on the text-to-speech; turning it off whill automatically stop any audio playout. Still, be careful when using text-to-speech with the dock, as viewers can exploit it to have your system read out unwanted things on air.

**Installing different language-speech packs**

By default, the list of support languages on your computer could be slim. To add more speech options for different langauges, you'll need to install them.

see: https://support.microsoft.com/en-us/windows/download-language-pack-for-speech-24d06ef3-ca09-ddcc-70a0-63606fd16394 for details

There's a simplified test app for text-to-speech here also, that might also help try different languages on the fly: https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/

You can manaul set the pitch, volume, rate, and even voice-name with the below URL parameters. The voice just matches on a partial word, so "siri", "google", "bob", or whatever is being used will work. This still assumes the language selected also matches. `&speech=en` (first english to match), `&speech=en-US` (default), or `&speech=fr-CA` can specify the language, for example.

```
&pitch=1
&volume=1
&voice=google
&rate=1
```

**Premium TTS voice options**

**GOOGLE CLOUD TTS**

I've added support for Google Cloud Text to Speech API, but you must use your own API key to use this feature, as it is expensive to use.

Go to https://cloud.google.com/text-to-speech -> Enable the service, and then get an API key.

![image](https://user-images.githubusercontent.com/2575698/180443408-5cc0f7a9-c015-420d-9541-fd94a520ef25.png)

This premium text-to-speech is supported on the index.html (the featured chat overlay) and dock.html page. If you stop the TTS with the button in the dock's menu, it will stop playback immediately in the dock. It will also delete any queued messages to be spoken.

You need at least \&speech and \&ttskey to enable the premium TTS, but there are customizations:

```
&volume=1
&voice=en-GB-Standard-A
&gender=FEMALE
&speech=en-us
&ttskey=XXXXXXX
```

See the Google Cloud doc for more help

**Eleven Labs TTS**

If you want a different set of voices, or wish to train your own, ElevenLabs.io has a TTS service that you can try. There's a "free" version you can get started testing with, which just needs you to create an account there and get an API key from your profile settings there. You may need to provide attribution as required, for the free tier?

Anyways, documentation on getting start with finding a voice you want to use and testing your API key: API Social Stream is using: https://api.elevenlabs.io/docs#/text-to-speech/Text\_to\_speech\_v1\_text\_to\_speech\_\_voice\_id\_\_stream\_post Available voices: https://api.elevenlabs.io/docs#/voices/Get\_voices\_v1\_voices\_get

To use this with Social Stream, you'll need to be using the featured-chat index.html or dock.html page, and you'll need to provide your api key there.

Example URL with options `https://socialstream.ninja/index.html?session=SESSIONIDHERE&tts&elevenlabskey=YOURELEVENLABSAPIKEYHERE&latency=4&voice=VR6AewLTigWG4xSOukaG`

* `&tts` is also required to enable TTS in general
* `&voice={VOICEIDHERE}`, is the voice ID you want to use.
* `&latency={N}`, where N can be 0,1,2,3, or 4. 0 is high latency, but better quality. Default is 4 (fastest)
* `&elevenlabskey={APIKEYHERE}`, don't share this API key, but this is needed to use the service and to specify that you want to use elevenlabs for TTS

If you stop the TTS with the button in the dock's menu, it will stop playback immediately in the dock. It will also delete any queued messages to be spoken.

Please NOTE: Make sure to CLICK on the browser page after it loads, else audio may not work in the browser. Browsers require user-gesture detection before audio can auto-play. OBS Studio's browser source and the Electron Capture app are exceptions to this rule.

#### Branded channel support

There is a toggle that lets you show the source of the chat messages.

* `&branded` will show the channel-icon; YouTube and Twitch channels supported. Use with the dock or index file.
* `&showsource` can be added to the index.file, to show the main site the source is from; ie: YouTube, Facebook.

![image](https://user-images.githubusercontent.com/2575698/166864138-00cd1e1c-2149-473f-be8d-d07a8d400c07.png)

#### Known issues or solutions

* Browsers will sometimes stop browser tabs after an hour of inactivity. Disable this option in your browser under `chrome://settings/performance` or where ever this setting is found.
* Other options that may be active in your browser can be disabled also, to avoid tabs being throttled or paused, such as `chrome://flags/#calculate-native-win-occlusion`
* Another option, if using Windows, is to do Windows + Tab, and have two virtual Desktops on your PC. Put the chat windows into one virtual desktop, and use OBS in the other. Win+Tab can let you switch between windows.

If the auto responder doesn't work -- you see a blue bar, but nothing happens, there's a couple things to do.

* make sure if using YouTube/Twitch that the pop out window is open
* go to `chrome://apps` and remove the YouTube(s) apps that might appear. You can remove them all really if none are required.
* Make sure you have permission to post into the chat first -- sometimes you need to be a subscriber for example to send chat messages.

![image](https://user-images.githubusercontent.com/2575698/146602513-e3b7e69c-19fa-4e58-b907-6f08b3f873e0.png)

* If the blue bar warning about Debugging mode is a problem, start Chrome with this command line flag: `--silent-debugger-extension-api`

![image](https://user-images.githubusercontent.com/2575698/196629133-6c06fedb-9f22-40aa-8031-d7f4c681ad95.png)

* If you can't save to disk, like export the settings to disk, ensure your browser allows the `File System Access API`

In Brave, this can be enabled via `brave://flags/#file-system-access-api` ; open that link and enable the setting (then restart)

* If the chat capture stops when you minimize or hide a browser window, disable background throttling within your browser. Instructions as follows:

```
Go to chrome://flags/ (That's a real URL in Chrome, Edge, Brave, and others)

In the search, type "throttle"

You're going to get 3 options, the two labeled "Throttle Javascript timers in background" and "Calculate window occlusion on Windows", probably set as "default" right now, turn them to "disabled"

In the bottom right corner, hit relaunch to relaunch chrome with new settings. Throttling should pause browser tabs or windows when occluded or minimized.
```

* Try refreshing the chat page; sometimes refreshing the page will retrigger the code and bypass any errors. This is particularly try if you install or refresh the extension after the chat page has already been loaded.
* Try to keep the chat window and dock page active and if possible, even partially visible on screen. If the windows are hidden or minimized, they may stop working. This is also true if the scroll bar for the chat window is not at the bottom; sometimes messages won't load unless you are seeing the newest messages.
* If using OBS Studio on macOS or Linux, for some reason this extension will not work if hosted locally on your drive, so custom CSS needs to happen via the browser source style section. It works great on PC locally, and when hosted on socialstream.ninja, but locally on mac, it does not seem supported. This is an issue you'll need to take up with the OBS developers.
* For discord, slack, and telegram, for security reasons, you need to enable the TOGGLE switch in the settings to enable.
* To set the Session ID to your own value, go to Extensions settings to set it. On Chrome: Settings -> Extensions -> Social Stream Ninja -> Details -> Extension options.

#### Requesting a site

You can make a request here on Github as an issue ticket, or join the Discord server at https://discord.socialstream.ninja and request there.

Not all requested sites can or will be supported. Steve generally will add support for publicly accessible social chat sites that have a significantly-large community; it's ultimately up to the decretion of Steve though on what he wants to add or has time to add. Code contributions from others that add new site integration or features are normally welcomed, but sites/features that may violate Canadian laws, fail to meet quality standards, or for any other reason, may possibly not be merged or accepted. In these cases you may need to self-host or fork the repo, maintaining your own copy with said changes instead.

There is no guarentee that a site that gets added will continue to be supported over time. Steve also doesn't accept payment for adding an integration or for support.

#### Adding sites yourself

I have a video walk-thru on how I added a simple social site to Social Stream:

{% embed url="https://youtu.be/5LquQ1xhmms?si=zzMKO2ewoqYOhdCx" %}

You can also refer to some of my code commits, where you can see which changes I made to add support for any specific site.

ie: `https://github.com/steveseguin/social_stream/commit/942fce2697d5f9d51af6da61fc878824dee514b4`

For a simple site, a developer should need just 30 minutes to an hour to get a site supported. A more complicated and tricky site may take a few hours or longer, depending on the developer's skill.

#### Support

You can find me on discord over at https://discord.socialstream.ninja or [https://discord.gg/7U4ERn9y](https://discord.gg/vFU8AuwNf3), offering free support in channel #chat.overlay-support

Feedback and feature requests are welcomed. Please also make a Github issue if you're not a fan of Discord, but still need to report a bug or feature request.

#### Icons

I do not claim rights of all the icons distributed. While I made some of the icons, trademarks and logos of third party companies/services are the rights of those respectivitive entities. Use them according to the terms that those entities may offer them under.

#### Credit

This project contains inspiration by my other project, chat.overlay.ninja, which was a derivation of another Youtube-specific chat widget, which was inspired by the stylings of other featured-chat code sample, of which that was also inspired by existing chat overlay designs. May the many new innovations of this project inspire the future foundation of other awesome projects as well.

#### Contributors to this project

[![](https://contrib.rocks/image?repo=steveseguin/social\_stream)](https://github.com/steveseguin/social\_stream/graphs/contributors)
