# Updates - VDO.Ninja

* [upcoming-parameters](../advanced-settings/upcoming-parameters/ "mention")

#### **September 2** <a href="#august-31" id="august-31"></a>

* [Noise gate](../source-settings/noisegate.md) remote control has been tweaked a bit; the correct state is loaded now on a director's page refresh
* Added an option to control the [compressor](../source-settings/and-compressor.md) remotely (3 states for the compressor; Off/On/Limiter)\
  ![](<../.gitbook/assets/image (3).png>)
* Fixed issues on alpha, including now where the [labels](../general-settings/label.md) for guests were not always positioning correct if audio-only
* \*\* changes on alpha @ vdo.ninja/alpha/

#### **August 31** <a href="#august-31" id="august-31"></a>

* Added a button in the director's room. It lets you toggle between a Preview layout and the normal Director layout; the Preview layout will mirror what a basic [`&scene=0`](../advanced-settings/view-parameters/scene.md) link would look like. Useful if you want to switch to a guest-like mode as a director, and then switch back as needed to the director's room to make adjustments. - to enter this mode by default, [`&previewmode`](../advanced-settings/upcoming-parameters/and-previewmode.md) can be used by the director \*\* on alpha at vdo.ninja/alpha/\
  ![](<../.gitbook/assets/image (1) (2).png>)
* ``[`&noisegatesettings`](../advanced-settings/upcoming-parameters/and-noisegatesettings.md) has been added to vdo.ninja/alpha/, which is used in conjunction with [`&noisegate`](../source-settings/noisegate.md). This feature lets you tweak the noise-gate's variables, making it more or less aggressive as needed. example:\
  `https://vdo.ninja/alpha/?noisegate&noisegatesettings=10,25,3000`\
  ``It takes a comma separated list:\
  \-- First value is target gain (0 to 100), although 0 to 40 is probably the recommended range here\
  \-- second value is the threshold value where the gate is triggered if below it. \~ 100 is loudly speaking, \~ 20 is light background noise levels, and under 5 is quiet background levels.\
  \-- third value is how 'sticky' the gate-open position is, in milliseconds. Having this set to a few seconds should prevent someone from being cut off while speaking or if taking a short pause.

#### August 25

* Added new sender-side parameters that can customize how you want VDO.Ninja to balance resolution vs frame rate, specifically when bitrate or CPU is insufficient to offer both at the same time.\
  \-- for video, [`&contenthint=detail`](../advanced-settings/upcoming-parameters/and-contenthint.md)``\
  ``-- for screen-shares, [`&screensharecontenthint=motion`](../advanced-settings/upcoming-parameters/and-screensharecontenthint.md), which will override [`&contenthint`](../advanced-settings/upcoming-parameters/and-contenthint.md) for just screen-shares if set also.\
  The two options for video are `detail` or `motion`. Screen shares generally tends towards `detail` by default, and camera sources are tend towards `motion` by default. `detail` will try to prioritize resolution over frame rate, so the frame rate may drop a lot used. `motion` will try to maximize frame rate, but may drop the resolution a lot. There's no way to force both on as there's no magic bullet if your CPU or network cannot keep up. note: If using [`&codec=vp9`](../advanced-settings/view-parameters/codec.md) on the viewer side, the frame rate may drop as low as even 5-fps.\
  \-- Also for audio, I've added [`&audiocontenthint=music`](../advanced-settings/upcoming-parameters/and-audiocontenthint.md) The two options are `speech` and `music`. No idea what it does exactly, but when using `music` there seems to be a fixed bitrate of 32-kbps sent out by default, where as with `speech` it is variable, using less bandwidth when not speaking.\
  These parameters have been tested on Chrome, but other browsers may vary in behavior. Safari seems to just ignore things, for example. \*\* changes on alpha

#### August 23

* Updated the translation files on GitHub and on vdo.ninja/alpha/, so recently added UI elements can have alternative translations added
* Custom scenes will now be sorted based on alphanumerical value. (rather than order of connection). \*\* on alpha\
  ![](<../.gitbook/assets/image (1).png>)

#### August 22

* When you toggle the customize-scene-link function as a director, some of those items will now be applied to the guests' solo link also. (just the ones I think are relevant)
* [`&sharper`](../advanced-settings/upcoming-parameters/and-sharper.md) and `&sharpen` are now aliases of [`&dpi=2`](../advanced-settings/view-parameters/dpi.md), which should 'up to' double the amount of playback video resolution, if the dynamic resolution optimization is enabled at least, in certain cases. This is a lot like [`&scale=100`](../advanced-settings/view-parameters/scale.md), but perhaps _slightly_ more efficient in some cases. This is mainly for when you intend to have a large screen-shares in a scene, where you don't want the tiny guest videos to be a 100% scale, but 50% scale is fine (up from 25% scale). `&dpi` already exists on production, but by adding these aliases, I hope it's more discoverable.
* As an alternative to `&sharper`, I've also added [`&sharperscreen`](../advanced-settings/upcoming-parameters/and-sharperscreen.md), which sets `&scale=100`, but _only_ for screen-shares. (virtual cameras not included). This is probably even more efficient than `&scale=100` or `&sharper`, and it's designed for when screen-sharing a lot of text. Text looks a bit soft when streaming video at 1:1 pixel resolution.\
  It's recommended to only use these parameters within the context of a scene link, and not on guest links, due to the higher CPU / bandwidth it may use.
* Chunked mode on alpha lets you switch cameras/audio now, without them breaking; muting video still breaks things tho. (chunked mode remains a WIP) \*\* changes push to alpha
* Put up a YouTube video (second in a series so far) where I am investigating the performance of a cellular bonding device and its software, specifically as it relates to VDO.Ninja uses. If on a bad connection, doing remote streaming, or just want some added stream reliability, cellular-bonding seems worth considering. [https://www.youtube.com/watch?v=-BNpoWhzKHw](https://www.youtube.com/watch?v=-BNpoWhzKHw)

#### August 17

* Added the option to customize the [`&grid`](../advanced-settings/design-parameters/grid.md) (`&ruler`/`&thirds`) effect by passing an image link. (can help center guests)\
  \-- transparent PNG or an SVG file are the recommended options.\
  \-- it will stretch to cover the camera preview-area, so probably best to keep things 16:9 aspect if needed.\
  \-- URL can be URL-encoded, for more complex URLs. Simple URLs might work without.\
  \-- technically this can be used as an overlay for other things, but it only works with the self-preview.\
  \-- leave the passed value empty if you wish to have the white basic rule-of-thirds show as default.\
  example: `https://vdo.ninja/alpha/?thirds=./media/thirdshead.svg`\
  ``\*\* on alpha.\
  ![](<../.gitbook/assets/image (7).png>)
* Added [`proxy.vdo.ninja/alpha/`](https://proxy.vdo.ninja/alpha/) as an alternative to `vdo.ninja/?proxy`. If's a more user-friendly version of [`&proxy`](../newly-added-parameters/and-proxy.md). \*\* Just on alpha for now\
