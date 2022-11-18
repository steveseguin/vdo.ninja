# Updates - Comms

[comms.md](../steves-helper-apps/comms.md "mention")

#### November 18

* The Comms App hosted on alpha `(https://vdo.ninja/alpha/comms)` now redirects to the official home for it. [https://comms.cam/](https://comms.cam/). URL parameters are passed as part of the redirect.
* The Comms app now points to the production version of VDO.Ninja, rather than beta or alpha.

#### October 28

* Fixed a bug with mobile support on the Comms app

#### October 26

* The Comms app now shows the total number of users in each group\
  \*\* at vdo.ninja/alpha/comms\
  ![](<../.gitbook/assets/image (12) (4).png>)

#### October 24

* Made a custom domain for the Comms app; [https://comms.cam/](https://comms.cam/)\
  It uses vdo.ninja/alpha via the IFrame API, so its cross compatible. I'm not entirely sure if I'll keep it spun off like this, rather than just hosted on the VDO.Ninja domain itself, but I'm open to feedback/ideas on which direction I should go. (better domain names also are welcomed, if I can afford them)
* The Comms app has been updated to use [`&groupmode`](../advanced-settings/upcoming-parameters/and-groupmode.md) by default
* Lets you share video now; you need to select it via the settings menu - when sharing video via the Comms app, the video-mute button and mini-preview appears\
  ![](<../.gitbook/assets/image (9) (1).png>)

#### October 15

* Updated the Comms app to be mobile friendly
* Created an experimental very simple voice-chat-room app based on the new Comms app here: [https://vdo.ninja/alpha/meet](https://vdo.ninja/alpha/meet)

#### October 8

* Created a page called "Comms", which is designed for audio-only production.
* You can select which "group" you want to be a part of via the top bar, where those in your group can hear you and vice versa.
* If you aren't in a group, you hear everyone.
* Compatible with [`&groups`](../general-settings/and-group.md) with VDO.Ninja as normal; it's just a custom layout stylized/tweaked for audio-only production comms.
* There's a few URL parameters you can set, including [`&push`](../source-settings/push.md), [`&label`](../general-settings/label.md), [`&room`](../general-settings/room.md), [`&password`](../general-settings/password.md), and [`&groups`](../general-settings/and-group.md).
* If you use `&groups=group1,groupb,etc`, new group buttons will appear.
* By default, groups 1 to 6 are there.
*   If you use `&groups=1,2,3` , you'll auto-join groups 1, 2 and 3.\
    \
    ie: [`https://vdo.ninja/alpha/comms?group=backstage,directors,onairgroup,steve123&push=STREAMID&room=TESTROOM`](https://vdo.ninja/alpha/comms?group=backstage,directors,onairgroup,steve123\&push=STREAMID\&room=TESTROOM) \
    \
    or just go to [https://vdo.ninja/alpha/comms](https://vdo.ninja/alpha/comms) to quick start without presetting anything\


    <figure><img src="../.gitbook/assets/image (4) (3).png" alt=""><figcaption></figcaption></figure>
