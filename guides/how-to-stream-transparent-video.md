---
description: Stream transparent video to VDO.Ninja using Spout2 and Game Capture, WebP mode, or chroma keying, including VTuber avatar output for OBS.
---

# How to stream transparent video

You can stream a transparent avatar, graphics source, or WebM overlay with VDO.Ninja, although the correct workflow depends on the sender and receiver.

The most practical high-frame-rate Windows workflow is a Spout2 source through Game Capture into the Ninja OBS Plugin. Browser-only workflows remain more limited.

## Spout2 through Game Capture (Windows)

Game Capture can receive transparent Spout2 output from VTube Studio, Warudo, VSeeFace, VNyan, and similar Windows avatar or graphics apps, then publish it through VDO.Ninja.

1. Enable Spout or Spout2 output in the source app.
2. In Game Capture, choose **Spout2 (avatar apps)** and select its sender.
3. Choose **VP9 (OBS Alpha Preview)** and enable the alpha workflow.
4. In OBS, add a **VDO.Ninja Source** with the [Ninja OBS Plugin](../steves-helper-apps/ninja-obs-plugin.md) and enable **Use Native Receiver (Experimental)**.

This path sends separate VP9 color and alpha tracks. OBS Browser Sources and normal browser viewers do not composite the alpha track. If true VP9 alpha uses too much CPU, use **Alpha Background → Chroma background** with H.264/NVENC and remove that color with a chroma-key filter.

Spout2 carries video only, so choose audio separately in Game Capture. If a sender appears black, set the source app and Game Capture to the same GPU in Windows Graphics settings.

See [Using Game Capture and Spout2 with VDO.Ninja](using-game-capture-with-vdo.ninja.md) for the complete setup and troubleshooting guide.

Other available methods are listed below.

## Webp-mode supports transparency

[`&webp`](../advanced-settings/view-parameters/webp.md) mode send webp images, which supports transparencies, instead of streaming video, which current does not support transparencies. It does however require quite a bit of CPU and network bandwidth, so its recommend to use low frame rates and low resolutions to avoid problems.

### Sending a video file via webp-mode

With this option, you can select a video file locally that contains a transparent background. WebM file formats support transparent backgrounds and can be opened by the browser.

[`&webp`](../advanced-settings/view-parameters/webp.md) mode supports transparency as noted, so we need to include that on the sender link. We also need to include `&alpha`, to tell the system that we want to include alpha channels (transparency), if possible.

[https://vdo.ninja/alpha/?webp\&push=rPJ5bEb\&fileshare\&alpha](https://vdo.ninja/alpha/?webp\&push=rPJ5bEb\&fileshare\&alpha)

On the viewer side, we can add [`&codec=webp`](../advanced-settings/view-parameters/codec.md#webp) to tell the system we want to pull the video stream as a webp series of images, rather than normal video. Images will transparencies will automatically include them in the display.

[https://vdo.ninja/alpha/?view=rPJ5bEb\&codec=webp](https://vdo.ninja/alpha/?view=rPJ5bEb\&codec=webp)

### Transparent webcam background via webp-mode

As with the above example, you can also send a webcam feed of a person, with their background removed.

Like above, we need to include `&alpha` and [`&webp`](../advanced-settings/view-parameters/webp.md), but we also need need to include [`&effects=5`](../source-settings/effects.md).

The goal here is to remove the background using the VDO.Ninja background removal tool, and then use a transparent image as the background, instead of a normal virtual background image. In the link below, we include a transparent pixel in the URL, so no external file is needed.

[https://vdo.ninja/alpha/?webp\&push=rPJ5bEb\&effects=5\&alpha\&webcam\&imagelist=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII%3D](https://vdo.ninja/alpha/?webp\&push=rPJ5bEb\&effects=5\&alpha\&webcam\&imagelist=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII%3D)

And like before, to view this stream with transparencies, we need to include [`&codec=webp`](../advanced-settings/view-parameters/codec.md#webp) on the view link.

[https://vdo.ninja/alpha/?view=rPJ5bEb\&codec=webp](https://vdo.ninja/alpha/?view=rPJ5bEb\&codec=webp)

This option is highly CPU intensive though; I'd recommend at least a fast 8-core system for this option, as you are doing both AI and heavy image processing workloads.

## Green screening

As with the above option, you can use the digital background effect ([`&effects=4`](../source-settings/effects.md), in this case) to replace your background in VDO.Ninja with a green solid color.

If using an application like OBS or vMix, during playback of the stream you can use a Chroma filter to remove the green background.

This option is pretty standard, and since it streams actual video instead of motion images, you can reduce CPU load, network bandwidth usage, maintain high frame rates, and achieve higher resolutions. There might be some green fringing on the final result, but there are ways to reduce that effect.\
\
<img src="../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png" alt="" data-size="original">![](<../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

Another benefit of green screening is you can use an actual physical green screen as well. And this would work without needing AI effects and it would work on anything; not just a person.

When green screening, since color is so important, try using [`&codec=av1`](../advanced-settings/view-parameters/codec.md#av1) as well on the playback view link, as the AV1 codec tends to preserve colors better than [`&codec=h264`](../advanced-settings/view-parameters/codec.md#h264) or [`&codec=vp8`](../advanced-settings/view-parameters/codec.md#vp8), which are normally the defaults. With better colors, it should be easier to chroma-key out the green.

## Chunked mode - partially working

VDO.Ninja has a mode called Chunked, which can be activated on Chromium browsers by adding [`&chunked`](../newly-added-parameters/and-chunked.md) to the push URL.

When also used with `&alpha`, i.e.:

&#x20;[`https://vdo.ninja/alpha/?chunked&alpha`](https://vdo.ninja/alpha/?chunked\&alpha)

it will tell the browser to only select video codecs that can encode alpha channels. Normal WebRTC video streaming doesn't support alpha channels, but the chunked mode does. However, if no codec is available in your browser with alpha-channel support, then the chunked mode will fail or default back to a codec that doesn't support alpha channels.

At present, no codecs in Chrome seem to support alpha channels, but when that changes the feature will be automatically available for us.

### Browser capture limitations

Virtual cameras and browser screen sharing normally do not include alpha channels. For example, screen sharing the [Electron Capture app](../steves-helper-apps/electron-capture.md) may turn its transparent background black. On Windows, use the direct Spout2-to-Game-Capture workflow above when the source app supports Spout output.

I'm hoping this isn't the case in the future with Chrome and other Chromium browsers, but I'm not entirely sure.

### Raspberry.Ninja and OBS WHIP output - future possiblities

I've not really sure about this, but you can force video into [Raspberry.Ninja](../steves-helper-apps/raspberry.ninja/), with transparent backgrounds, and VDO.Ninja will play them back. In my previous testing, Chrome refused to play back transparent video streams from Raspberry.Ninja with transparencies, dropping them for black backgrounds instead, but this might change in the future.

If this does change, you might then be able to use OBS as well for streaming transparent video to VDO.Ninja. Or perhaps you'll be able to go from Raspberry.Ninja into OBS via WHEP at some point, but these are all not yet available and are likely years away from being materialized.
