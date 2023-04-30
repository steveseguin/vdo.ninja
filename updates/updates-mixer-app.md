# Updates - Mixer App

[mixer-app.md](../steves-helper-apps/mixer-app.md "mention")

#### April 27

* OBS scene syncing in the Mixer App works both ways now - changing the OBS scene will activate the corresponding layout in the Mixer App if the layout is linked to a scene. As already is the case, selecting a layout will activate the OBS scene it is linked to as well.\
  ![](<../.gitbook/assets/image (15).png>)

#### March 6

*   You can use the API to control the mixer layout now, via the Mixer App. `https://api.vdo.ninja/APIKEY/layout/2`\
    \-- there were some bugs with this when using it via the Mixer App before, and there wasn't much documentation on the [companion.vdo.ninja](https://companion.vdo.ninja/) site. All fixed.\
    ![](<../.gitbook/assets/image (6) (1).png>)![](<../.gitbook/assets/image (2) (1) (2).png>)\


    Note: The benefit of being able to switch just the layout, rather than scene, is that you only need one browser source in OBS (not even needing OBS really either). Having one browser source means fewer resources used for both the director and guests. All controllable via hotkeys or API.\
    \
    \*\* works on vdo.ninja/alpha/mixer?api=APIKEY

#### January 19

* The Mixer App on alpha has had several bug fixes; thank you for reporting them ([vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer))

#### January 16

* You can specify the animation speed now
* Manually enter values for element size/position (rather than just by dragging)
* IFrame source support added, so you can specify a website as a source
* Background images now display, even if no video stream is active

#### January 11

* URL-param pass-thru added to the Mixer App. So [`&meshcast`](../newly-added-parameters/and-meshcast.md) now works with the Mixer App, etc.

#### January 9

* The Mixer App now has the director defaulting to [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md), so they can screen share and host a camera at the same time.

### 2022

#### December 18

* Fixed a couple minor CSS issues, such as the hot keys being hidden at times, the control bar being partially offscreen, or the mini-preview breaking the control bar when toggling views. (**partially pushed to production; a full fix on alpha)**

#### November 13

*   Added the option to change OBS scenes whenever you change layouts in the Mixer App.\
    For this to work:

    1. [`&remote`](../general-settings/remote.md) needs to be on the scene link (should be there if using the provided scene link)
    2. Needs to be enabled in the Mixer's settings\
       ![](<../.gitbook/assets/image (2) (2) (2).png>)
    3. An OBS scene name needs to be specified for a layout in the mixer app (And make sure you click "save scene" after)\
       ![](<../.gitbook/assets/image (11) (3).png>)
    4. OBS's browser source needs level 4 or 5 enabled for at least one of the VDO.Ninja scenes that you added to OBS (or set to all scenes, if you disable sources when inactive)\
       ![](<../.gitbook/assets/image (5) (1) (1).png>)

    The idea here is that you can have OBS overlays/mixer apply in sync to your VDO.Ninja custom mix layouts, and even control your show remotely without OBS even on the same computer.
* If you hold CTRL down while dragging/resizing elements in the Mixer App, grid-snapping mode is disabled, allowing for fine-grain pixel-level accuracy.\
  ![](<../.gitbook/assets/image (6) (1) (1) (1).png>)\
  \
  \*\* on alpha at [https://vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) (could be some bugs here or there, so please report issues as you find them).

#### November 12

* Added the option in the mixer app to use 1080p as the canvas size (instead of 720p) to make it easy to get pixel perfection at full HD.\
  ![](<../.gitbook/assets/image (1) (1) (2).png>)
* Added the option to save scenes in the editor with pixel-units instead of relative percentiles. Not recommended for most users, but can make it easy to manually edit an exported layout (pixels vs fractions). The little thumbnails will update.
* Added support to VDO.Ninja so that layouts can be expressed as a relative percentile or pixel specific (for advanced users). VDO.Ninja will assume wp,hp,xp, and yp are "pixel" based units for x,y,h,w. If you canvas/browser is too big or small, things may overflow or not fit correctly.\
  \-- please note: w,h,x,y take priority over wp,hp,xp,yp, if both are present in a layout file.
*   JSON export is "prettified" so its easier to edit with notepad (rather than being a single long line).\
    ![](<../.gitbook/assets/image (15) (1) (2).png>)

    \
    \*\*\* Changes on alpha at [vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) for testing and feedback.

#### October 19

* [vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) was updated to have the director be included as a slot option, so you can include yourself in the video layouts now.

#### August 17

* Added a setting to disable auto-slot assignment to the mixer. (requires a hard browser cache refresh of all VDO.Ninja links for the mixer to work properly with this change) \* on alpha @ vdo.ninja/alpha/mixer\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/1009255568386568283/unknown.png?width=373\&height=300)

