---
description: Set up a 4K browser camera feed, choose a viewing bitrate, and check the received picture.
---

# How to stream 4K video using VDO.Ninja

You need a camera that offers 3840x2160 to the browser, an encoder that can keep up, and enough upload bandwidth. A camera's ability to record 4K locally does not guarantee 4K browser streaming.

Start with one camera and one viewer. If playback stutters or the device gets hot, use 1080p instead.

## Pushing 4K resolution

1. On the sending computer, open a VDO.Ninja camera link with `&width=3840&height=2160` added.
2. Select the 4K camera and microphone, then start the stream.
3. On the receiving computer, open the matching viewer link with `&scale=100&videobitrate=20000` added.
4. Check moving video and sound. Make a short recording in your receiving application and play it back.

Replace `YOUR_ID` with your own unique stream ID in both links:

**Sender:** `https://vdo.ninja/?push=YOUR_ID&width=3840&height=2160`

**Viewer:** `https://vdo.ninja/?view=YOUR_ID&scale=100&videobitrate=20000`

Keep any password and other settings from your original links. These URL settings apply to browser capture, not the native mobile app's camera settings.

![4K compared with lower video resolutions](../.gitbook/assets/4KComparison)

## What about the bitrate?

`videobitrate=20000` requests **20 Mbps** of video. Treat it as a starting point, not a guaranteed requirement or result. Fast motion can need more bandwidth; text or a still scene can need less.

Raise the target only if the sender has spare upload capacity and playback remains stable. Each direct viewer adds upload traffic. See [bitrate and quality settings](how-do-i-control-bitrate-quality.md).

## Scaling

`&scale=100` asks the sender to keep full resolution even when the viewing window is small. Network or encoder limits can still reduce the received resolution or frame rate.

### Codec

Start with the default codec. If the sender cannot keep up, try [`&codec=h264`](../advanced-settings/view-parameters/codec.md#h264) on the viewer link to request H.264. Hardware acceleration depends on the device and browser.

### Smartphones

Use the [VDO.Ninja native app](../steves-helper-apps/native-mobile-app.md) for its camera choices and controls. Choose a supported quality mode in [Publishing Settings](improving-quality-of-the-native-app.md). More lens choices do not guarantee 4K capture.

For browser capture, try the links above. If the camera cannot provide 4K, use a lower resolution. The phone's built-in camera app may have access to modes that its browser does not.

## Performance issues

* **Camera will not start or says "over-constrained":** the requested capture mode is unavailable. Try `&width=1920&height=1080` on the sender.
* **Picture is sharp when still but breaks up in motion:** check upload capacity and the viewer's bitrate setting.
* **Frame rate drops or the device gets hot:** lower resolution or frame rate and close unused viewers. See [overheating](../common-errors-and-known-issues/overheating.md).
* **The received picture is smaller than 4K:** keep `&scale=100` on the viewer and check network and encoder load.

## How VDO.Ninja handles video quality

For lower-resolution browser capture, [`&quality`](../advanced-settings/video-parameters/and-quality.md) offers presets: `0` targets 1080p, `1` targets 720p, and `2` targets 360p. Explicit width and height request a specific capture size; unsupported sizes can prevent capture from starting.
