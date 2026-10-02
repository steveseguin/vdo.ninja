---
description: VDO.Ninja mobile apps for Android and iPhone or iPad, including local recording, screen recording, USB audio, and advanced mobile camera workflows.
---

# VDO.Ninja native mobile apps for Android and iPhone or iPad

VDO.Ninja also offers native Android and iOS apps for mobile capture workflows. These apps are useful if you want phone-to-OBS video, mobile screen recording, local recording, USB microphone support, or mobile-specific camera features such as ultra-wide lenses and dual-camera capture.

Use the [native app guide](native-mobile-app.md) for setup and the [quality guide](../guides/improving-quality-of-the-native-app.md) for the current controls. Menus vary by installed app version and capture mode; older builds may not include every option below.

{% embed url="https://play.google.com/store/apps/details?id=flutter.vdo.ninja" %}
Android
{% endembed %}

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}
iOS
{% endembed %}

## Current feature highlights

Both native apps support:

* local recording
* mobile screen sharing and recording, subject to platform capture restrictions
* improved USB audio support, including support that helps with external microphones such as DJI mics
* ultra-wide camera support
* Social Stream Ninja integration for live chat and TTS workflows
* an audio-only talkback channel, so the phone can hear a remote director or OBS output while streaming
* WHIP publishing and WHEP viewer delivery, including services such as Meshcast
* opt-in professional camera controls and a stream-health overlay
* capture frame-rate limits and an advanced minimum-bitrate hint for VDO.Ninja camera streams
* optional experimental RTMP/SRT output from supported video sources, with separate encoder controls

Android-specific highlights:

* USB video and UVC capture support
* expanded camera selection options
* a gallery for reviewing and deleting recorded clips
* built-in camera presets for 720p60, 1080p30, and 1080p60 with device-dependent fallback
* a custom bitrate setting in Advanced Settings
* screen sharing with optional system audio on Android 10+ and single-app selection on supported Android 14+ devices

iOS-specific highlights:

* dual-camera mixing mode using front and rear cameras together
* continued USB microphone support improvements
* background ReplayKit screen sharing with Performance, Balanced, Quality, and Maximum presets; Maximum targets up to 1080p when resources permit
* ReplayKit app audio and microphone narration with separate mute controls
* optional front- or rear-camera Picture in Picture while screen sharing on supported devices
* RTMP/SRT output from single-camera sources, including an opt-in adaptive bitrate control for RTMP

## Current limitations

* The native apps remain focused on capture and publish workflows rather than replacing the full browser-based director and viewer experience.
* Platform restrictions still apply to some mobile screen-sharing behaviors, especially on older iOS versions.
* Native iOS screen sharing uses its generated viewer link or WHIP destination; its direct publishing path does not join rooms.
* iOS does not expose USB/UVC camera input. External USB audio support is separate.
* iOS RTMP/SRT output does not support screen sharing, microphone-only mode, or dual-camera mode. The external output does not support RTMPS or SRTLA.

## Android downloads

The Google Play version is the preferred install path:

{% embed url="https://play.google.com/store/apps/details?id=flutter.vdo.ninja" %}
Google Play Store
{% endembed %}

For testing newer Android builds before Play Store rollout, a direct APK may also be provided:

{% embed url="https://drive.google.com/file/d/1cVZPklsdrurpT7GEX2w_igRRGpt0PnAL/view?usp=drive_link" %}
Android test APK link
{% endembed %}

Public reference source:

{% embed url="https://github.com/steveseguin/vdon_flutter/" %}
Public native-app repository; it may lag current distributed builds
{% endembed %}

## iOS download

{% embed url="https://apps.apple.com/us/app/vdo-ninja/id1607609685" %}
Apple App Store
{% endembed %}

The App Store version history includes screen-share quality controls, ReplayKit app-audio improvements, camera overlay support, professional camera controls, and RTMP/SRT output. Use the store's version history to check which changes are included in the build available to your device.

## Notes

* Codec availability varies by publishing path. Native iOS screen sharing has a lower-resolution VP8 compatibility fallback; forcing it can reduce text clarity.
* Older versions of iOS have more restrictions around screen recording and screen broadcast behavior.
* USB device behavior still depends on the phone, OS version, adapters, and vendor firmware.

## Related

{% content-ref url="native-mobile-app.md" %}
[native-mobile-app.md](native-mobile-app.md)
{% endcontent-ref %}

{% content-ref url="../guides/improving-quality-of-the-native-app.md" %}
[improving-quality-of-the-native-app.md](../guides/improving-quality-of-the-native-app.md)
{% endcontent-ref %}

{% content-ref url="../updates/updates-native-mobile-apps.md" %}
[updates-native-mobile-apps.md](../updates/updates-native-mobile-apps.md)
{% endcontent-ref %}
