# Updates - Native mobile apps

[native-mobile-app-versions.md](../steves-helper-apps/native-mobile-app-versions.md "mention")

#### April 9

* Updated builds of the VDO.Ninja native app for Android and iOS are now LIVE on both Google Play and iOS App stores. These new versions allow for use with fully self-hosted deployments, a mic-only mode, and general WebRTC lib updates.

#### April 3

* Added an audio-only option to the VDO.Ninja native app. For now, it's available for Android via sideloading, with the app store versions being updated later on.\
  [https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=share\_link](https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=share\_link)\
  \
  ![](<../.gitbook/assets/image (180).png>)\


#### March 21

* Updated the Android app to support offline/fully-self-hosted deployments of VDO.Ninja, by request.\
  \-- just click the "Advanced" toggle on it setup page, then enter your custom WSS address in the field.\
  \
  Until I push this into the Google Play / App store, you can grab the sideloadable APK here: [https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=share\_link](https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=share\_link) \
  \
  (btw, I am very much welcoming any experienced help in adding USB/HDMI support to the native app)

#### January 31

* &#x20;The v3 update for the iOS native app has been approved and is now available.

#### January 30

* Updated the iOS/Android version with a newer version 2.0.9, which contains some improvements for manual disconnection/reconnection. (also disconnects faster now when using alpha)\
  The Android update is live now, while the Apple update is still pending store approval.\
  ![](<../.gitbook/assets/image (7) (1).png>)

#### January 21

* I pushed an update for the iOS native app of VDO.Ninja earlier and it just got approved. Mainly added reconnection fixes, along with publish-to-room support.\
  ![](<../.gitbook/assets/image (2) (10).png>)

### 2022

#### December 8

* Updated the android native app to have better re-connection smarts; if you lose the peer connection due to an IP address change or such, it should now reconnect. Can't promise it will handle more aggressive networking issues though.

#### November 14

* I updated the native Android app for VDO.Ninja to include support for publishing into a VDO.Ninja room, and fixed a couple UI bugs, along with improved 1080p toggle support.\
  \-- Note: If using a room, you will need to still add [`&password=false`](../general-settings/password.md) (`&p=0`) to all the guests/scenes, as I haven't added password support to the native app yet.\
  \-- You can download it directly here: [https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=share\_link](https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=share\_link)\
  or in the Google Play Store:\
  [https://play.google.com/store/apps/details?id=flutter.vdo.ninja\&hl=gsw\&gl=US\&pli=1](https://play.google.com/store/apps/details?id=flutter.vdo.ninja\&hl=gsw\&gl=US\&pli=1)\
  ![](<../.gitbook/assets/image (6) (5).png>)&#x20;

#### May 27

* Got the native iOS app into the app store. (crude, but finally got it accepted.) [https://apps.apple.com/us/app/vdo-ninja/id1607609685](https://apps.apple.com/us/app/vdo-ninja/id1607609685)
* The native iOS app has the ability to turn the torch light on, and it _might_ support more than two cameras, but that's untested. It also has "screen share" support, but currently it only works within the VDO.Ninja app itself -- switching apps stops the screen capture. Overall, there's not a lot of reason to use the native app, but I'll keep it updated with new features as they become available to me.

#### May 12

* Forgot to mention this, but I did get around to pushing the Android native app version of VDO.Ninja onto the Google Play store. (took a few days for approval) [https://play.google.com/store/apps/details?id=flutter.vdo.ninja](https://play.google.com/store/apps/details?id=flutter.vdo.ninja)
* I may re-release it at some point, but I'll keep this updated until then. Please note -- this is not a feature complete version of VDO.Ninja; its bare bones.

#### February 23

* Updated the android app to android 12, added flashlight support to the android app, and patched some crashing causes. (not published yet; still have another couple things to do before that)

#### February 20

* Android app will save the last stream ID used automatically (not yet uploaded)
* Android app will show the camera preview before a user joins (not yet uploaded.) I'll upload the new android app once I finish up a few other features with it

#### February 2

* The android app was updated; minor stuff updated in the code, such as updated API endpoints, and it's been built with an updated code framework, so hopefully better support and fewer bugs. Functionality wise, the app is the same though -- camera and screen share support, but pretty basic. Same install link as before. [https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view](https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view)

#### January 14

* Added stats back into the iOS app, so they will appear in the header.
