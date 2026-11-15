---
description: Use your phone camera in OBS, then send that picture to Zoom, Meet, or Teams.
---

# Use a mobile phone as a webcam with VDO.Ninja

Use your phone as the camera for OBS on a Windows, Mac, or Linux computer. You can then send the OBS picture to Zoom, Google Meet, or Teams.

**You need:** a phone with the [VDO.Ninja app](../steves-helper-apps/native-mobile-app.md), a computer with [OBS Studio](https://obsproject.com/), and an Internet connection on both.

## 1. Start the camera on your phone

1. Open the VDO.Ninja app and choose **BACK CAMERA** or **FRONT CAMERA**.
2. For a first try, leave **Stream ID**, **Room name**, and **Password** blank. Select your microphone.
3. Tap **START STREAM** (**CONNECT** in older versions) and allow camera and microphone access.
4. Copy the **Viewer Link** shown by the app and send it to your computer. If it is hidden, open the information button (**Info & Tips**) and tap **Copy Link**.

You should see your camera preview on the phone. Keep the app running.

Without installing the app, you can also open [VDO.Ninja in the phone browser](https://vdo.ninja/?push), allow access, and start the camera.

## 2. Add the picture to OBS on your computer

1. In OBS, select the scene you want to use.
2. Under **Sources**, select **+ > Browser**. Name it `Phone camera` and select **OK**.
3. Paste the phone's viewer link into **URL**.
4. Enable **Control audio via OBS** and select **OK**.
5. Right-click the source in the preview and choose **Transform > Fit to Screen**.

<figure><img src="../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1).png" alt="OBS Browser Source properties with Control audio via OBS highlighted" width="440"><figcaption><p>Paste the viewer link into URL and enable Control audio via OBS.</p></figcaption></figure>

**Check:** move in front of the phone and speak. The OBS picture should move and its audio meter should respond. If you only need the phone in OBS, you are done.

## 3. Use it in Zoom, Meet, or Teams

1. In OBS, select **Start Virtual Camera** in the **Controls** panel.
2. In your call app's camera settings, choose **OBS Virtual Camera**.
3. Check the call app's preview before joining the call.

OBS Virtual Camera sends video. For the simplest audio setup, keep your usual computer microphone selected in the call app. To use the phone's audio instead, follow the [audio-routing guide](../guides/use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md).

## If something is missing

* **No picture in OBS:** open the same viewer link in a computer browser. Confirm the phone is still streaming and that you copied its viewer link.
* **OBS works, but the call app is blank:** start OBS Virtual Camera, then select it again in the call app.
* **No sound in the call:** choose a microphone in the call app. The virtual camera does not carry OBS audio.

For longer events, see [Stream sports and events from a phone](../guides/streaming-sports-and-events.md). For OBS's camera output choices, see its [Virtual Camera guide](https://obsproject.com/kb/virtual-camera-guide).
