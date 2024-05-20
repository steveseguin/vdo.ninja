---
description: My camera isn't appearing in Chrome on macOS anymore. why?
---

# Camera on macOS doesn't show?

If your camera isn't appearing in Chrome on macOS, there are several possible reasons and solutions you can try:

#### 1. Check Camera Permissions

Ensure that Chrome has permission to access the camera:

* Open **System Preferences** > **Security & Privacy** > **Privacy**.
* Select **Camera** from the left-hand menu.
* Ensure that **Google Chrome** is checked.

#### 2. Update Chrome

Make sure you're using the latest version of Chrome:

* Open Chrome and go to **Settings** > **About Chrome**.
* Chrome will automatically check for updates and install them if available.

#### 3. Check Site Permissions

Verify that the website has permission to use your camera:

* Open the website where you are trying to use the camera.
* Click the **lock icon** in the address bar.
* Ensure that **Camera, and also the microphone if needed,** is set to **Allow**.

#### 4. Restart Chrome

Sometimes, a simple restart of Chrome can resolve the issue:

* Close Chrome completely.
* Open Chrome again and check if the camera works.
* Or just restart the computer to ensure Chrome has completely been restarted

#### 5. Check for Conflicting Applications

Ensure no other application is using the camera:

* Close any other applications that might be using the camera (e.g., Zoom, Skype, Discord).
* A camera can only be used by one application at a time, so closing other applications may help

#### 6. Reset Chrome Settings

Resetting Chrome settings can help resolve the issue if it's due to a misconfiguration:

* Open **Settings** > **Advanced** > **Reset settings**.
* Click **Restore settings to their original defaults** and confirm.

#### 7. Test Camera in Another App

Verify that your camera works with other applications:

* Open an application like **Photo Booth** or **Facetime** and check if the camera works.

#### 8. Reinstall Chrome

If the above steps don't work, try reinstalling Chrome:

* Uninstall Chrome from your Mac.
* Download the latest version from Google Chrome's website and reinstall it.

#### 9. Check macOS Updates

Ensure your macOS is up to date:

* Open **System Preferences** > **Software Update**.
* Install any available updates.

#### 10. Hardware Issues

If the camera still doesn't appear, there might be a hardware issue:

* Try connecting an external webcam if you have one.
* If the external camera works, it may indicate an issue with the built-in camera.
* Try plugging the camera into another USB port or such
* Make sure any HDMI adapter has an input that's compatible with the browser, so 8-bit, 30 or 60-fps, and not requiring special drivers to use

#### 11. Browser Extensions

Disable any browser extensions that might be interfering with the camera:

* Go to **chrome://extensions/** and disable extensions one by one to identify if any of them are causing the issue.

#### 12. Try another browser instead

Firefox or Safari or another Chromium-based browser might work, if Chrome does not.

#### 13. Use a virtual camera as an adapter

If your camera works with OBS, perhaps use that to load the camera and then use the OBS Virtual Camera as the camera source.

* Some cameras are only compatible with OBS, and may not work with the browser

#### 14. Some virtual camera drivers on macOS are limited to 1080p30

Many virtual camera drivers on macOS are limited to 1080p30, and in fact, may only work at that specific resolution. If using a virtual camera or a pass-thru camera source, make sure it's outputting 8-bit 1080p 30fps video, to ensure maximum compatibility.

* Vertical or portrait modes are often not supported by virtual camera drivers on macOS
* Chrome and most browsers do not support higher than 60-fps, nor h264-based video devices

#### 15. Try on a Windows PC or an iOS 17 device that has USB 3.0

While a last resort, changing host hardware may work. Windows is popular with live streaming applications due to greater software and hardware compatibly, and if compelled to keep in the Apple ecosystem, you may find your device works with newer iPhones / iPads, which have a USB 3.0 port.



