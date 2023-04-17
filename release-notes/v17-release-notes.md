# v17

Version 17 mainly focuses on user feature requests. Apologies that I didn't get all requested features included this time around, but please be sure to keep the requests coming. As always, please report bugs and provide feedback; it is critical to ensure development continues in a health direction.

If there are problems with version 17, the previous version of VDO.Ninja can still be found at [https://vdo.ninja/v164](https://vdo.ninja/v164)

One new feature that I'd like to highlight in v17 is a [new custom video mode](v17-release-notes.md#webp-custom-codec-for-reduced-cpu-load-broadcasting) that can be used in combination with the director's broadcast-to-room mode. With this setup, the designated broadcaster will encode just a single video stream, and then reuse that encoded stream for all the viewers, dropping frames as needed if bandwidth is limited. Since only a single video stream is encoded, much less CPU is needed to share video with a large group of guests. It's an experimental feature, but I'd love to hear feedback on if it works for you.

## New features at a glance

* [Director's control room updates](v17-release-notes.md#directors-control-room-updates)
* [WebP Custom Codec for reduced CPU-load broadcasting](v17-release-notes.md#webp-custom-codec-for-reduced-cpu-load-broadcasting)
* [Greenscreen and virtual backgrounds](v17-release-notes.md#greenscreen-and-virtual-backgrounds)
* [Guest List](v17-release-notes.md#list-of-hidden-guests-now-appears-by-default)
* [Scene changes](v17-release-notes.md#scene-changes)
* [New Stats](v17-release-notes.md#new-stats-added)
* [Custom CSS via URL](v17-release-notes.md#custom-css-stylesheet-support)
* [Chat-only Overlay](v17-release-notes.md#chat-only-overlay)
* [Remote monitoring support added](v17-release-notes.md#remote-monitoring-support-added)
* [Miscellaneous](v17-release-notes.md#miscellaneous)
* [Chat Commands](v17-release-notes.md#chat-commands)
* [Community highlights](v17-release-notes.md#community-highlights)
* [Active Speaker](v17-release-notes.md#active-speaker)

YouTube video talking about the new release a bit:\
[https://youtu.be/muZ5BQ1E5Ks](https://youtu.be/muZ5BQ1E5Ks)

### Greenscreen and virtual backgrounds

* Added the new virtual background functionality; you can allow a guest to select their own effect by adding `&effects` to the guest invite URL.&#x20;
* You can manually specify a virtual background effect via URL with the following options:

`https://obs.ninja/?effects=3` (bokeh blur)

`https://obs.ninja/?effects=4` (greenscreen)

`https://obs.ninja/?effects=5` (image; guest can select an image on joining; a sunset image is used by default)

* Green screen doesn't require SIMD support to work, although it won't work as well without it on. I leave a little warning info icon (!) if SIMD is not enabled. Please do enable Webassembly-SIMD support under `chrome://flags/` if you'd like to see a large reduction in CPU load when using this feature.

![image](https://user-images.githubusercontent.com/2575698/115194885-10bc3e00-a0bc-11eb-9e88-1a40a38a389f.png)

* Drop down menus created for the virtual/digital background effects. You can select a preload image also or upload your own custom one. Change it via settings of use `&effects` to pick on startup.

![image](https://user-images.githubusercontent.com/2575698/115192073-50812680-a0b8-11eb-8cb8-7d289e2cd4bf.png)

### Active Speaker

*   An 'active speaker' mixing mode has been added. It auto-hides remote guests videos when added, if those guests are not speaking actively.

    `&activespeaker` (or `&sas` or `&speakerview`)
* It will show multiple speakers if there are multiple simultaneous speakers.
* The last guest to speak will remain visible when speaking stops.
* Works with scenes, faux-rooms, and on guest-invites.

### WebP Custom Codec for reduced CPU-load broadcasting

* Attempting to solve the CPU issue when broadcasting to many guests in a room, I created a bit of a custom video codec that bypasses the issues I've been having with WebRTC. This codec uses under 1mbps upload per connection, strives to be as low latency as possible, and uses very little CPU even with many viewers connected. It's quite experimental, not the greatest quality, and still needs the publisher to be 'visible' on the desktop (else it freezes), but it can be enabled while in a group room by adding `&broadcast&webp` URL parameter to the guest links.\
  ie:) `https://vdo.ninja/?room=xxx123&broadcast&webp`\
  (The director just needs to go live with their camera after that.)
* It must be used in conjunction with broadcast mode, but the director doesn't need to be the designated broadcaster.
* The Electron Capture app should work to allow for webp-based broadcasting even if the tab is not visible, as tab throttling is disabled with that application.
* This usese a custom video codec, which is essentially a stream of webp-based images sent over the webRTC data-channels.
* The quality by default is limited in both frame rate and resolution, as this custom video codec is very inefficient at higher resolutions and frame-rates.
* The URL paramter `&webpquality` (`&webpq` or `&wq`) can adjust the quality, where you can pass a value from 0 to 5. You add this parameter to the director (or designated broadcaster) and it then sets the the quality target for the `&webp` mode.&#x20;

`5 (default) = 270p @ ~15fps ; 4 = ~30fps, 3 = ~50fps, 2 = 360p, 1 = 720p, 0 = 1080p.`

Based on my testing, the webp mode is only efficient if you are keeping the bitrates under like 2mbps, so the higher qualities make little sense IMO outside of some niche use cases as they use up a lot of bandwidth. Still, I wanted to give the option.

### Chat commands

* I felt like it would be fun to add "command" options to the chat box, turning the chat window into a bit of a console.&#x20;
* "/list" will list those connected peers, in format: UUID : user label
* "/msg userid some message here" lets you send private messages to other users. You can use partial strings, and I'll do what I can to guess the user based on those partial strings. Use the UUID value or the user's label name. not-case sensitive.

ie: `/list`

`/msg 25e HellllOOo`

### List of Hidden guests now appears by default

* Should list user's labels in a list, along with whether they are video-muted or not, etc.&#x20;
* Includes mic mute states and voice activity meters in the list.
* Isn't visible by default in scenes, faux rooms, or when using `&broadcast` mode.
* [`&showlist=1`](../source-settings/showlist.md) will force show it and [`&showlist=0`](../source-settings/showlist.md) will force hide it.
* Feedback welcomed.

![](https://user-images.githubusercontent.com/2575698/115191919-19ab1080-a0b8-11eb-882e-86b5d22f3914.png)

### New Stats added

* Time since connected and a "total" bitrate value. This includes data-channel and overhead data ; not just audio/video.
* The browser type used by a guest is more clearly stated.
* Total round trip time is a browser stat; the sender didn't have any sort of latency stat, so I added this in. Judge for yourself how well it works; this will not include the viewer's buffer delay I believe. Just transport delay?
* Available outgoing bandwidth, which is the value the browser uses to judge how much upload room it has. By default, Chrome seems to have this max out at around 4500 or so; my guess is Chrome just doesn't see a need to test higher if the default video bitrate is around 2500. The `&videobitrate=` command of course forces Chrome to test much higher. I suppose you could use this value to get an estimate on what the total bandwidth of a connection is, and then you'd be best served keep the `&videobitrate` target to be no more than 80% of that.
* Added audio bitrate to the director's stats.
* Fixed a screensharing bug, where the screenshare didn't go away always when it was stopped using the browser-force stop option.
* Safari desktop users get a hint now to switch to something else when connecting as a guest.
* Broadcast mode will now use the `&minipreview` option by default, with the slight twist; the guest will see themselves full screen if the broadcast hasn't started yet. `&nopreview` can disable it and `&minipreview` can force always-pip for the preview.&#x20;
* Added a couple new bitrate commands that should be quite valuable when using the `&broadcast` option.

`&outboundaudiobitrate` or `&oab`, along with `&outboundvideobitrate` or `&ovb`.

These can be applied to the PUBLISHER's end, and they will set a default target bitrate and max bitrate for outgoing audio and video streams.

For audio, it was added to allow the Director to set their outbound audio bitrate to be shared with guests at something like 160-kbps, while having the guests still be able to share their audio between other guests at the default audio bitrate of around 32-kbps. If the guest sets the audio bitrate (`&proaudio=1` or `&ab=200`), it will override the publisher's `&oab` parameter.

For video, the `&ovb` is similar, except if set it sets the viewer's bitrate and overrides the `&videobitrate` parameter. It won't override the room's total bitrate parameter, as that's a dynamically set bitrate, so to get higher bitrate in group rooms you still need to use `&totalroombitrate`.

Mainly did this work to allow for more control over audio bitrates in the `&broadcast` situation, where guest to guest you might want to have a different audio bitrate versus the director's audio bitrate output.

### Custom CSS stylesheet support

*   Added the ability to link to a remotely hosted CSS style sheet via the URL using the new `&css` parameter. You can stylize VDO.Ninja without needing to host anything more than a CSS file.

    ```
    &css=https://SOMEDOMAIN.com/STYLESHEET.css
    ```

    example: `https://vdo.ninja/?css=https%3A%2F%2Fs10.fun%2Fmain.css`

You can use this tool to encode the URL you want to link to [https://meyerweb.com/eric/tools/dencoder/](https://meyerweb.com/eric/tools/dencoder/)

* The page elements are not visible until the remote style sheet has been loaded

### Chat-only overlay

*   Created a basic chat-overlay based on the VDO.Ninja chat.\
    [https://vdo.ninja/chat?room=asdfasfdsdf](https://vdo.ninja/chat?room=asdfasfdsdf)

    You can add room, password, or/and view as parameters. Other parameters are pre-configured to make it work as a faceless chat listener.
*   It's pretty ugly right now, but it's pretty easy to do CSS styling as needed directly in the OBS Browser source styling area.

    ![image](https://user-images.githubusercontent.com/2575698/115191474-78bc5580-a0b7-11eb-8b11-5025e6a54fb9.png)

### Scene changes

* Added `&scenetype` (aka, `&type`). This is replacing `&scene=2` with `&scenetype=2`. `&scenetype=2` just shows the last guest that was added in the scene; it does a basic mute of the last guest also. `&scenetype=1` does the same thing, but doesn't mute. It's not super sophisticated logic, but it should work in a pinch.
* Director has access to more scene types by default (`&scene=5`, etc). You must manually create scene links for OBS to use these extended scene options, as links for `&scene=0` and `&scene=1` are the only ones provided by default still. You can use these added scene links to create dedicated "slots" for guests in an OBS layout.
* If using `&scene=2` or greater, for performance reasons, videos won't load immediately in the background when the scene becomes active; only once the video has been added to the scene will the video stream be loaded. Videos will still preload however if using `&scene=1`, (up to 500kbps anyways). This is a required performance optimization, imo, and it shouldn't impact existing use cases of VDO.Ninja.

### Changes to the built-in video "record" logic

General logic when setting the recording bitrate has been improved:

* Setting it to over 4-mbps video bitrate will have the audio be set to 128kbps. (Inbound transfer and recording)
* Over 2.5-mbps, and the audio bitrate will be around 80kbps inbound, with a 128-kbps record bitrate.
* When recording with PCM, (`&pcm` or w/e) the inbound audio bitrate will be at 256-kbps (regardless of video bitrate).
* Otherwise, audio inbound bitrates will be set as specified or as defaults (inbound audio bitrates default to around 32-kbps VBR Opus, normally).

### Director's control room updates

* `&transparent` will make the Director's room even more transparent now, for better or worse.
* Added the ability for the director to select audio or video devices via the URL, like how guests can do it using `&vd=xxx` / `&ad=yyy`.
* Added a few more toggles for the director to use to customize links.
* Re-arranged how the director buttons appear and function, including making the the audio output channels and extended scene buttons available by default.
* The director now can set different resolutions for their camera via the settings ; gear icon appears.
* If you enable `&showdirector` as a director, you will now appear as a performer kind of like other performers. Add/remove from scene, highlight, record, order, and the solo-link is easy to access.
* If pressing the "Solo talk" in VDO.Ninja as the director, it will now un-mute you automatically. It will return you to the previous mute state after you un-solo talk.
* Director can now change the URL of a guest remotely, sending them to any website or changing URL parameters.&#x20;
* `&beep` will now go off for the director each time a guest joins the room (with audio/video tracks added).
* Director gets a chat notice that someone (label name used if available) raised their hand via the chat.
* Added some initial state synchronization for the director (finally); auto-updates newly created scene/guests with existing state (`&scene=1` + highlight state synced).
* Added a button to get a glance of the stats for a video (shows the stats for the scene the video is in; nothing else)
* Added the ability to create Calendar invite links to the director's room. Apple calendar doesn't seem to offer an option to create a calendar invite easily, so I just support Google, Outlook, and Yahoo for now. (Bottom right of director's room)
* You can use chrome's picture-in-picture within the director's room. This lets you increase the size of the preview's and move it around the screen.
* Hide/show guest's video can now be armed with `CTRL` (plus state is correct after director reloads)
* Added the ability to "hide" a guest's video -- this applies everywhere, in scenes and for group room guests.
* When recording video as a director ("local record"), the system will now increase the inbound audio bitrate dynamically to be meet the quality targets.
*   Added the ability to 'highlight' a guest's video, which essentially just means it makes it full-screen everywhere.

    ![image](https://user-images.githubusercontent.com/2575698/115188551-12353880-a0b3-11eb-80fa-6607442c6599.png)

### Electron Capture app

* Electron Capture app updated for Windows PC, including now functional screen-share and optimized virtual-background support.
* For those not familiar with the Electron Capture app, it's a free tool that replaces the OBS Browser source with a standalone-version. It is more reliable, uses less CPU, and offers better audio/video quality in general. It still is used in conjunction with OBS, but uses the OBS Window capture mode.
* The Electron capture app can be found here: [https://github.com/steveseguin/electroncapture](https://github.com/steveseguin/electroncapture) (an updated macOS release is in the works).

### Miscellaneous

* Green volume meter dot has a black outline to help make it more visible
* Devices page ([https://vdo.ninja/devices](https://vdo.ninja/devices)) will generate an appropriate `&outputdevice` value for URL-based audio output device selection.
* Translation files updated to be more aligned with V16/v17 changes
* `&optimize=0` will disable video tracks (video bitrate=0) when the video track is not in an active OBS Scene
*   Added more MIDI control-change-based commands, including support for per guest-volume.

    `&nvb` or `&novideobutton` hides the video button for guests (unable to mute their video); `&nmb` and `&nomicbutton` also added.
* Added the `&noremb` command, which deletes the flag for Google' bandwidth estimation tool. Doesn't seem to do much though.
* Fixed a really annoying Android 11 bug that causes the screen to freeze on camera change.
* Fixed an annoying issue where when you disable the camera, the last image sometimes freezes in the preview.&#x20;
* added the `&micdelay={milliseconds}` parameter, which is guest-side, and delays the microphone by specified time in milliseconds. alias `&delay` and `&md`. I already had a `&audiolatency=` parameter, but that used a buffer-node and not a delay node. I am finding the buffer node to cause clicking, and the delay node does not. This is also not the same as the `&sync` or `&buffer` commands, as those are viewer-side delays.
* Added local video/mic state changes to the IFRAME API.
* Improved re-reconnection logic ; should help reconnect things if there is an IP address change.&#x20;
* Fixed an issue where audio wouldn't un-mute if the video was already already muted also
* `&nonacks`, `&codec=red`, `&codec=fec`, and `&nopli` have been added as a viewer-side parameters. They don't seem to do much it seems, but for advanced webRTC testing, they can maybe help override default webRTC behaviors, like potentially some bitrate throttling.
* If a user disconnects without using the hangup button, there's a 50/50 chance they will have a lingering frozen 'last frame' on screen. Well, I got this frozen frame to clear after 8-seconds now (/w a 250ms fade out), versus 18-seconds, so 2.2x faster now. The video will fade-back in if it was just a connection issue that manages to reconnect though, as I do still wait the full 18-seconds or so before I hangup. Slightly less awkward I hope.&#x20;
* Applied some more patches in an attempt to fix issues with some Samsung devices that glitch at certain resolutions; causing odd coloring. I'm applying the fix to all Android devices, just to be safe. May not eliminate the issue, but should reduce it.
* Using `&pip` on the view side will force the system-based PIP to trigger on the first video that loads. This was a user request.
* Updated the initial connection logic so it's compatible with asynchronous server-hosted TURN server credentials. (for self-hosted TURN server users)
* `&maxframerate` (`&mfps` or `&mfr`) , which is like `&framerate`, except it will allow for lower frame rates if the specific frame rate requested failed. Happy to add more options here, or to make the `&framerate=XX` option not fail (but go up or down), but i think the feedback that a frame rate isn't supported is helpful. You will still get an error if the only supported frame rate is higher than the specified frame rate; with either URL.
* Updated the error message for SLOBS on macOS, as StreamLabs on macOS is still not natively supported
* The "no internet connection" error message won't show up in scenes or view links anymore.
* Screenshares will try to provide higher quality resolutions despite still limited bitrates; I am treating the bitrate control code differently now for screenshares vs webcams. Might use up more CPU, but seems worthwhile.
* The mute button pulsates when it's pressed now. I hope this helps users notice that they are mute; the header bar turns red when muted also.
* Added the command `&ptz`, which can be added to a push link, which enables the pan/tilt control of the camera, if compatible. This will trigger a new permission popup though (Chrome only).
* [https://vdo.ninja/supports](https://obs.ninja/supports) This camera settings tool now properly supports pan/tilt detection. (Chrome only)
* When using `&cleanish` and `&record`, you'll get the Record button showing, but nothing else.
* Wrote up some WebHID code for the streamdeck -- TEST code here: [https://vdo.ninja/webhid](https://obs.ninja/webhid) I'll eventually add this all as hotkey support, though I have little idea how to let users customize what does what so far.
* Clicking anywhere outside a popup alert window will close the window now.
* Updated the speedtest to only test with UDP and with the closest server (TCP connections rejected).
* The `&tcp` as a flag will force TCP mode if connected to a TURN server, versus the default, which may be UDP or TCP.&#x20;
* More UDP-based TURN servers available, especially in Europe.
* The mini preview can now be maximized by clicking on it; it can also be minimized again by clicking on the Compress-icon that's normally there if a video is 'in focus'. Compatible with mobile/iOS.
* Added a link to less common known issues on the main site.
* Added a mini-preview option; `&mini` or `&minipreview` will enable it. Auto-forces the preview on.

### Remote monitoring support added

This pretty much lets you remotely monitor a publisher's outbound video stats.

* Works with and without rooms.
* Multiple graphs per viewer of stream are visible remotely.
* `&remote=privateKey` allows for sharing of stats with remote connections; privateKey value is optional.
* Feel free to make contributions to Github with improvements to the `monitor.html` page.
* You can use `&sid=xxx` or `&view=xxx`, as view might be more familiar, but you're not really viewing a video -- hence sid. (stream ID)
* If using this with a room, you'll need to still include `&room=ROOMNAME`; same with the password.\
  `https://vdo.ninja/speedtest?sid=xxxxxxx`\
  `https://vdo.ninja/monitor?sid=xxxxxxx`\
  \
  or for a direct link:\
  `https://vdo.ninja/?push=xxxxxxx&remote=privateKey` `https://vdo.ninja/monitor?sid=xxxxxxx&remote=privateKey`

### Community highlights

* [https://github.com/rse/vingester](https://github.com/rse/vingester) is a community created tool to help turn VDO.Ninja feeds into NDI output feeds.

### Previous release Notes

Version 16.3 and 16.4 release notes were not published to Reddit, as they were not major updates, but they are still worth reviewing too. Find them here:

{% content-ref url="v16-release-notes/v16.3-update-notes.md" %}
[v16.3-update-notes.md](v16-release-notes/v16.3-update-notes.md)
{% endcontent-ref %}

{% content-ref url="v16-release-notes/v16.4-update-notes.md" %}
[v16.4-update-notes.md](v16-release-notes/v16.4-update-notes.md)
{% endcontent-ref %}

You can find a list of all previous release notes at:

{% content-ref url="older-releases.md" %}
[older-releases.md](older-releases.md)
{% endcontent-ref %}

### Thank you

Thank you to those in the community who have contributed both time and resources. It's not always possible for me to help everyone as VDO.Ninja grows, so the community support has been quite appreciated.
