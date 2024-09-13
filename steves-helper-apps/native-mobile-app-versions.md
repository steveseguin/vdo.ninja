---
description: Where do I find the native mobile app versions?
---

# Native mobile app versions

VDO.Ninja is primarily a web/browser-based app, however there are also basic mobile app versions available that support simple one-way audio and video publishing. Some users may prefer them, however they are feature limited.

{% embed url="https://play.google.com/store/apps/details?id=flutter.vdo.ninja" %}
Android
{% endembed %}

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}
iOS
{% endembed %}

At present, the native mobile app versions of VDO.Ninja are fairly basic, but they can be useful for a couple of reasons.

* The native Android app supports screen-sharing, while the browser-based version of VDO.Ninja does not.
* More camera types are listed on the Android native app version; some wide-angle lenses appear that do not appear in the browser-based version.
* Sometimes the native mobile app will work when the browser-based versions do not.
* Additional UVC/HDMI support is available experimentally for Android.

There are some limitations to the native mobile app versions though.

* You can only publish with the mobile apps; you cannot view or listen to remote guests
* UVC camera and mic support is not fully supported yet, but we're working on it. UVC devices are supported via the Raspberry Pi and Nvidia Jetson devices however (see bottom).
* The native app requires a modern version of Android, while the web-based version of VDO.Ninja has been tested with Android 5.1 using Chrome.
* Older iPhones cannot screen share

### UVC / USB support

Some users with iPhone 15 Pro devices or newer mention USB devices working with VDO.Ninja, perhaps via Safari, but I do not own one to test with.

As per Android, this is a custom version of VDO.Ninja that supports USB video input (such as HDMI to USB). It's basic, and USB audio capture doesn't work, and Android 14 support hasn't been added yet, but give it a go.

{% embed url="https://drive.google.com/file/d/1L8meslXPEzivocH3wz48abNtJ926hQUr/view?usp=drive_link" %}
Andorid APK with USB-support; beta
{% endembed %}

## Download the Android app

You have a few different ways to download and install the Android app for VDO.Ninja. Installing the Google Play Store version is recommended, as it can auto-update with patches and new features automatically.

#### The **Google Play Store** <img src="../.gitbook/assets/image (116) (1).png" alt="" data-size="line"> hosted version is here:&#x20;

{% embed url="https://play.google.com/store/apps/details?id=flutter.vdo.ninja" %}
_(It will auto-update when I push new releases.)_
{% endembed %}

You can also download and install the Android APK file manually:

{% embed url="https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=sharing" %}
Download the APK directly from Google Drive, without using the Google Play store\
_(Manually installing will requires manual updating, as well.  APK last updated May 12, 2022)_
{% endembed %}

Lastly, you can also download the source-code for the Android app, allowing you to build and install the app yourself.

{% embed url="https://github.com/steveseguin/vdon_flutter/" %}
GitHub repository for the app
{% endembed %}

## Download the iOS app

The native iOS app for VDO.Ninja is again available on the Apple App Store.&#x20;

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}
Download from the Apple App Store - It's Free
{% endembed %}

The native App Store app is very basic, but It does support the ability to stream your camera's output to a remote computer, with the option to enable the Torch light.\
\
While screen share support is available in-app, it currently only works when the app is open for some users, making it a bit useless if you need to switch apps. If you're looking to screen-share from an iPhone or iPad with VDO.Ninja, other ways to do it exist.  See this guide here:&#x20;

{% embed url="https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad" %}
How to screen capture your iPhone or iPad with VDO.Ninja
{% endembed %}

Also note, screen sharing on iOS will not work if using iOS 15 or older. Please upgrade to iOS 17 or newer if using the native app.

## USB / Lightning based audio

USB-based microphones do not work normally.  You can solve this with a TRRS adapter in cases where USB or lightning fails.  I have a video about it here:

{% embed url="https://www.youtube.com/watch?v=BBus_S8iJUE" %}

## Other Problems?

A common problem when using the native application is that the video doens't play when screen sharing.\
\
Try adding \&codec=vp8 to the view-link, as sometimes the phone's h264 harware encoder fails or is unable to support the input video resolution.

If on iOS, screen sharing won't work on older versions of iOS. Please update to the newest version.

You cannot capture the desktop/system audio when screen sharing -- just the microphone's audio. I realize many users want this addressed, however at present I figured out how to get this working.

## Raspberry Ninja

If the mobile app versions of VDO.Ninja do not achieve what you want, there is a Linux / Windows WSL / Apple and embedded-friendly version of VDO.Ninja called Rasberry Ninja.\
\
It supports publishing and viewing videos, VDO.Ninja to NDI support, raw stream recording, built-in multiviewer SFU broadcasting,  and doesn't require a browser. It will work with hardware encoders, CSI-based cameras, and can work on even an extremely basic Raspberry Pi Zero W.

{% embed url="https://raspberry.ninja" %}
Check out Raspberry Ninja if you need more flexiblity and don't want to use the browser
{% endembed %}

## Updates

{% content-ref url="../updates/updates-native-mobile-apps.md" %}
[updates-native-mobile-apps.md](../updates/updates-native-mobile-apps.md)
{% endcontent-ref %}

## Related

{% content-ref url="../guides/improving-quality-of-the-native-app.md" %}
[improving-quality-of-the-native-app.md](../guides/improving-quality-of-the-native-app.md)
{% endcontent-ref %}
