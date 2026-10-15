---
description: Use a VDO.Ninja camera in Zoom, Google Meet, Teams, or another video app through OBS Virtual Camera.
---

# How to use VDO.Ninja as a webcam for Zoom, Google Meet, Teams, and more

Bring a phone or remote camera into **OBS**, then select **OBS Virtual Camera** in your video-call app. Audio uses a separate microphone or virtual audio cable.

Install [OBS Studio](https://obsproject.com/download) on the computer running the call. The audio example below uses Windows and [VB-CABLE](https://vb-audio.com/Cable/); see [macOS audio options](../platform-specific-issues/macos.md#capturing-audio) for Mac.

## 1. Connect the phone or remote camera

At [VDO.Ninja](https://vdo.ninja/), click **Create Reusable Invite → GENERATE THE INVITE LINK**.

<figure><img src="../.gitbook/assets/obs-audio-guides/vdo-invite-links.png" alt="VDO.Ninja generated Guest Invite Link and QR code above the matching OBS Browser Source Link" width="440"><figcaption><p>Open your own Guest Invite Link on the camera device. Copy the matching OBS Browser Source Link to OBS.</p></figcaption></figure>

On the phone or guest's computer, open the invite or scan its QR code, choose the camera and microphone, and click **START**. Keep that page open.

## 2. Bring the camera into OBS

In OBS's **Sources** dock, click **+ → Browser**. Paste the **OBS Browser Source Link** into **URL** and check **Control audio via OBS**.

<figure><img src="../.gitbook/assets/obs-audio-guides/obs-receive-audio.png" alt="OBS Browser Source settings showing the view URL, browser dimensions, and Control audio via OBS checked"><figcaption><p>Use your own view link. Set Width and Height to your intended canvas, such as 1920 × 1080.</p></figcaption></figure>

Click **OK**. Right-click the source and choose **Transform → Fit to Screen** if needed.

## 3. Start OBS Virtual Camera

Click **Start Virtual Camera** in the **Controls** dock.

<figure><img src="../.gitbook/assets/obs-audio-guides/start-virtual-camera.png" alt="OBS Controls dock with Start Virtual Camera highlighted" width="330"><figcaption><p>The current OBS Program picture becomes a camera device. Image: <a href="https://obsproject.com/kb/virtual-camera-guide">OBS Project</a>.</p></figcaption></figure>

In Zoom, Meet, Teams, or your other call app, open its camera settings and select **OBS Virtual Camera**. Use your normal microphone if you only need the remote picture.

## 4. Optional: send the remote audio too

Virtual Camera carries video only. To send OBS sound, install VB-CABLE and set **OBS Settings → Audio → Advanced → Monitoring Device** to **CABLE Input**.

<figure><img src="../.gitbook/assets/obs-audio-guides/monitoring-device.png" alt="OBS Audio settings with CABLE Input as the Monitoring Device"><figcaption><p>Use CABLE Input in OBS, then CABLE Output as the microphone in the call app.</p></figcaption></figure>

Right-click **Audio Mixer → Advanced Audio Properties** and enable monitoring for the incoming Browser Source. Choose **Monitoring Enabled** in OBS 32.2, or **Monitor and Output** in older versions.

Select **CABLE Output** as the call app's microphone. If you also need your local microphone, add it to OBS and enable its monitoring too.

Keep the call's return audio out of the monitored mix so callers do not hear themselves. Wear headphones and check the sound with another participant.

## Quick fixes

| Problem | What to do |
| --- | --- |
| Camera is missing | Start Virtual Camera, then reopen the call app. On Mac, check the [camera extension](../common-errors-and-known-issues/virtual-camera-not-working-on-mac.md). |
| Picture works but sound is missing | Select CABLE Output as the call's microphone and enable monitoring for the OBS audio source. |
| Callers hear themselves | Stop monitoring the call's return audio into the cable. |
| Wrong OBS scene appears | Use the gear beside Start Virtual Camera to choose [Program or a fixed scene](share-obs-virtual-camera-and-audio.md#2-choose-what-virtual-camera-shows). |

For a webcam already open in another app, see [Camera already in use](../common-errors-and-known-issues/cant-load-camera-both-in-obs-and-vdon.md).
