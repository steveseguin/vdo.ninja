# Updates - Social Stream Standalone App

#### [social-stream.md](../../steves-helper-apps/social-stream.md "mention")

#### [https://github.com/steveseguin/social\_stream/releases](https://github.com/steveseguin/social\_stream/releases)

#### February 19

* Updated the standalone app to support selecting the chat to use based on the YouTube Video Id

#### February 13

v0.1.16\
[https://github.com/steveseguin/social\_stream/releases/tag/0.1.16](https://github.com/steveseguin/social\_stream/releases/tag/0.1.16)

* Instagram live support was fixed (update required)
  * Also tweaks for rumble and a fix for a lack of scroll added

#### January 31

* 'always on top' option fixed; Mac and PC

#### January 12

v0.1.12\
[https://github.com/steveseguin/social\_stream/releases/tag/0.1.12](https://github.com/steveseguin/social\_stream/releases/tag/0.1.12)

* You can specify the Social Stream injection source code that you wish to use in this version.
  * ie: `socialstream.exe --filesource C:\Users\steve\Code\social_stream\`
  * In this case, we are specifying the local folder, and the popup/background/source files will be used.
  * So an example use case: If you made your own private integration for Social Stream, and wish to use the standalone app, you can just point to your local folder for Social Stream code and it will use that.
* Also in this version, if using a self-hosted chat site of a supported chat product, like Owncast, you will be now offered a chance to manually select the type of chat source your domain is. So as seen below, when you put in a URL that doesn't auto match to a specific source, you'll be offered the chance to select which source it actually is. See the attached image.\
  ![](<../../.gitbook/assets/image (10).png>)

### 2023

#### December 29

**v0.1.10**\
[https://github.com/steveseguin/social\_stream/releases/tag/0.1.10](https://github.com/steveseguin/social\_stream/releases/tag/0.1.10)

* Updated with recent security patches + Vimm WSS support

#### November 23

**v0.1.9**\
[https://github.com/steveseguin/social\_stream/releases/tag/0.1.9](https://github.com/steveseguin/social\_stream/releases/tag/0.1.9)

* Fixing an issue with Mac and I think improving YouTube chat auto open support some more.
* Please report bugs with it, however please also note it's still not fully cooked and is just for testing/previewing.

#### November 22

**v0.1.8**\
[https://github.com/steveseguin/social\_stream/releases/tag/0.1.8](https://github.com/steveseguin/social\_stream/releases/tag/0.1.8)

* YouTube chat discovery for UK/EU users I hope works better now
* The TikTok websocket option should work now; at least in read-only mode.

#### November 15

**v0.1.5**\
[https://github.com/steveseguin/social\_stream/releases/tag/0.1.5](https://github.com/steveseguin/social\_stream/releases/tag/0.1.5) (Mac and Pc)

* Sites like peertube, that use self-hosted domains, are supported now.
* Chat responses will now work with more than just the first site opened.
* It's still a preview test version; bugs and broken features are to be expected.

#### November 10

**v0.1.4**\
It's still very much in "just a preview test" mode, though I've trying to work thru all the issues. Please bare with me if you have issues with it.

* Fixed a bug that broke 0.1.3
* The auto-YouTube Chat activation option will only work if the video is LIVE and PUBLIC. If unlisted, you may need to enable YouTube cat pop-out manually.
* I've had some users report the ZIP is detected as a virus. I'm pretty sure it's a false positive as VirusTotal does not detect anything. Still, feel free to use the extension version instead, as that contains no executables. [https://www.virustotal.com/gui/file/5a72f615d4cb3f2ae5b69be3bc544215cd19c4dc9ba6a987015e96a493570555/details](https://www.virustotal.com/gui/file/5a72f615d4cb3f2ae5b69be3bc544215cd19c4dc9ba6a987015e96a493570555/details)

[https://github.com/steveseguin/social\_stream/releases/tag/0.1.4](https://github.com/steveseguin/social\_stream/releases/tag/0.1.4) (mac/win64)

#### **October 26**

MacOS support added and several bugs fixed\
[https://github.com/steveseguin/social\_stream/releases/tag/0.1.1](https://github.com/steveseguin/social\_stream/releases/tag/0.1.1)

#### **October 22**

I'm putting out a "still-in-development preview" version of the **Social Stream Standalone App**

* I've been poking at this project for the past year, and due to frequent requests for it I'm making it available as a preview-build.
* I'd say 90% of the features available in the extension work in this standalone version, with the interface about 50% done.
* Available as an installer for Windows x64 only at this point, but a Mac build is probably not far off.

[https://github.com/steveseguin/social\_stream/releases/tag/0.0.1](https://github.com/steveseguin/social\_stream/releases/tag/0.0.1)

<figure><img src="../../.gitbook/assets/image (215).png" alt=""><figcaption></figcaption></figure>
