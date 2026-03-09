---
description: VDO.Ninja mobile apps for Android and iPhone or iPad, including local recording, screen recording, USB audio, and advanced mobile camera workflows.
---

# VDO.Ninja native mobile apps for Android and iPhone or iPad

VDO.Ninja also offers native Android and iOS apps for mobile capture workflows. These apps are useful if you want phone-to-OBS video, mobile screen recording, local recording, USB microphone support, or mobile-specific camera features such as ultra-wide lenses and dual-camera capture.

These native apps are still more focused than the full browser experience, but they now cover a useful set of mobile production tasks.

{% embed url="https://play.google.com/store/apps/details?id=flutter.vdo.ninja" %}
Android
{% endembed %}

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}
iOS
{% endembed %}

## Current feature highlights

Both native apps support:

* local recording
* screen recording
* improved USB audio support, including support that helps with external microphones such as DJI mics
* ultra-wide camera support
* Social Stream Ninja integration for live chat and TTS workflows
* an audio-only talkback channel, so the phone can hear a remote director or OBS output while streaming

Android-specific highlights:

* USB video and UVC capture support
* expanded camera selection options
* a gallery for reviewing and deleting recorded clips

iOS-specific highlights:

* dual-camera mixing mode using front and rear cameras together
* continued USB microphone support improvements

## Current limitations

* The native apps remain focused on capture and publish workflows rather than replacing the full browser-based director and viewer experience.
* Platform restrictions still apply to some mobile screen-sharing behaviors, especially on older iOS versions.

## Android downloads

The Google Play version is the preferred install path:

{% embed url="https://play.google.com/store/apps/details?id=flutter.vdo.ninja" %}
Google Play Store
{% endembed %}

For testing newer Android builds before Play Store rollout, a direct APK may also be provided:

{% embed url="https://drive.google.com/file/d/1cVZPklsdrurpT7GEX2w_igRRGpt0PnAL/view?usp=drive_link" %}
Current Android test APK noted March 1, 2026
{% endembed %}

Source code:

{% embed url="https://github.com/steveseguin/vdon_flutter/" %}
GitHub repository for the native app project
{% endembed %}

## iOS download

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}
Apple App Store
{% endembed %}

The iOS build approved on March 1, 2026 includes ultra-wide camera support in addition to the newer dual-camera and local-recording improvements already noted above.

## Notes

* If a mobile hardware encoder is unstable for screen sharing or playback, testing `&codec=vp8` on the receiving side can still help in some cases.
* Older versions of iOS have more restrictions around screen recording and screen broadcast behavior.
* USB device behavior still depends on the phone, OS version, adapters, and vendor firmware.

## Related

{% content-ref url="../guides/improving-quality-of-the-native-app.md" %}
[improving-quality-of-the-native-app.md](../guides/improving-quality-of-the-native-app.md)
{% endcontent-ref %}

{% content-ref url="../updates/updates-native-mobile-apps.md" %}
[updates-native-mobile-apps.md](../updates/updates-native-mobile-apps.md)
{% endcontent-ref %}
