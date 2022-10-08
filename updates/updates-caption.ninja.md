# Updates - Caption.Ninja

[caption.ninja.md](../steves-helper-apps/caption.ninja.md "mention")

#### July 29

* Added a "translation" component to Caption.Ninja, so you can convert speakers to a single language for overlay on stream. I tried this before, but only now do I think I have it working okay.
* There's two ways to use it:\
  1\. You can go here to explore and tinker. [https://caption.ninja/translate](https://caption.ninja/translate) , which offers a bit of a menu to play with, but is sender's side-based translation (works in a single page, but you can't translate to more than one language)\
  2\. And then there's the normal way of using caption.ninja, which offers viewer-side translation and scrolling support, so you can use this mode to have different languages as outputs instead of just one (assuming the viewer supports the translation code)
* [https://caption.ninja/?room=ufv3QaH\&lang=en-US](https://caption.ninja/?room=ufv3QaH\&lang=en-US) (to capture as English) and [https://caption.ninja/overlay?room=ufv3QaH\&translate=fr](https://caption.ninja/overlay?room=ufv3QaH\&translate=fr) (viewer-side, which converts to french) I welcome feedback.

#### January 5

* Added custom CSS font support instructions to caption ninja; this should apply to VDO.Ninja as well; [https://github.com/steveseguin/captionninja/blob/master/README.md#custom](https://github.com/steveseguin/captionninja/blob/master/README.md#custom-non-standard-fonts)

### 2021

#### November 10

* Changed port/api server of the caption.ninja service; less likely to be blocked by a firewall now

#### August 31

* Based on some git requests, I hacked out an experimental live transcription + translation service over on caption.ninja. It doesn't work super well, but it might be fun to tinker with anyways. [https://caption.ninja/translate](https://caption.ninja/translate) Add in a voice synthesizer, and you got yourself a bablefish translator. If there are more requests for this type of thing, I can work on improving it and eventually adding it to VDO.Ninja.

### 2020

#### September 25

* Captions.ninja -> caption.ninja (bought the domain ; forwards, to avoid mistyping)
* Updated an issue on caption.ninja related to capital URL values
* Also fixed an issue with capitalization of links on Caption.ninja\
  ![](<../.gitbook/assets/image (1) (3).png>)

#### September 10

* Caption.Ninja supports other languages now; `&lang=en-US`, for example. Country codes are linked at the bottom of the page. (thanks guys)
* Updated captions.ninja so it uses truefonts hosted on my server, versus on Google's API server.

#### September 7

* Moved the closed-caption tool to: [https://caption.ninja/](https://caption.ninja/) (still up at the existing location, too)

#### August 17

* Improved the link color/size for the speech caption tool

#### August 16

* So I spent a few hours fixing up the Closed Captioning translation tool. It's set to English only [https://obs.ninja/speechin](https://obs.ninja/speechin)\
  ![](<../.gitbook/assets/image (11) (1).png>)
* There is a link provided for the OBS overlay window. I have it set so you can save the results after with copy/paste pretty easily. And I also changed things up so there are private rooms used by default.
* While I don't log / store anything sent via the server, the transcription logs do get sent via server in this version. Eventually I'll move this to p2p and add full encryption, but for now its still mostly a MVP.
