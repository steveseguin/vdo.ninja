---
description: Fix black screen problems when screen sharing with VDO.Ninja, OBS, Chrome, DRM-protected apps, and hardware acceleration conflicts.
---

# Screen-share is just a black video

If your VDO.Ninja screen share is black in the local preview, in OBS, or for remote viewers, the most common causes are browser hardware acceleration conflicts, unsupported capture mode choices, or DRM and HDCP-protected content such as Netflix or Prime Video.

<figure><img src="../.gitbook/assets/image (35).png" alt=""><figcaption><p>Google Chrome's HWA setting</p></figcaption></figure>

If the video preview when screen sharing is black, try disabling or enabling the browser's hardware acceleration. This can be found in the Google settings -> system menu.

If sharing a Netflix, Prime Video, or other content that is protected by content-protection, such as DRM/HDCP, the screen share may be black also. You can try screen sharing using the window, display, or tab methods to see if one works where the others fail, or you can try display grabbing with OBS Studio instead, but VDO.Ninja itself doesn't offer methods intended to bypass content copy protection.
