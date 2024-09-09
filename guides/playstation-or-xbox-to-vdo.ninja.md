---
description: Streaming PlayStation or Xbox Output to VDO.Ninja
---

# PlayStation or Xbox to VDO.Ninja

This guide covers different methods for sharing your console gameplay through VDO.Ninja. VDO.Ninja allows you to easily share high-quality, low-latency video streams with others online.

### Method 1: Browser-Compatible Capture Card

Some HDMI capture cards work directly with browsers, allowing you to bypass OBS entirely:

1. Connect your PlayStation or Xbox to a browser-compatible capture card
2. Plug the capture card into your computer
3. In VDO.Ninja:
   * Select "Add your Camera"
   * Choose the capture card as your video source

This method offers a streamlined setup with low latency and high quality.

### Method 2: PS Remote Play with Screen Sharing

For a hardware-free solution:

#### PlayStation:

1. Install PS Remote Play on your computer
2. Connect your PlayStation to PS Remote Play
3. In VDO.Ninja:
   * Select "Share Your Screen"
   * Choose to share the PS Remote Play window
   * Optionally select system audio to share game sound

#### Xbox:

1. Install the Xbox app on your Windows 10 or 11 PC
2. Connect your Xbox to the Xbox app using Remote Play
3. In VDO.Ninja:
   * Select "Share Your Screen"
   * Choose to share the Xbox app window
   * Optionally select system audio to share game sound

This approach is simple but may have slightly higher latency.

### Method 4: Xbox-Specific Streaming (Windows 10/11 Only)

Xbox offers a built-in streaming feature for Windows 10 and 11 users:

1. Press the Windows key + G to open the Xbox Game Bar
2. Click on "Capture" and select "Start Recording"
3. In VDO.Ninja:
   * Select "Share Your Screen"
   * Choose to share the game window or entire screen
   * Ensure system audio is selected to share game sound

This method provides good quality and relatively low latency for Xbox users.

Remember to adjust your console's privacy and streaming settings to enable remote play and streaming features.

### Method 5: Capture Card with OBS Virtual Camera

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
  * Some HDMI capture devices have an HDMI pass-through option, which can be used in place of an HDMI splitter.
* Audio Routing: Consider using a virtual audio cable to route game audio to VDO.Ninja if not captured by your chosen method
* Latency: Browser-compatible capture cards generally offer the lowest latency when used directly with VDO.Ninja.
  * Some HDMI to USB capture devices are only compatible with OBS Studio and not the browser; a browser-compatible device is suggested.
* Quality Settings: Experiment with VDO.Ninja's bitrate and resolution settings for optimal performance.

By leveraging VDO.Ninja's browser-based capabilities, you can often achieve a simpler setup with compatible capture cards, while still having the flexibility to use OBS when needed for more complex streaming scenarios.\


## HDMI Splitter / pass-thru considerations

When considering HDMI splitters with pass-through for 4K content, it's important to understand their compatibility with various resolutions and frame rates:

### 4K Resolution and Frame Rate Compatibility

HDMI splitters with pass-through for 4K content typically support the following:

* 4K resolution (3840 x 2160 pixels)
* Frame rates up to 60fps for 4K content

However, compatibility can vary depending on the specific splitter model and HDMI version.

### Key Considerations

### HDMI Version

* HDMI 2.0 supports 4K at 60fps
* HDMI 1.4 supports 4K at 30fps

Ensure your splitter uses the appropriate HDMI version for your desired resolution and frame rate.

### Bandwidth

4K content requires significant bandwidth, especially at higher frame rates. Look for splitters that support:

* 18 Gbps bandwidth for 4K60 HDR
* 10.2 Gbps bandwidth for 4K30

### HDR Support

If you want to pass through HDR content, make sure the splitter explicitly supports it.

### HDCP Compatibility

For copy-protected content, ensure the splitter is compatible with HDCP 2.2 or later.

### Trade-offs

When using a splitter with pass-through, be aware of potential trade-offs:

* Some splitters may introduce slight latency
* Lower-quality splitters might degrade signal quality

### Recommendations

1. Choose a splitter that matches or exceeds your highest required resolution and frame rate.
2. Opt for HDMI 2.0 or higher for the best 4K compatibility.
3. Ensure the splitter supports the necessary bandwidth for your content.
4. Verify HDR and HDCP compatibility if needed.

By carefully considering these factors, you can select an HDMI splitter with pass-through that maintains the quality of your 4K content while allowing you to share it across multiple displays or capture devices.