#### August 16

* Solo links are setup to use [`&solo`](../advanced-settings/mixer-scene-parameters/and-solo.md) instead of [`&scene`](../advanced-settings/view-parameters/scene.md) now; it's the same outcome, except `&solo` tells the system not to apply custom 'layouts' to them. Links updates in the director's room and the mixer app.
* Changes to how layouts are issued have been updated -- you'll need to do a hard browser refresh (particularly in OBS) for things to work now, if using alpha + mixer.
* Invite/scene links in the mixer get copied to the clipboard when pressed, rather than open.
* Added some options for customizing guest links in the mixer app -- one of them is to disable the `&broadcast` mode. For the time being, guests not in `&broadcast` mode will have director-issued layouts apply to them. (I may change this to a custom flag instead in the future, as I am still exploring ideas currently to make things intuitive yet flexible)\
  ![](<../.gitbook/assets/image (2) (4) (1) (1).png>)
* If a guest is using [`&minipreview`](../source-settings/and-minipreview.md) and is issued a layout, the mini preview only shows now if they are not in the current layout.

#### August 11

* The Mixer App now has initial support for the http/wss API. `https://api.vdo.ninja/{apikey}/layout/N` to use, where N is the layout (starting at 1). 0 is auto-mix. (feedback valued, as more will be added to this over time)
* Fixed a switching bug with mixer on alpha and added in the director's control bar, so they can share video/audio.; with this, you can output the OBS Virtual cam feed to the guests, as they will be in broadcast-mode already.

#### June 16

* Minor fixes to the mixer have been applied; (lots more to do)

#### May 16

* More improvements to the mixer-app on alpha; mainly UX/UI improvments, with a couple bug fixes. (vdo.ninja/alpha/mixer)

#### May 15

