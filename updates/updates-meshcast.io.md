# Updates - Meshcast.io

[meshcast.io.md](../steves-helper-apps/meshcast.io.md "mention")

#### December 12

* Added 3 new Meshcast servers: Toronto, Oregon, Virginia.

#### September 6

* Support for iPhone/iPads now

#### January 9

* Added screen sharing support; just select it from the list. If using Chrome/Edge/Brave, you can select desktop or tab audio along with the screen-share. Resolution is left up to the browser to decide.\
  ![](<../.gitbook/assets/image (5) (2) (1).png>)

### 2021

#### December 29

* Someone asked about me making a video talking about Meshcast to help them understand if they could use it; it's up now at [https://www.youtube.com/watch?v=YxduINMXw1M](https://www.youtube.com/watch?v=YxduINMXw1M) It's a bit technical and long-winded, but it covers most of everything.

#### December 22

* Meshcast.io supports audio and video-only publishing modes now; just select "no video" for example from the drop down. Also shows audio-bitrate stats now.
* Added an audio-loudness meter.

#### December 10

* Updated to let you select a video codec; rather than the default software h264. mind you, other codecs may have compatibility issues.

#### November 11

* added `&noaudio` to meshcast.io, which can be used in place of `&mute` when sharing a Meshcast broadcast link into a VDO.Ninja room. Blocks audio from playing, which can help avoid feedback/echo issues.

#### November 10

* Added logic to Meshcast.io that auto-switches away from slow/dead servers, despite perhaps being the closest edge node.

#### November 9

* Updated a bit, including adding some new servers and replacing some others. Applies to the [`&meshcast`](../newly-added-parameters/and-meshcast.md) flag as well.
* There's a drop down to select different regions; it automatically tries to select the closest though.
*   Info on whether a region is overloaded or not is present; should always read "good", but who knows.\
    ![](<../.gitbook/assets/image (12) (1).png>)

    Things are more responsive with the updated code, but its new code -- let me know if any bugs occur.

#### October 11

* `https://meshcast.io/view.html?id=xxxxx&muted` if using Meshcast, you can share the view link into VDO.Ninja or elsewhere, and have the audio be muted by default using the `&muted` (`&mute`) command.
* Using this flag, you can have two versions of a Meshcast output -- one suitable for a group-room, where you don't want audio or feedback issues with your guests, but another for mass consumption by an audience, which includes audio.

#### June 14

* Meshcast.io should work with firefox and safari viewers now, if that was an issue for anyone before.

#### May 21

* Added mute support to meshcast.io; so if you mute in VDO.Ninja, it will also mute in Meshcast now.

#### May 5

* EU and US Meshcast server allows for higher bitrates, if you decrease the max audience size.

#### May 2

* Updated Meshcast.io with a European deployment (US + EU now). It will auto-select the closest location, so no need to pick location. Definitely still all experimental, but feedback welcomed; [https://meshcast.io/](https://meshcast.io/)

#### March 5

* For those with weak CPU's, but want to use VDO.Ninja with a larger group, I have a prototype of a tool to make that possible now done. It's NOT ready for production, as it is still buggy and I am resetting the service constantly as I develop it out, but it should eventually allow you to make rooms of over 10 people accessible even on slow OBS computers. [https://meshcast.io/](https://meshcast.io/)
