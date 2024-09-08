---
description: >-
  WebRTC/P2P connections may not work always in OBS Studio, perhaps due to
  firewalls.
---

# Enabling WebRTC Sources in OBS

This guide will help you troubleshoot and resolve issues with WebRTC/P2P-based browser sources in OBS (Open Broadcaster Software). We'll cover several methods that can ensure these sources work properly, assuming the sources work fine in a normal browser already, and just fail within OBS.

Often the issues with VDO.NInja or Social Stream Ninja not appearing in OBS are not firewall related, but rather glitches in the matrix, so we'll cover a few common solutions there also.

### Method 1: Adding OBS to Windows Firewall

1. Open the Windows Control Panel.
2. Navigate to "System and Security" > "Windows Defender Firewall".
3. Click on "Allow an app or feature through Windows Defender Firewall" on the left side.
4. Click the "Change settings" button.
5. Click "Allow another app..."
6. Browse to the OBS installation directory (usually `C:\Program Files\obs-studio\bin\64bit`) and select `obs64.exe`.
7. Click "Add" and ensure both "Private" and "Public" checkboxes are ticked for OBS.
8. Click "OK" to save the changes.

### Method 2: Running OBS as Administrator

1. Right-click on the OBS shortcut or executable.
2. Select "Run as administrator".
3. If prompted, click "Yes" to allow the app to make changes.

To always run OBS as administrator:

1. Right-click on the OBS shortcut or executable.
2. Select "Properties".
3. Go to the "Compatibility" tab.
4. Check the box next to "Run this program as an administrator".
5. Click "Apply" and then "OK".

### Method 3: Use Electron Capture app instead

1. You can use the [Electron Capture app](https://docs.vdo.ninja/steves-helper-apps/electron-capture) instead of the OBS Browser source
2. Window capture the Electron Capture output into OBS instead.
3. You can window-capture the audio via OBS or with a virtual audio cable.

### Method 4: Disable hardware acceleration and check settings

1. Try to disable hardware acceleration for browser sources in the OBS settings

You may need to scroll down in the browser source settings to find the follow.

1. Make sure "Shutdown source when not visible" is NOT checked in the browser source settings.
2. Make sure "Refresh browser when scene becomes active" is NOT checked in the browser source settings.
3. Clear the browser cache in the OBS Browser source using the "Refresh cache of current page" button.

### Method 5: Allowing OBS Through Third-Party Firewall Software

If you're using third-party firewall software:

1. Open your firewall software's settings.
2. Look for an option to allow applications through the firewall.
3. Add OBS (`obs64.exe`) to the list of allowed applications.
4. Ensure OBS has permissions for both incoming and outgoing connections.

### Troubleshooting Tips

* Clear browser cache: As already mentioned, in OBS, right-click on the browser source, select "Properties", then click "Refresh cache of current page".
* Test in different browsers: If a WebRTC source works in Chrome but not in OBS, try using a different browser like Firefox or Edge to isolate the issue.
* Check network settings: Ensure your network allows WebRTC connections and that no VPN or proxy is interfering.
* Disable hardware acceleration: As already mentioned, in OBS settings, go to "Advanced" and uncheck "Enable browser source hardware acceleration".
* Update OBS Studio: Certain versions of OBS may have issues with browser sources. Fully uninstall OBS Studio and then update with a recent stable version.
* Check your links: Sometimes you have an old link in OBS, one that might contain an invalid password, stream ID, or session value. Delete the old browser source, make a new one, and use a freshly obtained link to ensure you haven't made a simple oversight.

If you're still experiencing issues after trying these methods, consider reaching out to the OBS community forums or support channels for further assistance.
