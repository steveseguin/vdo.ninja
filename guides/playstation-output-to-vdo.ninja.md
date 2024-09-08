---
description: Streaming PlayStation Output to VDO.Ninja
---

# PlayStation Output to VDO.Ninja

### Method 1: Browser-Compatible Capture Card

Some HDMI capture cards work directly with browsers, allowing you to bypass OBS entirely:

1. Connect your PlayStation to a browser-compatible capture card
2. Plug the capture card into your computer
3. In VDO.Ninja:
   * Select "Add your Camera"
   * Choose the capture card as your video source

This method offers a streamlined setup with low latency and high quality.

### Method 2: PS Remote Play with Screen Sharing

For a hardware-free solution:

1. Install PS Remote Play on your computer
2. Connect your PlayStation to PS Remote Play
3. In VDO.Ninja:
   * Select "Share Your Screen"
   * Choose to share the PS Remote Play window
   * Optionally select system audio to share game sound

This approach is simple but may have slightly higher latency.

### Method 3: Capture Card with OBS Virtual Camera

For capture cards not directly compatible with browsers:

1. Connect your PlayStation to the capture card
2. In OBS Studio:
   * Add a "Video Capture Device" source for your capture card
   * Start the OBS Virtual Camera
3. In VDO.Ninja:
   * Select "Add your Camera"
   * Choose the OBS Virtual Camera as your video source

This method allows for more advanced stream customization but adds an extra step.

### Additional Considerations

* HDMI Splitters: If you want to play on a TV while streaming, use an HDMI splitter to send the signal to both your capture device and TV.
* Audio Routing: Consider using a virtual audio cable to route game audio to VDO.Ninja if not captured by your chosen method.
* Latency: Browser-compatible capture cards generally offer the lowest latency when used directly with VDO.Ninja.
* Quality Settings: Experiment with VDO.Ninja's bitrate and resolution settings for optimal performance.

By leveraging VDO.Ninja's browser-based capabilities, you can often achieve a simpler setup with compatible capture cards, while still having the flexibility to use OBS when needed for more complex streaming scenarios.
