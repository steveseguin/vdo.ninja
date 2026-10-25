---
description: Set capture quality, bitrate, frame rate, and playback buffering for the native iOS and Android apps.
---

# How to improve quality of the native app

Set capture quality in the native app first, then check what the viewer receives. App version, capture mode, codec, network, and device temperature all affect the result. Newer builds have more specific controls than the older **Prefer 1080p** switch. For audio, recording, USB devices, and publishing destinations, see the [native mobile app guide](../steves-helper-apps/native-mobile-app.md).

## Where settings go

Native capture controls are in the app's **Publishing Settings**. Viewer parameters go on the app-generated link in the **receiving browser or OBS Browser Source**. Keep the link's stream ID, password, and connection parameters.

For normal native camera publishing to VDO.Ninja, start with:

```text
https://vdo.ninja/?view=mycamera&videobitrate=6000
```

This requests about 6 Mbps; it does not guarantee it. If the picture stays compressed and the phone and network have capacity, try a higher request. Native iOS screen-share presets and WHIP encoders have their own limits that a viewer-side value cannot override.

Browser publisher options such as `&ssq`, `&ssbitrate`, and `&contenthint` are not native-app capture controls; adding them to a viewer link does not configure the native screen encoder. `&sharperscreen` is a [viewer-side scaling option](../advanced-settings/screen-share-parameters/and-sharperscreen.md).

## iOS screen-share quality

Select **SCREEN → Publishing Settings → iOS Screen Share Quality**. The native ReplayKit publisher has these upper targets when device resources permit:

| Mode | Resolution bound | Frame-rate ceiling | Video bitrate ceiling |
| --- | --- | --- | --- |
| Performance | 960 × 540 | 20 fps | 1800 kbps |
| Balanced | 1280 × 720 | 24 fps | 3000 kbps |
| Quality | 1280 × 720 | 30 fps | 5500 kbps |
| Maximum | 1920 × 1080 | 30 fps | 7500 kbps |

These are encoder limits, not guaranteed results. The screen's aspect ratio is preserved, including portrait. Resource pressure can lower the limits, **Maximum** can fall back to 720p, and codec negotiation can also limit resolution. Older builds or other publishing paths may differ.

For Notes, documents, and small text, try **Maximum**. If sharing freezes or stops, choose **Quality** or **Balanced** and restart the broadcast. A viewer request such as `&videobitrate=20000` cannot turn a 720p preset into a 1080p share.

Broadcasting continues while you switch to Notes or another app. Safari on iOS cannot screen-share another app. See the [iPhone/iPad walkthrough](screen-share-your-iphone-ipad.md).

## Android capture quality

For built-in cameras, **Android video quality** offers **720p60**, **1080p30**, and **1080p60**. The last one checks camera support and falls back to 1080p30. The selected camera determines which modes appear, and USB and other source modes may use **Prefer 1080p** instead. iOS camera modes use their own capture controls, not the screen-share table above.

Under **Advanced Settings**, enable **Custom bitrate** and enter 100–50000 kbps. Common defaults are 6000 kbps for 720p and 10000 kbps for 1080p. iOS does not have this field for normal camera publishing. More bitrate can preserve detail, but on an overloaded connection it can make playback less stable, so check the received result before raising it again.

## Frame-rate limits

**Advanced Settings → Maximum capture frame rate** offers **Auto**, common rates including 10 fps, and a custom whole-number ceiling from 1 to 60 fps. It applies on the next publishing session.

It covers Android cameras, USB cameras, and screen sharing, and iOS cameras including their WebRTC/WHIP senders. iOS ReplayKit uses its own quality modes. A 60 fps ceiling cannot make a 30 fps source faster, and for UVC input, dropping delivered frames does not necessarily reduce USB traffic or camera power use. Lower frame rates suit mostly static material; set bitrate separately to limit upload.

## Minimum video bitrate

Both apps have **Advanced Settings → Minimum video bitrate** for VDO.Ninja camera streams. **Default** keeps the normal policy. A custom value of 50–50000 kbps applies on the next stream, bounded by the negotiated maximum. **Use 150 kbps** fills the field; press **Apply** to save it.

It is a negotiation hint, not a guaranteed floor or data cap. Lower values allow more compression and may reduce freezing on weak connections; higher values favor detail but can stall on weak links. It does not change WHIP, RTMP, SRT, or native iOS screen sharing.

## Codec selection

Start with the default codec. For direct VDO.Ninja viewing, `&codec=h264` requests H.264, which commonly has hardware acceleration on mobile devices. Both publisher and receiver must support the codec.

Do not assume `&codec=av1` or `&codec=vp9` works with every native build. The native iOS screen publisher uses a reduced-resolution VP8 compatibility fallback, so forcing VP8 can make text much softer. H.264 profile negotiation can also reduce a high-resolution share for some receivers. WHIP services negotiate their own codecs, and RTMP/SRT external output has separate H.264/AAC settings in **More → Advanced external output**.

## Buffering and scaling on the viewer

If playback stutters, add `&buffer=500` to the receiving link. It requests a 500 ms buffer target on supported viewers, which can smooth jitter at the cost of latency. It does not sharpen text or guarantee that missing frames are recovered. Normal WebRTC buffer hints are capped at 4000 ms, and the browser may apply a different delay. See [buffering and audio synchronization](../advanced-settings/view-parameters/buffer.md).

`&scale=100` turns off the web viewer's automatic fit-to-window scaling requests. It does not raise native capture resolution or override the phone's encoder adaptation, and native publishers may not honor every browser scaling request. See [scale](../advanced-settings/view-parameters/scale.md).

## Check the received stream

Add `&stats` to the viewer link to see the received resolution, frame rate, bitrate, and packet loss. The app's optional **Stream Health Overlay** also helps, but a selected preset alone does not show what the viewer receives.

* Use stable WiFi or Ethernet on both ends. On WiFi, compare results near the access point.
* Check whether freezes line up with packet loss, a bitrate drop, or the phone getting hot. Stutter alone does not prove packet loss.
* A TURN relay connection is not a fault by itself. Compare measured performance before changing networks or relay settings.
* If the phone overheats, lower capture quality or frame rate, avoid direct sun, and remove an insulating case.
* Each direct viewer adds upload work. WHIP/WHEP distribution can help with larger audiences.

## Receiving in OBS

Put viewer parameters on the **Browser Source URL**. Match the source and scene to the received aspect ratio, especially for portrait screens, and avoid resizing text unnecessarily.

OBS's stream or recording bitrate controls the later OBS encode, not the bitrate coming from the phone. Check the VDO.Ninja feed first, then the OBS output. A sharpening filter can change perceived sharpness but cannot restore missing detail.

On iOS, you can also connect the phone to a Mac, capture its screen through QuickTime, and share that window from the computer. The [iPhone/iPad guide](screen-share-your-iphone-ipad.md) covers that setup.
