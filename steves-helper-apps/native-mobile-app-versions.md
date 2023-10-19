---
description: Where do I find the native mobile app versions?
---

# Native mobile app versions

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

There are some limitations to the native mobile app versions though.

* Rooms and group chat are not supported yet.
* Passwords are not supported yet.
* UVC camera and mic support is not yet available, but we're working on it. UVC devices are supported via the Raspberry Pi and Nvidia Jetson devices however (see bottom).
* The native app requires a modern version of Android, while the web-based version of VDO.Ninja has been tested with Android 5.1 using Chrome.

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
While screen share support is available in-app, it currently only works when the app is open, making it a bit useless if you need to switch apps. If you're looking to screen-share from an iPhone or iPad with VDO.Ninja, other ways to do it exist.  See this guide here:&#x20;

{% embed url="https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad" %}
How to screen capture your iPhone or iPad with VDO.Ninja
{% endembed %}

Room support and passwords are not supported yet in the native mobile apps.

## Updates

{% content-ref url="../updates/updates-native-mobile-apps.md" %}
[updates-native-mobile-apps.md](../updates/updates-native-mobile-apps.md)
{% endcontent-ref %}

## Related

{% content-ref url="../guides/how-to-improve-quality-of-the-native-app.md" %}
[how-to-improve-quality-of-the-native-app.md](../guides/how-to-improve-quality-of-the-native-app.md)
{% endcontent-ref %}
