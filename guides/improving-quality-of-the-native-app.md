---
description: Set capture quality, bitrate, frame rate, and playback buffering for the native iOS and Android apps.
---

# How to improve quality of the native app

Choose capture quality in the native app first, then check the received video. App version, capture mode, codec, network, and device temperature all affect the result. Newer builds have more specific controls than the older **Prefer 1080p** switch.

For audio, recording, USB devices, and publishing destinations, see the [native mobile app guide](../steves-helper-apps/native-mobile-app.md).

## Where do I put URL parameters?

Use **Publishing Settings** for native capture controls. Add viewer parameters to the app-generated link in the **receiving browser or OBS Browser Source**. Keep its existing stream ID, password, and connection parameters.

For normal native camera publishing to VDO.Ninja, a starting viewer link could be:

```text
https://vdo.ninja/?view=mycamera&videobitrate=6000
```

This requests about 6 Mbps. If the picture remains compressed and the phone and network have capacity, try a higher request. It is not a guaranteed received bitrate. Native iOS screen-share presets and WHIP encoders have their own limits; a larger viewer-side value cannot override them.

Browser publisher options such as `&ssq`, `&ssbitrate`, and `&contenthint` are not native-app capture controls. Adding them to a viewer link does not configure the native screen encoder. `&sharperscreen` is a [viewer-side scaling option](../advanced-settings/screen-share-parameters/and-sharperscreen.md).

## iOS screen-share quality

Select **SCREEN → Publishing Settings → iOS Screen Share Quality**. The native ReplayKit publisher has these upper targets when device resources permit:

| Mode | Resolution bound | Frame-rate ceiling | Video bitrate ceiling |
| --- | --- | --- | --- |
| Performance | 960 × 540 | 20 fps | 1800 kbps |
| Balanced | 1280 × 720 | 24 fps | 3000 kbps |
| Quality | 1280 × 720 | 30 fps | 5500 kbps |
| Maximum | 1920 × 1080 | 30 fps | 7500 kbps |

These are encoder limits, not guarantees of the received resolution, frame rate, or bitrate. The screen's aspect ratio is preserved, including portrait orientation. Resource pressure can lower the limits; **Maximum** can fall back to 720p. Codec negotiation can also limit resolution. Older builds or alternate publishing paths may differ.

For Notes, documents, and small text, try **Maximum** when you need more detail. If sharing freezes or stops, choose **Quality** or **Balanced** and restart the broadcast. A viewer request such as `&videobitrate=20000` cannot turn a 720p preset into a 1080p screen share.

Start **VDO.Ninja Screen Recorder** in Apple's broadcast picker, then open Notes or the app you want to share. Background screen broadcasting is supported. Safari on iOS cannot screen-share another app. See the [iPhone/iPad walkthrough](screen-share-your-iphone-ipad.md).

## Android capture quality

For built-in cameras, **Android video quality** offers **720p60**, **1080p30**, and **1080p60**, with a camera-support check and fallback to 1080p30 for the last option.

The selected camera determines which modes are available. USB and other source modes may use **Prefer 1080p** instead. iOS camera modes also use their available capture controls; they do not use the screen-share preset table above.

### Custom bitrate on Android

Under **Advanced Settings**, enable **Custom bitrate** and enter 100–50000 kbps. Common defaults are 6000 kbps for 720p and 10000 kbps for 1080p. iOS does not expose this same field for normal camera publishing.

Raising bitrate can preserve more detail, but increasing it on an overloaded connection can make playback less stable. Check the received result before raising it again.

## Frame-rate limits

**Advanced Settings → Maximum capture frame rate** offers **Auto**, common rates including 10 fps, and a custom whole-number ceiling from 1 to 60 fps. The saved setting applies on the next publishing session.

It applies to Android cameras, USB cameras, and screen sharing, and to iOS cameras, including their WebRTC/WHIP senders. iOS ReplayKit uses its own quality modes. A 60 fps ceiling cannot make a 30 fps source faster. For UVC input, dropping delivered frames does not necessarily reduce USB traffic or camera power use.

Lower frame rates can be useful for mostly static material. Set bitrate separately when you also want to limit upload usage.

## Minimum video bitrate

Both apps offer **Advanced Settings → Minimum video bitrate** for VDO.Ninja camera streams. **Default** keeps the normal policy. A custom value accepts 50–50000 kbps and applies on the next stream, bounded by the negotiated maximum.

This is a negotiation hint, not a guaranteed floor or data-use cap. Lower values permit more compression and may reduce freezing on weak connections; higher values favor detail but can stall on weak links. It does not change WHIP, RTMP, SRT, or native iOS screen sharing. **Use 150 kbps** fills the field; press **Apply** to save it.

## Codec selection

Start with the default codec. For direct VDO.Ninja viewing, `&codec=h264` requests H.264, which commonly has hardware acceleration on mobile devices. Both publisher and receiver must support the codec.

Do not assume `&codec=av1` or `&codec=vp9` works with every native build. The native iOS screen publisher uses a reduced-resolution VP8 compatibility fallback, so forcing VP8 can make text substantially softer. H.264 profile negotiation can also reduce a high-resolution share for a particular receiver.

WHIP services negotiate their own supported codecs. RTMP/SRT external output has separate H.264/AAC settings in **More → Advanced external output**.

## Buffering and scaling on the viewer

If playback stutters, try this on the receiving link:

```text
&buffer=500
```

This requests a 500 ms buffer target on supported viewers. It can help with jitter at the cost of latency; it does not directly sharpen text or guarantee recovery of missing frames. Normal WebRTC buffer hints are capped at 4000 ms, and the browser may apply a different delay. See [buffering and audio synchronization](../advanced-settings/view-parameters/buffer.md).

`&scale=100` disables the web viewer's automatic fit-to-window scaling requests. It does not increase native capture resolution or override the phone's encoder adaptation. Native publishers do not necessarily implement every browser scaling request. See [scale](../advanced-settings/view-parameters/scale.md).

## Check the received stream

Add `&stats` to the viewer link to inspect received resolution, frame rate, bitrate, and packet loss. The app's optional **Stream Health Overlay** is also useful, but a selected preset alone does not confirm what the viewer receives.

* Use a stable WiFi or Ethernet connection on both ends. For WiFi, compare performance near the access point.
* Check whether freezes correlate with packet loss, a bitrate drop, or the phone getting hot. Stutter alone does not establish packet loss.
* A TURN relay connection is not itself a fault. Compare measured performance before changing networks or relay settings.
* Reduce capture quality or frame rate if the phone overheats. Avoid direct sunlight and remove an insulating case if needed.
* Each direct viewer adds upload work. WHIP/WHEP distribution can be useful for larger audiences.

## Receiving in OBS

Put viewer parameters on the **Browser Source URL**. Match the source and scene layout to the received aspect ratio, especially for portrait screens, and avoid unnecessary resizing of text.

OBS's stream or recording output bitrate controls the later OBS encode; it does not set the bitrate coming from the phone. Check the VDO.Ninja feed first, then the OBS output. A sharpening filter can change perceived sharpness, but cannot restore missing detail.

For an alternative iOS workflow, connect the phone to a Mac and capture its screen through QuickTime, then share that window from the computer. The [iPhone/iPad guide](screen-share-your-iphone-ipad.md) covers that setup.