* The Mixer App ([https://vdo.ninja/beta/mixer](https://vdo.ninja/beta/mixer)) has been updated with changes. While the mixer is still under exploratory development, it uses a new UX/UI approach to assigning guests to slots. Much less drag/drop-based. These changes were based on user-feedback; lots more feedback to still dig thru.
* Side note: It should be possible to assign slots to videos within the normal director mode. Adding [`&slotmode`](../advanced-settings/director-parameters/and-slotmode.md) enables it for the director. While the layout switching options of the mixer will be missing when doing this as a normal director, you can still specify [`&layout`](../advanced-settings/mixer-scene-parameters/and-layout.md) via he URL for multiple scenes that will obey the slot assignments. (might interest advanced users or inspire user suggestions).\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/975293518572576828/unknown.png?width=400\&height=225)![Bild](https://media.discordapp.net/attachments/701232125831151697/975293518841016330/unknown.png?width=400\&height=279)

#### April 27

* Keyboard hotkey support added to the mixer app on vdo.ninja/alpha/mixer (change layouts using 0 to 9). plus other fixes/tweaks.

#### April 26

* Beta updated will all recent changes, including mixer.

#### April 25

* vdo.ninja/alpha/mixer has further fixes/tweaks. Basic, but functional now I think.

#### April 24

* While it's still a work in progress, the Mixer App has hit a new milestone of development and is up on alpha at [https://vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) Some of the functions available now in the update mixer:
* The ability to switch between a preview of the mixed scene and the director's view (toggle button for this)
* Each element allows for setting of: border thickness, color, margin, border roundness, media coverage, background image (URL), and animated transition.
* Scene editor, with drag/resize capabilities
* Layout refreshes automatically on scene reload
* Default layout is scene load now blank
* Saves scenes to local storage, for reuse
* Copy/paste export of JSON of constructed scenes for use in the URL without needing mixer controller (`&layout=JSONOBJECT`)
* Most of the work so far has gone into rewriting parts of the mixer logic to support more complex layouts, but also aspects like switching between director view and scene view has required a few nights of head bashing.
* I'm hoping to get this all tied up as soon as possible and released as a v22, where I'll continue to refine things. (still some lingering bugs and a couple broken features)

#### April 1

* Fixed a password issue with the vdo.ninja/mixer (passwords can be set via the URL now)

#### January 2

* Removed the animated background of the mixer app based on feedback (more feedback on it welcomed)

### 2021

#### December 14

* I did a walk thru video, demoing and explaining the Mixer App I made the other month. I realize the mixer prototype isn't the greatest, as it's hard to understand how to use, but hopefully this helps address that.\
  [https://www.youtube.com/watch?v=9xdZq4SCBoA](https://www.youtube.com/watch?v=9xdZq4SCBoA)\
  [https://vdo.ninja/beta/mixer](https://vdo.ninja/beta/mixer)\
  Feedback on the mixer welcomed.

#### November 2

*   Made some improvements to the prototype mixer I've been working on; on alpha [https://vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) I'm still experimenting with it, but you can add custom layouts now. I think it's functional, but the UI/UX still stinks.

    ![Bild](https://media.discordapp.net/attachments/701232125831151697/905155580866478220/unknown.png?width=400\&height=182)

#### October 24

* Updated beta with a version of the mixer prototype that controls `&scene=0` now remotely and doubles as the director. I'm still playing around with integration/UI ideas, but the mixing logic is now mostly there at least. Open to feedback; thank you for feedback / ideas so far. Go here [https://vdo.ninja/beta/mixer](https://vdo.ninja/beta/mixer) to play with the updated mixer prototype. A guest link and scene-link are provided, so you just need to enter a room name on page load. Drag guests into a slot, select a layout, and the scene will update. That is, `&scene=0` (scene view link), which you need to open in a new tab or in OBS.\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/901833568601399376/unknown.png?width=400\&height=298)

#### October 20

* Created a sample app that allows for custom-layouts and mixing, using just VDO.Ninja and basic Javascript. [https://vdo.ninja/examples/mixer](https://vdo.ninja/examples/mixer) It's a very crude prototype of what's possible via the IFRAME API. I'll be extending a version of it to allow for structured scene layouts and custom dynamic layout switching in the director's control center, etc.
* To play with this prototype though: Go to above link, enter a room name when prompted, and then open a few guest feeds with the "invite guest link" button.
* Next, as your guests streams join, their associated stream ID will appear on the far left. Drag a stream ID into a slot position: 1,2,3 or 4. You can do this for up to 4 stream Ids, as there are 4 slots.
* Once guests are loaded into slots, you can select a scene layout at the top of the page. It will apply the scene layout, relative to what has been assigned to the slots. If a slot is empty, it will be left empty when drawing the layout.
* Stream IDs can be dragged to other spots or removed. Must select the scene layout to re-apply after It should be possible to create custom layouts, with assets, transitions and effects, when I'm done.
* I'm open to ideas and thoughts on how this could be integrated into the director's control center; or how best to move forward. I'm off to bed for now though.![Bild](https://media.discordapp.net/attachments/701232125831151697/900350732732080148/unknown.png?width=400\&height=217)
