# Updates - Comms

[comms.md](../steves-helper-apps/comms.md "mention")

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


    <figure><img src="../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>
