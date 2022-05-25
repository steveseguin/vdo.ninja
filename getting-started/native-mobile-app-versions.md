---
description: Where do I find the native mobile app versions?
---

# Native mobile app versions

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

### The **Google Play Store** <img src="../.gitbook/assets/image (116).png" alt="" data-size="line"> hosted version is here:&#x20;



{% embed url="https://play.google.com/store/apps/details?id=flutter.vdo.ninja" %}

### &#x20;[https://play.google.com/store/apps/details?id=flutter.vdo.ninja](https://play.google.com/store/apps/details?id=flutter.vdo.ninja)  _(It will auto-update when I push new releases.)_ 

As well, the Android APK file for direct-downloading is hosted here:

{% embed url="https://drive.google.com/file/d/1M0kv5nWLtcfl2JOnsAGiG1zUmkeIVLyZ/view?usp=sharing" %}
Download the APK directly from Google Drive, without using the Google Play store\
_(Manually installing will requires manual updating, as well.  APK last updated May 12, 2022)_
{% endembed %}

\
Source-code for building the Android app is here:

{% embed url="https://github.com/steveseguin/vdon_flutter/" %}



### iOS Download Link _****** **<mark style="color:red;">**\[currently not available]**</mark>_

If looking to screen-share from an iPhone or iPad, there is a guide on how to do so here: [https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad](https://docs.vdo.ninja/guides/screen-share-your-iphone-ipad)

The native app for iOS is not currently available, but it will be back soon.

{% embed url="https://testflight.apple.com/join/KnzvY7JO" %}
There is a BETA version of the iOS app available on request, but it lacks screen-share support currently.
{% endembed %}

### Raspberry Pi system images (and code)

If you have a Raspberry Pi, Nvidia Jetson, or a Linux system, you can use those devices to connect UVC-compatible cameras and microphones to VDO.Ninja. This is much cheaper than using a mobile phone and this solution won't overheat when streaming 1080p video after hours. The code is written in Python, so it is accessible for novice developers to use.

{% embed url="https://github.com/steveseguin/raspberry_ninja" %}
Stream live video from your embedded SBC or Linux system!
{% endembed %}
